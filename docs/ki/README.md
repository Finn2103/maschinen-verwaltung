# KI-Nutzung

Dieser Ordner hat zwei Aufgaben: Ablage für KI-erstelltes Material **und** Nachweis, wie
KI im Projekt eingesetzt wurde.

Das Zweite ist nicht freiwillig. Aus den Projektregeln:

> „Bei Nutzung von KI ist das Prompting bzw. die Bewertung der generierten Ergebnisse
> nachvollziehbar zu dokumentieren. **Das Prompt Engineering wird bewertet.**"

Und aus der Aufgabenstellung:

> „Dazu erstellen Sie zuallererst einen **eigenen KI-Assistenten**, der Ihnen hilft, die
> User Stories korrekt zu formulieren."

Der Ordner ist also kein Abfall-Eimer, sondern ein **bewertetes Arbeitsergebnis**.

## Inhalt

| Datei | Zweck | Stand |
| --- | --- | --- |
| `mockups-sprint-1.html` | 13 Oberflächen-Entwürfe zu #1, #2 und #8 | Orientierung, werden in Figma selbst neu gebaut |

Veröffentlicht: https://claude.ai/artifact/NFTUEQY43cx78LxnBeXjj8

Entfernt, weil nicht genutzt: Projektüberblick, Planning-Leitfaden und Ist-Stand-Seite.
Sie sind in der Git-Historie nachvollziehbar, falls sie noch gebraucht werden.

## Was hier noch fehlt

Beides ist Bringschuld und wird bewertet:

- **[`prompts/`](prompts/README.md)**: Nachweis der KI-Nutzung, eine Datei je Arbeitstag.
  Angelegt am 25.09.2026, Struktur und Vorlage stehen. Die Einträge fehlen noch.
- **Eigener KI-Assistent für User Stories**: laut Aufgabenstellung ausdrücklich gefordert
  und noch nicht angelegt. Dazu gehört die Systemanweisung, die ihn auf die
  Story-Struktur, Lernfeld- und Bündelungsfach-Zuordnung und die T-Shirt-Schätzung
  festlegt.

**Material dafür ist vorhanden.** Im Projekt sind mehrere Fälle dokumentiert, in denen
KI-Ergebnisse geprüft und korrigiert wurden, das ist genau das, was „Bewertung der
generierten Ergebnisse" meint:

- Zwei gemeldete Widersprüche zur Aufgabenstellung wurden **zurückgezogen**, nachdem klar
  war, dass die Referenzarchitektur nicht bindet
  ([`../scrum/backlog-neufassung.md`](../scrum/backlog-neufassung.md))
- Ein Normbezug (ISO 9241) war fälschlich aus Issue #1 entfernt worden und wurde
  zurückgeschrieben
- In den Nutzwertanalysen wurden KI-Entwürfe durch eigene Zahlen ersetzt
  ([ADR 0004](../adr/0004-client-technologie.md), [ADR 0010](../adr/0010-programmiersprache.md))
- Umgekehrt fand die Prüfung eigener Zahlen drei Fehler in der Excel-Vorlage
  (Gewichtssumme 1,10; JavaScript mit 5 Punkten bei einem Kriterium, das es nicht erfüllen
  kann; ein doppelt benanntes Ausschlusskriterium)

Diese Fälle in `prompts.md` zusammenzuziehen ist die eigentliche Arbeit, sie zeigen
Prüfung statt Übernahme.

## Grenzen

Wie Claude in diesem Projekt eingesetzt wird, steht in [`CLAUDE.md`](../../CLAUDE.md):
Werkzeug auf Anweisung, das Team entwirft und entscheidet. Stories, Tasks und Epics
formuliert und legt das Team selbst an.

## Was hier ausdrücklich nicht liegt

Die Arbeit des Teams: ERD ([`../datenmodell`](../datenmodell/README.md)),
Nutzwertanalysen und Architekturentscheidungen ([`../adr`](../adr/README.md)),
Definition of Done und Entscheidungslog ([`../scrum`](../scrum/README.md)), Board,
Prioritäten, Zuweisungen, Schätzungen, das Lerntagebuch.
