# MiniCRM

MiniCRM je malé výukové CRM pro praktické školení práce s vývojovým agentem.
Spravuje firmy, kontakty a historii obchodních aktivit, běží celé lokálně a je
záměrně dostatečně malé, aby se nový vývojář zorientoval během několika minut.

Projekt není produkční CRM. Neobsahuje autentizaci, externí služby, analytiku
ani skutečné odesílání e-mailů. Všechna dodaná demonstrační data jsou
syntetická.

## Co aplikace umí

- přehled počtů kontaktů a nejbližších plánovaných kontaktování;
- vytváření, úpravu, detail a odstranění kontaktu;
- hledání kontaktů podle jména nebo e-mailu;
- filtrování podle obchodního stavu a firmy;
- vytváření a úpravu firem včetně přehledu jejich kontaktů;
- historii poznámek, hovorů, e-mailů a schůzek na detailu kontaktu;
- serverovou validaci se srozumitelnými českými chybami;
- lokální TUI pro spuštění, stav, restart, logy, migraci, seed a reset dat.

## Rychlý start

### 1. Stažení projektu

```bash
git clone https://github.com/Stejcek/minicrm-workshop.git
cd minicrm-workshop
```

Pokud už máte nakonfigurované SSH pro GitHub, můžete použít:

```bash
git clone git@github.com:Stejcek/minicrm-workshop.git
```

### 2. Instalace a příprava databáze

```bash
nvm install
nvm use
npm ci
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 3. Spuštění

Na macOS je doporučený interaktivní ovládací panel:

```bash
npm run crm
```

Stiskněte `s` pro spuštění a `o` pro otevření aplikace. Web poběží na
<http://127.0.0.1:5173> a API health check na
<http://127.0.0.1:3001/api/health>.

Bez TUI lze frontend a API spustit společně příkazem:

```bash
npm run dev
```

Tento proces ukončíte pomocí `Ctrl+C`.

## Požadavky a stack

Požadováno je Node.js 22 a npm 10 nebo novější. Soubor `.nvmrc` drží správnou
hlavní verzi Node.js.

| Vrstva            | Technologie                                |
| ----------------- | ------------------------------------------ |
| Web               | React 19, React Router, Vite, TypeScript   |
| API               | Fastify, TypeScript                        |
| Databáze          | Prisma ORM, lokální SQLite                 |
| Sdílené kontrakty | Zod, TypeScript                            |
| Ověření           | Vitest, Node test runner, ESLint, Prettier |
| Organizace        | npm workspaces                             |

Projekt za běhu komunikuje pouze přes lokální loopback a nepotřebuje externí
API ani cloudovou databázi.

## První orientace v repozitáři

Než zadáte změnu vývojovému agentovi, přečtěte v tomto pořadí:

1. [`AGENTS.md`](AGENTS.md) – závazné konvence, ověřené příkazy, DoD a citlivé oblasti;
2. [`docs/domain.md`](docs/domain.md) – entity, vztahy a obchodní pravidla;
3. [`docs/architecture.md`](docs/architecture.md) – vrstvy a tok požadavku;
4. [`docs/ui.md`](docs/ui.md) – UI stavy, texty a responzivní základ;
5. [`docs/security.md`](docs/security.md) – data, secrets, síť a lidský review;
6. [`workshop/README.md`](workshop/README.md) – program, tasky a pracovní cyklus.
7. [`.codex/agents/`](.codex/agents) – verzované role subagentů pro analýzu, implementaci a review.

Typický tok změny je:

```text
React formulář → API klient → Fastify route → služba + Zod
               → Prisma repository → lokální SQLite
```

## Workshopový postup

Reprodukovatelný začátek je označen tagem `workshop-start`. Každý účastník má
pracovat ve vlastní větvi:

```bash
git fetch --tags
git switch -c workshop/jmeno workshop-start
```

Doporučený agentní cyklus:

1. přečíst zadání, `AGENTS.md` a pouze relevantní část kódu;
2. ověřit čistý pracovní strom a výchozí testy;
3. sepsat malý plán, rozsah, akceptační kritéria a stop podmínky;
4. implementovat nejmenší vyhovující změnu;
5. spustit relevantní testy a poté všechny povinné kontroly;
6. přečíst celý diff a zkontrolovat data, secrets a nesouvisející změny;
7. předat výsledek včetně rizik a neověřených částí k lidskému review.

## Projektoví subagenti Codexu

Repozitář obsahuje projektové role v [`.codex/agents/`](.codex/agents) a bezpečný limit tří souběžných vláken v [`.codex/config.toml`](.codex/config.toml). Konfigurace se načte pouze v podporovaném lokálním Codex klientu a po důvěryhodném otevření projektu. Role neobsahují secrets ani pevně zvolený model; dědí model hlavního agenta.

| Role                  | Účel                                                       | Zápis do zdrojů |
| --------------------- | ---------------------------------------------------------- | --------------- |
| `repository_mapper`   | zmapování relevantních vrstev, vzorů a testů               | ne              |
| `business_analyst`    | pravidla, příklady, rozsah a akceptační kritéria           | ne              |
| `solution_architect`  | varianty, dopady, migrace, rollback a technické rozhodnutí | ne              |
| `ux_designer`         | český tok, UI stavy, přístupnost a responzivní chování     | ne              |
| `implementer`         | jedna ohraničená a schválená implementace                  | ano             |
| `verification_runner` | spuštění kontrol bez opravování výsledků                   | ne              |
| `test_critic`         | nezávislost testovacího oracle a proti-příklady            | ne              |
| `code_reviewer`       | správnost, regrese, integrita dat a mezery v diffu         | ne              |
| `security_reviewer`   | secrets, data, logy, shell, síť a destruktivní schopnosti  | ne              |

Subagenty vyžádejte explicitně a použijte je jen na nezávislé části. Například:

```text
Deleguj repository_mapper zmapování dotčeného toku a business_analystovi
akceptační kritéria. Oba pouze read-only. Počkej na oba výsledky, odstraň
rozpory a vrať jeden společný plán. Zatím nic neimplementuj.
```

Při implementaci smí zdrojové soubory upravovat pouze jeden `implementer`. Po něm lze nezávisle spustit `code_reviewer` a `test_critic`; `security_reviewer` přidejte, pokud změna pracuje s daty, shellem, sítí, logy nebo destruktivní operací. Přesné hranice a další scénáře jsou v [`workshop/agents.md`](workshop/agents.md).

Připravené úlohy:

- [`workshop/tasks/01-overdue-contacts.md`](workshop/tasks/01-overdue-contacts.md) – malá full-stack změna;
- [`workshop/tasks/02-unique-email-analysis.md`](workshop/tasks/02-unique-email-analysis.md) – analyticko-architektonický návrh bez implementace.

## Ovládání TUI na macOS

```bash
npm run crm
```

| Klávesa | Akce                                       |
| ------: | ------------------------------------------ |
|     `s` | spustit API a web                          |
|     `x` | zastavit aplikaci                          |
|     `r` | restartovat aplikaci                       |
|     `o` | otevřít web ve výchozím prohlížeči         |
|     `m` | aplikovat databázové migrace               |
|     `d` | spustit idempotentní seed                  |
|     `z` | obnovit databázi; vyžaduje druhé potvrzení |
|     `q` | ukončit TUI, nikoli běžící CRM             |

TUI zobrazuje stav hlavního procesu, dostupnost API a webu i konec logu.
Provozní soubory jsou v `var/` a Git je ignoruje:

- `var/minicrm.log` – společný log API a webu;
- `var/minicrm.pid.json` – ověřený záznam běžící procesní skupiny;
- heartbeat soubor – ochrana před prací s cizím nebo zastaralým PID.

Stejné operace jsou dostupné neinteraktivně:

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

Prisma schéma a migrace jsou v `apps/api/prisma`. Výchozí SQLite databáze je
lokální, ignorovaná Gitem a lze ji kdykoli znovu vytvořit.

```bash
npm run db:generate  # vygeneruje Prisma klienta
npm run db:migrate   # aplikuje existující migrace
npm run db:seed      # vloží nebo aktualizuje demonstrační data
```

Idempotentní seed připraví 6 firem, 15 kontaktů a 24 aktivit se stabilními ID.
Obsahuje různé obchodní stavy, kontakty s firmou i bez firmy a plánovaná data
dalšího kontaktování. Opakované spuštění nevytváří nekontrolované duplicity.

Pro úplnou obnovu nejprve zastavte aplikaci:

```bash
npm run crm -- stop
npm run db:reset
```

Reset vyžádá opsání `RESET`. Vědomé neinteraktivní použití je možné pomocí
`npm run db:reset -- --yes`. Bezpečnostní kontrola odmítne jinou než výchozí
lokální SQLite databázi.

## Vývojové příkazy

| Účel                 | Příkaz               |
| -------------------- | -------------------- |
| instalace            | `npm ci`             |
| lokální vývoj        | `npm run dev`        |
| macOS ovládací panel | `npm run crm`        |
| všechny testy        | `npm test`           |
| lint                 | `npm run lint`       |
| kontrola formátování | `npm run format`     |
| oprava formátování   | `npm run format:fix` |
| typecheck            | `npm run typecheck`  |
| produkční build      | `npm run build`      |
| migrace              | `npm run db:migrate` |
| seed                 | `npm run db:seed`    |
| bezpečný reset dat   | `npm run db:reset`   |

Testy jsou deterministické, používají izolovanou SQLite databázi v `var/` a
nepotřebují externí síť.

## Adresářová struktura

```text
apps/api/        Fastify routy, služby, repository, Prisma a integrační testy
apps/web/        React stránky, formuláře, komponenty, API klient a styly
packages/shared/ doménové konstanty, typy a Zod schémata
scripts/         společné spuštění, bezpečný reset a macOS TUI
docs/            doména, architektura, UI a bezpečnost
workshop/        účastnické tasky, role a šablony
.codex/          projektová konfigurace a role Codex subagentů
var/             ignorované lokální databáze, PID, heartbeat a logy
```

## Bezpečnostní pravidla

- Commituje se pouze `.env.example`; skutečný `.env` je ignorovaný.
- Nepoužívejte skutečné osobní údaje, klientský kód, tokeny ani produkční URL.
- Nepřidávejte externí API, telemetrii, deployment nebo novou závislost bez zadání.
- Nevypisujte celé objekty kontaktů do logů.
- Destruktivní příkazy musí mít přesný lokální cíl a vědomé potvrzení.
- Výstup agenta, diff a důkazy vždy nezávisle kontroluje člověk.

Podrobnosti a postup při incidentu jsou v [`docs/security.md`](docs/security.md).

## Nejčastější potíže

### `nvm: command not found`

Nainstalujte nebo aktivujte NVM, případně použijte přímo kompatibilní Node.js 22. Správnou verzi ověřte pomocí `node --version`.

### API nebo web neodpovídá

```bash
npm run crm -- status
npm run crm -- logs
npm run crm -- restart
```

Pokud TUI hlásí cizí PID nebo obsazený port, nejprve identifikujte proces.
Neukončujte naslepo proces, který MiniCRM nevytvořilo.

### Databáze nemá tabulky nebo data

```bash
npm run crm -- stop
npm run db:migrate
npm run db:seed
```

### Instalace nebo generovaný klient je zastaralý

```bash
npm ci
npm run db:generate
```

## Záměrná omezení startovní verze

MiniCRM nemá autentizaci, role, tenanty, stránkování, auditní log,
import/export, hromadné operace ani pokročilé reporty. Nehlídá unikátní e-mail,
nefiltruje kontakty po termínu a neposílá skutečné e-maily. Pole
`nextContactAt` je připravené pro navazující workshopový úkol.

Duplicitní e-mail je v této verzi záměrně povolen a není chybou.
