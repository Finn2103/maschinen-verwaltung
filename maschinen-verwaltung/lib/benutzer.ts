// Ein Benutzer des Systems (#8, #99), wie die Relation "benutzer" in
// docs/datenmodell/schema.sql: benutzer_id, email, name, aktiv,
// kundennummer, rolle. Dazu die Bezeichnung der Rolle aus "rolle", so wie
// Maschine die Bezeichnung aus "maschinentyp" mitbringt (relational.md,
// Abschnitt 5).
//
// Kein Passwort: die Anmeldung ist #43. Bis dahin waehlt man den Benutzer in
// der Probe-Anmeldung aus (entschieden von Finn am 16.11., Antwort 60).

/** Was die Kopfleiste zur Auswahl braucht, serialisierbar fuer den Browser. */
export type BenutzerAnzeige = {
    benutzerId: string;
    name: string;
    rollenname: string;
};

export class Benutzer {
    constructor(
        /** UUID, spaeter dieselbe wie auth.users.id, falls #43 Supabase Auth nimmt (F13). */
        readonly benutzerId: string,
        readonly email: string,
        readonly name: string,
        /** Schluessel der Rolle, z. B. "mitarbeiter" (rolle.rolle). */
        readonly rolle: string,
        /** Bezeichnung der Rolle, z. B. "Mitarbeiter" (rolle.bezeichnung). */
        readonly rollenname: string,
        /** Nur bei der Rolle Kunde: der eigene Kundendatensatz (F14). Leer bei Personal. */
        readonly kundennummer: number | null = null,
        /** Benutzer werden nicht geloescht, sondern deaktiviert (relational.md 4.7). */
        readonly aktiv: boolean = true,
    ) {}

    /**
     * Gehoert ein Datensatz mit dieser Kundennummer dem Benutzer? Das ist
     * "eigene" aus der Matrix: benutzer.kundennummer ist die Kundennummer des
     * Datensatzes (relational.md 4.7). Ohne eigene Kundennummer gehoert ihm
     * nichts.
     */
    istEigentuemerVon(kundennummer: number | null): boolean {
        return this.kundennummer !== null && this.kundennummer === kundennummer;
    }

    alsAnzeige(): BenutzerAnzeige {
        return { benutzerId: this.benutzerId, name: this.name, rollenname: this.rollenname };
    }
}

/**
 * Was im Aenderungsprotokoll als Benutzer steht: die E-Mail-Adresse, weil sie
 * eindeutig ist (relational.md 4.7). In der Datenbank steht dort die
 * benutzer_id, die Oberflaeche zeigt dann die E-Mail-Adresse dazu.
 */
export function imProtokoll(benutzer: Benutzer | null): string {
    return benutzer?.email ?? "ohne Anmeldung";
}
