# Datenmodell

Reihenfolge: fachliches Bild zuerst, Tabellen danach.

| Datei | Inhalt | Status |
| --- | --- | --- |
| `ERD-Maschinenverwaltung.drawio` | ERD in Chen-Notation, Arbeitsstand (drawio-Quelle) | Entwurf, vorläufig abgenommen (siehe unten) |
| `erd_maschinenverleih_chen.svg` | Export des ERD zum Ansehen ohne drawio | Export vom 09.11. |
| `relational.md` | Überführung in Relationen, Normalisierung (3. NF), Schlüssel und Fremdschlüssel | offen |
| `schema.sql` | Explizites SQL-DDL für PostgreSQL | offen |

Die drawio-Datei ist die Quelle, das SVG wird daraus exportiert und bei
Änderungen mit erneuert, damit beide zusammenpassen. Export aus diesem Ordner:

```
drawio -x -f svg -b 20 -o erd_maschinenverleih_chen.svg ERD-Maschinenverwaltung.drawio
```

Bis zum 09.11. war das SVG kein Export, sondern eine eigene Fassung mit mehr
Attributen und anders benannten Beziehungen. Sie steht in der Historie (Commit
`2ffc6ec`) und taugt als Vorlage, wenn die Attribute nachgetragen werden.

## Stand des ERD

Die acht ERD-Entscheidungen aus #73 gelten **vorläufig**: Laurin hat am 10.10.
allen zugestimmt, die übrigen Antworten stehen aus. Liste und Stand je Punkt:
[`docs/scrum/entscheidungen.md`](../scrum/entscheidungen.md), Abschnitt
„ERD-Entscheidungen".

Umgesetzt ist Entscheidung 1: Bauteil, Verbrauchsmaterial und Bestellung stehen mit
Schlüssel und Beziehungen im ERD, ihre Attribute folgen.

| Beziehung | Kardinalität | Woher |
| --- | --- | --- |
| Maschine **hat** Bauteil | 1 : N | Aufgabenstellung: „wartungsrelevante Maschinenteile" verwalten; #3, #45 |
| Verbrauchsmaterial **passt zu** Maschinentyp | N : M | Aufgabenstellung: Online-Shop für Verbrauchsmaterialien „zu den vermieteten Maschinen" |
| Kunde **gibt** Bestellung **auf** | 1 : N | Aufgabenstellung: Bestellhistorie; Kunden wählen Verbrauchsmittel aus und erwerben sie |
| Bestellung **enthält** Verbrauchsmaterial | M : N | wie oben |
| Rechnungsposition **berechnet** Bestellung | N : 1 | Aufgabenstellung: digitale Abwicklung von Bestellungen, Rechnungen und Zahlungen. Gleiches Muster wie bei der Ausleihe |

Noch nicht im ERD: Entscheidung 2 (Reservierung und Ausleihe zusammenlegen),
4 (Steuersatz an die Position) und 7 (Messwerte). Sie kommen mit dem relationalen
Modell.

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
