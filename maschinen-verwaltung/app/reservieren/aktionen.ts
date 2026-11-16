"use server";

// Server Action fuer das Reservierungsformular.
//
// "use server" heisst: diese Funktion laeuft ausschliesslich auf dem Server,
// auch wenn das Formular im Browser steht. Sie kommt nie in den Browser.
// Deshalb darf hier auf den Speicher zugegriffen werden, aus einer
// Client-Komponente heraus duerfte das nicht passieren.
//
// Die Funktion prueft NICHT selbst, sie uebergibt an die Fachlogik. Sie hat
// genau zwei Aufgaben an der Grenze:
//
//  1. FormData in Fachobjekte uebersetzen. Alles aus einem Formular ist Text,
//     auch bei type="date".
//  2. Das Ergebnis wieder serialisierbar machen. Der Rueckgabewert einer
//     Server Action geht an eine Client-Komponente und muss deshalb aus
//     einfachen Objekten bestehen. Eine Klasseninstanz verliert dabei ihren
//     Prototyp und damit ihre Methoden, deshalb "alsAnzeige()".
//
// Im Fehlerfall haengt sie die Eingaben an, damit das Formular sie wieder
// anzeigen kann. Das ist Darstellung, deshalb steht es hier und nicht in der
// Fachlogik.

import { reservieren } from "@/lib/reservieren";
import { Kunde, type Feld, type ReservierungAnzeige } from "@/lib/reservierung";
import { speicher } from "@/lib/speicher";
import { zielText, zugriff } from "../sitzung";

export type Eingaben = {
  von: string;
  bis: string;
  name: string;
  email: string;
  telefon: string;
};

export type FormularZustand =
  | { ok: true; reservierung: ReservierungAnzeige }
  // feld null: die Meldung gehoert zu keinem Feld, z. B. ein abgelehnter Zugriff.
  | { ok: false; fehler: string; feld: Feld | null; eingaben: Eingaben }
  | null;

export async function reservierungAbsenden(
  _vorherigerZustand: FormularZustand,
  daten: FormData,
): Promise<FormularZustand> {
  const text = (feld: string) => String(daten.get(feld) ?? "").trim();

  const eingaben: Eingaben = {
    von: text("von"),
    bis: text("bis"),
    name: text("name"),
    email: text("email"),
    telefon: text("telefon"),
  };

  // Rechtepruefung (#8) als Erstes: die Action laesst sich auch ohne das
  // Formular direkt aufrufen. Ohne Anmeldung ist Reservieren bis #43 erlaubt
  // (F6), Name und E-Mail-Adresse kommen bis dahin aus dem Formular.
  const zugang = await zugriff(
    "ausleihe.reservieren",
    `Aktion: Reservieren (${zielText(text("inventarnummer"))})`,
  );
  if (!zugang.erlaubt) return { ok: false, fehler: zugang.meldung, feld: null, eingaben };

  const ergebnis = await reservieren(
    speicher,
    text("inventarnummer"),
    eingaben.von,
    eingaben.bis,
    new Kunde(eingaben.name, eingaben.email, eingaben.telefon),
  );

  if (ergebnis.ok) {
    return { ok: true, reservierung: ergebnis.reservierung.alsAnzeige() };
  }
  return { ok: false, fehler: ergebnis.fehler, feld: ergebnis.feld, eingaben };
}
