# ADR 0004: Client-Technologie

- **Status:** Entwurf
- **Datum:** 2026-09-18
- **Entschieden von:** Team (Gruppe 11), im Sprint-1-Planning
- **Betrifft:** [#1](https://github.com/Finn2103/maschinen-verwaltung/issues/1) · [#2](https://github.com/Finn2103/maschinen-verwaltung/issues/2) · [#6](https://github.com/Finn2103/maschinen-verwaltung/issues/6) · [#8](https://github.com/Finn2103/maschinen-verwaltung/issues/8)
- **Quelle:** `Nutzwerkanalysen.xlsx`, Blätter `Framework-Ausschluss` und `Framework`, Zahlen und Formulierungen unverändert übernommen

## Kontext

Für Webportal und Backoffice wird eine Client-Technologie gebraucht. Die Aufgabenstellung
nennt als Orientierung Angular, C#/C++ oder Flutter; verbindlich ist allein die Pflichtliste.
Die Wahl ist damit offen und muss begründet werden.

## Ausschlusskriterien

| Ausschlusskriterium | React/Next.js | Angular | Flutter |
| --- | --- | --- | --- |
| Client-Server-Architektur möglich | ja | ja, mit eigenem Backend | ja, mit eigenem Backend |
| Client-Server-Architektur möglich | ja | ja | ja |
| Barrierefreiheit nach ISO 9241 erreichbar | ja, über DOM und ARIA | ja, über DOM und ARIA | eingeschränkt |

## Nutzwertanalyse

Gewichte summieren auf 1,00. Bewertung 1 bis 5. Nutzwert = Summe aus Gewicht × Bewertung.

| Kriterium | Warum | Gewicht | React/Next.js | | Angular | | Flutter | |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | Bew. | Pkt. | Bew. | Pkt. | Bew. | Pkt. |
| Eigene Serverschicht im selben Projekt | Client Server ist Pflicht | 0,20 | 5 | 1,00 | 2 | 0,40 | 1 | 0,20 |
| Barrierefreiheit nach ISO 9241 | Pflicht | 0,20 | 5 | 1,00 | 5 | 1,00 | 2 | 0,40 |
| Eignung für datenlastige Oberflächen | Tabellen, Formulare, Validierung. Wenig Grafik | 0,15 | 4 | 0,60 | 5 | 0,75 | 2 | 0,30 |
| Lernzuwachs im Team | Vorgabe | 0,15 | 4 | 0,60 | 5 | 0,75 | 5 | 0,75 |
| Anlaufzeit | Harter Abgabetermin | 0,15 | 4 | 0,60 | 2 | 0,30 | 2 | 0,30 |
| Dokumentation | Keine Erfahrenen Entwickler | 0,10 | 5 | 0,50 | 4 | 0,40 | 3 | 0,30 |
| Betrieb auf der Strato VM ohne Fremddienst | Infracstructure as Code | 0,05 | 5 | 0,25 | 4 | 0,20 | 3 | 0,15 |
| **Nutzwert** | | **1,00** | | **4,55** | | **3,80** | | **2,40** |

## Entscheidung

**React mit Next.js.**

> **TODO, Interpretation ergänzen.** Die Aufgabenstellung verlangt sie ausdrücklich: die
> höchste Punktzahl allein ist keine Begründung. Was aus der Tabelle heraussticht:
>
> - Der Abstand entsteht fast vollständig an **einem** Kriterium, der eigenen Serverschicht
>   (React 1,00 gegen Angular 0,40 gegen Flutter 0,20).
> - **Angular gewinnt zwei Kriterien** gegen React: datenlastige Oberflächen und
>   Lernzuwachs. Das gehört erwähnt, sonst sieht die Analyse geschönt aus.
> - **Flutter verliert vor allem an der Barrierefreiheit** (0,40 gegen 1,00): also an einer
>   Pflichtvorgabe, nicht an Bequemlichkeit.

## Konsequenzen

> **TODO:** ergänzen. Was folgt daraus? Zum Beispiel: die Sprachwahl ist damit eingeschränkt
> (siehe [ADR 0010](0010-programmiersprache.md)), die Formularvalidierung baut das Team
> selbst, und der objektorientierte Anteil liegt in der Domänenschicht auf dem Server, nicht
> in den Komponenten.

---

## Anmerkungen zur Vorlage

Gefunden beim Überführen, nicht verändert:

- **Die Ausschlusstabelle nennt „Client-Server-Architektur möglich" zweimal** (Zeile 3 und 4).
  Zeile 4 ist mit „ja / ja / ja" gefüllt und dürfte ein anderes Kriterium meinen, 
  vermutlich „Objektorientierter Ansatz möglich". Bitte korrigieren, doppelte Kriterien
  fallen im Review auf.
- Zwei Schreibfehler in der Tabelle: **„Keine Erfahrenen Entwickler"** (klein: erfahrenen)
  und **„Infracstructure as Code"** (Infrastructure).
- Die Gewichte summieren korrekt auf 1,00.
- Die Punktzahlen sind rechnerisch korrekt nachvollzogen: 4,55 / 3,80 / 2,40 stimmen.
