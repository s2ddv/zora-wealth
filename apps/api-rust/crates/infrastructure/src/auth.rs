//! Supabase verification, isolated from business use cases.
use anyhow::{Context, ensure};
use domain::AuthIdentity;
use jsonwebtoken::{Algorithm, DecodingKey, Validation, decode, decode_header, jwk::JwkSet};
use serde::Deserialize;
use std::{
    sync::Arc,
    time::{Duration, Instant},
};
use tokio::sync::Mutex;

#[derive(Clone)]
pub struct SupabaseAuth {
    client: reqwest::Client,
    issuer: String,
    jwks_url: String,
    secret: Option<Arc<DecodingKey>>,
    service_key: Option<String>,
    cache: Arc<Mutex<Option<CachedKeys>>>,
}
struct CachedKeys {
    fetched_at: Instant,
    keys: JwkSet,
}
#[derive(Debug)]
pub enum AuthError {
    InvalidToken,
    Unavailable,
}
#[derive(Clone, Deserialize)]
struct Claims {
    sub: String,
}
#[derive(Deserialize)]
struct SupabaseUser {
    id: String,
    email: Option<String>,
}

impl SupabaseAuth {
    pub fn new(
        url: &str,
        secret: Option<String>,
        jwks_url: Option<String>,
        service_key: Option<String>,
    ) -> anyhow::Result<Self> {
        let url = url.trim_end_matches('/');
        let parsed = url::Url::parse(url).context("Invalid SUPABASE_URL")?;
        ensure!(
            matches!(parsed.scheme(), "http" | "https"),
            "Unsupported Supabase URL scheme"
        );
        let jwks_url = jwks_url.unwrap_or_else(|| format!("{url}/auth/v1/.well-known/jwks.json"));
        let jwks = url::Url::parse(&jwks_url).context("Invalid SUPABASE_JWKS_URL")?;
        ensure!(
            matches!(jwks.scheme(), "http" | "https"),
            "Unsupported JWKS URL scheme"
        );
        Ok(Self {
            client: reqwest::Client::builder()
                .timeout(Duration::from_secs(5))
                .build()?,
            issuer: format!("{url}/auth/v1"),
            jwks_url,
            secret: secret
                .filter(|s| !s.is_empty())
                .map(|s| Arc::new(DecodingKey::from_secret(s.as_bytes()))),
            service_key: service_key.filter(|s| !s.is_empty()),
            cache: Arc::new(Mutex::new(None)),
        })
    }

    pub async fn verify(&self, token: &str) -> Result<AuthIdentity, AuthError> {
        let header = decode_header(token).map_err(|_| AuthError::InvalidToken)?;
        let key = match header.alg {
            Algorithm::HS256 => self.secret.clone().ok_or(AuthError::InvalidToken)?,
            Algorithm::RS256 | Algorithm::ES256 => {
                let kid = header
                    .kid
                    .as_deref()
                    .filter(|k| !k.is_empty())
                    .ok_or(AuthError::InvalidToken)?;
                Arc::new(self.jwks_key(kid, header.alg).await?)
            }
            _ => return Err(AuthError::InvalidToken),
        };
        let mut validation = Validation::new(header.alg);
        validation.set_issuer(&[&self.issuer]);
        validation.set_audience(&["authenticated"]);
        validation.set_required_spec_claims(&["exp", "sub", "iss", "aud"]);
        validation.validate_nbf = true;
        validation.leeway = 0;
        let claims = decode::<Claims>(token, &key, &validation)
            .map_err(|_| AuthError::InvalidToken)?
            .claims;
        if claims.sub.is_empty() {
            return Err(AuthError::InvalidToken);
        }
        // Fastify calls auth.getUser on every token request. Preserve rejection
        // of deleted users and use the current email instead of a stale JWT claim.
        let service_key = self.service_key.as_ref().ok_or(AuthError::Unavailable)?;
        let response = self
            .client
            .get(format!("{}/user", self.issuer))
            .header("apikey", service_key)
            .bearer_auth(token)
            .send()
            .await
            .map_err(|_| AuthError::Unavailable)?;
        if response.status().is_client_error() {
            return Err(AuthError::InvalidToken);
        }
        let user = response
            .error_for_status()
            .map_err(|_| AuthError::Unavailable)?
            .json::<SupabaseUser>()
            .await
            .map_err(|_| AuthError::Unavailable)?;
        if user.id != claims.sub {
            return Err(AuthError::InvalidToken);
        }
        Ok(AuthIdentity {
            auth_id: user.id,
            email: user.email,
        })
    }

    async fn jwks_key(&self, kid: &str, algorithm: Algorithm) -> Result<DecodingKey, AuthError> {
        let mut cache = self.cache.lock().await;
        let refresh = cache.as_ref().is_none_or(|cached| {
            cached.fetched_at.elapsed() >= Duration::from_secs(300)
                || (cached.keys.find(kid).is_none()
                    && cached.fetched_at.elapsed() >= Duration::from_secs(30))
        });
        if refresh {
            let keys = self
                .client
                .get(&self.jwks_url)
                .send()
                .await
                .map_err(|_| AuthError::Unavailable)?
                .error_for_status()
                .map_err(|_| AuthError::Unavailable)?
                .json::<JwkSet>()
                .await
                .map_err(|_| AuthError::Unavailable)?;
            *cache = Some(CachedKeys {
                fetched_at: Instant::now(),
                keys,
            });
        }
        let jwk = cache
            .as_ref()
            .and_then(|cached| cached.keys.find(kid))
            .ok_or(AuthError::InvalidToken)?;
        if let Some(key_algorithm) = &jwk.common.key_algorithm
            && key_algorithm.to_string() != format!("{algorithm:?}")
        {
            return Err(AuthError::InvalidToken);
        }
        DecodingKey::from_jwk(jwk).map_err(|_| AuthError::InvalidToken)
    }
}
