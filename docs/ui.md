# UI baseline MiniCRM

Tento dokument zachycuje minimální designérský kontext pro workshop. Není to samostatný design systém.

## Hlavní toky

1. Přehled → nejbližší kontakt → detail → přidání aktivity.
2. Kontakty → hledání nebo filtry → detail → úprava či potvrzené odstranění.
3. Firmy → detail firmy → přiřazené kontakty → detail kontaktu.
4. Nový kontakt nebo firma → validace → detail uloženého záznamu.

## Povinné stavy obrazovky

Každá datová obrazovka má srozumitelný načítací, prázdný a chybový stav. Formulář během ukládání zakáže opakované odeslání a serverovou chybu zobrazí poblíž formuláře. Destruktivní akce vyžaduje potvrzení pojmenovávající konkrétní záznam nebo data.

## Přístupnost a responzivita

- Viditelné české labely patří ke všem vstupům; placeholder není label.
- Stav nesmí být sdělen pouze barvou, ale také textem.
- Navigace, filtry, formuláře a potvrzení musí být ovladatelné klávesnicí.
- Tabulky mohou na malém displeji horizontálně rolovat; hlavní akce zůstává dosažitelná.
- Chyby používají `role="alert"`, průběžný stav vhodné živé oznámení.

Designér při změně dodá texty, celý tok a očekávání pro běžný, prázdný, načítací, chybový a potvrzovací stav. Obrázek nebo mockup přidává jen tehdy, když textový popis nestačí.
