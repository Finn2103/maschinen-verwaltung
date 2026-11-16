// Wer fragt, und darf er das? Fuer Seiten und Server Actions (#8 Teil 1).
//
// Die eine Stelle, die den Benutzer einer Anfrage bestimmt. Bis zur Anmeldung
// (#43) ist das die Probe-Anmeldung: ein Cookie mit der benutzer_id, gesetzt
// ueber die Auswahl in der Kopfleiste (app/probe-anmeldung.ts). Mit #43 liest
// benutzerDerAnfrage() stattdessen die echte Sitzung, sonst aendert sich
// nichts.
//
// KEIN "use server" in dieser Datei: jede Funktion einer "use server"-Datei
// waere eine oeffentlich aufrufbare Server Action. Diese Hilfen sollen nur
// von Seiten und Actions auf dem Server benutzt werden.
//
// Jede Seite prueft selbst, nicht das Layout: ein Layout laeuft beim Wechsel
// zwischen Seiten nicht neu (Next.js-Doku, Guides, Authentication, "be
// cautious when doing checks in Layouts").

import { cookies } from "next/headers";
import type { Benutzer } from "@/lib/benutzer";
import { angemeldeterBenutzer, darf, pruefe, type Bezug, type Pruefung, type Recht } from "@/lib/rechte";
import { speicher } from "@/lib/speicher";

/** Name des Cookies der Probe-Anmeldung. Inhalt: nur die benutzer_id. */
export const PROBE_COOKIE = "probe-benutzer";

export async function benutzerDerAnfrage(): Promise<Benutzer | null> {
  const wert = (await cookies()).get(PROBE_COOKIE)?.value;
  return angemeldeterBenutzer(speicher, wert);
}

/**
 * Prueft das Recht fuer eine Seite oder Aktion und haelt eine Ablehnung fest.
 * "ziel" steht im Protokoll der abgelehnten Zugriffe, z. B. der Pfad der
 * Seite oder "Aktion: Maschine anlegen (M-1011)".
 */
export async function zugriff(recht: Recht, ziel: string, bezug?: Bezug): Promise<Pruefung> {
  return pruefe(speicher, await benutzerDerAnfrage(), recht, ziel, { bezug });
}

/** Nur nachsehen, ohne festzuhalten: z. B. ob ein Link gezeigt wird. */
export async function kann(recht: Recht): Promise<boolean> {
  return (await darf(speicher, await benutzerDerAnfrage(), recht)).erlaubt;
}

/**
 * Text aus einem Formular oder der Adresse fuer das Ziel im Protokoll der
 * abgelehnten Zugriffe: gekuerzt, weil er vom Browser kommt, und nie leer.
 */
export function zielText(text: string): string {
  const t = text.trim();
  if (!t) return "ohne Angabe";
  return t.length > 40 ? `${t.slice(0, 40)}…` : t;
}
