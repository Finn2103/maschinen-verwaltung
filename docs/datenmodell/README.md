# Datenmodell

Reihenfolge: fachliches Bild zuerst, Tabellen danach.

| Datei | Inhalt | Status |
| --- | --- | --- |
| `ERD-Maschinenverwaltung.drawio` | ERD in Chen-Notation (drawio-Quelle) | Entwurf vom 10.11., vorläufig abgenommen (siehe unten) |
| `erd_maschinenverleih_chen.svg` | Export des ERD zum Ansehen ohne drawio | Export vom 10.11. |
| [`relational.md`](relational.md) | Überführung in Relationen, Normalisierung (3. NF), Schlüssel, Zusicherungen | Entwurf vom 10.11. |
| [`schema.sql`](schema.sql) | Explizites SQL-DDL für PostgreSQL, von Hand geschrieben | Entwurf vom 10.11., läuft fehlerfrei auf leerer PostgreSQL 17 |
| [`schema-pruefen.sql`](schema-pruefen.sql) | Prüft jede Zusicherung aus `schema.sql` mit einem Fall | 10.11.: alle Fälle bestanden |
| [`schema-pruefen.ps1`](schema-pruefen.ps1) | Spielt beides in einem Wegwerf-Container ein | |

Die drawio-Datei ist die Quelle, das SVG wird daraus exportiert und bei
Änderungen mit erneuert, damit beide zusammenpassen. Export aus diesem Ordner:

```
drawio -x -f svg -b 20 -o erd_maschinenverleih_chen.svg ERD-Maschinenverwaltung.drawio
```

Bis zum 09.11. war das SVG kein Export, sondern eine eigene Fassung mit mehr
Attributen und anders benannten Beziehungen (Commit `2ffc6ec`). Seit dem 10.11. ist
die drawio daran angeglichen: Attribute, Beziehungsnamen, Titel und Legende.

Beschriftungen in der drawio sind reiner Text, Schlüssel über „unterstrichen“ in
der Schriftart. Nur der partielle Schlüssel und die Legende brauchen HTML für die
gestrichelte Linie. Jede HTML-Beschriftung legt draw.io beim Export zusätzlich als
Bild ins SVG, das bläht die Datei auf.

## Schema prüfen

Spielt `schema.sql` auf eine leere Datenbank in einem Wegwerf-Container und lässt
danach `schema-pruefen.sql` laufen. Braucht Podman oder Docker und ein lokal
vorhandenes PostgreSQL-Image; lädt nichts herunter und veröffentlicht keine Ports.

```powershell
& '.\docs\datenmodell\schema-pruefen.ps1'
```

Mit einem anderen Image: `-Image postgres:17`.

## Stand des ERD

Die acht ERD-Entscheidungen aus #73 gelten **vorläufig**: Laurin hat am 10.10.
allen zugestimmt, die übrigen Antworten stehen aus. Seit dem 10.11. sind alle acht
umgesetzt, dazu Finns Antworten 7 bis 12 vom 09.11. Liste und Stand je Punkt:
[`docs/scrum/entscheidungen.md`](../scrum/entscheidungen.md), Abschnitt
„ERD-Entscheidungen".

**Zwölf Entitäten:** Kunde, Ausleihe, Maschine, Maschinentyp, Messwert, Wartung,
Bauteil, Verbrauchsmaterial, Bestellung, Rechnung, Rechnungsposition (schwach),
Zahlung.

**Seit dem 09.11. neu im ERD:**

| Beziehung | Kardinalität | Woher |
| --- | --- | --- |
| Maschine **hat** Bauteil | 1 : N | Aufgabenstellung: „wartungsrelevante Maschinenteile" verwalten; #3, #45; Antwort 7 |
| Wartung **bearbeitet** Bauteil, mit Maßnahme | M : N | Antwort 8: die Wartung hält fest, welche Teile sie geprüft oder getauscht hat |
| Verbrauchsmaterial **passt zu** Maschinentyp | M : N | Aufgabenstellung: Online-Shop für Verbrauchsmaterialien „zu den vermieteten Maschinen"; Antwort 9 |
| Kunde **gibt** Bestellung **auf** | 1 : N | Aufgabenstellung: Bestellhistorie; Kunden wählen Verbrauchsmittel aus und erwerben sie; Antwort 11 |
| Bestellung **enthält** Verbrauchsmaterial, mit Menge | M : N | wie oben |
| Rechnungsposition **berechnet** Bestellung | N : 1 | Aufgabenstellung: digitale Abwicklung von Bestellungen, Rechnungen und Zahlungen; Antwort 10 |
| Maschine **liefert** Messwert | 1 : N | ERD-Entscheidung 7 |
| Rechnung **storniert** Rechnung | 1 : 1, rekursiv | ERD-Entscheidung 6: Korrektur nur per Storno |

**Geändert:** Reservierung und Ausleihe sind eine Entität Ausleihe mit Status
(ERD-Entscheidung 2), der Steuersatz steht an der Rechnungsposition statt an der
Rechnung (ERD-Entscheidung 4). Die Beziehungsnamen folgen der älteren SVG-Fassung:
begleicht, besteht aus, erhält, betrifft, unterliegt, ist vom Typ.

Im relationalen Modell kommen `bauteiltyp` und `messgroesse` dazu, aus der
3. Normalform. Warum, steht in [`relational.md`](relational.md), Abschnitt 3.3.

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
Beziehungen stimmen. Die Reservierung ist seit dem 10.11. keine eigene Entität
mehr, sondern der Status `reserviert` einer Ausleihe.

## Noch nicht im Datenmodell

[`docs/rollen-und-rechte.md`](../rollen-und-rechte.md) nennt unter „Für #45
Datenmodell" vier Punkte, die weder im ERD noch in `schema.sql` stehen: Relationen
für Rolle und Recht, ein Ort für die Stornofrist, ein Pflichtfeld für den
Stornogrund nach Fristablauf und ein Protokoll (Audit-Log). Ebenso fehlen die
Rechte der Datenbank-Rollen (`GRANT` für PostgREST).
