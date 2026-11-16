-- Prüft die Zusicherungen aus schema.sql (#45, #99).
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

-- Der Ausführungsplan einer Abfrage als Text, um zu zeigen, welchen Index
-- sie benutzt.
CREATE FUNCTION pg_temp.plan(abfrage text)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
    zeile text;
    plan  text := '';
BEGIN
    FOR zeile IN EXECUTE 'EXPLAIN ' || abfrage LOOP
        plan := plan || zeile || E'\n';
    END LOOP;
    RETURN plan;
END;
$$;

-- Ab hier gehen Abfrageergebnisse ins Leere, sichtbar sind nur die Meldungen.
\o /dev/null

SELECT pg_temp.abschnitt('Rollen und Rechte (#99, Matrix vom 16.11.)');
SELECT pg_temp.pruefe((SELECT count(*) FROM rolle) = 5, 'fünf Rollen als Zeilen, nicht als Namen im Code (F1, F2)');
SELECT pg_temp.pruefe((SELECT count(*) FROM recht) = 26, '26 Rechte, eins je Aktion der Matrix');
SELECT pg_temp.pruefe(
    (SELECT count(*) FROM rolle_recht) = 105
    AND (SELECT count(*) FROM rolle_recht WHERE umfang = 'eigene') = 8,
    'Matrix: 105 vergebene Rechte, davon 8 mit Umfang „eigene“');
SELECT pg_temp.pruefe(
    (SELECT array_agg(recht ORDER BY recht) FROM rolle_recht WHERE rolle = 'kunde' AND umfang = 'eigene')
    = '{ausleihe.sehen,ausleihe.status_sehen,ausleihe.stornieren,bestellung.bestellen,kunde.anlegen,kunde.bearbeiten,kunde.sehen,rechnung.sehen}',
    'Kunde: nur eigene Ausleihen, Rechnungen, Bestellungen und Kundendaten (F10, F14)');
SELECT pg_temp.pruefe(
    (SELECT array_agg(recht ORDER BY recht) FROM (
        SELECT recht FROM rolle_recht WHERE rolle = 'owner'
        EXCEPT SELECT recht FROM rolle_recht WHERE rolle = 'manager') AS nur_owner)
    = '{benutzer.rolle_zuweisen,protokoll.abgelehnte_zugriffe}'
    AND NOT EXISTS (SELECT recht FROM rolle_recht WHERE rolle = 'manager'
                    EXCEPT SELECT recht FROM rolle_recht WHERE rolle = 'owner'),
    'Owner ist eine eigene Rolle: zwei Rechte mehr als der Manager (F2)');
SELECT pg_temp.pruefe((SELECT count(*) FROM rolle_recht WHERE rolle = 'admin') = 26, 'Admin hat jedes Recht (F3)');
SELECT pg_temp.pruefe(
    (SELECT array_agg(rolle ORDER BY rolle) FROM rolle_recht WHERE recht = 'protokoll.personen') = '{admin,manager,owner}',
    'Auswertung über Personen: Manager, Owner und Admin, nicht der Mitarbeiter (Entscheidung 4, F4)');
SELECT pg_temp.pruefe(
    EXISTS (SELECT 1 FROM rolle_recht WHERE rolle = 'mitarbeiter' AND recht = 'rechnung.stornieren'),
    'Mitarbeiter storniert Rechnungen (F11)');
SELECT pg_temp.pruefe(
    (SELECT array_agg(rolle) FROM rolle_recht WHERE recht = 'rolle.rechte_aendern') = '{admin}',
    'Rechte einer Rolle ändert nur der Admin');
INSERT INTO rolle_recht (rolle, recht) VALUES ('mitarbeiter', 'protokoll.personen');
SELECT pg_temp.pruefe(
    (SELECT umfang FROM rolle_recht WHERE rolle = 'mitarbeiter' AND recht = 'protokoll.personen') = 'alle',
    'Recht vergeben ist ein INSERT einer Zeile, ohne Angabe gilt der Umfang „alle“');
DELETE FROM rolle_recht WHERE rolle = 'mitarbeiter' AND recht = 'protokoll.personen';
SELECT pg_temp.pruefe((SELECT count(*) FROM rolle_recht) = 105, 'Recht entziehen ist ein DELETE, die Matrix ist wieder wie vorher');
INSERT INTO rolle (rolle, bezeichnung) VALUES ('werkstattplaner', 'Werkstattplaner');
INSERT INTO rolle_recht (rolle, recht) VALUES ('werkstattplaner', 'wartung.sehen');
SELECT pg_temp.pruefe(true, 'neue Rolle mit einem Recht, ohne Schemaänderung (so ginge F17)');
DELETE FROM rolle_recht WHERE rolle = 'werkstattplaner';
DELETE FROM rolle WHERE rolle = 'werkstattplaner';
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO rolle_recht (rolle, recht) VALUES ('kunde', 'maschine.suchen')$$,
    '23505', 'dasselbe Recht zweimal für eine Rolle');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO rolle_recht (rolle, recht, umfang) VALUES ('kunde', 'maschine.anlegen', 'teilweise')$$,
    '23514', 'unbekannter Umfang');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO rolle_recht (rolle, recht) VALUES ('gast', 'maschine.suchen')$$,
    '23503', 'Recht für eine Rolle, die es nicht gibt (ohne Anmeldung ist keine Rolle)');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO rolle_recht (rolle, recht) VALUES ('kunde', 'maschine.loeschen')$$,
    '23503', 'Rolle bekommt ein Recht, das es nicht gibt');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO recht (recht, bezeichnung) VALUES ('anlegen', 'ohne Objekt')$$,
    '23514', 'Rechte heißen objekt.aktion');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO rolle (rolle, bezeichnung) VALUES ('Werkstatt Planer', 'Werkstattplaner')$$,
    '23514', 'Rollenschlüssel nur kleingeschrieben, ohne Leerzeichen');

SELECT pg_temp.abschnitt('Stammdaten');
INSERT INTO maschinentyp (bezeichnung, kategorie, tagessatz)
VALUES ('Minibagger 1,8 t', 'Erdbewegung', 89.00);
INSERT INTO maschine (inventarnummer, typnummer, seriennummer, baujahr, standort, wartungsintervall)
VALUES ('M-1001', 1, 'SN-4711', 2021, 'Köln', 500),
       ('M-1002', 1, 'SN-4712', 2019, 'Bonn', NULL);
SELECT pg_temp.pruefe(true, 'Maschine mit Wartungsintervall und Maschine ohne (NULL)');

SELECT pg_temp.abschnitt('Maschine: Baujahr und Wartungsintervall (#2, Antwort 36)');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO maschine (inventarnummer, typnummer, seriennummer, standort) VALUES ('M-1090', 1, 'SN-0', 'Köln')$$,
    '23502', 'Maschine ohne Baujahr');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO maschine (inventarnummer, typnummer, seriennummer, baujahr, standort) VALUES ('M-1090', 1, 'SN-0', 1899, 'Köln')$$,
    '23514', 'Baujahr vor 1900');
SELECT pg_temp.erwarte_fehler(
    format($$INSERT INTO maschine (inventarnummer, typnummer, seriennummer, baujahr, standort) VALUES ('M-1090', 1, 'SN-0', %s, 'Köln')$$,
           extract(year FROM current_date)::int + 1),
    '23514', 'Baujahr im nächsten Jahr');
INSERT INTO maschine (inventarnummer, typnummer, seriennummer, baujahr, standort)
VALUES ('M-1091', 1, 'SN-1', extract(year FROM current_date), 'Köln');
SELECT pg_temp.pruefe(true, 'Baujahr im laufenden Jahr ist erlaubt');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO maschine (inventarnummer, typnummer, seriennummer, baujahr, standort, wartungsintervall) VALUES ('M-1092', 1, 'SN-2', 2020, 'Köln', 0)$$,
    '23514', 'Wartungsintervall 0 Stunden');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO maschine (inventarnummer, typnummer, seriennummer, baujahr, standort, wartungsintervall) VALUES ('M-1092', 1, 'SN-2', 2020, 'Köln', -500)$$,
    '23514', 'negatives Wartungsintervall');
DELETE FROM maschine WHERE inventarnummer = 'M-1091';
INSERT INTO kunde (name, strasse, plz, ort, email, telefon)
VALUES ('Muster Bau GmbH', 'Musterstraße 1', '50667', 'Köln', 'info@muster-bau.example', '0221 000000');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO maschinentyp (bezeichnung, kategorie, tagessatz) VALUES ('Radlader', 'Erdbewegung', -1)$$,
    '23514', 'negativer Tagessatz');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO kunde (name, email) VALUES ('Ohne Telefon', 'x@example.org')$$,
    '23502', 'Kunde ohne Telefonnummer');

SELECT pg_temp.abschnitt('Benutzer (#99, F7, F13, F14)');
INSERT INTO benutzer (email, name, rolle)
VALUES ('mia@verleih.example', 'Mia Mitarbeiterin', 'mitarbeiter')
RETURNING benutzer_id AS mitarbeiterin \gset
INSERT INTO benutzer (email, name, rolle)
VALUES ('otto@verleih.example', 'Otto Owner', 'owner')
RETURNING benutzer_id AS owner \gset
INSERT INTO benutzer (email, name, kundennummer, rolle)
VALUES ('einkauf@muster-bau.example', 'Muster Bau, Einkauf', 1, 'kunde')
RETURNING benutzer_id AS kunde_muster \gset
SELECT pg_temp.pruefe(true, 'Benutzer mit genau einer Rolle, Kunde mit Verweis auf seinen Kundendatensatz');
INSERT INTO benutzer (email, name, rolle) VALUES ('neu@kunde.example', 'Neue Kundin', 'kunde');
SELECT pg_temp.pruefe(true, 'Kunde mit Konto, aber noch ohne Kundendatensatz: den legt er danach selbst an (F14)');
SELECT pg_temp.pruefe(
    (SELECT rr.umfang
       FROM benutzer b JOIN rolle_recht rr ON rr.rolle = b.rolle
      WHERE b.benutzer_id = :'kunde_muster' AND b.aktiv AND rr.recht = 'ausleihe.sehen') = 'eigene',
    'Abfrage für #8: der Kunde darf Reservierungen sehen, Umfang „eigene“');
SELECT pg_temp.pruefe(
    NOT EXISTS (SELECT 1
                  FROM benutzer b JOIN rolle_recht rr ON rr.rolle = b.rolle
                 WHERE b.benutzer_id = :'kunde_muster' AND b.aktiv AND rr.recht = 'kunde.suchen'),
    'Abfrage für #8: der Kunde darf keine anderen Kunden suchen');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO benutzer (email, name, rolle) VALUES ('Mia@Verleih.example', 'Mia doppelt', 'mitarbeiter')$$,
    '23505', 'dieselbe E-Mail-Adresse in anderer Schreibweise');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO benutzer (email, name, kundennummer, rolle) VALUES ('zweiter@muster-bau.example', 'Zweites Konto', 1, 'kunde')$$,
    '23505', 'zweites Konto für denselben Kundendatensatz');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO benutzer (email, name) VALUES ('ohne@rolle.example', 'Ohne Rolle')$$,
    '23502', 'Benutzer ohne Rolle');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO benutzer (email, name, rolle) VALUES ('gast@verleih.example', 'Gast', 'gast')$$,
    '23503', 'Benutzer mit einer Rolle, die es nicht gibt');

SELECT pg_temp.abschnitt('Stornofrist als Einstellung (#99, F8)');
SELECT pg_temp.pruefe(
    (SELECT wert FROM einstellung WHERE schluessel = 'stornofrist_tage') = '3',
    'Stornofrist steht als Wert in der Datenbank, Startwert 3 Tage');
SELECT pg_temp.erwarte_fehler(
    $$UPDATE einstellung SET wert = 'drei' WHERE schluessel = 'stornofrist_tage'$$,
    '23514', 'Stornofrist als Wort statt als Zahl');
SELECT pg_temp.erwarte_fehler(
    $$UPDATE einstellung SET wert = '-1' WHERE schluessel = 'stornofrist_tage'$$,
    '23514', 'negative Stornofrist');

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
-- Der Mietbeginn liegt in der Vergangenheit, die Frist ist also abgelaufen:
-- Storno nur mit Grund (#99).
UPDATE ausleihe SET status = 'storniert', stornogrund = 'Baustelle verschoben'
 WHERE ausleihnummer = :erste_ausleihe;
INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis)
VALUES (1, 'M-1001', '2026-09-24', '2026-09-28');
SELECT pg_temp.pruefe(true, 'stornierte Ausleihe gibt den Zeitraum frei');
SELECT pg_temp.erwarte_fehler(
    format($$UPDATE ausleihe SET status = 'reserviert', storniert_am = NULL, stornogrund = NULL
              WHERE ausleihnummer = %s$$, :erste_ausleihe),
    '23P01', 'Storno zurücknehmen, wenn der Zeitraum inzwischen vergeben ist');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis) VALUES (1, 'M-1002', '2026-11-10', '2026-11-01')$$,
    '23514', 'bis liegt vor von');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis, status) VALUES (1, 'M-1002', '2026-12-01', '2026-12-02', 'verloren')$$,
    '23514', 'unbekannter Status');

SELECT pg_temp.abschnitt('Stornofrist und Stornogrund (#99, Entscheidung 3, F8)');
-- Termine relativ zu heute (deutsche Zeit), damit die Fälle an jedem Tag
-- gleich ausgehen. Eigene Maschine, damit nichts mit den Fällen oben kollidiert.
INSERT INTO maschine (inventarnummer, typnummer, seriennummer, baujahr, standort)
VALUES ('M-1003', 1, 'SN-4713', 2022, 'Köln');
SELECT (now() AT TIME ZONE 'Europe/Berlin')::date AS heute \gset
SET app.benutzer_id = :'mitarbeiterin';
INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis)
VALUES (1, 'M-1003', :'heute'::date + 10, :'heute'::date + 11)
RETURNING ausleihnummer AS in_zehn_tagen \gset
INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis)
VALUES (1, 'M-1003', :'heute'::date + 3, :'heute'::date + 3)
RETURNING ausleihnummer AS in_drei_tagen \gset
INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis)
VALUES (1, 'M-1003', :'heute'::date + 2, :'heute'::date + 2)
RETURNING ausleihnummer AS in_zwei_tagen \gset
INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis)
VALUES (1, 'M-1003', :'heute'::date + 1, :'heute'::date + 1)
RETURNING ausleihnummer AS morgen \gset
UPDATE ausleihe SET status = 'storniert' WHERE ausleihnummer = :in_zehn_tagen;
SELECT pg_temp.pruefe(
    (SELECT storniert_am IS NOT NULL AND storniert_von = :'mitarbeiterin' AND stornogrund IS NULL
       FROM ausleihe WHERE ausleihnummer = :in_zehn_tagen),
    'Storno 10 Tage vor Mietbeginn ohne Grund; Zeitpunkt und Benutzer setzt die Datenbank');
UPDATE ausleihe SET status = 'storniert' WHERE ausleihnummer = :in_drei_tagen;
SELECT pg_temp.pruefe(true, 'Storno genau 3 Tage vor Mietbeginn ist noch in der Frist, ohne Grund');
SELECT pg_temp.erwarte_fehler(
    format($$UPDATE ausleihe SET status = 'storniert' WHERE ausleihnummer = %s$$, :in_zwei_tagen),
    '23514', 'Storno 2 Tage vor Mietbeginn ohne Grund');
SELECT pg_temp.erwarte_fehler(
    format($$UPDATE ausleihe SET status = 'storniert', stornogrund = '   ' WHERE ausleihnummer = %s$$, :in_zwei_tagen),
    '23514', 'Storno nach Fristablauf mit einem Grund aus Leerzeichen');
UPDATE ausleihe
   SET status = 'storniert', stornogrund = 'Maschine defekt, Ersatz angeboten',
       storniert_am = '2000-01-01', storniert_von = :'owner'
 WHERE ausleihnummer = :in_zwei_tagen;
SELECT pg_temp.pruefe(
    (SELECT storniert_am > '2000-01-01' AND storniert_von = :'mitarbeiterin'
       FROM ausleihe WHERE ausleihnummer = :in_zwei_tagen),
    'Storno 2 Tage vor Mietbeginn mit Grund; mitgeschickter Zeitpunkt und Benutzer zählen nicht');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis, storniert_am) VALUES (1, 'M-1003', '2027-01-04', '2027-01-05', now())$$,
    '23514', 'Storno-Zeitpunkt an einer Ausleihe, die nicht storniert ist');
SELECT pg_temp.erwarte_fehler(
    $$INSERT INTO ausleihe (kundennummer, inventarnummer, von, bis, stornogrund) VALUES (1, 'M-1003', '2027-01-04', '2027-01-05', 'vorsorglich')$$,
    '23514', 'Stornogrund an einer Ausleihe, die nicht storniert ist');
SET app.benutzer_id = :'owner';
UPDATE einstellung SET wert = '1' WHERE schluessel = 'stornofrist_tage';
SELECT pg_temp.pruefe(
    (SELECT geaendert_von = :'owner' AND geaendert_am IS NOT NULL
       FROM einstellung WHERE schluessel = 'stornofrist_tage'),
    'Stornofrist per UPDATE auf 1 Tag geändert, mit Zeitpunkt und Benutzer');
UPDATE ausleihe SET status = 'storniert' WHERE ausleihnummer = :morgen;
SELECT pg_temp.pruefe(true, 'mit 1 Tag Frist: Storno 1 Tag vor Mietbeginn wieder ohne Grund');
UPDATE einstellung SET wert = '3' WHERE schluessel = 'stornofrist_tage';
RESET app.benutzer_id;

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

SELECT pg_temp.abschnitt('Empfänger auf der Rechnung (Antwort 19)');
-- Muster Bau zieht um. Die gebuchte Rechnung muss die Anschrift behalten,
-- an die sie ausgestellt wurde (GoBD Rz. 59 Bsp. 4), die nächste Rechnung
-- geht an die neue. Mitgeschickte Empfängerdaten zählen nicht.
UPDATE kunde SET strasse = 'Hafenweg 7', plz = '53111', ort = 'Bonn' WHERE kundennummer = 1;
INSERT INTO rechnung (kundennummer, empfaenger_name, empfaenger_strasse, empfaenger_plz, empfaenger_ort)
VALUES (1, 'Irgendwer', 'Irgendwo 1', '00000', 'Nirgendwo')
RETURNING rechnungsnummer AS nach_umzug \gset
SELECT pg_temp.pruefe(
    (SELECT concat_ws(', ', empfaenger_name, empfaenger_strasse, empfaenger_plz || ' ' || empfaenger_ort)
       FROM rechnung WHERE rechnungsnummer = :rechnung_a) = 'Muster Bau GmbH, Musterstraße 1, 50667 Köln'
    AND (SELECT concat_ws(', ', empfaenger_name, empfaenger_strasse, empfaenger_plz || ' ' || empfaenger_ort)
       FROM rechnung WHERE rechnungsnummer = :nach_umzug) = 'Muster Bau GmbH, Hafenweg 7, 53111 Bonn',
    'Umzug ändert die gebuchte Rechnung nicht, die nächste geht an die neue Anschrift aus kunde');
-- Wie aus dem Reservierungsformular (#1): ohne Anschrift.
INSERT INTO kunde (name, email, telefon)
VALUES ('Ohne Anschrift KG', 'info@ohne-anschrift.example', '0228 000000')
RETURNING kundennummer AS ohne_anschrift \gset
SELECT pg_temp.erwarte_fehler(
    format($$INSERT INTO rechnung (kundennummer) VALUES (%s)$$, :ohne_anschrift),
    '23502', 'Kunde ohne Anschrift bekommt keine Rechnung');

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

SELECT pg_temp.abschnitt('Protokoll (#99, F12)');
SELECT pg_temp.pruefe(
    (SELECT benutzer_id IS NULL AND alt IS NULL AND neu IS NULL
       FROM protokoll WHERE objekt = 'maschine' AND objekt_id = 'M-1001' AND feld = 'Datensatz angelegt'),
    'Maschine anlegen: Eintrag „Datensatz angelegt“, Benutzer leer, weil niemand angemeldet war');
SELECT max(protokoll_id) AS stand FROM protokoll \gset
SET app.benutzer_id = :'mitarbeiterin';
UPDATE maschine SET standort = 'Bonn', betriebsstunden = 120.5 WHERE inventarnummer = 'M-1001';
SELECT pg_temp.pruefe(
    (SELECT array_agg(feld || ': ' || alt || ' → ' || neu ORDER BY feld)
       FROM protokoll WHERE protokoll_id > :stand AND objekt = 'maschine' AND objekt_id = 'M-1001'
                        AND benutzer_id = :'mitarbeiterin')
    = '{"betriebsstunden: 0.0 → 120.5","standort: Köln → Bonn"}',
    'Maschine ändern: je geändertem Feld ein Eintrag mit altem und neuem Wert und Benutzer');
SELECT max(protokoll_id) AS stand FROM protokoll \gset
UPDATE maschine SET standort = standort WHERE inventarnummer = 'M-1001';
SELECT pg_temp.pruefe(
    NOT EXISTS (SELECT 1 FROM protokoll WHERE protokoll_id > :stand),
    'UPDATE ohne geänderten Wert: kein Eintrag');
UPDATE maschine SET wartungsintervall = NULL WHERE inventarnummer = 'M-1001';
SELECT pg_temp.pruefe(
    (SELECT alt = '500' AND neu IS NULL FROM protokoll
      WHERE protokoll_id > :stand AND feld = 'wartungsintervall'),
    'Wert gelöscht: neu ist leer');
UPDATE kunde SET telefon = '0221 111111' WHERE kundennummer = 1;
SELECT pg_temp.pruefe(
    EXISTS (SELECT 1 FROM protokoll WHERE objekt = 'kunde' AND objekt_id = '1' AND feld = 'telefon'
                                      AND alt = '0221 000000' AND neu = '0221 111111'),
    'Kunde ändern erzeugt einen Eintrag');
SELECT pg_temp.pruefe(
    (SELECT array_agg(feld ORDER BY feld) FROM protokoll
      WHERE objekt = 'ausleihe' AND objekt_id = :'in_zwei_tagen' AND feld <> 'Datensatz angelegt')
    = '{status,storniert_am,storniert_von,stornogrund}'
    AND EXISTS (SELECT 1 FROM protokoll WHERE objekt = 'ausleihe' AND objekt_id = :'in_zwei_tagen'
                                          AND feld = 'stornogrund' AND neu = 'Maschine defekt, Ersatz angeboten'),
    'Ausleihe stornieren erzeugt Einträge für Status, Zeitpunkt, Benutzer und Grund');
UPDATE bestellung SET lieferstatus = 'versandt' WHERE bestell_id = :bestellung;
SELECT pg_temp.pruefe(
    EXISTS (SELECT 1 FROM protokoll WHERE objekt = 'bestellung' AND objekt_id = :'bestellung'
                                      AND feld = 'lieferstatus' AND alt = 'offen' AND neu = 'versandt'),
    'Bestellung ändern erzeugt einen Eintrag (F12)');
SELECT pg_temp.pruefe(
    (SELECT count(*) FROM protokoll WHERE objekt = 'rechnung' AND feld = 'Datensatz angelegt')
    = (SELECT count(*) FROM rechnung)
    AND EXISTS (SELECT 1 FROM protokoll WHERE objekt = 'rechnung' AND objekt_id = :'storno'),
    'jede Rechnung, auch die Storno-Rechnung, steht mit ihrer Nummer im Protokoll (F12)');
SELECT pg_temp.pruefe(
    (SELECT alt::jsonb ->> 'seriennummer' FROM protokoll
      WHERE objekt = 'maschine' AND objekt_id = 'M-1091' AND feld = 'Datensatz gelöscht') = 'SN-1',
    'gelöschte Maschine: Eintrag „Datensatz gelöscht“ mit dem alten Datensatz');
SET app.benutzer_id = '00000000-0000-0000-0000-000000000000';
SELECT pg_temp.erwarte_fehler(
    $$UPDATE kunde SET telefon = '0221 222222' WHERE kundennummer = 1$$,
    '23503', 'Änderung unter einem Benutzer, den es nicht gibt');
RESET app.benutzer_id;
SELECT pg_temp.erwarte_fehler(
    $$UPDATE protokoll SET neu = 'geschönt' WHERE objekt = 'kunde'$$,
    'P0001', 'Protokolleintrag ändern');
SELECT pg_temp.erwarte_fehler(
    $$DELETE FROM protokoll WHERE benutzer_id IS NULL$$,
    'P0001', 'Protokolleintrag löschen');
SET enable_seqscan = off;
SELECT pg_temp.pruefe(
    pg_temp.plan($$SELECT * FROM protokoll WHERE objekt = 'maschine' AND objekt_id = 'M-1001' ORDER BY zeitpunkt$$)
        LIKE '%protokoll_je_objekt%',
    'Verlauf eines Datensatzes liest über den Index protokoll_je_objekt');
SELECT pg_temp.pruefe(
    pg_temp.plan(format($$SELECT * FROM protokoll WHERE benutzer_id = %L ORDER BY zeitpunkt$$, :'mitarbeiterin'))
        LIKE '%protokoll_je_benutzer%',
    'Auswertung je Benutzer liest über den Index protokoll_je_benutzer');
RESET enable_seqscan;

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
SELECT tgrelid::regclass AS tabelle, tgname AS trigger
  FROM pg_trigger
 WHERE NOT tgisinternal AND tgrelid::regclass::text NOT LIKE 'pg_%'
 ORDER BY 1, 2;
SELECT objekt, count(*) AS eintraege
  FROM protokoll
 GROUP BY objekt
 ORDER BY objekt;
