//! User DTO for generated TypeScript. No new profile endpoint is introduced.
use chrono::SecondsFormat;
use domain::User;
use serde::Serialize;
use ts_rs::TS;

#[derive(Debug, Serialize, TS)]
#[serde(rename_all = "camelCase")]
pub struct UserDto {
    pub id: String,
    pub email: String,
    pub name: Option<String>,
    pub auth_id: String,
    pub created_at: String,
    pub updated_at: String,
}
impl From<User> for UserDto {
    fn from(user: User) -> Self {
        Self {
            id: user.id,
            email: user.email,
            name: user.name,
            auth_id: user.auth_id,
            created_at: user
                .created_at
                .and_utc()
                .to_rfc3339_opts(SecondsFormat::Millis, true),
            updated_at: user
                .updated_at
                .and_utc()
                .to_rfc3339_opts(SecondsFormat::Millis, true),
        }
    }
}
