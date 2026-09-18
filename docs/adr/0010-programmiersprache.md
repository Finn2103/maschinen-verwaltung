# ADR 0010 — Programmiersprache und Typisierung

- **Status:** Entwurf — Formulierung wird vom Team überschrieben
- **Datum:** 2026-09-18
- **Entschieden von:** Team (Gruppe 11), im Sprint-1-Planning
- **Betrifft:** [#6](https://github.com/Finn2103/maschinen-verwaltung/issues/6) und alle Stories der Anwendungsentwicklung

## Kontext

Die Pflichtliste verlangt einen **objektorientierten Ansatz** — ausdrücklich im Hinblick auf
die Abschlussprüfung. Die Sprache muss das also nicht nur erlauben, sondern gut ausdrücken
können.

Zweite Randbedingung: das Datenbankschema wird als **handgeschriebenes SQL-DDL** geführt.
Wenn Schema und Anwendung auseinanderlaufen, soll das auffallen — möglichst vor der
Laufzeit.

Dritte Randbedingung: die Anwendungsentwicklung ist einfach besetzt, bei 12 bis 18 Stunden
Entwicklungszeit pro Sprint. Fehler, die ein Übersetzer findet, kostet niemand Testzeit.

Diese Entscheidung ist **nicht unabhängig** von [ADR 0004](0004-client-technologie.md): die
Wahl der Client-Technologie schränkt die Sprache ein.

### Warum diese drei Kandidaten

Verglichen werden die Sprachen, die für dieses Team realistisch zur Verfügung stehen:
**TypeScript und JavaScript** über die Client-Entscheidung aus ADR 0004, **C++** aus dem
Unterricht — die Aufgabenstellung nennt es ausdrücklich als Option.

**C# wird nicht verglichen.** Es steht ebenfalls in der Aufgabenstellung, würde im Web aber
Blazor verlangen und damit die Client-Entscheidung aus ADR 0004 aufheben. Wer C# will, muss
zuerst 0004 neu entscheiden.

## Optionen

1. **TypeScript** — JavaScript mit statischer Typisierung, Übersetzung nach JavaScript
2. **JavaScript** — ohne statische Typisierung
3. **C++** — statisch typisiert, objektorientiert; im Browser über WebAssembly

Zu C++ im Web: Der realistische Weg in den Browser ist **WebAssembly**. Die dafür
verfügbaren Oberflächen-Bibliotheken zeichnen die Darstellung auf eine Zeichenfläche und
bauen keinen Dokumentbaum auf — mit demselben Barrierefreiheits-Problem wie Flutter in
ADR 0004. Es gibt außerdem serverseitige C++-Baukästen, die HTML ausliefern; die sind
technisch möglich, aber eine Nische mit sehr kleinem Umfeld an Dokumentation und Hilfe.

## Ausschlusskriterien aus der Pflichtliste

| Ausschlusskriterium | TypeScript | JavaScript | C++ |
| --- | --- | --- | --- |
| Objektorientierter Ansatz möglich | ja | eingeschränkt | ja |
| Passt zur Client-Technologie aus ADR 0004 | ja | ja | **nein** |
| Barrierefreiheit nach ISO 9241 erreichbar | ja | ja | **eingeschränkt** |

Zu JavaScript: Klassen gibt es, aber ohne Interfaces, ohne Zugriffsmodifizierer und ohne
überprüfbare Verträge. Objektorientierung lässt sich schreiben, aber nicht durchsetzen.

Zu C++: Beides sind schwere Treffer. Ein harter Ausschluss wäre vertretbar — die Analyse
rechnet C++ trotzdem durch, weil es in der Aufgabenstellung steht und im Team
Vorkenntnisse bestehen.

## Nutzwertanalyse

Punkte 1 (ungeeignet) bis 5 (sehr gut geeignet). Nutzwert = Summe aus Gewicht × Punkte.

| Kriterium | Warum dieses Kriterium | Gewicht | TypeScript | JavaScript | C++ |
| --- | --- | --- | --- | --- | --- |
| Typsicherheit vor der Laufzeit | Eine Person, wenig Zeit zum Testen. Was der Übersetzer findet, muss niemand suchen. | 0,20 | 4 | 1 | **5** |
| Objektorientierung sauber ausdrückbar | Pflicht. Klassen, Interfaces, Kapselung, Vererbung. | 0,20 | 4 | 3 | **5** |
| Passt zur Client-Technologie (ADR 0004) | Sonst sind zwei Projekte in zwei Sprachen zu bauen und zu betreiben. | 0,20 | **5** | **5** | 1 |
| Eignung für formular- und tabellenlastige Weboberflächen | Das Produkt ist Verwaltung: Eingabe, Validierung, Listen. Und die Barrierefreiheit hängt am Dokumentbaum. | 0,15 | **5** | **5** | 1 |
| Lernzuwachs im Team | Vorgabe des Bildungsgangs. | 0,10 | 4 | 1 | 2 |
| Typen aus dem Datenbankschema ableitbar | Abweichung zwischen DDL und Anwendung soll auffallen. | 0,10 | **5** | 1 | 2 |
| Werkzeugunterstützung in VS Code | Dort wird entwickelt. | 0,05 | **5** | 4 | 3 |
| **Nutzwert** | | **1,00** | **4,50** | **2,95** | **2,90** |

## Interpretation

Das Ergebnis ist aufschlussreicher als die Rangfolge:

**C++ ist als Sprache die beste der drei und für diese Aufgabe die schlechteste.** Es
gewinnt die zwei Kriterien, auf die die Abschlussprüfung zielt — echte Typsicherheit und
Objektorientierung von Grund auf — und verliert alles, was mit „Weboberfläche" zu tun hat.
Im Browser läuft es über WebAssembly, zeichnet die Darstellung und hat damit keinen
Dokumentbaum, an dem Barrierefreiheit hängen könnte.

**JavaScript ist das Gegenteil:** passt perfekt zur Oberfläche, kann aber die
Pflichtvorgabe Objektorientierung nicht durchsetzen und bietet keinen Abgleich mit dem
Schema.

Dass beide mit 2,95 und 2,90 fast gleich landen, ist kein Zufall und kein Patt — sie
scheitern an **entgegengesetzten** Kriterien. Genau deshalb entscheidet die Punktzahl hier
nichts, sondern die Frage, welches Scheitern man sich leisten kann. Eine Pflichtvorgabe
reißen kann man sich nicht leisten; beide tun es.

**Ein Hinweis zum Lernzuwachs, der überraschen mag:** C++ bekommt hier nur 2 Punkte, obwohl
es die anspruchsvollste Sprache ist — **weil es im Unterricht behandelt wurde**. Vorkenntnisse
sind bei diesem Kriterium ein Nachteil, nicht ein Vorteil. Das ist die Vorgabe des
Bildungsgangs, und sie wird hier konsequent angewendet.

## Entscheidung

**TypeScript.**

Drei Gründe, jeder für sich tragfähig:

**1. Es ist die einzige Option, die die Objektorientierungs-Pflicht und den gewählten
Client trägt.** JavaScript kann Objektorientierung nicht erzwingen — man kann sie
hinschreiben, aber niemand merkt, wenn man sie bricht. Damit wäre die Pflichtvorgabe
faktisch nicht nachweisbar. C++ könnte sie, passt aber nicht zur Oberfläche.

**2. Eine Sprache über die Client-Server-Grenze — und damit ein Domänenmodell statt zwei.**
Die Client-Server-Pflicht heißt: Code läuft auf beiden Seiten. Mit TypeScript beschreibt
**dieselbe** Klasse `Reservierung` das Formular im Browser und die Validierung auf dem
Server. Bei getrennten Sprachen hätte man das Modell zweimal und müsste es von Hand synchron
halten — dort entstehen die Fehler, die niemand findet.

**3. Das Schema führt, der Code folgt — und die Abweichung wird sichtbar.** Aus dem
handgeschriebenen SQL-DDL lassen sich Typen ableiten. Laufen Schema und Anwendung
auseinander, gibt es einen Übersetzungsfehler statt eines Fehlverhaltens im Betrieb. Das ist
die technische Antwort auf „kein implizit erzeugtes Schema": das Schema ist die Wahrheit,
der Code muss sich fügen.

## Die Schwäche, die wir schriftlich festhalten

**TypeScript-Typen sind nach dem Übersetzen nicht mehr da.** Sie helfen beim Schreiben,
prüfen zur Laufzeit aber nichts. Alles, was von außen hereinkommt — Formulareingaben,
Antworten der Datenbank-API — muss an der Grenze **explizit geprüft** werden. Ein Typ ist
eine Zusage, keine Kontrolle.

Bei C++ wäre das anders, und genau das ist der Preis dieser Entscheidung.

**Folge für die Umsetzung:** an jeder Systemgrenze wird validiert, nicht auf den Typ
vertraut. Das gilt besonders für #8, wo die Rechteprüfung serverseitig auch bei direktem
Aufruf der Datenbank-API greifen muss.

## Lernzuwachs

Neu ist nicht die Sprache, sondern was dieses Projekt damit verlangt. Der Lernzuwachs
verteilt sich nach Fachrichtung:

**Anwendungsentwicklung**

- **Objektorientiertes TypeScript.** Fast alle schreiben funktionales TypeScript —
  Funktionen über Datensätzen. Hier sind Klassen mit Verhalten gefordert: `Maschine`,
  `Reservierung`, `Rechnung` mit ihren Regeln, dazu Interfaces und Kapselung. Eine andere
  Denkweise als die übliche und der Kern der Pflichtvorgabe.
- **Typen zur Laufzeit erzwingen.** Verstehen, dass Typen verschwinden, und die Grenzen
  bewusst absichern.
- **Fehlerfälle als Typ modellieren.** Der Reservierungskonflikt aus #1 ist kein Absturz,
  sondern ein gültiges Ergebnis. Solche Fälle im Typ auszudrücken statt mit Ausnahmen zu
  arbeiten, macht den Code prüfbar.
- **Typen aus dem Schema ableiten** und gegen die handgeschriebene DDL halten.

**Systemintegration** — hier liegt der Lernzuwachs nicht in der Sprache, sondern in
ADR 0001 und [ADR 0006](0006-datenhaltung.md): Debian härten, einen Verbund aus rund zehn
Containern selbst betreiben, Rechteprüfung auf Zeilenebene in PostgreSQL, Infrastructure as
Code mit einem durchgeführten Wiederaufbau, Sicherung und Wiederherstellung.

## Konsequenzen

- Strenge Einstellungen von Anfang an. Nachträglich Typen einzuziehen ist teurer.
- An jeder Systemgrenze wird validiert. Zusätzliche Arbeit, nicht verhandelbar.
- Das Klassendiagramm in `docs/uml` und der Quelltext müssen dasselbe zeigen. Wird der Code
  funktional und bleibt das Diagramm objektorientiert, fällt das im Review auf.
- Wer C++ oder C# doch will, muss zuerst ADR 0004 neu entscheiden — die Sprachwahl hängt
  daran und nicht umgekehrt.
