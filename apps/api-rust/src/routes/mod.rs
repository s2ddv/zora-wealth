pub mod health;
pub mod market;
pub mod me;
pub mod wallet;

use axum::Router;
use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .merge(health::router())
        .merge(wallet::router())
        .merge(market::router())
        .merge(me::router())
}
