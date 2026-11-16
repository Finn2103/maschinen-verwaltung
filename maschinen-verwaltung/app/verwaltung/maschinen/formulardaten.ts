import { connection } from "next/server";
import { auswahlwerte } from "@/lib/suche";
import { speicher } from "@/lib/speicher";

/**
 * Was das Stammdatenformular zur Auswahl braucht, als einfache Werte fuer die
 * Grenze zum Browser: Maschinentypen fuer die Auswahlliste und die bekannten
 * Standorte als Vorschlaege. Fuer Anlegen und Bearbeiten gleich.
 *
 * connection(): Die Seite "Maschine anlegen" liest sonst nichts aus der
 * Anfrage, und Next.js wuerde sie beim Bauen einmal vorrendern. Dann staenden
 * die Standorte vom Zeitpunkt des Builds in der Liste, ein spaeter neu
 * angelegter Standort fehlte. Gefunden in der Ausgabe von "next build" (das
 * Zeichen fuer statisch an /verwaltung/maschinen/neu). Siehe
 * node_modules/next/dist/docs, connection.md.
 */
export async function formulardaten() {
  await connection();
  const [typen, maschinen] = await Promise.all([
    speicher.maschinentypen(),
    speicher.maschinen(),
  ]);
  return {
    typen: typen.map((t) => ({ typnummer: t.typnummer, bezeichnung: t.bezeichnung })),
    standorte: auswahlwerte(maschinen).standorte,
  };
}
