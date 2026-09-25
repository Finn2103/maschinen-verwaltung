# ADR 0010: Programmiersprache und Typisierung

- **Status:** Entwurf
- **Datum:** 2026-09-18
- **Entschieden von:** Team (Gruppe 11), im Sprint-1-Planning
- **Betrifft:** [#6](https://github.com/Finn2103/maschinen-verwaltung/issues/6) und alle Stories der Anwendungsentwicklung
- **Quelle:** `Nutzwerkanalysen.xlsx`, Blatt `Sprache`, Zahlen und Formulierungen unverändert übernommen

## Kontext

Die Pflichtliste verlangt einen objektorientierten Ansatz, ausdrücklich im Hinblick auf die
Abschlussprüfung. Das Datenbankschema wird als handgeschriebenes SQL-DDL geführt; Abweichungen
zwischen Schema und Anwendung sollen auffallen. Die Wahl hängt an
[ADR 0004](0004-client-technologie.md), die Client-Technologie schränkt die Sprache ein.

Bewertet werden vier Kandidaten: TypeScript und JavaScript aus der Client-Entscheidung, C#
und C++ aus der Optionsliste der Aufgabenstellung.

## Nutzwertanalyse

Bewertung 1 bis 5. Nutzwert = Summe aus Gewicht × Bewertung. Gewichte summieren auf 1,00.

**Stand nach der Korrektur vom 25.09.2026**, siehe „Korrekturen" weiter unten.

| Kriterium | Gewicht | TypeScript | | JavaScript | | C# | | C++ | |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | Bew. | Pkt. | Bew. | Pkt. | Bew. | Pkt. | Bew. | Pkt. |
| Typsicherheit vor der Laufzeit | 0,20 | 4 | 0,80 | 1 | 0,20 | 5 | 1,00 | 5 | 1,00 |
| Objektorientierung sauber ausdrückbar | 0,20 | 4 | 0,80 | 3 | 0,60 | 5 | 1,00 | 5 | 1,00 |
| Passt zur Client-Technologie | 0,10 | 5 | 0,50 | 5 | 0,50 | 1 | 0,10 | 1 | 0,10 |
| Eignung für Weboberflächen | 0,15 | 5 | 0,75 | 5 | 0,75 | 1 | 0,15 | 1 | 0,15 |
| Lernzuwachs im Team | 0,15 | 4 | 0,60 | 4 | 0,60 | 5 | 0,75 | 1 | 0,15 |
| Typen aus dem Datenbankschema ableitbar | 0,10 | 5 | 0,50 | 1 | 0,10 | 4 | 0,40 | 2 | 0,20 |
| Werkzeuge in VS Code | 0,10 | 5 | 0,50 | 5 | 0,50 | 3 | 0,30 | 2 | 0,20 |
| **Nutzwert** | **1,00** | | **4,45** | | **3,25** | | **3,70** | | **2,80** |

### Rangfolge

| Platz | Sprache | Nutzwert |
| --- | --- | --- |
| 1 | **TypeScript** | **4,45** |
| 2 | C# | 3,70 |
| 3 | JavaScript | 3,25 |
| 4 | C++ | 2,80 |

## Entscheidung

**TypeScript.**

> **TODO, Interpretation ergänzen.** Aus der Tabelle:
>
> - **C# und C++ gewinnen die zwei prüfungsrelevanten Kriterien**: Typsicherheit und
>   Objektorientierung, je 1,00 gegen 0,80. Beide verlieren an „passt zur
>   Client-Technologie" und „Eignung für Weboberflächen", also an der Folge von ADR 0004.
> - **C++ bekommt beim Lernzuwachs nur 1 Punkt**, weil es im Unterricht behandelt wurde.
>   Vorkenntnisse sind bei diesem Kriterium ein Nachteil, das ist der Satz, den man parat
>   haben sollte, wenn gefragt wird „warum nicht C++, das könnt ihr doch".
> - Diese Entscheidung ist eine **Folge von ADR 0004**, keine eigenständige. Wer die
>   Client-Wahl kippt, kippt diese mit.

## Konsequenzen

> **TODO:** ergänzen. Zum Beispiel: TypeScript-Typen sind nach dem Übersetzen weg, also muss
> an jeder Systemgrenze explizit validiert werden, besonders bei #8, wo die Rechteprüfung
> serverseitig auch bei direktem Aufruf der Datenbank-API greifen muss.

---

## Korrekturen

Beim Überführen nach Markdown fielen drei Fehler auf. Das Team hat sie am **25.09.2026**
besprochen und entschieden, wie korrigiert wird. Die ursprünglichen Zahlen stehen hier,
damit die Änderung nachvollziehbar bleibt.

### 1. Die Gewichte summierten auf 1,10 statt 1,00

`0,20 + 0,20 + 0,20 + 0,15 + 0,15 + 0,10 + 0,10 = 1,10`

Alle Nutzwerte waren dadurch um rund 10 % zu hoch, TypeScript kam auf 4,95 bei einer
Skala, die bei 5 endet. Das ist formal nicht möglich.

**Entscheidung des Teams:** „Passt zur Client-Technologie" geht von **0,20 auf 0,10**.
Begründung: das Kriterium überschneidet sich inhaltlich stark mit „Eignung für
Weboberflächen", beide messen im Kern dasselbe. „Objektorientierung sauber ausdrückbar"
bleibt bei 0,20 und ist damit zusammen mit der Typsicherheit das schwerste Kriterium, weil
der objektorientierte Ansatz in der Pflichtliste der Aufgabenstellung steht.

### 2. JavaScript hatte bei „Typen aus dem Datenbankschema ableitbar" 5 Punkte

JavaScript kennt keine Typen und kann das Kriterium nicht erfüllen. Es stand dieselbe
Punktzahl wie bei TypeScript. **Genau dieser Posten hob JavaScript auf Platz 2.**

**Entscheidung des Teams:** JavaScript bekommt **1 Punkt**. Erwogen wurde 0, verworfen,
weil die Skala bei 1 beginnt und eine 0 sie sprengen würde. 1 ist der niedrigste Wert der
Skala und sagt dasselbe aus.

### Wirkung der beiden Korrekturen

| | vorher | nachher | |
| --- | --- | --- | --- |
| TypeScript | 4,95 | **4,45** | bleibt Platz 1 |
| JavaScript | 4,15 | **3,25** | **von Platz 2 auf Platz 3** |
| C# | 3,80 | **3,70** | **von Platz 3 auf Platz 2** |
| C++ | 2,90 | **2,80** | bleibt Platz 4 |

Die Entscheidung für TypeScript ändert sich nicht. Sie ist sogar belastbarer als vorher:
**TypeScript ist auf jedem einzelnen Kriterium mindestens so gut wie JavaScript**, keine
Gewichtung kann diese beiden vertauschen.

### 3. Kleinigkeiten

- **„Typsicherheut"** in „Typsicherheit" korrigiert
- Die Kriterienspalte hat im Blatt keine Überschrift, Zelle A1 ist leer
- Die Nutzwert-Zeile ist im Blatt verschoben: bei C++ steht die 3 in der Bewertungsspalte
  statt in der Punktespalte
- Rechnerisch stimmen alle vier Nutzwerte zu den eingetragenen Punkten, geprüft

### Noch offen

**Lernzuwachs 4 für JavaScript**, genauso viel wie für TypeScript. Wer TypeScript kann,
kann JavaScript. Das Team hat diesen Punkt am 25.09. nicht entschieden. Er ändert die
Rangfolge nicht, sollte aber vor der Abgabe angefasst werden.
