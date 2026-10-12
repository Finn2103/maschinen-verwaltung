// Die Maschine traegt ihre Regeln selbst (ADR 0004).
//
// Vorher war Maschine ein reiner Datentyp und die Verfuegbarkeitspruefung eine
// freie Funktion daneben. Jetzt entscheidet die Maschine selbst, ob sie in
// einem Zeitraum frei ist und ob sie zu einem Suchfilter passt. Die
// Konfliktsuche delegiert sie an ihren Belegungsplan, weil das dessen Aufgabe
// ist und nicht ihre.
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

    istVerfuegbarIn(zeitraum: Zeitraum): boolean {
        return this.belegungen.istFrei(zeitraum);
    }

    /** Fuer die Suche: trifft diese Maschine die Filterkriterien? */
    passtZu(kategorie?: string, standort?: string, zeitraum?: Zeitraum | null): boolean {
        if (kategorie && this.kategorie !== kategorie) return false;
        if (standort && this.standort !== standort) return false;
        if (zeitraum && !this.istVerfuegbarIn(zeitraum)) return false;
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
