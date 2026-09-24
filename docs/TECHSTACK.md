# Technologie-Stack

Was entschieden ist, womit es begründet wurde und was noch offen ist.
Jede Entscheidung steht als Architekturentscheidung in [`docs/adr`](adr/README.md),
jede mit einer Nutzwertanalyse dahinter.

## Entschieden

| Ebene | Entscheidung | Begründung | Nutzwert |
| --- | --- | --- | --- |
| **Betriebssystem** | **Debian 13** | [ADR 0001](adr/0001-linux-distribution.md) | 540 — *siehe Hinweis unten* |
| **Client** | **React mit Next.js** | [ADR 0004](adr/0004-client-technologie.md) | 4,55 · Angular 3,80 · Flutter 2,40 |
| **Sprache** | **TypeScript** | [ADR 0010](adr/0010-programmiersprache.md) | 4,95 · JavaScript 4,15 · C# 3,80 · C++ 2,90 |
| **Datenhaltung und Datenbank-API** | **Supabase, selbst gehostet** — PostgreSQL mit PostgREST | [ADR 0006](adr/0006-datenhaltung.md) | 4,40 · Oracle 3,60 · PocketBase 3,35 |

Supabase läuft **auf der eigenen Strato-VM**, nicht als Cloud-Dienst.

> **Offen in ADR 0001:** Die Nutzwertanalyse gewinnt Ubuntu 26.04 LTS mit 630 Punkten,
> entschieden wurde Debian 13 mit 540. Die Abweichung ist zulässig — die Aufgabenstellung
> verlangt ausdrücklich eine Interpretation und nicht die höchste Punktzahl — aber die
> Begründung fehlt noch im Dokument.

## Noch offen

| Ebene | Kandidaten | Wo |
| --- | --- | --- |
| **Reverse Proxy** | apache2 · nginx · Traefik | ADR 0003 — keine Nutzwertanalyse |
| **Container-Plattform** | docker · podman · kubernetes | ADR 0002 — keine Nutzwertanalyse |
| **Mailserver** | mailcow · docker-mailserver · stalwart | ADR 0005, Ticket [#12](https://github.com/Finn2103/maschinen-verwaltung/issues/12) |
| **Anmeldeverfahren** | Supabase-Anmeldung oder Authelia | ADR 0008 |
| **Barrierefreiheit** | Was „ISO 9241" konkret heißt — Checkliste | ADR 0009 |

Reverse Proxy und Container-Plattform sind **beide** noch offen, nicht nur der Proxy.
Beide werden in Ticket [#5](https://github.com/Finn2103/maschinen-verwaltung/issues/5)
gebraucht — wer das Ticket baut, trifft die Entscheidung mit und sollte sie vorher
kriteriengeleitet festhalten.

## Wie der Stack die Pflichtvorgaben erfüllt

| Pflicht aus der Aufgabenstellung | Antwort dieses Stacks |
| --- | --- |
| Objektorientierter Ansatz | Domänenschicht im Next.js-Server als Klassen mit Verhalten — nicht in den React-Komponenten |
| Client-Server-Architektur und Datenbank-API | Browser spricht ausschließlich mit den Route Handlers, diese über PostgREST mit PostgreSQL. **Kein Datenzugriff aus dem Browser** |
| Keine Software, die die Datenbank implizit erzeugt | Schema als handgeschriebenes SQL-DDL im Repository. Supabase Studio nur zum Ansehen, nicht zum Ändern |
| Infrastructure as Code | Debian 13, Container, Proxy und Mailserver per Skript aus dem Repository |
| IT-Grundschutz · ISO 9241 · UML | Tickets [#4](https://github.com/Finn2103/maschinen-verwaltung/issues/4) und [#15](https://github.com/Finn2103/maschinen-verwaltung/issues/15) · ADR 0009 · [`docs/uml`](uml/README.md) |

## Abweichungen von der Referenzarchitektur

Die Aufgabenstellung nennt eine Referenzarchitektur als **Orientierung**; verbindlich ist
allein die Pflichtliste. Wir weichen an zwei Stellen ab und sprechen das von uns aus an:

- **Client:** React mit Next.js statt Angular, C#/C++ oder Flutter. Grund ist die
  mitgelieferte Serverschicht — die anderen drei sind reine Client-Technologien und
  bräuchten ein zweites Projekt für die Client-Server-Pflicht.
- **Anmeldung:** voraussichtlich über Supabase statt Authelia, um zwei getrennte
  Benutzerverwaltungen zu vermeiden. Noch nicht als ADR entschieden.
