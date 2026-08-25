# AI-assisted Definition of Done

Změna je hotová pouze tehdy, když člověk dokáže z repozitáře a výstupu agenta ověřit všechny následující body:

- [ ] Výsledek splňuje zadání a akceptační kritéria.
- [ ] Agent zachoval existující konvence, uživatelské změny a veřejná rozhraní.
- [ ] Vstupy, oprávnění a chybové stavy byly posouzeny.
- [ ] Testy ověřují požadované chování nezávisle na detailech implementace.
- [ ] Relevantní testy, celý testovací balík, lint, typecheck a build prošly.
- [ ] Diff byl přečten člověkem a neobsahuje nesouvisející nebo generované změny.
- [ ] Nejsou přítomné secrets, skutečné osobní údaje ani neschválené externí služby.
- [ ] Databázové změny mají migraci a bezpečný návrat nebo jasně popsané omezení.
- [ ] Dokumentace, příkazy a předávací report odpovídají realitě.
- [ ] Známá rizika a neověřené části jsou přijatelné pro daný rozsah.

Agent dodává důkazy a doporučení. O dokončení rozhoduje lidský reviewer.
