// Zahlen zwischen Formular, Fachobjekt und Anzeige.
//
// Im Formular steht Text. Wer deutsch tippt, schreibt das Komma: "1240,5".
// Number("1240,5") ergibt NaN, und Number("") ergibt 0, nicht "nichts
// eingegeben". Deshalb wird hier zuerst mit einem Muster geprueft und erst
// danach umgewandelt.
//
// Anders als bei Datumswerten (lib/datum.ts) ist Intl hier unproblematisch:
// eine Zahl hat keine Zeitzone.

const ZAHL = /^-?\d+([.,]\d+)?$/;

/** "1240,5" oder "1240.5" wird 1240.5. Kein Zahlformat: null. */
export function zahlAusEingabe(text: string): number | null {
    const t = text.trim();
    if (!ZAHL.test(t)) return null;
    return Number(t.replace(",", "."));
}

/** Anzahl der Nachkommastellen, wie eingegeben. "1240,25" hat zwei. */
export function nachkommastellen(text: string): number {
    const teile = text.trim().split(/[.,]/);
    return teile.length === 2 ? teile[1].length : 0;
}

/** Fuer die Anzeige: 1240.5 wird "1.240,5". */
export function zahlDeutsch(wert: number): string {
    return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(wert);
}

/** Fuer ein Formularfeld: 1240.5 wird "1240,5", ohne Tausenderpunkt. */
export function zahlFuerEingabe(wert: number): string {
    return String(wert).replace(".", ",");
}
