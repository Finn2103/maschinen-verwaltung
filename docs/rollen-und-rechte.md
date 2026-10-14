# Rollen und Rechte

Grundlage für [#8](https://github.com/Finn2103/maschinen-verwaltung/issues/8). Die Matrix
sagt, **wer was darf**. Wie sich jemand anmeldet, steht nicht hier, das ist
[#43](https://github.com/Finn2103/maschinen-verwaltung/issues/43).

- **Status:** Entwurf. Die Entscheidungen vom 12.10.2026 stehen, die als `offen`
  markierten Zeilen fehlen noch.
- **Entschieden am 12.10.2026 von:** Finn Jendras
- **Noch nicht im Team abgestimmt.** Vor dem Review durchgehen.

## Warum diese Datei jetzt entsteht

#8 galt als blockiert durch #43. Beim Nachlesen am 12.10.2026 zeigte sich: von sechs
Akzeptanzkriterien hängt **eines** an #43, nämlich die Passwortspeicherung. Das Rollenmodell
selbst hängt an nichts.

Umgekehrt gilt mehr: in #43 steht als Ausschlusskriterium **„das Rollenmodell aus #8 ist
abbildbar"**. Ohne diese Matrix kann #43 dieses Kriterium nicht prüfen. Die Matrix entblockt
also #43.

## Die fünf Rollen

Vier fachliche Rollen und eine technische. Der Admin steht **nicht über** den anderen,
sondern quer dazu: er verwaltet Benutzer und Technik, nicht das Geschäft.

| Rolle | Wer das ist |
| --- | --- |
| **Owner** | Chef der Firma. Oberste fachliche Instanz |
| **Manager** | Fachliche Leitung. Stellt Regeln ein und sieht Auswertungen |
| **Mitarbeiter** | Pflegt Stamm- und Bewegungsdaten im Tagesgeschäft |
| **Kunde** | Mietet Maschinen. Sieht ausschließlich eigene Vorgänge |
| **Admin** | Technische Administration. Benutzer, Rollen, Betrieb |

> **Die Rolle heißt „Kunde", nicht „User".** Der Fachbegriff im ganzen Projekt ist Kunde:
> #7 heißt „Kundenstammdaten", das ERD kennt die Entität Kunde, und die
> Oberflächen-Konventionen legen deutsche Fachbegriffe fest.

> **Änderung an #8 nötig.** Das Akzeptanzkriterium dort lautet „Die Rollen Kunde,
> Mitarbeiter und Admin existieren mit je festgelegten Rechten", also drei. Entschieden
> wurden **fünf**.
>
> Das ist **keine Abweichung von der Vorgabe der Lehrkräfte.** Deren Originaltext, gesichert
> als Kommentar unter #8, sagt „Benutzerkonten mit unterschiedlichen Rollen (**z. B.** Kunde,
> Mitarbeiter, Admin)". Das ist ein Beispiel, keine Festlegung. Die Verengung auf genau drei
> ist erst bei der Neufassung im Refinement entstanden und wird hiermit korrigiert.

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

Legende: `ja` darf · `nein` darf nicht · `eigene` nur eigene Datensätze · `offen` noch nicht
entschieden

> **Owner hat überall dieselben Rechte wie Manager.** Das ist Absicht und keine Lücke: der
> Owner ist die oberste fachliche Instanz, also darf er alles, was die fachliche Leitung
> darf. Ihm zusätzliche Operationen zu geben, die der Manager nicht hat, wäre erst nötig,
> wenn es etwas gibt, das **nur** der Chef entscheiden darf. Was das sein könnte, steht
> unter „Offene Punkte".

### Maschine (#2, #3)

| Operation | Kunde | Mitarbeiter | Manager | Owner | Admin |
| --- | --- | --- | --- | --- | --- |
| Suchen und Details sehen | ja | ja | ja | ja | ja |
| Anlegen | nein | **ja** | ja | ja | ja |
| Bearbeiten | nein | **ja** | ja | ja | ja |
| Außer Dienst stellen | nein | offen | offen | offen | ja |
| Wartungsübersicht sehen | nein | offen | offen | offen | offen |

### Reservierung (#1)

| Operation | Kunde | Mitarbeiter | Manager | Owner | Admin |
| --- | --- | --- | --- | --- | --- |
| Verfügbarkeit suchen | ja | ja | ja | ja | ja |
| Verbindlich reservieren | **ja** | ja | ja | ja | ja |
| Sehen | **eigene** | ja | ja | ja | ja |
| Stornieren bis `X` Tage vor Mietbeginn | **eigene** | ja | ja | ja | ja |
| Stornieren nach Ablauf der Frist | **nein** | **ja, mit Grund** | ja, mit Grund | ja, mit Grund | ja, mit Grund |

### Auftrag (#9)

| Operation | Kunde | Mitarbeiter | Manager | Owner | Admin |
| --- | --- | --- | --- | --- | --- |
| Status sehen | **eigene** | ja | ja | ja | ja |
| Ändern, erzeugt einen neuen Eintrag | nein | offen | offen | offen | ja |
| Stornieren, erzeugt einen Storno-Eintrag | nein | ja, mit Grund | ja, mit Grund | ja, mit Grund | ja, mit Grund |

### Kunde (#7, #20)

| Operation | Kunde | Mitarbeiter | Manager | Owner | Admin |
| --- | --- | --- | --- | --- | --- |
| Anlegen | nein | ja | ja | ja | ja |
| Bearbeiten | offen | ja | ja | ja | ja |
| Suchen | nein | ja | ja | ja | ja |
| Eigene Daten sehen | **ja** | ja | ja | ja | ja |

### Rechnung und Zahlung

> **Für diesen Bereich gibt es keine User Story.** Die Aufgabenstellung heißt „Verleih und
> **Abrechnung** Maschinen", CLAUDE.md nennt UStG und GoBD als verbindliche Leitplanke, #45
> verlangt Rechnung und Zahlung im Datenmodell, und #8 nennt Rechnungen in den Rechten des
> Kunden. Ein Ticket existiert nicht. Die Zeilen bleiben deshalb überwiegend offen.

| Operation | Kunde | Mitarbeiter | Manager | Owner | Admin |
| --- | --- | --- | --- | --- | --- |
| Eigene Rechnungen sehen | **ja** | ja | ja | ja | ja |
| Rechnung erstellen | nein | offen | offen | offen | offen |
| Rechnung stornieren | nein | offen | offen | offen | offen |

### Protokoll (#2, #7, #9 erzeugen es, #19 bewahrt es auf)

| Operation | Kunde | Mitarbeiter | Manager | Owner | Admin |
| --- | --- | --- | --- | --- | --- |
| Historie **eines** Belegs oder **einer** Maschine | nein | **ja** | ja | ja | ja |
| Auswertung **über Personen** | nein | **nein** | **ja** | **ja** | ja |

### Benutzer und Einstellungen (#8)

| Operation | Kunde | Mitarbeiter | Manager | Owner | Admin |
| --- | --- | --- | --- | --- | --- |
| Rolle zuweisen | nein | nein | offen | offen | **ja** |
| Stornofrist `X` einstellen | nein | nein | **ja** | **ja** | ja |

## Die Entscheidungen im Wortlaut

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

**4. Protokoll: Belegshistorie und Personenauswertung sind getrennt.** Mitarbeiter sehen die
Historie eines einzelnen Datensatzes, weil sie im Alltag wissen müssen, warum er so
aussieht. Auswertungen über Personen sieht nur die Leitung.

**5. Fünf Rollen statt drei**, und der Admin steht quer statt oben.

> „Owner ist der Chef der Firma und ihm gehört die Orga, in der gearbeitet wird."

Vier fachliche Rollen (Owner, Manager, Mitarbeiter, Kunde) und eine technische (Admin). Der
Grund für die Trennung: wer Benutzer und Rollen verwaltet, soll nicht zugleich fachliche
Auswertungen über Personen sehen.

**6. Eine Firma, keine Mandantenfähigkeit.** Die Organisation wird als eine Instanz
simuliert. Mehrere Firmen in einem System wären der Weg, wenn man die Anwendung verkaufen
wollte, und sind für dieses Projekt ausdrücklich nicht vorgesehen.

## Was daraus für andere Tickets folgt

### Für #45 Datenmodell

- **Rollen und Rechte stehen in der Datenbank, nicht im Code.** Das Akzeptanzkriterium in #8
  verlangt „zur Laufzeit änderbar, ohne Code anzupassen". Also eigene Relationen für Rolle,
  Recht und die Zuordnung, nicht eine Prüfung gegen festverdrahtete Namen.
- **Die Stornofrist `X` braucht einen Ort.** Eine einstellbare Regel ist Konfiguration, kein
  Code und keine Umgebungsvariable, sonst kann der Manager sie nicht ändern.
- **Der Storno-Eintrag braucht ein Feld für den Grund**, und es muss Pflicht sein, wenn die
  Frist überschritten ist. Eine Bedingung, die nicht alleine über `NOT NULL` geht.
- **Das Protokoll muss zwei Abfragen zulassen:** je Objekt und je Person. Die zweite ist
  rechtlich die heiklere, siehe unten.
- **„Die Maschine wird geblockt" ist in der Anwendung allein nicht zu halten.** Bei zwei
  gleichzeitigen Reservierungen lesen beide „frei" und schreiben dann beide. Es braucht eine
  Zusicherung in der Datenbank, in PostgreSQL über einen Bereichstyp und eine
  Ausschluss-Bedingung. Ohne das ist die Entscheidung „first come, first serve" nur eine
  Absicht.

### Für #43 Anmeldeverfahren

Das Ausschlusskriterium „das Rollenmodell aus #8 ist abbildbar" ist jetzt prüfbar: vier
Rollen, Rechte je Operation, Zuordnung zur Laufzeit änderbar. Wer ein fertiges Verfahren
auswählt, prüft es gegen diese Matrix.

### Für #1

Der Knopf heißt heute schon „Verbindlich reservieren", die Entscheidung passt also zum
gebauten Stand. Was fehlt, ist der Bezug zu einem angemeldeten Kunden: derzeit werden Name,
E-Mail und Telefon im Formular erfasst, statt aus dem Konto zu kommen.

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
erforderlich. Eine Auswertung **über Personen** ist es nicht und bleibt der Leitung
vorbehalten.

Eine Rolle „Owner" mit Vollzugriff ist bewusst **nicht** vorgesehen. Verantwortlich im Sinne
der DSGVO ist der Betreiber als Organisation; daraus folgt keine Person, die in der
Oberfläche alles sehen muss.

## Offene Punkte

- [ ] **#8 anpassen:** das Kriterium nennt drei Rollen, entschieden sind fünf. Der
      Originaltext sagt „z. B.", die Verengung stammt aus der Neufassung
- [ ] **Was darf nur der Owner, das der Manager nicht darf?** Solange die Antwort „nichts"
      ist, sind die beiden Rollen im Rechtemodell nicht unterscheidbar. Mögliche Kandidaten:
      einen Manager einsetzen oder absetzen, Firmenstammdaten ändern, eine Rechnung über
      einem bestimmten Betrag stornieren
- [ ] Darf ein Kunde seine **eigenen Stammdaten** ändern? Betrifft die Rechnungsadresse und
      damit die Abrechnung
- [ ] Wer darf eine Maschine **außer Dienst stellen**? In #2 steht dazu kein Kriterium
- [ ] Wer darf einen **Auftrag ändern**? #9 regelt nur, dass eine Änderung einen neuen
      Eintrag erzeugt, nicht durch wen
- [ ] **Rechnung und Zahlung** haben keine User Story. Solange die fehlt, bleiben die Rechte
      dort offen
- [ ] Die **Wartungsübersicht** aus #3 gehört zur Fachrichtung Daten- und Prozessanalyse,
      die Rechte dafür entscheidet, wer das Ticket bearbeitet
- [ ] Im **Team abstimmen**, bisher ist das Einzelarbeit
