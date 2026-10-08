import type { Suchfilter } from "./verfuegbarkeit";

/**
 * Baut einen Link auf die Suche, bei dem die genannten Felder fehlen.
 *
 * Zurücksetzen ist hier eine Navigation, keine Aktion: der Zustand der Suche
 * steht vollständig in der URL, also genügt ein Link ohne die entsprechenden
 * Parameter. Kein Zustand im Browser, kein JavaScript nötig.
 */
export function suchlinkOhne(
    filter: Suchfilter,
    ...entfernen: (keyof Suchfilter)[]
): string {
    const params = new URLSearchParams();

    for (const feld of ["kategorie", "standort", "von", "bis"] as const) {
        const wert = filter[feld];
        if (wert && !entfernen.includes(feld)) params.set(feld, wert);
    }

    const query = params.toString();
    return query ? `/?${query}` : "/";
}