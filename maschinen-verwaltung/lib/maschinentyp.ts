// Der Maschinentyp, wie im Datenmodell aus #45: maschinentyp(typnummer,
// bezeichnung, kategorie, tagessatz). Mehrere Maschinen koennen vom selben Typ
// sein, Bezeichnung und Kategorie stehen deshalb am Typ und nicht an jeder
// einzelnen Maschine (docs/datenmodell/relational.md, Abschnitt 5).
//
// Der Tagessatz fehlt hier bewusst: #2 braucht ihn nicht, er kommt mit der
// Abrechnung. Neue Typen anlegen ist ebenfalls nicht Teil von #2, im Formular
// wird aus den vorhandenen Typen gewaehlt (Mockup 07, Auswahlliste).

export class Maschinentyp {
    constructor(
        readonly typnummer: number,
        readonly bezeichnung: string,
        readonly kategorie: string,
    ) {}
}
