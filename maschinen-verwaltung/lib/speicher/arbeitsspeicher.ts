// Umsetzung der Schnittstellen fuer den Zwischenstand ohne Datenbank (ADR 0011).
//
// ACHTUNG, Zwischenstand: die Listen liegen im Arbeitsspeicher des
// Serverprozesses. Sie sind nach einem Neustart wieder auf dem Stand der
// Beispieldaten und im Entwicklungsmodus auch nach einem Neuladen des Codes.
// Das Akzeptanzkriterium "nach dem Absenden ist die Reservierung gespeichert"
// aus #1 ist damit NICHT erfuellt.
//
// Ebenso der Nummernkreis: "naechsteNummer" lebt im Prozess und faengt nach
// einem Neustart wieder bei R-0001 an. Fortlaufende Nummern ohne Luecke
// verlangt die Aufgabenstellung fuer Belege, und das gehoert in eine
// Datenbanksequenz. Notiert fuer #45.

import { Belegungsplan } from "../belegungsplan";
import type { Maschine, MaschinenSpeicher } from "../maschine";
import type { Maschinentyp } from "../maschinentyp";
import { beispielBelegungen, beispielMaschinen, beispielTypen } from "../maschinen";
import type { Protokolleintrag } from "../protokoll";
import { Reservierung, type Kunde, type ReservierungSpeicher } from "../reservierung";
import { Zeitraum } from "../zeitraum";

// Eine Kopie, damit die Beispieldaten selbst unveraendert bleiben.
const maschinenListe: Maschine[] = [...beispielMaschinen];

// Das Aenderungsprotokoll (#2). Nur anhaengen, nie aendern oder loeschen.
// Fuer die Beispieldaten gibt es keine Eintraege: sie stammen aus der Zeit vor
// dem Protokoll.
const protokoll: Protokolleintrag[] = [];

const angelegteReservierungen: Reservierung[] = [];
let naechsteNummer = 1;

export const arbeitsspeicher: ReservierungSpeicher & MaschinenSpeicher = {
    async maschinen(): Promise<Maschine[]> {
        return [...maschinenListe].sort((a, b) => a.inventarnummer.localeCompare(b.inventarnummer));
    },

    async maschine(inventarnummer: string): Promise<Maschine | undefined> {
        return maschinenListe.find((m) => m.inventarnummer === inventarnummer);
    },

    async maschinentypen(): Promise<Maschinentyp[]> {
        return [...beispielTypen].sort((a, b) => a.bezeichnung.localeCompare(b.bezeichnung, "de"));
    },

    async maschineAnlegen(maschine: Maschine, eintrag: Protokolleintrag): Promise<boolean> {
        if (maschinenListe.some((m) => m.inventarnummer === maschine.inventarnummer)) {
            return false;
        }
        maschinenListe.push(maschine);
        protokoll.push(eintrag);
        return true;
    },

    async maschineAendern(maschine: Maschine, eintraege: Protokolleintrag[]): Promise<void> {
        const stelle = maschinenListe.findIndex((m) => m.inventarnummer === maschine.inventarnummer);
        if (stelle === -1) {
            // Kann nur passieren, wenn die Fachlogik vorher nicht geprueft hat.
            throw new Error(`Maschine ${maschine.inventarnummer} gibt es nicht`);
        }
        maschinenListe[stelle] = maschine;
        protokoll.push(...eintraege);
    },

    async protokollFuer(inventarnummer: string): Promise<Protokolleintrag[]> {
        // Neueste zuerst. Bei gleichem Zeitpunkt (mehrere Felder in einer
        // Aenderung) bleibt die Feldreihenfolge des Formulars erhalten.
        return protokoll
            .map((eintrag, stelle) => ({ eintrag, stelle }))
            .filter(({ eintrag }) => eintrag.inventarnummer === inventarnummer)
            .sort((a, b) =>
                a.eintrag.zeitpunkt === b.eintrag.zeitpunkt
                    ? a.stelle - b.stelle
                    : b.eintrag.zeitpunkt.localeCompare(a.eintrag.zeitpunkt),
            )
            .map(({ eintrag }) => eintrag);
    },

    /**
     * Beispieldaten UND angelegte Reservierungen. Ohne das Zusammenlegen
     * koennte man dieselbe Maschine zweimal fuer denselben Zeitraum buchen,
     * weil die Konfliktpruefung die eigene vorige Reservierung nicht sieht.
     */
    async belegungsplanFuer(inventarnummer: string): Promise<Belegungsplan> {
        const ausBeispieldaten = new Belegungsplan(beispielBelegungen[inventarnummer] ?? []);

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
