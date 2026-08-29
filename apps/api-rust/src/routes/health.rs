use axum::{extract::State, routing::get, Json, Router};
use chrono::Utc;
use serde::Serialize;

use crate::state::AppState;

#[derive(Serialize)]
pub struct HealthResponse {
    status: String,
    service: &'static str,
    timestamp: String,
    checks: Checks,
}

#[derive(Serialize)]
pub struct Checks {
    database: &'static str,
    redis: &'static str,
}

pub async fn health_handler(State(state): State<AppState>) -> Json<HealthResponse> {
    let database = match &state.db {
        Some(pool) => match sqlx::query_scalar::<_, i32>("SELECT 1").fetch_one(pool).await {
            Ok(_) => "ok",
            Err(err) => {
                tracing::warn!(error = %err, "Database health check failed");
                "error"
            }
        },
        None => "error",
    };

    let redis = match &state.redis {
        Some(client) => match client.get_async_connection().await {
            Ok(mut conn) => match redis::cmd("PING").query_async::<_, String>(&mut conn).await {
                Ok(value) if value == "PONG" => "ok",
                _ => "error",
            },
            Err(err) => {
                tracing::warn!(error = %err, "Redis health check failed");
                "error"
            }
        },
        None => "error",
    };

    let healthy = database == "ok" && redis == "ok";

    Json(HealthResponse {
        status: if healthy { "ok".to_string() } else { "degraded".to_string() },
        service: "zora-api-rust",
        timestamp: Utc::now().to_rfc3339(),
        checks: Checks { database, redis },
    })
}

pub fn router() -> Router<AppState> {
    Router::new().route("/health", get(health_handler))
}
