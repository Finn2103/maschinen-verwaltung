// Kunde und Reservierung als Fachobjekte mit Verhalten (ADR 0004).
//
// Vorher hiess diese Datei reservierungen.ts und enthielt nur Typen. Kunde
// prueft jetzt seine eigene Vollstaendigkeit, statt dass reservieren() drei
// Felder einzeln abfragt.
//
// Server-Client-Grenze wie bei Maschine: eine Reservierung wird aus einer
// Server Action an das Formular zurueckgegeben und muss dafuer serialisierbar
// sein. Deshalb "alsAnzeige()".

import type { Belegungsplan } from "./belegungsplan";
import { Zeitraum } from "./zeitraum";

/** Welches Formularfeld eine Meldung bekommt. */
export type Feld = "von" | "bis" | "name" | "email" | "telefon";

export class Kunde {
    constructor(
        readonly name: string,
        readonly email: string,
        readonly telefon: string,
    ) {}

    /**
     * Gibt das erste unvollstaendige Feld mit Meldung zurueck, oder null.
     *
     * Die Pruefung gehoert zum Kunden, nicht in die Reservierungslogik: wer
     * wissen will, ob Kundendaten brauchbar sind, fragt den Kunden.
     *
     * Die E-Mail-Pruefung ist absichtlich minimal. Eine vollstaendige
     * Adresspruefung ist im Server kaum sinnvoll machbar, und im Browser
     * prueft type="email" bereits die Form. Offener Punkt aus der Code-Review
     * vom 12.10.2026.
     */
    fehlendesFeld(): { feld: Feld; fehler: string } | null {
        if (!this.name.trim()) {
            return { feld: "name", fehler: "Bitte einen Namen angeben." };
        }
        if (!this.email.includes("@")) {
            return { feld: "email", fehler: "Bitte eine E-Mail-Adresse angeben." };
        }
        if (!this.telefon.trim()) {
            return {
                feld: "telefon",
                fehler: "Bitte eine Telefonnummer für Rückfragen angeben.",
            };
        }
        return null;
    }
}

/** Was das Formular nach einer erfolgreichen Reservierung anzeigt. */
export type ReservierungAnzeige = {
    id: string;
    von: string;
    bis: string;
};

export class Reservierung {
    constructor(
        readonly id: string,
        readonly inventarnummer: string,
        readonly zeitraum: Zeitraum,
        readonly kunde: Kunde,
    ) {}

    alsAnzeige(): ReservierungAnzeige {
        return {
            id: this.id,
            von: this.zeitraum.von,
            bis: this.zeitraum.bis,
        };
    }
}

/**
 * Der Vertrag zwischen Fachlogik und Speicher (ADR 0011).
 *
 * Die Fachlogik sagt, WAS sie braucht, nicht WIE gespeichert wird. Davon gibt
 * es zwei Umsetzungen und eine Stelle, die auswaehlt: lib/speicher/index.ts.
 *
 * Die Methoden sind bewusst asynchron, obwohl der Arbeitsspeicher das nicht
 * braucht. Synchron gebaut muesste beim Umstellen auf die Datenbank (#45) jede
 * aufrufende Stelle von synchron auf asynchron umgeschrieben werden.
 */
export type ReservierungSpeicher = {
    belegungsplanFuer(inventarnummer: string): Promise<Belegungsplan>;
    anlegen(
        inventarnummer: string,
        zeitraum: Zeitraum,
        kunde: Kunde,
    ): Promise<Reservierung>;
};
