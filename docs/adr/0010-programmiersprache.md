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
Wenn sich Schema und Anwendung auseinanderentwickeln, soll das auffallen — möglichst vor der
Laufzeit.

Dritte Randbedingung: die Anwendungsentwicklung ist einfach besetzt. Fehler, die ein
Übersetzer findet, kostet niemand Testzeit.

Diese Entscheidung ist **nicht unabhängig** von [ADR 0004](0004-client-technologie.md): die
Wahl der Client-Technologie schränkt die Sprache ein.

## Optionen

1. **TypeScript** — JavaScript mit statischer Typisierung, Übersetzung nach JavaScript
2. **JavaScript** — ohne statische Typisierung
3. **C#** — statisch typisiert, objektorientiert von Grund auf; im Web über Blazor

## Ausschlusskriterien aus der Pflichtliste

| Ausschlusskriterium | TypeScript | JavaScript | C# |
| --- | --- | --- | --- |
| Objektorientierter Ansatz möglich | ja | eingeschränkt | ja |
| Passt zur Client-Technologie aus ADR 0004 | ja | ja | **nein** |

Zu JavaScript: Klassen gibt es, aber ohne Interfaces, ohne Zugriffsmodifizierer und ohne
überprüfbare Verträge. Objektorientierung lässt sich schreiben, aber nicht durchsetzen.

Zu C#: Im Web wäre Blazor nötig. Das widerspricht ADR 0004 und hieße, die dortige
Entscheidung aufzuheben. Formal kein Pflichtverstoß, aber ein Widerspruch zur eigenen
Architektur.

## Nutzwertanalyse

Punkte 1 (ungeeignet) bis 5 (sehr gut geeignet). Nutzwert = Summe aus Gewicht × Punkte.

| Kriterium | Warum dieses Kriterium | Gewicht | TypeScript | JavaScript | C# |
| --- | --- | --- | --- | --- | --- |
| Typsicherheit vor der Laufzeit | Eine Person, wenig Zeit zum Testen. Was der Übersetzer findet, muss niemand suchen. | 0,25 | 4 | 1 | 5 |
| Objektorientierung sauber ausdrückbar | Pflicht. Klassen, Interfaces, Kapselung, Vererbung. | 0,20 | 4 | 3 | 5 |
| Passt zur Client-Technologie (ADR 0004) | Sonst zwei Sprachen und zwei Projekte. | 0,20 | 5 | 5 | 1 |
| Lernzuwachs im Team | Vorgabe des Bildungsgangs. | 0,15 | 4 | 1 | 5 |
| Typen aus dem Datenbankschema ableitbar | Abweichung zwischen DDL und Anwendung soll auffallen. | 0,10 | 5 | 1 | 4 |
| Werkzeugunterstützung in VS Code | Dort wird entwickelt. | 0,10 | 5 | 4 | 3 |
| **Nutzwert** | | **1,00** | **4,40** | **2,50** | **3,90** |

## Entscheidung

**TypeScript.**

Hier ist Offenheit wichtiger als ein hoher Punktwert: **C# ist bei den zwei Kriterien
besser, die für die Abschlussprüfung am meisten zählen** — echte Typsicherheit und
Objektorientierung von Grund auf. C# verliert nur, weil ADR 0004 einen JavaScript-basierten
Client gewählt hat.

Das ist die ehrliche Lesart: diese Entscheidung ist eine **Folge von ADR 0004**, keine
eigenständige. Wer die Client-Entscheidung kippt, kippt diese mit.

Gegenüber JavaScript ist der Abstand dagegen groß und eindeutig. Ohne Typen gibt es keine
überprüfbare Objektorientierung und keinen Abgleich mit dem Datenbankschema.

## Die Schwäche, die wir schriftlich festhalten

**TypeScript-Typen sind nach dem Übersetzen nicht mehr da.** Sie helfen beim Schreiben,
prüfen aber zur Laufzeit nichts. Alles, was von außen hereinkommt — Formulareingaben,
Antworten der Datenbank-API — muss an der Grenze **explizit geprüft** werden. Ein Typ ist
eine Zusage, keine Kontrolle.

Bei C# wäre das anders, und genau das ist der Preis dieser Entscheidung.

**Folge für die Umsetzung:** an jeder Systemgrenze wird validiert, nicht auf den Typ
vertraut. Das gilt besonders für #8, wo die Rechteprüfung serverseitig auch bei direktem
Aufruf der Datenbank-API greifen muss.

## Lernzuwachs

Auch hier: neu ist nicht die Sprache, sondern was dieses Projekt verlangt.

- **Objektorientiertes TypeScript.** Fast alle schreiben funktionales TypeScript —
  Funktionen über Datensätzen. Hier sind Klassen mit Verhalten gefordert: `Maschine`,
  `Reservierung`, `Rechnung` mit ihren Regeln, dazu Interfaces und Kapselung. Das ist eine
  andere Denkweise als die übliche und der Kern der Pflichtvorgabe.
- **Typen zur Laufzeit erzwingen.** Zu verstehen, dass Typen verschwinden, und die Grenzen
  bewusst abzusichern.
- **Fehlerfälle als Typ modellieren.** Der Reservierungskonflikt aus #1 ist kein Absturz,
  sondern ein gültiges Ergebnis. Solche Fälle im Typ auszudrücken, statt mit Ausnahmen zu
  arbeiten, ist neu und macht den Code prüfbar.
- **Typen aus dem Schema ableiten** und gegen die handgeschriebene DDL halten — die Stelle,
  an der sich Datenmodell und Anwendung auseinanderentwickeln würden.

## Konsequenzen

- Strenge Einstellungen von Anfang an. Nachträglich Typen einzuziehen ist teurer, als sie
  von Beginn an zu haben.
- An jeder Systemgrenze wird validiert. Das ist zusätzliche Arbeit und nicht verhandelbar.
- Das Klassendiagramm in `docs/uml` und der Quelltext müssen dasselbe zeigen. Wenn der Code
  funktional wird und das Diagramm objektorientiert bleibt, fällt das im Review auf.
