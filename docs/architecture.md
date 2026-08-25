# Architektura MiniCRM

## Vrstvy

MiniCRM je npm monorepo se třemi pracovními prostory:

1. `apps/web` vykresluje české React UI. Stránky používají malé formulářové komponenty a jediný typovaný API klient.
2. `apps/api` přijímá HTTP požadavky ve Fastify routách. Služby validují vstupy, provádějí jednoduchá obchodní pravidla a volají repository.
3. `packages/shared` obsahuje povolené hodnoty stavů, Zod schémata a kontrakty sdílené frontendem a backendem.

Složka `workshop` není runtime vrstva. Obsahuje účastnická zadání a šablony, které nesmí být importovány aplikačním kódem.

Prisma repository jsou jediným místem běžného databázového přístupu. SQLite soubor je lokální a schéma se mění výhradně Prisma migracemi.

## Tok požadavku

Formulář React → `api/client.ts` → Fastify route → služba a Zod validace → Prisma repository → SQLite. Odpověď nebo srozumitelná chyba se vrátí stejnou cestou do UI.

## Rozhodnutí

- Monorepo drží frontend, API a sdílené kontrakty odděleně, ale umožňuje jeden instalační a vývojový příkaz.
- Validace je v balíčku `shared`, ale rozhodující kontrola vždy proběhne na serveru.
- Obchodní stavy jsou v SQLite uloženy jako text a jejich množinu vynucuje Zod. SQLite v použité konfiguraci nepotřebuje další enumovou vrstvu.
- Seed používá stabilní ID a `upsert`; je bezpečné jej opakovat.
- API nepoužívá autentizaci, protože jde o lokální výukovou aplikaci.

## Známá omezení

Aplikace nemá autentizaci, role, tenanty, stránkování, auditní log, import/export, hromadné operace ani pokročilý reporting. Nehlídá unikátní e-mail, nefiltruje kontakty po termínu a neposílá skutečné e-maily. Tyto mezery jsou záměrné pro další workshopové úkoly.
