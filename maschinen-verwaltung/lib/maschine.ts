// Die Maschine traegt ihre Regeln selbst (ADR 0004).
//
// Vorher war Maschine ein reiner Datentyp und die Verfuegbarkeitspruefung eine
// freie Funktion daneben. Jetzt entscheidet die Maschine selbst, ob sie zu
// Kategorie und Standort eines Suchfilters passt.
//
// Ob sie in einem Zeitraum frei ist, beantwortet sie seit #85 NICHT mehr
// selbst. Ihre "belegungen" sind nur die Beispieldaten, Reservierungen aus der
// Anwendung kennt allein der Speicher. Eine Methode "istVerfuegbarIn" an der
// Maschine gab deshalb eine falsche Antwort, sobald jemand reserviert hatte.
// Wer wissen will, ob eine Maschine frei ist, fragt den Belegungsplan aus dem
// Speicher: speicher.belegungsplanFuer(inventarnummer), so wie reservieren()
// und die Suche (ADR 0011).
//
// WICHTIG, Server-Client-Grenze: Klasseninstanzen koennen nicht als Props an
// eine Client-Komponente uebergeben werden. React verlangt dort
// serialisierbare Werte, eine Instanz verliert ueber die Grenze ihren Prototyp
// und damit ihre Methoden. Deshalb gibt es "alsAnzeige()": das Fachobjekt
// bleibt auf dem Server, ueber die Grenze geht ein einfaches Objekt.

import { Belegungsplan } from "./belegungsplan";
import { Zeitraum } from "./zeitraum";

/** Was eine Client-Komponente von einer Maschine sehen muss, ohne Verhalten. */
export type MaschineAnzeige = {
    inventarnummer: string;
    bezeichnung: string;
    kategorie: string;
    standort: string;
};

export class Maschine {
    /**
     * Belegungen aus den Beispieldaten. Liest nur der Speicher
     * (lib/speicher/arbeitsspeicher.ts) und legt sie mit den angelegten
     * Reservierungen zusammen. Nicht direkt fuer eine Verfuegbarkeit benutzen,
     * siehe Dateikopf.
     */
    readonly belegungen: Belegungsplan;

    constructor(
        readonly inventarnummer: string,
        readonly bezeichnung: string,
        readonly kategorie: string,
        readonly standort: string,
        belegungen: Zeitraum[] = [],
    ) {
        this.belegungen = new Belegungsplan(belegungen);
    }

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
