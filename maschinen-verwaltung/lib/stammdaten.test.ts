// Maschinenstammdaten (#2): Pruefregeln, doppelte Inventarnummer und
// Aenderungsprotokoll.
//
// "jetzt" ist fest, damit das Baujahr-Limit und die Zeitpunkte im Protokoll
// nicht vom Tag abhaengen, an dem der Test laeuft.

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MaschinenSpeicher } from "./maschine";
import type { MaschinenEingabe } from "./maschinenfelder";
import { maschineAendern, maschineAnlegen } from "./stammdaten";

let speicher: MaschinenSpeicher;

beforeEach(async () => {
    vi.resetModules();
    ({ arbeitsspeicher: speicher } = await import("./speicher/arbeitsspeicher"));
});

const jetzt = new Date("2026-11-12T09:42:00.000Z");

const gueltig: MaschinenEingabe = {
    inventarnummer: "M-1011",
    typnummer: "3",
    seriennummer: "BP25-60001",
    baujahr: "2026",
    betriebsstunden: "0",
    wartungsintervall: "250",
    standort: "Köln",
};

describe("Maschine anlegen", () => {
    it("lehnt doppelte Inventarnummer und negative Betriebsstunden gleichzeitig ab (Mockup 08)", async () => {
        const ergebnis = await maschineAnlegen(
            speicher,
            { ...gueltig, inventarnummer: "M-1001", betriebsstunden: "-50" },
            "fj",
            jetzt,
        );
        expect(ergebnis.ok).toBe(false);
        expect(!ergebnis.ok && Object.keys(ergebnis.fehler).sort()).toEqual(["betriebsstunden", "inventarnummer"]);
        expect(!ergebnis.ok && ergebnis.fehler.inventarnummer).toContain("Minibagger 1,8 t");
    });

    it("prüft Format, Baujahr in der Zukunft, Nachkommastellen und Intervall 0", async () => {
        const ergebnis = await maschineAnlegen(
            speicher,
            { ...gueltig, inventarnummer: "MV-12", baujahr: "2027", betriebsstunden: "12,25", wartungsintervall: "0" },
            "fj",
            jetzt,
        );
        expect(!ergebnis.ok && Object.keys(ergebnis.fehler).sort()).toEqual([
            "baujahr",
            "betriebsstunden",
            "inventarnummer",
            "wartungsintervall",
        ]);
    });

    it("legt eine gültige Maschine an und protokolliert das Anlegen", async () => {
        const ergebnis = await maschineAnlegen(speicher, { ...gueltig, inventarnummer: "m-1011" }, "fj", jetzt);
        expect(ergebnis.ok && ergebnis.maschine.inventarnummer).toBe("M-1011");

        const protokoll = await speicher.protokollFuer("M-1011");
        expect(protokoll.map((e) => [e.benutzer, e.feld, e.neu])).toEqual([["fj", "Datensatz angelegt", "M-1011"]]);
    });
});

describe("Maschine bearbeiten", () => {
    it("protokolliert nur die Felder, die sich wirklich geändert haben", async () => {
        const bisher = (await speicher.maschine("M-1003"))!.alsEingabe();
        const ergebnis = await maschineAendern(
            speicher,
            "M-1003",
            { ...bisher, betriebsstunden: "900,5", standort: "Bonn" },
            "a.boersch",
            jetzt,
        );
        expect(ergebnis.ok && ergebnis.aenderungen).toBe(2);

        const protokoll = await speicher.protokollFuer("M-1003");
        expect(protokoll.map((e) => [e.feld, e.alt, e.neu])).toEqual([
            ["Betriebsstunden", "860", "900,5"],
            ["Standort", "Köln", "Bonn"],
        ]);
    });

    it("schreibt beim Speichern ohne Änderung nichts ins Protokoll", async () => {
        const bisher = (await speicher.maschine("M-1003"))!.alsEingabe();
        const ergebnis = await maschineAendern(speicher, "M-1003", bisher, "a.boersch", jetzt);
        expect(ergebnis.ok && ergebnis.aenderungen).toBe(0);
        expect(await speicher.protokollFuer("M-1003")).toEqual([]);
    });

    it("übernimmt keine geänderte Inventarnummer aus dem Formular", async () => {
        const bisher = (await speicher.maschine("M-1003"))!.alsEingabe();
        await maschineAendern(speicher, "M-1003", { ...bisher, inventarnummer: "M-9999" }, "a.boersch", jetzt);
        expect(await speicher.maschine("M-9999")).toBeUndefined();
        expect(await speicher.maschine("M-1003")).toBeDefined();
    });
});
