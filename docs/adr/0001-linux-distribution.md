# ADR 0001 — Linux-Distribution für die Strato-VM

- **Status:** Entwurf — die Begründung unter „Entscheidung" fehlt noch
- **Datum:** Nutzwertanalyse vom 04.09.2026, überführt nach Markdown am 18.09.2026
- **Entschieden von:** Team (Gruppe 11)
- **Betrifft:** [#4](https://github.com/Finn2103/maschinen-verwaltung/issues/4) · [#5](https://github.com/Finn2103/maschinen-verwaltung/issues/5) · [#11](https://github.com/Finn2103/maschinen-verwaltung/issues/11) · [#13](https://github.com/Finn2103/maschinen-verwaltung/issues/13)
- **Quelle:** `Nutzwerkanalyse.xlsx` — diese Datei ist die Überführung in Markdown, die Zahlen sind unverändert

## Kontext

Auf der Strato-VM läuft ein Linux. Welches, wird kriteriengeleitet entschieden und nicht
nach Gefühl. Die Nutzwertanalyse ist Prüfungsthema.

## Vorauswahl

Recherchiert wurden acht Kandidaten:

Ubuntu 24.04 LTS · Ubuntu 26.04 LTS · Debian 12 · Debian 13 ·
Rocky Linux 8 · Rocky Linux 9 · AlmaLinux 8 · AlmaLinux 9

Bewertet wurde jeweils nur die **aktuelle Hauptversion** jeder Distribution — die
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
| Vorkenntnisse im Team | 5 | Gut aber nicht notwendig | 3 | 15 | 2 | 10 | 1 | 5 | 1 | 5 |
| **Summe** | **165** | | **29** | **630** | **24** | **540** | **23** | **495** | **23** | **495** |

### Rangfolge nach Nutzwert

| Platz | Distribution | Nutzwert |
| --- | --- | --- |
| 1 | Ubuntu 26.04 LTS | **630** |
| 2 | Debian 13 | 540 |
| 3 | Rocky Linux 9 | 495 |
| 3 | AlmaLinux 9 | 495 |

## Entscheidung

**Debian 13.**

> **TODO — das ist die wichtigste offene Stelle dieses Dokuments.**
>
> Die Nutzwertanalyse gewinnt **Ubuntu 26.04 LTS** mit 630 Punkten, entschieden wurde
> **Debian 13** mit 540. Diese Abweichung muss begründet werden, sonst widerspricht das
> Dokument sich selbst.
>
> Das ist ausdrücklich erlaubt — die Aufgabenstellung sagt: *„Ergebnis interpretieren — die
> höchste Punktzahl allein ist keine Begründung."* Aber sie muss dastehen.
>
> Mögliche Richtungen, die das Team prüfen sollte:
>
> - **Ist Ubuntu 26.04 LTS zum Projektzeitpunkt überhaupt verfügbar?** Wenn nein, fällt es
>   aus der Bewertung und Debian 13 gewinnt regulär. Dann gehört das in die Vorauswahl.
> - **Gibt es ein Ausschlusskriterium, das in der Tabelle fehlt?** Etwa der
>   Ressourcenbedarf — der selbst gehostete Supabase-Verbund aus ADR 0006 braucht
>   Arbeitsspeicher, und Debian gilt als sparsamer.
> - **Wurde ein Kriterium nachträglich anders gewichtet?** Dann muss die Tabelle das zeigen.
>
> Was nicht geht: die Tabelle stehen lassen und Debian ohne Wort dazu wählen. Das ist die
> erste Rückfrage, die im Review kommt.

## Konsequenzen

> **TODO:** ergänzen. Was folgt aus der Wahl? Etwa: Paketquellen, Umgang mit
> Sicherheitsupdates, Vorgehen beim Versionswechsel, wer die Distribution kennt.

## Anmerkungen zur Methode

Zwei Punkte, die im Review angesprochen werden könnten:

- **Die Gewichtungen summieren sich auf 165**, nicht auf 100 oder 1,0. Das ist rechnerisch
  in Ordnung, weil nur die relativen Abstände zählen — die Rangfolge ändert sich durch
  Normieren nicht. Es ist aber unüblich, und man sollte den Satz parat haben.
- **Die Bewertungsskala reicht von 1 bis 4.** Eine gerade Skala ohne Mitte ist eine bewusste
  Wahl (sie erzwingt eine Tendenz) — falls das beabsichtigt war, kurz erwähnen.
