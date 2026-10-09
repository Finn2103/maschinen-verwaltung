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

## Was hier nicht pauschal landet

Nicht jeder Prompt kommt in die Dokumentation. Es kommen die Fälle rein, an denen eine
Entscheidung hing. **Jeder Eintrag wird vor dem Ablegen gegengelesen und freigegeben**,
nichts wird automatisch übernommen.

Dokumentiert wird **ab dem 25.09.2026**. Die Sitzungen davor bleiben draußen; sie sind im
lokalen Rohprotokoll vorhanden, falls doch einmal danach gefragt wird.

Die Auswahl, welcher Prompt aufgenommen wird, trifft das Team und wird jeweils beim
Arbeiten gesagt.

## Eine Datei je Arbeitstag

`JJJJ-MM-TT.md`, Aufbau nach [`vorlage.md`](vorlage.md). Je Fall vier Angaben:

| Feld | Inhalt |
| --- | --- |
| **Aufgabe** | Was sollte erreicht werden |
| **Prompt** | **Der Prompt im Wortlaut.** Deckt ein Prompt mehrere Themen ab, wird der einschlägige Teil zitiert und als Auszug gekennzeichnet |
| **Ergebnis** | Was zurückkam, in einem Satz |
| **Bewertung** | Übernommen oder verworfen, und **warum**. Das ist der bewertete Teil |

## Wörtlich als Normalfall

**Die Prompts stehen im Wortlaut.** Paraphrasiert geht genau das verloren, was bewertet
wird: wie eine Frage gestellt wurde, welche Grenze sie gesetzt hat, welches
Abnahmekriterium darin stand. Sichtbar wäre sonst nur, was die KI daraus gemacht hat.

Gekürzt wird nur im Ausnahmefall, und dann sichtbar: deckt ein Prompt mehrere Themen ab,
steht der einschlägige Teil da, gekennzeichnet als Auszug.

Nicht hier steht der **vollständige Chatverlauf**, also die Antworten der KI, Werkzeugaufrufe
und Zwischenschritte. Die Vorgabe verlangt eine *nachvollziehbare Dokumentation*, keinen
Mitschnitt. Die vollständigen Sitzungsprotokolle liegen lokal auf dem Arbeitsgerät unter
`~/.claude/projects/…/*.jsonl` und sind auf Nachfrage vorzeigbar.

## Zwei Ablageorte

Jeder Eintrag steht an zwei Stellen:

1. In der Tagesdatei hier im Ordner.
2. Als **Kommentar unter dem zugehörigen Issue**. Dort wird er gesucht, wenn im
   Fachgespräch eine Entscheidung aufgerufen wird.

## Vollständigkeit

Alle Prompts an Claude entstehen auf **einem** Gerät. Es gibt keine zweite Quelle, die
noch dazukäme. Umgekehrt gilt: was im Repository liegt und nicht aus diesen Sitzungen
stammt, ist selbst geschrieben.

Im lokalen Rohprotokoll liegen Stand 25.09.2026: **11.09. (28 Eingaben) · 17.09. (6) ·
18.09. (10) · 24.09. (9) · 25.09. (laufend)**. In dieser Dokumentation steht davon nur,
was ausdrücklich freigegeben wurde.

## Grenzen der KI-Nutzung

Wie Claude in diesem Projekt eingesetzt wird, steht in [`CLAUDE.md`](../../../CLAUDE.md):
Werkzeug auf Anweisung. Entwurf, Entscheidung und Formulierung von User Stories, Tasks
und Epics liegen beim Team.
