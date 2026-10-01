# Technologie-Stack

Was entschieden ist, womit es begründet wurde und was noch offen ist.
Jede Entscheidung steht als Architekturentscheidung in [`docs/adr`](adr/README.md),
jede mit einer Nutzwertanalyse dahinter.

## Entschieden

| Ebene | Entscheidung | Begründung | Nutzwert |
| --- | --- | --- | --- |
| **Betriebssystem** | **Debian 13** | [ADR 0001](adr/0001-linux-distribution.md) | 545 · Ubuntu 26.04 625, *bewusste Abweichung* |
| **Container-Plattform** | **Docker & Docker-Compose** | [ADR 0002](adr/0002-container-plattform.md) | 4,60 · Podman 3,75 · Kubernetes 2,90 |
| **Reverse Proxy** | **Caddy** | [ADR 0003](adr/0003-reverse-proxy.md) | 4,70 · Traefik 4,10 · nginx 4,00 · apache2 3,30 |
| **Client** | **React mit Next.js** | [ADR 0004](adr/0004-client-technologie.md) | 4,55 · Angular 3,80 · Flutter 2,40 |
| **Sprache** | **TypeScript** | [ADR 0010](adr/0010-programmiersprache.md) | 4,45 · C# 3,70 · JavaScript 3,25 · C++ 2,80 |
| **Datenhaltung und Datenbank-API** | **Supabase, selbst gehostet**: PostgreSQL mit PostgREST | [ADR 0006](adr/0006-datenhaltung.md) | 4,40 · Oracle 3,60 · PocketBase 3,35 |

Supabase läuft **auf der eigenen Strato-VM**, nicht als Cloud-Dienst.

> **Zur Abweichung bei ADR 0001:** Die Nutzwertanalyse gewinnt Ubuntu 26.04 LTS mit 625
> Punkten, entschieden wurde Debian 13 mit 545. Das ist eine bewusste Abweichung, begründet
> am 25.09.2026 im ADR: das Team kennt Debian besser, und der Server läuft bereits darauf.
> Zwei Annahmen der Tabelle wurden dabei gegen externe Quellen geprüft und bestätigt.

## Noch offen

| Ebene | Kandidaten | Wo |
| --- | --- | --- |
| **Mailserver** | mailcow · docker-mailserver · stalwart | ADR 0005, Ticket [#12](https://github.com/Finn2103/maschinen-verwaltung/issues/12) |
| **Anmeldeverfahren** | Supabase-Anmeldung oder Authelia | ADR 0008 |
| **Barrierefreiheit** | Was „ISO 9241" konkret heißt, Checkliste | ADR 0009 |

Container-Plattform und Reverse Proxy sind entschieden. Der Aufbau beider liegt in
[#5](https://github.com/Finn2103/maschinen-verwaltung/issues/5). Der Mailserver ist
**nicht** entschieden: [#12](https://github.com/Finn2103/maschinen-verwaltung/issues/12)
liegt bei Justin, ADR 0005 hat Gewichtungen und Punkte, aber keine Entscheidung.

## Wie der Stack die Pflichtvorgaben erfüllt

| Pflicht aus der Aufgabenstellung | Antwort dieses Stacks |
| --- | --- |
| Objektorientierter Ansatz | Domänenschicht im Next.js-Server als Klassen mit Verhalten, nicht in den React-Komponenten |
| Client-Server-Architektur und Datenbank-API | Browser spricht ausschließlich mit den Route Handlers, diese über PostgREST mit PostgreSQL. **Kein Datenzugriff aus dem Browser** |
| Keine Software, die die Datenbank implizit erzeugt | Schema als handgeschriebenes SQL-DDL im Repository. Supabase Studio nur zum Ansehen, nicht zum Ändern |
| Infrastructure as Code | Debian 13, Container, Proxy und Mailserver per Skript aus dem Repository |
| IT-Grundschutz · ISO 9241 · UML | Tickets [#4](https://github.com/Finn2103/maschinen-verwaltung/issues/4) und [#15](https://github.com/Finn2103/maschinen-verwaltung/issues/15) · ADR 0009 · [`docs/uml`](uml/README.md) |

## Abweichungen von der Referenzarchitektur

Die Aufgabenstellung nennt eine Referenzarchitektur als **Orientierung**; verbindlich ist
allein die Pflichtliste. Wir weichen an drei Stellen ab und sprechen das von uns aus an:

- **Client:** React mit Next.js statt Angular, C#/C++ oder Flutter. Grund ist die
  mitgelieferte Serverschicht, die anderen drei sind reine Client-Technologien und
  bräuchten ein zweites Projekt für die Client-Server-Pflicht.
- **Reverse Proxy:** Caddy statt nur apache2, nginx oder Traefik. Caddy steht nicht in
  der Referenzarchitektur. Die Abweichung ist erlaubt, sie muss begründet sein. Die
  Begründung steht in [ADR 0003](adr/0003-reverse-proxy.md): automatisches TLS ohne
  zweiten Prozess, die Konfiguration bleibt eine Datei, der Proxy braucht keinen
  Docker-Socket.
- **Anmeldung:** voraussichtlich über Supabase statt Authelia, um zwei getrennte
  Benutzerverwaltungen zu vermeiden. Noch nicht als ADR entschieden.
