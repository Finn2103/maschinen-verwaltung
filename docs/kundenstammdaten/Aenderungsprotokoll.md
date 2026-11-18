In diesem Dokument schreibe ich auf, was ich zum Protokollieren von Änderungen gefunden habe. Der Entwickler soll die Möglichkeiten sehen und danach die Empfehlung.

Aufgabe: Jede Änderung wird mit Zeitpunkt, Benutzer, Feld, altem und neuem Wert protokolliert.

Die GoBD lassen offen, wie man das technisch macht. Genannt werden Sperren, eine Festschreibung, ein Löschmerkmal, eine automatische Protokollierung oder eine Versionierung. Auch über Zugriffsrechte geht es. Ein normaler Ordner, in dem man Dateien einfach überschreibt, reicht nicht. Steht so in den GoBD, Randziffer 110. Spätere Änderungen müssen den alten Inhalt sichtbar lassen, und die Historie selbst darf hinterher nicht mehr verändert werden (Randziffer 111).

## Was in einer Zeile üblich ist

In den Beispielen, die ich gesehen habe, steht pro geändertem Feld eine Zeile:

- Zeitpunkt
- Benutzer
- Feld
- alter Wert
- neuer Wert

Dazu ein Typ der Änderung. Die Namen, die ich dafür gefunden habe, sind `row_created`, `row_edited` und `row_deleted`.

- `row_created`: der Datensatz wird angelegt, der alte Wert ist leer
- `row_edited`: ein Feld ändert sich
- `row_deleted`: der Datensatz wird gelöscht oder, bei uns, der Status geht auf `DELETED`

`updatedAt` taucht in solchen Protokollen als Problem auf. Das Feld ändert sich bei jedem Speichern mit, dann bekommt man zu jeder echten Änderung eine zweite Zeile nur für die Uhrzeit. Dieselbe Falle ist `createdAt`, der Zeitpunkt steht ja schon an der Protokollzeile.

So ungefähr sieht so eine Zeile aus:

```json
{
  "customerId": "K017",
  "changedAt": "2026-11-18T10:32:00Z",
  "userId": "u42",
  "userName": "Nico Laeser",
  "changeType": "row_edited",
  "field": "address.BILLING.street",
  "oldValue": "Musterstraße 12",
  "newValue": "Musterstraße 12a"
}
```

## Wohin die Zeile geht

Zwei Stellen, dieselbe Zeile.

**Protokolltabelle.** Die Anwendung schreibt die Zeile beim Speichern in eine eigene Tabelle. Darauf nur Anlegen, kein Ändern und kein Löschen. Darüber sieht man die Historie am Kunden. Wer den Datenbankzugang hat, kommt an diese Tabelle trotzdem heran. Deshalb ist sie die Anzeige, nicht der Speicher, auf den man sich bei einer Prüfung verlässt.

**Dieselbe Zeile als Datei auf S3.** Pro Feld eine Datei, der Name bleibt für dieses Feld immer gleich. Beispiel: `audit/K017-address.BILLING.street.json`. Jede Änderung an genau diesem Feld schreibt diese Datei neu. Die Versionen sind die Historie dieser einen Zeile. Straße und Ort landen nicht in derselben Datei. Zwei Änderungen an demselben Feld in derselben Sekunde brauchen keinen Extra-Namen, die Version-Id von S3 unterscheidet sie.

Am Bucket zwei Schalter, die zusammengehören:

- **Versionierung.** Object Lock geht nur mit Versionierung. Dieselbe Datei noch einmal zu schreiben legt eine neue Version an. Die alte bleibt liegen und wird nicht überschrieben. Ohne denselben Namen hätte jede Änderung eine eigene Datei mit nur einer Version, dann bringt die Versionierung nichts.
- **Object Lock, Modus Compliance.** Jede Version ist bis zum Ende der Frist gesperrt. Niemand kann sie vorher löschen oder aufheben, auch nicht der Konto-Inhaber. Die Sperrfrist sind 8 Jahre, wie bei den Rechnungen.

Der Server darf nur eine neue Version dieser Datei schreiben, keine Version löschen. Klappt das Schreiben nicht, wird der Kunde nicht gespeichert. Sonst gibt es eine Änderung ohne Protokoll.

## Empfehlung an den Entwickler

Die Zeile wie oben, eine pro Feld. `changeType` mit `row_created`, `row_edited`, `row_deleted`. `updatedAt` und `createdAt` beim Vergleich auslassen.

Beides schreiben: die Protokolltabelle zum Ansehen am Kunden, und die Datei auf S3. S3 mit Versionierung und Object Lock im Modus Compliance, 8 Jahre. Erst wenn die Datei angenommen ist, gilt die Änderung am Kunden. Die Tabellenzeile und die Datei tragen denselben Inhalt.

Die Kopie auf einer schon gestellten Rechnung ist ein anderes Thema, die bleibt auf der Rechnung. Wird aus einem Privatkunden eine Firma, bleibt das alte Protokoll am alten Account.

## Quellen

- [GoBD, Fassung vom 28.11.2019, geändert am 11.03.2024 und 14.07.2025](https://ao.bundesfinanzministerium.de/ao/2025/Anhaenge/BMF-Schreiben-und-gleichlautende-Laendererlasse/Anhang-33/inhalt.html), Randziffer 108 bis 111
- [Amazon S3 Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html), Compliance, und [Versionierung](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)
