# Entscheidungen und Herkunft

Dieses Dokument hält fest, **was vom Product Owner kommt, was das Team geändert hat und
was das Team ergänzt hat.** Zweck: im Review soll nachvollziehbar sein, woher jede
Festlegung stammt, damit nicht nachträglich der Eindruck entsteht, das Team habe
Vorgaben eigenmächtig verändert.

Vorgänger dieses Dokuments war eine Liste offener Fragen an die Lehrkräfte. Die meisten
davon sind inzwischen beantwortet; die Antworten stehen unten.

---

## Woher was kommt

| Quelle | Was daraus stammt |
| --- | --- |
| **Aufgabenstellung** (Projektauftakt 02./03.09.2026) | Ausgangssituation, die Pflichtliste, das Architekturbild, Termine, die fünf Einzelaufgaben |
| **Product Owner** (die Lehrkräfte) | Das Backlog als Vorlage: 15 Items in Story-Form mit Akzeptanzkriterien, Lernfeld- und Fachrichtungszuordnung, Aufwandsschätzung in T-Shirt-Größen |
| **Team** (Gruppe 11) | Neufassung der Items, die Aufteilungen von #7 und #14, alle technischen Entscheidungen, Schätzverfahren, Sprintlänge, Daily-Regelung |

Der **Originaltext jedes Items** der Vorlage steht unverändert als erster Kommentar unter
dem jeweiligen Issue #1 bis #15. Was genau geändert wurde und warum, steht Item für Item in
[`backlog-neufassung.md`](backlog-neufassung.md).

---

## Was verbindlich ist

Aus der Aufgabenstellung, wörtlich:

> - Objektorientierter Ansatz ist Pflicht, im Hinblick auf die Abschlussprüfung.
> - Client-Server-Architektur und Datenbank-API sind Pflicht.
> - Software, die die Datenbank implizit erzeugt, ist nicht zulässig.
> - Infrastructure as Code: Die Umgebung muss sich zerstören und schnell wieder aufbauen lassen.
> - Absicherung nach IT-Grundschutz, UI barrierefrei nach ISO 9241, Doku über UML.

**Nur diese fünf Punkte binden.** Das Architekturbild der Aufgabenstellung (Reverse Proxy,
Authelia, Kong, Supabase-APIs, PostgreSQL, Object Storage, Mailserver) ist
**Orientierung, keine Vorgabe**, der Technologie-Stack ist frei wählbar, solange die
Pflichtliste erfüllt ist.

---

## Entscheidungen

| # | Frage | Entscheidung | Von wem |
| --- | --- | --- | --- |
| 1 | Gehören Abrechnung, Shop und Marketing zum Umfang? | **Ja.** Der Product Owner hat dafür nur keine Stories vorbereitet. Das Team formuliert sie selbst, sie liegen fachlich am Ende. | Product Owner |
| 2 | Ist der Technologie-Stack vorgegeben? | **Nein.** Frei wählbar, solange die Pflichtliste erfüllt ist. Das Architekturbild ist Orientierung. | Product Owner |
| 3 | Sollen die neun technischen Items Tickets statt User Stories sein? | **Ja**, auf `work-type = Task` umgestellt. Änderungen dokumentiert. | Scrum Master |
| 4 | #14 war nicht abschließbar, aufteilen? | **Ja**, in vier abschließbare Items (#14, #17, #18, #19). | Scrum Master |
| 5 | #10 und #12 als eigene Entscheidungs-Tasks? | **Ja.** Beide bleiben sichtbar, die Nutzwertanalysen macht die Systemintegration. Die Datenbankwahl ist eine **echte, offene** Entscheidung. | Team |
| 6 | Priorisiert der Product Owner das Backlog? | **Nein.** Die Lehrkräfte machen Reviews und geben Feedback, mehr nicht. Das Ordnen des Backlogs übernimmt damit das Team. | Product Owner |
| 7 | Sind die „Std." der Vorlage Schul- oder Zeitstunden? | **Schulstunden.** Das Team rechnet und misst in **Zeitstunden** (1 Schulstunde = 45 min). | Product Owner + Team |
| 8 | Story Points oder Stunden schätzen? | **Stunden.** Ohne Erfahrungswerte sind Story Points kaum nutzbar; Stunden lassen sich direkt gegen die Kapazität rechnen. Der Scrum Guide schreibt kein Schätzverfahren vor, die Wahl liegt bei den Developers. | Team |
| 9 | Sprintlänge? | **Zwei Wochen**, sechs Sprints, sechs Noten je Person. | Team |
| 10 | Daily Scrum bei nur zwei Schultagen pro Woche? | Präsenz-Daily am Donnerstag und Freitag, je 15 Minuten. An den übrigen Tagen ein kurzer schriftlicher Stand im Teams-Chat von jedem, der etwas gemacht hat. | Team |

### Zur Priorisierung, Punkt 6

Nach Scrum verantwortet der Product Owner das Ordnen des Product Backlog. Er **darf das
delegieren**, bleibt aber verantwortlich. Genau das liegt hier vor: der Product Owner
nimmt die Aufgabe nicht wahr, das Team übernimmt sie.

Das ist zulässig, es soll aber **als Delegation festgehalten** sein und nicht so
aussehen, als hätte sich das Team die Reihenfolge angeeignet. Deshalb steht es hier.

---

## Zurückgezogene Befunde

Bei der Prüfung des Backlogs wurden vier Widersprüche zur Aufgabenstellung gemeldet. Zwei
davon beruhten auf der falschen Annahme, das Architekturbild sei verbindlich. Sie sind
**zurückgenommen**:

| Befund | Warum zurückgezogen |
| --- | --- |
| #8 fordere eine eigene Passwortspeicherung, obwohl Authelia vorgegeben sei | Das Architekturbild bindet nicht. Selbst gebaute Anmeldung ist zulässig; das Kriterium steht wieder in #8. Ob eine fertige Identitätsverwaltung genutzt wird, ist eine Architekturentscheidung für einen ADR. |
| #10 fordere eine freie Datenbankwahl, obwohl die Supabase-APIs PostgreSQL festlegten | Dito. Die Wahl ist offen. Die Pflichtliste liefert stattdessen die **Ausschlusskriterien** der Nutzwertanalyse. |

Es bleiben zwei Befunde: **#14** war nicht abschließbar (bestätigt und aufgeteilt) und
**#2** fordert einen Import der Maschinendaten, obwohl die Aufgabenstellung sagt, diese
würden neu erfasst (noch offen).

---

## Kapazität

Unterricht ist nur **Donnerstag und Freitag**. Ein zweiwöchiger Sprint hat damit **vier
Schultage**, und der erste geht für Review, Retrospektive und Planning weg.

| Tag | Anwesenheit | Schulstunden | netto |
| --- | --- | --- | --- |
| Donnerstag, reiner Projekttag | 7:55 bis 14:40 | 8 | 6,0 h |
| Freitag, Projekt + Wirtschaft | 7:55 bis 12:55 | 6 | 4,5 h |

Der Donnerstag geht vollständig ins Projekt. Vom Freitag geht Wirtschaft ab, wie viele
Stunden dort auf das Projekt fallen, ist die letzte offene Größe:

| Freitag, Projektanteil | je Person und Sprint | Team ×5 | über 6 Sprints |
| --- | --- | --- | --- |
| 2 Schulstunden | 12,0 h | 60 h | 360 h |
| 3 Schulstunden | 13,5 h | 68 h | 405 h |
| 4 Schulstunden | 15,0 h | 75 h | 450 h |
| 6 Schulstunden | 18,0 h | 90 h | 540 h |

Jeweils abzüglich rund 3 Stunden je Sprint für Review, Retrospektive und Planning. Bei
Homeschooling bleibt die Tageszeit gleich, die Kapazität ändert sich also nicht.

### Was das für die Items heißt

„Std." der Vorlage sind Schulstunden, also **M = 6,0 · L = 12,0 · XL = über 12,0
Zeitstunden**. Die Schätzungen der Vorlage summieren sich auf **200 Schulstunden ≈ 150
Zeitstunden**, gegen 360 bis 540 Zeitstunden Teamkapazität.

Das vorhandene Backlog belegt damit nur **etwa ein Drittel der Kapazität**. Für
Abrechnung, Shop und Marketing (Entscheidung 1) ist also Platz, sie müssen nur
geschrieben und eingeplant werden.

Ein **L-Item (12,0 h)** füllt bei knapper Freitagslage den ganzen Sprint einer Person, bei
guter Lage zwei Drittel. Ein **XL-Item** passt nicht in einen Sprint und muss geteilt oder
zu zweit bearbeitet werden. Betroffen sind **#3** und **#9**.

---

## Verteilung zwischen den Fachrichtungen

| | Items | Aufwand | Personen | je Person |
| --- | --- | --- | --- | --- |
| Anwendungsentwicklung | #1 #2 #6 #7 #8 #9 #20 | ~88 Schulstd. ≈ 66 h | 1 | ≈ 66 h |
| Systemintegration | #4 #5 #10 bis #15, #17 bis #19 | ~96 Schulstd. ≈ 72 h | 4 | ≈ 18 h |
| Daten- und Prozessanalyse | #3 | > 16 Schulstd. | 0 | keine |

Die Anwendungsentwicklung ist einfach besetzt und trägt knapp das Vierfache pro Kopf.
**Ein Teil davon wird an die Systemintegration abgegeben**; wer was übernimmt, entscheidet
das Team im Sprint Planning. Andere Gruppen haben gar keine Anwendungsentwicklung, 
Abgeben ist hier der Normalfall, nicht die Ausnahme.

**Offen:** Zählt eine Story mit einem Lernfeld der Anwendungsentwicklung (LF10a, LF11a,
LF12a) für die Leistungsbewertung der Person, die sie tatsächlich umsetzt? Falls nicht,
muss anders aufgeteilt werden. Das betrifft die Noten und sollte vor einer festen Zusage
über Sprint 1 hinaus geklärt sein.

---

## Sprints

| Sprint | Zeitraum | Schultage | Review + Retro |
| --- | --- | --- | --- |
| 1 | Do 17.09. bis Mi 30.09. | 17.09. · 18.09. · 24.09. · 25.09. | Do 01.10. |
| 2 | Do 01.10. bis Mi 14.10. | 01.10. · 02.10. · 08.10. · 09.10. | Do 15.10. |
| 3 | Do 15.10. bis Mi 28.10. | 15.10. · 16.10. · 22.10. · 23.10. | Do 29.10. |
| 4 | Do 29.10. bis Mi 11.11. | 29.10. · 30.10. · 05.11. · 06.11. | Do 12.11. |
| 5 | Do 12.11. bis Mi 25.11. | 12.11. · 13.11. · 19.11. · 20.11. | Do 26.11. |
| 6 | Do 26.11. bis Mi 09.12. | 26.11. · 27.11. · 03.12. · 04.12. | Do 10.12. |

Abgabe: **Freitag 11.12.2026, 8. Stunde.**

---

## Was noch offen ist

| Punkt | Wer entscheidet | Wann |
| --- | --- | --- |
| ERD abnehmen, bisher Einzelarbeit, nicht vom Team getragen | Team | Sprint Planning |
| Definition of Done beschließen | Team | Sprint Planning, vor dem Schätzen |
| Sprint Goal für Sprint 1 | Team | Sprint Planning |
| Reihenfolge des Backlogs | Team (delegiert, siehe Punkt 6) | Sprint Planning |
| Kein Item für die Datenmodell-Arbeit vorhanden | Team | Sprint Planning |
| Projektanteil am Freitag | Stundenplan, sonst Frau Clemens | vor der Kapazitätsrechnung |
| #2: Import der Maschinendaten doch gewollt? | Team, mit Blick auf die Aufgabenstellung | Refinement |
| #3: maschinelles Lernen oder Regelwerk, und wer macht es? | Team | nicht in den ersten Sprints |
| Abrechnung, Shop, Marketing: Stories formulieren | Team | gegen Ende des Projekts |
| Termine der Herbstferien 2026 | nachsehen | vor dem Planning von Sprint 2 |
| Zählt eine AE-Story für die Note dessen, der sie umsetzt? | Product Owner | vor Sprint 2 |
