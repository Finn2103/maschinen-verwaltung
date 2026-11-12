// Die Felder des Stammdatenformulars (#2) und wie sie heissen.
//
// Eigene Datei OHNE Logik, weil auch das Formular im Browser sie braucht
// (Beschriftung, Fehlerliste). Stuenden sie in maschine.ts, kaeme mit dem
// Import die ganze Klasse Maschine samt Pruefregeln ins Browser-Bundle, und
// die Fachlogik soll auf dem Server bleiben (docs/frontend-konventionen.md,
// Abschnitt 1; Nachweis per grep in .next/static/chunks, Lerntagebuch 12.10.).

/** In der Reihenfolge von Mockup 07. */
export const MASCHINEN_FELDER = [
    "inventarnummer",
    "typnummer",
    "seriennummer",
    "baujahr",
    "betriebsstunden",
    "wartungsintervall",
    "standort",
] as const;

export type MaschinenFeld = (typeof MASCHINEN_FELDER)[number];

/** So heissen die Felder im Formular, in Fehlermeldungen und im Protokoll. */
export const FELDNAMEN: Record<MaschinenFeld, string> = {
    inventarnummer: "Inventarnummer",
    typnummer: "Maschinentyp",
    seriennummer: "Seriennummer",
    baujahr: "Baujahr",
    betriebsstunden: "Betriebsstunden",
    wartungsintervall: "Wartungsintervall",
    standort: "Standort",
};

/** Was aus dem Formular kommt: alles Text, auch die Zahlen. */
export type MaschinenEingabe = Record<MaschinenFeld, string>;

/** Hoechstens eine Meldung je Feld. Ein leeres Objekt heisst: alles gut. */
export type Feldfehler = Partial<Record<MaschinenFeld, string>>;
