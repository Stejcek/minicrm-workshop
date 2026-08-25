# Šablona vývojového tasku

## Výsledek

Jednou až dvěma větami popište pozorovatelný stav po dokončení. Nepopisujte postup implementace, pokud není architektonicky závazný.

## Kontext

- Proč je změna potřebná?
- Které existující obrazovky, routy a pravidla se jí týkají?
- Jaké existující vzory má agent použít?

## Rozsah změny

### V rozsahu

- Konkrétní chování a vrstvy, kterých se změna může dotknout.

### Mimo rozsah

- Související funkce, které se nyní nesmí implementovat.
- Refaktoring, nové závislosti nebo změny veřejných rozhraní, pokud nejsou nutné.

## Architektonická omezení

- Zachovat stack, adresářové konvence a veřejná rozhraní.
- Uvést povolené databázové a API změny.
- Určit, zda je povolena nová závislost, migrace nebo síťový přístup.

## Akceptační kritéria

Pište pozorovatelné příklady, včetně hranic a chybových stavů:

- [ ] Běžný scénář má přesně popsaný výsledek.
- [ ] Prázdné a hraniční hodnoty mají určené chování.
- [ ] Nové chování funguje společně s existujícími filtry nebo formuláři.
- [ ] Chyba je srozumitelná a aplikace nespadne.
- [ ] Relevantní test ověřuje chování, ne interní volání implementace.

## Ověření

Uveďte konkrétní příkazy pro relevantní test, celý testovací balík, lint, typecheck a build.

## Stop podmínky

Agent se zastaví a požádá o rozhodnutí, pokud například:

- zadání vyžaduje změnit framework nebo veřejné rozhraní mimo rozsah;
- není jasné obchodní pravidlo, které významně mění data nebo UX;
- změna vyžaduje produkční službu, secret, síťový přístup nebo novou závislost bez schválení;
- pracovní strom obsahuje překrývající se uživatelské změny, které nelze bezpečně zachovat;
- nelze vytvořit důvěryhodný test bez změny rozsahu.

## Předání

Požadujte souhrn změn, důkazy z kontrol, známá omezení, neověřené části a rizika diffu.
