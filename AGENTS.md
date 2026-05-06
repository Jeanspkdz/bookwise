# AGENTS.md

## Repo Snapshot

- Nuxt 4 app with local Nuxt layers under `layers/` (not a pnpm workspace/monorepo).
- Runtime UI stack: `@nuxt/ui` + Tailwind v4 (`@import 'tailwindcss'` in `layers/shared/app/assets/main.css`).
- Data layer: Drizzle ORM + Postgres.

## Commands (source of truth: `package.json`)

- Install deps: `pnpm install`
- Dev server: `pnpm dev`
- Production build: `pnpm build`
- Preview build: `pnpm preview`
- Lint: `pnpm lint` (Oxlint, not ESLint CLI)
- Auto-fix lint: `pnpm lint:fix`
- Format: `pnpm fmt` (Oxfmt, not Prettier)
- Check format only: `pnpm fmt:check`
- DB schema/migrations: `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:push`, `pnpm db:studio`

## Verification Flow

- There is no test script configured.
- For focused verification, run: `pnpm fmt:check && pnpm lint && pnpm build`.

## Architecture That Matters

- Root app shell is `app/app.vue`; main routes currently in `app/pages/**`.
- Shared cross-cutting layer: `layers/shared` (layouts, global CSS, DB config/schema/utils).
- Feature layer: `layers/book-catalog` (book UI components + `/api/book` handlers).
- Layer component prefixes are explicit and easy to miss:
  - `layers/shared/app/components` => `Shared*`
  - `layers/book-catalog/app/components` => `BookCatalog*`

## Server/Data Quirks

- Drizzle config is at `layers/shared/drizzle.config.ts` (all DB scripts point here).
- `NUXT_DATABASE_URL` is required for Drizzle commands and DB-backed server handlers (`layers/shared/server/utils/db.ts`).
- DB schema source: `layers/shared/server/db/schema/*.ts`.
- Generated migrations live in `layers/shared/server/db/migrations/`; prefer generating via Drizzle scripts instead of hand-editing `meta/*.json`.

## Conventions To Follow

- Use Oxlint/Oxfmt conventions (e.g., single quotes, no semicolons) instead of assuming Prettier/ESLint defaults.
- Custom icon collection prefix is `jpkdz` from `layers/shared/app/assets/icons`.
