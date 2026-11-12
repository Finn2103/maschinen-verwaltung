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
// keine Seite mehr direkt. Bezeichnung und Kategorie stehen am Maschinentyp,
// die Belegungen getrennt von den Maschinen, beides wie im Datenmodell.
// Seriennummern, Baujahre, Betriebsstunden und Intervalle sind erfunden. Der
// Trennschleifer hat absichtlich kein Wartungsintervall, das Feld ist
// freiwillig.

import { Maschine } from "./maschine";
import { Maschinentyp } from "./maschinentyp";
import { Zeitraum } from "./zeitraum";

export const beispielTypen: Maschinentyp[] = [
    new Maschinentyp(1, "Minibagger 1,8 t", "Erdbewegung"),
    new Maschinentyp(2, "Radlader 0,4 m³", "Erdbewegung"),
    new Maschinentyp(3, "Rüttelplatte 100 kg", "Verdichtung"),
    new Maschinentyp(4, "Grabenwalze 1,4 t", "Verdichtung"),
    new Maschinentyp(5, "Teleskoplader 7 m", "Hebetechnik"),
    new Maschinentyp(6, "Scherenarbeitsbühne 10 m", "Hebetechnik"),
    new Maschinentyp(7, "Betonmischer 140 l", "Betonbearbeitung"),
    new Maschinentyp(8, "Trennschleifer 350 mm", "Betonbearbeitung"),
    new Maschinentyp(9, "Holzhäcksler 100 mm", "Garten und Landschaftsbau"),
    new Maschinentyp(10, "Kehrmaschine 900 mm", "Reinigung"),
];

function typ(typnummer: number): Maschinentyp {
    const gefunden = beispielTypen.find((t) => t.typnummer === typnummer);
    if (!gefunden) throw new Error(`Beispieldaten: Typ ${typnummer} fehlt`);
    return gefunden;
}

export const beispielMaschinen: Maschine[] = [
    new Maschine({ inventarnummer: "M-1001", typ: typ(1), seriennummer: "KX018-24117", baujahr: 2021, betriebsstunden: 1240, wartungsintervall: 500, standort: "Köln" }),
    new Maschine({ inventarnummer: "M-1002", typ: typ(2), seriennummer: "WL20-80412", baujahr: 2022, betriebsstunden: 1775.5, wartungsintervall: 500, standort: "Bonn" }),
    new Maschine({ inventarnummer: "M-1003", typ: typ(3), seriennummer: "BP25-55031", baujahr: 2019, betriebsstunden: 860, wartungsintervall: 250, standort: "Köln" }),
    new Maschine({ inventarnummer: "M-1004", typ: typ(4), seriennummer: "BW55-10274", baujahr: 2020, betriebsstunden: 1430, wartungsintervall: 250, standort: "Düsseldorf" }),
    new Maschine({ inventarnummer: "M-1005", typ: typ(5), seriennummer: "TH7-32096", baujahr: 2023, betriebsstunden: 310, wartungsintervall: 500, standort: "Bonn" }),
    new Maschine({ inventarnummer: "M-1006", typ: typ(6), seriennummer: "SB10-77805", baujahr: 2018, betriebsstunden: 2105, wartungsintervall: 400, standort: "Leverkusen" }),
    new Maschine({ inventarnummer: "M-1007", typ: typ(7), seriennummer: "BM140-6620", baujahr: 2024, betriebsstunden: 95, wartungsintervall: 100, standort: "Köln" }),
    new Maschine({ inventarnummer: "M-1008", typ: typ(8), seriennummer: "TS350-41188", baujahr: 2022, betriebsstunden: 412, wartungsintervall: null, standort: "Düsseldorf" }),
    new Maschine({ inventarnummer: "M-1009", typ: typ(9), seriennummer: "HH100-2209", baujahr: 2017, betriebsstunden: 3012, wartungsintervall: 200, standort: "Leverkusen" }),
    new Maschine({ inventarnummer: "M-1010", typ: typ(10), seriennummer: "KM900-15530", baujahr: 2021, betriebsstunden: 980, wartungsintervall: 300, standort: "Bonn" }),
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
