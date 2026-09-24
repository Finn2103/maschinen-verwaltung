# Oberflächen-Konventionen

**Status:** Entwurf, die offenen Punkte in Abschnitt 2 entscheidet das Team, dann gilt das Dokument

Zweck: Im Review stellt das Lehrerteam **vertiefende Fragen ähnlich einem Fachgespräch in
der Abschlussprüfung**. Wer Muster beim Programmieren nebenbei wählt, kann hinterher nicht
sagen warum. Wer sie vorher festlegt und begründet, hat auf jede Frage eine Antwort.

Dieses Dokument ist deshalb zweierlei: **Regelwerk für den Code** und **Prüfungsvorbereitung.**
Abschnitt 4 listet die Fragen, die kommen werden, mit Verweis auf die Antwort.

---

## 1 Nicht verhandelbar

Folgt aus der Pflichtliste der Aufgabenstellung, nicht aus Geschmack.

| Regel | Warum |
| --- | --- |
| **Kein Datenzugriff aus Client-Komponenten.** Jeder Zugriff läuft über die Route Handlers des Servers | Client-Server-Architektur ist Pflicht. Der bequeme Supabase-Weg, direkt aus dem Browser, reißt sie |
| **Die Domänenschicht liegt auf dem Server und ist objektorientiert.** Klassen mit Verhalten: `Maschine`, `Reservierung`, `Rechnung` | Objektorientierter Ansatz ist Pflicht. React-Komponenten sind Oberfläche, nicht Modell |
| **Validierung an jeder Systemgrenze**, nicht auf Typen verlassen | TypeScript-Typen sind nach dem Übersetzen weg. Ein Typ ist eine Zusage, keine Kontrolle |
| **Jedes Eingabefeld hat ein sichtbares `<label for>`**, keine Platzhalter als Ersatz | Akzeptanzkriterium in #1 |
| **Fehlermeldungen werden über `aria-describedby` mit ihrem Feld verknüpft**, dazu `aria-invalid` | Akzeptanzkriterium in #1. Visuell darunter reicht nicht |
| **Richtiges HTML vor ARIA.** Ein `<button>` braucht kein `role` | Falsches ARIA ist schlechter als keines |
| **Sichtbarer Fokus** auf allem, was bedienbar ist | Tastaturbedienbarkeit ist Akzeptanzkriterium |

---

## 2 Zu entscheiden

### 2.1 Wie wird gestylt?

| Option | Dafür | Dagegen |
| --- | --- | --- |
| **CSS Modules** | In Next.js eingebaut, keine Abhängigkeit. Normales CSS mit lokalem Geltungsbereich. Mechanismus in einem Satz erklärbar: der Bundler hängt einen Hash an den Klassennamen, damit Namen nicht kollidieren | Kein Token-System von Haus aus, löst man mit CSS-Variablen |
| **Tailwind CSS** | Schnell geschrieben, von sich aus konsistent. Wenn du es schon kennst, der schnellste Weg | Man muss verteidigen, warum im Markup zwanzig Klassennamen stehen. Zusätzlicher Bauschritt |
| **CSS-in-JS** (styled-components u. ä.) | Styles direkt bei der Komponente | Läuft zur Laufzeit, reibt sich mit Server-Komponenten, zusätzliche Abhängigkeit. Schwächste Wahl hier |

**Vorschlag: CSS Modules plus CSS-Variablen für Design-Tokens.** Begründung, die im
Fachgespräch trägt: keine zusätzliche Abhängigkeit, der Mechanismus ist in einem Satz
erklärt, und die Barrierefreiheits-Arbeit, Fokusrahmen, Kontraste, ist gewöhnliches CSS.

Wenn Tempo wichtiger ist als Erklärbarkeit und du Tailwind schon kannst, ist Tailwind
vertretbar, dann aber bewusst, mit dem Satz „utility-first, damit Stile nicht auseinander
laufen" im Kopf.

> **Entscheidung:** ☐ CSS Modules ☐ Tailwind ☐ anderes: ______

### 2.2 Wo liegen die Design-Tokens?

Farben, Abstände, Schriftgrößen an **einer** Stelle als CSS-Variablen, nicht verstreut.
Zwei Fragen, die dazugehören: Gibt es eine dunkle Darstellung? Woher kommen die Kontrastwerte?

> **Entscheidung:** Datei: ______ · dunkle Darstellung ☐ ja ☐ nein

### 2.3 Zustandsverwaltung

Solange es geht: **kein globaler Speicher.** Zustand so lokal wie möglich, Daten über Props
nach unten, Ereignisse nach oben. Ein Store wird erst eingeführt, wenn ein konkretes Problem
ihn erzwingt, und dann mit einer Notiz hier, warum.

> **Entscheidung:** ☐ nur lokaler Zustand ☐ Store ab: ______

---

## 3 Konventionen, die daraus folgen

### Server- und Client-Komponenten

Standard ist die **Server-Komponente**. `"use client"` steht nur dort, wo wirklich
Interaktion nötig ist, Formulareingaben, Aufklappen, Fokussteuerung. Jede
Client-Komponente ist eine bewusste Entscheidung, keine Gewohnheit.

Faustregel: die Suchmaske aus Mockup 1 braucht Interaktion, die Ergebnisliste nicht.

### Formulare

Server-Validierung ist die Wahrheit, Client-Validierung ist Komfort. Beide dürfen
existieren, aber die serverseitige entscheidet, sonst genügt ein direkter API-Aufruf, um
sie zu umgehen.

### Fehlerfälle sind Ergebnisse, keine Abstürze

Der Reservierungskonflikt aus #1 ist ein **gültiges Ergebnis**: „dieser Zeitraum ist
belegt vom … bis …". Kein `throw`, sondern ein Rückgabewert, den der Typ beschreibt. Die
Oberfläche zeigt ihn am betroffenen Feld.

### Komponenten

Eine Komponente hat eine Aufgabe. Geteilt wird, wenn ein Teil eigenständig wiederverwendet
wird oder wenn ein Teil Interaktion braucht und der Rest nicht, nicht nach Zeilenzahl.

### Benennung

Deutsch in der Fachsprache (`Reservierung`, `Maschine`, `Zeitraum`), damit Code, ERD,
Klassendiagramm und Akzeptanzkriterien dieselben Wörter benutzen. Technische Begriffe
bleiben englisch. Einmal festlegen und durchhalten, Mischformen wie `MachineReservierung`
fallen im Review auf.

> **Entscheidung:** ☐ Fachbegriffe deutsch ☐ alles englisch

---

## 4 Die Fragen, auf die du antworten können musst

Vorbereitung fürs Fachgespräch. Wenn eine Antwort nicht in einem Satz kommt, fehlt hier
noch etwas.

| Frage | Wo die Antwort steht |
| --- | --- |
| Warum React und nicht Angular? | [ADR 0004](adr/0004-client-technologie.md): mitgelieferte Serverschicht |
| Wo ist bei React die Objektorientierung? | Abschnitt 1, Domänenschicht auf dem Server, nicht in den Komponenten |
| Wie stellt ihr sicher, dass der Client nicht direkt an die Datenbank geht? | Abschnitt 1, Zugriff nur über Route Handlers |
| Warum diese Styling-Technik? | Abschnitt 2.1 |
| Was ist der Unterschied zwischen Server- und Client-Komponente? | Abschnitt 3, und warum der Standard die Server-Komponente ist |
| Wie wird eine Fehlermeldung barrierefrei mit ihrem Feld verbunden? | Abschnitt 1, `aria-describedby` und `aria-invalid` |
| Was heißt DOM, was heißt ARIA? | `docs/wissen/` *(noch anzulegen)* |
| Warum validiert ihr zweimal? | Abschnitt 3, Server entscheidet, Client ist Komfort |
| Wo prüfst du, ob zwei Reservierungen sich überlappen, und warum dort? | Domänenschicht, Abschnitt 1 |
| Überlappen 24. bis 28.09. und 28.09. bis 02.10.? | **fachliche Entscheidung, noch offen**: siehe unten |

### Die offene Fachfrage

Wenn eine Maschine am 28. zurückkommt und am 28. wieder rausgeht: Konflikt oder nicht? Das
ist keine technische, sondern eine fachliche Entscheidung, und sie bestimmt, ob die Prüfung
`<` oder `<=` verwendet. Sie gehört entschieden und hier festgehalten, **bevor** die
Domänenklasse geschrieben wird.

> **Entscheidung:** ☐ Rückgabetag ist wieder buchbar ☐ Rückgabetag bleibt belegt

---

## 5 Wie mit diesem Dokument gearbeitet wird

Solange ein Punkt in Abschnitt 2 offen ist, gilt er als **nicht entschieden**, Code, der
ihn voraussetzt, wartet oder entscheidet ihn mit und trägt ihn hier nach.

Wird beim Bauen eine Konvention gebrochen, gibt es zwei Möglichkeiten: den Code anpassen
oder das Dokument ändern und die Änderung begründen. Was nicht geht, ist die stille
Abweichung, dann zeigt der Code etwas anderes als die Dokumentation, und genau das fällt
im Fachgespräch auf.
