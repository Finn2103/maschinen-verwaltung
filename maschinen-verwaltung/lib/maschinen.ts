// Beispieldaten, bis das Datenmodell aus #45 steht.
//
// Die zehn Maschinen sind auf Randfaelle hin gebaut, nicht auf Menge:
// M-1001 deckt den Rueckgabetag ab (belegt bis 28.09., eine Reservierung ab
// dem 28. muss abgelehnt werden), M-1002 ist leer, M-1003 hat zwei Zeitraeume
// mit Luecke dazwischen, M-1006 einen ganzen Monat, M-1007 einen einzigen Tag
// (von gleich bis), M-1010 eine Belegung ueber die Monatsgrenze.
//
// Seit dem 12.10.2026 echte Maschine-Objekte statt Datenliterale, damit die
// Fachregeln an den Objekten haengen (ADR 0004).

import { Maschine } from "./maschine";
import { Zeitraum } from "./zeitraum";

export const maschinen: Maschine[] = [
    new Maschine("M-1001", "Minibagger 1,8 t", "Erdbewegung", "Köln", [
        new Zeitraum("2026-09-24", "2026-09-28"),
    ]),
    new Maschine("M-1002", "Radlader 0,4 m³", "Erdbewegung", "Bonn"),
    new Maschine("M-1003", "Rüttelplatte 100 kg", "Verdichtung", "Köln", [
        new Zeitraum("2026-10-05", "2026-10-09"),
        new Zeitraum("2026-10-19", "2026-10-23"),
    ]),
    new Maschine("M-1004", "Grabenwalze 1,4 t", "Verdichtung", "Düsseldorf", [
        new Zeitraum("2026-10-12", "2026-10-16"),
    ]),
    new Maschine("M-1005", "Teleskoplader 7 m", "Hebetechnik", "Bonn"),
    new Maschine("M-1006", "Scherenarbeitsbühne 10 m", "Hebetechnik", "Leverkusen", [
        new Zeitraum("2026-10-01", "2026-10-31"),
    ]),
    new Maschine("M-1007", "Betonmischer 140 l", "Betonbearbeitung", "Köln", [
        new Zeitraum("2026-10-08", "2026-10-08"),
    ]),
    new Maschine("M-1008", "Trennschleifer 350 mm", "Betonbearbeitung", "Düsseldorf"),
    new Maschine("M-1009", "Holzhäcksler 100 mm", "Garten und Landschaftsbau", "Leverkusen", [
        new Zeitraum("2026-10-14", "2026-10-20"),
    ]),
    new Maschine("M-1010", "Kehrmaschine 900 mm", "Reinigung", "Bonn", [
        new Zeitraum("2026-09-30", "2026-10-02"),
        new Zeitraum("2026-10-26", "2026-10-30"),
    ]),
];

// Aus den Daten abgeleitet statt doppelt gepflegt: eine neue Kategorie
// erscheint allein dadurch im Suchformular, dass eine Maschine sie hat.
export const kategorien = [...new Set(maschinen.map((m) => m.kategorie))].sort();
export const standorte = [...new Set(maschinen.map((m) => m.standort))].sort();
