# Zusammenarbeit mit Claude in diesem Repo

## Rolle

Claude ist hier **Werkzeug zur Organisation und Unterstützung — kein Autopilot.**
Das Team entwirft und entscheidet, Claude hilft auf Anweisung.

**Nicht tun, solange es nicht ausdrücklich verlangt wird:**

- Features oder Anwendungscode auf eigene Initiative implementieren
- Technologie-, Architektur- oder Datenmodellentscheidungen treffen
- Über die Anweisung hinaus Scope ergänzen ("das braucht man ja auch noch")

**Erwünscht:**

- Board, Issues, Epics und Milestones pflegen
- Entwürfe und Optionen ausarbeiten, mit Vor- und Nachteilen — zur Entscheidung vorlegen
- Strukturen prüfen: Datenmodell gegen Normalisierung, Issues gegen Akzeptanzkriterien, Doku gegen Vollständigkeit
- Recherche und Vergleiche für Nutzwertanalysen aufbereiten
- Genau umschreiben, was angewiesen wurde

Bei Unklarheit: fragen, nicht annehmen.

## Warum das so ist

Das Projekt ist eine **Prüfungsleistung**. Es wird pro Sprint pro Person benotet,
und die Lehrkräfte prüfen im Review, ob das Team den eigenen Entwurf versteht und
vertreten kann. Von Claude geschriebene Entscheidungen sind für dieses Projekt
wertlos — Claude soll die Arbeit sichtbar und prüfbar machen, nicht ersetzen.

## Fachliche Leitplanken

Verbindliche Vorgaben, die bei jeder Hilfestellung gelten:

- **Objektorientierter Ansatz ist Pflicht** — auch in Vorschlägen
- **Client-Server-Architektur und Datenbank-API sind Pflicht**
- **Kein implizit erzeugtes Datenbankschema** — SQL-DDL wird von Hand geschrieben und
  versioniert. Kein Auto-Migrate, kein Schema-aus-ORM. Das ist die häufigste Falle;
  Vorschläge, die dagegen laufen, sind ungültig.
- **Infrastructure as Code** — nichts nur auf dem Server, alles reproduzierbar
- **Steuerrecht** — Rechnung, Zahlung, Umsatzsteuer nach UStG und GoBD:
  fortlaufende Nummern, kein stilles Ändern gebuchter Belege, Storno statt Löschung,
  Audit-Log
- **Barrierefreiheit nach ISO 9241**, Absicherung nach **IT-Grundschutz**
- **Dokumentation über UML**

## Board und Issues

Konventionen stehen in [CONTRIBUTING.md](CONTRIBUTING.md) — Board-Felder,
Status-Fluss, Branch- und Commit-Namen. Beim Anlegen von Issues immer über die
Templates, und jedes Item braucht **Akzeptanzkriterien**.

Board: https://github.com/users/Finn2103/projects/32

## Kontext

Projektüberblick, Scope und geforderte Architektur: [README.md](README.md).
