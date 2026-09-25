# Architekturentscheidungen

Eine Datei pro Entscheidung, fortlaufend nummeriert. Vorlage:
[`0000-vorlage.md`](0000-vorlage.md).

Wo mehrere Optionen gegeneinander stehen, gehört eine **Nutzwertanalyse** in die
ADR, gewichtete Kriterien, Punkte, Nutzwert, und eine Interpretation. Die
höchste Punktzahl allein ist keine Begründung. Nutzwertanalyse ist Prüfungsthema.

| Nr. | Entscheidung | Status |
| --- | --- | --- |
| [0001](0001-linux-distribution.md) | Linux-Distribution für die Strato-VM | **Debian 13** entschieden. Ubuntu 26.04 gewinnt die Analyse (625 zu 545), die Abweichung ist am 25.09.2026 begründet und zwei Annahmen extern geprüft |
| 0002 | Container-Plattform (docker / podman / kubernetes) | offen |
| 0003 | Reverse Proxy (apache2 / nginx / Traefik) | offen |
| [0004](0004-client-technologie.md) | Client-Technologie | **React mit Next.js**: React vs. Angular vs. Flutter, Nutzwert 4,55 / 3,80 / 2,40 |
| [0005](0005-mailserver.md) | Mailserver (mailcow / docker-mailserver / stalwart) | in Arbeit. Gewichtungen begründet, Bewertung und Entscheidung fehlen. Ticket #12 |
| [0006](0006-datenhaltung.md) | Datenhaltung und Datenbank-API | **Supabase, selbst gehostet**: Supabase vs. Oracle vs. PocketBase, Nutzwert 4,40 / 3,60 / 3,35 |
| 0007 | Supabase als Cloud oder selbst gehostet | **entfällt**, in ADR 0006 mitentschieden: selbst gehostet auf der Strato-VM |
| 0008 | Anmeldung über Supabase statt Authelia | offen, Begründung: zwei Benutzerverwaltungen vermeiden |
| 0009 | Was „barrierefrei nach ISO 9241" für dieses Projekt heißt | offen. Die Checkliste gilt dann für alle Oberflächen-Items |
| [0010](0010-programmiersprache.md) | Programmiersprache und Typisierung | **TypeScript**: Nutzwert 4,45 · C# 3,70 · JavaScript 3,25 · C++ 2,80, korrigiert am 25.09.2026 |

**Stand 25.09.2026.** Abgeschlossen ist **0001**: Entscheidung, Begründung der Abweichung,
Korrektur einer falschen Bewertung und Konsequenzen stehen, zwei Annahmen wurden gegen
externe Quellen geprüft. Ticket #39 ist geschlossen.

**0010** ist rechnerisch fertig und korrigiert, es fehlen Interpretation und Konsequenzen.
**0004** und **0006** liegen als Entwurf vor, Methode und Zahlen stehen, die Formulierung
schreibt das Team um.

## Was bei diesen drei Analysen auffällt

In zwei von drei Fällen gewinnt die gewählte Option **nicht** in allen Kriterien:

- **Angular** ist bei Lernzuwachs und datenlastigen Formularen besser als React.
- **C# und C++** sind bei Typsicherheit und Objektorientierung besser als TypeScript, sie
  verlieren an allem, was mit Weboberfläche zu tun hat. Nach der Korrektur vom 25.09.2026
  liegt **C# auf Platz 2 vor JavaScript**: JavaScript kann das Kriterium „Typen aus dem
  Datenbankschema ableitbar" grundsätzlich nicht erfüllen und stand dort trotzdem auf der
  Höchstpunktzahl.
- **Oracle** gewinnt das wichtigste Einzelkriterium bei der Datenhaltung (klassisches
  SQL-DDL).
- **Ubuntu 26.04 LTS** gewinnt die Analyse zur Linux-Distribution insgesamt (625 zu 545),
  entschieden wurde trotzdem Debian 13. Genau deshalb verlangt die Methode eine
  Interpretation: die höchste Punktzahl allein ist keine Begründung. Die Begründung steht
  seit dem 25.09.2026 in ADR 0001, samt einem Abschnitt darüber, was sie **nicht**
  behauptet. Debian gewinnt kein einziges Kriterium.

Das ist beabsichtigt und soll so stehen bleiben. Eine Nutzwertanalyse, in der die eigene
Wahl überall vorne liegt, ist üblicherweise rückwärts gerechnet.
