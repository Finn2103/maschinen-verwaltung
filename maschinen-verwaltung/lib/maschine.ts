// Die Maschine traegt ihre Regeln selbst (ADR 0004).
//
// Vorher war Maschine ein reiner Datentyp und die Verfuegbarkeitspruefung eine
// freie Funktion daneben. Jetzt entscheidet die Maschine selbst, ob sie zu
// Kategorie und Standort eines Suchfilters passt.
//
// Ob sie in einem Zeitraum frei ist, beantwortet sie seit #85 NICHT selbst.
// Belegungen gehoeren nicht zur Maschine, sondern zu den Reservierungen, so
// steht es auch im Datenmodell (#45: die Zeitraeume liegen in "ausleihe", nicht
// in "maschine"). Wer wissen will, ob eine Maschine frei ist, fragt den
// Belegungsplan aus dem Speicher: speicher.belegungsplanFuer(inventarnummer).
//
// WICHTIG, Server-Client-Grenze: Klasseninstanzen koennen nicht als Props an
// eine Client-Komponente uebergeben werden. React verlangt dort
// serialisierbare Werte, eine Instanz verliert ueber die Grenze ihren Prototyp
// und damit ihre Methoden. Deshalb gibt es "alsAnzeige()": das Fachobjekt
// bleibt auf dem Server, ueber die Grenze geht ein einfaches Objekt.

/** Was eine Client-Komponente von einer Maschine sehen muss, ohne Verhalten. */
export type MaschineAnzeige = {
    inventarnummer: string;
    bezeichnung: string;
    kategorie: string;
    standort: string;
};

export class Maschine {
    constructor(
        readonly inventarnummer: string,
        readonly bezeichnung: string,
        readonly kategorie: string,
        readonly standort: string,
    ) {}

    /** Fuer die Suche: passt diese Maschine zu Kategorie und Standort? */
    passtZu(kategorie?: string, standort?: string): boolean {
        if (kategorie && this.kategorie !== kategorie) return false;
        if (standort && this.standort !== standort) return false;
        return true;
    }

    /** Das einfache Objekt fuer die Grenze zum Browser, siehe Dateikopf. */
    alsAnzeige(): MaschineAnzeige {
        return {
            inventarnummer: this.inventarnummer,
            bezeichnung: this.bezeichnung,
            kategorie: this.kategorie,
            standort: this.standort,
        };
    }
}

/**
 * Der Vertrag zwischen Fachlogik und Speicher fuer Maschinen (ADR 0011), wie
 * ReservierungSpeicher in reservierung.ts.
 *
 * Seit #2 lassen sich Maschinen anlegen und aendern. Dann darf keine Stelle
 * mehr die Beispieldaten direkt lesen, sonst sieht sie neue und geaenderte
 * Maschinen nicht: derselbe Fehler wie bei #85, nur mit Maschinen statt
 * Reservierungen. Deshalb fragt jede Seite den Speicher.
 */
export type MaschinenSpeicher = {
    maschinen(): Promise<Maschine[]>;
    maschine(inventarnummer: string): Promise<Maschine | undefined>;
};
