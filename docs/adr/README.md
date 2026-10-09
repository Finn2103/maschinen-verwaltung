# Architekturentscheidungen

Eine Datei pro Entscheidung, fortlaufend nummeriert. Vorlage:
[`0000-vorlage.md`](0000-vorlage.md).

Wo mehrere Optionen gegeneinander stehen, gehört eine **Nutzwertanalyse** in die
ADR, gewichtete Kriterien, Punkte, Nutzwert, und eine Interpretation. Die
höchste Punktzahl allein ist keine Begründung. Nutzwertanalyse ist Prüfungsthema.

| Nr. | Entscheidung | Status |
| --- | --- | --- |
| [0001](0001-linux-distribution.md) | Linux-Distribution für die Strato-VM | **Debian 13** entschieden. Ubuntu 26.04 gewinnt die Analyse (625 zu 545), die Abweichung ist am 25.09.2026 begründet und zwei Annahmen extern geprüft. Die Argumente des Teams trägt #55 nach |
| [0002](0002-container-plattform.md) | Container-Plattform (docker / podman / kubernetes) | **Docker mit Compose-Plugin** (4,60). Podman gewinnt Isolation. Die Mailserver-Zeile ist voraussichtlich, #12 ist offen; ohne sie bleibt Docker vorn (3,85 zu 3,30) |
| [0003](0003-reverse-proxy.md) | Reverse Proxy (apache2 / nginx / Traefik, zusätzlich Caddy) | **Caddy** (4,70). Vierter Kandidat über die Referenzarchitektur hinaus, begründet im ADR. Traefik gewinnt das Zusammenspiel mit Compose, nginx die Angriffsfläche |
| [0004](0004-client-technologie.md) | Client-Technologie | **React mit Next.js**: React vs. Angular vs. Flutter, Nutzwert 4,55 / 3,80 / 2,40 |
| [0005](0005-mailserver.md) | Mailserver (mailcow / docker-mailserver / stalwart) | in Arbeit. Gewichtungen begründet, Bewertung und Entscheidung fehlen. Ticket #12 |
| [0006](0006-datenhaltung.md) | Datenhaltung und Datenbank-API | **Supabase, selbst gehostet**: Supabase vs. Oracle vs. PocketBase, Nutzwert 4,40 / 3,60 / 3,35 |
| 0007 | Supabase als Cloud oder selbst gehostet | **entfällt**, in ADR 0006 mitentschieden: selbst gehostet auf der Strato-VM |
| 0008 | Anmeldung über Supabase statt Authelia | offen, Begründung: zwei Benutzerverwaltungen vermeiden |
| [0009](0009-barrierefreiheit.md) | Was „barrierefrei nach ISO 9241" für dieses Projekt heißt | **Checkliste aus ISO 9241-110:2020 und -171, an WCAG 2.1 AA aufgehängt.** Gilt für alle Oberflächen-Items |
| [0010](0010-programmiersprache.md) | Programmiersprache und Typisierung | **TypeScript**: Nutzwert 4,45 · C# 3,70 · JavaScript 3,25 · C++ 2,80, korrigiert am 25.09.2026 |
| [0011](0011-speicherzugriff.md) | Speicherzugriff über eine Schnittstelle | **Schnittstelle mit zwei Umsetzungen**, Arbeitsspeicher jetzt, PostgreSQL nach #45. Von Anfang an asynchron, damit das Umstellen kein Umbau wird |

**Stand 01.10.2026.** Vollständig sind **0001**, **0004** und **0010**: Entscheidung,
Interpretation und Konsequenzen stehen jeweils. Bei 0001 trägt #55 noch die Argumente des
Teams nach, die dort stehende Begründung ist ein Entwurf.

**0002** ist entschieden. Die Zeile zum Mailserver darin ist voraussichtlich, weil #12
offen ist. **0003** ist entschieden: Caddy. **0005** hat Gewichtungen und Punkte, aber
noch keine Entscheidung. **0006** liegt als Entwurf vor, Methode und Zahlen stehen, die
Formulierung schreibt das Team um.

## Was bei diesen Analysen auffällt

In den meisten Fällen gewinnt die gewählte Option **nicht** in allen Kriterien:

- **Angular** ist bei Lernzuwachs und datenlastigen Formularen besser als React.
- **C# und C++** sind bei Typsicherheit und Objektorientierung besser als TypeScript, sie
  verlieren an allem, was mit Weboberfläche zu tun hat. Nach der Korrektur vom 25.09.2026
  liegt **C# auf Platz 2 vor JavaScript**: JavaScript kann das Kriterium „Typen aus dem
  Datenbankschema ableitbar" grundsätzlich nicht erfüllen und stand dort trotzdem auf der
  Höchstpunktzahl.
- **Oracle** gewinnt das wichtigste Einzelkriterium bei der Datenhaltung (klassisches
  SQL-DDL).
- **Podman** gewinnt bei der Container-Plattform das Kriterium Isolation (5 gegen 3), weil
  es nativ rootless läuft. Docker muss dafür umgestellt werden.
- **Traefik** gewinnt beim Reverse Proxy das Zusammenspiel mit Docker Compose (5 gegen 4),
  **nginx** die Angriffsfläche (5 gegen 4). Entschieden ist trotzdem Caddy.
- **Ubuntu 26.04 LTS** gewinnt die Analyse zur Linux-Distribution insgesamt (625 zu 545),
  entschieden wurde trotzdem Debian 13. Genau deshalb verlangt die Methode eine
  Interpretation: die höchste Punktzahl allein ist keine Begründung. Die Begründung steht
  seit dem 25.09.2026 in ADR 0001, samt einem Abschnitt darüber, was sie **nicht**
  behauptet. Debian gewinnt kein einziges Kriterium.

Das ist beabsichtigt und soll so stehen bleiben. Eine Nutzwertanalyse, in der die eigene
Wahl überall vorne liegt, ist üblicherweise rückwärts gerechnet.
