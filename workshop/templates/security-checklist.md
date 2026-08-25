# Bezpečnostní checklist pro práci s agentem

## Před zadáním

- [ ] Repozitář a data smí být zpracována použitým nástrojem a modelem.
- [ ] Zadání neobsahuje secrets, osobní údaje ani zbytečný klientský kontext.
- [ ] Je určeno, zda agent smí zapisovat soubory, spouštět shell a používat síť.
- [ ] Externí služby a nové závislosti jsou buď zakázané, nebo přesně schválené.
- [ ] Destruktivní operace mají konkrétní lokální cíl a způsob potvrzení.

## Během práce

- [ ] Agent zachovává uživatelské změny a drží se workspace.
- [ ] `.env`, databáze, logy a build output nejsou přidávány do Gitu.
- [ ] Logování neobsahuje celé kontakty, těla požadavků nebo secrets.
- [ ] Rozšíření oprávnění odpovídá konkrétnímu kroku, ne obecné budoucí potřebě.
- [ ] Při chybějícím obchodním nebo bezpečnostním rozhodnutí agent zastaví práci.

## Před přijetím

- [ ] Člověk přečetl celý diff a změny lockfile.
- [ ] Testy, lint, typecheck a build byly skutečně spuštěny.
- [ ] Diff byl prohledán na secrets, reálná data a neschválené URL.
- [ ] Migrace a reset byly ověřeny pouze nad lokální databází.
- [ ] Síťové cíle odpovídají `docs/security.md`.
- [ ] Zbývající rizika a neověřené části jsou explicitně přijaty člověkem.
