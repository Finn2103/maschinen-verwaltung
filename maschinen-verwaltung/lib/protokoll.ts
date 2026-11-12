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
// Die Tabelle dafuer in der Datenbank gehoert zum eigenen Item fuer Rollen,
// Rechte und Protokoll (docs/datenmodell/relational.md, Abschnitt 6), nicht zu
// #2. Bis dahin liegt das Protokoll im Arbeitsspeicher.

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
