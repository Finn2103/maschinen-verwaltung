// Umsetzung der Schnittstelle fuer den Zwischenstand ohne Datenbank (ADR 0011).
//
// ACHTUNG, Zwischenstand: die Liste liegt im Arbeitsspeicher des Serverprozesses.
// Sie ist nach einem Neustart leer und im Entwicklungsmodus auch nach einem
// Neuladen des Codes. Das Akzeptanzkriterium "nach dem Absenden ist die
// Reservierung gespeichert" aus #1 ist damit NICHT erfuellt.

import { maschinen, type Belegung } from "../maschinen";
import type { Reservierung, ReservierungSpeicher } from "../reservierungen";

const angelegteReservierungen: Reservierung[] = [];
let naechsteNummer = 1;

export const arbeitsspeicher: ReservierungSpeicher = {
    async belegungenFuer(inventarnummer: string): Promise<Belegung[]> {
        const ausBeispieldaten =
            maschinen.find((m) => m.inventarnummer === inventarnummer)?.belegungen ?? [];

        const ausReservierungen = angelegteReservierungen
            .filter((r) => r.inventarnummer === inventarnummer)
            .map((r) => ({ von: r.von, bis: r.bis }));

        return [...ausBeispieldaten, ...ausReservierungen];
    },

    async anlegen(neu: Omit<Reservierung, "id">): Promise<Reservierung> {
        const reservierung: Reservierung = {
            id: `R-${String(naechsteNummer).padStart(4, "0")}`,
            ...neu,
        };
        naechsteNummer += 1;
        angelegteReservierungen.push(reservierung);
        return reservierung;
    },
};