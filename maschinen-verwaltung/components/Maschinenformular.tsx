"use client";

// Das Stammdatenformular (#2), fuer Anlegen und Bearbeiten.
//
// Client-Komponente aus demselben Grund wie das Reservierungsformular: die
// Fehler kennt erst der Server, sie muessen an ihre Felder und der Fokus auf
// das erste betroffene Feld (ADR 0009, Abschnitt C). Geprueft wird nur auf dem
// Server. Deshalb "noValidate": der Browser soll keine eigenen Sprechblasen
// zeigen, die anders aussehen und anders klingen als unsere Meldungen am Feld.
// "required" bleibt trotzdem stehen, damit Hilfstechnik "erforderlich" ansagt.
//
// Diese Komponente kennt weder Speicher noch Fachobjekt. Sie bekommt Text und
// einfache Listen, und Feldnamen aus lib/maschinenfelder.ts, einer Datei ohne
// Logik. So bleibt die Klasse Maschine aus dem Browser-Bundle heraus.

import { useActionState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import type { FormularEingaben, StammdatenZustand } from "@/app/verwaltung/maschinen/aktionen";
import { FELDNAMEN, MASCHINEN_FELDER, type MaschinenFeld } from "@/lib/maschinenfelder";

type FeldName = MaschinenFeld | "benutzer";

const REIHENFOLGE: FeldName[] = [...MASCHINEN_FELDER, "benutzer"];
const BESCHRIFTUNG: Record<FeldName, string> = { ...FELDNAMEN, benutzer: "Ihr Kürzel" };

type Props = {
  modus: "anlegen" | "aendern";
  aktion: (zustand: StammdatenZustand, daten: FormData) => Promise<StammdatenZustand>;
  vorgabe: FormularEingaben;
  typen: { typnummer: number; bezeichnung: string }[];
  standorte: string[];
};

const hinweisId = (name: FeldName) => `${name}-hinweis`;
const fehlerId = (name: FeldName) => `${name}-fehler`;

export function Maschinenformular({ modus, aktion, vorgabe, typen, standorte }: Props) {
  const [zustand, absenden, laeuft] = useActionState<StammdatenZustand, FormData>(aktion, null);

  const fehler = zustand?.fehler ?? {};
  const betroffen = REIHENFOLGE.filter((name) => fehler[name]);
  // Nach einer Ablehnung die Eingaben wieder anzeigen (ADR 0009, C).
  const werte = zustand?.eingaben ?? vorgabe;

  // Fokus auf das erste fehlerhafte Feld, in Formularreihenfolge.
  useEffect(() => {
    const erstes = REIHENFOLGE.find((name) => zustand?.fehler[name]);
    if (erstes) document.getElementById(erstes)?.focus();
  }, [zustand]);

  /** Gemeinsame Attribute je Feld, damit die Verknuepfung nicht achtmal dasteht. */
  const attribute = (name: FeldName, hinweis: boolean) => {
    const meldung = fehler[name];
    const beschrieben = [meldung && fehlerId(name), hinweis && hinweisId(name)]
      .filter(Boolean)
      .join(" ");
    return {
      id: name,
      name,
      "aria-invalid": meldung ? true : undefined,
      "aria-describedby": beschrieben || undefined,
      className:
        "mt-1 w-full rounded border px-2 py-1.5 dark:bg-neutral-900 " +
        (meldung
          ? "border-2 border-red-700 dark:border-red-400"
          : "border-neutral-400 dark:border-neutral-600"),
    };
  };

  const rahmen = (
    name: FeldName,
    pflicht: boolean,
    hinweis: string | null,
    feld: ReactNode,
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">
        {BESCHRIFTUNG[name]}
        {pflicht && (
          <span aria-hidden="true" className="text-red-700 dark:text-red-400">
            {" "}
            *
          </span>
        )}
      </label>
      {feld}
      {fehler[name] && (
        <p id={fehlerId(name)} className="mt-1 text-sm font-medium text-red-700 dark:text-red-400">
          {fehler[name]}
        </p>
      )}
      {hinweis && (
        <p id={hinweisId(name)} className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
          {hinweis}
        </p>
      )}
    </div>
  );

  return (
    <form
      action={absenden}
      noValidate
      autoComplete="off"
      key={zustand ? JSON.stringify(zustand.eingaben) : "vorgabe"}
      className="mt-6 max-w-2xl space-y-6"
    >
      {betroffen.length > 0 && (
        <div
          role="alert"
          className="rounded border-l-4 border-red-700 bg-red-50 p-3 text-sm text-red-900 dark:border-red-400 dark:bg-red-950 dark:text-red-100"
        >
          <p className="font-medium">
            {betroffen.length === 1
              ? "1 Feld muss korrigiert werden:"
              : `${betroffen.length} Felder müssen korrigiert werden:`}
          </p>
          <ul className="mt-1 flex flex-wrap gap-x-4">
            {betroffen.map((name) => (
              <li key={name}>
                <a href={`#${name}`} className="underline underline-offset-2">
                  {BESCHRIFTUNG[name]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        <span aria-hidden="true" className="text-red-700 dark:text-red-400">
          *
        </span>{" "}
        Pflichtfeld
      </p>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-semibold">Stammdaten</legend>

        {rahmen(
          "inventarnummer",
          true,
          modus === "anlegen"
            ? "Format M-0000, muss eindeutig sein"
            : "Die Inventarnummer ist der Schlüssel der Maschine und lässt sich nach dem Anlegen nicht ändern.",
          <input
            type="text"
            required
            readOnly={modus === "aendern"}
            defaultValue={werte.inventarnummer}
            {...attribute("inventarnummer", true)}
            className={
              attribute("inventarnummer", true).className +
              " font-mono" +
              (modus === "aendern" ? " bg-neutral-100 dark:bg-neutral-800" : "")
            }
          />,
        )}

        {rahmen(
          "typnummer",
          true,
          null,
          <select required defaultValue={werte.typnummer} {...attribute("typnummer", false)}>
            <option value="">Bitte auswählen</option>
            {typen.map((t) => (
              <option key={t.typnummer} value={String(t.typnummer)}>
                {t.bezeichnung}
              </option>
            ))}
          </select>,
        )}

        {rahmen(
          "seriennummer",
          true,
          "Vom Typenschild",
          <input
            type="text"
            required
            defaultValue={werte.seriennummer}
            {...attribute("seriennummer", true)}
          />,
        )}

        {rahmen(
          "baujahr",
          true,
          null,
          <input
            type="text"
            inputMode="numeric"
            required
            defaultValue={werte.baujahr}
            {...attribute("baujahr", false)}
          />,
        )}

        {rahmen(
          "betriebsstunden",
          false,
          "Zählerstand in Stunden, höchstens eine Nachkommastelle. Leer heißt 0.",
          <input
            type="text"
            inputMode="decimal"
            defaultValue={werte.betriebsstunden}
            {...attribute("betriebsstunden", true)}
          />,
        )}

        {rahmen(
          "wartungsintervall",
          false,
          "In Betriebsstunden, ganze Zahl. Leer lassen, wenn die Maschine keins hat.",
          <input
            type="text"
            inputMode="numeric"
            defaultValue={werte.wartungsintervall}
            {...attribute("wartungsintervall", true)}
          />,
        )}

        {rahmen(
          "standort",
          true,
          "Aus der Liste wählen oder einen neuen Standort eintippen.",
          <>
            <input
              type="text"
              required
              list="standorte-liste"
              defaultValue={werte.standort}
              {...attribute("standort", true)}
            />
            <datalist id="standorte-liste">
              {standorte.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </>,
        )}
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-semibold">Änderungsprotokoll</legend>
        {rahmen(
          "benutzer",
          true,
          "Steht im Änderungsprotokoll. Bis zur Anmeldung (#43) tragen Sie es selbst ein.",
          <input
            type="text"
            required
            defaultValue={werte.benutzer}
            {...attribute("benutzer", true)}
          />,
        )}
      </fieldset>

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={laeuft}
          className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {laeuft ? "Wird geprüft …" : modus === "anlegen" ? "Maschine anlegen" : "Änderungen speichern"}
        </button>
        <Link href="/verwaltung/maschinen" className="text-sm underline underline-offset-2">
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
