# Doména MiniCRM

## Entity a vztahy

### Firma (`Company`)

Firma má název, volitelný web a obor. Název nesmí být prázdný. Jedna firma může mít více kontaktů. Firma s přiřazenými kontakty se přes API nesmí odstranit; databázová vazba navíc při případném odstranění bezpečně nastaví `companyId` kontaktů na `NULL`.

### Kontakt (`Contact`)

Kontakt má povinné jméno, příjmení, platný e-mail a obchodní stav. Telefon, firma a datum dalšího kontaktování jsou volitelné. E-mail záměrně není unikátní, aby toto pravidlo zůstalo úkolem pro navazující školení. Kontakt může existovat bez firmy a má libovolný počet aktivit.

Povolené stavy:

- `NEW` – nový
- `CONTACTED` – kontaktovaný
- `QUALIFIED` – kvalifikovaný
- `PROPOSAL` – nabídka
- `WON` – vyhráno
- `LOST` – prohráno

### Aktivita (`Activity`)

Aktivita vždy patří jednomu kontaktu a obsahuje typ, neprázdný text a datum uskutečnění. Při odstranění kontaktu se odstraní i jeho aktivity.

Povolené typy:

- `NOTE` – poznámka
- `CALL` – hovor
- `EMAIL` – e-mail
- `MEETING` – schůzka

## Základní pravidla

- Vstupy se validují na serveru sdílenými Zod schématy; HTML formuláře přidávají základní klientská omezení.
- Aktivity se na detailu zobrazují od nejnovější podle `occurredAt`.
- Seznam kontaktů lze prohledávat podle jména, příjmení nebo e-mailu a filtrovat podle stavu a firmy.
- Pole `nextContactAt` je součástí modelu a formuláře, ale filtrování či zvýraznění kontaktů po termínu je záměrně mimo první verzi.
- Seed nastavuje plánované kontakty relativně 2–25 dní do budoucnosti; testovací fixtures používají pevná data a nesmí záviset na okamžiku spuštění.
