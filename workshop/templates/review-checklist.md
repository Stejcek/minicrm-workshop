# Checklist převzetí změny

## Rozsah a diff

- [ ] Změna odpovídá zadání a neobsahuje nesouvisející refaktoring.
- [ ] Reviewer přečetl celý diff, ne pouze shrnutí agenta.
- [ ] Nové soubory, generované výstupy a změny lockfile jsou očekávané.
- [ ] Veřejná rozhraní a databázová migrace jsou zpětně kompatibilní nebo popsané.

## Chování a testy

- [ ] Akceptační kritéria jsou ověřena pozorovatelným chováním.
- [ ] Test obsahuje důležitou hraniční nebo chybovou hodnotu.
- [ ] Test by selhal při realistické chybné implementaci.
- [ ] Test nekopíruje pouze podmínky, konstanty nebo interní volání nové implementace.
- [ ] Relevantní testy i celý balík skutečně proběhly.

## Kvalita a bezpečnost

- [ ] Lint, typecheck a build prošly.
- [ ] Vstupy jsou validované na serveru a chyby jsou srozumitelné.
- [ ] Diff neobsahuje secrets, `.env`, reálná osobní data ani celé kontakty v logu.
- [ ] Nebyla přidána neschválená služba, telemetrie, síťové volání nebo závislost.
- [ ] Destruktivní operace mají omezený cíl a potvrzení.

## Předání

- [ ] Agent uvedl předpoklady, neověřené části, rizika a zbývající omezení.
- [ ] Dokumentace odpovídá skutečným příkazům a chování.
- [ ] Lidský reviewer změnu výslovně schválil; zelené testy samy o sobě nejsou schválení.
