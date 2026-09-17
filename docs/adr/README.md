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
| 0004 | Client-Technologie | **React mit Next.js und TypeScript** entschieden — ADR-Text offen. Weicht von der Optionsliste der Aufgabenstellung (Angular, C#/C++, Flutter) ab; Begründung ist die mitgelieferte Serverschicht |
| 0005 | Mailserver (mailcow / docker-mailserver / stalwart) | offen, Ticket #12 |
| 0006 | Datenbanksystem | Nutzwertanalyse läuft, Ticket #10 |
| 0007 | Supabase als Cloud oder selbst gehostet | offen — Frage an den Product Owner |
| 0008 | Anmeldung über Supabase statt Authelia | offen, Begründung: zwei Benutzerverwaltungen vermeiden |
| 0009 | Was „barrierefrei nach ISO 9241" für dieses Projekt heißt | offen — Checkliste, gilt dann für alle Oberflächen-Items |

Die ADR-Texte zu 0001 und 0004 sind **Bringschuld**: die Entscheidungen sind gefallen, die
schriftliche Begründung fehlt noch. Bei der Nutzwertanalyse ist das besonders wichtig, weil
sie Prüfungsthema ist.
