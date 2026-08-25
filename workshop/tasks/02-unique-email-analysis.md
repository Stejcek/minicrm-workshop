# Analyticko-architektonický task: unikátní e-mail kontaktu

## Rozhodnutí

Navrhněte bezpečný způsob zavedení unikátní e-mailové adresy kontaktu. V tomto tasku nic neimplementujte.

## Výchozí stav

Duplicitní e-mail je v MiniCRM záměrně povolen. E-mail je povinný a validovaný, ale databáze nemá unikátní index. Seed, API, formuláře a testy mohou být budoucím pravidlem ovlivněny.

## Požadovaný výstup

Vytvořte návrh podle `workshop/templates/adr.md`, který obsahuje:

- odkazy na konkrétní místa současné validace, schématu a vytváření kontaktu;
- definici normalizace: ořezání mezer a zacházení s velikostí písmen;
- alespoň dvě varianty vynucení pravidla a doporučení;
- dotaz nebo postup pro zjištění existujících duplicit před migrací;
- strategii vyřešení duplicit bez automatické ztráty dat;
- pořadí databázové migrace a nasazení API;
- chování create/update API při konfliktu a český text chyby v UI;
- dopad na seed, test fixtures a souběžné požadavky;
- rollback a známá rizika.

## Varianty, které je nutné posoudit

1. Databázový unikátní index nad uloženým normalizovaným e-mailem.
2. Samostatný normalizovaný sloupec s unikátním indexem a zachováním původního zápisu.

Pouhá kontrola existence v aplikační službě není samostatně dostačující kvůli souběhu požadavků; lze ji hodnotit jen jako doplněk pro lepší chybovou zprávu.

## Akceptační kritéria

- [ ] Fakta z repozitáře jsou oddělena od doporučení.
- [ ] Návrh neodstraňuje ani svévolně neslučuje existující kontakty.
- [ ] Databáze je konečným garantem unikátnosti.
- [ ] Je popsána kompatibilita přechodového období a rollback.
- [ ] Jsou uvedeny testy pro create, update stejného kontaktu, konflikt různých kontaktů, velikost písmen a mezery.
- [ ] Výstup pojmenuje rozhodnutí vlastníka produktu: zda se zachovává původní zápis e-mailu.

## Mimo rozsah

- Změny `schema.prisma`, migrací, API, UI nebo seedu.
- Instalace balíčků, externí rešerše a spuštění destruktivního SQL.

## Stop podmínky

Pokud z repozitáře nelze ověřit dopad nebo chybí produktové rozhodnutí, uveďte varianty a přesnou otázku. Nevybírejte tiše pravidlo, které může sloučit nebo odmítnout uživatelská data.
