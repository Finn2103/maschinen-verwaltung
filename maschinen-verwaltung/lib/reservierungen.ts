// lib/reservierungen.ts
//
// Der Vertrag zwischen Fachlogik und Speicher. Die Fachlogik sagt, WAS sie
// braucht, nicht WIE gespeichert wird (Dependency Inversion, ADR 0011).
//
// Die Methoden sind bewusst asynchron, obwohl der Arbeitsspeicher das nicht
// braucht. Sonst müsste beim Umstellen auf PostgreSQL (#45) jede aufrufende
// Stelle von synchron auf asynchron umgeschrieben werden.

import type { Belegung } from "./maschinen";

/**
 * Eigener Typ, nicht drei lose Felder an der Reservierung. In #7 werden
 * Kundenstammdaten eine eigene Entität, in #45 daraus ein Fremdschlüssel.
 */
export type Kunde = {
    name: string;
    email: string;
    telefon: string;
};

export type Reservierung = {
    id: string;
    inventarnummer: string;
    von: string;
    bis: string;
    kunde: Kunde;
};

export type ReservierungSpeicher = {
    belegungenFuer(inventarnummer: string): Promise<Belegung[]>;
    anlegen(neu: Omit<Reservierung, "id">): Promise<Reservierung>;
};