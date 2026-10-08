// lib/reservierungen.ts
//
// Der Vertrag zwischen Fachlogik und Speicher. Die Fachlogik sagt, WAS sie
// braucht, nicht WIE gespeichert wird (Dependency Inversion).
//
// Die Methoden sind bewusst asynchron, obwohl der Arbeitsspeicher das nicht
// braucht. Sonst müsste beim Umstellen auf PostgreSQL (#45, Phase 5) jede
// aufrufende Stelle von synchron auf asynchron umgeschrieben werden.

import type { Belegung } from "./maschinen";

export type Reservierung = {
    id: string;
    inventarnummer: string;
    von: string;
    bis: string;
    kunde: string;
};

export type ReservierungSpeicher = {
    belegungenFuer(inventarnummer: string): Promise<Belegung[]>;
    anlegen(neu: Omit<Reservierung, "id">): Promise<Reservierung>;
};