// Fachlogik des Reservierens. Kennt nur die Schnittstelle, nicht den Speicher.
//
// Fehlerfaelle sind Rueckgabewerte, keine Ausnahmen. So steht es in
// docs/frontend-konventionen.md, Abschnitt 3: ein Reservierungskonflikt ist ein
// gueltiges fachliches Ergebnis, kein Absturz. Der Typ unten ist eine
// diskriminierte Vereinigung, "ok" ist das Unterscheidungsmerkmal. TypeScript
// erzwingt damit, dass der Aufrufer beide Faelle behandelt.
//
// Diese Funktion prueft nicht mehr selbst, was die Fachobjekte selbst wissen:
// der Zeitraum prueft seine Gueltigkeit, der Kunde seine Vollstaendigkeit, und
// die Maschine kennt ihre Belegungen. Hier bleibt nur die Reihenfolge und das
// Zusammensetzen (ADR 0004).

import { Zeitraum } from "./zeitraum";
import type { Feld, Kunde, Reservierung, ReservierungSpeicher } from "./reservierung";

export type ReservierungErgebnis =
    | { ok: true; reservierung: Reservierung }
    | { ok: false; fehler: string; feld: Feld };

export async function reservieren(
    speicher: ReservierungSpeicher,
    inventarnummer: string,
    von: string,
    bis: string,
    kunde: Kunde,
): Promise<ReservierungErgebnis> {
    // 1. Zeitraum. Der Zeitraum prueft sich selbst.
    if (!von || !bis) {
        return { ok: false, fehler: "Bitte Von- und Bis-Datum angeben.", feld: "von" };
    }

    const zeitfehler = Zeitraum.fehler(von, bis);
    if (zeitfehler) {
        return { ok: false, fehler: zeitfehler, feld: "bis" };
    }

    const zeitraum = new Zeitraum(von, bis);

    // 2. Kundendaten. Der Kunde prueft sich selbst.
    const fehlend = kunde.fehlendesFeld();
    if (fehlend) {
        return { ok: false, fehler: fehlend.fehler, feld: fehlend.feld };
    }

    // 3. Konflikt. Der Belegungsplan benennt den blockierenden Zeitraum, so
    //    verlangt es das Akzeptanzkriterium in #1: "wird abgelehnt und der
    //    Konflikt benannt".
    //
    //    Der Plan kommt ueber den Speicher und nicht aus den Beispieldaten,
    //    damit bereits angelegte Reservierungen mitzaehlen (ADR 0011).
    const plan = await speicher.belegungsplanFuer(inventarnummer);
    const konflikt = plan.konfliktMit(zeitraum);

    if (konflikt) {
        return {
            ok: false,
            fehler: `Die Maschine ist vom ${konflikt.alsText()} belegt.`,
            feld: "von",
        };
    }

    const reservierung = await speicher.anlegen(inventarnummer, zeitraum, kunde);
    return { ok: true, reservierung };
}
