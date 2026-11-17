# Rollen und Rechte

Grundlage für [#8](https://github.com/Finn2103/maschinen-verwaltung/issues/8). Die Matrix
sagt, **wer was darf**. Wie sich jemand anmeldet, steht nicht hier, das ist
[#43](https://github.com/Finn2103/maschinen-verwaltung/issues/43). Wie die Datenbank die
Matrix abbildet, ist [#99](https://github.com/Finn2103/maschinen-verwaltung/issues/99).

- **Status:** entschieden. Die Matrix unten ist die abgegebene Fassung 1 vom 16.11.2026.
- **Entschieden von:** Finn Jendras, am 12.10.2026 (erste Fassung) und am 16.11.2026
  (diese Fassung). Das Team hatte keine Zeit zum Abstimmen, Finn hat allein entschieden.
- **Noch offen:** die Punkte, die an #43 hängen, siehe [Offene Punkte](#offene-punkte).

## Warum diese Datei entstanden ist

#8 galt als blockiert durch #43. Beim Nachlesen am 12.10.2026 zeigte sich: von sechs
Akzeptanzkriterien hängt **eines** an #43, nämlich die Passwortspeicherung. Das Rollenmodell
selbst hängt an nichts.

Umgekehrt gilt mehr: in #43 steht als Ausschlusskriterium **„das Rollenmodell aus #8 ist
abbildbar"**. Ohne diese Matrix kann #43 dieses Kriterium nicht prüfen. Die Matrix entblockt
also #43.

## Die fünf Rollen

Vier fachliche Rollen und eine technische. Jede Person hat **genau eine** Rolle (F7).

| Rolle | Wer das ist |
| --- | --- |
| **Owner** | Chef der Firma. Oberste fachliche Instanz, weist zusätzlich die Rollen zu |
| **Manager** | Fachliche Leitung. Stellt Regeln ein und sieht Auswertungen |
| **Mitarbeiter** | Pflegt Stamm- und Bewegungsdaten im Tagesgeschäft, auch Rechnungen |
| **Kunde** | Mietet Maschinen und bestellt Material. Sieht ausschließlich eigene Vorgänge |
| **Admin** | Technische Administration. Darf alles, auch die Rechte einer Rolle ändern |

Dazu kommt **ohne Anmeldung**. Das ist keine Rolle, sondern der Besucher ohne Konto: er darf
Maschinen suchen und freie Zeiträume sehen, sonst nichts (F5, F6).

> **Die Rolle heißt „Kunde", nicht „User".** Der Fachbegriff im ganzen Projekt ist Kunde:
> #7 heißt „Kundenstammdaten", das ERD kennt die Entität Kunde, und die
> Oberflächen-Konventionen legen deutsche Fachbegriffe fest.

> **#8 angepasst (16.11.2026).** Das Akzeptanzkriterium dort lautete „Die Rollen Kunde,
> Mitarbeiter und Admin existieren mit je festgelegten Rechten", also drei. Entschieden
> sind **fünf** (F1), das Kriterium nennt jetzt alle fünf.
>
> Das ist **keine Abweichung von der Vorgabe der Lehrkräfte.** Deren Originaltext, gesichert
> als Kommentar unter #8, sagt „Benutzerkonten mit unterschiedlichen Rollen (**z. B.** Kunde,
> Mitarbeiter, Admin)". Das ist ein Beispiel, keine Festlegung. Die Verengung auf genau drei
> ist erst bei der Neufassung im Refinement entstanden.

## Eine Firma, keine Mandantenfähigkeit

Entschieden am 12.10.2026. Das System verwaltet **eine** Verleihfirma. Der Owner ist deren
Chef, nicht der Inhaber eines von mehreren Mandanten.

> **Warum das überhaupt dasteht.** Beim Festlegen der Rollen kam die Frage auf, ob die
> Organisation eine eigene Instanz im Modell sein soll, also mehrere Verleihfirmen in einem
> System. Das wäre der Weg, wenn man die Anwendung verkaufen wollte. Für dieses Projekt wird
> es bewusst als **eine** Organisation simuliert.
>
> Die Folge, die man kennen muss: Mandantenfähigkeit nachträglich einzubauen heißt, **jede**
> Tabelle um einen Bezug zur Organisation zu erweitern und **jede** Abfrage darauf
> einzuschränken. Das ist kein Nachrüsten, sondern ein Umbau des Datenmodells. Deshalb steht
> die Entscheidung hier und nicht implizit im SQL.

## Die Matrix

Stand: Fassung 1, abgegeben am 16.11.2026. 26 Aktionen, 105 vergebene Rechte, davon 8 mit
`eigene`.

Legende: `ja` darf · `nein` darf nicht · `eigene` nur eigene Datensätze · `ja, mit Grund`
darf nur mit Angabe eines Grundes. **Fett** ist, was am 16.11.2026 anders als im Entwurf
vorgeschlagen entschieden wurde oder aus einer Antwort F1 bis F14 folgt. Die Spalte
„Grundlage" nennt, woher die Zeile kommt.

- Die Spalte „ohne Anmeldung" gilt schon jetzt. Bis es Konten gibt (#43), meldet man sich
  über die Probe-Anmeldung in der Kopfleiste an (Antwort 60). Reservieren und „Meine
  Reservierungen" gehen nur angemeldet (F6, #125). Name und E-Mail-Adresse kommen beim
  Reservieren bis #43 weiter aus dem Formular.
- **Owner und Manager** unterscheiden sich in zwei Zeilen: Rolle zuweisen und abgelehnte
  Zugriffe sehen darf nur der Owner (F2).
- **Admin** hat in jeder Zeile ein Recht. Auch er storniert nach Ablauf der Frist nur mit
  Grund (F3).

### Suchen und reservieren (#1)

| Aktion | ohne Anmeldung | Kunde | Mitarbeiter | Manager | Owner | Admin | Grundlage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Maschinen suchen, freie Zeiträume sehen | **ja** | ja | ja | ja | ja | ja | #1 · 12.10. · F5 |
| Verbindlich reservieren | **nein** | ja | ja | ja | ja | ja | #1 · Entscheidung 1 · F6 |
| Reservierungen sehen | **nein** | eigene | ja | ja | ja | ja | #1 · #8 · F6 |
| Stornieren bis zur Stornofrist | nein | eigene | ja | ja | ja | ja | Entscheidung 3 · F8 |
| Stornieren nach Ablauf der Frist | nein | nein | ja, mit Grund | ja, mit Grund | ja, mit Grund | ja, mit Grund | Entscheidung 3 |

Die Stornofrist ist **ein** Wert in Tagen vor Mietbeginn für alle Maschinen, einstellbar
(`einstellung.stornofrist_tage`, F8). Startwert: **3 Tage** vor Mietbeginn.

### Auftrag (#9)

| Aktion | ohne Anmeldung | Kunde | Mitarbeiter | Manager | Owner | Admin | Grundlage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Auftragsstatus sehen | nein | eigene | ja | ja | ja | ja | #9 · 12.10. |
| Auftrag ändern, als neuer Eintrag | nein | nein | ja | ja | ja | ja | #9 · 16.11. |

Die Zeile „Auftrag stornieren, als Storno-Eintrag" **entfällt** (F9). Reservierung und
Auftrag sind ein Datensatz, die Ausleihe mit Status (ERD-Entscheidung 2). Storniert wird
deshalb immer nach den beiden Storno-Zeilen oben.

### Maschinen (#2, #3)

| Aktion | ohne Anmeldung | Kunde | Mitarbeiter | Manager | Owner | Admin | Grundlage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Verwaltungsliste mit allen Feldern | nein | nein | ja | ja | ja | ja | #2 · Mockup 06 |
| Maschine anlegen | nein | nein | ja | ja | ja | ja | #2 · Entscheidung 2 |
| Maschine bearbeiten | nein | nein | ja | ja | ja | ja | #2 · Entscheidung 2 |
| Maschine außer Dienst stellen | nein | nein | ja | ja | ja | ja | 16.11. |
| Wartungsübersicht sehen | nein | nein | ja | ja | ja | **ja** | #3 · 16.11. |

Was der Kunde von einer Maschine sieht, regelt die erste Zeile unter „Suchen und
reservieren". Die Verwaltungsliste mit allen Feldern ist für das Personal.

### Kunden (#7, #20)

| Aktion | ohne Anmeldung | Kunde | Mitarbeiter | Manager | Owner | Admin | Grundlage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Kunden anlegen | nein | **eigene** | ja | ja | ja | ja | #7 · F14 |
| Kunden suchen | nein | nein | ja | ja | ja | ja | #7 |
| Kundendaten sehen | nein | eigene | ja | ja | ja | ja | #8 |
| Kundendaten bearbeiten | nein | **eigene** | ja | ja | ja | ja | #7 · F10 |

### Rechnung und Bestellung

| Aktion | ohne Anmeldung | Kunde | Mitarbeiter | Manager | Owner | Admin | Grundlage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Rechnungen sehen | nein | eigene | ja | ja | ja | ja | #8 |
| Rechnung erstellen | nein | nein | ja | ja | ja | **ja** | 16.11. |
| Rechnung stornieren, als Storno-Rechnung | nein | nein | **ja** | ja | ja | **ja** | 16.11. · F11 |
| Verbrauchsmaterial bestellen, Bestellungen sehen | nein | eigene | ja | ja | ja | **ja** | #94 |

> **Für Rechnung und Zahlung gibt es keine User Story.** Die Aufgabenstellung heißt „Verleih
> und **Abrechnung** Maschinen", CLAUDE.md nennt UStG und GoBD als verbindliche Leitplanke,
> #45 hat Rechnung und Zahlung im Datenmodell, und #8 nennt Rechnungen in den Rechten des
> Kunden. Die Rechte stehen jetzt fest, ein Ticket für die Oberfläche fehlt weiter.

### Protokoll (#2, #7, #9 erzeugen es, #19 bewahrt es auf)

| Aktion | ohne Anmeldung | Kunde | Mitarbeiter | Manager | Owner | Admin | Grundlage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Änderungsprotokoll **eines** Datensatzes | nein | nein | ja | ja | ja | ja | #2 · Entscheidung 4 |
| Auswertung **über Personen** | nein | nein | nein | ja | ja | **ja** | Entscheidung 4 · F4 |
| Abgelehnte Zugriffe sehen | nein | nein | nein | nein | **ja** | ja | #8 · Mockup 13 |

### Benutzer und Einstellungen (#8)

| Aktion | ohne Anmeldung | Kunde | Mitarbeiter | Manager | Owner | Admin | Grundlage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Rolle zuweisen | nein | nein | nein | nein | **ja** | ja | #8 · Mockup 11 · F2 |
| Rechte einer Rolle ändern | nein | nein | nein | nein | nein | ja | #8 · #99 · Mockup 12 |
| Stornofrist einstellen | nein | nein | nein | ja | ja | ja | Entscheidung 3 · F8 |

## Die Entscheidungen vom 12.10.2026 im Wortlaut

Was sich davon am 16.11.2026 geändert hat, steht jeweils darunter.

**1. Der Kunde reserviert verbindlich.**

> „Er kann das ja nur mit Maschinen machen, die aktuell noch reserviert werden können, also
> first come, first serve. Das heißt, dass die Maschine geblockt wird, damit sie nicht
> doppelt reserviert werden kann."

Keine Bestätigung durch einen Mitarbeiter. Die Reservierung gilt sofort und sperrt den
Zeitraum.

**2. Maschinenstammdaten pflegen Mitarbeiter und Admin.** Jede Änderung wird laut #2
ohnehin mit Benutzer, Feld, altem und neuem Wert protokolliert, die Nachvollziehbarkeit
bleibt also auch ohne Einschränkung auf den Admin.

**3. Storno mit Frist und Begründungspflicht.** Der Kunde darf eigene Vorgänge bis `X` Tage
vor Mietbeginn selbst stornieren. `X` ist **keine Konstante im Code**, sondern vom Manager
einstellbar. Ein Mitarbeiter darf immer stornieren, nach Ablauf der Frist aber nur **mit
Angabe eines Grundes**.

- 16.11.: `X` ist ein Wert für alle Maschinen, `einstellung.stornofrist_tage`, Startwert
  3 Tage (F8). Die Regel gilt für jede Ausleihe, egal ob sie noch Reservierung oder schon
  Auftrag ist (F9).

**4. Protokoll: Belegshistorie und Personenauswertung sind getrennt.** Mitarbeiter sehen die
Historie eines einzelnen Datensatzes, weil sie im Alltag wissen müssen, warum er so
aussieht. Auswertungen über Personen sieht nur die Leitung.

- 16.11.: Die Auswertung über Personen sieht auch der Admin (F4). Die Trennung bleibt
  zwischen Mitarbeiter (ein Datensatz) und Leitung samt Admin (über Personen). Protokolliert
  werden Maschine, Ausleihe, Kunde, Rechnung und Bestellung (F12).

**5. Fünf Rollen statt drei.**

> „Owner ist der Chef der Firma und ihm gehört die Orga, in der gearbeitet wird."

Vier fachliche Rollen (Owner, Manager, Mitarbeiter, Kunde) und eine technische (Admin).

- 16.11.: Die fünf Rollen bleiben (F1), der Owner bleibt eine eigene Rolle (F2). Die
  Begründung vom 12.10., der Admin stehe „quer" zu den anderen und solle keine Auswertungen
  über Personen sehen, gilt **nicht mehr**: der Admin darf alles (F3, F4). Damit ist der
  Widerspruch zwischen dieser Begründung und der Matrix aufgelöst, der seit dem 12.10. in
  der Datei stand.

**6. Eine Firma, keine Mandantenfähigkeit.** Die Organisation wird als eine Instanz
simuliert. Mehrere Firmen in einem System wären der Weg, wenn man die Anwendung verkaufen
wollte, und sind für dieses Projekt ausdrücklich nicht vorgesehen.

## Die Entscheidungen vom 16.11.2026

Entschieden von Finn auf der Rollenmatrix, Fassung 1. Grundlage war der Entwurf mit den
Fragen F1 bis F17. Wo Finn eine Begründung notiert hat, steht sie darunter.

| Nr. | Frage | Entscheidung | Folge |
| --- | --- | --- | --- |
| F1 | Fünf Rollen statt drei? | Ja, fünf Rollen | Kriterium in #8 nennt alle fünf |
| F2 | Owner und Manager zusammenlegen? | **Nein,** Owner bleibt eine eigene Rolle | Owner darf zusätzlich Rollen zuweisen und abgelehnte Zugriffe sehen |
| F3 | Admin nur Technik oder fast überall ja? | **Admin fast überall ja,** wie in der Matrix vom 12.10. | Admin hat in jeder Zeile ein Recht |
| F4 | Auswertung über Personen für den Admin? | **Ja,** Admin auch | Admin `ja` bei „Auswertung über Personen" |
| F5 | Maschinen suchen ohne Anmeldung? | Ja | ohne Anmeldung `ja` beim Suchen |
| F6 | Reservieren nur mit Konto? | Ja, nur mit Konto, ab #43 | ohne Anmeldung `nein` bei „Verbindlich reservieren" und „Reservierungen sehen" |
| F7 | Eine Rolle je Person oder mehrere? | Eine Rolle | #99: `benutzer.rolle` statt Tabelle `benutzer_rolle` |
| F8 | Stornofrist: ein Wert für alle Maschinen? | Ja, ein Wert, einstellbar, Startwert 3 Tage | #99: Zeile `stornofrist_tage` in `einstellung`, Wert 3 |
| F9 | Reservierung und Auftrag: ein Datensatz? | Ja, Ausleihe mit Status | Zeile „Auftrag stornieren" entfällt |
| F10 | Ändert der Kunde seine Adresse selbst? | Ja, die eigene | Kunde `eigene` bei „Kundendaten bearbeiten" |
| F11 | Rechnung stornieren nur Manager und Owner? | **Nein,** der Mitarbeiter auch | Mitarbeiter `ja` bei „Rechnung stornieren" |
| F12 | Protokoll für Maschine, Ausleihe, Kunde? | **Dazu Rechnung und Bestellung** | #99: Protokoll auch für `rechnung` und `bestellung` |
| F14 | Wer legt das Kundenkonto an? | Der Kunde selbst | Kunde `eigene` bei „Kunden anlegen". Die Registrierung kommt später |

**Fett** heißt: anders als im Entwurf vorgeschlagen. F13 und F15 bis F17 sind auf später
gestellt, siehe [Offene Punkte](#offene-punkte).

### Begründungen

- **F2, Owner bleibt eigene Rolle.** Braucht der Owner später mehr Rechte oder der Manager
  weniger, muss niemand die Rollen erst wieder trennen.
- **F3 und F4, der Admin darf alles.** Finn sieht keinen Grund, warum ein Admin etwas nicht
  dürfen sollte. Zusammen mit F7 ist das nötig: wer nur eine Rolle hat und Admin ist, muss
  auch die Funktionen von Manager und Mitarbeiter nutzen können, zum Beispiel reservieren,
  und hat zusätzlich die technischen Rechte.
- **F5, Suchen ohne Anmeldung.** Wer nicht angemeldet ist, kann suchen, aber nicht buchen
  und keine eigenen Buchungen sehen.
- **F11, Mitarbeiter storniert Rechnungen.** Das gehört zu seiner Arbeit. Sonst müsste er
  für jede Storno-Rechnung einen Manager holen.
- **F12, Protokoll auch für Rechnung und Bestellung.** Es spricht nichts dagegen, und mehr
  Nachvollziehbarkeit ist eher besser.
- **F14, Kunde legt sein Konto selbst an.** Die Möglichkeit, sich zu registrieren, kommt
  später.

## Was daraus für andere Tickets folgt

### Für #45 Datenmodell

Seit dem 10.11.2026 nicht mehr in #45, sondern in
[#99](https://github.com/Finn2103/maschinen-verwaltung/issues/99).

- **Rollen und Rechte stehen in der Datenbank, nicht im Code.** Das Akzeptanzkriterium in #8
  verlangt „zur Laufzeit änderbar, ohne Code anzupassen". Also eigene Relationen für Rolle,
  Recht und die Zuordnung, nicht eine Prüfung gegen festverdrahtete Namen.
- **Die Stornofrist braucht einen Ort.** Eine einstellbare Regel ist Konfiguration, kein
  Code und keine Umgebungsvariable, sonst kann der Manager sie nicht ändern.
- **Der Storno braucht ein Feld für den Grund**, und es muss Pflicht sein, wenn die
  Frist überschritten ist. Eine Bedingung, die nicht alleine über `NOT NULL` geht.
- **Das Protokoll muss zwei Abfragen zulassen:** je Objekt und je Person. Die zweite ist
  rechtlich die heiklere, siehe unten.
- **„Die Maschine wird geblockt" ist in der Anwendung allein nicht zu halten.** Bei zwei
  gleichzeitigen Reservierungen lesen beide „frei" und schreiben dann beide. Es braucht eine
  Zusicherung in der Datenbank, in PostgreSQL über einen Bereichstyp und eine
  Ausschluss-Bedingung. Ohne das ist die Entscheidung „first come, first serve" nur eine
  Absicht.

Was #99 nach der Fassung vom 16.11.2026 baut:

| Tabelle | Was | Regel |
| --- | --- | --- |
| `benutzer` | neu: `benutzer_id`, `email` (eindeutig), `name`, `aktiv`, ↑`kundennummer` (eindeutig, leer erlaubt), ↑`rolle` | Kein Passwort, das ist #43. Eine Rolle je Person (F7) |
| `rolle` | neu: `rolle`, `bezeichnung` | 5 Zeilen: owner, manager, mitarbeiter, kunde, admin |
| `recht` | neu: `recht` (z. B. `maschine.anlegen`), `bezeichnung` | eine Zeile je Matrix-Zeile, also 26 |
| `rolle_recht` | neu, M : N: ↑`rolle`, ↑`recht`, `umfang` (`alle` oder `eigene`) | Recht vergeben = ein INSERT. Nach der Matrix 105 Zeilen, davon 8 mit `eigene`. „ohne Anmeldung" ist keine Rolle |
| `benutzer_rolle` | entfällt | eine Rolle je Person, dafür reicht `benutzer.rolle` (F7) |
| `einstellung` | neu: `schluessel`, `wert`, `geaendert_am`, ↑`geaendert_von` | Zeile `stornofrist_tage`, Startwert 3, ändern per UPDATE (F8) |
| `ausleihe` | drei Spalten mehr: `storniert_am`, ↑`storniert_von`, `stornogrund` | Storno nach Ablauf der Frist ohne Grund lehnt die Datenbank ab. Status storniert genau dann, wenn `storniert_am` gesetzt ist |
| `protokoll` | neu: `protokoll_id`, `zeitpunkt`, ↑`benutzer_id`, `objekt`, `objekt_id`, `feld`, `alt`, `neu` | Einträge für Maschine, Ausleihe, Kunde, Rechnung und Bestellung (F12). Kein UPDATE oder DELETE. Index je Objekt und je Benutzer |

- „Nur eigene" heißt für den Kunden: `benutzer.kundennummer = ausleihe.kundennummer`, genauso
  bei Rechnung und Bestellung.
- Wer im Trigger der Benutzer ist, hängt an #43: `auth.uid()` bei Supabase Auth, sonst eine
  Sitzungsvariable je Anfrage.
- Wo die abgelehnten Zugriffe gespeichert werden (`zugriff_abgelehnt`, #8 Kriterium 5), ist
  offen (F16).

### Für #43 Anmeldeverfahren

Das Ausschlusskriterium „das Rollenmodell aus #8 ist abbildbar" ist jetzt prüfbar: fünf
Rollen, eine Rolle je Person, Rechte je Aktion mit dem Umfang `alle` oder `eigene`,
Zuordnung zur Laufzeit änderbar. Wer ein fertiges Verfahren auswählt, prüft es gegen diese
Matrix. Der Kunde legt sein Konto selbst an (F14).

### Für #1

Der Knopf heißt heute schon „Verbindlich reservieren", die Entscheidung passt also zum
gebauten Stand. Was fehlt, ist der Bezug zu einem angemeldeten Kunden: derzeit werden Name,
E-Mail und Telefon im Formular erfasst, statt aus dem Konto zu kommen. Reservieren darf
schon jetzt nur, wer angemeldet ist (F6), bis #43 über die Probe-Anmeldung (#125). Aus dem
Konto kommen die Kundendaten mit #43.

## Rechtlicher Hinweis zum Protokoll

Festgehalten, weil die Entscheidung sonst nicht begründbar ist. **Keine Rechtsberatung.**

Ein Änderungs- und Zugriffsprotokoll hält fest, **was Mitarbeiter getan haben**. Das sind
personenbezogene Daten von Beschäftigten, und daraus folgen zwei Dinge:

- **Mitbestimmung.** Eine Einrichtung, die geeignet ist, Verhalten oder Leistung von
  Beschäftigten zu überwachen, ist in Deutschland mitbestimmungspflichtig. Der Betriebsrat
  müsste einer solchen Auswertung zustimmen.
- **Zweckbindung und Erforderlichkeit.** Das Protokoll existiert für die Nachvollziehbarkeit
  von Belegen nach GoBD, nicht für Leistungsbeurteilung. Wer darauf zugreift, muss es für
  diesen Zweck brauchen.

Deshalb die Trennung: die Historie **eines** Belegs ist Tagesgeschäft und für Mitarbeiter
erforderlich. Eine Auswertung **über Personen** ist es nicht und bleibt Manager, Owner und
Admin vorbehalten (F4).

Vollen Zugriff hat nur der Admin (F3). Verantwortlich im Sinne der DSGVO ist der Betreiber
als Organisation, nicht eine Person in der Oberfläche.

## Offene Punkte

- [ ] **Benutzer:** eigene Tabelle oder Supabase Auth (`auth.users`)? Hängt an #43 (F13)
- [ ] **Datenbank-Rechte** für PostgREST (GRANT, Row Level Security): in #99 oder in #8?
      Später (F15)
- [ ] **Abgelehnte Zugriffe speichern:** Tabelle in #99 oder in #8? Später (F16)
- [ ] **Werkstattplaner** aus #3: eigene Rolle oder Mitarbeiter? Später (F17)
- [ ] **Registrierung:** der Kunde legt sein Konto selbst an (F14), die Funktion dafür kommt
      später
- [ ] **Rechnung und Zahlung** haben keine User Story. Die Rechte stehen fest, das Ticket
      für die Oberfläche fehlt
