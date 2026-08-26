# Projektoví subagenti Codexu

MiniCRM obsahuje opakovatelné role v `.codex/agents/`. Slouží účastníkům k nácviku rozdělení odpovědností, práce s omezeným kontextem a nezávislého review. Nejsou autonomním týmem a nenahrazují vlastníka produktu, architekta ani lidského reviewera.

Projektová konfigurace `.codex/config.toml` povoluje nejvýše tři souběžná subagentní vlákna. Role záměrně neurčují konkrétní model, takže dědí schválený model a reasoning hlavního běhu. Každý účastník musí před důvěřováním projektové konfiguraci přečíst její obsah stejně jako shellový skript nebo změnu závislostí.

## Katalog rolí

| Profil                | Použít, když                                                       | Výstup                                                        | Oprávnění                          |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- | ---------------------------------- |
| `repository_mapper`   | není jasné, které vrstvy a soubory změna zasáhne                   | mapa toku, vzorů, testů a otevřených otázek                   | read-only                          |
| `business_analyst`    | požadavek potřebuje pravidla, příklady, rozsah a kritéria          | pozorovatelné chování bez návrhu implementace                 | read-only                          |
| `solution_architect`  | existuje skutečná volba rozhraní, dat nebo migrace                 | porovnání variant, doporučení, dopady a rollback              | read-only                          |
| `ux_designer`         | mění se tok, texty, stavy nebo ovládání UI                         | český stavový model, copy, přístupnost a responsive požadavky | read-only                          |
| `implementer`         | rozhodnutí jsou hotová a existuje ohraničený task                  | nejmenší diff, testy, dokumentace a důkazy                    | workspace-write                    |
| `verification_runner` | je nutné nezávisle spustit přesně určené kontroly                  | příkazy, exit status, stručné chyby a nové artefakty          | workspace-write bez editace zdrojů |
| `test_critic`         | testy mohou kopírovat stejnou mylnou představu jako kód            | mezery, realistické mutace a proti-příklady                   | read-only                          |
| `code_reviewer`       | implementace je hotová a má se převzít celý diff                   | nálezy podle závažnosti s reprodukcí                          | read-only                          |
| `security_reviewer`   | změna sahá na data, secrets, logy, shell, procesy, síť nebo mazání | capability mapa, nálezy a zbytková rizika                     | read-only                          |

`workspace-write` u `verification_runner` umožňuje běžné ignorované výstupy testů a buildu. Jeho definice výslovně zakazuje změny zdrojů, automatické opravy a reset databáze bez samostatného zadání.

## Pravidla orchestrace

1. Subagenty nespouštějte automaticky. Zadání musí delegaci výslovně požadovat.
2. Delegujte jen nezávislé a ohraničené části s jasným výstupem.
3. Před implementací lze paralelizovat read-only průzkum. Rozhodnutí syntetizuje hlavní agent.
4. Současně smí existovat jen jeden agent upravující zdrojový kód: `implementer`.
5. `verification_runner` spouštějte až poté, co implementer dokončí zápis, aby se nemíchaly generované artefakty s aktivním diffem.
6. Reviewer nesmí opravovat vlastní nález. Oprava se vrací implementerovi jako nový ohraničený krok.
7. Hlavní agent čeká na všechny požadované výsledky, pojmenuje rozpory a odpovídá za výslednou syntézu.
8. Zelené testy ani shoda více agentů nejsou schválením. Celý diff přijímá člověk.

## Doporučené průchody

### Nejasné vývojové zadání

```text
Deleguj dvě nezávislé read-only role. repository_mapper zmapuje skutečný tok
od UI k databázi a existující testy. business_analyst připraví pozorovatelné
pravidlo, příklady, rozsah a stop podmínky. Počkej na oba, odděl fakta od
předpokladů a vrať jeden společný návrh tasku. Zatím nic neměň.
```

Pokud syntéza odhalí trvalou technickou volbu, teprve potom samostatně zapojte `solution_architect`. Architekt nesmí nahrazovat chybějící produktové rozhodnutí analytika.

### UI změna

```text
Použij repository_mapper pro nalezení existující stránky, komponent a stylů a
ux_designer pro český tok, všechny stavy, přesné texty, klávesnici a mobilní
layout. Oba pouze read-only. Počkej na výsledky a vrať implementovatelná
kritéria bez změny kódu.
```

### Implementace po rozhodnutí

```text
Použij jednoho implementer agenta na task workshop/tasks/01-overdue-contacts.md.
Je jediný zapisující agent. Musí zachovat uživatelské změny, přidat nezávislý
test, spustit relevantní kontroly a vrátit celý seznam změněných souborů,
výsledky, rizika a neověřené části. Nespouštěj dalšího writera.
```

### Nezávislé převzetí

```text
Po dokončení implementace deleguj read-only code_reviewer a test_critic.
Code reviewer zkontroluje celý diff proti zadání a test critic vytvoří
realistickou chybnou implementaci, kterou by slabý test stále přijal. Pokud
diff pracuje s daty, shellem, sítí nebo logy, přidej security_reviewer.
Počkej na všechny, sluč duplicity, zachovej rozpory a seřaď nálezy podle rizika.
```

Kontroly může následně spustit `verification_runner`. Musí dostat přesný seznam příkazů a nesmí selhání opravovat.

## Co zůstává na hlavním agentovi

- rozhodnout, zda je delegace vůbec přínosná;
- předat každému agentovi minimální nutný kontext a přesný výstup;
- zabránit překryvu zapisovaných souborů;
- porovnat tvrzení agentů se skutečným repozitářem;
- vyřešit nebo eskalovat rozpory a stop podmínky;
- zkontrolovat celý diff a uvést skutečně spuštěné kontroly;
- předat rizika člověku, který jediný změnu přijímá.

## Údržba profilů

Každý TOML soubor definuje jednu úzkou roli pomocí `name`, `description`, `sandbox_mode` a `developer_instructions`. Název souboru odpovídá `name`. Do profilů nevkládejte osobní cesty, tokeny, externí MCP servery, produkční URL ani instruktorské poznámky.

Změna oprávnění, modelu, sítě, MCP nebo skillu v projektovém profilu je citlivá změna konfigurace a vyžaduje lidský review. Modely se zde nepřipínají; pokud konkrétní cvičení potřebuje jiný model nebo reasoning, určete jej pouze pro dané spuštění.

Aktuální formát a chování ověřujte v [oficiální dokumentaci OpenAI k subagentům](https://learn.chatgpt.com/docs/agent-configuration/subagents), protože sdílený formát vlastních agentů se může vyvíjet.
