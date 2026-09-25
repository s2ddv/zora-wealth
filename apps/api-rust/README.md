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
