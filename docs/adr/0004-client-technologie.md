# ADR 0004: Client-Technologie

- **Status:** **Entschieden.** Interpretation und Konsequenzen am 01.10.2026 vom Team ergänzt
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
| Objektorientierter Ansatz möglich | ja | ja | ja |
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

Die Nutzwertanalyse gewinnt React mit 4,55 vor Angular mit 3,80 und Flutter mit 2,40.
Die höchste Punktzahl allein ist keine Begründung, deshalb die Aufschlüsselung: woher
kommen die 0,75 Abstand zwischen React und Angular?

| Kriterium | Gewicht | React | Angular | bringt React |
| --- | --- | --- | --- | --- |
| Eigene Serverschicht im selben Projekt | 0,20 | 5 | 2 | **+0,60** |
| Anlaufzeit | 0,15 | 4 | 2 | **+0,30** |
| Dokumentation | 0,10 | 5 | 4 | +0,10 |
| Betrieb ohne Fremddienst | 0,05 | 5 | 4 | +0,05 |
| Barrierefreiheit nach ISO 9241 | 0,20 | 5 | 5 | 0 |
| Eignung für datenlastige Oberflächen | 0,15 | 4 | 5 | **−0,15** |
| Lernzuwachs im Team | 0,15 | 4 | 5 | **−0,15** |
| | | | | **= +0,75** |

**Die eigene Serverschicht trägt 0,60 der 0,75.** Sie ist der eigentliche Grund. Angular
und Flutter sind reine Client-Technologien. Die Aufgabenstellung macht eine
Client-Server-Architektur und eine Datenbank-API zur Pflicht; mit Angular oder Flutter
bräuchten wir dafür ein zweites Projekt mit eigenem Server, eigenem Aufbau und eigener
Wartung. Next.js bringt diese Schicht mit.

**Anlaufzeit mit +0,30 ist der zweite Grund.** Der Abgabetermin am 11.12.2026 steht fest
und wird nicht verschoben. Wie schnell ein Team produktiv wird, ist deshalb kein Komfort,
sondern ein Projektrisiko.

**Angular gewinnt zwei Kriterien gegen React** und verliert trotzdem: datenlastige
Oberflächen (5 gegen 4) und Lernzuwachs im Team (5 gegen 4). Zusammen kosten sie React
0,30. Das gehört hier hin, sonst sieht die Analyse geschönt aus. Angular ist für Formulare
und Tabellen tatsächlich besser ausgestattet, und es wäre für uns das unbekanntere und
damit lehrreichere Werkzeug gewesen.

> **Nicht verwechseln:** *Lernzuwachs* ist der Zugewinn an Wissen, nicht die Steilheit der
> Lernkurve. Ein hoher Lernzuwachs ist nach der Aufgabenstellung **erwünscht**. Dass React
> hier schlechter abschneidet, ist also ein Nachteil und darf nicht als Vorteil gelesen
> werden. Wie schnell man loslegen kann, steckt getrennt davon in *Anlaufzeit*.

**Flutter verliert an einer Pflichtvorgabe**, nicht an Bequemlichkeit: Barrierefreiheit 2
gegen 5. Flutter zeichnet seine Oberfläche selbst, statt sie aus Dokumentelementen
aufzubauen. Hilfstechnik liest aber den Dokumentenbaum. ISO 9241 steht in der Pflichtliste.

### Abweichung von der Referenzarchitektur

Die Aufgabenstellung nennt Angular, C#/C++ oder Flutter als Orientierung. Wir weichen ab
und begründen das mit der Client-Server-Pflicht: alle drei genannten Optionen erfüllen sie
nur mit einem zusätzlichen Server. Die Referenzarchitektur ist ausdrücklich als
„Überlegungen" mit „Wahlmöglichkeiten, die kriteriengeleitet ausgewählt werden müssen"
bezeichnet. Genau das ist hier geschehen.

## Konsequenzen

**Wo die Objektorientierung liegt.** Die Pflichtliste verlangt einen objektorientierten
Ansatz. React-Komponenten sind Darstellung, kein Fachmodell. Die Domänenschicht liegt
deshalb **im Next.js-Server als Klassen mit Verhalten**: Maschine, Reservierung, Buchung,
Rechnung tragen ihre Regeln selbst. Die Überlappungsprüfung aus #1 gehört dorthin, nicht in
eine Komponente und nicht in einen Route Handler.

**Kein Datenzugriff aus dem Browser.** Client-Komponenten sprechen ausschließlich mit
unseren Route Handlers, diese über die Datenbank-API mit PostgreSQL. Zugangsdaten stehen
nur serverseitig. Alles, was im Browser läuft, ist einsehbar und veränderbar; eine Prüfung
dort ist Komfort, keine Absicherung.

**Vier von fünf im Team können React nicht.** Das ist mit der Wahl eingekauft. Es bedeutet
Einarbeitungszeit und dass Oberflächenarbeit nicht beliebig verteilt werden kann. Die
Oberflächen-Konventionen (`docs/frontend-konventionen.md`) sind die Gegenmaßnahme: Muster
einmal festlegen, statt sie in jeder Komponente neu zu erfinden.

**Die Sprachwahl ist damit eingeschränkt**, siehe [ADR 0010](0010-programmiersprache.md).
Wer diese Entscheidung kippt, kippt jene mit.

**Server ist die Voreinstellung.** `"use client"` nur dort, wo Interaktion nötig ist, und so
weit unten im Komponentenbaum wie möglich. Das hält die Menge an JavaScript im Browser klein
und die Datenzugriffe auf dem Server.

---

## Anmerkungen zur Vorlage

Gefunden beim Überführen. Was das Team entschieden hat, ist eingearbeitet und hier
festgehalten; die übrigen Punkte stehen unverändert.

- **Korrigiert am 25.09.2026:** Die Ausschlusstabelle nannte „Client-Server-Architektur
  möglich" zweimal (Zeile 3 und 4). Zeile 4 war mit „ja / ja / ja" gefüllt. Das Team hat
  bestätigt, dass dort **„Objektorientierter Ansatz möglich"** gemeint war, und die Zeile
  entsprechend umbenannt. Die Bewertungen bleiben unverändert, alle drei Kandidaten
  erfüllen das Kriterium. Am Ergebnis ändert sich nichts, die Ausschlusstabelle wird nicht
  in den Nutzwert eingerechnet.
- Zwei Schreibfehler in der Tabelle: **„Keine Erfahrenen Entwickler"** (klein: erfahrenen)
  und **„Infracstructure as Code"** (Infrastructure).
- Die Gewichte summieren korrekt auf 1,00.
- Die Punktzahlen sind rechnerisch korrekt nachvollzogen: 4,55 / 3,80 / 2,40 stimmen.
