# Neufassung des Backlogs

Das Backlog wurde als Vorlage in Story-Form übergeben. Beim Refinement sind
Abweichungen von den üblichen Kriterien und vier Widersprüche zur Aufgabenstellung
aufgefallen. Dieses Dokument hält fest, **was geändert wurde und warum** — Item für
Item, mit Bezug auf den jeweiligen Maßstab.

Vorgehen nach Scrum: Das Product Backlog verantwortet der Product Owner. Das Team
schlägt hier Neufassungen vor, entschieden werden sie im Refinement gemeinsam.

**Stand:** Die Neufassung ist auf die Issues übertragen. Der **Originaltext steht
unverändert als erster Kommentar unter jedem Issue #1–#15**, damit jede Änderung
belegbar bleibt. Jedes Issue verweist außerdem auf dieses Dokument.

### Zuordnung zu den Issues

Die Aufteilungen von #7 und #14 haben neue Issue-Nummern bekommen:

| hier | Issue | Typ | Titel |
| --- | --- | --- | --- |
| #1 | [#1](../../issues/1) | User Story | Maschinen nach Verfügbarkeit suchen und reservieren |
| #2 | [#2](../../issues/2) | User Story | Maschinenstammdaten erfassen und pflegen |
| #3 | [#3](../../issues/3) | User Story | Wartungsbedarf je Maschine vorhersagen und anzeigen |
| #7a | [#7](../../issues/7) | User Story | Kundenstammdaten anlegen, ändern und suchen |
| #8 | [#8](../../issues/8) | User Story | Rollen- und Zugriffsrechte verwalten |
| #9 | [#9](../../issues/9) | User Story | Buchung zu einem verbindlichen Auftrag mit Audit-Trail |
| #4 | [#4](../../issues/4) | Task | Server nach IT-Grundschutz absichern |
| #5 | [#5](../../issues/5) | Task | Infrastruktur automatisiert bereitstellen |
| #6 | [#6](../../issues/6) | Task | Client-Server-Grundgerüst mit Datenbankanbindung |
| #7b | **[#20](../../issues/20)** | Task | Kundenstammdaten aus dem Altsystem übernehmen |
| #10 | [#10](../../issues/10) | Entscheidungs-Task | Datenbanksystem festlegen und begründen |
| #11 | [#11](../../issues/11) | Task | Datenbank-Server produktiv bereitstellen |
| #12 | [#12](../../issues/12) | Entscheidungs-Task | Mailserver-System kriteriengeleitet auswählen |
| #13 | [#13](../../issues/13) | Task | Mailserver produktiv bereitstellen |
| #14a | [#14](../../issues/14) | Task | Monitoring für Datenbank- und Mailserver einrichten |
| #14b | **[#17](../../issues/17)** | Task | Update- und Patch-Prozess festlegen und dokumentieren |
| #14c | **[#18](../../issues/18)** | Task | Incident-Response-Ablauf dokumentieren |
| #14d | **[#19](../../issues/19)** | Task | Zugriffslogs revisionssicher aufbewahren |
| #15 | [#15](../../issues/15) | Task | TLS-Verschlüsselung automatisiert verwalten |

Auf dem Board tragen die 13 Tasks jetzt `work-type = Task` und das Label `task`;
#10 und #12 zusätzlich `entscheidung`.

---

## Der Maßstab

| Quelle | Regel, die angewendet wurde |
| --- | --- |
| **Scrum Guide 2020**, Sprint Backlog & Definition of Done | Ein Item muss innerhalb eines Sprints fertig werden können. Erfüllt es die Definition of Done nicht, kann es im Review nicht gezeigt werden. |
| **INVEST** (Bill Wake, 2003) | Items sind **V**aluable — Nutzen für jemanden, der das Produkt benutzt — und **T**estable — am Kriterium ist objektiv prüfbar, ob es erfüllt ist. |
| **Connextra-Format** | „Als *Rolle* möchte ich *Ziel*, damit *Nutzen*" — die Rolle ist ein Beteiligter am Produkt, nicht das Entwicklungsteam. |
| **Projektauftakt, Folie 09** | „User Stories für AE und DP, **Tickets für SI und DV** — mit Akzeptanzkriterien." |
| **Projektauftakt, Folie 07** | „Der Excel-Bestand wird über eine selbst programmierte Schnittstelle übernommen. **Maschinendaten werden neu erfasst.**" |
| **Projektauftakt, Folie 08** | Vorgegebene Architektur: Authelia für Authentifizierung, Kong vor den Supabase APIs, PostgreSQL als Datenbank. |

---

## Befunde im Überblick

| Item | Befund | Verletzter Maßstab |
| --- | --- | --- |
| #1 | Kriterium „barrierefrei gemäß ISO 9241" ist nicht prüfbar | INVEST · Testable |
| #2 | Fordert Excel-Import für Maschinendaten | **Widerspruch zu Folie 07** |
| #2 | „übernimmt Daten fehlerfrei" ist nicht prüfbar | INVEST · Testable |
| #3 | „Wartungs-Score" ohne Aussage, was daran prüfbar ist | INVEST · Testable |
| #4 | Rolle im „Als …" ist das Team | INVEST · Valuable · Folie 09 |
| #5 | Rolle im „Als …" ist das Team | INVEST · Valuable · Folie 09 |
| #6 | Rolle im „Als …" ist das Team | INVEST · Valuable |
| #7 | Vermischt Nutzerfunktion und technische Schnittstelle | INVEST · Independent |
| #8 | Fordert eigene Passwortspeicherung | **Widerspruch zu Folie 08 (Authelia)** |
| #9 | „kann nicht rückwirkend manipuliert werden" ohne prüfbare Bedingung | INVEST · Testable |
| #10 | Freie DBMS-Wahl, obwohl die Architektur PostgreSQL vorgibt | **Widerspruch zu Folie 08** |
| #10 | Ergebnis ist ein Beschluss, kein Inkrement | Folie 09 |
| #11 | Rolle im „Als …" ist das Team | INVEST · Valuable · Folie 09 |
| #12 | Ergebnis ist ein Beschluss, kein Inkrement | Folie 09 |
| #13 | Rolle im „Als …" ist das Team | INVEST · Valuable · Folie 09 |
| #14 | **Daueraufgabe — kann nie fertig werden** | **Scrum Guide · Definition of Done** |
| #15 | Rolle im „Als …" ist das Team | INVEST · Valuable · Folie 09 |

Zusammengefasst: 6 der 15 Items sind echte User Stories, 9 sind technische Aufgaben in
Story-Form, 1 ist nicht abschließbar, und 4 widersprechen der Aufgabenstellung selbst.

---

## Die vier Widersprüche zur Aufgabenstellung

Diese vier sind keine Formfragen. Sie müssen mit dem Product Owner geklärt werden,
weil sonst Arbeit entsteht, die der eigenen Vorgabe zuwiderläuft.

### 1. Maschinendaten: Import oder Neuerfassung? (#2)

Folie 07 sagt ausdrücklich, die Maschinendaten werden **neu erfasst** und nur der
Excel-Bestand an Kunden- und Vorgangsdaten übernommen. #2 fordert dagegen eine
Importschnittstelle für Maschinendaten.

→ In der Neufassung ist der Import aus #2 entfernt. Falls der PO den Import doch
will, wird er ein eigenes Item, analog zu #7b.

### 2. Passwörter: Authelia oder eigene Speicherung? (#8)

Die Architektur gibt **Authelia** für die Authentifizierung vor. #8 fordert, dass die
Anwendung Passwörter selbst hasht und speichert. Beides zugleich hieße zwei
Benutzerverwaltungen — und selbstgebaute Passwortspeicherung widerspricht dem
IT-Grundschutz-Gedanken der Aufgabe.

→ In der Neufassung macht die Anwendung **Autorisierung** (wer darf was),
die **Authentifizierung** (wer ist das) bleibt bei Authelia.

### 3. Datenbank: wirklich frei wählbar? (#10)

Die Architektur gibt die **Supabase APIs** vor (PostgREST, pg_graphql, pg-meta) und
zeigt **PostgreSQL** in der Datenhaltung. Diese API-Schicht läuft ausschließlich auf
PostgreSQL. Eine ergebnisoffene Wahl zwischen drei Datenbanksystemen gibt es damit
nicht — die Entscheidung ist durch die Architektur schon getroffen.

→ Die Neufassung behält die Nutzwertanalyse (sie ist Prüfungsthema), formuliert sie
aber als **Begründung der vorgegebenen Wahl** mit benannter Randbedingung. So bleibt
die Methode erhalten, ohne eine Entscheidung zu behaupten, die nicht offen ist.

### 4. #14 kann nie fertig werden

„Betrieb und Sicherheit gewährleisten" beschreibt Monitoring, Updates und Incident
Response als Dauerzustand. Ein Item, das die Definition of Done nie erfüllen kann,
darf laut Scrum Guide im Review nicht gezeigt werden — es wäre in jedem Sprint offen.

→ Aufgeteilt in vier abschließbare Items (#14a–#14d).

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
- [ ] Suche und Reservierung sind vollständig per Tastatur bedienbar
- [ ] Jedes Formularfeld hat ein zugeordnetes Label, jede Fehlermeldung ist mit ihrem Feld verknüpft

> **Geändert:** „Oberfläche ist gemäß ISO 9241 barrierefrei bedienbar" war nicht
> prüfbar — ersetzt durch zwei konkret nachweisbare Kriterien. Neu aufgenommen: die
> Ablehnung überlappender Reservierungen, fachlich der schwierigste Teil und vorher
> nicht gefordert. „Verbindlich gespeichert" entfernt — Verbindlichkeit ist #9.

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

> **Geändert:** Der Excel-Import ist entfernt — Folie 07 sagt, Maschinendaten werden
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
> der Fall zu weniger Daten — ohne ihn liefert das System Zahlen, die niemand belegen
> kann.
>
> **Offen beim PO:** Die Kriterien lassen sich auch regelbasiert erfüllen
> (Intervall aus Betriebsstunden). Das Lernfeld LF10c fordert aber ausdrücklich
> *Werkzeuge des maschinellen Lernens*. Ob ein ML-Verfahren verlangt ist, muss der PO
> sagen — davon hängt ab, ob LF10c abgedeckt ist. Dazu kommt: das Item trägt
> `fachrichtung-DP`, und diese Fachrichtung ist im Team nicht besetzt.

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
> (Kunden pflegen) mit der technischen Schnittstelle (Excel-Import) — zwei Dinge, die
> unabhängig fertig werden können und deshalb getrennt gehören (INVEST · Independent).
> Neu: getrennte Adressen und USt-ID, weil die Abrechnung sie braucht.

---

### #7b · Task · `migration` · LF8 · AE

**Ziel** — Die bestehenden Kundendaten aus der Excel-Datei stehen im neuen System,
und es ist belegbar, welche Datensätze übernommen wurden und welche nicht.

**Umfang** — Die selbst programmierte Importschnittstelle für Kundendaten.
Nicht dazu: Maschinendaten (werden neu erfasst), Vorgangsdaten.

**Akzeptanzkriterien**
- [ ] Die Zuordnung von Excel-Spalten zu Feldern des Datenmodells ist dokumentiert
- [ ] Ein Lauf gibt aus, wie viele Datensätze übernommen und wie viele abgelehnt wurden
- [ ] Abgelehnte Datensätze stehen mit Grund in einem Fehlerprotokoll; der Lauf bricht nicht ab
- [ ] Ein zweiter Lauf mit derselben Datei erzeugt keine Dubletten
- [ ] Der Import ist per Skript wiederholbar und liegt versioniert im Repository

> **Geändert:** Aus #7 herausgelöst, Typ auf Task (Folie 09). „Fehlerfrei" durch die
> prüfbare Bedingung ersetzt, dass Fehler protokolliert werden statt den Lauf
> abzubrechen — „fehlerfrei" ist bei fremden Altdaten ohnehin nicht erreichbar.

---

### #8 · User Story · `general` · LF11a · AE

**Als** Systemverantwortlicher
**möchte ich** Benutzern Rollen zuweisen und die Rechte je Rolle festlegen,
**damit** jede Nutzergruppe nur auf die für sie vorgesehenen Daten und Funktionen zugreift.

**Akzeptanzkriterien**
- [ ] Die Rollen Kunde, Mitarbeiter und Admin existieren mit je festgelegten Rechten
- [ ] Ein Kunde sieht ausschließlich eigene Reservierungen, Aufträge und Rechnungen
- [ ] Der Zugriff auf fremde Daten wird serverseitig abgelehnt — auch bei direktem Aufruf der API
- [ ] Jeder abgelehnte Zugriffsversuch wird mit Zeitpunkt, Benutzer und Ziel protokolliert
- [ ] Die Rollenzuweisung ist zur Laufzeit änderbar, ohne Code anzupassen

> **Geändert:** Das Kriterium zur eigenen Passwortspeicherung ist entfernt — die
> Authentifizierung macht laut Architektur Authelia (siehe Widerspruch 2). Diese Story
> ist damit **Autorisierung**. Neu und wichtig: die Prüfung muss serverseitig greifen,
> auch bei direktem API-Aufruf — sonst ist die Rechteprüfung reine UI-Kosmetik.
>
> **Offen beim PO:** Wie Authelia und die Rollen im System zusammenspielen (Rollen aus
> dem Token oder in der Datenbank geführt) ist eine Architekturfrage für das Team.

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
> Kriterium. Ersetzt durch die zwei Bedingungen, die das tatsächlich herstellen —
> kein Überschreiben, kein Löschen — was gleichzeitig der GoBD-Anforderung entspricht.
> „Grundlage für die Rechnungsstellung" entfernt, weil es zur Abrechnung gehört, für
> die es bislang kein Item gibt.

---

### #4 · Task · `infra` · LF4 · SI

**Ziel** — Der Strato-Server ist nach den Basisabsicherungs-Maßnahmen des
IT-Grundschutz eingerichtet, bevor Dienste darauf laufen.

**Umfang** — Betriebssystem-Härtung und Schutzbedarfsanalyse.
Nicht dazu: Absicherung der einzelnen Dienste (#11, #13, #15).

**Akzeptanzkriterien**
- [ ] SSH-Zugang nur per Schlüssel; Passwort-Login und Root-Login sind deaktiviert
- [ ] Die Firewall lässt ausschließlich die benötigten Ports zu; die Liste ist dokumentiert
- [ ] Automatische Sicherheitsupdates sind aktiv und ein Einspielvorgang ist belegt
- [ ] Eine Schutzbedarfsanalyse liegt vor, mit Einschätzung zu Vertraulichkeit, Integrität und Verfügbarkeit
- [ ] Die umgesetzten Maßnahmen sind einem IT-Grundschutz-Baustein zugeordnet
- [ ] Die Konfiguration liegt als Code im Repository, nicht nur auf dem Server

> **Geändert:** Typ auf Task — die Rolle im Original war „Teammitglied
> (Systemverantwortung)", also das Team selbst (Folie 09, INVEST · Valuable).
> Neu: die Konfiguration muss als Code vorliegen, sonst kollidiert das Item mit der
> IaC-Vorgabe.

---

### #5 · Task · `infra` · LF9 · SI

**Ziel** — Container-Laufzeit und Reverse Proxy lassen sich aus dem Repository heraus
vollautomatisch aufsetzen, sodass die Umgebung jederzeit neu entstehen kann.

**Akzeptanzkriterien**
- [ ] Ein Skript oder Playbook richtet Container-Laufzeit und Reverse Proxy ohne Handgriffe ein
- [ ] Die gesamte Konfiguration liegt versioniert im Repository
- [ ] Die Umgebung wurde **einmal vollständig gelöscht und mit einem Befehl wiederhergestellt**; der Durchlauf ist protokolliert
- [ ] Eine Testanfrage erreicht per HTTPS mit gültigem Zertifikat einen Platzhalterdienst
- [ ] Die benötigte Zeit für den Wiederaufbau ist notiert

> **Geändert:** Typ auf Task. Das Kriterium „nach Löschen stellt ein Befehl sie wieder
> her" war als Eigenschaft formuliert — jetzt als **durchgeführter und protokollierter
> Nachweis**. Genau das verlangt die Vorgabe „muss sich zerstören und schnell wieder
> aufbauen lassen", und nur ein echter Durchlauf belegt es.

---

### #6 · Task · `general` · LF5 · AE

**Ziel** — Ein minimales, lauffähiges Grundgerüst aus Client, Server und Datenbank
steht, auf dem die fachlichen Items aufbauen können.

**Akzeptanzkriterien**
- [ ] Die objektorientierte Server-Anwendung ist über den Reverse Proxy erreichbar
- [ ] Der Zugriff auf die Datenbank läuft ausschließlich über die Datenbank-API
- [ ] Das Schema ist aus einer **von Hand geschriebenen, versionierten SQL-DDL-Datei** angelegt; kein Werkzeug erzeugt es implizit
- [ ] Ein Testendpunkt schreibt einen Beispieldatensatz und liest ihn wieder
- [ ] Der Client ruft diesen Endpunkt erfolgreich auf
- [ ] Die Grundarchitektur liegt als UML-Komponenten- oder Deploymentdiagramm vor

> **Geändert:** Typ auf Task — die Rolle war „Entwicklerteam". Das Kriterium zur
> Datenbank-API ist um den zweiten Teil der Vorgabe ergänzt: das Schema wird von Hand
> geschrieben und versioniert. Im Original stand nur, was **nicht** erlaubt ist.

---

### #10 · Entscheidungs-Task · `infra` · LF9 · SI

**Ziel** — Die Wahl des Datenbanksystems ist kriteriengeleitet begründet und als ADR
dokumentiert, bevor die Datenbank produktiv aufgesetzt wird.

**Akzeptanzkriterien**
- [ ] Mindestens drei Datenbanksysteme sind recherchiert und gegenübergestellt
- [ ] Die Kriterien sind vor der Bewertung festgelegt und gewichtet
- [ ] Der Nutzwert ist berechnet und das Ergebnis interpretiert — die Punktzahl allein gilt nicht als Begründung
- [ ] Die Randbedingung aus der vorgegebenen Architektur ist benannt und bewertet: die Supabase APIs setzen PostgreSQL voraus
- [ ] Das Ergebnis liegt als ADR in `docs/adr` vor

> **Geändert:** Typ auf Entscheidungs-Task — das Ergebnis ist ein Beschluss, kein
> Inkrement. Inhaltlich ergänzt um die Randbedingung: die vorgegebene API-Schicht
> läuft nur auf PostgreSQL, die Wahl ist also nicht ergebnisoffen (siehe
> Widerspruch 3). Die Nutzwertanalyse bleibt vollständig erhalten — sie ist
> Prüfungsthema — begründet aber die vorgegebene Wahl statt eine freie zu behaupten.
>
> **Offen beim PO:** Ist die Datenbank tatsächlich frei wählbar, oder gilt die
> Architektur von Folie 08?

---

### #12 · Entscheidungs-Task · `infra` · LF9 · SI

**Ziel** — Die Wahl des Mailserver-Systems aus den drei vorgegebenen Optionen ist
kriteriengeleitet begründet und dokumentiert.

**Akzeptanzkriterien**
- [ ] Mailcow, docker-mailserver und stalwart sind verglichen: Wartungsaufwand, Ressourcenbedarf, Funktionsumfang (DKIM/SPF, Webmail, API), Docker-Kompatibilität
- [ ] Die Kriterien sind vor der Bewertung festgelegt und gewichtet
- [ ] Der Nutzwert ist berechnet und das Ergebnis interpretiert
- [ ] Die Verträglichkeit mit Container- und Reverse-Proxy-Aufbau ist geprüft
- [ ] Das Ergebnis liegt als ADR in `docs/adr` vor

> **Geändert:** Typ auf Entscheidungs-Task. Hier ist die Wahl im Gegensatz zu #10
> wirklich offen — Folie 08 nennt die drei Optionen ausdrücklich.

---

### #11 · Task · `infra` · LF10b · SI

**Ziel** — Die Datenbank läuft containerisiert, gesichert und reproduzierbar auf dem
Strato-Server, und die Anwendung kann sie nutzen.

**Akzeptanzkriterien**
- [ ] Die Datenbank läuft containerisiert und lässt sich per IaC-Skript neu aufsetzen
- [ ] Der Zugriff ist auf die benötigten Netzwerkquellen und Ports beschränkt
- [ ] Zugangsdaten liegen nicht im Klartext im Repository
- [ ] Automatisierte Backups laufen; **ein Restore wurde durchgeführt und protokolliert**
- [ ] Die Anwendung aus #6 verbindet sich erfolgreich

> **Geändert:** Typ auf Task. „Ein Restore wurde erfolgreich getestet" als
> protokollierter Nachweis formuliert — ein Backup, dessen Restore nie gelaufen ist,
> ist kein Backup.

---

### #13 · Task · `infra` · LF10b · SI

**Ziel** — Der gewählte Mailserver läuft containerisiert und reproduzierbar, und die
Anwendung kann über ihn zuverlässig E-Mails versenden.

**Akzeptanzkriterien**
- [ ] Der Mailserver läuft containerisiert und lässt sich per IaC-Skript neu aufsetzen
- [ ] SPF-, DKIM- und DMARC-Einträge sind gesetzt; eine Testmail an einen externen Anbieter landet im Postfach, nicht im Spam
- [ ] Zugangsdaten und Postfächer liegen nicht im Klartext im Repository
- [ ] Die Anwendung versendet über die Schnittstelle erfolgreich eine Test-E-Mail
- [ ] Backups von Konfiguration und Daten laufen; ein Restore wurde durchgeführt und protokolliert

> **Geändert:** Typ auf Task. „Testmails landen nicht im Spam" um das Prüfverfahren
> ergänzt — Versand an einen externen Anbieter, sonst ist es nicht nachweisbar.

---

### #15 · Task · `infra` · LF9 · SI

**Ziel** — Alle öffentlich erreichbaren Dienste sind durchgehend per TLS verschlüsselt,
ohne dass Zertifikate von Hand nachgepflegt werden.

**Akzeptanzkriterien**
- [ ] Der Reverse Proxy bezieht Zertifikate automatisiert für alle verwendeten Subdomains
- [ ] Die Erneuerung läuft automatisch vor Ablauf; der Vorgang ist einmal beobachtet oder erzwungen worden
- [ ] Aufrufe über HTTP werden auf HTTPS umgeleitet
- [ ] Die Zertifikatskonfiguration ist Teil des IaC-Setups und versioniert
- [ ] Eine Prüfung mit einem SSL-Testwerkzeug zeigt kein veraltetes TLS und keine schwachen Cipher; das Ergebnis ist abgelegt

> **Geändert:** Typ auf Task. „Erneuerung erfolgt automatisch ohne Downtime" um einen
> Nachweis ergänzt — sonst wird das Kriterium erst in drei Monaten prüfbar, also nach
> der Abgabe.

---

### #14a · Task · `infra` · LF11b · SI

**Ziel** — Verfügbarkeit und Zustand von Datenbank- und Mailserver sind sichtbar, und
kritische Zustände melden sich selbst.

**Akzeptanzkriterien**
- [ ] Verfügbarkeit, Ressourcenauslastung und Fehlerzustände beider Dienste sind in einer Übersicht sichtbar
- [ ] Bei nicht erreichbarem Dienst und bei vollem Speicher wird eine Benachrichtigung ausgelöst
- [ ] Beide Fälle wurden künstlich herbeigeführt und die Benachrichtigung ist angekommen
- [ ] Die Monitoring-Konfiguration liegt als Code im Repository

---

### #14b · Task · `infra` · LF11b · SI

**Ziel** — Für Sicherheitsupdates gibt es einen festgelegten, dokumentierten Ablauf,
der nicht von einer einzelnen Person abhängt.

**Akzeptanzkriterien**
- [ ] Der Ablauf ist dokumentiert: wer prüft wann, wie wird eingespielt, wie wird zurückgerollt
- [ ] Ein Durchlauf ist mit Datum und eingespielten Paketen protokolliert
- [ ] Wo automatische Updates laufen, ist das als Code hinterlegt

---

### #14c · Task · `infra` · LF11b · SI

**Ziel** — Bei Ausfall oder Sicherheitsvorfall weiß jede Person im Team, was zu tun ist.

**Akzeptanzkriterien**
- [ ] Ein Incident-Response-Ablauf ist dokumentiert: erkennen, eingrenzen, wiederherstellen, nachbereiten
- [ ] Für die zwei wahrscheinlichsten Fälle (Dienst weg, Server nicht erreichbar) steht je ein konkreter erster Schritt
- [ ] Zuständigkeiten und Erreichbarkeiten sind benannt
- [ ] Der Ablauf wurde einmal im Team durchgesprochen

---

### #14d · Task · `infra` · LF11b · SI

**Ziel** — Zugriffslogs von Datenbank und Mailserver sind so aufbewahrt, dass sie
nachträglich nicht unbemerkt verändert werden können.

**Akzeptanzkriterien**
- [ ] Zugriffslogs beider Dienste werden dauerhaft aufbewahrt, nicht nur rotiert
- [ ] Die Aufbewahrungsdauer ist festgelegt und dokumentiert
- [ ] Eine nachträgliche Änderung an einem Log ist erkennbar
- [ ] Die Ablage überlebt einen Neuaufbau der Umgebung

> **Geändert (alle vier):** #14 war eine Daueraufgabe und konnte die Definition of Done
> nie erfüllen (siehe Widerspruch 4). Aufgeteilt in vier Items, die jeweils in einem
> Sprint fertig werden können. Die Kriterien verlangen durchgeführte Nachweise statt
> zugesagter Eigenschaften — „Monitoring erfasst" ist keine prüfbare Aussage,
> „der ausgelöste Alarm ist angekommen" schon.

---

## Was weiterhin beim Product Owner liegt

Diese Punkte sind mit der Neufassung **nicht** gelöst, sondern nur schärfer benannt:

| Punkt | Siehe |
| --- | --- |
| Abrechnung, Shop und Marketing haben kein Item | [po-klaerung.md](po-klaerung.md) Punkt 1 |
| #3 braucht eine Entscheidung zu ML vs. Regelwerk und eine Besetzung | Punkt 2 · #3 oben |
| Ist die Datenbank frei wählbar oder gilt Folie 08? | Widerspruch 3 |
| Reihenfolge des Backlogs | po-klaerung.md Punkt 6 |
| Sprintlänge | po-klaerung.md Punkt 8 |

Nicht geändert wurden **Lernfeld- und Fachrichtungszuordnungen** — sie stammen aus der
Vorlage und betreffen die Leistungsbewertung. Zwei Folgen der Aufteilungen ließen sich
nicht vermeiden:

- **#7** trug LF8 (*Daten systemübergreifend bereitstellen*). Nach der Trennung liegt LF8
  bei der Import-Schnittstelle **#7b**, während **#7a** (Kunden pflegen) sachlich zu LF5
  gehört — wie #2. #2 selbst behält LF5 unverändert.
- **Aufwandsschätzungen** sind bei #7a/#7b und #14a–#14d entfernt. Die Vorlage schätzte
  #7 und #14 jeweils als Ganzes auf L; für die Teile gilt das nicht, und Schätzen ist
  Sache der Developers im Planning.
