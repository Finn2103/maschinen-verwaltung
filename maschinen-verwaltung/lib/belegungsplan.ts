// Ein Belegungsplan ist mehr als eine Liste von Zeitraeumen: er kann sagen,
// ob ein gewuenschter Zeitraum frei ist, und welche Belegung ihn blockiert.
//
// Warum eine eigene Klasse und nicht einfach Zeitraum[]: die Konfliktsuche
// brauchen zwei Stellen, die Suche ueber die Maschine und die Reservierung
// ueber den Speicher. Ohne diese Klasse muesste die Reservierungslogik eine
// Maschine mit leeren Feldern bauen, nur um an die Methode zu kommen. Das war
// der erste Entwurf und es war falsch: ein Objekt erfinden, das es fachlich
// nicht gibt, nur damit der Code passt.

import { Zeitraum } from "./zeitraum";

export class Belegungsplan {
    constructor(private readonly zeitraeume: Zeitraum[] = []) {}

    /** Die Belegung, die den Zeitraum blockiert, oder undefined. */
    konfliktMit(zeitraum: Zeitraum): Zeitraum | undefined {
        return this.zeitraeume.find((belegung) => belegung.ueberlappt(zeitraum));
    }

    istFrei(zeitraum: Zeitraum): boolean {
        return this.konfliktMit(zeitraum) === undefined;
    }

    get leer(): boolean {
        return this.zeitraeume.length === 0;
    }

    /**
     * Fuer die Anzeige. Gibt eine Kopie zurueck, damit niemand von aussen in
     * den Plan hineinschreibt: die Liste selbst ist privat.
     */
    alle(): Zeitraum[] {
        return [...this.zeitraeume];
    }

    /** Zwei Plaene zusammenlegen, etwa Beispieldaten und neue Reservierungen. */
    zusammenMit(anderer: Belegungsplan): Belegungsplan {
        return new Belegungsplan([...this.zeitraeume, ...anderer.zeitraeume]);
    }
}
