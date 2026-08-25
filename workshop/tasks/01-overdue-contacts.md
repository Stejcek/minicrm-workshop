# Vývojový task: kontakty po termínu

## Výsledek

Uživatel může v seznamu kontaktů zapnout filtr „Po termínu“. Odpovídající kontakty jsou v seznamu viditelně, ale přístupně označené.

## Kontext

Pole `nextContactAt` již existuje v databázi, API i formuláři. Funkce byla záměrně odložena pro workshop. Použijte existující filtr podle stavu a firmy jako vzor.

## V rozsahu

- Volitelný API query parametr `overdue=true`.
- Kontakt je po termínu, pokud má `nextContactAt` striktně menší než aktuální okamžik.
- Pravidlo platí pro všechny obchodní stavy včetně `WON` a `LOST`.
- Filtr se kombinuje pomocí logického AND s textovým hledáním, stavem a firmou.
- Checkbox nebo obdobný jednoznačný ovládací prvek v seznamu kontaktů.
- Textové a vizuální označení řádku; barva nesmí být jediným nositelem významu.
- Serverová validace parametru a testy s pevným referenčním časem.

## Mimo rozsah

- E-mailové připomínky, notifikace, plánovač a background job.
- Nová databázová migrace nebo sloupec.
- Uživatelské nastavení časové zóny.
- Automatická změna obchodního stavu.
- Refaktoring ostatních filtrů nebo nový stavový framework.

## Akceptační kritéria

- [ ] Kontakt s datem před referenčním okamžikem se při filtru zobrazí.
- [ ] Kontakt přesně v referenčním okamžiku ani kontakt bez data se nezobrazí.
- [ ] Bez parametru zůstane současné chování seznamu beze změny.
- [ ] `overdue=false` filtr neaktivuje; jiná hodnota vrátí srozumitelnou chybu 400.
- [ ] Filtr funguje současně s filtrem firmy a stavu.
- [ ] UI zobrazuje text „Po termínu“ a je ovladatelné klávesnicí.
- [ ] Test používá pevný čas nebo čas předaný službě; nesmí záviset na hodinách počítače.

## Doporučené ověření

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Stop podmínky

Zastavte se, pokud by řešení vyžadovalo novou závislost, změnu schématu, globální mock systémového času pro nesouvisející testy nebo rozhodnutí o vyloučení některých obchodních stavů. Takové rozšíření musí nejprve schválit vlastník zadání.

## Předání

Uveďte změněné vrstvy, hraniční testy, způsob kombinace filtrů, příkazy kontrol a riziko práce s časem.
