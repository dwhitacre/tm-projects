# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for Trackmania-related projects, containing APIs, web applications, Openplanet plugins, and database schemas. The stack uses Bun as the runtime/package manager, TypeScript for all code, and PostgreSQL for persistence.

## Project Structure

- `apis/` - Backend APIs built with Bun + TypeScript
  - `hds-tm-events/` - Holy Dynasty Events API
  - `openplanet-snake/` - Snake game API for Openplanet
  - `tm-api/` - General Trackmania API
  - `tm-medals/` - Medals tracking API
- `apps/` - Frontend applications
  - `hds-tm-events/` - Angular app using Nx
- `shared/` - Shared TypeScript code used across APIs
  - `clients/` - API client implementations
  - `domain/` - Shared domain types and models
  - `repositories/` - Database repository patterns
  - `services/` - Shared business logic
- `plugins/` - Openplanet plugins (Angelscript)
  - `hds-bounty/`, `player-medals/`, `snake/` - Various Trackmania plugins
  - `.bin/` - Build scripts for plugins
- `dbs/` - Database schemas and migrations (numbered SQL files)
  - `init-user-db.sh` - Creates PostgreSQL databases and users
  - Each service has its own database with numbered migration files (e.g., `001_create_table.sql`)
- `sims/` - Mockoon API simulators for external services
- `charts/` - Helm charts for Kubernetes deployments
- `tests/` - Integration tests organized by service

## Common Development Commands

### Local Development

Start all services locally using process-compose:
```bash
process-compose up
```

This starts:
- All APIs in watch mode
- The Angular app dev server
- PostgreSQL database (via Docker)
- Mock API simulators
- Plugin build watchers

### Running Individual Services

**APIs (from api directory):**
```bash
bun run watch          # Run with hot reload
bun run start          # Run without hot reload
bun test               # Run tests in watch mode
bun test:ci            # Run tests once (for CI)
```

**Frontend app (from apps/hds-tm-events):**
```bash
nx serve --port 8000   # Start dev server
nx build               # Build for production
nx test                # Run tests
nx lint                # Run linter
nx format:check        # Check formatting
nx format --all        # Format all files
```

### Testing

Run tests for specific services:
```bash
bun test:shared                # Test shared code
bun test:hds-tm-events         # Test hds-tm-events API
bun test:openplanet-snake      # Test openplanet-snake API
bun test:tm-api                # Test tm-api API
bun test:tm-medals             # Test tm-medals API
```

### Plugins

Build plugins for Openplanet (from `plugins/` directory):
```bash
# Build once
bash .bin/build.sh -p <plugin-name>

# Build with watch mode
bash .bin/build.sh -w -p <plugin-name>

# Build with shared files
bash .bin/build.sh -w -s -p <plugin-name>
```

Plugin names: `hds-bounty`, `player-medals`, `snake`

### Docker

Run the full stack via Docker Compose:
```bash
docker compose up              # Start all services
docker compose up dbs          # Start only database
docker compose up <service>    # Start specific service
```

Services run on these ports:
- `hds-tm-events-app`: 8000 (Angular frontend)
- `hds-tm-events-api`: 8081
- `openplanet-snake-api`: 8082
- `tm-api`: 8083
- `tm-medals-api`: 8084
- `dbs` (PostgreSQL): 5432
- `tmiosim`: 8100
- `openplanetsim`: 8101
- `externalsim`: 8102

### Database Migrations

Database schemas are managed with numbered SQL migration files in `dbs/<service-name>/`. Migrations are applied using `tern` (configured via `tern.conf` in each database directory).

To apply migrations manually:
```bash
cd dbs/<service-name>
tern migrate
```

The database init script (`dbs/init-user-db.sh`) creates all required databases and users on first startup.

## Architecture Notes

### API Structure

Each API follows a consistent pattern:
- `index.ts` - Server entry point using Bun.serve
- `routes/` - Route handlers (one file per route group)
- `services/` - Business logic and external integrations
- `domain/` - API-specific types and models
- `middleware/` - Request/response middleware

APIs use a custom `ApiRequest` wrapper that provides access to services (logger, db, etc.) and handles routing.

### Shared Code

The `shared/` workspace contains code reused across multiple APIs. When modifying shared code, consider the impact on all consuming APIs. The shared package includes:
- Type definitions for domain models (events, players, maps, leaderboards, etc.)
- Database repository abstractions
- HTTP clients for external APIs (TMIO, etc.)
- Common services (logging, validation, etc.)

### Database Access

Database connections use PostgreSQL connection strings with the format:
```
postgres://<user>:<password>@<host>:<port>/<database>?pool_max_conns=10
```

Database credentials for local development:
- Host: `localhost` (or `db` in Docker)
- Port: 5432
- Password: `Passw0rd!`
- Databases: `hdstmevents`, `openplanetsnake`, `tmapi`, `tmmedals`

### Environment Variables

APIs expect these environment variables:
- `DATABASE_CONNSTR` - PostgreSQL connection string
- `HOST` - Bind hostname (default: localhost)
- `PORT` - Server port (varies by service)
- `DEBUG` - Enable debug logging
- `ADMIN_KEY` - Admin API authentication key
- `TMIO_URL` - Trackmania.io API URL (real or mock)

See `process-compose.yml` for local development values and `docker-compose.yml` for container values.

### Plugin Development

Openplanet plugins are written in Angelscript. The build system:
1. Copies shared code from `plugins/shared/` into each plugin's `src/shared/` (when using `-s` flag)
2. Packages the plugin as a `.op` file (ZIP archive containing `info.toml` and `src/`)
3. In watch mode, automatically copies to the Openplanet plugins directory when the game releases the file lock

The `PLUGINS_DIR` environment variable can override the default Openplanet plugins location (`$HOME/OpenplanetNext/Plugins`).

### TypeScript Configuration

The root `tsconfig.json` uses Bun-compatible settings:
- Target: ESNext
- Module: ESNext with bundler resolution
- Strict mode enabled
- No emit (Bun runs TypeScript directly)

Individual workspaces may extend this configuration.

## Key Conventions

- Use Bun for all TypeScript execution and package management
- Database migrations must be numbered sequentially (`001_*.sql`, `002_*.sql`, etc.)
- API routes return responses via the `ApiRequest`/`ApiResponse` pattern (see shared domain types)
- Tests use Bun's built-in test runner (not Jest)
- Frontend uses Nx for build/dev/test commands
- All code should pass TypeScript strict mode checks
