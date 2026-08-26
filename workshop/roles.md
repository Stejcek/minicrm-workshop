# Co do repozitáře přispívají jednotlivé role

Role se nepřekrývají autoritou. Každá dodává jiný typ ověřitelného kontextu; agent nesmí nejasné rozhodnutí jedné role tiše nahradit vlastním předpokladem.

| Role      | Typický příspěvek                                                          | Codex profil         | Co role schvaluje                    |
| --------- | -------------------------------------------------------------------------- | -------------------- | ------------------------------------ |
| Analytik  | pojmy, obchodní pravidla, příklady, akceptační kritéria, datové scénáře    | `business_analyst`   | význam pravidla a očekávané chování  |
| Architekt | hranice vrstev, integrace, ADR, migrace, provozní a bezpečnostní omezení   | `solution_architect` | technické rozhodnutí a jeho důsledky |
| Designér  | uživatelský tok, stavy obrazovky, texty, přístupnost, responzivní baseline | `ux_designer`        | použitelnost a konzistenci rozhraní  |
| Vývojář   | implementace, testy, migrace, aktualizace technické dokumentace            | `implementer`        | technickou správnost vlastního diffu |
| Reviewer  | nezávislé ověření rozsahu, chování, rizik a důkazů                         | `code_reviewer`      | přijetí změny pouze jako člověk      |

## Analytik

Analytik popisuje pozorovatelné pravidlo a reprezentativní příklady, ne Prisma dotaz nebo React komponentu. Rozlišuje současné chování, požadovanou změnu a otevřenou otázku. Pro MiniCRM zejména udržuje význam stavů, pravidla termínů a očekávání kolem duplicit.

## Architekt

Architekt zaznamenává rozhodnutí, která mají delší životnost než jeden task. Uvádí zvažované varianty, přijatou nevýhodu, migrační dopad a rollback. Nemá předepisovat abstrakci, pro kterou zatím neexistuje použití.

## Designér

Designér dodává celý uživatelský tok včetně prázdného, načítacího, chybového a potvrzovacího stavu. Texty musí být v češtině, ovládání použitelné klávesnicí a layout funkční na mobilu i desktopu. Vizuální změna nemá zakrýt obchodní informaci pouze barvou.

## Podpůrné agentní role

`repository_mapper` připravuje pouze mapu ověřených cest a vzorů. `verification_runner` spouští přidělené kontroly bez opravování selhání. `test_critic` hledá testy, které pouze kopírují implementaci, a navrhuje proti-příklady. `security_reviewer` se přidává k lidskému review změn s daty, logy, shellem, procesy, sítí nebo destruktivní schopností.

Profily pomáhají oddělit odpovědnosti, nepřenášejí však schvalovací pravomoc z člověka na model. Podrobná pravidla delegace jsou v [`agents.md`](agents.md).
