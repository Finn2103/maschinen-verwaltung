import type { Belegung, Maschine } from "./maschinen";

/**
 * Zwei Zeiträume überlappen, wenn jeder vor dem Ende des anderen beginnt.
 *
 * Geschlossene Intervalle: "von" und "bis" gehören beide dazu, deshalb "<=".
 * Der Rückgabetag bleibt belegt, entschieden am 08.10.2026
 * (docs/frontend-konventionen.md, Abschnitt 4).
 *
 * Die Bedingung braucht keine Fallunterscheidung. Sie deckt Teilüberlappung von
 * links und rechts, vollständige Umschließung in beide Richtungen und Gleichheit ab.
 */
export function ueberlappt(a: Belegung, b: Belegung): boolean {
    return a.von <= b.bis && b.von <= a.bis;
}

export function istVerfuegbar(maschine: Maschine, zeitraum: Belegung): boolean {
    return !maschine.belegungen.some((belegung) => ueberlappt(belegung, zeitraum));
}

export type Suchfilter = {
    kategorie?: string;
    standort?: string;
    von?: string;
    bis?: string;
};

/** Gibt die Fehlermeldung zum Zeitraum zurück, oder null wenn er gültig ist. */
export function zeitraumFehler(von?: string, bis?: string): string | null {
    if (!von && !bis) return null;
    if (!von || !bis) return "Bitte beide Datumsfelder füllen oder beide leer lassen.";
    if (bis < von) return "Das Bis-Datum liegt vor dem Von-Datum.";
    return null;
}

export function suche(alle: Maschine[], filter: Suchfilter): Maschine[] {
    return alle.filter((maschine) => {
        if (filter.kategorie && maschine.kategorie !== filter.kategorie) return false;
        if (filter.standort && maschine.standort !== filter.standort) return false;
        if (filter.von && filter.bis) {
            return istVerfuegbar(maschine, { von: filter.von, bis: filter.bis });
        }
        return true;
    });
}