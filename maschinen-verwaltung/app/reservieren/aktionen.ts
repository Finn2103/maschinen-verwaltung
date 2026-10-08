"use server";

// Server Action fuer das Reservierungsformular.
//
// "use server" heisst: diese Funktion laeuft ausschliesslich auf dem Server,
// auch wenn das Formular im Browser steht. Sie kommt nie in den Browser.
// Deshalb darf hier auf den Speicher zugegriffen werden, aus einer
// Client-Komponente heraus duerfte das nicht passieren.
//
// Die Funktion prueft NICHT selbst, sie uebergibt an die Fachlogik. Sie
// uebersetzt FormData in den Typ, den reservieren() erwartet, und haengt im
// Fehlerfall die Eingaben an, damit das Formular sie wieder anzeigen kann.
// Dieses Wiederanzeigen ist Darstellung, deshalb steht es hier und nicht in
// der Fachlogik.

import { reservieren, type Feld } from "@/lib/reservieren";
import type { Reservierung } from "@/lib/reservierungen";
import { speicher } from "@/lib/speicher";

export type Eingaben = {
  von: string;
  bis: string;
  name: string;
  email: string;
  telefon: string;
};

export type FormularZustand =
  | { ok: true; reservierung: Reservierung }
  | { ok: false; fehler: string; feld: Feld; eingaben: Eingaben }
  | null;

export async function reservierungAbsenden(
  _vorherigerZustand: FormularZustand,
  daten: FormData,
): Promise<FormularZustand> {
  // Alles aus einem Formular ist Text, auch wenn das Feld type="date" hatte.
  const text = (feld: string) => String(daten.get(feld) ?? "").trim();

  const eingaben: Eingaben = {
    von: text("von"),
    bis: text("bis"),
    name: text("name"),
    email: text("email"),
    telefon: text("telefon"),
  };

  const ergebnis = await reservieren(speicher, {
    inventarnummer: text("inventarnummer"),
    von: eingaben.von,
    bis: eingaben.bis,
    kunde: {
      name: eingaben.name,
      email: eingaben.email,
      telefon: eingaben.telefon,
    },
  });

  if (ergebnis.ok) return ergebnis;
  return { ...ergebnis, eingaben };
}
