-- Schema der Maschinenverwaltung, von Hand geschrieben (#45, ergänzt um
-- Benutzer, Rollen, Rechte, Stornofrist und Protokoll in #99).
--
-- Quelle ist das ERD (ERD-Maschinenverwaltung.drawio). Wie aus dem ERD diese
-- Tabellen werden und warum sie in 3. NF sind, steht in relational.md.
-- Kein ORM, kein Auto-Migrate: dieses Skript IST das Schema.
--
-- Läuft auf einer leeren PostgreSQL-Datenbank (geprüft mit PostgreSQL 17 im
-- Supabase-Image, siehe schema-pruefen.ps1). Alles steht in einer
-- Transaktion: bricht eine Anweisung ab, entsteht gar nichts.
--
-- Namen (ERD-Entscheidung 8): Deutsch, kleingeschrieben, Einzahl. Spalten
-- heißen wie die Attribute im ERD, „nr.“ ausgeschrieben als „nummer“,
-- Umlaute als ae/oe/ue. Ein Fremdschlüssel heißt wie der Schlüssel, auf den
-- er zeigt.
--
-- Kein ON DELETE CASCADE: gelöscht wird nur, worauf nichts mehr zeigt.
-- Belege (Rechnung, Rechnungsposition, Zahlung) werden gar nicht gelöscht.

BEGIN;

-- Für die Ausschlussbedingung gegen Doppelbuchung in ausleihe: erlaubt den
-- Vergleich „=“ auf einer Textspalte in einem GiST-Index. Gehört zum
-- Lieferumfang von PostgreSQL (contrib), auch bei Supabase.
CREATE EXTENSION IF NOT EXISTS btree_gist;


-- =====================================================================
-- Kunde
-- =====================================================================

CREATE TABLE kunde (
    kundennummer  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name          text NOT NULL,
    -- Die Adresse aus dem ERD, für die 1. NF in drei Spalten zerlegt.
    -- Leer erlaubt, weil das Reservierungsformular (#1) keine Adresse
    -- abfragt. Ohne sie gibt es aber keine Rechnung (Trigger an rechnung).
    strasse       text,
    plz           text,
    ort           text,
    email         text NOT NULL,
    telefon       text NOT NULL
);


-- =====================================================================
-- Benutzer, Rolle, Recht (#99)
-- =====================================================================

-- Rollen und Rechte stehen als Zeilen in der Datenbank, nicht als Namen im
-- Code (#8: „zur Laufzeit änderbar, ohne Code anzupassen“). Matrix und
-- Entscheidungen: docs/rollen-und-rechte.md, Fassung vom 16.11.2026.
-- „ohne Anmeldung“ ist keine Rolle, sondern ein Besucher ohne Benutzer.

CREATE TABLE rolle (
    rolle        text PRIMARY KEY,                -- z. B. mitarbeiter
    bezeichnung  text NOT NULL UNIQUE,            -- z. B. Mitarbeiter
    CONSTRAINT rolle_schluessel_kleingeschrieben CHECK (rolle ~ '^[a-z_]+$')
);

-- Eine Zeile je Aktion der Matrix. Der Schlüssel heißt objekt.aktion.
CREATE TABLE recht (
    recht        text PRIMARY KEY,                -- z. B. maschine.anlegen
    bezeichnung  text NOT NULL UNIQUE,            -- z. B. Maschine anlegen
    CONSTRAINT recht_schluessel_objekt_punkt_aktion CHECK (recht ~ '^[a-z_]+\.[a-z_]+$')
);

-- Rolle darf Recht, M:N mit dem Umfang. Recht vergeben ist ein INSERT,
-- Recht entziehen ein DELETE, beides ohne Schemaänderung.
--   alle    alle Datensätze
--   eigene  nur die eigenen: benutzer.kundennummer ist die Kundennummer des
--           Datensatzes (Kunde, Ausleihe, Rechnung, Bestellung)
-- „ja, mit Grund“ aus der Matrix ist hier „alle“. Den Grund verlangt der
-- Trigger an ausleihe, nicht das Recht.
CREATE TABLE rolle_recht (
    rolle   text NOT NULL REFERENCES rolle,
    recht   text NOT NULL REFERENCES recht,
    umfang  text NOT NULL DEFAULT 'alle' CHECK (umfang IN ('alle', 'eigene')),
    PRIMARY KEY (rolle, recht)
);

-- Kein Passwort hier, die Anmeldung ist #43. Ob die Benutzer später in
-- Supabase Auth stehen, ist offen (F13). Deshalb eine eigene Tabelle mit
-- einer UUID als Schlüssel, wie in Supabase Auth: Fällt #43 darauf, wird
-- benutzer_id = auth.users.id und bekommt dorthin einen Fremdschlüssel.
--
-- Eine Rolle je Person (F7), deshalb ein Fremdschlüssel und keine Tabelle
-- benutzer_rolle. kundennummer verbindet einen Benutzer der Rolle Kunde mit
-- seinem Kundendatensatz, höchstens einer je Kunde. Leer erlaubt: Personal
-- hat keinen, und ein Kunde legt seinen Kundendatensatz nach dem Konto
-- selbst an (F14). Umgekehrt braucht ein Kunde kein Konto (#1, bis #43).
--
-- Auf einen Benutzer zeigt das Protokoll. Er wird deshalb nicht gelöscht,
-- sondern auf aktiv = false gesetzt.
CREATE TABLE benutzer (
    benutzer_id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email         text NOT NULL,
    name          text NOT NULL,
    aktiv         boolean NOT NULL DEFAULT true,
    kundennummer  bigint UNIQUE REFERENCES kunde,
    rolle         text NOT NULL REFERENCES rolle
);

-- Info@… und info@… sind dasselbe Postfach, also dasselbe Konto. Deshalb
-- ist die E-Mail-Adresse in Kleinschreibung eindeutig.
CREATE UNIQUE INDEX benutzer_email_eindeutig ON benutzer (lower(email));

-- Wer gerade ändert. Bis #43 setzt die Anwendung das je Anfrage in ihrer
-- Transaktion:  SET LOCAL app.benutzer_id = '<uuid>';
-- Nicht gesetzt heißt: nicht angemeldet, das Ergebnis ist NULL. Fällt #43
-- auf Supabase Auth, steht hier  SELECT auth.uid();  und sonst ändert sich
-- nichts. Ein gesetzter Wert, den es in benutzer nicht gibt, lässt jede
-- Änderung am Fremdschlüssel des Protokolls scheitern.
CREATE FUNCTION aktueller_benutzer() RETURNS uuid
LANGUAGE sql STABLE AS $$
    SELECT NULLIF(current_setting('app.benutzer_id', true), '')::uuid;
$$;

INSERT INTO rolle (rolle, bezeichnung) VALUES
    ('kunde',       'Kunde'),
    ('mitarbeiter', 'Mitarbeiter'),
    ('manager',     'Manager'),
    ('owner',       'Owner'),
    ('admin',       'Admin');

-- Die 26 Aktionen der Matrix, in ihrer Reihenfolge.
INSERT INTO recht (recht, bezeichnung) VALUES
    -- Suchen und reservieren (#1)
    ('maschine.suchen',                'Maschinen suchen, freie Zeiträume sehen'),
    ('ausleihe.reservieren',           'Verbindlich reservieren'),
    ('ausleihe.sehen',                 'Reservierungen sehen'),
    ('ausleihe.stornieren',            'Stornieren bis zur Stornofrist'),
    ('ausleihe.stornieren_nach_frist', 'Stornieren nach Ablauf der Frist'),
    -- Auftrag (#9)
    ('ausleihe.status_sehen',          'Auftragsstatus sehen'),
    ('ausleihe.aendern',               'Auftrag ändern, als neuer Eintrag'),
    -- Maschinen (#2, #3)
    ('maschine.liste',                 'Verwaltungsliste mit allen Feldern'),
    ('maschine.anlegen',               'Maschine anlegen'),
    ('maschine.bearbeiten',            'Maschine bearbeiten'),
    ('maschine.ausser_dienst',         'Maschine außer Dienst stellen'),
    ('wartung.sehen',                  'Wartungsübersicht sehen'),
    -- Kunden (#7, #20)
    ('kunde.anlegen',                  'Kunden anlegen'),
    ('kunde.suchen',                   'Kunden suchen'),
    ('kunde.sehen',                    'Kundendaten sehen'),
    ('kunde.bearbeiten',               'Kundendaten bearbeiten'),
    -- Rechnung und Bestellung
    ('rechnung.sehen',                 'Rechnungen sehen'),
    ('rechnung.erstellen',             'Rechnung erstellen'),
    ('rechnung.stornieren',            'Rechnung stornieren, als Storno-Rechnung'),
    ('bestellung.bestellen',           'Verbrauchsmaterial bestellen, Bestellungen sehen'),
    -- Protokoll
    ('protokoll.datensatz',            'Änderungsprotokoll eines Datensatzes'),
    ('protokoll.personen',             'Auswertung über Personen'),
    ('protokoll.abgelehnte_zugriffe',  'Abgelehnte Zugriffe sehen'),
    -- Benutzer und Einstellungen (#8)
    ('benutzer.rolle_zuweisen',        'Rolle zuweisen'),
    ('rolle.rechte_aendern',           'Rechte einer Rolle ändern'),
    ('einstellung.stornofrist',        'Stornofrist einstellen');

-- Die Matrix aus docs/rollen-und-rechte.md, eine Zeile je Aktion wie dort.
-- NULL heißt „nein“ und ergibt keine Zeile. Das gibt 105 Zeilen in
-- rolle_recht, 8 davon mit „eigene“.
INSERT INTO rolle_recht (rolle, recht, umfang)
SELECT r.rolle, m.recht, r.umfang
  FROM (VALUES
    -- recht                           kunde     mitarbeiter manager owner   admin
    ('maschine.suchen',                'alle',   'alle',     'alle', 'alle', 'alle'),
    ('ausleihe.reservieren',           'alle',   'alle',     'alle', 'alle', 'alle'),
    ('ausleihe.sehen',                 'eigene', 'alle',     'alle', 'alle', 'alle'),
    ('ausleihe.stornieren',            'eigene', 'alle',     'alle', 'alle', 'alle'),
    ('ausleihe.stornieren_nach_frist', NULL,     'alle',     'alle', 'alle', 'alle'),
    ('ausleihe.status_sehen',          'eigene', 'alle',     'alle', 'alle', 'alle'),
    ('ausleihe.aendern',               NULL,     'alle',     'alle', 'alle', 'alle'),
    ('maschine.liste',                 NULL,     'alle',     'alle', 'alle', 'alle'),
    ('maschine.anlegen',               NULL,     'alle',     'alle', 'alle', 'alle'),
    ('maschine.bearbeiten',            NULL,     'alle',     'alle', 'alle', 'alle'),
    ('maschine.ausser_dienst',         NULL,     'alle',     'alle', 'alle', 'alle'),
    ('wartung.sehen',                  NULL,     'alle',     'alle', 'alle', 'alle'),
    ('kunde.anlegen',                  'eigene', 'alle',     'alle', 'alle', 'alle'),
    ('kunde.suchen',                   NULL,     'alle',     'alle', 'alle', 'alle'),
    ('kunde.sehen',                    'eigene', 'alle',     'alle', 'alle', 'alle'),
    ('kunde.bearbeiten',               'eigene', 'alle',     'alle', 'alle', 'alle'),
    ('rechnung.sehen',                 'eigene', 'alle',     'alle', 'alle', 'alle'),
    ('rechnung.erstellen',             NULL,     'alle',     'alle', 'alle', 'alle'),
    ('rechnung.stornieren',            NULL,     'alle',     'alle', 'alle', 'alle'),
    ('bestellung.bestellen',           'eigene', 'alle',     'alle', 'alle', 'alle'),
    ('protokoll.datensatz',            NULL,     'alle',     'alle', 'alle', 'alle'),
    ('protokoll.personen',             NULL,     NULL,       'alle', 'alle', 'alle'),
    ('protokoll.abgelehnte_zugriffe',  NULL,     NULL,       NULL,   'alle', 'alle'),
    ('benutzer.rolle_zuweisen',        NULL,     NULL,       NULL,   'alle', 'alle'),
    ('rolle.rechte_aendern',           NULL,     NULL,       NULL,   NULL,   'alle'),
    ('einstellung.stornofrist',        NULL,     NULL,       'alle', 'alle', 'alle')
  ) AS m (recht, kunde, mitarbeiter, manager, owner, admin)
  CROSS JOIN LATERAL (VALUES
    ('kunde', m.kunde), ('mitarbeiter', m.mitarbeiter), ('manager', m.manager),
    ('owner', m.owner), ('admin', m.admin)
  ) AS r (rolle, umfang)
 WHERE r.umfang IS NOT NULL;


-- =====================================================================
-- Einstellungen (#99)
-- =====================================================================

-- Regeln, die die Leitung ändert, ohne dass jemand Code anfasst. Eine Zeile
-- je Einstellung, geändert per UPDATE. Wann und von wem zuletzt, setzt der
-- Trigger.
--
-- stornofrist_tage (F8): ein Wert für alle Maschinen, in ganzen Tagen vor
-- Mietbeginn, Startwert 3. Was er bewirkt: Trigger an ausleihe.
--
-- wert ist Text, damit auch künftige Einstellungen in dieselbe Tabelle
-- passen. Was für einen Schlüssel gültig ist, prüft je ein CHECK.
CREATE TABLE einstellung (
    schluessel     text PRIMARY KEY,
    wert           text NOT NULL,
    geaendert_am   timestamptz NOT NULL,          -- setzt der Trigger
    geaendert_von  uuid REFERENCES benutzer,      -- setzt der Trigger; leer: beim Einrichten
    CONSTRAINT einstellung_stornofrist_ganze_tage
        CHECK (schluessel <> 'stornofrist_tage' OR wert ~ '^[0-9]{1,3}$')
);

CREATE FUNCTION einstellung_aenderung_vermerken() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    NEW.geaendert_am  := now();
    NEW.geaendert_von := aktueller_benutzer();
    RETURN NEW;
END;
$$;

CREATE TRIGGER einstellung_aenderung_vermerken
    BEFORE INSERT OR UPDATE ON einstellung
    FOR EACH ROW EXECUTE FUNCTION einstellung_aenderung_vermerken();

INSERT INTO einstellung (schluessel, wert) VALUES ('stornofrist_tage', '3');


-- =====================================================================
-- Maschine, Maschinentyp, Messwerte
-- =====================================================================

CREATE TABLE maschinentyp (
    typnummer    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bezeichnung  text NOT NULL UNIQUE,            -- z. B. Minibagger 1,8 t
    kategorie    text NOT NULL,                   -- z. B. Erdbewegung
    tagessatz    numeric(10,2) NOT NULL CHECK (tagessatz >= 0)   -- aktueller Preis je Tag, netto
);

-- Baujahr und Wartungsintervall verlangt #2 (Maschinenstammdaten), nachgetragen
-- nach Finns Antwort 36 (12.11.). Die Regeln sind dieselben wie im Formular
-- (Maschine.pruefe in maschinen-verwaltung/lib/maschine.ts):
--   baujahr            Pflicht, ab 1900, nicht nach dem laufenden Jahr
--   wartungsintervall  freiwillig, ganze Betriebsstunden, größer als 0;
--                      NULL heißt: die Maschine hat keins
-- Die Obergrenze hängt am heutigen Datum. Sie wird mit der Zeit nur weiter,
-- eine einmal gültige Zeile wird also nie ungültig, auch nicht beim
-- Wiedereinspielen einer Sicherung.
CREATE TABLE maschine (
    inventarnummer     text PRIMARY KEY,          -- vergibt der Verleih, z. B. M-1001
    typnummer          integer NOT NULL REFERENCES maschinentyp,
    seriennummer       text NOT NULL,
    baujahr            smallint NOT NULL,
    standort           text NOT NULL,
    betriebsstunden    numeric(10,1) NOT NULL DEFAULT 0 CHECK (betriebsstunden >= 0),
    wartungsintervall  integer CHECK (wartungsintervall > 0),   -- in Betriebsstunden
    CONSTRAINT maschine_baujahr_sinnvoll
        CHECK (baujahr >= 1900 AND baujahr <= extract(year FROM current_date))
);

-- ERD-Entscheidung 7: Messwerte in eine eigene Tabelle, nicht in die
-- Stammdaten der Maschine. Die Einheit hängt an der Messgröße, nicht am
-- einzelnen Messwert (3. NF), deshalb eine eigene Tabelle messgroesse.
CREATE TABLE messgroesse (
    messgroesse_id  smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bezeichnung     text NOT NULL UNIQUE,         -- z. B. Öltemperatur
    einheit         text NOT NULL                 -- z. B. °C
);

CREATE TABLE messwert (
    messwert_id     bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    inventarnummer  text NOT NULL REFERENCES maschine,
    messgroesse_id  smallint NOT NULL REFERENCES messgroesse,
    zeitpunkt       timestamptz NOT NULL,
    wert            double precision NOT NULL,
    -- Eine Maschine liefert je Messgröße und Zeitpunkt genau einen Wert.
    -- Der Index dazu dient auch der Abfrage „Verlauf einer Maschine“.
    UNIQUE (inventarnummer, messgroesse_id, zeitpunkt)
);


-- =====================================================================
-- Bauteile und Wartung
-- =====================================================================

-- Antwort 7 (09.11.): Das Bauteil bleibt ein Exemplar je Maschine, weil #3
-- den Verschleiß je Exemplar braucht. Hersteller, Teilenummer und
-- Bezeichnung wiederholen sich aber bei jedem Exemplar desselben Teils. Sie
-- hängen am Teiletyp, nicht am Exemplar (3. NF), deshalb bauteiltyp.
CREATE TABLE bauteiltyp (
    bauteiltyp_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    hersteller     text NOT NULL,
    teilenummer    text NOT NULL,
    bezeichnung    text NOT NULL,
    -- Teilenummern sind nur je Hersteller eindeutig.
    UNIQUE (hersteller, teilenummer)
);

CREATE TABLE bauteil (
    bauteil_id      bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    inventarnummer  text NOT NULL REFERENCES maschine,
    bauteiltyp_id   integer NOT NULL REFERENCES bauteiltyp,
    einbaudatum     date NOT NULL
);

CREATE TABLE wartung (
    wartungsnummer  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    inventarnummer  text NOT NULL REFERENCES maschine,
    datum           date NOT NULL,
    art             text NOT NULL                 -- z. B. Inspektion, Reparatur
);

-- Antwort 8 (09.11.): Wartung bearbeitet Bauteil, M:N mit der Maßnahme.
-- Ein getauschtes Exemplar bleibt als Zeile stehen, das neue Teil ist ein
-- neues Exemplar mit eigenem Einbaudatum.
CREATE TABLE wartungsmassnahme (
    wartungsnummer  bigint NOT NULL REFERENCES wartung,
    bauteil_id      bigint NOT NULL REFERENCES bauteil,
    massnahme       text NOT NULL CHECK (massnahme IN ('geprueft', 'getauscht')),
    PRIMARY KEY (wartungsnummer, bauteil_id)
);


-- =====================================================================
-- Verbrauchsmaterial und Bestellung
-- =====================================================================

CREATE TABLE verbrauchsmaterial (
    verbrauchsmaterial_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bezeichnung            text NOT NULL,
    einheit                text NOT NULL,         -- z. B. Stück, Kanister 5 l
    preis                  numeric(10,2) NOT NULL CHECK (preis >= 0)   -- aktueller Preis, netto
);

-- Antwort 9 (09.11.): Verbrauchsmaterial passt zu Maschinentyp, M:N.
CREATE TABLE passt_zu (
    verbrauchsmaterial_id  integer NOT NULL REFERENCES verbrauchsmaterial,
    typnummer              integer NOT NULL REFERENCES maschinentyp,
    PRIMARY KEY (verbrauchsmaterial_id, typnummer)
);

-- Antwort 11 (09.11.): Kunden bestellen frei, ohne Bezug zu einer Ausleihe.
CREATE TABLE bestellung (
    bestell_id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kundennummer  bigint NOT NULL REFERENCES kunde,
    bestelldatum  date NOT NULL DEFAULT current_date,
    lieferstatus  text NOT NULL DEFAULT 'offen'
                  CHECK (lieferstatus IN ('offen', 'versandt', 'geliefert', 'storniert'))
);

-- Bestellung enthält Verbrauchsmaterial, M:N mit der Menge.
CREATE TABLE bestellposition (
    bestell_id             bigint NOT NULL REFERENCES bestellung,
    verbrauchsmaterial_id  integer NOT NULL REFERENCES verbrauchsmaterial,
    menge                  integer NOT NULL CHECK (menge > 0),
    PRIMARY KEY (bestell_id, verbrauchsmaterial_id)
);


-- =====================================================================
-- Ausleihe
-- =====================================================================

-- ERD-Entscheidung 2: Reservierung und Ausleihe sind eine Tabelle mit
-- Status. Eine Reservierung aus #1 ist eine Ausleihe mit Status
-- „reserviert“. Nur so kann eine einzige Zusicherung beide gegen
-- Doppelbuchung prüfen.
--
-- ERD-Entscheidung 3: Zeitraum als von und bis (date). Geschlossenes
-- Intervall wie in lib/zeitraum.ts: von und bis gehören beide dazu, der
-- Rückgabetag bleibt belegt. Deshalb daterange(von, bis, '[]').
CREATE TABLE ausleihe (
    ausleihnummer   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kundennummer    bigint NOT NULL REFERENCES kunde,
    inventarnummer  text NOT NULL REFERENCES maschine,
    von             date NOT NULL,
    bis             date NOT NULL,
    status          text NOT NULL DEFAULT 'reserviert'
                    CHECK (status IN ('reserviert', 'ausgeliehen', 'zurueckgegeben', 'storniert')),
    -- #99: Wann und von wem storniert wurde, setzt der Trigger unten, den
    -- Grund schickt die Anwendung. Nach Ablauf der Stornofrist ist er Pflicht.
    storniert_am    timestamptz,
    storniert_von   uuid REFERENCES benutzer,     -- leer: nicht angemeldet (bis #43)
    stornogrund     text,
    CONSTRAINT ausleihe_zeitraum_gueltig CHECK (von <= bis),
    -- Status storniert genau dann, wenn storniert_am gesetzt ist. Wer und
    -- warum gibt es nur bei einem Storno, und ein Grund aus Leerzeichen ist
    -- kein Grund.
    CONSTRAINT ausleihe_storniert_genau_mit_zeitpunkt
        CHECK ((status = 'storniert') = (storniert_am IS NOT NULL)),
    CONSTRAINT ausleihe_storno_angaben_nur_bei_storno
        CHECK (status = 'storniert' OR num_nonnulls(storniert_von, stornogrund) = 0),
    CONSTRAINT ausleihe_stornogrund_nicht_leer CHECK (btrim(stornogrund) <> ''),
    -- Keine zwei Ausleihen derselben Maschine mit überlappendem Zeitraum.
    -- Hält auch bei zwei gleichzeitigen Anfragen, an denen eine Prüfung nur
    -- in der Anwendung scheitert. Stornierte Ausleihen geben den Zeitraum frei.
    CONSTRAINT ausleihe_keine_doppelbuchung EXCLUDE USING gist (
        inventarnummer WITH =,
        daterange(von, bis, '[]') WITH &&
    ) WHERE (status <> 'storniert')
);

-- #99, Entscheidung 3 und F8: Storniert wird bis stornofrist_tage vor
-- Mietbeginn ohne Grund, danach nur mit Grund. Gezählt in Kalendertagen,
-- deutsche Zeit. Beispiel mit 3 Tagen: Mietbeginn 20.11., bis einschließlich
-- 17.11. ohne Grund, ab 18.11. nur mit Grund.
--
-- Greift beim Wechsel nach „storniert“. Zeitpunkt und Benutzer setzt der
-- Trigger, mitgeschickte Werte zählen nicht (wie bei der Rechnung). Wer
-- überhaupt stornieren darf, etwa der Kunde nur eigene und nur in der Frist,
-- prüft die Anwendung gegen rolle_recht (#8).
CREATE FUNCTION ausleihe_storno_pruefen() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    frist      integer;
    storno_am  date;
BEGIN
    IF NEW.status <> 'storniert' OR (TG_OP = 'UPDATE' AND OLD.status = 'storniert') THEN
        RETURN NEW;
    END IF;

    SELECT wert::integer INTO frist FROM einstellung WHERE schluessel = 'stornofrist_tage';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Einstellung stornofrist_tage fehlt' USING ERRCODE = 'no_data_found';
    END IF;

    NEW.storniert_am  := now();
    NEW.storniert_von := aktueller_benutzer();
    storno_am := (NEW.storniert_am AT TIME ZONE 'Europe/Berlin')::date;

    IF storno_am > NEW.von - frist AND NULLIF(btrim(NEW.stornogrund), '') IS NULL THEN
        RAISE EXCEPTION 'Ausleihe %: Stornofrist abgelaufen (% Tage vor Mietbeginn am %), Storno nur mit Grund',
            NEW.ausleihnummer, frist, to_char(NEW.von, 'DD.MM.YYYY')
            USING ERRCODE = 'check_violation';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER ausleihe_storno_pruefen
    BEFORE INSERT OR UPDATE ON ausleihe
    FOR EACH ROW EXECUTE FUNCTION ausleihe_storno_pruefen();


-- =====================================================================
-- Abrechnung: Rechnung, Rechnungsposition, Zahlung
-- =====================================================================

-- ERD-Entscheidung 6 und GoBD: Rechnungsnummern fortlaufend und ohne Lücke.
-- Eine Sequenz reicht dafür nicht: sie wird bei einem Rollback nicht
-- zurückgedreht und hinterlässt Lücken. Diese Zählertabelle wird in
-- derselben Transaktion hochgezählt wie die Rechnung angelegt wird.
-- Bricht die Rechnung ab, wird auch das Hochzählen zurückgenommen. Die
-- Zeilensperre beim UPDATE sorgt dafür, dass zwei gleichzeitige Rechnungen
-- nacheinander ihre Nummer bekommen.
CREATE TABLE nummernkreis (
    bezeichnung    text PRIMARY KEY,
    letzte_nummer  bigint NOT NULL CHECK (letzte_nummer >= 0)
);

INSERT INTO nummernkreis (bezeichnung, letzte_nummer) VALUES ('rechnung', 0);

CREATE FUNCTION naechste_nummer(kreis text) RETURNS bigint
LANGUAGE sql AS $$
    UPDATE nummernkreis
       SET letzte_nummer = letzte_nummer + 1
     WHERE bezeichnung = kreis
 RETURNING letzte_nummer;
$$;

-- Eine Storno-Rechnung ist eine eigene Rechnung mit eigener Nummer, die auf
-- die stornierte zeigt (rekursive Beziehung „storniert“ im ERD). Die
-- stornierte Rechnung selbst bleibt unverändert. UNIQUE: jede Rechnung
-- wird höchstens einmal storniert.
--
-- Antwort 19 (11.11.): Name und Anschrift des Empfängers werden beim
-- Ausstellen auf die Rechnung kopiert, wie Preis und Steuersatz auf die
-- Position. § 14 Abs. 4 Nr. 1 UStG verlangt sie auf der Rechnung, und
-- GoBD Rz. 59 Beispiel 4 nennt eine Rechnung, die nach einem Umzug aus den
-- aktuellen Stammdaten neu erzeugt wird, nicht ordnungsgemäß. Die Spalten
-- füllt nur der Trigger unten; NOT NULL heißt: ohne Anschrift keine Rechnung.
CREATE TABLE rechnung (
    rechnungsnummer            bigint PRIMARY KEY,   -- vergibt nur der Trigger unten
    kundennummer               bigint NOT NULL REFERENCES kunde,
    rechnungsdatum             date NOT NULL DEFAULT current_date,
    empfaenger_name            text NOT NULL,        -- Kopie aus kunde, setzt der Trigger
    empfaenger_strasse         text NOT NULL,
    empfaenger_plz             text NOT NULL,
    empfaenger_ort             text NOT NULL,
    storniert_rechnungsnummer  bigint UNIQUE REFERENCES rechnung,
    erfasst_am                 timestamptz NOT NULL  -- setzt der Trigger, siehe rechnungsposition
);

CREATE FUNCTION rechnung_nummer_vergeben() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    k kunde%ROWTYPE;
BEGIN
    -- Empfänger aus kunde kopieren (Antwort 19). Erst prüfen, dann die
    -- Nummer ziehen.
    SELECT * INTO k FROM kunde WHERE kundennummer = NEW.kundennummer;
    IF NOT FOUND THEN
        -- Gleicher Fehlercode wie der Fremdschlüssel, der sonst greifen
        -- würde. Er prüft erst nach diesem Trigger, NOT NULL schon davor.
        RAISE EXCEPTION 'Kunde % gibt es nicht', NEW.kundennummer
            USING ERRCODE = 'foreign_key_violation';
    END IF;
    IF num_nulls(k.strasse, k.plz, k.ort) > 0 THEN
        RAISE EXCEPTION 'Kunde % hat keine vollständige Anschrift: erst Straße, PLZ und Ort erfassen, dann die Rechnung',
            NEW.kundennummer USING ERRCODE = 'not_null_violation';
    END IF;

    -- Mitgeschickte Werte für Empfänger, Nummer und Zeit werden überschrieben.
    NEW.empfaenger_name    := k.name;
    NEW.empfaenger_strasse := k.strasse;
    NEW.empfaenger_plz     := k.plz;
    NEW.empfaenger_ort     := k.ort;
    NEW.rechnungsnummer    := naechste_nummer('rechnung');
    NEW.erfasst_am         := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER rechnung_nummer_vergeben
    BEFORE INSERT ON rechnung
    FOR EACH ROW EXECUTE FUNCTION rechnung_nummer_vergeben();

-- Schwache Entität: identifiziert über die Rechnung und die Positionsnummer.
--
-- ERD-Entscheidungen 4 und 5: Bezeichnung, Einzelpreis und Steuersatz werden
-- beim Erstellen auf die Position kopiert, nicht zur Laufzeit aus
-- maschinentyp oder verbrauchsmaterial gelesen. Eine Rechnung von 2026 muss
-- 2029 denselben Betrag ergeben, auch wenn sich der Tagessatz geändert hat.
--
-- Antwort 10 (09.11.): Eine Position berechnet genau eines von beidem, eine
-- Ausleihe oder eine Bestellung. Zwei Fremdschlüssel, von denen genau einer
-- gesetzt ist.
CREATE TABLE rechnungsposition (
    rechnungsnummer  bigint NOT NULL REFERENCES rechnung,
    positionsnummer  smallint NOT NULL CHECK (positionsnummer > 0),
    bezeichnung      text NOT NULL,
    menge            numeric(10,2) NOT NULL CHECK (menge <> 0),   -- negativ in einer Storno-Rechnung
    einzelpreis      numeric(10,2) NOT NULL CHECK (einzelpreis >= 0),   -- netto
    steuersatz       numeric(4,2) NOT NULL CHECK (steuersatz >= 0),     -- in Prozent, z. B. 19.00
    ausleihnummer    bigint REFERENCES ausleihe,
    bestell_id       bigint REFERENCES bestellung,
    PRIMARY KEY (rechnungsnummer, positionsnummer),
    CONSTRAINT rechnungsposition_genau_eine_herkunft
        CHECK (num_nonnulls(ausleihnummer, bestell_id) = 1)
);

-- Positionen nur zusammen mit ihrer Rechnung, in derselben Transaktion.
-- now() ist in PostgreSQL die Startzeit der Transaktion. Stimmt sie nicht
-- mit erfasst_am der Rechnung überein, ist die Rechnung schon gebucht, und
-- eine neue Position würde ihren Betrag still ändern.
CREATE FUNCTION rechnungsposition_nur_mit_rechnung() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM rechnung
                WHERE rechnungsnummer = NEW.rechnungsnummer
                  AND erfasst_am <> now()) THEN
        RAISE EXCEPTION 'Rechnung % ist gebucht: Positionen nur zusammen mit der Rechnung anlegen, Korrekturen per Storno',
            NEW.rechnungsnummer;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER rechnungsposition_nur_mit_rechnung
    BEFORE INSERT ON rechnungsposition
    FOR EACH ROW EXECUTE FUNCTION rechnungsposition_nur_mit_rechnung();

CREATE TABLE zahlung (
    zahlungs_id      bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rechnungsnummer  bigint NOT NULL REFERENCES rechnung,
    betrag           numeric(10,2) NOT NULL CHECK (betrag <> 0),   -- negativ: Erstattung
    zahldatum        date NOT NULL
);

-- ERD-Entscheidung 6 und GoBD: gebuchte Belege werden nie geändert oder
-- gelöscht. Korrektur nur über eine Storno-Rechnung oder eine
-- Gegenbuchung (negative Zahlung).
CREATE FUNCTION beleg_unveraenderbar() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    RAISE EXCEPTION '% auf %: gebuchte Belege werden nicht geändert oder gelöscht, sondern storniert (GoBD)',
        TG_OP, TG_TABLE_NAME;
END;
$$;

CREATE TRIGGER rechnung_unveraenderbar
    BEFORE UPDATE OR DELETE ON rechnung
    FOR EACH ROW EXECUTE FUNCTION beleg_unveraenderbar();

CREATE TRIGGER rechnungsposition_unveraenderbar
    BEFORE UPDATE OR DELETE ON rechnungsposition
    FOR EACH ROW EXECUTE FUNCTION beleg_unveraenderbar();

CREATE TRIGGER zahlung_unveraenderbar
    BEFORE UPDATE OR DELETE ON zahlung
    FOR EACH ROW EXECUTE FUNCTION beleg_unveraenderbar();


-- =====================================================================
-- Protokoll (#99)
-- =====================================================================

-- Änderungsprotokoll für Maschine (#2), Ausleihe (#9), Kunde (#7) sowie
-- Rechnung und Bestellung (F12). Felder wie lib/protokoll.ts: Zeitpunkt,
-- Benutzer, Feld, alter und neuer Wert, dazu Objekt und Schlüssel, damit es
-- je Objekt abfragbar ist.
--
-- objekt_id ist bewusst kein Fremdschlüssel: Das Protokoll muss sein Objekt
-- überleben, auch das Löschen. Es zeigt auf fünf Tabellen mit verschiedenen
-- Schlüsseltypen, deshalb als Text (M-1001, 42).
--
-- Eine Zeile je geändertem Feld, feld ist der Spaltenname. Beim Anlegen eine
-- Zeile „Datensatz angelegt“ wie in lib/protokoll.ts, beim Löschen
-- „Datensatz gelöscht“ mit dem ganzen alten Datensatz als JSON in alt. NULL
-- in alt oder neu heißt: kein Wert.
CREATE TABLE protokoll (
    protokoll_id  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    zeitpunkt     timestamptz NOT NULL DEFAULT now(),
    benutzer_id   uuid REFERENCES benutzer,      -- leer: nicht angemeldet (bis #43)
    objekt        text NOT NULL
                  CHECK (objekt IN ('maschine', 'ausleihe', 'kunde', 'rechnung', 'bestellung')),
    objekt_id     text NOT NULL,
    feld          text NOT NULL,
    alt           text,
    neu           text
);

-- Ein Trigger für alle fünf Tabellen, das Argument ist der Name der
-- Schlüsselspalte. AFTER, damit vergebene Werte wie die Rechnungsnummer
-- schon feststehen. Bricht die Änderung ab, verschwindet auch der Eintrag.
CREATE FUNCTION protokollieren() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    schluessel  text := TG_ARGV[0];
    wer         uuid := aktueller_benutzer();
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO protokoll (benutzer_id, objekt, objekt_id, feld)
        VALUES (wer, TG_TABLE_NAME, to_jsonb(NEW) ->> schluessel, 'Datensatz angelegt');
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO protokoll (benutzer_id, objekt, objekt_id, feld, alt, neu)
        SELECT wer, TG_TABLE_NAME, to_jsonb(NEW) ->> schluessel, n.key, a.value, n.value
          FROM jsonb_each_text(to_jsonb(NEW)) AS n
          JOIN jsonb_each_text(to_jsonb(OLD)) AS a ON a.key = n.key
         WHERE n.value IS DISTINCT FROM a.value
         ORDER BY n.key;
    ELSE
        INSERT INTO protokoll (benutzer_id, objekt, objekt_id, feld, alt)
        VALUES (wer, TG_TABLE_NAME, to_jsonb(OLD) ->> schluessel, 'Datensatz gelöscht', to_jsonb(OLD)::text);
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER maschine_protokollieren
    AFTER INSERT OR UPDATE OR DELETE ON maschine
    FOR EACH ROW EXECUTE FUNCTION protokollieren('inventarnummer');

CREATE TRIGGER ausleihe_protokollieren
    AFTER INSERT OR UPDATE OR DELETE ON ausleihe
    FOR EACH ROW EXECUTE FUNCTION protokollieren('ausleihnummer');

CREATE TRIGGER kunde_protokollieren
    AFTER INSERT OR UPDATE OR DELETE ON kunde
    FOR EACH ROW EXECUTE FUNCTION protokollieren('kundennummer');

-- Eine Rechnung wird nie geändert (4.3). Im Protokoll steht deshalb nur,
-- wann und von wem sie angelegt wurde, auch bei einer Storno-Rechnung.
CREATE TRIGGER rechnung_protokollieren
    AFTER INSERT OR UPDATE OR DELETE ON rechnung
    FOR EACH ROW EXECUTE FUNCTION protokollieren('rechnungsnummer');

CREATE TRIGGER bestellung_protokollieren
    AFTER INSERT OR UPDATE OR DELETE ON bestellung
    FOR EACH ROW EXECUTE FUNCTION protokollieren('bestell_id');

-- Wie bei den Belegen: Ein Protokoll, in dem man nachträglich schreiben
-- kann, belegt nichts.
CREATE FUNCTION protokoll_unveraenderbar() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    RAISE EXCEPTION '% auf protokoll: Protokolleinträge werden nicht geändert oder gelöscht', TG_OP;
END;
$$;

CREATE TRIGGER protokoll_unveraenderbar
    BEFORE UPDATE OR DELETE ON protokoll
    FOR EACH ROW EXECUTE FUNCTION protokoll_unveraenderbar();

-- Abfragbar je Objekt (Verlauf eines Datensatzes, Mockup 09) und je
-- Benutzer (Auswertung über Personen, Entscheidung 4). Nach Zeit sortiert
-- lesen, auch die neuesten zuerst, geht mit demselben Index.
CREATE INDEX protokoll_je_objekt ON protokoll (objekt, objekt_id, zeitpunkt);
CREATE INDEX protokoll_je_benutzer ON protokoll (benutzer_id, zeitpunkt);


-- =====================================================================
-- Indizes auf Fremdschlüsseln
-- =====================================================================
-- PostgreSQL legt für Fremdschlüssel keinen Index an. Ohne ihn liest jede
-- Abfrage „alle Ausleihen eines Kunden“ die ganze Tabelle. Wo der
-- Fremdschlüssel schon vorn in einem Primärschlüssel, UNIQUE oder in der
-- Ausschlussbedingung steht, gibt es den Index bereits.

CREATE INDEX ON maschine (typnummer);
CREATE INDEX ON bauteil (inventarnummer);
CREATE INDEX ON bauteil (bauteiltyp_id);
CREATE INDEX ON wartung (inventarnummer);
CREATE INDEX ON wartungsmassnahme (bauteil_id);
CREATE INDEX ON passt_zu (typnummer);
CREATE INDEX ON bestellung (kundennummer);
CREATE INDEX ON bestellposition (verbrauchsmaterial_id);
CREATE INDEX ON ausleihe (kundennummer);
CREATE INDEX ON rechnung (kundennummer);
CREATE INDEX ON rechnungsposition (ausleihnummer) WHERE ausleihnummer IS NOT NULL;
CREATE INDEX ON rechnungsposition (bestell_id) WHERE bestell_id IS NOT NULL;
CREATE INDEX ON zahlung (rechnungsnummer);
CREATE INDEX ON benutzer (rolle);
CREATE INDEX ON rolle_recht (recht);
CREATE INDEX ON einstellung (geaendert_von);
CREATE INDEX ON ausleihe (storniert_von) WHERE storniert_von IS NOT NULL;

COMMIT;
