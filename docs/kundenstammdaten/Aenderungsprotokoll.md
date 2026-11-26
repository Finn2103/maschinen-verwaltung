In diesem Dokument schreibe ich auf, was ich zum Protokollieren von Änderungen gefunden habe, und wie #7 auf dem Protokoll aus #99 aufbaut.

Aufgabe: Jede Änderung wird mit Zeitpunkt, Benutzer, Feld, altem und neuem Wert protokolliert.

Die GoBD lassen offen, wie man das technisch macht. Genannt werden Sperren, eine Festschreibung, ein Löschmerkmal, eine automatische Protokollierung oder eine Versionierung. Auch über Zugriffsrechte geht es. Ein normaler Ordner, in dem man Dateien einfach überschreibt, reicht nicht. Steht so in den GoBD, Randziffer 110. Spätere Änderungen müssen den alten Inhalt sichtbar lassen, und die Historie selbst darf hinterher nicht mehr verändert werden (Randziffer 111).

## Was es schon gibt

Seit #99 gibt es die Tabelle `protokoll` mit einem Trigger (`docs/datenmodell/relational.md`, 4.10). Am Kunden hängt er schon, er heißt `kunde_protokollieren`. Er schreibt in derselben Transaktion wie die Änderung. Bricht die Änderung ab, gibt es auch keinen Eintrag.

Pro geändertem Feld steht eine Zeile da:

- Zeitpunkt, `zeitpunkt`. Setzt die Datenbank.
- Benutzer, `benutzer_id`. Leer heißt, es war niemand angemeldet.
- Feld, `feld`. Das ist der Spaltenname. Die Oberfläche zeigt dafür den Namen aus dem Formular.
- alter Wert, `alt`
- neuer Wert, `neu`
- dazu `objekt` mit dem Wert `kunde` und `objekt_id` mit der Kundennummer

Damit ist alles aus der Aufgabe abgedeckt.

Den Typ der Änderung habe ich in Beispielen als `row_created`, `row_edited` und `row_deleted` gefunden. Bei uns steht er schon im Schema:

- Anlegen: eine Zeile mit `feld = 'Datensatz angelegt'`
- Ändern: eine Zeile je geändertem Feld, mit `alt` und `neu`
- Löschen: eine Zeile mit `feld = 'Datensatz gelöscht'`, der alte Datensatz steht in `alt`. Ein Kunde wird aber nicht hart gelöscht (Pflichtfelder.md). Bei uns ist das eine Änderung von `status` auf `geloescht`.

So sieht eine Zeile aus, wenn bei K017 die Straße geändert wird:

| `zeitpunkt` | `benutzer_id` | `objekt` | `objekt_id` | `feld` | `alt` | `neu` |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-11-18 10:32:00+01 | ID des Mitarbeiters | `kunde` | `17` | `strasse` | Musterstraße 12 | Musterstraße 12a |

Den Verlauf eines Kunden sieht das Personal, also wer `protokoll.datensatz` hat. Der Kunde sieht ihn nicht (`docs/rollen-und-rechte.md`).

**Unveränderbar.** Ein Trigger lehnt Ändern und Löschen auf `protokoll` ab, wie bei den Rechnungen. Wer neue Zeilen schreiben darf, regeln die Datenbank-Rechte. Die sind noch offen (F15, #8).

## Was für #7 dazukommt

**Neue Spalten am Kunden.** Der Trigger vergleicht alle Spalten. Was aus Pflichtfelder.md an `kunde` dazukommt, landet also von selbst im Protokoll.

**Neue Relationen.** Liegen Adressen und Mails in eigenen Relationen (`kundenadresse`, `kundenmail`), braucht jede denselben Trigger. Außerdem muss `protokoll.objekt` sie zulassen. Heute erlaubt es nur `maschine`, `ausleihe`, `kunde`, `rechnung` und `bestellung`. Sonst fehlt eine Adressänderung im Protokoll. Offen ist, was dann in `objekt_id` steht, zum Beispiel die Kundennummer.

**`geaendert_am`.** Das Feld ändert sich bei jedem Speichern mit. Steht es am Kunden, schreibt der Trigger zu jeder echten Änderung eine zweite Zeile, nur für die Uhrzeit. Möglichkeiten: der Trigger lässt die Spalte aus, oder die Spalte fällt weg und man liest den Zeitpunkt aus dem Protokoll. Das gehört zum Schema und ist offen. `angelegt_am` ändert sich nach dem Anlegen nicht mehr, das macht keine zweite Zeile.

## Unveränderbarer Speicher außerhalb der Datenbank

**Amazon S3 mit Object Lock.** Passt nicht zu ADR 0006: Dort läuft alles auf der eigenen Strato-VM, nicht bei einem fremden Dienst.

Ob es so einen Speicher überhaupt braucht und wo er liegt, ist eine Architekturfrage. Dafür braucht es ein eigenes ADR. Für #7 baue ich auf der Tabelle `protokoll` auf.

## Empfehlung an den Entwickler

Kein eigenes Protokoll für Kunden bauen. `kunde_protokollieren` schreibt schon jede Änderung am Kunden. Kommen Relationen für Adresse und Mail dazu, an jede denselben Trigger hängen und `protokoll.objekt` erweitern.

Die Kopie auf einer schon gestellten Rechnung ist ein anderes Thema, die bleibt auf der Rechnung. Wird aus einem Privatkunden ein Unternehmen und es gibt dafür einen neuen Account, bleibt das alte Protokoll am alten Account.

## Quellen

- [GoBD, Fassung vom 28.11.2019, geändert am 11.03.2024 und 14.07.2025](https://ao.bundesfinanzministerium.de/ao/2025/Anhaenge/BMF-Schreiben-und-gleichlautende-Laendererlasse/Anhang-33/inhalt.html), Randziffer 108 bis 111
- [`docs/datenmodell/relational.md`](../datenmodell/relational.md), 4.8 und 4.10, und [`schema.sql`](../datenmodell/schema.sql), Tabelle `protokoll`
- [ADR 0006: Datenhaltung](../adr/0006-datenhaltung.md)
