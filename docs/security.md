# Bezpečnostní hranice MiniCRM

MiniCRM je lokální výuková aplikace. Bezpečný základ znamená omezený přístup, syntetická data a povinné lidské převzetí; neznamená produkční zabezpečení.

## Data a duševní vlastnictví

- Do repozitáře, promptů, logů ani screenshotů nevkládejte klientský zdrojový kód mimo schválený rozsah, reálné osobní údaje nebo obchodní informace.
- Používejte pouze syntetická data s doménami `.example` a `.test`.
- Agent nesmí celé objekty kontaktů vypisovat do logů. Lokální Fastify log obsahuje metadata požadavku, ne jeho tělo.
- Výstup agenta a diff vždy kontroluje člověk oprávněný pracovat s daným repozitářem.

## Secrets a konfigurace

- Skutečný `.env` se necommituje. Sdílí se pouze `.env.example` s bezpečnými hodnotami.
- Token, heslo, privátní klíč ani produkční URL nepatří do zdrojového kódu, tasku, test fixture nebo logu.
- Pokud úkol vyžaduje secret, agent se zastaví. Hodnotu nastaví člověk schváleným neveřejným mechanismem; agent ji nesmí zobrazit.

## Soubory, shell a procesy

- Agent smí pracovat pouze v tomto workspace a v dočasných souborech nutných pro test.
- Před změnou kontroluje `git status` a zachovává překrývající se uživatelské změny.
- Destruktivní příkaz musí mít přesný lokální cíl, jasnou souvislost se zadáním a potvrzení.
- Reset databáze je omezen na `file:./dev.db`, vyžaduje potvrzení a nesmí probíhat při spuštěném CRM.
- TUI zastaví pouze procesní skupinu, jejíž PID a heartbeat odpovídají stejné náhodně označené instanci.

## Síť a služby

Výchozí schválená síťová komunikace aplikace je pouze loopback:

- `http://127.0.0.1:5173` – lokální web,
- `http://127.0.0.1:3001` – lokální API.

MiniCRM nepoužívá externí API, cloudovou databázi, analytiku, telemetrii ani skutečné odesílání e-mailu. Stažení npm závislostí je instalační krok, ne runtime schopnost aplikace. Přidání externí služby, nové závislosti, síťového cíle nebo deploymentu vyžaduje explicitní schválení a aktualizaci tohoto dokumentu.

## Povinný lidský review

Reviewer musí před přijetím změny ověřit:

- celý diff a nové soubory;
- původ a účel změn lockfile;
- serverovou validaci a chybové stavy;
- migraci, seed a případnou destruktivní operaci;
- test, který by selhal při realistické chybě;
- výstup testů, lintu, typechecku a buildu;
- nepřítomnost secrets, reálných dat a neschválených služeb;
- předpoklady, známá rizika a neověřené části.

Zelený test ani sebejisté shrnutí agenta nenahrazují lidské schválení.

## Reakce na incident

Pokud se secret nebo reálný údaj objeví v pracovním stromu či logu, zastavte práci, obsah dále nekopírujte a informujte vlastníka. Pouhé smazání z posledního commitu nestačí; vlastník rozhodne o rotaci secretu a vyčištění historie.
