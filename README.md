# MiniCRM

MiniCRM je malé výukové webové CRM pro správu firem, kontaktů a jejich aktivit. Je záměrně jednoduché, běží celé lokálně a slouží jako stabilní základ pro praktické úkoly během workshopu práce s vývojovým agentem.

Všechna dodaná demonstrační data jsou syntetická. Aplikace nepoužívá externí API, analytiku ani skutečné odesílání e-mailů.

## Stack

- Node.js 22 a npm workspaces
- React 19, Vite a React Router
- Fastify API
- Prisma ORM a lokální SQLite
- Zod pro sdílenou serverovou validaci
- Vitest, ESLint a Prettier

## Požadavky

- Node.js 22 (`nvm use` načte verzi z `.nvmrc`)
- npm 10 nebo novější

## Instalace a konfigurace

```bash
nvm use
npm ci
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
```

Hodnoty v `.env.example` jsou bezpečné lokální výchozí hodnoty. Soubor `.env` se necommituje. Bez vlastního `.env` aplikace použije stejnou lokální SQLite databázi a výchozí porty.

## Lokální spuštění

```bash
npm run dev
```

- Web: <http://127.0.0.1:5173>
- API health check: <http://127.0.0.1:3001/api/health>

Vývojový příkaz spustí API i web současně. Ukončíte je pomocí `Ctrl+C`.

### Terminálové ovládání pro macOS

Pro pohodlné spouštění použijte interaktivní ovládací panel:

```bash
npm run crm
```

TUI zobrazuje stav hlavního procesu, dostupnost API a webu i poslední logy. Klávesami lze celý stack spustit, zastavit či restartovat, otevřít web ve výchozím prohlížeči, aplikovat migrace a doplnit demonstrační data. Obnova databáze klávesou `z` vyžaduje druhé potvrzení do pěti sekund a funguje pouze pro výchozí lokální SQLite databázi. Ukončení TUI klávesou `q` běžící CRM nezastaví.

Výstup aplikace se ukládá do `var/minicrm.log`, PID do `var/minicrm.pid.json`; oba soubory jsou ignorované Gitem. Stejné operace lze použít i bez interaktivního rozhraní:

```bash
npm run crm -- start
npm run crm -- status
npm run crm -- logs
npm run crm -- restart
npm run crm -- stop
npm run crm -- migrate
npm run crm -- seed
npm run crm -- reset --yes
```

## Databáze a demonstrační data

Migrace jsou v `apps/api/prisma/migrations`. Aplikuje je:

```bash
npm run db:migrate
```

Idempotentní seed vytvoří nebo aktualizuje 6 firem, 15 kontaktů a 24 aktivit s pevnými demonstračními ID:

```bash
npm run db:seed
```

Seed lze spouštět opakovaně bez vytváření dalších kopií. Termíny `nextContactAt` se při každém seedu posunou 2–25 dní do budoucnosti, aby přehled zůstal použitelný i při pozdějším workshopu. Pro úplnou obnovu lokální databáze do čistého demonstračního stavu zastavte CRM a použijte následující příkaz pouze nad výchozí lokální databází:

```bash
npm run db:reset
```

Příkaz vyžádá opsání slova `RESET`; pro vědomé neinteraktivní použití lze přidat `-- --yes`. Jinou hodnotu `DATABASE_URL` bezpečnostní kontrola odmítne.

## Kontroly kvality

```bash
npm test
npm run lint
npm run typecheck
npm run format
npm run build
```

Testy jsou deterministické, používají izolovanou SQLite databázi v `var/` a nepotřebují síť.

## Struktura

- `apps/api` – Fastify server, routy, služby, repository, Prisma schéma, migrace a seed
- `apps/web` – React stránky, formuláře, komponenty, API klient a styly
- `packages/shared` – sdílené doménové konstanty, TypeScript typy a Zod schémata
- `docs` – stručný popis domény a architektury
- `workshop` – účastnické tasky, šablony a popis rolí
- `var` – ignorované lokální provozní a testovací soubory

Další pravidla pro práci v repozitáři jsou v `AGENTS.md`.

## Workshopový výchozí stav

Program, příprava, dva cvičné tasky a review materiály jsou v [`workshop/README.md`](workshop/README.md). Reprodukovatelný začátek školení označuje Git tag `workshop-start`. Bezpečnostní hranice jsou v [`docs/security.md`](docs/security.md).
