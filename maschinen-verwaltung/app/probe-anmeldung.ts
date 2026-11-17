"use server";

// Server Action der Probe-Anmeldung (#8 Teil 1, Antwort 60 vom 16.11.).
//
// Bis zur Anmeldung (#43) waehlt man in der Kopfleiste, als wer man arbeitet:
// ohne Anmeldung oder einer der Beispielbenutzer, einer je Rolle. Das ist
// eine Selbstauskunft ohne Passwort, wie vorher das Kuerzel im Formular
// (Antwort 37). Was die gewaehlte Rolle darf, prueft der Server trotzdem bei
// jeder Seite und jeder Aktion.
//
// Im Cookie steht nur die benutzer_id. httpOnly: Skripte im Browser lesen ihn
// nicht. sameSite "lax": er geht bei Formularen anderer Seiten nicht mit.
// Mit #43 faellt diese Datei weg.
//
// Nach dem Setzen zeigt Next.js die aktuelle Seite neu an, mit dem neuen
// Benutzer (Next.js-Doku, cookies, "Understanding Cookie Behavior in Server
// Functions"). Eine Weiterleitung braucht es nicht.

import { cookies } from "next/headers";
import { angemeldeterBenutzer } from "@/lib/rechte";
import { speicher } from "@/lib/speicher";
import { PROBE_COOKIE } from "./sitzung";

export async function probeAnmelden(daten: FormData): Promise<void> {
  const gewaehlt = String(daten.get("benutzer") ?? "");
  const kekse = await cookies();

  // Ein unbekannter oder deaktivierter Benutzer meldet ab, statt einen
  // beliebigen Wert in den Cookie zu schreiben.
  const benutzer = await angemeldeterBenutzer(speicher, gewaehlt);
  if (!benutzer) {
    kekse.delete(PROBE_COOKIE);
    return;
  }

  kekse.set(PROBE_COOKIE, benutzer.benutzerId, { httpOnly: true, sameSite: "lax", path: "/" });
}
