# Relationales Modell

Vom ERD ([`ERD-Maschinenverwaltung.drawio`](ERD-Maschinenverwaltung.drawio)) zu den
Tabellen in [`schema.sql`](schema.sql). Dieses Dokument zeigt, **wie** jede Tabelle aus dem
ERD entsteht und **warum** das Ergebnis in 3. Normalform ist.

- **Stand:** Entwurf vom 11.11.2026 zu #45, auf Grundlage der vorläufig angenommenen
  ERD-Entscheidungen aus #73 und Finns Antworten vom 09.11. und 11.11. (alle in
  [`docs/scrum/entscheidungen.md`](../scrum/entscheidungen.md)). Nachtrag 12.11. für #2:
  Baujahr und Wartungsintervall der Maschine (Antwort 36, siehe 4.6).
- **Geprüft:** `schema.sql` läuft fehlerfrei auf einer leeren PostgreSQL 17,
  `schema-pruefen.sql` prüft jede Zusicherung unten mit einem Fall. Aufruf:
  [`schema-pruefen.ps1`](schema-pruefen.ps1).

**Schreibweise:** `Relation(`**Primärschlüssel**`, ↑Fremdschlüssel, Attribut)`. Ein
Fremdschlüssel heißt wie der Schlüssel, auf den er zeigt. Namen nach ERD-Entscheidung 8:
Deutsch, kleingeschrieben, Einzahl; „nr.“ aus dem ERD wird „nummer“, Umlaute werden
ae/oe/ue.

---

## 1 Die Regeln der Überführung

| ERD | wird zu | Beispiel hier |
| --- | --- | --- |
| Entität | Relation, Schlüsselattribut wird Primärschlüssel | Kunde → `kunde(`**kundennummer**`, …)` |
| Beziehung 1 : N | Fremdschlüssel auf der N-Seite | Kunde 1 tätigt N Ausleihe → `ausleihe.↑kundennummer` |
| Beziehung M : N | eigene Relation, beide Fremdschlüssel zusammen sind der Primärschlüssel, Beziehungsattribute kommen mit | Bestellung enthält Verbrauchsmaterial → `bestellposition` mit `menge` |
| schwache Entität | Primärschlüssel aus dem Schlüssel der starken Entität und dem partiellen Schlüssel | Rechnungsposition → **rechnungsnummer, positionsnummer** |
| rekursive Beziehung 1 : 1 | Fremdschlüssel auf die eigene Relation, eindeutig | Rechnung storniert Rechnung → `rechnung.↑storniert_rechnungsnummer` (UNIQUE) |
| zwei sich ausschließende N : 1 | zwei Fremdschlüssel, eine Bedingung „genau einer gesetzt“ | Rechnungsposition betrifft Ausleihe **oder** berechnet Bestellung |

---

## 2 Das Ergebnis: 18 Relationen

**Kunde und Ausleihe**

- `kunde(`**kundennummer**`, name, strasse, plz, ort, email, telefon)`
- `ausleihe(`**ausleihnummer**`, ↑kundennummer, ↑inventarnummer, von, bis, status)`

**Maschine**

- `maschinentyp(`**typnummer**`, bezeichnung, kategorie, tagessatz)`
- `maschine(`**inventarnummer**`, ↑typnummer, seriennummer, baujahr, standort, betriebsstunden, wartungsintervall)`
- `messgroesse(`**messgroesse_id**`, bezeichnung, einheit)` (aus der Normalisierung, siehe 3.3)
- `messwert(`**messwert_id**`, ↑inventarnummer, ↑messgroesse_id, zeitpunkt, wert)`

**Bauteil und Wartung**

- `bauteiltyp(`**bauteiltyp_id**`, hersteller, teilenummer, bezeichnung)` (aus der Normalisierung, siehe 3.3)
- `bauteil(`**bauteil_id**`, ↑inventarnummer, ↑bauteiltyp_id, einbaudatum)`
- `wartung(`**wartungsnummer**`, ↑inventarnummer, datum, art)`
- `wartungsmassnahme(`**↑wartungsnummer, ↑bauteil_id**`, massnahme)`

**Verbrauchsmaterial und Bestellung**

- `verbrauchsmaterial(`**verbrauchsmaterial_id**`, bezeichnung, einheit, preis)`
- `passt_zu(`**↑verbrauchsmaterial_id, ↑typnummer**`)`
- `bestellung(`**bestell_id**`, ↑kundennummer, bestelldatum, lieferstatus)`
- `bestellposition(`**↑bestell_id, ↑verbrauchsmaterial_id**`, menge)`

**Abrechnung**

- `rechnung(`**rechnungsnummer**`, ↑kundennummer, rechnungsdatum, empfaenger_name, empfaenger_strasse, empfaenger_plz, empfaenger_ort, ↑storniert_rechnungsnummer, erfasst_am)`
- `rechnungsposition(`**↑rechnungsnummer, positionsnummer**`, bezeichnung, menge, einzelpreis, steuersatz, ↑ausleihnummer, ↑bestell_id)`
- `zahlung(`**zahlungs_id**`, ↑rechnungsnummer, betrag, zahldatum)`
- `nummernkreis(`**bezeichnung**`, letzte_nummer)` (technisch, siehe 4.2)

### Woher jede Relation kommt

| ERD | Relation | Bemerkung |
| --- | --- | --- |
| Kunde | `kunde` | Adresse in drei Spalten zerlegt (1. NF) |
| Ausleihe | `ausleihe` | Reservierung ist eine Ausleihe mit Status `reserviert` (ERD-Entscheidung 2) |
| tätigt (1 : N) | `ausleihe.kundennummer` | |
| umfasst (N : 1) | `ausleihe.inventarnummer` | eine Ausleihe, eine Maschine |
| Maschinentyp | `maschinentyp` | |
| Maschine | `maschine` | |
| ist vom Typ (N : 1) | `maschine.typnummer` | |
| Messwert | `messwert` + `messgroesse` | Einheit abgespalten (3. NF) |
| liefert (1 : N) | `messwert.inventarnummer` | |
| Bauteil | `bauteil` + `bauteiltyp` | Teiletyp abgespalten (3. NF, Antwort 7) |
| hat (1 : N) | `bauteil.inventarnummer` | |
| Wartung | `wartung` | |
| unterliegt (1 : N) | `wartung.inventarnummer` | |
| bearbeitet (M : N) | `wartungsmassnahme` | mit `massnahme` (Antwort 8) |
| Verbrauchsmaterial | `verbrauchsmaterial` | |
| passt zu (M : N) | `passt_zu` | kein Beziehungsattribut, deshalb kein besserer Name als die Beziehung |
| Bestellung | `bestellung` | |
| gibt auf (1 : N) | `bestellung.kundennummer` | |
| enthält (M : N) | `bestellposition` | mit `menge` |
| Rechnung | `rechnung` | Empfängeradresse in drei Spalten zerlegt (1. NF), bewusste Kopie aus `kunde` (3.4, Antwort 19) |
| erhält (1 : N) | `rechnung.kundennummer` | |
| storniert (1 : 1, rekursiv) | `rechnung.storniert_rechnungsnummer` | ERD-Entscheidung 6 |
| Rechnungsposition, besteht aus | `rechnungsposition` | schwache Entität |
| betrifft (N : 1) | `rechnungsposition.ausleihnummer` | genau eines von beiden (Antwort 10) |
| berechnet (N : 1) | `rechnungsposition.bestell_id` | genau eines von beiden (Antwort 10) |
| Zahlung, begleicht (N : 1) | `zahlung`, `zahlung.rechnungsnummer` | |

M : N-Relationen heißen nach dem, was eine Zeile ist, wenn es dafür ein Wort gibt
(Bestellposition, Wartungsmaßnahme), sonst nach der Beziehung (`passt_zu`).

---

## 3 Normalisierung

### 3.1 Erste Normalform: nur atomare Werte

| Was | Vorher | Nachher |
| --- | --- | --- |
| Adresse des Kunden | ein Attribut „Adresse“ im ERD | `strasse`, `plz`, `ort`. Die Hausnummer bleibt in `strasse`, weil niemand nach ihr sucht |
| Empfängeradresse der Rechnung | ein Attribut „Empfängeradresse“ im ERD | `empfaenger_strasse`, `empfaenger_plz`, `empfaenger_ort`, zerlegt wie beim Kunden |
| Zeitraum der Ausleihe | „von – bis“ als eine Angabe | `von` und `bis` als `date` (ERD-Entscheidung 3) |
| Inhalt einer Bestellung | mehrere Materialien in einer Bestellung | eine Zeile je Material in `bestellposition` |

### 3.2 Zweite Normalform: kein Attribut hängt nur an einem Teil des Schlüssels

Betrifft nur Relationen mit zusammengesetztem Schlüssel:

| Relation | Schlüssel | Nichtschlüssel-Attribute | Hängt am ganzen Schlüssel? |
| --- | --- | --- | --- |
| `rechnungsposition` | rechnungsnummer, positionsnummer | bezeichnung, menge, einzelpreis, steuersatz, ausleihnummer, bestell_id | ja, alles beschreibt die eine Position, nicht die Rechnung |
| `bestellposition` | bestell_id, verbrauchsmaterial_id | menge | ja |
| `wartungsmassnahme` | wartungsnummer, bauteil_id | massnahme | ja |
| `passt_zu` | verbrauchsmaterial_id, typnummer | keine | trivial erfüllt |

**Was deshalb bewusst fehlt:** `wartungsmassnahme` hat keine Spalte `inventarnummer`.
Damit ließe sich in der Datenbank prüfen, dass Wartung und Bauteil zur selben Maschine
gehören. Die Maschine hängt aber allein an `wartungsnummer`, also nur an einem Teil des
Schlüssels, und das verletzt die 2. NF. Diese Prüfung macht die Anwendung (siehe 4.7).

### 3.3 Dritte Normalform: keine transitiven Abhängigkeiten

Gesucht: ein Nichtschlüssel-Attribut, das von einem anderen Nichtschlüssel-Attribut
abhängt. Zwei Fälle stehen so im ERD und werden hier aufgelöst.

**Bauteil (Antwort 7 vom 09.11.).** Im ERD hat das Bauteil Hersteller, Teilenummer und
Bezeichnung. Die Bezeichnung hängt aber an Hersteller und Teilenummer, nicht am Exemplar:

```
bauteil_id → (hersteller, teilenummer) → bezeichnung
```

Jeder Hydraulikfilter desselben Typs würde Hersteller und Bezeichnung wiederholen, und eine
Korrektur der Bezeichnung müsste jedes Exemplar treffen. Deshalb `bauteiltyp`. Das
**Exemplar** bleibt eine eigene Relation, weil #3 den Verschleiß je Exemplar braucht
(Einbaudatum, Wartungen). Teilenummern sind nur je Hersteller eindeutig, deshalb hat
`bauteiltyp` einen eigenen Schlüssel und `UNIQUE (hersteller, teilenummer)`.

**Messwert.** Im ERD hat der Messwert Messgröße und Einheit. Die Einheit folgt aus der
Messgröße (Öltemperatur ist immer °C):

```
messwert_id → messgroesse → einheit
```

Deshalb `messgroesse`. Bei vielen Messwerten (ERD-Entscheidung 7) spart das zusätzlich
Platz.

**Geprüft und kein Verstoß:**

| Verdacht | Warum kein Verstoß |
| --- | --- |
| `kunde`: plz → ort | Keine funktionale Abhängigkeit. Eine Postleitzahl kann mehrere Orte abdecken und ein Ort mehrere Postleitzahlen haben |
| `maschine`: Bezeichnung und Kategorie | stehen nicht in `maschine`, sondern schon im ERD am Maschinentyp |
| `maschinentyp`: kategorie | Die Kategorie bestimmt kein weiteres Attribut. Eine eigene Relation würde nichts auflösen |
| `ausleihe`: kundennummer und inventarnummer | Fremdschlüssel, hängen an der Ausleihe |

### 3.4 Bewusste Kopien sind keine Redundanz

`rechnungsposition` enthält `bezeichnung`, `einzelpreis` und `steuersatz`, obwohl
Bezeichnung und Preis auch in `maschinentyp` oder `verbrauchsmaterial` stehen. Das sieht
wie ein Verstoß aus, ist aber keiner, weil es **verschiedene Fakten** sind:

- `maschinentyp.tagessatz` ist der **heutige** Preis und darf sich ändern.
- `rechnungsposition.einzelpreis` ist der Preis, **zu dem abgerechnet wurde**. Er hängt an
  der Position und ändert sich nie.

ERD-Entscheidungen 4 und 5: Eine Rechnung von 2026 muss 2029 denselben Betrag ergeben
(GoBD). Würde die Rechnung den Preis zur Laufzeit aus den Stammdaten lesen, änderte jede
Preiserhöhung alte Rechnungen. Der Steuersatz steht an der Position, damit eine Rechnung
gemischte Sätze haben kann.

**Empfänger (Antwort 19 vom 11.11.).** Dasselbe gilt für `rechnung.empfaenger_name`,
`empfaenger_strasse`, `empfaenger_plz` und `empfaenger_ort`:

- `kunde.strasse` ist die **heutige** Anschrift und ändert sich beim Umzug.
- `rechnung.empfaenger_strasse` ist die Anschrift, **an die die Rechnung ausgestellt
  wurde**. Sie hängt an der Rechnung und ändert sich nie.

Deshalb gilt auch nicht `kundennummer → empfaenger_strasse`: Zwei Rechnungen desselben
Kunden können verschiedene Anschriften tragen, eine vor und eine nach dem Umzug. Ohne diese
funktionale Abhängigkeit gibt es keine transitive, die 3. NF ist erfüllt.

Warum kopiert und nicht gelesen:

- § 14 Abs. 4 Nr. 1 UStG verlangt den vollständigen Namen und die vollständige Anschrift
  des Leistungsempfängers auf der Rechnung, § 14b UStG ein unversehrtes Doppel über die
  ganze Aufbewahrungsfrist.
- GoBD Rz. 59, Beispiel 4: Wird eine Rechnung aus den **aktuellen** Stammdaten neu
  erzeugt und der Kunde hat sich inzwischen geändert, stimmt sie nicht mehr mit dem
  Original überein. Genau das wäre die Rechnung, die die Anschrift aus `kunde` liest.
- Die Alternative nach GoBD Rz. 76 und 111 wäre eine Adresshistorie mit „gültig ab“ in
  einer eigenen Tabelle, und jede Abfrage bräuchte dann das Rechnungsdatum. Vier Spalten
  sind weniger Aufwand.
- So machen es auch ERP-Systeme: Business Central speichert Name und Anschrift des
  Rechnungsempfängers im Kopf der gebuchten Rechnung (Tabelle „Sales Invoice Header“),
  ERPNext behält an gebuchten Belegen den Adresstext.

Quellen mit Links: [`docs/scrum/entscheidungen.md`](../scrum/entscheidungen.md), Abschnitt
„Empfänger auf der Rechnung“. Wie die Datenbank die Kopie sicherstellt: 4.5.

### 3.5 Was nicht gespeichert wird

Abgeleitete Werte stehen in keiner Tabelle, sie werden beim Lesen berechnet:

- Rechnungsbetrag = Summe über `menge × einzelpreis` je Steuersatz, plus Steuer
- offener Betrag = Rechnungsbetrag − Summe der Zahlungen
- „ist storniert“ = es gibt eine Rechnung, deren `storniert_rechnungsnummer` auf diese zeigt
- „ist ausgebaut“ = es gibt eine Wartungsmaßnahme `getauscht` zu diesem Bauteil

Gespeichert würden sie in der nächsten Änderung auseinanderlaufen.

---

## 4 Zusicherungen in der Datenbank

Was die Datenbank selbst garantiert, auch wenn die Anwendung einen Fehler hat oder zwei
Anfragen gleichzeitig kommen. Jede Zeile hat in `schema-pruefen.sql` einen Fall, der zeigt,
dass die Datenbank ablehnt.

### 4.1 Keine Doppelbuchung (ERD-Entscheidungen 2 und 3)

```sql
CONSTRAINT ausleihe_keine_doppelbuchung EXCLUDE USING gist (
    inventarnummer WITH =,
    daterange(von, bis, '[]') WITH &&
) WHERE (status <> 'storniert')
```

Gelesen: Keine zwei Zeilen mit derselben Maschine (`=`), deren Zeiträume sich überlappen
(`&&`). `'[]'` heißt: von und bis gehören beide dazu, wie in `lib/zeitraum.ts` (der
Rückgabetag bleibt belegt). Stornierte Ausleihen zählen nicht.

**Warum in der Datenbank:** Prüft nur die Anwendung, lesen zwei gleichzeitige Anfragen beide
„frei“ und schreiben dann beide. Die Ausschlussbedingung lässt die zweite scheitern
(Fehlercode `23P01`), egal wie schnell sie kommt. Das ist die Zusicherung, die
[`rollen-und-rechte.md`](../rollen-und-rechte.md) für „first come, first serve“ verlangt.

**Warum Reservierung und Ausleihe eine Tabelle sind:** Eine Ausschlussbedingung gilt
innerhalb einer Tabelle. Bei zwei Tabellen könnte eine Reservierung eine laufende Ausleihe
überlappen, ohne dass die Datenbank es merkt.

Das `=` auf einer Textspalte in einem GiST-Index braucht die Erweiterung `btree_gist`. Sie
gehört zum Lieferumfang von PostgreSQL und ist auch bei Supabase dabei.

### 4.2 Lückenlose Rechnungsnummern (ERD-Entscheidung 6, GoBD)

Eine **Sequenz** (`GENERATED … AS IDENTITY`) reicht für Rechnungsnummern nicht: Sie wird
bei einem Rollback nicht zurückgedreht. Bricht das Anlegen einer Rechnung ab, fehlt die
Nummer für immer. Für Kunden, Ausleihen und Bestellungen ist das egal, für Rechnungen nicht.

Deshalb eine **Zählertabelle** `nummernkreis` mit einer Zeile `rechnung`. Ein Trigger vor
jedem `INSERT` auf `rechnung` zählt sie hoch und setzt die Nummer:

1. Das Hochzählen läuft in derselben Transaktion wie das Anlegen der Rechnung. Bricht die
   Rechnung ab, wird auch das Hochzählen zurückgenommen. Keine Lücke.
2. Das `UPDATE` sperrt die Zeile bis zum Ende der Transaktion. Zwei gleichzeitige
   Rechnungen bekommen ihre Nummern nacheinander. Keine doppelte Nummer.
3. Eine mitgeschickte Nummer wird überschrieben. Die Nummer vergibt nur die Datenbank.

Der Preis: Rechnungen werden nacheinander angelegt, nicht gleichzeitig. Bei einem
Maschinenverleih ist das kein Engpass.

Die Storno-Rechnung bekommt ihre Nummer aus demselben Kreis.

### 4.3 Gebuchte Belege sind unveränderbar (ERD-Entscheidung 6, GoBD)

- **Kein `UPDATE`, kein `DELETE`** auf `rechnung`, `rechnungsposition` und `zahlung`. Ein
  Trigger lehnt beides ab.
- **Korrektur per Storno:** eine neue Rechnung, deren `storniert_rechnungsnummer` auf die
  alte zeigt, mit denselben Positionen und negativer Menge. Die alte bleibt unverändert.
  `UNIQUE` verhindert, dass eine Rechnung zweimal storniert wird.
- **Zahlungen korrigieren** über eine Gegenbuchung mit negativem Betrag.
- **Keine nachgeschobenen Positionen:** Eine Position darf nur in der Transaktion angelegt
  werden, in der ihre Rechnung entstand. Der Trigger vergleicht dazu `rechnung.erfasst_am`
  mit `now()`, das in PostgreSQL die Startzeit der laufenden Transaktion liefert. Sonst
  ließe sich der Betrag einer gebuchten Rechnung durch eine weitere Position still ändern.

**Folge für die Anwendung:** Rechnung und Positionen müssen in **einer** Transaktion
geschrieben werden. Über PostgREST heißt das: eine Datenbankfunktion, die als RPC
aufgerufen wird, nicht zwei REST-Aufrufe nacheinander. Das gehört zur Abrechnung, nicht zu
#45.

### 4.4 Eine Position berechnet genau eines (Antwort 10)

```sql
CHECK (num_nonnulls(ausleihnummer, bestell_id) = 1)
```

`num_nonnulls` zählt die gesetzten Werte. Genau einer muss gesetzt sein: eine Position mit
beidem oder mit keinem lehnt die Datenbank ab.

Die Alternative wäre eine gemeinsame Oberrelation „Vorgang“ für Ausleihe und Bestellung
gewesen. Sie hätte eine Tabelle mehr gebracht, nur damit die Rechnungsposition einen statt
zwei Fremdschlüssel hat.

### 4.5 Empfänger auf der Rechnung, ohne Anschrift keine Rechnung (Antwort 19)

Derselbe Trigger, der die Rechnungsnummer vergibt (`rechnung_nummer_vergeben`, 4.2),
kopiert vor jedem `INSERT` Name, Straße, PLZ und Ort aus `kunde` in die vier
`empfaenger_`-Spalten der Rechnung:

1. **Die Anwendung kann es nicht vergessen** und keinen anderen Empfänger mitschicken:
   mitgeschickte Werte werden überschrieben, wie die Nummer.
2. **Ohne Anschrift keine Rechnung.** Fehlt beim Kunden Straße, PLZ oder Ort, lehnt der
   Trigger die Rechnung ab (Fehlercode `23502`, mit Klartext). Die Spalten sind dazu noch
   `NOT NULL`. Die Nummer wird erst danach gezogen, eine abgelehnte Rechnung kostet also
   keine.
3. **Ein Umzug ändert keine gebuchte Rechnung.** `UPDATE` auf `rechnung` lehnt ohnehin
   der Trigger aus 4.3 ab. Die nächste Rechnung bekommt die neue Anschrift.

Beim Kunden selbst bleibt die Adresse leer erlaubt, weil das Reservierungsformular aus #1
keine abfragt. Spätestens vor der ersten Rechnung muss die Anwendung sie erfassen.

### 4.6 Baujahr und Wartungsintervall der Maschine (#2, Antwort 36)

#2 (Maschinenstammdaten) verlangt Baujahr und Wartungsintervall. Nachgetragen am 12.11.,
mit denselben Regeln wie das Formular (`Maschine.pruefe` in
`maschinen-verwaltung/lib/maschine.ts`):

| Spalte | Typ | Regel in der Datenbank |
| --- | --- | --- |
| `baujahr` | `smallint NOT NULL` | Pflicht. `maschine_baujahr_sinnvoll`: ab 1900, nicht nach dem laufenden Jahr |
| `wartungsintervall` | `integer`, darf `NULL` sein | in ganzen Betriebsstunden, größer als 0. `NULL` heißt: die Maschine hat keins |

- **Warum `NULL` statt 0:** 0 Stunden wäre ein Intervall, das sofort fällig ist. „Kein
  Intervall“ ist etwas anderes, deshalb leer. Das Formular sagt dasselbe.
- **Obergrenze am heutigen Datum:** Die Bedingung liest `current_date`. Sie wird mit der Zeit
  nur weiter, eine einmal gültige Zeile wird also nie ungültig, auch nicht beim
  Wiedereinspielen einer Sicherung. Eine feste Obergrenze wie 2100 ließe Tippfehler durch.
- **Keine neue Abhängigkeit:** Beide Werte gehören zum einzelnen Exemplar, nicht zum Typ.
  Zwei Minibagger desselben Typs können verschiedene Baujahre haben, und das Intervall legt
  der Verleih je Maschine fest. Die 3. NF bleibt erfüllt.

Ob eine Wartung fällig ist (Betriebsstunden seit der letzten Wartung ≥ Intervall), wird
beim Lesen berechnet, wie die Werte in 3.5.

### 4.7 Was die Datenbank nicht prüft

Diese Regeln gelten, die Anwendung muss sie aber selbst durchsetzen. Die Datenbank kann sie
nicht ohne Kopien prüfen, die die Normalform verletzen (siehe 3.2):

| Regel | Warum nicht in der Datenbank |
| --- | --- |
| Rechnung und die berechnete Ausleihe oder Bestellung gehören zum selben Kunden | bräuchte die Kundennummer zusätzlich in der Position |
| Ein Bauteil in einer Wartungsmaßnahme gehört zur Maschine der Wartung | bräuchte die Inventarnummer in `wartungsmassnahme`, verletzt die 2. NF |
| Eine Storno-Rechnung wird nicht selbst storniert | Ein `CHECK` sieht nur die eigene Zeile |
| Eine Rechnung hat mindestens eine Position | bräuchte einen Trigger am Ende der Transaktion; der Aufwand lohnt sich erst mit der Abrechnung |

---

## 5 Abgleich mit dem Code

| Im Code (`maschinen-verwaltung/lib`) | In der Datenbank |
| --- | --- |
| `Reservierung` mit `id` wie `R-0001` | `ausleihe` mit `status = 'reserviert'`, `ausleihnummer` |
| `Zeitraum(von, bis)`, geschlossenes Intervall | `ausleihe.von`, `ausleihe.bis`, `daterange(von, bis, '[]')` |
| `Kunde(name, email, telefon)` | `kunde.name`, `kunde.email`, `kunde.telefon` |
| `Maschine.inventarnummer`, z. B. `M-1001` | `maschine.inventarnummer` (Text, vergibt der Verleih) |
| `Maschine.bezeichnung`, `Maschine.kategorie` | `maschinentyp.bezeichnung`, `maschinentyp.kategorie` |
| `Maschine.standort` | `maschine.standort` |
| `Maschine.baujahr` (#2) | `maschine.baujahr` |
| `Maschine.wartungsintervall` in Betriebsstunden, `null` = keins (#2) | `maschine.wartungsintervall`, `NULL` = keins |

Die Speicher-Umsetzung für PostgreSQL (ADR 0011, `lib/speicher/postgres.ts`) liest
Bezeichnung und Kategorie deshalb über `maschine.typnummer` aus `maschinentyp`.

---

## 6 Nicht Teil dieses Stands

[`rollen-und-rechte.md`](../rollen-und-rechte.md) nennt unter „Für #45 Datenmodell“ vier
weitere Punkte. Seit dem 10.11. kommen sie in ein **eigenes Item** zusammen mit #8, nicht in
#45 (Entscheidung Finn):

- Relationen für Rolle, Recht und Zuordnung (#8)
- ein Ort für die einstellbare Stornofrist `X`
- ein Pflichtfeld für den Grund, wenn nach Ablauf der Frist storniert wird
- ein Protokoll (Audit-Log), abfragbar je Objekt und je Person

Ebenso offen: die Rechte der Datenbank-Rollen (`GRANT` für PostgREST), mit #8 zu klären.
