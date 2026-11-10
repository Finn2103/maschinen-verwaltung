-- Prüft die Zusicherungen aus schema.sql (#45).
--
-- Läuft NACH schema.sql auf derselben, sonst leeren Datenbank. Jeder Fall
-- meldet „ok: …“. Wird eine Zusicherung nicht eingehalten, bricht das
-- Skript mit „FEHLT“ oder „FALSCH“ ab. Aufruf: schema-pruefen.ps1.
--
-- Die Testdaten sind erfunden und bleiben nur in der Wegwerf-Datenbank.

\set ON_ERROR_STOP on
\set QUIET on
SET client_min_messages = notice;
\set VERBOSITY terse

-- Hilfsfunktionen nur für diese Sitzung (Schema pg_temp, verschwinden danach).

-- Führt eine Anweisung aus und erwartet, dass die Datenbank sie mit einem
-- bestimmten Fehlercode (SQLSTATE) ablehnt.
CREATE FUNCTION pg_temp.erwarte_fehler(anweisung text, erwartet text, fall text)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
    durchgelaufen boolean := false;
BEGIN
    BEGIN
        EXECUTE anweisung;
        durchgelaufen := true;
    EXCEPTION WHEN OTHERS THEN
        IF SQLSTATE <> erwartet THEN
            RAISE EXCEPTION 'FALSCH: % – erwartet %, bekommen % (%)', fall, erwartet, SQLSTATE, SQLERRM;
        END IF;
        RAISE NOTICE 'ok: % – abgelehnt (%: %)', fall, SQLSTATE, SQLERRM;
    END;
    IF durchgelaufen THEN
        RAISE EXCEPTION 'FEHLT: % – lief durch, erwartet war Fehler %', fall, erwartet;
    END IF;
END;
$$;

CREATE FUNCTION pg_temp.abschnitt(titel text)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
    RAISE NOTICE '--- %', titel;
END;
$$;

CREATE FUNCTION pg_temp.pruefe(bedingung boolean, fall text)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
    IF bedingung IS NOT TRUE THEN
        RAISE EXCEPTION 'FEHLT: %', fall;
    END IF;
    RAISE NOTICE 'ok: %', fall;
END;
$$;

-- Ab hier gehen Abfrageergebnisse ins Leere, sichtbar sind nur die Meldungen.
\o /dev/null

SELECT pg_temp.abschnitt('Stammdaten');
INSERT INTO maschinentyp (bezeichnung, kategorie, tagessatz)
VALUES ('Minibagger 1,8 t', 'Erdbewegung', 89.00);
INSERT INTO maschine (inventarnummer, typnummer, seriennummer, standort)
VALUES ('M-1001', 1, 'SN-4711', 'Köln'),
       ('M-1002', 1, 'SN-4712', 'Bonn');
INSERT INTO kunde (name, email, telefon)
VALUES ('Muster Bau GmbH', 'info@muster-bau.example', '0221 000000');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO maschinentyp (bezeichnung, kategorie, tagessatz) VALUES ('Radlader', 'Erdbewegung', -1)$$,
    '23514', 'negativer Tagessatz');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO kunde (name, email) VALUES ('Ohne Telefon', 'x@example.org')$$,
    '23502', 'Kunde ohne Telefonnummer');

SELECT pg_temp.abschnitt('Ausleihe: keine Doppelbuchung (ERD-Entscheidungen 2 und 3)');
-- Wie M-1001 in lib/maschinen.ts: belegt vom 24. bis 28.09.
INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis)
VALUES (1, 'M-1001', '2026-09-24', '2026-09-28')
RETURNING ausleihnummer AS erste_ausleihe \gset
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis) VALUES (1, 'M-1001', '2026-09-28', '2026-09-30')$$,
    '23P01', 'Rückgabetag 28.09. ist noch belegt');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis) VALUES (1, 'M-1001', '2026-09-20', '2026-10-05')$$,
    '23P01', 'Zeitraum umschließt eine Belegung');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis) VALUES (1, 'M-1001', '2026-09-26', '2026-09-26')$$,
    '23P01', 'einzelner Tag mitten in einer Belegung');
INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis)
VALUES (1, 'M-1001', '2026-09-29', '2026-09-30');
SELECT pg_temp.pruefe(true, 'Tag nach der Rückgabe (29.09.) ist frei');
INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis, status)
VALUES (1, 'M-1002', '2026-09-24', '2026-09-28', 'ausgeliehen')
RETURNING ausleihnummer AS ausleihe_m1002 \gset
SELECT pg_temp.pruefe(true, 'andere Maschine im selben Zeitraum ist frei');
UPDATE ausleihe SET status = 'storniert' WHERE ausleihnummer = :erste_ausleihe;
INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis)
VALUES (1, 'M-1001', '2026-09-24', '2026-09-28');
SELECT pg_temp.pruefe(true, 'stornierte Ausleihe gibt den Zeitraum frei');
SELECT pg_temp.erwarte_fehler(
    format($$UPDATE ausleihe SET status = 'reserviert' WHERE ausleihnummer = %s$$, :erste_ausleihe),
    '23P01', 'Storno zurücknehmen, wenn der Zeitraum inzwischen vergeben ist');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis) VALUES (1, 'M-1002', '2026-11-10', '2026-11-01')$$,
    '23514', 'bis liegt vor von');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis, status) VALUES (1, 'M-1002', '2026-12-01', '2026-12-02', 'verloren')$$,
    '23514', 'unbekannter Status');

SELECT pg_temp.abschnitt('Bestellung und Verbrauchsmaterial');
INSERT INTO verbrauchsmaterial (bezeichnung, einheit, preis)
VALUES ('Hydrauliköl HLP 46', 'Kanister 5 l', 39.90);
INSERT INTO passt_zu (verbrauchsmaterial_id, typnummer) VALUES (1, 1);
INSERT INTO bestellung (kundennummer) VALUES (1)
RETURNING bestell_id AS bestellung \gset
INSERT INTO bestellposition (bestell_id, verbrauchsmaterial_id, menge) VALUES (:bestellung, 1, 2);
SELECT pg_temp.erwarte_fehler(
    format($$INSERT INTO bestellposition (bestell_id, verbrauchsmaterial_id, menge) VALUES (%s, 1, 1)$$, :bestellung),
    '23505', 'dasselbe Material zweimal in einer Bestellung');
SELECT pg_temp.erwarte_fehler(
    format($$INSERT INTO bestellposition (bestell_id, verbrauchsmaterial_id, menge) VALUES (%s, 2, 0)$$, :bestellung),
    '23514', 'Menge 0 in einer Bestellung');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO bestellung (kundennummer, lieferstatus) VALUES (1, 'unterwegs')$$,
    '23514', 'unbekannter Lieferstatus');

SELECT pg_temp.abschnitt('Rechnungsnummern lückenlos (ERD-Entscheidung 6, GoBD)');
INSERT INTO rechnung (kundennummer) VALUES (1);
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO rechnung (kundennummer) VALUES (999)$$,
    '23503', 'Rechnung an unbekannten Kunden bricht ab');
INSERT INTO rechnung (rechnungsnummer, kundennummer) VALUES (500, 1);
SELECT pg_temp.pruefe(
    (SELECT array_agg(rechnungsnummer ORDER BY rechnungsnummer) FROM rechnung) = '{1,2}',
    'Nummern 1 und 2: die abgebrochene Rechnung hinterlässt keine Lücke, die vorgegebene 500 wird überschrieben');

SELECT pg_temp.abschnitt('Rechnung mit Positionen in einer Transaktion (Antwort 10)');
BEGIN;
INSERT INTO rechnung (kundennummer) VALUES (1)
RETURNING rechnungsnummer AS rechnung_a \gset
INSERT INTO rechnungsposition
    (rechnungsnummer, positionsnummer, bezeichnung, menge, einzelpreis, steuersatz, ausleihnummer)
VALUES (:rechnung_a, 1, 'Minibagger 1,8 t, M-1002, 24.–28.09.2026', 5, 89.00, 19.00, :ausleihe_m1002);
INSERT INTO rechnungsposition
    (rechnungsnummer, positionsnummer, bezeichnung, menge, einzelpreis, steuersatz, bestell_id)
VALUES (:rechnung_a, 2, 'Hydrauliköl HLP 46, Kanister 5 l', 2, 39.90, 19.00, :bestellung);
SELECT pg_temp.erwarte_fehler(
    format($$INSERT INTO rechnungsposition (rechnungsnummer, positionsnummer, bezeichnung, menge, einzelpreis, steuersatz, ausleihnummer, bestell_id)
             VALUES (%s, 3, 'beides', 1, 1, 19, %s, %s)$$, :rechnung_a, :ausleihe_m1002, :bestellung),
    '23514', 'Position mit Ausleihe UND Bestellung');
SELECT pg_temp.erwarte_fehler(
    format($$INSERT INTO rechnungsposition (rechnungsnummer, positionsnummer, bezeichnung, menge, einzelpreis, steuersatz)
             VALUES (%s, 3, 'nichts', 1, 1, 19)$$, :rechnung_a),
    '23514', 'Position ohne Ausleihe und ohne Bestellung');
COMMIT;
SELECT pg_temp.pruefe(
    (SELECT count(*) FROM rechnungsposition WHERE rechnungsnummer = :rechnung_a) = 2,
    'Rechnung mit einer Position aus Ausleihe und einer aus Bestellung gebucht');

SELECT pg_temp.abschnitt('Gebuchte Belege sind unveränderbar (ERD-Entscheidung 6, GoBD)');
SELECT pg_temp.erwarte_fehler(
    format($$INSERT INTO rechnungsposition (rechnungsnummer, positionsnummer, bezeichnung, menge, einzelpreis, steuersatz, ausleihnummer)
             VALUES (%s, 3, 'nachgeschoben', 1, 10, 19, %s)$$, :rechnung_a, :ausleihe_m1002),
    'P0001', 'Position nachträglich an eine gebuchte Rechnung hängen');
SELECT pg_temp.erwarte_fehler(
    format($$UPDATE rechnungsposition SET einzelpreis = 79.00 WHERE rechnungsnummer = %s$$, :rechnung_a),
    'P0001', 'Preis einer gebuchten Position ändern');
SELECT pg_temp.erwarte_fehler(
    format($$UPDATE rechnung SET rechnungsdatum = '2026-01-01' WHERE rechnungsnummer = %s$$, :rechnung_a),
    'P0001', 'Datum einer gebuchten Rechnung ändern');
SELECT pg_temp.erwarte_fehler(
    format($$DELETE FROM rechnung WHERE rechnungsnummer = %s$$, :rechnung_a),
    'P0001', 'gebuchte Rechnung löschen');

SELECT pg_temp.abschnitt('Storno statt Änderung');
BEGIN;
INSERT INTO rechnung (kundennummer, storniert_rechnungsnummer) VALUES (1, :rechnung_a)
RETURNING rechnungsnummer AS storno \gset
INSERT INTO rechnungsposition
    (rechnungsnummer, positionsnummer, bezeichnung, menge, einzelpreis, steuersatz, ausleihnummer)
VALUES (:storno, 1, 'Storno zu Rechnung ' || :rechnung_a || ', Position 1', -5, 89.00, 19.00, :ausleihe_m1002);
INSERT INTO rechnungsposition
    (rechnungsnummer, positionsnummer, bezeichnung, menge, einzelpreis, steuersatz, bestell_id)
VALUES (:storno, 2, 'Storno zu Rechnung ' || :rechnung_a || ', Position 2', -2, 39.90, 19.00, :bestellung);
COMMIT;
SELECT pg_temp.pruefe(:storno = :rechnung_a + 1, 'Storno-Rechnung bekommt die nächste Nummer im selben Kreis');
SELECT pg_temp.erwarte_fehler(
    format($$INSERT INTO rechnung (kundennummer, storniert_rechnungsnummer) VALUES (1, %s)$$, :rechnung_a),
    '23505', 'dieselbe Rechnung ein zweites Mal stornieren');

SELECT pg_temp.abschnitt('Zahlung');
INSERT INTO zahlung (rechnungsnummer, betrag, zahldatum) VALUES (:rechnung_a, 624.52, '2026-10-05');
INSERT INTO zahlung (rechnungsnummer, betrag, zahldatum) VALUES (:rechnung_a, -624.52, '2026-10-20');
SELECT pg_temp.pruefe(true, 'Zahlung und Erstattung als Gegenbuchung');
SELECT pg_temp.erwarte_fehler(
    $$UPDATE zahlung SET betrag = 1$$,
    'P0001', 'Zahlung nachträglich ändern');
SELECT pg_temp.erwarte_fehler(
    $$DELETE FROM zahlung$$,
    'P0001', 'Zahlung löschen');
SELECT pg_temp.erwarte_fehler(
    format($$INSERT INTO zahlung (rechnungsnummer, betrag, zahldatum) VALUES (%s, 0, '2026-10-21')$$, :rechnung_a),
    '23514', 'Zahlung über 0 €');

SELECT pg_temp.abschnitt('Bauteil, Wartung, Messwert');
INSERT INTO bauteiltyp (hersteller, teilenummer, bezeichnung) VALUES ('Beispielwerk', 'HF-100', 'Hydraulikfilter');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO bauteiltyp (hersteller, teilenummer, bezeichnung) VALUES ('Beispielwerk', 'HF-100', 'doppelt')$$,
    '23505', 'Teilenummer je Hersteller nur einmal');
INSERT INTO bauteiltyp (hersteller, teilenummer, bezeichnung) VALUES ('Anderes Werk', 'HF-100', 'Hydraulikfilter');
SELECT pg_temp.pruefe(true, 'gleiche Teilenummer bei anderem Hersteller ist erlaubt');
INSERT INTO bauteil (inventarnummer, bauteiltyp_id, einbaudatum)
VALUES ('M-1001', 1, '2026-03-01')
RETURNING bauteil_id AS altes_teil \gset
INSERT INTO wartung (inventarnummer, datum, art) VALUES ('M-1001', '2026-10-01', 'Inspektion')
RETURNING wartungsnummer AS wartung \gset
INSERT INTO wartungsmassnahme (wartungsnummer, bauteil_id, massnahme) VALUES (:wartung, :altes_teil, 'getauscht');
INSERT INTO bauteil (inventarnummer, bauteiltyp_id, einbaudatum) VALUES ('M-1001', 1, '2026-10-01');
SELECT pg_temp.pruefe(
    (SELECT count(*) FROM bauteil WHERE inventarnummer = 'M-1001') = 2,
    'getauschtes Teil bleibt als Exemplar stehen, das neue kommt dazu');
SELECT pg_temp.erwarte_fehler(
    format($$INSERT INTO wartungsmassnahme (wartungsnummer, bauteil_id, massnahme) VALUES (%s, %s, 'geprueft')$$, :wartung, :altes_teil),
    '23505', 'dasselbe Bauteil zweimal in einer Wartung');
SELECT pg_temp.erwarte_fehler(
    format($$INSERT INTO wartungsmassnahme (wartungsnummer, bauteil_id, massnahme) VALUES (%s, %s + 1, 'repariert')$$, :wartung, :altes_teil),
    '23514', 'unbekannte Maßnahme');
INSERT INTO messgroesse (bezeichnung, einheit) VALUES ('Öltemperatur', '°C');
INSERT INTO messwert (inventarnummer, messgroesse_id, zeitpunkt, wert)
VALUES ('M-1001', 1, '2026-10-01 10:00+02', 87.5);
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO messwert (inventarnummer, messgroesse_id, zeitpunkt, wert) VALUES ('M-1001', 1, '2026-10-01 10:00+02', 88.0)$$,
    '23505', 'zwei Werte derselben Messgröße zum selben Zeitpunkt');
SELECT pg_temp.erwarte_fehler(
    $$DELETE FROM maschine WHERE inventarnummer = 'M-1001'$$,
    '23503', 'Maschine mit Ausleihen, Bauteilen und Messwerten löschen');

SELECT pg_temp.abschnitt('Überblick');
\o
\set QUIET off
SELECT count(*) AS tabellen
  FROM information_schema.tables
 WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
SELECT conrelid::regclass AS tabelle, conname AS zusicherung
  FROM pg_constraint
 WHERE connamespace = 'public'::regnamespace AND contype IN ('c', 'x')
 ORDER BY 1, 2;
