// Reservieren (#1): "Eine Reservierung auf einen belegten Zeitraum wird
// abgelehnt und der Konflikt benannt."

import { beforeEach, describe, expect, it, vi } from "vitest";
import { reservieren } from "./reservieren";
import { Kunde, type ReservierungSpeicher } from "./reservierung";

let speicher: ReservierungSpeicher;

beforeEach(async () => {
    vi.resetModules();
    ({ arbeitsspeicher: speicher } = await import("./speicher/arbeitsspeicher"));
});

const kunde = new Kunde("Test Kunde", "test@example.org", "0221 123");

describe("reservieren", () => {
    it("lehnt einen belegten Zeitraum ab und nennt die Belegung", async () => {
        const ergebnis = await reservieren(speicher, "M-1004", "2026-10-15", "2026-10-20", kunde);
        expect(ergebnis).toMatchObject({ ok: false, feld: "von" });
        expect(!ergebnis.ok && ergebnis.fehler).toContain("12.10.2026 bis 16.10.2026");
    });

    it("lehnt eine zweite Buchung im selben Zeitraum ab", async () => {
        const erste = await reservieren(speicher, "M-1002", "2026-12-01", "2026-12-05", kunde);
        expect(erste.ok && erste.reservierung.id).toBe("R-0001");

        const zweite = await reservieren(speicher, "M-1002", "2026-12-05", "2026-12-07", kunde);
        expect(zweite.ok).toBe(false);
    });

    it("meldet fehlende Kundendaten am betroffenen Feld", async () => {
        const ohneTelefon = new Kunde("Test Kunde", "test@example.org", " ");
        const ergebnis = await reservieren(speicher, "M-1002", "2026-12-01", "2026-12-02", ohneTelefon);
        expect(ergebnis).toMatchObject({ ok: false, feld: "telefon" });
    });
});
