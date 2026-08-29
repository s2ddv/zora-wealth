use std::sync::Arc;

use sqlx::{Pool, Postgres};

#[derive(Clone)]
pub struct AppState {
    pub db: Option<Pool<Postgres>>,
    pub redis: Option<redis::Client>,
}

impl AppState {
    pub async fn new(database_url: &str, redis_url: &str) -> Self {
        let db = sqlx::postgres::PgPoolOptions::new()
            .max_connections(10)
            .connect(database_url)
            .await
            .ok();

        let redis = redis::Client::open(redis_url)
            .ok();

        Self {
            db: db.map(Arc::new).map(|pool| pool as Pool<Postgres>),
            redis,
        }
    }
}
