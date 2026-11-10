-- Schema der Maschinenverwaltung, von Hand geschrieben (#45).
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
    -- abfragt. Spätestens vor der ersten Rechnung muss sie da sein.
    strasse       text,
    plz           text,
    ort           text,
    email         text NOT NULL,
    telefon       text NOT NULL
);


-- =====================================================================
-- Maschine, Maschinentyp, Messwerte
-- =====================================================================

CREATE TABLE maschinentyp (
    typnummer    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bezeichnung  text NOT NULL UNIQUE,            -- z. B. Minibagger 1,8 t
    kategorie    text NOT NULL,                   -- z. B. Erdbewegung
    tagessatz    numeric(10,2) NOT NULL CHECK (tagessatz >= 0)   -- aktueller Preis je Tag, netto
);

CREATE TABLE maschine (
    inventarnummer   text PRIMARY KEY,            -- vergibt der Verleih, z. B. M-1001
    typnummer        integer NOT NULL REFERENCES maschinentyp,
    seriennummer     text NOT NULL,
    standort         text NOT NULL,
    betriebsstunden  numeric(10,1) NOT NULL DEFAULT 0 CHECK (betriebsstunden >= 0)
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
    CONSTRAINT ausleihe_zeitraum_gueltig CHECK (von <= bis),
    -- Keine zwei Ausleihen derselben Maschine mit überlappendem Zeitraum.
    -- Hält auch bei zwei gleichzeitigen Anfragen, an denen eine Prüfung nur
    -- in der Anwendung scheitert. Stornierte Ausleihen geben den Zeitraum frei.
    CONSTRAINT ausleihe_keine_doppelbuchung EXCLUDE USING gist (
        inventarnummer WITH =,
        daterange(von, bis, '[]') WITH &&
    ) WHERE (status <> 'storniert')
);


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
CREATE TABLE rechnung (
    rechnungsnummer            bigint PRIMARY KEY,   -- vergibt nur der Trigger unten
    kundennummer               bigint NOT NULL REFERENCES kunde,
    rechnungsdatum             date NOT NULL DEFAULT current_date,
    storniert_rechnungsnummer  bigint UNIQUE REFERENCES rechnung,
    erfasst_am                 timestamptz NOT NULL  -- setzt der Trigger, siehe rechnungsposition
);

CREATE FUNCTION rechnung_nummer_vergeben() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    -- Eine mitgeschickte Nummer oder Zeit wird überschrieben.
    NEW.rechnungsnummer := naechste_nummer('rechnung');
    NEW.erfasst_am := now();
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

COMMIT;
