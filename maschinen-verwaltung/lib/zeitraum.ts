// Ein Zeitraum kennt seine eigene Regel.
//
// Vorher stand die Ueberlappungspruefung als freie Funktion in
// verfuegbarkeit.ts und bekam zwei Zeitraeume als Argumente. ADR 0004 verlangt
// unter "Wo die Objektorientierung liegt" aber, dass die Fachobjekte ihre
// Regeln selbst tragen. Deshalb ist "ueberlappt" jetzt eine Methode: nicht
// ueberlappt(a, b), sondern a.ueberlappt(b).
//
// Datum als Zeichenkette im Format JJJJ-MM-TT: ISO-8601 sortiert als Text
// genauso wie chronologisch, weil die groesste Einheit vorn steht und alle
// Felder feste Breite haben. Ein Date-Objekt traegt Uhrzeit und Zeitzone mit
// sich, die wir fuer Kalendertage nicht brauchen und die Fehler erzeugen.

export class Zeitraum {
    constructor(
        readonly von: string,
        readonly bis: string,
    ) {}

    /**
     * Zwei Zeitraeume ueberlappen, wenn jeder vor dem Ende des anderen beginnt.
     *
     * Geschlossene Intervalle: "von" und "bis" gehoeren beide dazu, deshalb
     * beide Vergleiche mit "<=". Der Rueckgabetag bleibt belegt, entschieden am
     * 08.10.2026 (docs/frontend-konventionen.md, Abschnitt 4). Waere er wieder
     * buchbar, stuende hier zweimal "<".
     *
     * Die Bedingung braucht keine Fallunterscheidung. Sie deckt Ueberlappung
     * von links und von rechts, vollstaendige Umschliessung in beide
     * Richtungen und Gleichheit in einem Ausdruck ab.
     */
    ueberlappt(anderer: Zeitraum): boolean {
        return this.von <= anderer.bis && anderer.von <= this.bis;
    }

    /** Fuer die Anzeige, damit das Format an einer Stelle steht. */
    alsText(): string {
        return `${this.von} bis ${this.bis}`;
    }

    /**
     * Prueft eine Eingabe, bevor daraus ein Zeitraum wird, und gibt die
     * Fehlermeldung zurueck oder null.
     *
     * Statisch, weil es hier noch kein Objekt gibt: die Pruefung entscheidet
     * gerade erst, ob eines entstehen darf. Beide Felder leer ist gueltig und
     * heisst "kein Zeitraum angegeben", das ist in der Suche erlaubt.
     */
    static fehler(von?: string, bis?: string): string | null {
        if (!von && !bis) return null;
        if (!von || !bis) return "Bitte beide Datumsfelder füllen oder beide leer lassen.";
        if (bis < von) return "Das Bis-Datum liegt vor dem Von-Datum.";
        return null;
    }

    /**
     * Baut einen Zeitraum aus einer geprueften Eingabe, oder null wenn nichts
     * angegeben wurde. Wer hier null bekommt, soll nicht filtern.
     */
    static ausEingabe(von?: string, bis?: string): Zeitraum | null {
        if (!von || !bis) return null;
        return new Zeitraum(von, bis);
    }
}
