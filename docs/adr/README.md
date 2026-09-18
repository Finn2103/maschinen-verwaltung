# Architekturentscheidungen

Eine Datei pro Entscheidung, fortlaufend nummeriert. Vorlage:
[`0000-vorlage.md`](0000-vorlage.md).

Wo mehrere Optionen gegeneinander stehen, gehört eine **Nutzwertanalyse** in die
ADR — gewichtete Kriterien, Punkte, Nutzwert, und eine Interpretation. Die
höchste Punktzahl allein ist keine Begründung. Nutzwertanalyse ist Prüfungsthema.

| Nr. | Entscheidung | Status |
| --- | --- | --- |
| 0001 | Linux-Distribution für die Strato-VM | **Debian 13** entschieden, Nutzwertanalyse liegt vor (`Nutzwerkanalyse.xlsx`) — ADR-Text offen |
| 0002 | Container-Plattform (docker / podman / kubernetes) | offen |
| 0003 | Reverse Proxy (apache2 / nginx / Traefik) | offen |
| [0004](0004-client-technologie.md) | Client-Technologie | **React mit Next.js** — React vs. Angular vs. Flutter, Nutzwert 4,55 / 3,80 / 2,40 |
| 0005 | Mailserver (mailcow / docker-mailserver / stalwart) | offen, Ticket #12 |
| [0006](0006-datenhaltung.md) | Datenhaltung und Datenbank-API | **Supabase, selbst gehostet** — Supabase vs. Oracle vs. PocketBase, Nutzwert 4,40 / 3,60 / 3,35 |
| 0007 | Supabase als Cloud oder selbst gehostet | **entfällt** — in ADR 0006 mitentschieden: selbst gehostet auf der Strato-VM |
| 0008 | Anmeldung über Supabase statt Authelia | offen, Begründung: zwei Benutzerverwaltungen vermeiden |
| 0009 | Was „barrierefrei nach ISO 9241" für dieses Projekt heißt | offen — Checkliste, gilt dann für alle Oberflächen-Items |
| [0010](0010-programmiersprache.md) | Programmiersprache und Typisierung | **TypeScript** — TypeScript vs. JavaScript vs. C#, Nutzwert 4,40 / 2,50 / 3,90 |

Die ADR-Texte 0004, 0006 und 0010 liegen als **Entwurf** vor — Methode und Zahlen stehen,
die Formulierung schreibt das Team um. Der Text zu **0001** ist weiterhin Bringschuld: die
Entscheidung für Debian 13 ist gefallen, die Nutzwertanalyse liegt als Tabelle vor, der
begründende Text fehlt.

## Was bei diesen drei Analysen auffällt

In zwei von drei Fällen gewinnt die gewählte Option **nicht** in allen Kriterien:

- **Angular** ist bei Lernzuwachs und datenlastigen Formularen besser als React.
- **C#** ist bei Typsicherheit und Objektorientierung besser als TypeScript — es verliert
  nur, weil ADR 0004 einen JavaScript-basierten Client gewählt hat.
- **Oracle** gewinnt das wichtigste Einzelkriterium bei der Datenhaltung (klassisches
  SQL-DDL).

Das ist beabsichtigt und soll so stehen bleiben. Eine Nutzwertanalyse, in der die eigene
Wahl überall vorne liegt, ist üblicherweise rückwärts gerechnet.
