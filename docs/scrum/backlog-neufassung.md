# Neufassung des Backlogs

Das Backlog wurde als Vorlage in Story-Form übergeben. Beim Refinement sind
Abweichungen von den üblichen Kriterien und vier Widersprüche zur Aufgabenstellung
aufgefallen. Dieses Dokument hält fest, **was geändert wurde und warum**, Item für
Item, mit Bezug auf den jeweiligen Maßstab.

Vorgehen nach Scrum: Das Product Backlog verantwortet der Product Owner. Das Team
schlägt hier Neufassungen vor, entschieden werden sie im Refinement gemeinsam.

**Stand:** Die Neufassung ist auf die Issues übertragen. Der **Originaltext steht
unverändert als erster Kommentar unter jedem Issue #1 bis #15**, damit jede Änderung
belegbar bleibt. Jedes Issue verweist außerdem auf dieses Dokument.

### Zuordnung zu den Issues

Die Aufteilungen von #7 und #14 haben neue Issue-Nummern bekommen:

| hier | Issue | Typ | Titel |
| --- | --- | --- | --- |
| #1 | [#1](https://github.com/Finn2103/maschinen-verwaltung/issues/1) | User Story | Maschinen nach Verfügbarkeit suchen und reservieren |
| #2 | [#2](https://github.com/Finn2103/maschinen-verwaltung/issues/2) | User Story | Maschinenstammdaten erfassen und pflegen |
| #3 | [#3](https://github.com/Finn2103/maschinen-verwaltung/issues/3) | User Story | Wartungsbedarf je Maschine vorhersagen und anzeigen |
| #7a | [#7](https://github.com/Finn2103/maschinen-verwaltung/issues/7) | User Story | Kundenstammdaten anlegen, ändern und suchen |
| #8 | [#8](https://github.com/Finn2103/maschinen-verwaltung/issues/8) | User Story | Rollen- und Zugriffsrechte verwalten |
| #9 | [#9](https://github.com/Finn2103/maschinen-verwaltung/issues/9) | User Story | Buchung zu einem verbindlichen Auftrag mit Audit-Trail |
| #4 | [#4](https://github.com/Finn2103/maschinen-verwaltung/issues/4) | Task | Server nach IT-Grundschutz absichern |
| #5 | [#5](https://github.com/Finn2103/maschinen-verwaltung/issues/5) | Task | Infrastruktur automatisiert bereitstellen |
| #6 | [#6](https://github.com/Finn2103/maschinen-verwaltung/issues/6) | Task | Client-Server-Grundgerüst mit Datenbankanbindung |
| #7b | **[#20](https://github.com/Finn2103/maschinen-verwaltung/issues/20)** | Task | Kundenstammdaten aus dem Altsystem übernehmen |
| #10 | [#10](https://github.com/Finn2103/maschinen-verwaltung/issues/10) | Entscheidungs-Task | Datenbanksystem festlegen und begründen |
| #11 | [#11](https://github.com/Finn2103/maschinen-verwaltung/issues/11) | Task | Datenbank-Server produktiv bereitstellen |
| #12 | [#12](https://github.com/Finn2103/maschinen-verwaltung/issues/12) | Entscheidungs-Task | Mailserver-System kriteriengeleitet auswählen |
| #13 | [#13](https://github.com/Finn2103/maschinen-verwaltung/issues/13) | Task | Mailserver produktiv bereitstellen |
| #14a | [#14](https://github.com/Finn2103/maschinen-verwaltung/issues/14) | Task | Monitoring für Datenbank- und Mailserver einrichten |
| #14b | **[#17](https://github.com/Finn2103/maschinen-verwaltung/issues/17)** | Task | Update- und Patch-Prozess festlegen und dokumentieren |
| #14c | **[#18](https://github.com/Finn2103/maschinen-verwaltung/issues/18)** | Task | Incident-Response-Ablauf dokumentieren |
| #14d | **[#19](https://github.com/Finn2103/maschinen-verwaltung/issues/19)** | Task | Zugriffslogs revisionssicher aufbewahren |
| #15 | [#15](https://github.com/Finn2103/maschinen-verwaltung/issues/15) | Task | TLS-Verschlüsselung automatisiert verwalten |

Auf dem Board tragen die 13 Tasks jetzt `work-type = Task` und das Label `task`;
#10 und #12 zusätzlich `entscheidung`.

---

## Der Maßstab

| Quelle | Regel, die angewendet wurde |
| --- | --- |
| **Scrum Guide 2020**, Sprint Backlog & Definition of Done | Ein Item muss innerhalb eines Sprints fertig werden können. Erfüllt es die Definition of Done nicht, kann es im Review nicht gezeigt werden. |
| **INVEST** (Bill Wake, 2003) | Items sind **V**aluable (Nutzen für jemanden, der das Produkt benutzt) und **T**estable (am Kriterium ist objektiv prüfbar, ob es erfüllt ist). |
| **Connextra-Format** | „Als *Rolle* möchte ich *Ziel*, damit *Nutzen*". Die Rolle ist ein Beteiligter am Produkt, nicht das Entwicklungsteam. |
| **Projektauftakt, Folie 09** | „User Stories für AE und DP, **Tickets für SI und DV**: mit Akzeptanzkriterien." |
| **Projektauftakt, Folie 09, Pflichtliste** | Objektorientierter Ansatz · Client-Server-Architektur und Datenbank-API · kein implizit erzeugtes Schema · Infrastructure as Code · IT-Grundschutz, ISO 9241, UML. **Nur diese Punkte sind verbindlich.** |
| **Projektauftakt, Folie 07** | „Der Excel-Bestand wird über eine selbst programmierte Schnittstelle übernommen. **Maschinendaten werden neu erfasst.**" |
| **Projektauftakt, Folie 08, Architekturbild** | **Orientierung, keine Vorgabe.** Der Technologie-Stack ist frei wählbar, solange die Pflichtliste erfüllt ist. |

---

## Befunde im Überblick

| Item | Befund | Verletzter Maßstab |
| --- | --- | --- |
| #1 | Kriterium „barrierefrei gemäß ISO 9241" ist nicht prüfbar, **Befund bleibt, der Normbezug aber auch** | INVEST · Testable |
| #2 | Fordert Excel-Import für Maschinendaten | **Widerspruch zu Folie 07** |
| #2 | „übernimmt Daten fehlerfrei" ist nicht prüfbar | INVEST · Testable |
| #3 | „Wartungs-Score" ohne Aussage, was daran prüfbar ist | INVEST · Testable |
| #4 | Rolle im „Als …" ist das Team | INVEST · Valuable · Folie 09 |
| #5 | Rolle im „Als …" ist das Team | INVEST · Valuable · Folie 09 |
| #6 | Rolle im „Als …" ist das Team | INVEST · Valuable |
| #7 | Vermischt Nutzerfunktion und technische Schnittstelle | INVEST · Independent |
| #8 | Rechteprüfung nur beschrieben, nicht serverseitig verlangt | INVEST · Testable |
| #9 | „kann nicht rückwirkend manipuliert werden" ohne prüfbare Bedingung | INVEST · Testable |
| #10 | Ergebnis ist ein Beschluss, kein Inkrement | Folie 09 |
| #11 | Rolle im „Als …" ist das Team | INVEST · Valuable · Folie 09 |
| #12 | Ergebnis ist ein Beschluss, kein Inkrement | Folie 09 |
| #13 | Rolle im „Als …" ist das Team | INVEST · Valuable · Folie 09 |
| #14 | **Daueraufgabe, kann nie fertig werden** | **Scrum Guide · Definition of Done** |
| #15 | Rolle im „Als …" ist das Team | INVEST · Valuable · Folie 09 |

Zusammengefasst: 6 der 15 Items sind echte User Stories, 9 sind technische Aufgaben in
Story-Form, 1 ist nicht abschließbar, und 1 steht im Widerspruch zur Aufgabenstellung
selbst. Zwei weitere Befunde habe ich nach Rückfrage **zurückgezogen**, siehe unten.

---

## Befunde gegen die Aufgabenstellung

Einer steht, einer ist offen, **zwei sind zurückgezogen**. Die Rücknahmen stehen hier
bewusst mit drin: sie zeigen, dass geprüft wurde, auch die eigenen Befunde.

### 1. #14 kann nie fertig werden: steht

„Betrieb und Sicherheit gewährleisten" beschreibt Monitoring, Updates und Incident
Response als Dauerzustand. Ein Item, das die Definition of Done nie erfüllen kann, darf
laut Scrum Guide im Review nicht gezeigt werden, es wäre in jedem Sprint offen.

→ Aufgeteilt in vier abschließbare Items (#14a bis #14d). Vom Scrum Master bestätigt.

### 2. Maschinendaten: Import oder Neuerfassung? (#2): offen

Folie 07 sagt, die Maschinendaten werden **neu erfasst**, und nur der Excel-Bestand an
Kunden- und Vorgangsdaten wird übernommen. #2 fordert dagegen eine Importschnittstelle
für Maschinendaten.

→ In der Neufassung ist der Import aus #2 entfernt. Wenn er doch gewollt ist, wird er
ein eigenes Item, analog zu #20. **Noch nicht entschieden.**

### Zurückgezogen: Passwortspeicherung in #8

Der Befund lautete, #8 widerspreche der Architektur, weil dort Authelia die
Authentifizierung übernimmt. **Das war falsch.** Das Architekturbild auf Folie 08 ist
Orientierung, keine Vorgabe, verbindlich ist allein die Pflichtliste. Ein selbst
gebautes Anmeldeverfahren ist damit zulässig, und das Kriterium zur sicheren
Passwortspeicherung steht wieder in #8.

Was inhaltlich bleibt: unter **IT-Grundschutz** ist eine fertige Identitätsverwaltung die
sicherere Wahl, weil selbst gebaute Anmeldeverfahren die häufigste Fehlerquelle sind.
Das ist aber eine **Architekturentscheidung des Teams**, kein Verstoß gegen die Vorgabe, 
und gehört damit in einen ADR, nicht in eine Befundliste.

### Zurückgezogen: freie Datenbankwahl in #10

Derselbe Denkfehler: der Befund nahm an, die Supabase-APIs seien vorgegeben und legten
PostgreSQL fest. **Auch das war falsch**, das Architekturbild bindet nicht. Die Wahl des
Datenbanksystems ist **wirklich offen**, und die Nutzwertanalyse in #10 ist eine echte
Entscheidung.

Was daraus für #10 folgt und dort eingebaut ist: die Pflichtliste liefert die
**Ausschlusskriterien** der Nutzwertanalyse. Ein System, das sich nicht über eine
Datenbank-API ansprechen lässt, das Schema implizit erzeugt, sich nicht containerisieren
und per Infrastructure as Code aufsetzen lässt oder nicht nach IT-Grundschutz absicherbar
ist, fällt aus der Bewertung, unabhängig von seiner Punktzahl.

---

## Das neugefasste Backlog

19 Items: 6 User Stories, 11 Tasks, 2 Entscheidungs-Tasks. Die Nummern verweisen auf
die ursprünglichen Issues, damit die Zuordnung nachvollziehbar bleibt.

---

### #1 · User Story · `verleih` · LF10a · AE

**Als** Kunde
**möchte ich** verfügbare Maschinen nach Kategorie, Zeitraum und Standort suchen und reservieren,
**damit** ich buchen kann, ohne vorher beim Vermieter nachzufragen.

**Akzeptanzkriterien**
- [ ] Die Suche filtert nach Kategorie, Zeitraum (von/bis) und Standort
- [ ] Die Ergebnisliste enthält keine Maschine, die im gewählten Zeitraum reserviert oder verliehen ist
- [ ] Eine Reservierung auf einen belegten Zeitraum wird abgelehnt und der Konflikt benannt
- [ ] Nach dem Absenden ist die Reservierung gespeichert und in der Übersicht des Kunden sichtbar
- [ ] Der Kunde erhält eine Bestätigung per E-Mail
- [ ] Die Oberfläche ist barrierefrei bedienbar **nach ISO 9241**: geprüft gegen die Barrierefreiheits-Checkliste des Projekts (`docs/adr`)
- [ ] Suche und Reservierung sind vollständig per Tastatur bedienbar
- [ ] Jedes Formularfeld hat ein zugeordnetes Label, jede Fehlermeldung ist mit ihrem Feld verknüpft

> **Geändert:** Neu aufgenommen ist die Ablehnung überlappender Reservierungen, 
> fachlich der schwierigste Teil und in der Vorlage nicht gefordert. Ergänzt um zwei
> konkret nachweisbare Barrierefreiheits-Kriterien. „Verbindlich gespeichert" entfernt, 
> Verbindlichkeit ist #9.
>
> **Korrektur:** Das Kriterium „Oberfläche ist gemäß ISO 9241 barrierefrei bedienbar"
> war zunächst **ersetzt** worden, weil es nicht prüfbar ist. Fehler in zwei Richtungen:
> ISO 9241 steht in der Pflichtliste und muss im Backlog auffindbar bleiben, und zwei
> Häkchen sind nicht dasselbe wie die Norm. Der Normbezug steht wieder drin und zeigt
> jetzt auf eine Checkliste, die das Team einmal festlegt.
>
> **Offen fürs Team:** Was heißt „barrierefrei nach ISO 9241" für dieses Projekt
> konkret? Einmal als Checkliste festlegen und als ADR ablegen, dann gilt sie für alle
> Oberflächen-Items, nicht nur für #1.

---

### #2 · User Story · `katalog` · LF5 · AE

**Als** Verleih-Mitarbeiter
**möchte ich** Maschinen mit Typ, Baujahr, Betriebsstunden und Wartungsintervall anlegen, bearbeiten und suchen,
**damit** der Maschinenpark vollständig und konsistent im System steht.

**Akzeptanzkriterien**
- [ ] Anlegen und Bearbeiten mit den Pflichtfeldern Inventarnummer, Maschinentyp und Baujahr
- [ ] Eine zweite Maschine mit derselben Inventarnummer wird abgelehnt
- [ ] Betriebsstunden und Wartungsintervall werden als Zahl geprüft, negative Werte abgelehnt
- [ ] Maschinen sind über Inventarnummer, Typ und Standort auffindbar
- [ ] Jede Änderung wird mit Zeitpunkt, Benutzer, Feld, altem und neuem Wert protokolliert

> **Geändert:** Der Excel-Import ist entfernt, Folie 07 sagt, Maschinendaten werden
> neu erfasst (siehe Widerspruch 1). „Validierung verhindert doppelte oder fehlerhafte
> Einträge" war zu unbestimmt und ist in zwei prüfbare Kriterien zerlegt. Der
> Audit-Trail benennt jetzt, was protokolliert wird.

---

### #3 · User Story · `maintenance` · LF10c · offen

**Als** Werkstattplaner
**möchte ich** je Maschine sehen, wann die nächste Wartung fällig ist,
**damit** ich sie einplanen kann, bevor die Maschine ausfällt.

**Akzeptanzkriterien**
- [ ] Für jede Maschine wird ein Fälligkeitszeitpunkt oder ein Betriebsstundenstand für die nächste Wartung ausgewiesen
- [ ] Maschinen mit überschrittener oder in den nächsten 14 Tagen fälliger Wartung sind in einer Übersicht hervorgehoben
- [ ] Liegen zu wenige Nutzungsdaten vor, wird „keine Aussage möglich" ausgewiesen statt eines Werts
- [ ] Die Berechnungsregel ist dokumentiert und an einem nachgerechneten Beispiel belegt
- [ ] Die Übersicht lässt sich als Datei exportieren

> **Geändert:** „Wartungs-Score" durch einen benannten, prüfbaren Wert ersetzt. Neu:
> der Fall zu weniger Daten, ohne ihn liefert das System Zahlen, die niemand belegen
> kann.
>
> **Offen beim PO:** Die Kriterien lassen sich auch regelbasiert erfüllen
> (Intervall aus Betriebsstunden). Das Lernfeld LF10c fordert aber ausdrücklich
> *Werkzeuge des maschinellen Lernens*. Das Team geht davon aus, dass ein solches
> Verfahren gebraucht wird, hat es aber noch nicht entschieden, und jedenfalls nicht für
> die ersten Sprints. Dazu kommt: das Item trägt `fachrichtung-DP`, und diese Fachrichtung
> ist im Team nicht besetzt.

---

### #7a · User Story · `katalog` · LF5 · AE

**Als** Verleih-Mitarbeiter
**möchte ich** Kunden anlegen, ändern und suchen,
**damit** ich Vorgänge einem vollständig erfassten Kunden zuordnen kann.

**Akzeptanzkriterien**
- [ ] Anlegen und Bearbeiten mit Pflichtfeldern; Rechnungs- und Lieferadresse sind getrennt erfassbar
- [ ] Die Umsatzsteuer-Identifikationsnummer ist erfassbar und wird auf ihr Format geprüft
- [ ] Beim Anlegen wird auf mögliche Dubletten hingewiesen (gleicher Name, gleiche Adresse)
- [ ] Kunden sind über Name, Kundennummer und Ort auffindbar
- [ ] Jede Änderung wird mit Zeitpunkt, Benutzer, Feld, altem und neuem Wert protokolliert

> **Geändert:** Aus #7 herausgelöst. Das Original vermischte die Nutzerfunktion
> (Kunden pflegen) mit der technischen Schnittstelle (Excel-Import), zwei Dinge, die
> unabhängig fertig werden können und deshalb getrennt gehören (INVEST · Independent).
> Neu: getrennte Adressen und USt-ID, weil die Abrechnung sie braucht.

---

### #7b · Task · `migration` · LF8 · AE

**Ziel**, Die bestehenden Kundendaten aus der Excel-Datei stehen im neuen System,
und es ist belegbar, welche Datensätze übernommen wurden und welche nicht.

**Umfang**, Die selbst programmierte Importschnittstelle für Kundendaten.
Nicht dazu: Maschinendaten (werden neu erfasst), Vorgangsdaten.

**Akzeptanzkriterien**
- [ ] Die Zuordnung von Excel-Spalten zu Feldern des Datenmodells ist dokumentiert
- [ ] Ein Lauf gibt aus, wie viele Datensätze übernommen und wie viele abgelehnt wurden
- [ ] Abgelehnte Datensätze stehen mit Grund in einem Fehlerprotokoll; der Lauf bricht nicht ab
- [ ] Ein zweiter Lauf mit derselben Datei erzeugt keine Dubletten
- [ ] Der Import ist per Skript wiederholbar und liegt versioniert im Repository

> **Geändert:** Aus #7 herausgelöst, Typ auf Task (Folie 09). „Fehlerfrei" durch die
> prüfbare Bedingung ersetzt, dass Fehler protokolliert werden statt den Lauf
> abzubrechen, „fehlerfrei" ist bei fremden Altdaten ohnehin nicht erreichbar.

---

### #8 · User Story · `general` · LF11a · AE

**Als** Systemverantwortlicher
**möchte ich** Benutzern Rollen zuweisen und die Rechte je Rolle festlegen,
**damit** jede Nutzergruppe nur auf die für sie vorgesehenen Daten und Funktionen zugreift.

**Akzeptanzkriterien**
- [ ] Die Anmeldung erfordert gültige Zugangsdaten; Passwörter werden nur als Hash gespeichert, niemals im Klartext
- [ ] Die Rollen Kunde, Mitarbeiter und Admin existieren mit je festgelegten Rechten
- [ ] Ein Kunde sieht ausschließlich eigene Reservierungen, Aufträge und Rechnungen
- [ ] Der Zugriff auf fremde Daten wird serverseitig abgelehnt, auch bei direktem Aufruf der API
- [ ] Jeder abgelehnte Zugriffsversuch wird mit Zeitpunkt, Benutzer und Ziel protokolliert
- [ ] Die Rollenzuweisung ist zur Laufzeit änderbar, ohne Code anzupassen

> **Geändert:** Neu und wichtig ist das serverseitige Kriterium, die Rechteprüfung muss
> auch bei direktem Aufruf der Datenbank-API greifen, sonst ist sie reine Oberflächen-Kosmetik.
> Das Kriterium zur Passwortspeicherung ist präzisiert: „nur als Hash, niemals im Klartext"
> statt „sicher gespeichert".
>
> **Zurückgezogen:** In einer früheren Fassung war die Passwortspeicherung entfernt, weil
> angeblich Authelia die Authentifizierung vorgibt. Das Architekturbild ist aber nur
> Orientierung, das Kriterium ist wieder drin.
>
> **Architekturentscheidung fürs Team:** Anmeldeverfahren selbst bauen oder eine fertige
> Identitätsverwaltung nutzen (Authelia, Supabase GoTrue oder etwas anderes). Unter
> IT-Grundschutz spricht viel für eine fertige Lösung. Gehört in einen ADR.

---

### #9 · User Story · `verleih` · LF12a · AE

**Als** Kunde
**möchte ich** nach der Bestätigung einen verbindlichen Auftrag mit eindeutiger Nummer erhalten, dessen Entstehung nachvollziehbar dokumentiert ist,
**damit** ich einen verlässlichen Nachweis über meine Buchung habe.

**Akzeptanzkriterien**
- [ ] Aus einer bestätigten Reservierung entsteht ein Auftrag mit Nummer, Kunde, Maschine und Zeitraum
- [ ] Auftragsnummern sind fortlaufend und lückenlos
- [ ] Jede Statusänderung (angelegt, geändert, storniert) wird mit Zeitpunkt, Benutzer und Aktion protokolliert
- [ ] Eine Änderung überschreibt den bestehenden Auftragsdatensatz nicht, sondern entsteht als neuer Eintrag
- [ ] Ein Storno löscht nichts, sondern erzeugt einen Storno-Eintrag mit Bezug auf den Auftrag
- [ ] Kunde und Mitarbeiter sehen den aktuellen Status

> **Geändert:** „kann nicht rückwirkend manipuliert werden" war eine Absicht, kein
> Kriterium. Ersetzt durch die zwei Bedingungen, die das tatsächlich herstellen, 
> kein Überschreiben, kein Löschen, was gleichzeitig der GoBD-Anforderung entspricht.
> „Grundlage für die Rechnungsstellung" entfernt, weil es zur Abrechnung gehört, für
> die es bislang kein Item gibt.

---

### #4 · Task · `infra` · LF4 · SI

**Ziel**, Der Strato-Server ist nach den Basisabsicherungs-Maßnahmen des
IT-Grundschutz eingerichtet, bevor Dienste darauf laufen.

**Umfang**, Betriebssystem-Härtung und Schutzbedarfsanalyse.
Nicht dazu: Absicherung der einzelnen Dienste (#11, #13, #15).

**Akzeptanzkriterien**
- [ ] SSH-Zugang nur per Schlüssel; Passwort-Login und Root-Login sind deaktiviert
- [ ] Die Firewall lässt ausschließlich die benötigten Ports zu; die Liste ist dokumentiert
- [ ] Automatische Sicherheitsupdates sind aktiv und ein Einspielvorgang ist belegt
- [ ] Eine Schutzbedarfsanalyse liegt vor, mit Einschätzung zu Vertraulichkeit, Integrität und Verfügbarkeit
- [ ] Die umgesetzten Maßnahmen sind einem IT-Grundschutz-Baustein zugeordnet
- [ ] Die Konfiguration liegt als Code im Repository, nicht nur auf dem Server

> **Geändert:** Typ auf Task, die Rolle im Original war „Teammitglied
> (Systemverantwortung)", also das Team selbst (Folie 09, INVEST · Valuable).
> Neu: die Konfiguration muss als Code vorliegen, sonst kollidiert das Item mit der
> IaC-Vorgabe.

---

### #5 · Task · `infra` · LF9 · SI

**Ziel**, Container-Laufzeit und Reverse Proxy lassen sich aus dem Repository heraus
vollautomatisch aufsetzen, sodass die Umgebung jederzeit neu entstehen kann.

**Akzeptanzkriterien**
- [ ] Ein Skript oder Playbook richtet Container-Laufzeit und Reverse Proxy ohne Handgriffe ein
- [ ] Die gesamte Konfiguration liegt versioniert im Repository
- [ ] Die Umgebung wurde **einmal vollständig gelöscht und mit einem Befehl wiederhergestellt**; der Durchlauf ist protokolliert
- [ ] Eine Testanfrage erreicht per HTTPS mit gültigem Zertifikat einen Platzhalterdienst
- [ ] Die benötigte Zeit für den Wiederaufbau ist notiert

> **Geändert:** Typ auf Task. Das Kriterium „nach Löschen stellt ein Befehl sie wieder
> her" war als Eigenschaft formuliert, jetzt als **durchgeführter und protokollierter
> Nachweis**. Genau das verlangt die Vorgabe „muss sich zerstören und schnell wieder
> aufbauen lassen", und nur ein echter Durchlauf belegt es.

---

### #6 · Task · `general` · LF5 · AE

**Ziel**, Ein minimales, lauffähiges Grundgerüst aus Client, Server und Datenbank
steht, auf dem die fachlichen Items aufbauen können.

**Akzeptanzkriterien**
- [ ] Die objektorientierte Server-Anwendung ist über den Reverse Proxy erreichbar
- [ ] Der Zugriff auf die Datenbank läuft ausschließlich über die Datenbank-API
- [ ] Das Schema ist aus einer **von Hand geschriebenen, versionierten SQL-DDL-Datei** angelegt; kein Werkzeug erzeugt es implizit
- [ ] Ein Testendpunkt schreibt einen Beispieldatensatz und liest ihn wieder
- [ ] Der Client ruft diesen Endpunkt erfolgreich auf
- [ ] Die Grundarchitektur liegt als UML-Komponenten- oder Deploymentdiagramm vor

> **Geändert:** Typ auf Task, die Rolle war „Entwicklerteam". Das Kriterium zur
> Datenbank-API ist um den zweiten Teil der Vorgabe ergänzt: das Schema wird von Hand
> geschrieben und versioniert. Im Original stand nur, was **nicht** erlaubt ist.

---

### #10 · Entscheidungs-Task · `infra` · LF9 · SI

**Ziel**, Die Wahl des Datenbanksystems ist kriteriengeleitet begründet und als ADR
dokumentiert, bevor die Datenbank produktiv aufgesetzt wird.

**Akzeptanzkriterien**
- [ ] Mindestens drei Datenbanksysteme sind recherchiert und gegenübergestellt
- [ ] Die vier Ausschlusskriterien aus der Pflichtliste sind je System geprüft: über eine Datenbank-API ansprechbar · erzeugt das Schema nicht implizit · containerisierbar und per Infrastructure as Code aufsetzbar · nach IT-Grundschutz absicherbar
- [ ] Die Bewertungskriterien sind vor der Bewertung festgelegt und gewichtet
- [ ] Der Nutzwert ist berechnet und das Ergebnis interpretiert, die Punktzahl allein gilt nicht als Begründung
- [ ] Das Ergebnis liegt als ADR in `docs/adr` vor

> **Geändert:** Typ auf Entscheidungs-Task, das Ergebnis ist ein Beschluss, kein
> Inkrement. Neu: die Pflichtliste der Aufgabenstellung liefert vier
> **Ausschlusskriterien**. Ein System, das eines davon reißt, fällt unabhängig von seiner
> Punktzahl aus der Bewertung. Das ist der Punkt, an dem die Nutzwertanalyse mit den
> verbindlichen Vorgaben verzahnt wird.
>
> **Zurückgezogen:** In einer früheren Fassung war dieses Item so umformuliert, dass es
> die „vorgegebene" Wahl PostgreSQL begründen sollte, aus der Annahme, das
> Architekturbild auf Folie 08 sei verbindlich. Das ist es nicht. **Die Wahl ist offen**,
> und dieses Item ist eine echte Entscheidung.

---

### #12 · Entscheidungs-Task · `infra` · LF9 · SI

**Ziel**, Die Wahl des Mailserver-Systems aus den drei vorgegebenen Optionen ist
kriteriengeleitet begründet und dokumentiert.

**Akzeptanzkriterien**
- [ ] Mailcow, docker-mailserver und stalwart sind verglichen: Wartungsaufwand, Ressourcenbedarf, Funktionsumfang (DKIM/SPF, Webmail, API), Docker-Kompatibilität
- [ ] Die Kriterien sind vor der Bewertung festgelegt und gewichtet
- [ ] Der Nutzwert ist berechnet und das Ergebnis interpretiert
- [ ] Die Verträglichkeit mit Container- und Reverse-Proxy-Aufbau ist geprüft
- [ ] Das Ergebnis liegt als ADR in `docs/adr` vor

> **Geändert:** Typ auf Entscheidungs-Task. Hier ist die Wahl im Gegensatz zu #10
> wirklich offen, Folie 08 nennt die drei Optionen ausdrücklich.

---

### #11 · Task · `infra` · LF10b · SI

**Ziel**, Die Datenbank läuft containerisiert, gesichert und reproduzierbar auf dem
Strato-Server, und die Anwendung kann sie nutzen.

**Akzeptanzkriterien**
- [ ] Die Datenbank läuft containerisiert und lässt sich per IaC-Skript neu aufsetzen
- [ ] Der Zugriff ist auf die benötigten Netzwerkquellen und Ports beschränkt
- [ ] Zugangsdaten liegen nicht im Klartext im Repository
- [ ] Automatisierte Backups laufen; **ein Restore wurde durchgeführt und protokolliert**
- [ ] Die Anwendung aus #6 verbindet sich erfolgreich

> **Geändert:** Typ auf Task. „Ein Restore wurde erfolgreich getestet" als
> protokollierter Nachweis formuliert, ein Backup, dessen Restore nie gelaufen ist,
> ist kein Backup.

---

### #13 · Task · `infra` · LF10b · SI

**Ziel**, Der gewählte Mailserver läuft containerisiert und reproduzierbar, und die
Anwendung kann über ihn zuverlässig E-Mails versenden.

**Akzeptanzkriterien**
- [ ] Der Mailserver läuft containerisiert und lässt sich per IaC-Skript neu aufsetzen
- [ ] SPF-, DKIM- und DMARC-Einträge sind gesetzt; eine Testmail an einen externen Anbieter landet im Postfach, nicht im Spam
- [ ] Zugangsdaten und Postfächer liegen nicht im Klartext im Repository
- [ ] Die Anwendung versendet über die Schnittstelle erfolgreich eine Test-E-Mail
- [ ] Backups von Konfiguration und Daten laufen; ein Restore wurde durchgeführt und protokolliert

> **Geändert:** Typ auf Task. „Testmails landen nicht im Spam" um das Prüfverfahren
> ergänzt, Versand an einen externen Anbieter, sonst ist es nicht nachweisbar.

---

### #15 · Task · `infra` · LF9 · SI

**Ziel**, Alle öffentlich erreichbaren Dienste sind durchgehend per TLS verschlüsselt,
ohne dass Zertifikate von Hand nachgepflegt werden.

**Akzeptanzkriterien**
- [ ] Der Reverse Proxy bezieht Zertifikate automatisiert für alle verwendeten Subdomains
- [ ] Die Erneuerung läuft automatisch vor Ablauf; der Vorgang ist einmal beobachtet oder erzwungen worden
- [ ] Aufrufe über HTTP werden auf HTTPS umgeleitet
- [ ] Die Zertifikatskonfiguration ist Teil des IaC-Setups und versioniert
- [ ] Eine Prüfung mit einem SSL-Testwerkzeug zeigt kein veraltetes TLS und keine schwachen Cipher; das Ergebnis ist abgelegt

> **Geändert:** Typ auf Task. „Erneuerung erfolgt automatisch ohne Downtime" um einen
> Nachweis ergänzt, sonst wird das Kriterium erst in drei Monaten prüfbar, also nach
> der Abgabe.

---

### #14a · Task · `infra` · LF11b · SI

**Ziel**, Verfügbarkeit und Zustand von Datenbank- und Mailserver sind sichtbar, und
kritische Zustände melden sich selbst.

**Akzeptanzkriterien**
- [ ] Verfügbarkeit, Ressourcenauslastung und Fehlerzustände beider Dienste sind in einer Übersicht sichtbar
- [ ] Bei nicht erreichbarem Dienst und bei vollem Speicher wird eine Benachrichtigung ausgelöst
- [ ] Beide Fälle wurden künstlich herbeigeführt und die Benachrichtigung ist angekommen
- [ ] Die Monitoring-Konfiguration liegt als Code im Repository

---

### #14b · Task · `infra` · LF11b · SI

**Ziel**, Für Sicherheitsupdates gibt es einen festgelegten, dokumentierten Ablauf,
der nicht von einer einzelnen Person abhängt.

**Akzeptanzkriterien**
- [ ] Der Ablauf ist dokumentiert: wer prüft wann, wie wird eingespielt, wie wird zurückgerollt
- [ ] Ein Durchlauf ist mit Datum und eingespielten Paketen protokolliert
- [ ] Wo automatische Updates laufen, ist das als Code hinterlegt

---

### #14c · Task · `infra` · LF11b · SI

**Ziel**, Bei Ausfall oder Sicherheitsvorfall weiß jede Person im Team, was zu tun ist.

**Akzeptanzkriterien**
- [ ] Ein Incident-Response-Ablauf ist dokumentiert: erkennen, eingrenzen, wiederherstellen, nachbereiten
- [ ] Für die zwei wahrscheinlichsten Fälle (Dienst weg, Server nicht erreichbar) steht je ein konkreter erster Schritt
- [ ] Zuständigkeiten und Erreichbarkeiten sind benannt
- [ ] Der Ablauf wurde einmal im Team durchgesprochen

---

### #14d · Task · `infra` · LF11b · SI

**Ziel**, Zugriffslogs von Datenbank und Mailserver sind so aufbewahrt, dass sie
nachträglich nicht unbemerkt verändert werden können.

**Akzeptanzkriterien**
- [ ] Zugriffslogs beider Dienste werden dauerhaft aufbewahrt, nicht nur rotiert
- [ ] Die Aufbewahrungsdauer ist festgelegt und dokumentiert
- [ ] Eine nachträgliche Änderung an einem Log ist erkennbar
- [ ] Die Ablage überlebt einen Neuaufbau der Umgebung

> **Geändert (alle vier):** #14 war eine Daueraufgabe und konnte die Definition of Done
> nie erfüllen (siehe Widerspruch 4). Aufgeteilt in vier Items, die jeweils in einem
> Sprint fertig werden können. Die Kriterien verlangen durchgeführte Nachweise statt
> zugesagter Eigenschaften, „Monitoring erfasst" ist keine prüfbare Aussage,
> „der ausgelöste Alarm ist angekommen" schon.

---

## Was noch offen ist

Die meisten Punkte sind inzwischen entschieden, der Stand steht in
[`entscheidungen.md`](entscheidungen.md). Offen bleibt:

| Punkt | Wer entscheidet |
| --- | --- |
| #2: Import der Maschinendaten, doch gewollt oder nicht? | Team, mit Blick auf Folie 07 |
| #3: maschinelles Lernen oder Regelwerk, und wer macht es? | Team, nicht in den ersten Sprints |
| Abrechnung, Shop und Marketing: Stories formulieren | Team, gegen Ende des Projekts |
| Reihenfolge des Backlogs | Team, der Product Owner priorisiert nicht mit |
| Termine der Herbstferien 2026 | nachsehen, betrifft Sprint 3 |

Nicht geändert wurden **Lernfeld- und Fachrichtungszuordnungen**, sie stammen aus der
Vorlage und betreffen die Leistungsbewertung. Zwei Folgen der Aufteilungen ließen sich
nicht vermeiden:

- **#7** trug LF8 (*Daten systemübergreifend bereitstellen*). Nach der Trennung liegt LF8
  bei der Import-Schnittstelle **#7b**, während **#7a** (Kunden pflegen) sachlich zu LF5
  gehört, wie #2. #2 selbst behält LF5 unverändert.
- **Aufwandsschätzungen** sind bei #7a/#7b und #14a bis #14d entfernt. Die Vorlage schätzte
  #7 und #14 jeweils als Ganzes auf L; für die Teile gilt das nicht, und Schätzen ist
  Sache der Developers im Planning.
