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

Bewertung 1 bis 5. Nutzwert = Summe aus Gewicht × Bewertung.

| Kriterium | Gewicht | TypeScript | | JavaScript | | C# | | C++ | |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | Bew. | Pkt. | Bew. | Pkt. | Bew. | Pkt. | Bew. | Pkt. |
| Typsicherheut vor der Laufzeit | 0,20 | 4 | 0,80 | 1 | 0,20 | 5 | 1,00 | 5 | 1,00 |
| Objektorientierung sauber ausdrückbar | 0,20 | 4 | 0,80 | 3 | 0,60 | 5 | 1,00 | 5 | 1,00 |
| Passt zur Client-Technologie | 0,20 | 5 | 1,00 | 5 | 1,00 | 1 | 0,20 | 1 | 0,20 |
| Eignung für Weboberflächen | 0,15 | 5 | 0,75 | 5 | 0,75 | 1 | 0,15 | 1 | 0,15 |
| Lernzuwachs im Team | 0,15 | 4 | 0,60 | 4 | 0,60 | 5 | 0,75 | 1 | 0,15 |
| Typen aus dem Datenbankschema ableitbar | 0,10 | 5 | 0,50 | 5 | 0,50 | 4 | 0,40 | 2 | 0,20 |
| Werkzeuge in VS Code | 0,10 | 5 | 0,50 | 5 | 0,50 | 3 | 0,30 | 2 | 0,20 |
| **Nutzwert** | **1,10** | | **4,95** | | **4,15** | | **3,80** | | **2,90** |

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

## Anmerkungen zur Vorlage

Gefunden beim Überführen, **nicht verändert**. Die ersten zwei Punkte solltest du vor der
Abgabe anfassen:

### 1. Die Gewichte summieren auf 1,10 statt 1,00

`0,20 + 0,20 + 0,20 + 0,15 + 0,15 + 0,10 + 0,10 = 1,10`

Dadurch sind alle Nutzwerte um etwa 10 % zu hoch. **Die Rangfolge ändert sich nicht**, aber
ein Nutzwert über 5 bei einer Skala von 1 bis 5 ist formal nicht möglich und fällt sofort
auf. Normiert auf 1,00 ergibt sich:

| | im Blatt | normiert |
| --- | --- | --- |
| TypeScript | 4,95 | **4,50** |
| JavaScript | 4,15 | **3,77** |
| C# | 3,80 | **3,45** |
| C++ | 2,90 | **2,64** |

Entweder ein Gewicht um 0,10 senken oder alle durch 1,10 teilen.

### 2. JavaScript bekommt bei „Typen aus dem Datenbankschema ableitbar" 5 Punkte

JavaScript hat keine Typen. Dieses Kriterium kann es nicht erfüllen, hier steht
dieselbe Punktzahl wie bei TypeScript. **Das ist der Posten, der JavaScript auf Platz 2
hebt.** Mit 1 statt 5 Punkten:

`JavaScript 3,75`, damit fällt es hinter C# (3,80) zurück, und das Bild wird schlüssig.

Zum Vergleich auffällig: **Lernzuwachs 4 für JavaScript**, genauso viel wie für TypeScript.
Wer TypeScript kann, kann JavaScript, das ist schwer zu begründen.

### 3. Kleinigkeiten

- **„Typsicherheut"** → Typsicherheit
- Die Kriterienspalte hat keine Überschrift (Zelle A1 ist leer)
- Die Nutzwert-Zeile ist im Blatt verschoben: bei C++ steht die 3 in der Bewertungsspalte
  statt in der Punktespalte
- Rechnerisch stimmen alle vier Nutzwerte zu den eingetragenen Punkten, geprüft
