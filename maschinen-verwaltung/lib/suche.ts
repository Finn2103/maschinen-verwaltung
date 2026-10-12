// Die Suche. Vorher stand sie in verfuegbarkeit.ts, zusammen mit der
// Ueberlappungspruefung und der Eingabepruefung. Drei Zustaendigkeiten in
// einer Datei, deren Name nur die erste abdeckte. Befund der Code-Review vom
// 12.10.2026, jetzt getrennt: Zeitraum, Maschine, Suche.
//
// Die Funktion filtert nur und entscheidet nicht, ob eine einzelne Maschine
// passt: das entscheidet die Maschine selbst (maschine.passtZu).
//
// OFFENER BEFUND vom 12.10.2026: die Suche liest die Belegungen aus den
// Maschinen-Objekten, nicht ueber den Speicher. In der Anwendung angelegte
// Reservierungen sieht sie deshalb nicht. Behoben wird das, indem suche()
// asynchron wird und die Belegungen ueber den Speicher holt. Steht noch zur
// Entscheidung, siehe Reiter "Offen" in der Review-Vorbereitung.

import type { Maschine } from "./maschine";
import { Zeitraum } from "./zeitraum";

export type Suchfilter = {
    kategorie?: string;
    standort?: string;
    von?: string;
    bis?: string;
};

export function suche(alle: Maschine[], filter: Suchfilter): Maschine[] {
    const zeitraum = Zeitraum.ausEingabe(filter.von, filter.bis);
    return alle.filter((maschine) =>
        maschine.passtZu(filter.kategorie, filter.standort, zeitraum),
    );
}
