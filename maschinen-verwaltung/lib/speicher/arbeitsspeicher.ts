// Umsetzung der Schnittstelle fuer den Zwischenstand ohne Datenbank (ADR 0011).
//
// ACHTUNG, Zwischenstand: die Liste liegt im Arbeitsspeicher des Serverprozesses.
// Sie ist nach einem Neustart leer und im Entwicklungsmodus auch nach einem
// Neuladen des Codes. Das Akzeptanzkriterium "nach dem Absenden ist die
// Reservierung gespeichert" aus #1 ist damit NICHT erfuellt.
//
// Ebenso der Nummernkreis: "naechsteNummer" lebt im Prozess und faengt nach
// einem Neustart wieder bei R-0001 an. Fortlaufende Nummern ohne Luecke
// verlangt die Aufgabenstellung fuer Belege, und das gehoert in eine
// Datenbanksequenz. Notiert fuer #45.

import { Belegungsplan } from "../belegungsplan";
import { maschinen } from "../maschinen";
import { Reservierung, type Kunde, type ReservierungSpeicher } from "../reservierung";
import { Zeitraum } from "../zeitraum";

const angelegteReservierungen: Reservierung[] = [];
let naechsteNummer = 1;

export const arbeitsspeicher: ReservierungSpeicher = {
    /**
     * Beispieldaten UND angelegte Reservierungen. Ohne das Zusammenlegen
     * koennte man dieselbe Maschine zweimal fuer denselben Zeitraum buchen,
     * weil die Konfliktpruefung die eigene vorige Reservierung nicht sieht.
     */
    async belegungsplanFuer(inventarnummer: string): Promise<Belegungsplan> {
        const ausBeispieldaten =
            maschinen.find((m) => m.inventarnummer === inventarnummer)?.belegungen ??
            new Belegungsplan();

        const ausReservierungen = new Belegungsplan(
            angelegteReservierungen
                .filter((r) => r.inventarnummer === inventarnummer)
                .map((r) => r.zeitraum),
        );

        return ausBeispieldaten.zusammenMit(ausReservierungen);
    },

    async anlegen(
        inventarnummer: string,
        zeitraum: Zeitraum,
        kunde: Kunde,
    ): Promise<Reservierung> {
        const id = `R-${String(naechsteNummer).padStart(4, "0")}`;
        naechsteNummer += 1;

        const reservierung = new Reservierung(id, inventarnummer, zeitraum, kunde);
        angelegteReservierungen.push(reservierung);
        return reservierung;
    },
};
