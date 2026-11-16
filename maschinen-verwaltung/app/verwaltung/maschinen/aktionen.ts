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
// RECHTEPRUEFUNG (#8 Teil 1): als Erstes, vor jedem Lesen und Schreiben.
// Anlegen und Bearbeiten duerfen Mitarbeiter, Manager, Owner und Admin
// (docs/rollen-und-rechte.md). Dass die Seite mit dem Formular schon prueft,
// reicht nicht: eine Server Action laesst sich ohne die Seite direkt aufrufen.
// Wer im Protokoll steht, kommt aus derselben Pruefung, nicht aus dem
// Formular.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { imProtokoll } from "@/lib/benutzer";
import { MASCHINEN_FELDER, type MaschinenEingabe } from "@/lib/maschinenfelder";
import { speicher } from "@/lib/speicher";
import { maschineAendern, maschineAnlegen, type StammdatenFehler } from "@/lib/stammdaten";
import { zielText, zugriff } from "../../sitzung";

/** Alle Formularwerte als Text. */
export type FormularEingaben = MaschinenEingabe;

/**
 * null vor dem ersten Absenden. Nach einem Erfolg wird weitergeleitet.
 * "zugriff" ist die Meldung eines abgelehnten Zugriffs (#8).
 */
export type StammdatenZustand = {
  fehler: StammdatenFehler;
  zugriff?: string;
  eingaben: FormularEingaben;
} | null;

function lies(daten: FormData): FormularEingaben {
  const text = (feld: string) => String(daten.get(feld) ?? "");
  const eingaben = {} as FormularEingaben;
  for (const feld of MASCHINEN_FELDER) eingaben[feld] = text(feld);
  return eingaben;
}

export async function maschineAnlegenAbsenden(
  _vorherigerZustand: StammdatenZustand,
  daten: FormData,
): Promise<StammdatenZustand> {
  const eingaben = lies(daten);
  const zugang = await zugriff(
    "maschine.anlegen",
    `Aktion: Maschine anlegen (${zielText(eingaben.inventarnummer)})`,
  );
  if (!zugang.erlaubt) return { fehler: {}, zugriff: zugang.meldung, eingaben };

  const ergebnis = await maschineAnlegen(speicher, eingaben, imProtokoll(zugang.benutzer));
  if (!ergebnis.ok) return { fehler: ergebnis.fehler, eingaben };

  revalidatePath("/", "layout");
  redirect(`/verwaltung/maschinen?angelegt=${encodeURIComponent(ergebnis.maschine.inventarnummer)}`);
}

export async function maschineAendernAbsenden(
  _vorherigerZustand: StammdatenZustand,
  daten: FormData,
): Promise<StammdatenZustand> {
  const eingaben = lies(daten);
  const zugang = await zugriff(
    "maschine.bearbeiten",
    `Aktion: Maschine bearbeiten (${zielText(eingaben.inventarnummer)})`,
  );
  if (!zugang.erlaubt) return { fehler: {}, zugriff: zugang.meldung, eingaben };

  const ergebnis = await maschineAendern(
    speicher,
    eingaben.inventarnummer,
    eingaben,
    imProtokoll(zugang.benutzer),
  );
  if (!ergebnis.ok) return { fehler: ergebnis.fehler, eingaben };

  revalidatePath("/", "layout");
  redirect(
    `/verwaltung/maschinen/${encodeURIComponent(ergebnis.maschine.inventarnummer)}?gespeichert=${ergebnis.aenderungen}`,
  );
}
