# Šablona analytického nebo architektonického tasku

## Rozhodnutí, které má výstup podpořit

Formulujte otázku, nikoli předem vybranou implementaci.

## Kontext a zdroje

- Relevantní doménová pravidla, schéma, API, UI a dokumentace.
- Povolené zdroje. Výchozí pravidlo MiniCRM je bez externí sítě.
- Co je fakt z repozitáře, co předpoklad a co doporučení.

## Požadované výstupy

- Současný stav doložený odkazy na konkrétní soubory.
- Varianty řešení a jejich dopady.
- Doporučení včetně důvodů a nevýhod.
- Dopad na data, migraci, API, UX, testy, bezpečnost a rollback.
- Otevřené otázky pro člověka s rozhodovací pravomocí.

## Mimo rozsah

- Bez změn zdrojového kódu nebo databáze, pokud zadání výslovně neříká jinak.
- Bez instalace závislostí, deploymentu a kontaktování externích služeb.

## Akceptační kritéria

- [ ] Tvrzení jsou oddělena na fakta, předpoklady a doporučení.
- [ ] Nejméně dvě reálné varianty jsou porovnány stejnými kritérii.
- [ ] Dopady zahrnují data, chybové stavy a provozní návrat.
- [ ] Výstup neprezentuje neověřenou domněnku jako fakt.
- [ ] Je zřejmé, které rozhodnutí musí udělat člověk.

## Stop podmínky

Zastavte analýzu, pokud chybí rozhodnutí vlastníka produktu, potřebný zdroj není dostupný nebo by ověření vyžadovalo nepovolená data či službu. Popište přesně chybějící informaci a dopad na závěr.
