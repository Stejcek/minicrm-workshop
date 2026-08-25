# Workshop s MiniCRM

MiniCRM je společný repozitář pro dvouhodinové praktické školení práce s vývojovým agentem. Cílem není dokončit co nejvíce funkcí, ale opakovaně procvičit dobře ohraničené zadání, bezpečný agentní cyklus a doložitelné převzetí výsledku.

## Program (120 minut)

|    Čas | Téma                           | Praktický výstup                                      |
| -----: | ------------------------------ | ----------------------------------------------------- |
| 15 min | Z chatu na agenta              | Jeden živý průchod od zadání po předání               |
| 25 min | Repozitář jako pracovní plocha | Práce s `AGENTS.md`, příkazy, rolemi, kontextem a DoD |
| 25 min | Od zadání k tasku              | Vývojový a analytický příklad                         |
|  5 min | Pauza                          | —                                                     |
| 25 min | Agentní cyklus a review        | Plán, malý diff, testy, rizika a AI-assisted review   |
| 20 min | Bezpečný základ                | Data, secrets, oprávnění, síť a lidský review         |
|  5 min | Uzavření                       | Shrnutí a další krok                                  |

## Příprava prostředí

```bash
nvm use
npm ci
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run crm
```

Výchozí stav je označen Git tagem `workshop-start`. Pro každého účastníka nebo nový pokus vytvořte novou větev, nikdy nepřepisujte rozpracovanou větev:

```bash
git switch -c workshop/ucastnik-01 workshop-start
```

Lokální demonstrační databázi lze obnovit přes TUI dvojím stisknutím `z`, nebo po zastavení aplikace příkazem:

```bash
npm run crm -- reset --yes
```

## Doporučený pracovní cyklus účastníka

1. Přečíst `AGENTS.md` a relevantní zadání.
2. Ověřit stav pracovního stromu a výchozí testy.
3. Sepsat krátký plán a pojmenovat stop podmínky.
4. Provést nejmenší změnu splňující akceptační kritéria.
5. Spustit relevantní testy, potom celý testovací balík, lint, typecheck a build.
6. Zkontrolovat diff, rizika, data a dokumentaci.
7. Předat výsledek s důkazy; lidský reviewer rozhoduje o přijetí.

## Materiály

- [`tasks/01-overdue-contacts.md`](tasks/01-overdue-contacts.md) – vývojový task
- [`tasks/02-unique-email-analysis.md`](tasks/02-unique-email-analysis.md) – analyticko-architektonický task
- [`templates/development-task.md`](templates/development-task.md) – šablona vývojového zadání
- [`templates/analysis-task.md`](templates/analysis-task.md) – šablona analytického zadání
- [`templates/review-checklist.md`](templates/review-checklist.md) – převzetí změny
- [`templates/security-checklist.md`](templates/security-checklist.md) – bezpečná práce s agentem
- [`templates/ai-assisted-dod.md`](templates/ai-assisted-dod.md) – Definition of Done
- [`templates/adr.md`](templates/adr.md) – stručný záznam architektonického rozhodnutí
- [`roles.md`](roles.md) – příspěvky analytika, architekta a designéra
- [`../docs/security.md`](../docs/security.md) – bezpečnostní hranice projektu
