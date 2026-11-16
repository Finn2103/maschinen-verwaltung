// Meine Reservierungen (#1): E-Mail-Adresse und Vorgangsnummer muessen zu einer
// Reservierung passen, dann sieht der Kunde alle Reservierungen dieser Adresse,
// und nur diese.

import { beforeEach, describe, expect, it, vi } from "vitest";
import { reservieren } from "./reservieren";
import { Kunde, type ReservierungSpeicher } from "./reservierung";
import { meineReservierungen } from "./uebersicht";

let speicher: ReservierungSpeicher;

beforeEach(async () => {
    vi.resetModules();
    ({ arbeitsspeicher: speicher } = await import("./speicher/arbeitsspeicher"));

    const reuter = new Kunde("Reuter Bau", "einkauf@reuter-bau.de", "0221 1");
    const andere = new Kunde("Andere GmbH", "info@andere.de", "0228 2");
    await reservieren(speicher, "M-1002", "2026-11-16", "2026-11-18", reuter); // R-0001
    await reservieren(speicher, "M-1005", "2026-12-07", "2026-12-08", andere); // R-0002
    await reservieren(speicher, "M-1003", "2026-12-01", "2026-12-05", reuter); // R-0003
});

describe("meineReservierungen", () => {
    it("zeigt mit E-Mail und eigener Vorgangsnummer alle Reservierungen dieser Adresse", async () => {
        const ergebnis = await meineReservierungen(speicher, " Einkauf@Reuter-Bau.DE ", "r-0001");
        expect(ergebnis.ok && ergebnis.reservierungen.map((r) => r.id)).toEqual(["R-0003", "R-0001"]);
    });

    it("lehnt eine fremde Vorgangsnummer ab, ohne zu sagen, was nicht passt", async () => {
        const ergebnis = await meineReservierungen(speicher, "einkauf@reuter-bau.de", "R-0002");
        expect(ergebnis.ok).toBe(false);
        expect(!ergebnis.ok && ergebnis.fehler).toEqual({
            vorgangsnummer: expect.stringContaining("Zu dieser E-Mail-Adresse und Vorgangsnummer"),
        });
    });
});
