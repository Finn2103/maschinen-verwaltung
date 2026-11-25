In diesem Dokument sammle ich, welche Felder ein Kunde braucht, welche Möglichkeiten es dafür gibt, und was ich dem Entwickler empfehle.

Aufgabe: Anlegen und Bearbeiten mit Pflichtfeldern; Rechnungs- und Lieferadresse sind getrennt erfassbar.

Die Namen sind wie im Schema: deutsch, klein, Einzahl, Umlaute als ae/oe/ue (ERD-Entscheidung 8). Felder, die es in `kunde` schon gibt, heißen hier genauso: `kundennummer`, `name`, `strasse`, `plz`, `ort`, `email`, `telefon`.

Wo mein Vorschlag vom Schema oder vom Formular aus #1 abweicht, steht es unten als Frage.

## 1. Kunde (Stammdaten)

### Kundennummer (Pflicht, wird vom System vergeben)

- Beispiel: K001
- Notiz: Eindeutig, aufsteigend, danach nicht mehr änderbar. Gelöschte Kunden geben die Nummer nicht wieder frei. Lücken sind in Ordnung, die entstehen bei abgebrochenen Anlagen oder gelöschten Kunden.
- Möglichkeiten: die Datenbank vergibt sie (Sequence oder Auto-Increment), oder der Code rechnet „höchste Nummer + 1“.
- Im Schema ist das schon entschieden: die Datenbank vergibt sie, und sie ist der Primary Key. „Höchste + 1“ im Code würde kollidieren, wenn zwei Kunden gleichzeitig angelegt werden.
- Datentyp: INT, im Schema `bigint`. Auf den Dokumenten kann davor ein K stehen.
- Möglicher Name: `kundennummer`, heißt in `kunde` schon so

### Kundentyp (Pflicht)

- Beispiel: `privat` / `unternehmen`
- Notiz: Braucht man für Steuerregeln und die Rechnung. Daran hängt auch, welche anderen Felder Pflicht sind (siehe Unternehmensname).
- Empfehlung: den Typ nach dem Anlegen nicht mehr ändern. Von `privat` auf `unternehmen` einen neuen Account anlegen, der alte bleibt stehen. Ob das noch nötig ist, steht unten als Frage.
- Mögliche Datentypen: STRING, ENUM
- Empfehlung Datentyp: ENUM
- Möglicher Name: `kundentyp`

### Unternehmensname (Pflicht bei `unternehmen`, bei `privat` leer)

- Beispiel: Mustermann GmbH
- Notiz: Steht auf der Rechnung. Ein Privatkunde hat keinen, deshalb nur bei `unternehmen` Pflicht.
- Mögliche Datentypen: STRING
- Empfehlung Datentyp: STRING
- Möglicher Name: `unternehmensname`

### Unternehmensform (Keine Pflicht, nur bei `unternehmen`)

- Beispiel: Einzelunternehmen, Freiberufler, e.K., GmbH, UG, AG, GbR
- Möglichkeiten: Freitext, oder eine Relation auf eine Tabelle. In der Tabelle kann man pflegen, welche Formen es je Land gibt und wo das Produkt angeboten wird.
- Empfehlung: Relation. Einzelunternehmen, Freiberufler und e.K. als eigene Typen aufnehmen, nicht nur GmbH, UG, AG, GbR. Die stehen oft nicht im Namen, deshalb nicht aus dem Namen lesen. Keine Pflicht, die Form kann später gesetzt werden.
- Mögliche Datentypen: STRING, RELATION
- Empfehlung Datentyp: RELATION
- Möglicher Name: `unternehmensform`

### USt-IdNr. (Keine Pflicht, nur bei `unternehmen`)

- Beispiel: DE123456789, ATU12345678
- Notiz: Bei `privat` leer. Genauer in Rechnung-und-Steuer.md. Wenn eine Nummer da ist, das Format prüfen: Ländercode, keine Leerzeichen, keine Punkte, keine Bindestriche. Gesetzte Nummern über alle Kunden eindeutig, auch über gelöschte. Leer darf mehrfach leer bleiben. Eigenes Feld, nicht die Steuernummer. Ein Wert im einen Feld gilt nicht für das andere.
- Mögliche Datentypen: STRING
- Empfehlung Datentyp: STRING
- Möglicher Name: `ust_idnummer`. Aus „Nr.“ wird im Schema „nummer“.

### Steuernummer (Keine Pflicht, nur bei `unternehmen`)

- Beispiel: 12/345/67890
- Notiz: Vergibt das Finanzamt. Viele kleine Unternehmen haben nur die und keine USt-IdNr. Bei `privat` leer. Für eine normale Inlandrechnung braucht man die Steuernummer des Kunden nicht. Kein Weltstandard, das Format hängt vom Bundesland ab, oft mit Schrägstrichen oder 13-stellig. In anderen Ländern wieder anders.
- Möglichkeiten: INT oder STRING.
- Empfehlung: STRING, nur grob prüfen, ob Ziffern und Schrägstriche drinstehen. INT verschluckt führende Nullen und kann die Schrägstriche nicht.
- Mögliche Datentypen: STRING
- Empfehlung Datentyp: STRING
- Möglicher Name: `steuernummer`

### Sprache (Keine Pflicht, Default = Sprache passend zum Land der Rechnungsadresse)

- Beispiel: de
- Notiz: ISO 639-1, zwei Zeichen. Im Formular der Sprachname, gespeichert der Code. https://de.wikipedia.org/wiki/ISO_639-1
- Empfehlung Datentyp: STRING
- Möglicher Name: `sprache`

### Status (Pflicht, wird vom System gesetzt, Default = `aktiv`)

- Beispiel: `aktiv` / `pruefen` / `gesperrt` / `geloescht`
- Möglichkeiten: den Kunden hart löschen, oder einen Status setzen.
- Empfehlung: nicht hart löschen. Rechnungen müssen 8 Jahre aufbewahrt werden, und die Kundennummer wird nicht wieder frei. `geloescht` ist deshalb nur ein Status. `pruefen`, wenn noch Angaben fehlen, zum Beispiel eine unklare Adresse oder eine ausstehende Rückmeldung. Default `aktiv`. Der Status steht nicht im Formular, den setzt der Server.
- Mögliche Datentypen: STRING, ENUM
- Empfehlung Datentyp: ENUM
- Möglicher Name: `status`, wie bei der Ausleihe

### Angelegt am / Geändert am (Pflicht, wird vom System gesetzt)

- Beispiel: 2026-11-14 10:32:00
- Notiz: Wann der Kunde angelegt und zuletzt bearbeitet wurde. Steht nicht im Formular, setzt der Server. Beides steht auch im Protokoll, siehe Aenderungsprotokoll.md.
- Mögliche Datentypen: DATETIME, TIMESTAMP
- Empfehlung Datentyp: TIMESTAMP
- Mögliche Namen: `angelegt_am`, `geaendert_am`, so wie `storniert_am` im Schema

## 2. Ansprechpartner

Bei `privat` ist das der Kunde selbst. Bei `unternehmen` der Ansprechpartner für Rechnung, Buchhaltung, Prokurist, oder bei einem kleinen Unternehmen der Geschäftsführer.

### Anrede (Keine Pflicht, Default = `neutral`)

- Beispiel: Herr, Frau, neutral
- Notiz: Für E-Mails und Nachrichten. Drei Werte reichen: Herr, Frau, oder keine Anrede. `neutral` heißt, die Anrede fällt weg und es wird etwas Generisches draus, zum Beispiel „Guten Tag Max Mustermann“. Ein extra Feld fürs Geschlecht ist dieselbe Angabe noch einmal, das braucht es nicht.
- Mögliche Datentypen: STRING, ENUM, RELATION
- Empfehlung Datentyp: ENUM (`herr`, `frau`, `neutral`)
- Möglicher Name: `anrede`

### Vorname (Pflicht)

- Beispiel: Max
- Notiz: Im Schema gibt es heute nur `name` für den ganzen Namen. Siehe Fragen unten.
- Mögliche Datentypen: STRING
- Empfehlung Datentyp: STRING
- Möglicher Name: `vorname`

### Nachname (Pflicht)

- Beispiel: Mustermann
- Notiz: Getrennt vom Vornamen, sonst funktionieren „Guten Tag Herr Mustermann“ und eine Sortierung nach Nachname nicht.
- Mögliche Datentypen: STRING
- Empfehlung Datentyp: STRING
- Möglicher Name: `nachname`

### Mail Adressen

Möglichkeiten: ein festes zweites Feld nur für die Rechnungsmail, oder jede Mail mit einem Typ.

Empfehlung: der Typ. Dann kommt später eine weitere Art dazu, ohne ein neues Feld.

- Mindestens eine Mail ist Pflicht, Typ `kontakt`, zum Beispiel max.mustermann@example.com. Im Schema ist `email` auch Pflicht.
- Weitere Mails sind keine Pflicht.
- ENUM: `kontakt`, `rechnung`, `disposition`. Weitere Werte kann man ergänzen.
- `rechnung` ist die Buchhaltung, zum Beispiel buchhaltung@example.com. Fehlt sie, geht die Rechnung an `kontakt`.
- `disposition` ist Übergabe, Rückgabe und Störungen, zum Beispiel disposition@example.com. Fehlt sie, geht das an `kontakt`.
- Jede Mail beim Anlegen und Bearbeiten auf ein gültiges Format prüfen. Eine Mail hat einen Typ. Dieselbe Adresse darf am selben Kunden für einen zweiten Typ noch einmal stehen. Bei einem anderen Kunden nicht, auch nicht bei einem gelöschten. Groß und Klein sind dabei egal.
- Empfehlung Datentyp: RELATION (Kunde zu Mails) und ENUM für den Typ
- Mögliche Namen: Relation `kundenmail` mit `email` und `typ`

### Telefonnummer (Pflicht)

- Beispiel: +49 151 23456789
- Notiz: Für Übergabe, Rückgabe und Störungen. Mit Ländervorwahl. Pflicht, so steht es im Schema und im Reservierungsformular aus #1.
- Möglichkeiten: INT oder STRING.
- Empfehlung: STRING. INT kann das Plus und führende Nullen nicht.
- Mögliche Datentypen: STRING
- Empfehlung Datentyp: STRING
- Möglicher Name: `telefon`, heißt in `kunde` schon so

## 3. Adressen

Die Adresse ist am Kunden keine Pflicht. Das Reservierungsformular aus #1 fragt keine ab. Deshalb dürfen `strasse`, `plz` und `ort` im Schema leer sein. Ohne Adresse gibt es aber keine Rechnung, das lehnt der Trigger an `rechnung` ab (`docs/datenmodell/relational.md`, 4.5). Spätestens vor der ersten Rechnung muss die Rechnungsadresse also da sein.

Möglichkeiten: zwei getrennte Feldlisten für Rechnung und Lieferung, eine Adresstabelle mit beliebig vielen Zeilen, oder dieselben Felder einmal und ein Typ daran.

Empfehlung: dieselben Felder, Typ `rechnung` oder `lieferung`. Pro Kunde höchstens eine Adresse je Typ. Keine Liste von Baustellen. Was das für das Schema heißt, steht unten bei den Fragen.

### Typ (ENUM)

- `rechnung`, keine Pflicht, höchstens eine. Für die Rechnung braucht man sie aber, die vollständige Anschrift ist eine Pflichtangabe auf der Rechnung (§14 UStG).
- `lieferung`, keine Pflicht, höchstens eine. Im Formular über „Lieferadresse weicht von Rechnungsadresse ab“. Ist keine `lieferung` erfasst, gilt `rechnung` auch als Lieferadresse. Beim Maschinenverleih ist das oft der Einsatzort, zum Beispiel eine Baustelle.

- Empfehlung Datentyp: die Adressfelder einmal, ENUM für den Typ (`rechnung`, `lieferung`)
- Mögliche Namen: Relation `kundenadresse` mit `typ`

Felder je Adresse, gelten für beide Typen. Pflicht heißt hier: Pflicht, sobald die Adresse erfasst wird.

### Straße und Hausnummer (Pflicht)

- Beispiel: Musterstraße 12a
- Notiz: Ein Feld. Im Ausland ist die Reihenfolge anders, in Frankreich zum Beispiel „12 rue de la Paix“.
- Empfehlung Datentyp: STRING
- Möglicher Name: `strasse`, heißt in `kunde` schon so

### Adresszusatz (Keine Pflicht)

- Beispiel: Gebäude B, 3. Stock / Baustelle Tor 3
- Empfehlung Datentyp: STRING
- Möglicher Name: `adresszusatz`

### Postleitzahl (Pflicht)

- Beispiel: 01067
- Empfehlung: STRING. INT verliert die führende Null (01067 Dresden) und kann Buchstaben in ausländischen Postleitzahlen nicht.
- Empfehlung Datentyp: STRING
- Möglicher Name: `plz`, heißt in `kunde` schon so

### Ort (Pflicht)

- Beispiel: Dresden
- Empfehlung Datentyp: STRING
- Möglicher Name: `ort`, heißt in `kunde` schon so

### Land (Pflicht)

- Beispiel: DE
- Notiz: ISO 3166-1, zwei Zeichen. Im Formular der Ländername, gespeichert der Code. https://de.wikipedia.org/wiki/ISO_3166
- Empfehlung Datentyp: STRING
- Möglicher Name: `land`

### Abweichender Empfänger (Keine Pflicht, nur bei `lieferung`)

- Beispiel: Bauleitung, Frau Weber
- Notiz: Falls die Maschine vor Ort von jemand anderem angenommen wird.
- Empfehlung Datentyp: STRING
- Möglicher Name: `empfaenger_name`, wie an der Rechnung

## 4. Empfehlung fürs Anlegen und Bearbeiten

- Pflichtfelder beim Anlegen und beim Bearbeiten prüfen. Solange eines fehlt, wird nicht gespeichert.
- Die Prüfung liegt auf dem Server. Das Formular darf den Fehler früher zeigen. Empfehlung für die Formularprüfung im ganzen Produkt: Zod (https://zod.dev). Dasselbe Schema im Formular und beim Speichern auf dem Server. Maßgeblich ist der Server.
- Kundennummer, Status, Angelegt am und Geändert am sind keine Formularfelder. Die setzt der Server.
- Den Kundentyp am bestehenden Kunden nicht von `privat` auf `unternehmen` ändern. Dafür einen neuen Account, der alte bleibt. Am neuen Account ist der Unternehmensname Pflicht. Ob es den neuen Account braucht, steht unten als Frage.
- Steuernummer und USt-IdNr. sind zwei Felder. Beide nur bei `unternehmen`, bei `privat` leer. Keines ist beim Anlegen Pflicht. Ein Wert erfüllt das andere Feld nicht.
- Telefon und eine Mail sind beim Anlegen Pflicht, die Adresse nicht (#1). Die Rechnungsadresse kann später dazu, spätestens vor der ersten Rechnung. Eine Lieferadresse kann dazu, geändert oder wieder entfernt werden. Einen zweiten Eintrag desselben Typs gibt es nicht.
- Ist eine Adresse erfasst, gelten für `rechnung` und `lieferung` dieselben Pflichtfelder.
- Eine Adressänderung darf eine schon gestellte Rechnung nicht verändern. Die Rechnung behält die Adresse vom Zeitpunkt der Rechnungsstellung als Kopie. Im Schema sind das die Spalten `empfaenger_…` an `rechnung` (relational.md 3.4).

## 5. Fragen

Hier weicht mein Vorschlag vom Schema oder vom Formular aus #1 ab. Das will ich nicht allein festlegen.

- **Vorname, Nachname, Kundentyp.** Das Formular aus #1 legt den Kunden nur mit `name`, `email` und `telefon` an. Sollen die drei Felder Pflicht werden? Dann müsste das Formular sie abfragen.
- **Neuer Account beim Wechsel auf `unternehmen`.** Das Protokoll aus #99 hält den Wechsel fest, und gestellte Rechnungen behalten ihre Kopie. Brauchen wir den neuen Account dann noch?
- **Adresse in einer eigenen Relation.** Der Trigger an `rechnung` liest die Adresse heute aus `kunde`. Die Kopie an der Rechnung hat kein Land und keinen Adresszusatz, die Steuer hängt aber am Land. Sollen Trigger und Kopie mit angepasst werden?
- **Löschen und DSGVO.** Kunden mit Status `geloescht` behalten ihre Daten. Nach DSGVO braucht es irgendwann Löschung oder Anonymisierung. Die Aufbewahrung (8 Jahre, § 147 AO / GoBD) gilt für die Rechnung, und die hat ohnehin eine eigene Kopie der Adresse. Ab wann und wie gelöschte Kunden anonymisiert werden, ist offen.
