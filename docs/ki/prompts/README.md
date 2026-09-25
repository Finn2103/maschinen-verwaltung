# Nachweis der KI-Nutzung

Hier liegt der Nachweis zu Issue [#48](https://github.com/Finn2103/maschinen-verwaltung/issues/48).

Aus den Projektregeln:

> „Bei Nutzung von KI ist das Prompting bzw. die Bewertung der generierten Ergebnisse
> nachvollziehbar zu dokumentieren. **Das Prompt Engineering wird bewertet.**"

## Was bewertet wird

Zwei Dinge, und das zweite ist das schwerere:

1. **Das Prompting.** Wie wurde gefragt, und was hat eine Frage besser gemacht als die
   vorherige.
2. **Die Bewertung der Ergebnisse.** Was kam zurück, was davon wurde übernommen, was
   verworfen, und woran das entschieden wurde.

Eine Sammlung von Prompts ohne Punkt 2 erfüllt die Vorgabe nicht. Der Nachweis lebt von
den Fällen, in denen ein Ergebnis **geprüft und korrigiert** wurde.

## Eine Datei je Arbeitstag

`JJJJ-MM-TT.md`, Aufbau nach [`vorlage.md`](vorlage.md). Je Fall vier Angaben:

| Feld | Inhalt |
| --- | --- |
| **Aufgabe** | Was sollte erreicht werden |
| **Prompt** | Wie gefragt wurde, sinngemäß oder gekürzt |
| **Ergebnis** | Was zurückkam, in einem Satz |
| **Bewertung** | Übernommen oder verworfen, und **warum**. Das ist der bewertete Teil |

## Warum hier nicht der wörtliche Chatverlauf steht

Die vollständigen Sitzungsprotokolle liegen lokal auf dem Arbeitsgerät unter
`~/.claude/projects/…/*.jsonl`. Sie sind der Rohbeleg und jederzeit vorzeigbar.

**In dieses Repository kommen sie nicht.** Es ist öffentlich, und Arbeitsnotizen im
Eifer des Gefechts sind kein Dokument, das man einem Prüfungsausschuss vorlegt. Die
Vorgabe verlangt eine *nachvollziehbare Dokumentation*, keinen Mitschnitt. Was hier steht,
ist also sinngemäß und geordnet, nicht wörtlich.

Wer den Rohbeleg sehen will, bekommt ihn auf Nachfrage am Gerät gezeigt.

## Vollständigkeit

Alle Prompts an Claude entstehen auf **einem** Gerät. Es gibt keine zweite Quelle, die
noch dazukäme. Umgekehrt gilt: was im Repository liegt und nicht aus diesen Sitzungen
stammt, ist selbst geschrieben.

Stand 25.09.2026 sind protokolliert: **11.09. (28 Eingaben) · 17.09. (6) · 18.09. (10) ·
24.09. (9) · 25.09. (laufend)**.

## Grenzen der KI-Nutzung

Wie Claude in diesem Projekt eingesetzt wird, steht in [`CLAUDE.md`](../../../CLAUDE.md):
Werkzeug auf Anweisung. Entwurf, Entscheidung und Formulierung von User Stories, Tasks
und Epics liegen beim Team.
