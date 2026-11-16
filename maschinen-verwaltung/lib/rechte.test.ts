// Rechtepruefung (#8 Teil 1): die Matrix im Code gleich schema.sql, jede
// Stelle der App mit jeder Rolle, "eigene", Rechte zur Laufzeit, abgelehnte
// Zugriffe.
//
// Der Arbeitsspeicher wird vor jedem Test neu geladen, damit gemerkte
// Ablehnungen nicht von einem Test in den naechsten laufen.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Benutzer, imProtokoll } from "./benutzer";
import {
    angemeldeterBenutzer,
    darf,
    OHNE_ANMELDUNG,
    pruefe,
    RECHTE,
    type AbgelehnterZugriff,
    type Recht,
    type RechteSpeicher,
    type Umfang,
} from "./rechte";
import { beispielBenutzer, ROLLE_RECHT, ROLLEN, type RolleRecht } from "./speicher/rechtematrix";
import type { MaschinenSpeicher } from "./maschine";
import { maschineAnlegen } from "./stammdaten";

let speicher: RechteSpeicher & MaschinenSpeicher;

beforeEach(async () => {
    vi.resetModules();
    ({ arbeitsspeicher: speicher } = await import("./speicher/arbeitsspeicher"));
});

const jetzt = new Date("2026-11-16T14:30:00.000Z");

/** Der Beispielbenutzer einer Rolle. */
const als = (rolle: string): Benutzer => {
    const benutzer = beispielBenutzer.find((b) => b.rolle === rolle);
    if (!benutzer) throw new Error(`kein Beispielbenutzer für ${rolle}`);
    return benutzer;
};

describe("Matrix im Code gleich docs/datenmodell/schema.sql", () => {
    const sql = readFileSync(fileURLToPath(new URL("../../docs/datenmodell/schema.sql", import.meta.url)), "utf8");

    const abschnitt = (anfang: string, ende: string) => {
        const a = sql.indexOf(anfang);
        if (a === -1) throw new Error(`nicht in schema.sql: ${anfang}`);
        return sql.slice(a + anfang.length, sql.indexOf(ende, a));
    };
    const paare = (text: string) => [...text.matchAll(/\('([a-z_.]+)',\s*'([^']*)'\)/g)].map((m) => [m[1], m[2]]);

    it("hat dieselben 5 Rollen", () => {
        expect(paare(abschnitt("INSERT INTO rolle (rolle, bezeichnung) VALUES", ";"))).toEqual(
            ROLLEN.map(([r, b]) => [r, b]),
        );
    });

    it("hat dieselben 26 Rechte mit Bezeichnung, in derselben Reihenfolge", () => {
        const ausSql = paare(abschnitt("INSERT INTO recht (recht, bezeichnung) VALUES", ";"));
        expect(ausSql).toHaveLength(26);
        expect(ausSql).toEqual(Object.entries(RECHTE));
    });

    it("hat dieselben 105 Zeilen in rolle_recht, 8 davon mit eigene", () => {
        // Die Spaltenreihenfolge der Matrix im SQL, damit ein Umstellen dort auffaellt.
        expect(sql).toContain(") AS m (recht, kunde, mitarbeiter, manager, owner, admin)");
        const spalten = ["kunde", "mitarbeiter", "manager", "owner", "admin"];
        const wert = "(NULL|'alle'|'eigene')";
        const zeile = new RegExp(`\\('([a-z_.]+)',\\s*${Array(5).fill(wert).join(",\\s*")}\\)`, "g");

        const ausSql: RolleRecht[] = [...abschnitt("FROM (VALUES", ") AS m (").matchAll(zeile)].flatMap((m) =>
            spalten.flatMap((rolle, i) =>
                m[i + 2] === "NULL"
                    ? []
                    : [{ rolle, recht: m[1] as Recht, umfang: m[i + 2].replaceAll("'", "") as Umfang }],
            ),
        );

        expect(ausSql).toHaveLength(105);
        expect(ausSql.filter((z) => z.umfang === "eigene")).toHaveLength(8);
        expect(ROLLE_RECHT).toEqual(ausSql);
    });

    it("hat einen Beispielbenutzer je Rolle", () => {
        expect(beispielBenutzer.map((b) => b.rolle)).toEqual(ROLLEN.map(([r]) => r));
    });
});

describe("Wer an welche Stelle der App darf", () => {
    // Die Tabelle „Wo geprüft wird“ aus dem Plan vom 16.11.: je Stelle das
    // Recht und wer es hat. ohne = ohne Anmeldung.
    const PERSONAL = { ohne: false, kunde: false, mitarbeiter: true, manager: true, owner: true, admin: true };
    const ALLE = { ohne: true, kunde: true, mitarbeiter: true, manager: true, owner: true, admin: true };
    const stellen: [string, Recht, Record<string, boolean>][] = [
        ["Maschinen suchen", "maschine.suchen", ALLE],
        ["Verbindlich reservieren (ohne Anmeldung bis #43)", "ausleihe.reservieren", ALLE],
        ["Meine Reservierungen (ohne Anmeldung bis #43)", "ausleihe.sehen", ALLE],
        ["Verwaltungsliste", "maschine.liste", PERSONAL],
        ["Maschine anlegen", "maschine.anlegen", PERSONAL],
        ["Maschine bearbeiten", "maschine.bearbeiten", PERSONAL],
        ["Änderungsprotokoll", "protokoll.datensatz", PERSONAL],
        [
            "Abgelehnte Zugriffe",
            "protokoll.abgelehnte_zugriffe",
            { ohne: false, kunde: false, mitarbeiter: false, manager: false, owner: true, admin: true },
        ],
    ];

    const faelle = stellen.flatMap(([stelle, recht, erwartet]) =>
        Object.entries(erwartet).map(([wer, erlaubt]) => ({ stelle, recht, wer, erlaubt })),
    );

    it.each(faelle)("$stelle: $wer → $erlaubt", async ({ recht, wer, erlaubt }) => {
        const benutzer = wer === "ohne" ? null : als(wer);
        expect((await darf(speicher, benutzer, recht)).erlaubt).toBe(erlaubt);
    });

    it("nennt ohne Anmeldung den Grund „keine Anmeldung“", async () => {
        const ergebnis = await darf(speicher, null, "maschine.liste");
        expect(!ergebnis.erlaubt && ergebnis.grund).toBe("keine Anmeldung");
        expect(!ergebnis.erlaubt && ergebnis.meldung).toContain("Verwaltungsliste mit allen Feldern");
    });

    it("nennt bei fehlendem Recht die Rolle", async () => {
        const ergebnis = await darf(speicher, als("kunde"), "maschine.anlegen");
        expect(!ergebnis.erlaubt && ergebnis.grund).toBe("Recht fehlt für diese Rolle");
        expect(!ergebnis.erlaubt && ergebnis.meldung).toBe("Ihre Rolle Kunde darf das nicht: Maschine anlegen.");
    });

    it("lässt ohne Anmeldung nur suchen, reservieren und die eigenen Reservierungen sehen (bis #43)", () => {
        expect([...OHNE_ANMELDUNG.keys()]).toEqual(["maschine.suchen", "ausleihe.reservieren", "ausleihe.sehen"]);
    });
});

describe("Umfang „eigene“", () => {
    it("erlaubt dem Kunden den eigenen Datensatz und lehnt einen fremden ab", async () => {
        const kunde = als("kunde");
        expect(kunde.kundennummer).toBe(1);

        const eigen = await darf(speicher, kunde, "ausleihe.sehen", { kundennummer: 1 });
        expect(eigen.erlaubt && eigen.umfang).toBe("eigene");

        const fremd = await darf(speicher, kunde, "ausleihe.sehen", { kundennummer: 2 });
        expect(!fremd.erlaubt && fremd.grund).toBe("fremder Datensatz");
    });

    it("erlaubt dem Personal jeden Datensatz", async () => {
        const ergebnis = await darf(speicher, als("mitarbeiter"), "ausleihe.sehen", { kundennummer: 2 });
        expect(ergebnis.erlaubt && ergebnis.umfang).toBe("alle");
    });

    it("gibt einem Kunden ohne eigenen Kundendatensatz nichts (F14)", async () => {
        const ohneDatensatz = new Benutzer("u-9", "neu@example.org", "Neukunde", "kunde", "Kunde", null);
        const stub = speicherMit(ROLLE_RECHT, [ohneDatensatz]);
        const ergebnis = await darf(stub, ohneDatensatz, "kunde.sehen", { kundennummer: null });
        expect(!ergebnis.erlaubt && ergebnis.grund).toBe("fremder Datensatz");
    });

    it("lehnt ohne Anmeldung einen bestimmten Datensatz ab", async () => {
        const ergebnis = await darf(speicher, null, "ausleihe.sehen", { kundennummer: 1 });
        expect(!ergebnis.erlaubt && ergebnis.grund).toBe("keine Anmeldung");
    });
});

/** Ein Speicher nur fuer Rechte, mit Zeilen und Benutzern, die der Test vorgibt. */
function speicherMit(zeilen: readonly RolleRecht[], benutzer: readonly Benutzer[]): RechteSpeicher {
    const abgelehnt: AbgelehnterZugriff[] = [];
    return {
        benutzer: async (id) => benutzer.find((b) => b.benutzerId === id),
        alleBenutzer: async () => [...benutzer],
        umfang: async (id, recht) => {
            const b = benutzer.find((x) => x.benutzerId === id && x.aktiv);
            return b && zeilen.find((z) => z.rolle === b.rolle && z.recht === recht)?.umfang;
        },
        zugriffAbgelehntMerken: async (e) => void abgelehnt.push(e),
        abgelehnteZugriffe: async () => [...abgelehnt].reverse(),
    };
}

describe("Rechte und Rollen zur Laufzeit, ohne Code anzupassen (#8)", () => {
    const mitarbeiter = als("mitarbeiter");

    it("lehnt ab, sobald die Zeile in rolle_recht fehlt", async () => {
        const ohneZeile = ROLLE_RECHT.filter((z) => !(z.rolle === "mitarbeiter" && z.recht === "maschine.anlegen"));
        expect(ohneZeile).toHaveLength(104);

        expect((await darf(speicherMit(ROLLE_RECHT, [mitarbeiter]), mitarbeiter, "maschine.anlegen")).erlaubt).toBe(true);
        expect((await darf(speicherMit(ohneZeile, [mitarbeiter]), mitarbeiter, "maschine.anlegen")).erlaubt).toBe(false);
    });

    it("erlaubt, sobald eine Zeile dazukommt", async () => {
        const kunde = als("kunde");
        const mitZeile = [...ROLLE_RECHT, { rolle: "kunde", recht: "maschine.liste" as Recht, umfang: "alle" as Umfang }];
        expect((await darf(speicherMit(mitZeile, [kunde]), kunde, "maschine.liste")).erlaubt).toBe(true);
    });

    it("folgt einer geänderten Rolle des Benutzers", async () => {
        const befoerdert = new Benutzer(mitarbeiter.benutzerId, mitarbeiter.email, mitarbeiter.name, "owner", "Owner");
        const stub = speicherMit(ROLLE_RECHT, [befoerdert]);
        expect((await darf(stub, befoerdert, "protokoll.abgelehnte_zugriffe")).erlaubt).toBe(true);
    });
});

describe("Angemeldeter Benutzer aus der Probe-Anmeldung", () => {
    const admin = als("admin");
    const deaktiviert = new Benutzer("u-alt", "alt@maschinenpark.de", "Ehemalig", "admin", "Admin", null, false);

    it("findet einen bekannten, aktiven Benutzer", async () => {
        // toEqual, nicht toBe: der Speicher wird je Test neu geladen, seine
        // Benutzer sind deshalb andere Objekte mit denselben Werten.
        expect(await angemeldeterBenutzer(speicher, admin.benutzerId)).toEqual(admin);
    });

    it("gibt nichts zurück ohne Wert, bei unbekannter ID und bei deaktiviertem Benutzer", async () => {
        expect(await angemeldeterBenutzer(speicher, undefined)).toBeNull();
        expect(await angemeldeterBenutzer(speicher, "gibt-es-nicht")).toBeNull();
        expect(await angemeldeterBenutzer(speicherMit(ROLLE_RECHT, [deaktiviert]), "u-alt")).toBeNull();
    });

    it("behandelt einen deaktivierten Benutzer wie ohne Anmeldung", async () => {
        const ergebnis = await darf(speicherMit(ROLLE_RECHT, [deaktiviert]), deaktiviert, "maschine.liste");
        expect(!ergebnis.erlaubt && ergebnis.grund).toBe("keine Anmeldung");
    });
});

describe("Abgelehnte Zugriffe (#8, Kriterium 5)", () => {
    it("merkt eine Ablehnung mit Zeitpunkt, Benutzer, Rolle, Ziel und Grund", async () => {
        const ergebnis = await pruefe(speicher, als("kunde"), "maschine.anlegen", "Aktion: Maschine anlegen (M-1011)", {
            jetzt,
        });
        expect(ergebnis.erlaubt).toBe(false);
        expect(await speicher.abgelehnteZugriffe()).toEqual([
            {
                zeitpunkt: "2026-11-16T14:30:00.000Z",
                benutzer: "einkauf@reuter-bau.de",
                rolle: "Kunde",
                ziel: "Aktion: Maschine anlegen (M-1011)",
                grund: "Recht fehlt für diese Rolle",
            },
        ]);
    });

    it("merkt ohne Anmeldung einen leeren Benutzer, neueste zuerst", async () => {
        await pruefe(speicher, null, "maschine.liste", "/verwaltung/maschinen", { jetzt });
        await pruefe(speicher, null, "protokoll.datensatz", "/verwaltung/maschinen/M-1003/protokoll", {
            jetzt: new Date("2026-11-16T14:31:00.000Z"),
        });
        const eintraege = await speicher.abgelehnteZugriffe();
        expect(eintraege.map((e) => [e.benutzer, e.rolle, e.ziel, e.grund])).toEqual([
            ["", "", "/verwaltung/maschinen/M-1003/protokoll", "keine Anmeldung"],
            ["", "", "/verwaltung/maschinen", "keine Anmeldung"],
        ]);
    });

    it("merkt nichts, wenn der Zugriff erlaubt ist", async () => {
        await pruefe(speicher, als("mitarbeiter"), "maschine.liste", "/verwaltung/maschinen", { jetzt });
        expect(await speicher.abgelehnteZugriffe()).toEqual([]);
    });
});

describe("Benutzer im Änderungsprotokoll", () => {
    it("ist die E-Mail-Adresse des angemeldeten Benutzers", async () => {
        const mitarbeiter = als("mitarbeiter");
        const ergebnis = await maschineAnlegen(
            speicher,
            {
                inventarnummer: "M-1011",
                typnummer: "3",
                seriennummer: "BP25-60001",
                baujahr: "2026",
                betriebsstunden: "0",
                wartungsintervall: "",
                standort: "Köln",
            },
            imProtokoll(mitarbeiter),
            jetzt,
        );
        expect(ergebnis.ok).toBe(true);
        const protokoll = await speicher.protokollFuer("M-1011");
        expect(protokoll.map((e) => e.benutzer)).toEqual(["a.boersch@maschinenpark.de"]);
    });
});
