# AGENTS.md

## Purpose

MiniCRM is a small educational web CRM used for hands-on training with coding agents.

The project demonstrates how to:

- understand an existing repository,
- prepare a bounded implementation plan,
- make a small code change,
- validate the result,
- review a diff,
- identify risks,
- hand the result back to a human reviewer.

The project is not intended for production use.

All demonstration data must be synthetic.

## Target stack

Use the following stack unless this file is explicitly updated:

- TypeScript
- Node.js version pinned in `.nvmrc`
- npm workspaces
- React with Vite for the frontend
- Fastify for the backend API
- Prisma ORM
- SQLite for local development and tests
- Zod for runtime input validation
- Vitest for unit and integration tests
- ESLint
- Prettier

Do not replace the selected frameworks without explicit approval.

Do not add another state-management, validation, ORM, UI or testing framework unless the task specifically requires it.

## Repository structure

The expected repository structure is:

```text
.
├── AGENTS.md
├── README.md
├── package.json
├── package-lock.json
├── .nvmrc
├── .env.example
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── validation/
│   │   │   ├── plugins/
│   │   │   └── server.ts
│   │   └── tests/
│   └── web/
│       ├── src/
│       │   ├── api/
│       │   ├── components/
│       │   ├── features/
│       │   ├── pages/
│       │   ├── styles/
│       │   └── main.tsx
│       └── tests/
├── packages/
│   └── shared/
│       └── src/
│           ├── schemas/
│           └── types/
├── scripts/
│   ├── lib/
│   ├── dev.mjs
│   └── minicrm-tui.mjs
├── docs/
│   ├── architecture.md
│   ├── domain.md
│   ├── security.md
│   └── ui.md
├── workshop/
│   ├── tasks/
│   └── templates/
└── var/
    └── .gitkeep
```

Workshop instructions, task templates, and role guidance live in `workshop/`. Security boundaries are documented in `docs/security.md`; the UI baseline is in `docs/ui.md`.

## Commands

- Install: `npm ci`
- Local development: `npm run dev`
- macOS terminal control panel: `npm run crm`
- Apply database migrations: `npm run db:migrate`
- Seed synthetic demo data: `npm run db:seed`
- Reset the local database: `npm run db:reset`
- Tests: `npm test`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Build: `npm run build`

## Conventions

- Keep domain constants, Zod schemas, and API-facing types in `packages/shared`.
- Keep persistence in repositories, business behavior in services, and HTTP concerns in routes.
- Validate every API write at the service boundary with the shared Zod schemas.
- Use Czech UI copy and accessible form labels. Keep source identifiers and code in English.
- Use Prisma migrations for every schema change. Demo seed identifiers must stay stable and idempotent.
- Prefer small components and direct code over generic frameworks or speculative abstractions.
- Keep local process management in dependency-free Node.js scripts under `scripts/`; runtime PID and log files belong in `var/` and must stay ignored.
- Duplicate contact e-mail addresses are intentionally allowed in this starter version.

## Role contributions

- Analysts own domain language, examples, business rules, acceptance criteria, and representative fixtures. Put durable rules in `docs/domain.md` and bounded requests in `workshop/tasks/`.
- Architects own layer boundaries, migration and rollback decisions, integrations, and ADRs. Put durable architecture in `docs/architecture.md` or an ADR based on `workshop/templates/adr.md`.
- Designers own user flows, Czech UI copy, empty/loading/error/confirmation states, accessibility, and the responsive baseline in `docs/ui.md`.
- Developers implement the smallest approved change and provide tests, migrations, and technical documentation.
- Human reviewers independently verify the diff, evidence, risks, and security boundaries before accepting work.

Do not let the agent silently substitute a missing product, architecture, or design decision. Record the open question and stop when it materially changes the result.

## Context management

- Start with the closest applicable `AGENTS.md`, the task, README, and only the source files needed for the current change.
- Inspect existing routes, services, components, tests, and migrations before designing a new pattern.
- Do not load or summarize `node_modules`, build output, SQLite files, full logs, or unrelated documentation.
- Keep facts from the repository separate from assumptions and recommendations. Persist durable decisions in domain docs or an ADR, not only in chat history.
- Re-check `git status` before editing and before handoff. Preserve user changes and keep the diff bounded.
- After a long investigation, restate the active objective, accepted decisions, stop conditions, and remaining verification instead of rereading the whole repository.
- Use `workshop/templates/` for task, review, and Definition of Done structure.

## Definition of Done

- The change matches its assignment and contains no unrelated edits.
- Inputs are validated and relevant tests exist and pass.
- Lint, typecheck, and production build pass.
- The final diff has been reviewed.
- No secrets, real personal data, or production customer data are included.
- Documentation matches the actual behavior and commands.
- A human reviewer has read the complete diff and accepted the remaining risks.

## Restricted and sensitive areas

- Never commit real `.env` files, access tokens, secrets, or customer data.
- Do not connect to external production services or add telemetry/tracking.
- Do not change CI or deployment configuration without an explicit assignment.
- Do not install additional dependencies without a concrete, documented need.
- Database reset commands are only for the local development or isolated test database.
- Follow `docs/security.md`; the runtime network allowlist is loopback only unless explicitly expanded.
