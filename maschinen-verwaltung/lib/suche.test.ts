// Die Suche (#1) und ihr Fehler #85.
//
// Jeder Test bekommt einen frischen Speicher: der Arbeitsspeicher ist eine
// Liste im Modul, eine Reservierung aus einem Test waere sonst im naechsten
// noch da. vi.resetModules() laedt das Modul neu, und damit ist die Liste
// wieder auf dem Stand der Beispieldaten.

import { beforeEach, describe, expect, it, vi } from "vitest";
import { Maschine } from "./maschine";
import type { MaschinenSpeicher } from "./maschine";
import { Maschinentyp } from "./maschinentyp";
import { Protokolleintrag } from "./protokoll";
import { reservieren } from "./reservieren";
import { Kunde, type ReservierungSpeicher } from "./reservierung";
import { suche } from "./suche";

let speicher: ReservierungSpeicher & MaschinenSpeicher;

beforeEach(async () => {
    vi.resetModules();
    ({ arbeitsspeicher: speicher } = await import("./speicher/arbeitsspeicher"));
});

const kunde = new Kunde("Test Kunde", "test@example.org", "0221 123");

async function treffer(filter: Parameters<typeof suche>[1]): Promise<string[]> {
    const ergebnis = await suche(await speicher.maschinen(), filter, speicher);
    return ergebnis.map((m) => m.inventarnummer);
}

describe("Suche", () => {
    it("zeigt eine gerade reservierte Maschine nicht mehr als frei (#85)", async () => {
        const zeitraum = { von: "2026-12-01", bis: "2026-12-05" };
        expect(await treffer(zeitraum)).toContain("M-1002");

        const ergebnis = await reservieren(speicher, "M-1002", zeitraum.von, zeitraum.bis, kunde);
        expect(ergebnis.ok).toBe(true);

        expect(await treffer(zeitraum)).not.toContain("M-1002");
    });

    it("hält den Rückgabetag belegt: M-1001 am 28.09. belegt, am 29.09. frei", async () => {
        expect(await treffer({ von: "2026-09-28", bis: "2026-09-28" })).not.toContain("M-1001");
        expect(await treffer({ von: "2026-09-29", bis: "2026-09-29" })).toContain("M-1001");
    });

    it("filtert ohne Zeitraum nur nach Kategorie und Standort", async () => {
        expect(await treffer({ kategorie: "Erdbewegung" })).toEqual(["M-1001", "M-1002"]);
        expect(await treffer({ kategorie: "Erdbewegung", standort: "Bonn" })).toEqual(["M-1002"]);
    });

    it("findet eine neu angelegte Maschine (#2)", async () => {
        const walze = new Maschinentyp(4, "Grabenwalze 1,4 t", "Verdichtung");
        const neu = new Maschine({
            inventarnummer: "M-1011",
            typ: walze,
            seriennummer: "BW55-99999",
            baujahr: 2025,
            betriebsstunden: 0,
            wartungsintervall: 250,
            standort: "Bergisch Gladbach",
        });
        const eintrag = new Protokolleintrag("M-1011", "2026-11-12T10:00:00.000Z", "fj", "Datensatz angelegt", "", "M-1011");
        await speicher.maschineAnlegen(neu, eintrag);

        expect(await treffer({ standort: "Bergisch Gladbach" })).toEqual(["M-1011"]);
    });
});
