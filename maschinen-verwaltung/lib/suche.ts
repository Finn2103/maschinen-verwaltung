// Die Suche. Vorher stand sie in verfuegbarkeit.ts, zusammen mit der
// Ueberlappungspruefung und der Eingabepruefung. Drei Zustaendigkeiten in
// einer Datei, deren Name nur die erste abdeckte. Befund der Code-Review vom
// 12.10.2026, jetzt getrennt: Zeitraum, Maschine, Suche.
//
// Zwei Fragen, zwei Stellen: ob eine Maschine zu Kategorie und Standort passt,
// entscheidet die Maschine selbst (maschine.passtZu). Ob sie im Zeitraum frei
// ist, beantwortet der Belegungsplan aus dem Speicher.
//
// Behoben in #85: vorher las die Suche die Belegungen aus den Maschinen-
// Objekten, also nur die Beispieldaten, das Reservieren dagegen ueber den
// Speicher. Zwei Quellen fuer dieselbe Frage. Eine in der Anwendung angelegte
// Reservierung sah die Suche deshalb nicht, die Maschine stand im gebuchten
// Zeitraum weiter als frei in der Liste. Jetzt holt die Suche den Plan genau
// wie reservieren() ueber den Speicher, und beide bekommen dieselbe Antwort
// (ADR 0011).
//
// Deshalb ist suche() asynchron und bekommt den Speicher als Argument, wie
// reservieren() auch: die Fachlogik kennt nur die Schnittstelle, welche
// Umsetzung dahinter steht, entscheidet der Aufrufer.

import type { Maschine } from "./maschine";
import type { ReservierungSpeicher } from "./reservierung";
import { Zeitraum } from "./zeitraum";

export type Suchfilter = {
    kategorie?: string;
    standort?: string;
    von?: string;
    bis?: string;
};

export async function suche(
    alle: Maschine[],
    filter: Suchfilter,
    speicher: ReservierungSpeicher,
): Promise<Maschine[]> {
    const passend = alle.filter((maschine) =>
        maschine.passtZu(filter.kategorie, filter.standort),
    );

    // Ohne Zeitraum wird nicht nach Belegung gefiltert, dann braucht es auch
    // keinen Plan.
    const zeitraum = Zeitraum.ausEingabe(filter.von, filter.bis);
    if (!zeitraum) return passend;

    // Ein Plan je Maschine, alle Anfragen gleichzeitig. Mit der Datenbank aus
    // #45 ist das eine Abfrage je Maschine: bei zehn Maschinen kein Problem,
    // bei sehr vielen waere eine Methode fuer mehrere Maschinen auf einmal
    // besser.
    const frei = await Promise.all(
        passend.map(async (maschine) => {
            const plan = await speicher.belegungsplanFuer(maschine.inventarnummer);
            return plan.istFrei(zeitraum);
        }),
    );

    return passend.filter((_, i) => frei[i]);
}

/**
 * Die Auswahlwerte fuer das Suchformular, aus den Maschinen abgeleitet statt
 * doppelt gepflegt: eine neue Kategorie oder ein neuer Standort erscheint
 * allein dadurch im Formular, dass eine Maschine ihn hat.
 */
export function auswahlwerte(alle: Maschine[]): { kategorien: string[]; standorte: string[] } {
    return {
        kategorien: [...new Set(alle.map((m) => m.kategorie))].sort(),
        standorte: [...new Set(alle.map((m) => m.standort))].sort(),
    };
}
