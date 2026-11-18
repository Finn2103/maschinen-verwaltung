In diesem Dokument sammle ich, welche Felder ein Kunde braucht, welche Möglichkeiten es dafür gibt, und was ich dem Entwickler empfehle.

Aufgabe: Anlegen und Bearbeiten mit Pflichtfeldern; Rechnungs- und Lieferadresse sind getrennt erfassbar.

## 1. Kunde (Stammdaten)

### Kundennummer (Pflicht, wird vom System vergeben)

- Beispiel: K001
- Notiz: Eindeutig, aufsteigend, danach nicht mehr änderbar. Gelöschte Kunden geben die Nummer nicht wieder frei. Lücken sind in Ordnung, die entstehen bei abgebrochenen Anlagen oder gelöschten Kunden. Weil sie eindeutig und unveränderlich ist, kann sie auch der Primary Key sein.
- Möglichkeiten: die Datenbank vergibt sie (Sequence oder Auto-Increment), oder der Code rechnet „höchste Nummer + 1“.
- Empfehlung: Sequence oder Auto-Increment. „Höchste + 1“ im Code kollidiert, wenn zwei Kunden gleichzeitig angelegt werden.
- Mögliche Datentypen: INT, STRING
- Empfehlung Datentyp: INT. Auf den Dokumenten kann davor ein K stehen.
- Möglicher Name: `customerId`

### Kundentyp (Pflicht)

- Beispiel: "PRIVAT" / "BUSINESS"
- Notiz: Braucht man für Steuerregeln und die Rechnung. Daran hängt auch, welche anderen Felder Pflicht sind (siehe Unternehmensname).
- Empfehlung: den Typ nach dem Anlegen nicht mehr ändern. Von PRIVAT auf BUSINESS einen neuen Account anlegen, der alte bleibt stehen. Sonst ist die Historie für GoBD nicht mehr nachvollziehbar.
- Mögliche Datentypen: STRING, ENUM
- Empfehlung Datentyp: ENUM
- Möglicher Name: `customerType`

### Unternehmensname (Pflicht bei BUSINESS, bei PRIVAT leer)

- Beispiel: Unternehmensname
- Notiz: Steht auf der Rechnung. Ein Privatkunde hat keinen, deshalb nur bei BUSINESS Pflicht.
- Mögliche Datentypen: STRING
- Empfehlung Datentyp: STRING
- Möglicher Name: `companyName`

### Unternehmensform (Keine Pflicht, nur bei BUSINESS)

- Beispiel: Einzelunternehmen, Freiberufler, e.K., GmbH, UG, AG, GbR
- Möglichkeiten: Freitext, oder eine Relation auf eine Tabelle. In der Tabelle kann man pflegen, welche Formen es je Land gibt und wo das Produkt angeboten wird.
- Empfehlung: Relation. Einzelunternehmen, Freiberufler und e.K. als eigene Typen aufnehmen, nicht nur GmbH, UG, AG, GbR. Die stehen oft nicht im Namen, deshalb nicht aus dem Namen lesen. Keine Pflicht, die Form kann später gesetzt werden.
- Mögliche Datentypen: STRING, RELATION
- Empfehlung Datentyp: RELATION
- Möglicher Name: `customerLegalForm`

### USt-IdNr. (Keine Pflicht, nur bei BUSINESS)

- Beispiel: DE123456789, ATU12345678
- Notiz: Bei PRIVAT leer. Genauer in Rechnung-und-Steuer.md. Wenn eine Nummer da ist, das Format prüfen: Ländercode, keine Leerzeichen, keine Punkte, keine Bindestriche. Gesetzte Nummern über alle Kunden eindeutig, auch über gelöschte. Leer darf mehrfach leer bleiben. Eigenes Feld, nicht die Steuernummer. Ein Wert im einen Feld gilt nicht für das andere.
- Mögliche Datentypen: STRING
- Empfehlung Datentyp: STRING
- Möglicher Name: `customerVatId`

### Steuernummer (Keine Pflicht, nur bei BUSINESS)

- Beispiel: 12/345/67890
- Notiz: Vergibt das Finanzamt. Viele kleine Unternehmen haben nur die und keine USt-IdNr. Bei PRIVAT leer. Für eine normale Inlandrechnung braucht man die Steuernummer des Kunden nicht. Kein Weltstandard, das Format hängt vom Bundesland ab, oft mit Schrägstrichen oder 13-stellig. In anderen Ländern wieder anders.
- Möglichkeiten: INT oder STRING.
- Empfehlung: STRING, nur grob prüfen, ob Ziffern und Schrägstriche drinstehen. INT verschluckt führende Nullen und kann die Schrägstriche nicht.
- Mögliche Datentypen: STRING
- Empfehlung Datentyp: STRING
- Möglicher Name: `customerTaxNumber`

### Sprache (Keine Pflicht, Default = Sprache passend zum Land der Rechnungsadresse)

- Beispiel: de
- Notiz: ISO 639-1, zwei Zeichen. Im Formular der Sprachname, gespeichert der Code. https://de.wikipedia.org/wiki/ISO_639-1
- Empfehlung Datentyp: STRING
- Möglicher Name: `customerLanguage`

### Status (Pflicht, wird vom System gesetzt, Default = ACTIVE)

- Beispiel: "ACTIVE" / "REVIEW" / "BLOCKED" / "DELETED"
- Möglichkeiten: den Kunden hart löschen, oder einen Status setzen.
- Empfehlung: nicht hart löschen. Rechnungen müssen 8 Jahre aufbewahrt werden, und die Kundennummer wird nicht wieder frei. DELETED ist deshalb nur ein Status. REVIEW, wenn noch Angaben fehlen, zum Beispiel eine unklare Adresse oder eine ausstehende Rückmeldung. Default ACTIVE. Der Status steht nicht im Formular, den setzt der Server.
- Mögliche Datentypen: STRING, ENUM
- Empfehlung Datentyp: ENUM
- Möglicher Name: `customerStatus`

### Angelegt am / Geändert am (Pflicht, wird vom System gesetzt)

- Beispiel: 2026-11-14 10:32:00
- Notiz: Wann der Kunde angelegt und zuletzt bearbeitet wurde. Steht nicht im Formular, setzt der Server.
- Mögliche Datentypen: DATETIME, TIMESTAMP
- Empfehlung Datentyp: TIMESTAMP
- Mögliche Namen: `createdAt`, `updatedAt`

## 2. Ansprechpartner

Bei PRIVAT ist das der Kunde selbst. Bei BUSINESS der Ansprechpartner für Rechnung, Buchhaltung, Prokurist, oder bei einem kleinen Unternehmen der Geschäftsführer.

### Anrede (Keine Pflicht, Default = NEUTRAL)

- Beispiel: "Herr", "Frau", neutral
- Notiz: Für E-Mails und Nachrichten. Drei Werte reichen: Herr, Frau, oder keine Anrede. NEUTRAL heißt, die Anrede fällt weg und es wird etwas Generisches draus, zum Beispiel „Guten Tag Nico Laeser“. Ein extra Feld fürs Geschlecht ist dieselbe Angabe noch einmal, das braucht es nicht.
- Mögliche Datentypen: STRING, ENUM, RELATION
- Empfehlung Datentyp: ENUM (MR, MS, NEUTRAL)
- Möglicher Name: `customerSalutation`

### Vorname (Pflicht)

- Beispiel: Nico
- Mögliche Datentypen: STRING
- Empfehlung Datentyp: STRING
- Möglicher Name: `customerFirstName`

### Nachname (Pflicht)

- Beispiel: Laeser
- Notiz: Getrennt vom Vornamen, sonst funktionieren „Guten Tag Herr Laeser“ und eine Sortierung nach Nachname nicht.
- Mögliche Datentypen: STRING
- Empfehlung Datentyp: STRING
- Möglicher Name: `customerLastName`

### Mail Adressen

Möglichkeiten: ein festes zweites Feld nur für die Rechnungsmail, oder jede Mail mit einem Typ.

Empfehlung: der Typ. Dann kommt später eine weitere Art dazu, ohne ein neues Feld.

- Mindestens eine Mail ist Pflicht, Typ CONTACT, zum Beispiel markus@example.com.
- Weitere Mails sind keine Pflicht.
- ENUM: CONTACT, INVOICE, OPERATIONS. Weitere Werte kann man ergänzen.
- INVOICE ist die Buchhaltung, zum Beispiel buchhaltung@example.com. Fehlt sie, geht die Rechnung an CONTACT.
- OPERATIONS ist Übergabe, Rückgabe und Störungen, zum Beispiel disposition@example.com. Fehlt sie, geht das an CONTACT.
- Jede Mail beim Anlegen und Bearbeiten auf ein gültiges Format prüfen. Eine Mail hat einen Typ. Dieselbe Adresse darf am selben Kunden für einen zweiten Typ noch einmal stehen. Bei einem anderen Kunden nicht, auch nicht bei einem gelöschten. Groß und Klein sind dabei egal.
- Empfehlung Datentyp: RELATION (Kontakt zu Mails) und ENUM für den Typ
- Mögliche Namen: `customerMail`, `mailType`

### Telefonnummer (Keine Pflicht, aber empfohlen)

- Beispiel: +49 151 23456789
- Notiz: Für Übergabe, Rückgabe und Störungen. Mit Ländervorwahl.
- Möglichkeiten: INT oder STRING.
- Empfehlung: STRING. INT kann das Plus und führende Nullen nicht.
- Mögliche Datentypen: STRING
- Empfehlung Datentyp: STRING
- Möglicher Name: `customerPhone`

## 3. Adressen

Möglichkeiten: zwei getrennte Feldlisten für Rechnung und Lieferung, eine Adresstabelle mit beliebig vielen Zeilen, oder dieselben Felder einmal und ein Typ daran.

Empfehlung: dieselben Felder, Typ BILLING oder DELIVERY. Pro Kunde höchstens eine Adresse je Typ. Keine Liste von Baustellen.

### Typ (ENUM)

- BILLING, Pflicht, genau eine. Die vollständige Anschrift ist eine Pflichtangabe auf der Rechnung (§14 UStG).
- DELIVERY, keine Pflicht, höchstens eine. Im Formular über „Lieferadresse weicht von Rechnungsadresse ab“. Ist keine DELIVERY erfasst, gilt BILLING auch als Lieferadresse. Beim Maschinenverleih ist das oft der Einsatzort, zum Beispiel eine Baustelle.

- Empfehlung Datentyp: die Adressfelder einmal, ENUM für den Typ (BILLING, DELIVERY)
- Mögliche Namen: `customerAddress`, `addressType`

Felder je Adresse, gelten für beide Typen:

### Straße und Hausnummer (Pflicht)

- Beispiel: Musterstraße 12a
- Notiz: Ein Feld. Im Ausland ist die Reihenfolge anders, in Frankreich zum Beispiel „12 rue de la Paix“.
- Empfehlung Datentyp: STRING
- Möglicher Name: `street`

### Adresszusatz (Keine Pflicht)

- Beispiel: Gebäude B, 3. Stock / Baustelle Tor 3
- Empfehlung Datentyp: STRING
- Möglicher Name: `addressAddition`

### Postleitzahl (Pflicht)

- Beispiel: 01067
- Empfehlung: STRING. INT verliert die führende Null (01067 Dresden) und kann Buchstaben in ausländischen Postleitzahlen nicht.
- Empfehlung Datentyp: STRING
- Möglicher Name: `postalCode`

### Ort (Pflicht)

- Beispiel: Dresden
- Empfehlung Datentyp: STRING
- Möglicher Name: `city`

### Land (Pflicht)

- Beispiel: DE
- Notiz: ISO 3166-1, zwei Zeichen. Im Formular der Ländername, gespeichert der Code. https://de.wikipedia.org/wiki/ISO_3166
- Empfehlung Datentyp: STRING
- Möglicher Name: `countryCode`

### Abweichender Empfänger (Keine Pflicht, nur bei DELIVERY)

- Beispiel: Bauleitung Max Mustermann
- Notiz: Falls die Maschine vor Ort von jemand anderem angenommen wird.
- Empfehlung Datentyp: STRING
- Möglicher Name: `recipientName`

## 4. Empfehlung fürs Anlegen und Bearbeiten

- Pflichtfelder beim Anlegen und beim Bearbeiten prüfen. Solange eines fehlt, wird nicht gespeichert.
- Die Prüfung liegt auf dem Server. Das Formular darf den Fehler früher zeigen. Empfehlung für die Formularprüfung im ganzen Produkt: Zod (https://zod.dev). Dasselbe Schema im Formular und beim Speichern auf dem Server. Maßgeblich ist der Server.
- Kundennummer, Status, Angelegt am und Geändert am sind keine Formularfelder. Die setzt der Server.
- Den Kundentyp am bestehenden Kunden nicht von PRIVAT auf BUSINESS ändern. Dafür einen neuen Account, der alte bleibt. So bleibt es für GoBD nachvollziehbar. Am neuen Account ist der Unternehmensname Pflicht.
- Steuernummer und USt-IdNr. sind zwei Felder. Beide nur bei BUSINESS, bei PRIVAT leer. Keines ist beim Anlegen Pflicht. Ein Wert erfüllt das andere Feld nicht.
- Ohne BILLING keinen Kunden anlegen. DELIVERY kann dazu, geändert oder wieder entfernt werden. Einen zweiten Eintrag desselben Typs gibt es nicht.
- Ist eine DELIVERY erfasst, gelten dort dieselben Pflichtfelder wie bei BILLING.
- Eine Adressänderung darf eine schon gestellte Rechnung nicht verändern. Die Rechnung behält die Adresse vom Zeitpunkt der Rechnungsstellung als Kopie.
