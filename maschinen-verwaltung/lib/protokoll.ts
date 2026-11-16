// Ein Eintrag im Aenderungsprotokoll (#2): "Jede Aenderung wird mit
// Zeitpunkt, Benutzer, Feld, altem und neuem Wert protokolliert."
//
// Genau diese fuenf Angaben, dazu die Inventarnummer, damit das Protokoll je
// Maschine abfragbar ist. Ein Eintrag wird nie geaendert, nur angelegt: ein
// Protokoll, in dem man nachtraeglich schreiben kann, belegt nichts.
//
// Alte und neue Werte stehen als Text, so wie sie angezeigt werden. Das
// Protokoll ist fuer Menschen, die nachvollziehen wollen, was passiert ist,
// und es muss Felder mit verschiedenen Typen in einer Spalte fassen. Ein
// leerer Text heisst "kein Wert".
//
// BENUTZER ist die E-Mail-Adresse des angemeldeten Benutzers. Bis zur
// Anmeldung (#43) kommt er aus der Probe-Anmeldung in der Kopfleiste (#8,
// Antwort 60 vom 16.11.); vorher trug man ein Kuerzel ins Formular ein.
//
// Die Tabelle dafuer steht seit #99 im Schema: "protokoll" in
// docs/datenmodell/schema.sql, beschrieben in relational.md 4.10. Dort
// schreibt ein Trigger je Aenderung, den Benutzer liest er ueber
// aktueller_benutzer() aus SET LOCAL app.benutzer_id (relational.md 4.8). Die
// App nutzt die Datenbank noch nicht (ADR 0011), deshalb liegt das Protokoll
// bis zur PostgreSQL-Umsetzung im Arbeitsspeicher. Mit ihr schreibt der
// Trigger die Eintraege, und die Fachlogik muss sie nicht mehr selbst anlegen.

export class Protokolleintrag {
    constructor(
        readonly inventarnummer: string,
        /** ISO-8601 mit Uhrzeit und Zeitzone, z. B. 2026-11-12T10:42:00.000Z */
        readonly zeitpunkt: string,
        readonly benutzer: string,
        /** Der Feldname so, wie er im Formular heisst, z. B. "Betriebsstunden". */
        readonly feld: string,
        readonly alt: string,
        readonly neu: string,
    ) {}
}

/** Das Feld, das beim Anlegen protokolliert wird, wie im Mockup 09. */
export const DATENSATZ_ANGELEGT = "Datensatz angelegt";
