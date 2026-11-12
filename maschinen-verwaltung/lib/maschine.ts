// Die Maschine traegt ihre Regeln selbst (ADR 0004).
//
// Sie entscheidet, ob sie zu einem Suchfilter passt (Kundensuche, #1, und
// Verwaltung, #2), ob eine Eingabe eine gueltige Maschine ergibt (#2) und was
// sich gegenueber einer geaenderten Fassung unterscheidet (Protokoll, #2).
//
// Ob sie in einem Zeitraum frei ist, beantwortet sie seit #85 NICHT selbst.
// Belegungen gehoeren nicht zur Maschine, sondern zu den Reservierungen, so
// steht es auch im Datenmodell (#45: die Zeitraeume liegen in "ausleihe", nicht
// in "maschine"). Wer wissen will, ob eine Maschine frei ist, fragt den
// Belegungsplan aus dem Speicher: speicher.belegungsplanFuer(inventarnummer).
//
// Felder nach dem Datenmodell aus #45 (maschine: inventarnummer, typnummer,
// seriennummer, standort, betriebsstunden) und nach den Kriterien von #2
// (Baujahr, Wartungsintervall). Baujahr und Wartungsintervall stehen NICHT im
// Schema aus #45, das ist als Frage an Finn offen (Bericht #29).
//
// WICHTIG, Server-Client-Grenze: Klasseninstanzen koennen nicht als Props an
// eine Client-Komponente uebergeben werden. React verlangt dort
// serialisierbare Werte, eine Instanz verliert ueber die Grenze ihren Prototyp
// und damit ihre Methoden. Deshalb gibt es "alsAnzeige()" und "alsEingabe()":
// das Fachobjekt bleibt auf dem Server, ueber die Grenze geht ein einfaches
// Objekt.

import {
    MASCHINEN_FELDER,
    type Feldfehler,
    type MaschinenEingabe,
    type MaschinenFeld,
} from "./maschinenfelder";
import type { Maschinentyp } from "./maschinentyp";
import type { Protokolleintrag } from "./protokoll";
import { nachkommastellen, zahlAusEingabe, zahlDeutsch, zahlFuerEingabe } from "./zahl";

/** Was eine Client-Komponente von einer Maschine sehen muss, ohne Verhalten. */
export type MaschineAnzeige = {
    inventarnummer: string;
    bezeichnung: string;
    kategorie: string;
    standort: string;
};

/** Ein Unterschied zwischen zwei Fassungen derselben Maschine. */
export type Aenderung = { feld: MaschinenFeld; alt: string; neu: string };

export type MaschinenDaten = {
    inventarnummer: string;
    typ: Maschinentyp;
    seriennummer: string;
    baujahr: number;
    /** Zaehlerstand, eine Nachkommastelle wie im Schema (numeric(10,1)). */
    betriebsstunden: number;
    /** In Betriebsstunden. null: die Maschine hat keins. */
    wartungsintervall: number | null;
    standort: string;
};

const INVENTARNUMMER = /^M-\d{4}$/;
const JAHR = /^\d{4}$/;
const FRUEHESTES_BAUJAHR = 1900;

export class Maschine {
    readonly inventarnummer: string;
    readonly typ: Maschinentyp;
    readonly seriennummer: string;
    readonly baujahr: number;
    readonly betriebsstunden: number;
    readonly wartungsintervall: number | null;
    readonly standort: string;

    // Ein Objekt statt sieben Argumente: bei sieben Werten in fester
    // Reihenfolge verwechselt man zwei Zahlen, ohne dass der Compiler es merkt.
    constructor(daten: MaschinenDaten) {
        this.inventarnummer = daten.inventarnummer;
        this.typ = daten.typ;
        this.seriennummer = daten.seriennummer;
        this.baujahr = daten.baujahr;
        this.betriebsstunden = daten.betriebsstunden;
        this.wartungsintervall = daten.wartungsintervall;
        this.standort = daten.standort;
    }

    /** Bezeichnung und Kategorie gehoeren zum Typ, siehe maschinentyp.ts. */
    get bezeichnung(): string {
        return this.typ.bezeichnung;
    }

    get kategorie(): string {
        return this.typ.kategorie;
    }

    /** Fuer die Kundensuche: passt diese Maschine zu Kategorie und Standort? */
    passtZu(kategorie?: string, standort?: string): boolean {
        if (kategorie && this.kategorie !== kategorie) return false;
        if (standort && this.standort !== standort) return false;
        return true;
    }

    /**
     * Fuer die Verwaltung (#2): "Maschinen sind ueber Inventarnummer, Typ und
     * Standort auffindbar." Ein Suchfeld fuer alles, wie Mockup 06. Zum Typ
     * gehoert auch die Kategorie, "Verdichtung" findet also beide Walzen.
     */
    trifftSuchbegriff(begriff: string): boolean {
        const gesucht = begriff.trim().toLocaleLowerCase("de");
        if (!gesucht) return true;
        return [this.inventarnummer, this.bezeichnung, this.kategorie, this.standort].some(
            (text) => text.toLocaleLowerCase("de").includes(gesucht),
        );
    }

    /**
     * Was sich gegenueber der neuen Fassung unterscheidet, Feld fuer Feld.
     * Grundlage fuer das Aenderungsprotokoll: unveraenderte Felder tauchen dort
     * nicht auf.
     */
    unterschiedeZu(neu: Maschine): Aenderung[] {
        return MASCHINEN_FELDER.flatMap((feld) => {
            const alt = this.wertAlsText(feld);
            const jetzt = neu.wertAlsText(feld);
            return alt === jetzt ? [] : [{ feld, alt, neu: jetzt }];
        });
    }

    /** Ein Feld als Text fuer Protokoll und Anzeige. Leer heisst "kein Wert". */
    wertAlsText(feld: MaschinenFeld): string {
        switch (feld) {
            case "inventarnummer":
                return this.inventarnummer;
            case "typnummer":
                return this.typ.bezeichnung;
            case "seriennummer":
                return this.seriennummer;
            case "baujahr":
                return String(this.baujahr);
            case "betriebsstunden":
                return zahlDeutsch(this.betriebsstunden);
            case "wartungsintervall":
                return this.wartungsintervall === null ? "" : zahlDeutsch(this.wartungsintervall);
            case "standort":
                return this.standort;
        }
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

    /** Die Werte so, wie sie im Formular stehen, zum Bearbeiten. */
    alsEingabe(): MaschinenEingabe {
        return {
            inventarnummer: this.inventarnummer,
            typnummer: String(this.typ.typnummer),
            seriennummer: this.seriennummer,
            baujahr: String(this.baujahr),
            betriebsstunden: zahlFuerEingabe(this.betriebsstunden),
            wartungsintervall:
                this.wartungsintervall === null ? "" : zahlFuerEingabe(this.wartungsintervall),
            standort: this.standort,
        };
    }

    /** "m-1011 " wird "M-1011". Gross und ohne Leerzeichen, damit nichts doppelt ist. */
    static normiereInventarnummer(text: string): string {
        return text.trim().toUpperCase();
    }

    /**
     * Prueft eine Eingabe, bevor daraus eine Maschine wird, und meldet ALLE
     * fehlerhaften Felder auf einmal, nicht nur das erste. Mockup 08 zeigt zwei
     * Fehler gleichzeitig: wer erst den einen behebt und dann vom naechsten
     * erfaehrt, schickt das Formular unnoetig zweimal ab.
     *
     * Statisch wie Zeitraum.fehler(): es gibt noch kein Objekt, die Pruefung
     * entscheidet gerade erst, ob eines entstehen darf.
     *
     * Ob die Inventarnummer schon vergeben ist, kann die Maschine nicht wissen,
     * das weiss nur der Speicher. Das prueft lib/stammdaten.ts.
     *
     * Die Meldungen sagen, was zu tun ist (ADR 0009, C, WCAG 3.3.3).
     */
    static pruefe(
        eingabe: MaschinenEingabe,
        typen: Maschinentyp[],
        aktuellesJahr: number,
    ): { maschine: Maschine; fehler: null } | { maschine: null; fehler: Feldfehler } {
        const fehler: Feldfehler = {};

        // Inventarnummer: Pflicht, festes Format wie in den Beispieldaten.
        const inventarnummer = Maschine.normiereInventarnummer(eingabe.inventarnummer);
        if (!inventarnummer) {
            fehler.inventarnummer = "Bitte eine Inventarnummer angeben, zum Beispiel M-1011.";
        } else if (!INVENTARNUMMER.test(inventarnummer)) {
            fehler.inventarnummer =
                "Die Inventarnummer hat das Format M und vier Ziffern, zum Beispiel M-1011.";
        }

        // Maschinentyp: Pflicht, einer der vorhandenen Typen.
        const typ = typen.find((t) => String(t.typnummer) === eingabe.typnummer.trim());
        if (!typ) {
            fehler.typnummer = "Bitte einen Maschinentyp aus der Liste auswählen.";
        }

        // Seriennummer: Pflicht laut Datenmodell (maschine.seriennummer NOT NULL).
        const seriennummer = eingabe.seriennummer.trim();
        if (!seriennummer) {
            fehler.seriennummer = "Bitte die Seriennummer vom Typenschild angeben.";
        }

        // Baujahr: Pflicht laut #2, vierstellig, nicht in der Zukunft.
        const baujahrText = eingabe.baujahr.trim();
        const baujahr = Number(baujahrText);
        if (!baujahrText) {
            fehler.baujahr = "Bitte das Baujahr angeben, zum Beispiel 2021.";
        } else if (!JAHR.test(baujahrText)) {
            fehler.baujahr = "Bitte das Baujahr als vierstellige Jahreszahl angeben, zum Beispiel 2021.";
        } else if (baujahr > aktuellesJahr) {
            fehler.baujahr = `Das Baujahr kann nicht nach ${aktuellesJahr} liegen. Bitte prüfen.`;
        } else if (baujahr < FRUEHESTES_BAUJAHR) {
            fehler.baujahr = `Bitte ein Baujahr ab ${FRUEHESTES_BAUJAHR} angeben.`;
        }

        // Betriebsstunden: Zahl, nicht negativ, hoechstens eine Nachkommastelle
        // (Schema numeric(10,1)). Leer heisst 0, wie DEFAULT 0 im Schema.
        const stundenText = eingabe.betriebsstunden.trim();
        const betriebsstunden = stundenText === "" ? 0 : zahlAusEingabe(stundenText);
        if (betriebsstunden === null) {
            fehler.betriebsstunden =
                "Bitte die Betriebsstunden als Zahl angeben, zum Beispiel 1240 oder 1240,5.";
        } else if (betriebsstunden < 0) {
            fehler.betriebsstunden =
                "Betriebsstunden können nicht negativ sein. Bitte den Zählerstand angeben, zum Beispiel 1240.";
        } else if (nachkommastellen(stundenText) > 1) {
            fehler.betriebsstunden = "Bitte höchstens eine Nachkommastelle angeben, zum Beispiel 1240,5.";
        }

        // Wartungsintervall: freiwillig, ganze Betriebsstunden, groesser als 0.
        const intervallText = eingabe.wartungsintervall.trim();
        const wartungsintervall = intervallText === "" ? null : zahlAusEingabe(intervallText);
        if (intervallText !== "") {
            if (wartungsintervall === null || !Number.isInteger(wartungsintervall)) {
                fehler.wartungsintervall =
                    "Bitte das Wartungsintervall als ganze Zahl in Betriebsstunden angeben, zum Beispiel 500.";
            } else if (wartungsintervall < 0) {
                fehler.wartungsintervall =
                    "Das Wartungsintervall kann nicht negativ sein. Bitte zum Beispiel 500 angeben.";
            } else if (wartungsintervall === 0) {
                fehler.wartungsintervall =
                    "Ein Intervall von 0 Stunden gibt es nicht. Feld leer lassen, wenn die Maschine keins hat.";
            }
        }

        // Standort: Pflicht laut Datenmodell (maschine.standort NOT NULL).
        const standort = eingabe.standort.trim();
        if (!standort) {
            fehler.standort = "Bitte den Standort angeben, zum Beispiel Köln.";
        }

        if (Object.keys(fehler).length > 0 || !typ || betriebsstunden === null) {
            return { maschine: null, fehler };
        }

        return {
            maschine: new Maschine({
                inventarnummer,
                typ,
                seriennummer,
                baujahr,
                betriebsstunden,
                wartungsintervall,
                standort,
            }),
            fehler: null,
        };
    }
}

/**
 * Der Vertrag zwischen Fachlogik und Speicher fuer Maschinen (ADR 0011), wie
 * ReservierungSpeicher in reservierung.ts.
 *
 * Seit #2 lassen sich Maschinen anlegen und aendern. Dann darf keine Stelle
 * mehr die Beispieldaten direkt lesen, sonst sieht sie neue Maschinen nicht:
 * derselbe Fehler wie bei #85, nur mit Maschinen statt Reservierungen.
 *
 * Maschine und Protokoll werden in EINEM Aufruf gespeichert. Mit der
 * Datenbank wird daraus eine Transaktion: eine Aenderung ohne
 * Protokolleintrag darf es nicht geben.
 */
export type MaschinenSpeicher = {
    maschinen(): Promise<Maschine[]>;
    maschine(inventarnummer: string): Promise<Maschine | undefined>;
    maschinentypen(): Promise<Maschinentyp[]>;
    /** false: die Inventarnummer ist schon vergeben, nichts gespeichert. */
    maschineAnlegen(maschine: Maschine, eintrag: Protokolleintrag): Promise<boolean>;
    maschineAendern(maschine: Maschine, eintraege: Protokolleintrag[]): Promise<void>;
    /** Neueste zuerst. */
    protokollFuer(inventarnummer: string): Promise<Protokolleintrag[]>;
};
