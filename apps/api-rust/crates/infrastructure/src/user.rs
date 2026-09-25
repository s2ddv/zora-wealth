use chrono::NaiveDateTime;
use domain::{
    AuthIdentity, NewUser, RepositoryError, RepositoryFuture, User, UserRepository, UserUpdate,
};
use sqlx::PgPool;

#[derive(Clone)]
pub struct SqlxUserRepository {
    pool: PgPool,
}
impl SqlxUserRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}
struct UserRow {
    id: String,
    email: String,
    name: Option<String>,
    auth_id: String,
    created_at: NaiveDateTime,
    updated_at: NaiveDateTime,
}
impl From<UserRow> for User {
    fn from(row: UserRow) -> Self {
        Self {
            id: row.id,
            email: row.email,
            name: row.name,
            auth_id: row.auth_id,
            created_at: row.created_at,
            updated_at: row.updated_at,
        }
    }
}
fn repository_error(error: sqlx::Error) -> RepositoryError {
    if error
        .as_database_error()
        .is_some_and(|e| e.is_unique_violation())
    {
        RepositoryError::Conflict
    } else {
        RepositoryError::Unavailable(Box::new(error))
    }
}
impl UserRepository for SqlxUserRepository {
    fn find_by_id<'a>(&'a self, id: &'a str) -> RepositoryFuture<'a, Option<User>> {
        Box::pin(async move {
            sqlx::query_as!(UserRow,
                r#"SELECT id, email, name, "authId" AS auth_id, "createdAt" AS created_at, "updatedAt" AS updated_at FROM users WHERE id = $1"#, id)
                .fetch_optional(&self.pool).await.map(|row| row.map(Into::into)).map_err(repository_error)
        })
    }
    fn find_by_email<'a>(&'a self, email: &'a str) -> RepositoryFuture<'a, Option<User>> {
        Box::pin(async move {
            sqlx::query_as!(UserRow,
                r#"SELECT id, email, name, "authId" AS auth_id, "createdAt" AS created_at, "updatedAt" AS updated_at FROM users WHERE email = $1"#, email)
                .fetch_optional(&self.pool).await.map(|row| row.map(Into::into)).map_err(repository_error)
        })
    }
    fn create(&self, user: NewUser) -> RepositoryFuture<'_, User> {
        Box::pin(async move {
            let id = user.id.unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
            sqlx::query_as!(UserRow,
                r#"INSERT INTO users (id, email, name, "authId", "createdAt", "updatedAt")
                   VALUES ($1, $2, $3, $4, timezone('UTC', now()), timezone('UTC', now()))
                   RETURNING id, email, name, "authId" AS auth_id, "createdAt" AS created_at, "updatedAt" AS updated_at"#,
                id, user.email, user.name, user.auth_id)
                .fetch_one(&self.pool).await.map(Into::into).map_err(repository_error)
        })
    }
    fn update<'a>(&'a self, id: &'a str, update: UserUpdate) -> RepositoryFuture<'a, Option<User>> {
        Box::pin(async move {
            let change_name = update.name.is_some();
            let name = update.name.flatten();
            sqlx::query_as!(UserRow,
                r#"UPDATE users SET email = COALESCE($2, email), name = CASE WHEN $3 THEN $4 ELSE name END,
                   "updatedAt" = timezone('UTC', now()) WHERE id = $1
                   RETURNING id, email, name, "authId" AS auth_id, "createdAt" AS created_at, "updatedAt" AS updated_at"#,
                id, update.email, change_name, name)
                .fetch_optional(&self.pool).await.map(|row| row.map(Into::into)).map_err(repository_error)
        })
    }
    fn upsert_identity(&self, identity: AuthIdentity) -> RepositoryFuture<'_, User> {
        Box::pin(async move {
            let id = uuid::Uuid::new_v4().to_string();
            // Atomic conflict handling prevents duplicate users on concurrent first requests.
            // Existing profile name and local id are preserved, as in plugins/auth.ts.
            sqlx::query_as!(UserRow,
                r#"INSERT INTO users (id, email, "authId", "createdAt", "updatedAt")
                   VALUES ($1, $2, $3, timezone('UTC', now()), timezone('UTC', now()))
                   ON CONFLICT ("authId") DO UPDATE SET email = EXCLUDED.email, "updatedAt" = timezone('UTC', now())
                   RETURNING id, email, name, "authId" AS auth_id, "createdAt" AS created_at, "updatedAt" AS updated_at"#,
                id, identity.email, identity.auth_id)
                .fetch_one(&self.pool).await.map(Into::into).map_err(repository_error)
        })
    }
}
