// Die Ueberlappungsregel (#1). Geschlossene Intervalle: von und bis gehoeren
// beide dazu, der Rueckgabetag bleibt belegt (entschieden am 08.10.2026,
// docs/frontend-konventionen.md, Abschnitt 4).

import { describe, expect, it } from "vitest";
import { Belegungsplan } from "./belegungsplan";
import { Zeitraum } from "./zeitraum";

const belegt = new Zeitraum("2026-10-05", "2026-10-09");

describe("Zeitraum.ueberlappt", () => {
    it("erkennt Überlappung von links, von rechts, als Teil und als Ganzes", () => {
        expect(belegt.ueberlappt(new Zeitraum("2026-10-01", "2026-10-06"))).toBe(true);
        expect(belegt.ueberlappt(new Zeitraum("2026-10-08", "2026-10-12"))).toBe(true);
        expect(belegt.ueberlappt(new Zeitraum("2026-10-06", "2026-10-07"))).toBe(true);
        expect(belegt.ueberlappt(new Zeitraum("2026-10-01", "2026-10-31"))).toBe(true);
        expect(belegt.ueberlappt(new Zeitraum("2026-10-05", "2026-10-09"))).toBe(true);
    });

    it("hält den Rückgabetag belegt und gibt den Tag danach frei", () => {
        expect(belegt.ueberlappt(new Zeitraum("2026-10-09", "2026-10-12"))).toBe(true);
        expect(belegt.ueberlappt(new Zeitraum("2026-10-10", "2026-10-12"))).toBe(false);
        expect(belegt.ueberlappt(new Zeitraum("2026-10-01", "2026-10-04"))).toBe(false);
    });
});

describe("Zeitraum.fehler", () => {
    it("verlangt beide Daten oder keins und Bis nicht vor Von", () => {
        expect(Zeitraum.fehler(undefined, undefined)).toBeNull();
        expect(Zeitraum.fehler("2026-10-05", undefined)).not.toBeNull();
        expect(Zeitraum.fehler("2026-10-09", "2026-10-05")).not.toBeNull();
        expect(Zeitraum.fehler("2026-10-05", "2026-10-05")).toBeNull();
    });
});

describe("Belegungsplan", () => {
    it("nennt die Belegung, die einen Zeitraum blockiert", () => {
        const plan = new Belegungsplan([belegt, new Zeitraum("2026-10-19", "2026-10-23")]);
        expect(plan.konfliktMit(new Zeitraum("2026-10-20", "2026-10-21"))?.von).toBe("2026-10-19");
        expect(plan.istFrei(new Zeitraum("2026-10-12", "2026-10-16"))).toBe(true);
    });
});
