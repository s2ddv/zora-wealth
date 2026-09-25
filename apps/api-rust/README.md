# Zora Wealth Rust API

Replacement backend, running beside Fastify until the final cutover. Fastify and
`apps/web` are unchanged. Default Rust port: **3334**, legacy: **3333**.

## Architecture

- `zora-domain`: entities and repository ports; no infrastructure dependencies.
- `zora-application`: user use cases; depends only on domain.
- `zora-infrastructure`: Postgres/SQLx, Redis pool and Supabase JWT adapters.
- `zora-api`: Axum HTTP boundary, dependency injection and composition.

Use Rust 1.94 or newer. Dependency versions were checked against the crates.io
registry. SQLx 0.9 removed `runtime-tokio-rustls`; the equivalent features are
`runtime-tokio` and `tls-rustls-ring`, alongside `postgres` and `macros`.

## Run

From this directory:

```sh
cp .env.example .env
cargo run -p zora-api --bin zora-api
```

Or, from the repository root, using the existing Postgres/Redis services:

```sh
docker compose -f docker-compose.yml -f apps/api-rust/compose.yml up --build api-rust
```

Use direct Postgres port **5432**. Supavisor port **6543** is rejected at startup.
The compose override does not change the legacy service configuration. Configure
authentication values in `apps/api-rust/.env`; never bake secrets into the image.

## Route contract audit

Sources: `apps/api/src/server.ts`, `plugins/auth.ts`, `lib/dev-auth.ts`,
`repositories/user.repository.ts`, `modules/me/me.routes.ts` and
`modules/health/health.routes.ts`.

Fastify has **no user/profile HTTP endpoint**. No `/v1/me` or `/users` route is
introduced. The user domain supports authentication internally, for the next
wallet stage. Existing wallet/watchlist/snapshot/market routes are not yet
implemented in Rust; do not cut over the frontend at this stage.

`GET /v1/health` and `/v1/health/` preserve the legacy JSON:
`status`, `service: "zora-wealth-api"`, millisecond UTC `timestamp`, and
`checks: { database, redis }`. Degraded health still returns HTTP 200, as in
Fastify. `GET /health` is the requested additional alias. Container readiness
checks the body's status, not just HTTP 200. Dependency probes time out after
five seconds.

## Next domains

Implement wallet → watchlist → wallet-asset → portfolio-snapshot →
exchange-connection. Compose their repositories/services in the API entrypoint
and consume the shared authenticated-user extractor in protected handlers.
Never add transaction signing to the backend; signing remains client-side.

## User and authentication

The entity mirrors `packages/database/prisma/schema.prisma`, including required
`authId`, nullable `name`, TEXT ids and millisecond timestamps. The repository
implements lookup, creation, partial update (including explicit name clearing)
and an atomic authentication upsert. Authentication updates email only, keeping
the existing local id and profile name. An absent email becomes
`user-{authId}@supabase.local`, matching Fastify. Relation queries will be added
with their respective domains; there is no profile route requiring them now.

Set the same `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as Fastify. For legacy
HS256 projects, also set `SUPABASE_JWT_SECRET` from that Supabase project. For
asymmetric signing, JWKS defaults to `/auth/v1/.well-known/jwks.json`; an explicit
`SUPABASE_JWKS_URL` overrides it. Supported algorithms: HS256, RS256 and ES256.
Signature, expiry, issuer, audience (`authenticated`) and subject are checked.
JWKS is cached for five minutes; unknown key ids can trigger a refresh at most
once every 30 seconds. Upstream requests have a five-second timeout.

After local verification, `/auth/v1/user` is still consulted, as in Fastify's
`auth.getUser(token)`, before synchronizing the current email. The service role
key is only an upstream credential, never treated as a user JWT signing secret.
The extractor inserts `AuthenticatedUser` into request extensions and returns
the legacy 401 JSON errors. With Supabase configured, invalid tokens never fall
back to a development user. Missing tokens can use `DEV_USER_ID` outside production.
When Supabase is absent in development, `X-User-Id` and `DEV_USER_ID` preserve the
legacy fallback. **Production fails startup without Supabase configuration**;
this deliberately prevents Fastify's missing-configuration auth bypass.

`garde` is available for the next domain's request validation. No invented user
payload or HTTP validation contract is added in this stage.

## Build and verify

Run inside `apps/api-rust` so Cargo reads `.cargo/config.toml`:

```sh
cargo build --workspace --locked
cargo clippy --workspace --all-targets --locked -- -D warnings
cargo test --workspace --locked
cargo fmt --all -- --check
cargo run -p zora-api --bin export-types
```

Type generation writes `packages/shared/src/generated/rust/UserDto.ts`. It does
not replace existing shared exports or require frontend changes. The DTO uses
camelCase keys and UTC timestamps matching Prisma serialization. Test fixture
private keys are intentionally public, test-only credentials.

SQLx queries use `query_as!` and committed `.sqlx` metadata, generated against an
isolated Postgres database initialized from the **current Prisma schema**. No
live database or credentials are required for normal builds or Docker builds.
Do not use the historical Prisma migrations to regenerate this cache: they do
not represent the current schema completely. To refresh, initialize a disposable
Postgres with the existing Prisma schema (`prisma db push --skip-generate`), then:

```sh
# DATABASE_URL must point to that disposable database, never production.
cargo clean -p zora-infrastructure
SQLX_OFFLINE=false SQLX_OFFLINE_DIR="$PWD/.sqlx" cargo build --workspace
TEST_DATABASE_URL="$DATABASE_URL" cargo test -p zora-infrastructure --test user_repository -- --ignored
```

The integration test exercises creation, TEXT ids, nullable updates, uniqueness,
email fallback and concurrent first-login upserts. It only deletes its own test
users. Normal tests exercise HS256/ES256, JWKS, invalid claims and legacy auth
errors against a local mock Supabase server.
