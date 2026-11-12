// Fachlogik von "Meine Reservierungen" (#1, Mockup 05): "Nach dem Absenden
// ist die Reservierung gespeichert und in der Uebersicht des Kunden sichtbar."
//
// Ohne Anmeldung (#43) gibt es kein "ich". Entschieden von Finn am 12.11.:
// der Kunde weist sich mit E-Mail-Adresse UND Vorgangsnummer aus. Beides muss
// zu einer Reservierung passen, dann sieht er alle Reservierungen zu dieser
// E-Mail-Adresse. Die E-Mail allein reicht nicht, sonst saehe jeder, der eine
// fremde Adresse kennt, deren Reservierungen. Das verlangt #8: "Ein Kunde sieht
// ausschliesslich eigene Reservierungen".
//
// Passt eines von beiden nicht, sagt die Meldung NICHT, welches. Sonst liesse
// sich ausprobieren, welche E-Mail-Adressen bei uns gebucht haben.
//
// Bekannte Schwaeche bis #43: die Vorgangsnummern sind fortlaufend. Wer eine
// fremde E-Mail-Adresse kennt, koennte Nummern durchprobieren. Eine Sperre nach
// mehreren Fehlversuchen gibt es nicht. Mit der Anmeldung faellt das weg, dann
// kommt der Kunde aus der Sitzung und nicht aus dem Formular.

import { Kunde, type Reservierung, type ReservierungSpeicher } from "./reservierung";

export type UebersichtFeld = "email" | "vorgangsnummer";

export type UebersichtErgebnis =
    | { ok: true; reservierungen: Reservierung[] }
    | { ok: false; fehler: Partial<Record<UebersichtFeld, string>> };

const VORGANGSNUMMER = /^R-\d{4,}$/;

export async function meineReservierungen(
    speicher: ReservierungSpeicher,
    email: string,
    vorgangsnummer: string,
): Promise<UebersichtErgebnis> {
    const fehler: Partial<Record<UebersichtFeld, string>> = {};
    const adresse = Kunde.normiereEmail(email);
    const nummer = vorgangsnummer.trim().toUpperCase();

    if (!adresse) {
        fehler.email = "Bitte die E-Mail-Adresse angeben, mit der Sie reserviert haben.";
    } else if (!adresse.includes("@")) {
        fehler.email = "Bitte eine vollständige E-Mail-Adresse angeben, zum Beispiel name@firma.de.";
    }

    if (!nummer) {
        fehler.vorgangsnummer =
            "Bitte die Vorgangsnummer aus der Bestätigung angeben, zum Beispiel R-0001.";
    } else if (!VORGANGSNUMMER.test(nummer)) {
        fehler.vorgangsnummer =
            "Die Vorgangsnummer hat das Format R und vier Ziffern, zum Beispiel R-0001.";
    }

    if (Object.keys(fehler).length > 0) return { ok: false, fehler };

    const nachweis = await speicher.reservierung(nummer);
    if (!nachweis || !nachweis.kunde.hatEmail(adresse)) {
        return {
            ok: false,
            fehler: {
                vorgangsnummer:
                    "Zu dieser E-Mail-Adresse und Vorgangsnummer gibt es keine Reservierung. Bitte beides so eingeben, wie es in der Bestätigung steht.",
            },
        };
    }

    // Neueste zuerst, wie im Mockup 05: nach Mietbeginn, bei gleichem Beginn
    // nach Vorgangsnummer.
    const reservierungen = (await speicher.reservierungenVon(adresse)).sort((a, b) =>
        a.zeitraum.von === b.zeitraum.von
            ? b.id.localeCompare(a.id)
            : b.zeitraum.von.localeCompare(a.zeitraum.von),
    );

    return { ok: true, reservierungen };
}
