// Fachlogik des Reservierens. Kennt nur die Schnittstelle, nicht den Speicher.
//
// Fehlerfaelle sind Rueckgabewerte, keine Ausnahmen. So steht es in
// docs/frontend-konventionen.md, Abschnitt 3: ein Reservierungskonflikt ist ein
// gueltiges Ergebnis, kein Absturz.

import type { Kunde, Reservierung, ReservierungSpeicher } from "./reservierungen";
import { ueberlappt, zeitraumFehler } from "./verfuegbarkeit";

export type Feld = "von" | "bis" | "name" | "email" | "telefon";

export type ReservierungErgebnis =
    | { ok: true; reservierung: Reservierung }
    | { ok: false; fehler: string; feld: Feld };

export type Reservierungswunsch = {
    inventarnummer: string;
    von: string;
    bis: string;
    kunde: Kunde;
};

export async function reservieren(
    speicher: ReservierungSpeicher,
    wunsch: Reservierungswunsch,
): Promise<ReservierungErgebnis> {
    // 1. Zeitraum
    if (!wunsch.von || !wunsch.bis) {
        return { ok: false, fehler: "Bitte Von- und Bis-Datum angeben.", feld: "von" };
    }

    const zeitfehler = zeitraumFehler(wunsch.von, wunsch.bis);
    if (zeitfehler) {
        return { ok: false, fehler: zeitfehler, feld: "bis" };
    }

    // 2. Kundendaten
    if (!wunsch.kunde.name.trim()) {
        return { ok: false, fehler: "Bitte einen Namen angeben.", feld: "name" };
    }
    if (!wunsch.kunde.email.includes("@")) {
        return { ok: false, fehler: "Bitte eine E-Mail-Adresse angeben.", feld: "email" };
    }
    if (!wunsch.kunde.telefon.trim()) {
        return {
            ok: false,
            fehler: "Bitte eine Telefonnummer für Rückfragen angeben.",
            feld: "telefon",
        };
    }

    // 3. Konflikt. Der belegte Zeitraum wird benannt, so verlangt es das
    //    Akzeptanzkriterium in #1: "wird abgelehnt und der Konflikt benannt".
    const belegungen = await speicher.belegungenFuer(wunsch.inventarnummer);
    const konflikt = belegungen.find((belegung) =>
        ueberlappt(belegung, { von: wunsch.von, bis: wunsch.bis }),
    );

    if (konflikt) {
        return {
            ok: false,
            fehler: `Die Maschine ist vom ${konflikt.von} bis ${konflikt.bis} belegt.`,
            feld: "von",
        };
    }

    const reservierung = await speicher.anlegen(wunsch);
    return { ok: true, reservierung };
}