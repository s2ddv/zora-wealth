mod config;
mod routes;
mod state;

use axum::{http::Method, Router};
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();

    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let config = config::AppConfig::from_env();
    let state = state::AppState::new(&config.database_url, &config.redis_url).await;

    let cors = CorsLayer::new()
        .allow_origin(config.web_origin.parse()?)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::PATCH])
        .allow_headers(Any)
        .allow_credentials(true);

    let app = Router::new()
        .nest("/v1", routes::router())
        .with_state(state)
        .layer(cors);

    let addr = format!("{}:{}", config.host, config.port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;

    tracing::info!("Servidor Rust iniciado em http://{}", addr);
    axum::serve(listener, app).await?;

    Ok(())
}
