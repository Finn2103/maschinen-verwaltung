// Rollen, Rechte und Beispielbenutzer fuer den Arbeitsspeicher (ADR 0011).
//
// Die Rollen und die Matrix sind KEINE Beispieldaten, sondern dieselben
// Zeilen, die docs/datenmodell/schema.sql in "rolle" und "rolle_recht"
// schreibt (Fassung 1 vom 16.11.2026). Bis die App PostgreSQL nutzt, liegt
// hier eine Kopie, in derselben Tabellenform wie im SQL, damit man beide
// nebeneinander lesen kann. lib/rechte.test.ts vergleicht sie Zeile fuer
// Zeile mit schema.sql. Wer die Matrix aendert, aendert sie dort; der Test
// zeigt, wenn die Kopie nicht mitgezogen wurde.
//
// Die Beispielbenutzer sind erfunden, einer je Rolle, fuer die
// Probe-Anmeldung bis #43. Namen wie im Mockup 11, wo es sie dort gibt.

import { Benutzer } from "../benutzer";
import type { Recht, Umfang } from "../rechte";

/** rolle (rolle, bezeichnung), wie in schema.sql. */
export const ROLLEN: readonly (readonly [string, string])[] = [
    ["kunde", "Kunde"],
    ["mitarbeiter", "Mitarbeiter"],
    ["manager", "Manager"],
    ["owner", "Owner"],
    ["admin", "Admin"],
];

type U = Umfang | null;

// null heisst "nein" und ergibt keine Zeile, wie NULL im SQL.
const MATRIX: readonly (readonly [Recht, U, U, U, U, U])[] = [
    // recht                            kunde     mitarbeiter manager owner   admin
    ["maschine.suchen",                 "alle",   "alle",     "alle", "alle", "alle"],
    ["ausleihe.reservieren",            "alle",   "alle",     "alle", "alle", "alle"],
    ["ausleihe.sehen",                  "eigene", "alle",     "alle", "alle", "alle"],
    ["ausleihe.stornieren",             "eigene", "alle",     "alle", "alle", "alle"],
    ["ausleihe.stornieren_nach_frist",  null,     "alle",     "alle", "alle", "alle"],
    ["ausleihe.status_sehen",           "eigene", "alle",     "alle", "alle", "alle"],
    ["ausleihe.aendern",                null,     "alle",     "alle", "alle", "alle"],
    ["maschine.liste",                  null,     "alle",     "alle", "alle", "alle"],
    ["maschine.anlegen",                null,     "alle",     "alle", "alle", "alle"],
    ["maschine.bearbeiten",             null,     "alle",     "alle", "alle", "alle"],
    ["maschine.ausser_dienst",          null,     "alle",     "alle", "alle", "alle"],
    ["wartung.sehen",                   null,     "alle",     "alle", "alle", "alle"],
    ["kunde.anlegen",                   "eigene", "alle",     "alle", "alle", "alle"],
    ["kunde.suchen",                    null,     "alle",     "alle", "alle", "alle"],
    ["kunde.sehen",                     "eigene", "alle",     "alle", "alle", "alle"],
    ["kunde.bearbeiten",                "eigene", "alle",     "alle", "alle", "alle"],
    ["rechnung.sehen",                  "eigene", "alle",     "alle", "alle", "alle"],
    ["rechnung.erstellen",              null,     "alle",     "alle", "alle", "alle"],
    ["rechnung.stornieren",             null,     "alle",     "alle", "alle", "alle"],
    ["bestellung.bestellen",            "eigene", "alle",     "alle", "alle", "alle"],
    ["protokoll.datensatz",             null,     "alle",     "alle", "alle", "alle"],
    ["protokoll.personen",              null,     null,       "alle", "alle", "alle"],
    ["protokoll.abgelehnte_zugriffe",   null,     null,       null,   "alle", "alle"],
    ["benutzer.rolle_zuweisen",         null,     null,       null,   "alle", "alle"],
    ["rolle.rechte_aendern",            null,     null,       null,   null,   "alle"],
    ["einstellung.stornofrist",         null,     null,       "alle", "alle", "alle"],
];

/** Eine Zeile von rolle_recht. */
export type RolleRecht = { rolle: string; recht: Recht; umfang: Umfang };

/** Die Matrix als Zeilen von rolle_recht, wie das INSERT … SELECT in schema.sql. */
export const ROLLE_RECHT: readonly RolleRecht[] = MATRIX.flatMap(([recht, ...spalten]) =>
    spalten.flatMap((umfang, i) => (umfang ? [{ rolle: ROLLEN[i][0], recht, umfang }] : [])),
);

const rollenname = (rolle: string) => ROLLEN.find(([r]) => r === rolle)?.[1] ?? rolle;

const benutzer = (nr: number, email: string, name: string, rolle: string, kundennummer: number | null = null) =>
    new Benutzer(
        // Feste UUIDs, damit eine Probe-Anmeldung einen Neustart uebersteht.
        `00000000-0000-4000-8000-${String(nr).padStart(12, "0")}`,
        email,
        name,
        rolle,
        rollenname(rolle),
        kundennummer,
    );

/** Einer je Rolle, in der Reihenfolge der Matrix. */
export const beispielBenutzer: readonly Benutzer[] = [
    benutzer(1, "einkauf@reuter-bau.de", "Bauunternehmung Reuter GmbH", "kunde", 1),
    benutzer(2, "a.boersch@maschinenpark.de", "Alexa Börsch", "mitarbeiter"),
    benutzer(3, "j.wirtz@maschinenpark.de", "Jonas Wirtz", "manager"),
    benutzer(4, "p.kessler@maschinenpark.de", "Petra Kessler", "owner"),
    benutzer(5, "f.jendras@maschinenpark.de", "Finn Jendras", "admin"),
];
