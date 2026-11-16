"use server";

// Server Action fuer "Meine Reservierungen" (#1), aufgebaut wie
// app/reservieren/aktionen.ts: Text aus dem Formular an die Fachlogik geben,
// das Ergebnis als einfache Objekte zurueck. Geprueft wird in lib/uebersicht.ts.
//
// Abgefragt wird per POST ueber diese Action, nicht ueber die Adresse: eine
// E-Mail-Adresse soll nicht in der URL stehen, wo sie im Verlauf und in
// Server-Protokollen landet.

import { speicher } from "@/lib/speicher";
import { meineReservierungen, type UebersichtFeld } from "@/lib/uebersicht";

/** Eine Zeile der Uebersicht, serialisierbar fuer die Client-Komponente. */
export type UebersichtZeile = {
  id: string;
  inventarnummer: string;
  bezeichnung: string;
  von: string;
  bis: string;
};

export type UebersichtZustand =
  | { ok: true; zeilen: UebersichtZeile[]; eingaben: Record<UebersichtFeld, string> }
  | {
      ok: false;
      fehler: Partial<Record<UebersichtFeld, string>>;
      eingaben: Record<UebersichtFeld, string>;
    }
  | null;

export async function uebersichtAbfragen(
  _vorherigerZustand: UebersichtZustand,
  daten: FormData,
): Promise<UebersichtZustand> {
  const eingaben = {
    email: String(daten.get("email") ?? "").trim(),
    vorgangsnummer: String(daten.get("vorgangsnummer") ?? "").trim(),
  };

  const ergebnis = await meineReservierungen(speicher, eingaben.email, eingaben.vorgangsnummer);
  if (!ergebnis.ok) return { ok: false, fehler: ergebnis.fehler, eingaben };

  const zeilen = await Promise.all(
    ergebnis.reservierungen.map(async (r) => {
      const maschine = await speicher.maschine(r.inventarnummer);
      return {
        ...r.alsAnzeige(),
        inventarnummer: r.inventarnummer,
        bezeichnung: maschine?.bezeichnung ?? r.inventarnummer,
      };
    }),
  );

  return { ok: true, zeilen, eingaben };
}
