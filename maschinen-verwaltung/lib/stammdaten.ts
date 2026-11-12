// Fachlogik der Maschinenstammdaten (#2). Kennt nur die Schnittstelle, nicht
// den Speicher, wie reservieren.ts.
//
// Fehlerfaelle sind Rueckgabewerte, keine Ausnahmen (docs/frontend-
// konventionen.md, Abschnitt 3). Was die Maschine selbst weiss, prueft sie
// selbst (Maschine.pruefe). Hier bleibt, was nur mit dem Speicher geht: ob die
// Inventarnummer schon vergeben ist, und was sich gegenueber dem
// gespeicherten Stand geaendert hat. Dazu das Protokoll.
//
// BENUTZER: Ohne Anmeldung (#43) gibt es kein "ich". Bis dahin traegt, wer
// speichert, sein Kuerzel selbst ein. Das ist eine Selbstauskunft, keine
// gepruefte Identitaet, und als Frage an Finn offen (Bericht #29). Mit der
// Anmeldung kommt der Benutzer aus der Sitzung, an dieser Datei aendert sich
// dann nur, woher das Argument "benutzer" stammt.

import { Maschine, type MaschinenSpeicher } from "./maschine";
import { FELDNAMEN, type Feldfehler, type MaschinenEingabe } from "./maschinenfelder";
import { DATENSATZ_ANGELEGT, Protokolleintrag } from "./protokoll";

/** Fehler an einem Maschinenfeld oder am Kuerzel. */
export type StammdatenFehler = Feldfehler & { benutzer?: string };

export type StammdatenErgebnis =
    | { ok: true; maschine: Maschine; aenderungen: number }
    | { ok: false; fehler: StammdatenFehler };

const KUERZEL_MAX = 40;

function benutzerFehler(benutzer: string): string | undefined {
    const b = benutzer.trim();
    if (!b) return "Bitte Ihr Kürzel angeben, zum Beispiel f.jendras. Es steht im Änderungsprotokoll.";
    if (b.length > KUERZEL_MAX) return `Bitte höchstens ${KUERZEL_MAX} Zeichen angeben.`;
    return undefined;
}

export async function maschineAnlegen(
    speicher: MaschinenSpeicher,
    eingabe: MaschinenEingabe,
    benutzer: string,
    jetzt: Date = new Date(),
): Promise<StammdatenErgebnis> {
    const typen = await speicher.maschinentypen();
    const geprueft = Maschine.pruefe(eingabe, typen, jetzt.getFullYear());
    const fehler: StammdatenFehler = { ...geprueft.fehler };

    // "Eine zweite Maschine mit derselben Inventarnummer wird abgelehnt" (#2).
    // Die Meldung nennt, an wen die Nummer vergeben ist, wie Mockup 08.
    const inventarnummer = Maschine.normiereInventarnummer(eingabe.inventarnummer);
    if (!fehler.inventarnummer) {
        const vorhanden = await speicher.maschine(inventarnummer);
        if (vorhanden) {
            fehler.inventarnummer = `Die Inventarnummer ${inventarnummer} ist bereits an ${vorhanden.bezeichnung} vergeben. Bitte eine andere wählen.`;
        }
    }

    const fuerBenutzer = benutzerFehler(benutzer);
    if (fuerBenutzer) fehler.benutzer = fuerBenutzer;

    if (!geprueft.maschine || Object.keys(fehler).length > 0) {
        return { ok: false, fehler };
    }

    const eintrag = new Protokolleintrag(
        inventarnummer,
        jetzt.toISOString(),
        benutzer.trim(),
        DATENSATZ_ANGELEGT,
        "",
        inventarnummer,
    );

    // Zweite Sicherung: zwischen der Pruefung oben und dem Speichern koennte
    // eine andere Anfrage dieselbe Nummer angelegt haben. In der Datenbank
    // faengt das der Primaerschluessel ab, hier der Speicher.
    const angelegt = await speicher.maschineAnlegen(geprueft.maschine, eintrag);
    if (!angelegt) {
        return {
            ok: false,
            fehler: {
                inventarnummer: `Die Inventarnummer ${inventarnummer} wurde gerade vergeben. Bitte eine andere wählen.`,
            },
        };
    }

    return { ok: true, maschine: geprueft.maschine, aenderungen: 1 };
}

export async function maschineAendern(
    speicher: MaschinenSpeicher,
    inventarnummer: string,
    eingabe: MaschinenEingabe,
    benutzer: string,
    jetzt: Date = new Date(),
): Promise<StammdatenErgebnis> {
    const bisher = await speicher.maschine(inventarnummer);
    if (!bisher) {
        return {
            ok: false,
            fehler: { inventarnummer: `Die Maschine ${inventarnummer} gibt es nicht. Bitte zurück zur Liste.` },
        };
    }

    // Die Inventarnummer ist der Schluessel der Maschine, an ihr haengen
    // Reservierungen. Sie wird beim Bearbeiten nicht aus dem Formular
    // uebernommen, auch wenn jemand das Feld im Browser veraendert.
    const typen = await speicher.maschinentypen();
    const geprueft = Maschine.pruefe({ ...eingabe, inventarnummer }, typen, jetzt.getFullYear());
    const fehler: StammdatenFehler = { ...geprueft.fehler };

    const fuerBenutzer = benutzerFehler(benutzer);
    if (fuerBenutzer) fehler.benutzer = fuerBenutzer;

    if (!geprueft.maschine || Object.keys(fehler).length > 0) {
        return { ok: false, fehler };
    }

    const aenderungen = bisher.unterschiedeZu(geprueft.maschine);

    // Nichts geaendert: nichts speichern und nichts protokollieren. Ein
    // Protokoll voller Eintraege ohne Unterschied verdeckt die echten.
    if (aenderungen.length === 0) {
        return { ok: true, maschine: bisher, aenderungen: 0 };
    }

    const zeitpunkt = jetzt.toISOString();
    const eintraege = aenderungen.map(
        (a) =>
            new Protokolleintrag(
                inventarnummer,
                zeitpunkt,
                benutzer.trim(),
                FELDNAMEN[a.feld],
                a.alt,
                a.neu,
            ),
    );

    await speicher.maschineAendern(geprueft.maschine, eintraege);
    return { ok: true, maschine: geprueft.maschine, aenderungen: eintraege.length };
}
