export type Belegung = {
    von: string; // Tag eingeschlossen
    bis: string; // Tag eingeschlossen, siehe Konventionen Abschnitt 4
};

export type Maschine = {
    inventarnummer: string;
    bezeichnung: string;
    kategorie: string;
    standort: string;
    belegungen: Belegung[];
};

export const maschinen: Maschine[] = [
    {
        inventarnummer: "M-1001",
        bezeichnung: "Minibagger 1,8 t",
        kategorie: "Erdbewegung",
        standort: "Köln",
        belegungen: [{ von: "2026-09-24", bis: "2026-09-28" }],
    },
    {
        inventarnummer: "M-1002",
        bezeichnung: "Radlader 0,4 m³",
        kategorie: "Erdbewegung",
        standort: "Bonn",
        belegungen: [],
    },
    {
        inventarnummer: "M-1003",
        bezeichnung: "Rüttelplatte 100 kg",
        kategorie: "Verdichtung",
        standort: "Köln",
        belegungen: [
            { von: "2026-10-05", bis: "2026-10-09" },
            { von: "2026-10-19", bis: "2026-10-23" },
        ],
    },
    {
        inventarnummer: "M-1004",
        bezeichnung: "Grabenwalze 1,4 t",
        kategorie: "Verdichtung",
        standort: "Düsseldorf",
        belegungen: [{ von: "2026-10-12", bis: "2026-10-16" }],
    },
    {
        inventarnummer: "M-1005",
        bezeichnung: "Teleskoplader 7 m",
        kategorie: "Hebetechnik",
        standort: "Bonn",
        belegungen: [],
    },
    {
        inventarnummer: "M-1006",
        bezeichnung: "Scherenarbeitsbühne 10 m",
        kategorie: "Hebetechnik",
        standort: "Leverkusen",
        belegungen: [{ von: "2026-10-01", bis: "2026-10-31" }],
    },
    {
        inventarnummer: "M-1007",
        bezeichnung: "Betonmischer 140 l",
        kategorie: "Betonbearbeitung",
        standort: "Köln",
        belegungen: [{ von: "2026-10-08", bis: "2026-10-08" }],
    },
    {
        inventarnummer: "M-1008",
        bezeichnung: "Trennschleifer 350 mm",
        kategorie: "Betonbearbeitung",
        standort: "Düsseldorf",
        belegungen: [],
    },
    {
        inventarnummer: "M-1009",
        bezeichnung: "Holzhäcksler 100 mm",
        kategorie: "Garten und Landschaftsbau",
        standort: "Leverkusen",
        belegungen: [{ von: "2026-10-14", bis: "2026-10-20" }],
    },
    {
        inventarnummer: "M-1010",
        bezeichnung: "Kehrmaschine 900 mm",
        kategorie: "Reinigung",
        standort: "Bonn",
        belegungen: [
            { von: "2026-09-30", bis: "2026-10-02" },
            { von: "2026-10-26", bis: "2026-10-30" },
        ],
    },
];