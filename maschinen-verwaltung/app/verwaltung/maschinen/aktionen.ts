"use server";

// Server Actions fuer das Stammdatenformular (#2), aufgebaut wie
// app/reservieren/aktionen.ts: FormData in Text uebersetzen, an die
// Fachlogik geben, das Ergebnis serialisierbar zurueckgeben. Geprueft wird
// nicht hier, sondern in lib/stammdaten.ts und Maschine.pruefe().
//
// Nach dem Speichern leitet die Action weiter, statt das Formular stehen zu
// lassen: so kann ein Neuladen der Seite die Maschine nicht ein zweites Mal
// anlegen. revalidatePath vorher, damit Liste, Suche und Formular den neuen
// Stand zeigen (Next.js-Doku, "Redirect after a mutation").
//
// KEINE RECHTEPRUEFUNG: wer Stammdaten pflegen darf (Mitarbeiter und Admin,
// docs/rollen-und-rechte.md), kommt mit #8 und der Anmeldung aus #43.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MASCHINEN_FELDER, type MaschinenEingabe } from "@/lib/maschinenfelder";
import { speicher } from "@/lib/speicher";
import { maschineAendern, maschineAnlegen, type StammdatenFehler } from "@/lib/stammdaten";

/** Alle Formularwerte als Text, dazu das Kuerzel fuer das Protokoll. */
export type FormularEingaben = MaschinenEingabe & { benutzer: string };

/** null vor dem ersten Absenden. Nach einem Erfolg wird weitergeleitet. */
export type StammdatenZustand = { fehler: StammdatenFehler; eingaben: FormularEingaben } | null;

function lies(daten: FormData): FormularEingaben {
  const text = (feld: string) => String(daten.get(feld) ?? "");
  const eingaben = { benutzer: text("benutzer") } as FormularEingaben;
  for (const feld of MASCHINEN_FELDER) eingaben[feld] = text(feld);
  return eingaben;
}

export async function maschineAnlegenAbsenden(
  _vorherigerZustand: StammdatenZustand,
  daten: FormData,
): Promise<StammdatenZustand> {
  const eingaben = lies(daten);
  const ergebnis = await maschineAnlegen(speicher, eingaben, eingaben.benutzer);
  if (!ergebnis.ok) return { fehler: ergebnis.fehler, eingaben };

  revalidatePath("/", "layout");
  redirect(`/verwaltung/maschinen?angelegt=${encodeURIComponent(ergebnis.maschine.inventarnummer)}`);
}

export async function maschineAendernAbsenden(
  _vorherigerZustand: StammdatenZustand,
  daten: FormData,
): Promise<StammdatenZustand> {
  const eingaben = lies(daten);
  const ergebnis = await maschineAendern(
    speicher,
    eingaben.inventarnummer,
    eingaben,
    eingaben.benutzer,
  );
  if (!ergebnis.ok) return { fehler: ergebnis.fehler, eingaben };

  revalidatePath("/", "layout");
  redirect(
    `/verwaltung/maschinen/${encodeURIComponent(ergebnis.maschine.inventarnummer)}?gespeichert=${ergebnis.aenderungen}`,
  );
}
