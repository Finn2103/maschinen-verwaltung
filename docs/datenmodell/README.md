# Datenmodell

Reihenfolge: fachliches Bild zuerst, Tabellen danach.

| Datei | Inhalt | Status |
| --- | --- | --- |
| `ERD-Maschinenverwaltung.drawio` | ERD in Chen-Notation, Arbeitsstand (drawio-Quelle) | Entwurf |
| `erd_maschinenverleih_chen.svg` | Export des ERD zum Ansehen ohne drawio | Entwurf |
| `relational.md` | Überführung in Relationen, Normalisierung (3. NF), Schlüssel und Fremdschlüssel | offen |
| `schema.sql` | Explizites SQL-DDL für PostgreSQL | offen |

Die drawio-Datei ist die Quelle, das SVG wird daraus exportiert und bei
Änderungen mit erneuert, damit beide zusammenpassen.

## Vorgaben, die hier gelten

- **Kein implizit erzeugtes Schema.** Das DDL wird von Hand geschrieben und
  versioniert. Kein Auto-Migrate, kein Schema-aus-ORM.
- **Steuerrelevanz.** Rechnungen, Zahlungen und Umsatzsteuer unterliegen UStG und
  GoBD: fortlaufende Rechnungsnummern, keine Löschung oder stille Änderung
  gebuchter Belege, Änderungen nur über Storno und Neuausstellung,
  Nachvollziehbarkeit über Audit-Logs.
- **Historisierung.** Preise und Steuersätze gelten zeitabhängig. Eine Rechnung
  muss auch Jahre später denselben Betrag ergeben, also Konditionen auf dem Beleg
  festschreiben, nicht zur Laufzeit aus Stammdaten nachrechnen.
- **Maschinendaten.** Für Predictive Maintenance fallen Messwerte in hoher Zahl an.
  Sie gehören nicht in dieselbe Tabelle wie Stammdaten.

## Fachliche Anker aus der Aufgabenstellung

Kunde · Maschine · Maschinentyp · Ausleihe · Reservierung · Rechnung ·
Rechnungsposition · Zahlung · Wartung · Bauteil · Verbrauchsmaterial · Bestellung

Nicht alles muss abgebildet werden. Wichtiger ist, dass die abgebildeten
Beziehungen stimmen.
