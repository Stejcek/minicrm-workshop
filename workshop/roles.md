# Co do repozitáře přispívají jednotlivé role

Role se nepřekrývají autoritou. Každá dodává jiný typ ověřitelného kontextu; agent nesmí nejasné rozhodnutí jedné role tiše nahradit vlastním předpokladem.

| Role      | Typický příspěvek                                                          | Kam patří                                                   | Co role schvaluje                    |
| --------- | -------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------ |
| Analytik  | pojmy, obchodní pravidla, příklady, akceptační kritéria, datové scénáře    | `docs/domain.md`, tasky, fixtures                           | význam pravidla a očekávané chování  |
| Architekt | hranice vrstev, integrace, ADR, migrace, provozní a bezpečnostní omezení   | `docs/architecture.md`, `docs/adr/`, `AGENTS.md`            | technické rozhodnutí a jeho důsledky |
| Designér  | uživatelský tok, stavy obrazovky, texty, přístupnost, responzivní baseline | task, `docs/ui.md`, referenční obrázek pouze pokud je nutný | použitelnost a konzistenci rozhraní  |
| Vývojář   | implementace, testy, migrace, aktualizace technické dokumentace            | `apps/`, `packages/`, `tests`                               | technickou správnost vlastního diffu |
| Reviewer  | nezávislé ověření rozsahu, chování, rizik a důkazů                         | review komentáře nebo checklist                             | přijetí změny                        |

## Analytik

Analytik popisuje pozorovatelné pravidlo a reprezentativní příklady, ne Prisma dotaz nebo React komponentu. Rozlišuje současné chování, požadovanou změnu a otevřenou otázku. Pro MiniCRM zejména udržuje význam stavů, pravidla termínů a očekávání kolem duplicit.

## Architekt

Architekt zaznamenává rozhodnutí, která mají delší životnost než jeden task. Uvádí zvažované varianty, přijatou nevýhodu, migrační dopad a rollback. Nemá předepisovat abstrakci, pro kterou zatím neexistuje použití.

## Designér

Designér dodává celý uživatelský tok včetně prázdného, načítacího, chybového a potvrzovacího stavu. Texty musí být v češtině, ovládání použitelné klávesnicí a layout funkční na mobilu i desktopu. Vizuální změna nemá zakrýt obchodní informaci pouze barvou.
