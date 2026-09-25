# ADR 0001: Linux-Distribution für die Strato-VM

- **Status:** **Entschieden** am 25.09.2026. Bewertung „Vorkenntnisse" korrigiert, Abweichung begründet
- **Datum:** Nutzwertanalyse vom 04.09.2026, überführt nach Markdown am 18.09.2026
- **Entschieden von:** Team (Gruppe 11)
- **Betrifft:** [#4](https://github.com/Finn2103/maschinen-verwaltung/issues/4) · [#5](https://github.com/Finn2103/maschinen-verwaltung/issues/5) · [#11](https://github.com/Finn2103/maschinen-verwaltung/issues/11) · [#13](https://github.com/Finn2103/maschinen-verwaltung/issues/13)
- **Quelle:** `Nutzwerkanalyse.xlsx`, diese Datei ist die Überführung in Markdown, die Zahlen sind unverändert

## Kontext

Auf der Strato-VM läuft ein Linux. Welches, wird kriteriengeleitet entschieden und nicht
nach Gefühl. Die Nutzwertanalyse ist Prüfungsthema.

## Vorauswahl

Recherchiert wurden acht Kandidaten:

Ubuntu 24.04 LTS · Ubuntu 26.04 LTS · Debian 12 · Debian 13 ·
Rocky Linux 8 · Rocky Linux 9 · AlmaLinux 8 · AlmaLinux 9

Bewertet wurde jeweils nur die **aktuelle Hauptversion** jeder Distribution, die
Vorgängerversionen fallen in der Vorauswahl heraus.

> **TODO:** Begründung der Vorauswahl ergänzen. Warum sind Ubuntu 24.04, Debian 12,
> Rocky 8 und AlmaLinux 8 nicht in die Bewertung gekommen?

## Nutzwertanalyse

Gewichtung in Punkten (Summe 165, nicht normiert). Bewertung 1 bis 4.
Punkte = Gewichtung × Bewertung.

| Kriterium | Gewichtung | Begründung der Gewichtung | Ubuntu 26.04 LTS | | Debian 13 | | Rocky Linux 9 | | AlmaLinux 9 | |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | Bew. | Pkt. | Bew. | Pkt. | Bew. | Pkt. | Bew. | Pkt. |
| Support-Zeitraum | 10 | Updates immer möglich | 3 | 30 | 2 | 20 | 4 | 40 | 4 | 40 |
| Sicherheitsupdates | 15 | Updates immer möglich | 3 | 45 | 3 | 45 | 3 | 45 | 3 | 45 |
| Paketverfügbarkeit | 30 | Projekt sonst nicht möglich | 4 | 120 | 3 | 90 | 2 | 60 | 2 | 60 |
| Container-Unterstützung | 30 | Projekt sonst nicht möglich | 4 | 120 | 4 | 120 | 3 | 90 | 3 | 90 |
| Dokumentation | 25 | Vorkenntnisse unabhängig | 4 | 100 | 3 | 75 | 3 | 75 | 3 | 75 |
| Verbreitung im Berufsalltag | 20 | Weniger einarbeiten | 4 | 80 | 3 | 60 | 3 | 60 | 3 | 60 |
| Images bei Strato | 30 | Projekt sonst nicht möglich | 4 | 120 | 4 | 120 | 4 | 120 | 4 | 120 |
| Vorkenntnisse im Team | 5 | Gut aber nicht notwendig | 2 | 10 | 3 | 15 | 1 | 5 | 1 | 5 |
| **Summe** | **165** | | **28** | **625** | **25** | **545** | **23** | **495** | **23** | **495** |

### Rangfolge nach Nutzwert

| Platz | Distribution | Nutzwert |
| --- | --- | --- |
| 1 | Ubuntu 26.04 LTS | **625** |
| 2 | Debian 13 | 545 |
| 3 | Rocky Linux 9 | 495 |
| 3 | AlmaLinux 9 | 495 |

> Die Zahlen enthalten die Korrektur vom 25.09.2026 bei „Vorkenntnisse im Team".
> Vorher: Ubuntu 630, Debian 540.

## Entscheidung

**Debian 13.**

Die Nutzwertanalyse gewinnt **Ubuntu 26.04 LTS mit 625 Punkten**, entschieden wurde
**Debian 13 mit 545**. Das ist eine bewusste Abweichung von 80 Punkten. Die
Aufgabenstellung verlangt ausdrücklich, das Ergebnis zu interpretieren: *„Ergebnis
interpretieren, die höchste Punktzahl allein ist keine Begründung."*

### Begründung

> **Vom Team am 25.09.2026 festgelegt. Bitte gegenlesen, ob das eure Begründung so trifft.**

1. **Das Team kennt Debian besser als Ubuntu.** Die ursprüngliche Bewertung sagte das
   Gegenteil und war falsch. Sie ist korrigiert, siehe „Korrekturen". Das Kriterium wiegt
   allerdings nur 5 von 165 Punkten und trägt die Entscheidung nicht allein.
2. **Der Server läuft bereits unter Debian 13.** Die Einrichtung ist gemacht, die Arbeit an
   #5 und #11 baut darauf auf. Ein Wechsel würde Sprintzeit kosten, die gegen einen harten
   Abgabetermin am 11.12.2026 nicht vorhanden ist. Der Nutzen aus 80 Punkten Vorsprung
   würde diesen Aufwand nicht aufwiegen.

### Was diese Begründung nicht behauptet

Damit im Fachgespräch nichts auseinanderfällt: Debian gewinnt **kein einziges Kriterium**
der Tabelle. Der Abstand von 80 Punkten entsteht an vier Stellen, an denen Ubuntu
tatsächlich besser bewertet ist:

| Kriterium | Gewicht | Ubuntu | Debian | Abstand |
| --- | --- | --- | --- | --- |
| Paketverfügbarkeit | 30 | 4 | 3 | 30 |
| Dokumentation | 25 | 4 | 3 | 25 |
| Verbreitung im Berufsalltag | 20 | 4 | 3 | 20 |
| Support-Zeitraum | 10 | 3 | 2 | 10 |

Diese Bewertungen bleiben stehen. Die Entscheidung für Debian ist eine **Projektentscheidung
gegen die Rangfolge**, keine Behauptung, Debian sei technisch besser.

### Nachgeprüft am 25.09.2026

Zwei Annahmen der Tabelle wurden überprüft, bevor die Abweichung festgeschrieben wurde.
**Beide bestätigen die ursprünglichen Bewertungen**, keine musste geändert werden:

| Geprüft | Ergebnis | Quelle |
| --- | --- | --- |
| Bietet STRATO überhaupt ein Image für Ubuntu 26.04 LTS? | **Ja, aber nur für eine Serverklasse** („V-Server Linux V, PA-S"). Standard sind Ubuntu 24.04 und 22.04. **Debian 13, 12 und 11 sind über mehrere Serverklassen verfügbar** | [STRATO FAQ](https://www.strato.de/faq/server/welche-betriebssysteme-stehen-fuer-server-zur-verfuegung/) |
| Stimmt „Verbreitung im Berufsalltag" mit Ubuntu 4 zu Debian 3? | **Ja.** Unter Webservern mit erkennbarer Distribution: Ubuntu **15,1 %**, Debian **5,8 %** | [W3Techs, 25.09.2026](https://w3techs.com/technologies/details/os-linux) |

Der erste Punkt ist ein Nebenbefund, der für Debian spricht: Ubuntu 26.04 ist bei STRATO
deutlich schmaler verfügbar als Debian 13. Die Bewertung „Images bei STRATO" steht für
beide auf 4 und wurde nicht geändert, weil das Projekt auf einer Serverklasse läuft, auf
der beides zu haben ist.

## Konsequenzen

> **TODO:** Vom Team zu ergänzen. Punkte, die hier hingehören:
>
> - Paketquellen: Debian stable ist älter. Was passiert, wenn ein benötigtes Paket zu alt
>   ist, Backports oder Container?
> - Sicherheitsupdates: wer spielt sie ein, in welchem Takt, und wie wird das in #17
>   (Update- und Patch-Prozess) festgehalten?
> - Der Support-Zeitraum ist der schwächste Punkt der Wahl. Wie lange trägt Debian 13, und
>   was passiert danach?
> - Wer im Team kann die Distribution administrieren, und was passiert, wenn diese Person
>   ausfällt?

## Anmerkungen zur Methode

Zwei Punkte, die im Review angesprochen werden könnten:

- **Die Gewichtungen summieren sich auf 165**, nicht auf 100 oder 1,0. Das ist rechnerisch
  in Ordnung, weil nur die relativen Abstände zählen, die Rangfolge ändert sich durch
  Normieren nicht. Es ist aber unüblich, und man sollte den Satz parat haben.
- **Die Bewertungsskala reicht von 1 bis 4.** Eine gerade Skala ohne Mitte ist eine bewusste
  Wahl (sie erzwingt eine Tendenz), falls das beabsichtigt war, kurz erwähnen.

## Korrekturen

### Vorkenntnisse im Team, korrigiert am 25.09.2026

Im Blatt stand **Ubuntu 3, Debian 2**, das Team kennt aber Debian besser. Die Werte waren
vertauscht und sind auf **Ubuntu 2, Debian 3** geändert.

| | vorher | nachher |
| --- | --- | --- |
| Ubuntu 26.04 LTS | 630 | **625** |
| Debian 13 | 540 | **545** |
| Abstand | 90 | **80** |

Die Rangfolge ändert sich dadurch nicht. Das Kriterium wiegt 5 von 165 Punkten; selbst die
größtmögliche Korrektur hätte den Abstand nur auf 60 Punkte verringert. Die Entscheidung
für Debian steht deshalb auf der Begründung oben, nicht auf dieser Korrektur.
