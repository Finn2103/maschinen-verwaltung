# Klärung mit dem Product Owner

Fragen an die Lehrkräfte, bevor Sprint 1 geplant wird. Alles hier sind **Fragen**,
keine Entscheidungen des Teams — die Punkte 1, 2 und 6 sind formal Sache des
Product Owners.

**Stand:** Board [Maschinenverwaltung-IHK](https://github.com/users/Finn2103/projects/32)
mit 19 Items, alle im Status `Backlog`. Repo steht, Branch-Schutz auf `main` aktiv.
`prio` und `story-points` sind noch leer.

Die Items wurden im Refinement neu gefasst — Begründung je Item in
[`backlog-neufassung.md`](backlog-neufassung.md). Die Punkte 3 bis 5 unten sind
dadurch **als Vorschlag bereits umgesetzt** und brauchen nur noch die Bestätigung
des Product Owners.

---

## 1. Drei Kundenbereiche haben kein einziges Item

Der Auftrag nennt sechs Bereiche. Das Backlog deckt ab:

| Bereich | Items |
| --- | --- |
| Verleih | #1, #9 |
| Verwaltung | #2, #7 — ohne Bestellhistorie, Lieferstatus, Garantien |
| Predictive Maintenance | #3 (siehe Punkt 2) |
| **Abrechnung** | **keins** |
| **Online-Shop Verbrauchsmaterial** | **keins** |
| **Marketingkonzept** | **keins** |

Die Abrechnung ist der fachlich schwerste und rechtlich heikelste Teil des Auftrags
— Umsatzsteuer, Rechnungsstellung, Zahlungsabwicklung, Audit-Logs nach UStG und GoBD.
Im ERD stehen Rechnung, Rechnungsposition und Zahlung schon als Entitäten, im Backlog
steht dazu nichts.

**Frage:** Kommen Abrechnung, Shop und Marketing ins Backlog, oder sind sie für dieses
Team bewusst aus dem Umfang heraus? Wir brauchen die Antwort schriftlich, damit im
Review klar ist, warum etwas fehlt.

---

## 2. #3 Predictive Maintenance hat im Team keine Fachrichtung

Das Item trägt `fachrichtung-DP` und ist mit XL (> 16 Std.) geschätzt. Gruppe 11
besteht aus einer Anwendungsentwicklung und vier Systemintegrationen — Daten- und
Prozessanalyse ist nicht besetzt.

Dazu kommt: Lernfeld LF10c fordert ausdrücklich *Werkzeuge des maschinellen Lernens*.
Die Akzeptanzkriterien lassen sich auch regelbasiert erfüllen — dann wäre LF10c aber
nicht abgedeckt.

**Frage:** Wie soll damit umgegangen werden?

- auf einen regelbasierten Kern abspecken (Wartungsintervall aus Betriebsstunden), oder
- an die Anwendungsentwicklung geben, obwohl die schon die höchste Last trägt, oder
- aus dem Umfang nehmen

---

## 3. User Story oder Ticket?

Die Vorgabe von Folie 09 lautet: *„User Stories für AE und DP, Tickets für SI und DV
— mit Akzeptanzkriterien."*

In der Vorlage sind alle 15 Items in Story-Form geschrieben und als `user-story`
gelabelt. Bei neun davon ist die Rolle im „Als …" aber das Team selbst, nicht eine
Rolle, die das Produkt benutzt:

| Item | Rolle im „Als …" | Fachrichtung |
| --- | --- | --- |
| #4 | Teammitglied (Systemverantwortung) | SI |
| #5 | Entwicklerteam | SI |
| #6 | Entwicklerteam | AE |
| #10 | Systemadministrator | SI |
| #11 | Systemadministrator | SI |
| #12 | Systemadministrator | SI |
| #13 | Systemadministrator | SI |
| #14 | Systemadministrator | SI |
| #15 | Systemadministrator | SI |

Echte User Stories mit einer Produktrolle sind #1 (Kunde), #2 (Verleih-Mitarbeiter),
#3 (Werkstattplaner), #7 (Verleih-Mitarbeiter), #8 (Systemverantwortlicher) und
#9 (Kunde) — also sechs von fünfzehn.

**Umgesetzt als Vorschlag:** Die neun Items stehen jetzt als `work-type = Task` mit
Ziel/Umfang statt einer erfundenen Rolle. Der Originaltext ist als Kommentar unter
jedem Issue gesichert.

**Frage:** Wird das bestätigt, oder ist die Story-Form für alles gewollt?

---

## 4. #14 lässt sich nie abschließen

„Betrieb und Sicherheit der vernetzten Systeme gewährleisten" beschreibt eine
Daueraufgabe — Monitoring, Updates, Incident Response. Ein Sprint-Backlog-Item muss
innerhalb eines Sprints fertig werden können. Dieses kann das nicht: es ist nie fertig.

**Umgesetzt als Vorschlag:** Aufgeteilt in vier abschließbare Items — #14 Monitoring,
#17 Update-Prozess, #18 Incident Response, #19 Zugriffslogs.

**Frage:** Wird das bestätigt? Alternativen wären, die Daueraufgabe außerhalb des
Sprint-Backlogs zu führen oder sie in die Definition of Done der anderen
Infrastruktur-Items zu ziehen.

---

## 5. #10 und #12 sind Entscheidungen, keine Inkremente

Beide Items sind Nutzwertanalysen — Datenbanksystem beziehungsweise Mailserver
auswählen. Am Ende steht ein dokumentierter Beschluss, keine lauffähige Funktion.

**Umgesetzt als Vorschlag:** Beide bleiben eigene Items, jetzt als Task mit Label
`entscheidung` — weil die Nutzwertanalyse selbst Prüfungsthema ist und sichtbar
bleiben soll.

Bei **#10** kommt ein Widerspruch dazu: Folie 08 gibt die Supabase-APIs vor, und die
laufen ausschließlich auf PostgreSQL. Eine ergebnisoffene Wahl zwischen drei
Datenbanksystemen gibt es damit nicht.

**Frage:** Ist die Datenbank tatsächlich frei wählbar, oder gilt die Architektur von
Folie 08? Die Nutzwertanalyse ist vorerst so formuliert, dass sie die vorgegebene Wahl
begründet.

---

## 6. Priorisierung des Backlogs

Das Feld `prio` ist bei allen 19 Items leer. Das Ordnen des Product Backlog ist
Aufgabe des Product Owners. Delegieren ist möglich, die Verantwortung bleibt beim PO.

**Frage:** Gibt der PO die Reihenfolge vor, oder soll das Team priorisieren und sich
die Reihenfolge bestätigen lassen?

Aus Teamsicht ist die technische Abhängigkeit eindeutig: ohne #5 (IaC), #10/#11
(Datenbank) und #6 (Grundgerüst) kann keine fachliche Story gebaut werden. Das sagt
aber nur, was **zuerst** geht — nicht, was **wichtig** ist.

---

## 7. Kapazität: die Anwendungsentwicklung ist einfach besetzt

Rechnet man die fünf Items ohne Fachrichtung nach Inhalt zu, ergibt sich:

| | Items | Aufwand | Personen | je Person |
| --- | --- | --- | --- | --- |
| Anwendungsentwicklung | #1 #2 #6 #7 #8 #9 #20 | ~88 Std. | 1 | ~88 Std. |
| Systemintegration | #4 #5 #10–#15, #17–#19 | ~96 Std. | 4 | ~24 Std. |
| Daten-/Prozessanalyse | #3 | > 16 Std. | 0 | — |

Dieselbe Person, die die gesamte Anwendungsentwicklung trägt, ist auch Scrum Master.
Wenn es knapp wird, fällt zuerst die Scrum-Master-Arbeit weg — und die wird pro Sprint
benotet.

**Wie das Team damit umgeht:** Ein Teil der Anwendungsentwicklung wird an die
Systemintegration abgegeben. Wer was übernimmt, entscheidet das Team im ersten Sprint
Planning am **Donnerstag, 17.09.2026** — das ist Selbstorganisation der Developers und
braucht keine Zustimmung des PO.

**Frage an den PO — aber die Folge davon schon:** Wenn ein Auszubildender der
Systemintegration eine Story mit `fachrichtung-AE` und einem AE-Lernfeld umsetzt
(LF10a, LF11a, LF12a) — zählt diese Arbeit für seine Leistungsbewertung, und wird das
Lernfeld dann für ihn als abgedeckt geführt? Umgekehrt dasselbe für die
Anwendungsentwicklung bei SI-Lernfeldern.

Das ist keine Formfrage: die Lernfeld-Zuordnung stammt aus der Vorlage und betrifft die
Noten. Wenn Abgeben die Bewertung verschlechtert, müsste anders aufgeteilt werden.

---

## 8. Sprintlänge

Vorgegeben sind 2–3 Wochen. Vom 14.09. bis zum 11.12.2026 sind es rund 12 Wochen.

| Länge | Sprints | Noten je Person |
| --- | --- | --- |
| 2 Wochen | 6 | 6 |
| 3 Wochen | 4 | 4 |

Zu bedenken sind die Herbstferien, die in einen Sprint fallen.

**Frage:** Welche Länge erwartet der PO? Danach legen wir die Milestones an.

---

## Was wir mitbringen

- Board mit 19 Items, Feldern und zwei Sichten
- Neufassung aller Items mit Begründung je Änderung (`docs/scrum/backlog-neufassung.md`)
- ERD in Chen-Notation, Arbeitsstand (`docs/datenmodell`)
- Nutzwertanalyse Linux-Distribution (`docs/adr`)
- Entwurf der Definition of Done (`docs/scrum/definition-of-done.md`)
- Repo mit Branch-Schutz, Issue-Templates, Konventionen
