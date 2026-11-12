// Beispieldaten, bis das Datenmodell aus #45 in der Datenbank steht.
//
// Die zehn Maschinen sind auf Randfaelle hin gebaut, nicht auf Menge:
// M-1001 deckt den Rueckgabetag ab (belegt bis 28.09., eine Reservierung ab
// dem 28. muss abgelehnt werden), M-1002 ist leer, M-1003 hat zwei Zeitraeume
// mit Luecke dazwischen, M-1006 einen ganzen Monat, M-1007 einen einzigen Tag
// (von gleich bis), M-1010 eine Belegung ueber die Monatsgrenze.
//
// Seit dem 12.10.2026 echte Maschine-Objekte statt Datenliterale, damit die
// Fachregeln an den Objekten haengen (ADR 0004).
//
// Seit #2 liest diese Datei NUR der Speicher (lib/speicher/arbeitsspeicher.ts),
// keine Seite mehr direkt. Die Belegungen stehen getrennt von den Maschinen,
// wie im Datenmodell: dort liegen sie in "ausleihe", nicht in "maschine".

import { Maschine } from "./maschine";
import { Zeitraum } from "./zeitraum";

export const beispielMaschinen: Maschine[] = [
    new Maschine("M-1001", "Minibagger 1,8 t", "Erdbewegung", "Köln"),
    new Maschine("M-1002", "Radlader 0,4 m³", "Erdbewegung", "Bonn"),
    new Maschine("M-1003", "Rüttelplatte 100 kg", "Verdichtung", "Köln"),
    new Maschine("M-1004", "Grabenwalze 1,4 t", "Verdichtung", "Düsseldorf"),
    new Maschine("M-1005", "Teleskoplader 7 m", "Hebetechnik", "Bonn"),
    new Maschine("M-1006", "Scherenarbeitsbühne 10 m", "Hebetechnik", "Leverkusen"),
    new Maschine("M-1007", "Betonmischer 140 l", "Betonbearbeitung", "Köln"),
    new Maschine("M-1008", "Trennschleifer 350 mm", "Betonbearbeitung", "Düsseldorf"),
    new Maschine("M-1009", "Holzhäcksler 100 mm", "Garten und Landschaftsbau", "Leverkusen"),
    new Maschine("M-1010", "Kehrmaschine 900 mm", "Reinigung", "Bonn"),
];

/** Belegungen aus den Beispieldaten, je Inventarnummer. */
export const beispielBelegungen: Record<string, Zeitraum[]> = {
    "M-1001": [new Zeitraum("2026-09-24", "2026-09-28")],
    "M-1003": [
        new Zeitraum("2026-10-05", "2026-10-09"),
        new Zeitraum("2026-10-19", "2026-10-23"),
    ],
    "M-1004": [new Zeitraum("2026-10-12", "2026-10-16")],
    "M-1006": [new Zeitraum("2026-10-01", "2026-10-31")],
    "M-1007": [new Zeitraum("2026-10-08", "2026-10-08")],
    "M-1009": [new Zeitraum("2026-10-14", "2026-10-20")],
    "M-1010": [
        new Zeitraum("2026-09-30", "2026-10-02"),
        new Zeitraum("2026-10-26", "2026-10-30"),
    ],
};
