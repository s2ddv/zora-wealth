use std::{env, sync::Arc};
use anyhow::Context;
use axum::http::{HeaderValue, Method};
use tower_http::{cors::{AllowHeaders, CorsLayer}, trace::TraceLayer};
use tracing_subscriber::EnvFilter;
use zora_api::{HealthState, health_router};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt().with_env_filter(
        EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into())).init();
    let database_url = env::var("DATABASE_URL").context("DATABASE_URL is required")?;
    let redis_url = env::var("REDIS_URL").context("REDIS_URL is required")?;
    let dependencies = Arc::new(infrastructure::HealthDependencies::new(&database_url, &redis_url)?);
    let origin: HeaderValue = env::var("WEB_ORIGIN").unwrap_or_else(|_| "http://localhost:3000".into()).parse()?;
    let app = health_router(HealthState { dependencies })
        .layer(CorsLayer::new().allow_origin(origin).allow_credentials(true)
            .allow_headers(AllowHeaders::mirror_request())
            .allow_methods([Method::GET, Method::HEAD, Method::POST, Method::PUT, Method::PATCH, Method::DELETE]))
        .layer(TraceLayer::new_for_http());
    let port = env::var("PORT").unwrap_or_else(|_| "3334".into()).parse::<u16>()?;
    let host = env::var("HOST").unwrap_or_else(|_| "0.0.0.0".into());
    let listener = tokio::net::TcpListener::bind((host.as_str(), port)).await?;
    tracing::info!(%host, port, "Zora Rust API listening");
    axum::serve(listener, app).with_graceful_shutdown(shutdown()).await?;
    Ok(())
}
async fn shutdown() {
    let mut terminate = tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
        .expect("install SIGTERM handler");
    tokio::select! { _ = tokio::signal::ctrl_c() => {}, _ = terminate.recv() => {} }
}
