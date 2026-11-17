// Rechtepruefung gegen die Rollenmatrix (#8 Teil 1, Plan vom 16.11.2026).
//
// Die Matrix steht in docs/rollen-und-rechte.md und als Daten in der
// Datenbank: "rolle", "recht" und "rolle_recht" (#99, relational.md 4.7).
// Hier wird nur gefragt, ob es fuer Rolle und Recht eine Zeile gibt:
//
//   keine Zeile  darf nicht
//   "alle"       darf
//   "eigene"     darf, wenn der Datensatz die eigene Kundennummer traegt
//
// KEIN ROLLENNAME IM CODE. Diese Datei fragt nie "ist das ein Admin?". So
// verlangt es #8: Rechte sind "zur Laufzeit aenderbar, ohne Code anzupassen".
// Ein Recht entziehen heisst eine Zeile in rolle_recht loeschen.
//
// Fest im Code steht nur, welches Recht eine Stelle braucht (die Seite
// "Maschine anlegen" braucht "maschine.anlegen"), und was ein Besucher ohne
// Anmeldung darf. Der ist keine Rolle und hat keine Zeile (relational.md 4.7).
//
// Wer fragt, kommt bis zur Anmeldung (#43) aus der Probe-Anmeldung in der
// Kopfleiste (Antwort 60). Das ist eine Selbstauskunft wie vorher das Kuerzel
// (Antwort 37): jeder kann jede Rolle waehlen. Geprueft wird trotzdem auf dem
// Server, was die gewaehlte Rolle darf. Mit #43 aendert sich nur, woher der
// Benutzer kommt (app/sitzung.ts), nicht diese Datei.
//
// Mit PostgreSQL (ADR 0011) beantwortet RechteSpeicher.umfang() die Frage mit
// der Abfrage aus relational.md 4.7. Jede schreibende Anfrage setzt dann in
// ihrer Transaktion SET LOCAL app.benutzer_id, damit Trigger und Protokoll
// den Benutzer kennen (relational.md 4.8). An darf() und pruefe() aendert
// sich dabei nichts.

import type { Benutzer } from "./benutzer";

/**
 * Die 26 Aktionen der Matrix mit ihrer Bezeichnung, wie die Relation
 * "recht" in docs/datenmodell/schema.sql und in derselben Reihenfolge.
 * lib/rechte.test.ts vergleicht beides.
 */
export const RECHTE = {
    // Suchen und reservieren (#1)
    "maschine.suchen": "Maschinen suchen, freie Zeiträume sehen",
    "ausleihe.reservieren": "Verbindlich reservieren",
    "ausleihe.sehen": "Reservierungen sehen",
    "ausleihe.stornieren": "Stornieren bis zur Stornofrist",
    "ausleihe.stornieren_nach_frist": "Stornieren nach Ablauf der Frist",
    // Auftrag (#9)
    "ausleihe.status_sehen": "Auftragsstatus sehen",
    "ausleihe.aendern": "Auftrag ändern, als neuer Eintrag",
    // Maschinen (#2, #3)
    "maschine.liste": "Verwaltungsliste mit allen Feldern",
    "maschine.anlegen": "Maschine anlegen",
    "maschine.bearbeiten": "Maschine bearbeiten",
    "maschine.ausser_dienst": "Maschine außer Dienst stellen",
    "wartung.sehen": "Wartungsübersicht sehen",
    // Kunden (#7, #20)
    "kunde.anlegen": "Kunden anlegen",
    "kunde.suchen": "Kunden suchen",
    "kunde.sehen": "Kundendaten sehen",
    "kunde.bearbeiten": "Kundendaten bearbeiten",
    // Rechnung und Bestellung
    "rechnung.sehen": "Rechnungen sehen",
    "rechnung.erstellen": "Rechnung erstellen",
    "rechnung.stornieren": "Rechnung stornieren, als Storno-Rechnung",
    "bestellung.bestellen": "Verbrauchsmaterial bestellen, Bestellungen sehen",
    // Protokoll
    "protokoll.datensatz": "Änderungsprotokoll eines Datensatzes",
    "protokoll.personen": "Auswertung über Personen",
    "protokoll.abgelehnte_zugriffe": "Abgelehnte Zugriffe sehen",
    // Benutzer und Einstellungen (#8)
    "benutzer.rolle_zuweisen": "Rolle zuweisen",
    "rolle.rechte_aendern": "Rechte einer Rolle ändern",
    "einstellung.stornofrist": "Stornofrist einstellen",
} as const;

export type Recht = keyof typeof RECHTE;

/** rolle_recht.umfang: alle Datensaetze oder nur die eigenen. */
export type Umfang = "alle" | "eigene";

/**
 * Was ein Besucher ohne Anmeldung darf. "Ohne Anmeldung" ist keine Rolle und
 * steht deshalb nicht in rolle_recht.
 *
 * - suchen: ja (F5)
 * - sonst nichts. Reservieren und "Meine Reservierungen" nur mit Konto (F6).
 *   Bis zur Anmeldung (#43) heisst das: oben in der Probe-Anmeldung einen
 *   Benutzer waehlen, z. B. den Kunden (#125). Angemeldet bleibt es bei Name
 *   und E-Mail-Adresse aus dem Formular und bei "eigene" per E-Mail-Adresse
 *   und Vorgangsnummer (lib/uebersicht.ts, Weg A in #125).
 */
export const OHNE_ANMELDUNG: ReadonlyMap<Recht, Umfang> = new Map<Recht, Umfang>([
    ["maschine.suchen", "alle"],
]);

/** Die Gruende fuer eine Ablehnung, wie im Mockup 13. */
export type Grund = "keine Anmeldung" | "Recht fehlt für diese Rolle" | "fremder Datensatz";

/**
 * Ein abgelehnter Zugriff (#8: "Jeder abgelehnte Zugriffsversuch wird mit
 * Zeitpunkt, Benutzer und Ziel protokolliert"). Dazu Rolle und Grund wie im
 * Mockup 13. Wird nie geaendert, nur angelegt.
 *
 * Wo das in der Datenbank liegt, ist offen (F16). Bis dahin im
 * Arbeitsspeicher, wie das Aenderungsprotokoll.
 */
export class AbgelehnterZugriff {
    constructor(
        /** ISO-8601 mit Uhrzeit und Zeitzone. */
        readonly zeitpunkt: string,
        /** E-Mail-Adresse, leer heisst nicht angemeldet. */
        readonly benutzer: string,
        /** Bezeichnung der Rolle, leer heisst nicht angemeldet. */
        readonly rolle: string,
        /** Seite oder Aktion, z. B. "/verwaltung/maschinen". */
        readonly ziel: string,
        readonly grund: Grund,
    ) {}
}

/**
 * Der Vertrag zwischen Rechtepruefung und Speicher (ADR 0011), wie
 * MaschinenSpeicher und ReservierungSpeicher. Asynchron, weil die
 * PostgreSQL-Umsetzung es sein wird.
 */
export type RechteSpeicher = {
    benutzer(benutzerId: string): Promise<Benutzer | undefined>;
    /** Fuer die Auswahl in der Probe-Anmeldung. */
    alleBenutzer(): Promise<Benutzer[]>;
    /**
     * Der Umfang, den der Benutzer fuer das Recht hat, oder undefined, wenn
     * es keine Zeile gibt. Die Abfrage aus relational.md 4.7: benutzer JOIN
     * rolle_recht, nur aktive Benutzer.
     */
    umfang(benutzerId: string, recht: Recht): Promise<Umfang | undefined>;
    zugriffAbgelehntMerken(eintrag: AbgelehnterZugriff): Promise<void>;
    /** Neueste zuerst. */
    abgelehnteZugriffe(): Promise<AbgelehnterZugriff[]>;
};

/** Der Datensatz, um den es geht: wem er gehoert. Fuer den Umfang "eigene". */
export type Bezug = { kundennummer: number | null };

export type Pruefung =
    | { erlaubt: true; benutzer: Benutzer | null; umfang: Umfang }
    | { erlaubt: false; benutzer: Benutzer | null; grund: Grund; meldung: string };

/**
 * Wer ist angemeldet? Aus der benutzer_id der Probe-Anmeldung (bis #43).
 * Unbekannt oder deaktiviert heisst: nicht angemeldet. Der Wert kommt aus
 * einem Cookie, also aus dem Browser, und wird deshalb hier geprueft.
 */
export async function angemeldeterBenutzer(
    speicher: RechteSpeicher,
    benutzerId: string | undefined,
): Promise<Benutzer | null> {
    if (!benutzerId) return null;
    const benutzer = await speicher.benutzer(benutzerId);
    return benutzer?.aktiv ? benutzer : null;
}

/**
 * Darf der Benutzer das? Ohne Nebenwirkung, z. B. um einen Link nur zu
 * zeigen, wenn er auch zum Ziel fuehrt. Fuer Seiten und Aktionen gilt
 * pruefe(), das eine Ablehnung zusaetzlich festhaelt.
 *
 * "bezug" nur angeben, wenn es um einen bestimmten Datensatz geht. Ohne
 * bezug heisst "eigene": erlaubt, aber nur fuer eigene Datensaetze, die der
 * Aufrufer selbst auswaehlen muss.
 */
export async function darf(
    speicher: RechteSpeicher,
    benutzer: Benutzer | null,
    recht: Recht,
    bezug?: Bezug,
): Promise<Pruefung> {
    // Ein deaktivierter Benutzer zaehlt wie ohne Anmeldung.
    const wer = benutzer?.aktiv ? benutzer : null;
    const umfang = wer ? await speicher.umfang(wer.benutzerId, recht) : OHNE_ANMELDUNG.get(recht);

    if (!umfang) {
        return wer
            ? abgelehnt(wer, "Recht fehlt für diese Rolle", `Ihre Rolle ${wer.rollenname} darf das nicht: ${RECHTE[recht]}.`)
            : abgelehnt(null, "keine Anmeldung", ohneAnmeldung(recht));
    }

    if (umfang === "eigene" && bezug && !wer?.istEigentuemerVon(bezug.kundennummer)) {
        return wer
            ? abgelehnt(
                  wer,
                  "fremder Datensatz",
                  `Das ist nicht Ihr Datensatz. Ihre Rolle ${wer.rollenname} darf das nur bei eigenen: ${RECHTE[recht]}.`,
              )
            : abgelehnt(null, "keine Anmeldung", ohneAnmeldung(recht));
    }

    return { erlaubt: true, benutzer: wer, umfang };
}

/**
 * darf() fuer eine Seite oder Aktion: eine Ablehnung wird mit Zeitpunkt,
 * Benutzer, Rolle, Ziel und Grund festgehalten (#8, Kriterium 5).
 *
 * Jede Server Action ruft das selbst auf, bevor sie etwas tut. Eine Server
 * Action ist eine oeffentliche Adresse und laesst sich ohne Formular direkt
 * aufrufen. Einen Knopf zu verstecken waere keine Pruefung (Next.js-Doku,
 * Server Actions, "Authenticate and authorize").
 */
export async function pruefe(
    speicher: RechteSpeicher,
    benutzer: Benutzer | null,
    recht: Recht,
    ziel: string,
    optionen: { bezug?: Bezug; jetzt?: Date } = {},
): Promise<Pruefung> {
    const ergebnis = await darf(speicher, benutzer, recht, optionen.bezug);
    if (!ergebnis.erlaubt) {
        await speicher.zugriffAbgelehntMerken(
            new AbgelehnterZugriff(
                (optionen.jetzt ?? new Date()).toISOString(),
                ergebnis.benutzer?.email ?? "",
                ergebnis.benutzer?.rollenname ?? "",
                ziel,
                ergebnis.grund,
            ),
        );
    }
    return ergebnis;
}

function abgelehnt(benutzer: Benutzer | null, grund: Grund, meldung: string): Pruefung {
    return { erlaubt: false, benutzer, grund, meldung };
}

function ohneAnmeldung(recht: Recht): string {
    return `Dafür müssen Sie angemeldet sein: ${RECHTE[recht]}. Bis zur Anmeldung (#43) wählen Sie oben einen Benutzer aus.`;
}
