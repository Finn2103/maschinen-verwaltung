"use client";

// "Meine Reservierungen" (#1, Mockup 05): Abfrage mit E-Mail-Adresse und
// Vorgangsnummer, darunter die Reservierungen des Kunden.
//
// Client-Komponente aus demselben Grund wie die anderen Formulare: Fehler
// kennt erst der Server, sie gehoeren an ihr Feld, der Fokus dorthin. Das
// Ergebnis kommt aus der Server Action zurueck; die Komponente kennt weder
// Speicher noch Fachobjekte, nur einfache Zeilen.

import { useActionState, useEffect } from "react";
import {
  uebersichtAbfragen,
  type UebersichtZustand,
} from "@/app/meine-reservierungen/aktionen";
import { zeitraumDeutsch } from "@/lib/datum";

type FeldName = "email" | "vorgangsnummer";
const REIHENFOLGE: FeldName[] = ["email", "vorgangsnummer"];

type Props = { vorgang?: string };

export function Reservierungsuebersicht({ vorgang }: Props) {
  const [zustand, abfragen, laeuft] = useActionState<UebersichtZustand, FormData>(
    uebersichtAbfragen,
    null,
  );

  const fehler = zustand && !zustand.ok ? zustand.fehler : {};
  const werte = zustand?.eingaben ?? { email: "", vorgangsnummer: vorgang ?? "" };

  // Nach einer Ablehnung den Fokus aufs erste betroffene Feld (ADR 0009, C).
  useEffect(() => {
    if (zustand && !zustand.ok) {
      const erstes = REIHENFOLGE.find((name) => zustand.fehler[name]);
      if (erstes) document.getElementById(erstes)?.focus();
    }
  }, [zustand]);

  const attribute = (name: FeldName, hinweis: boolean) => {
    const meldung = fehler[name];
    const beschrieben = [meldung && `${name}-fehler`, hinweis && `${name}-hinweis`]
      .filter(Boolean)
      .join(" ");
    return {
      id: name,
      name,
      required: true,
      "aria-invalid": meldung ? true : undefined,
      "aria-describedby": beschrieben || undefined,
      className:
        "mt-1 w-full rounded border px-2 py-1.5 dark:bg-neutral-900 " +
        (meldung
          ? "border-2 border-red-700 dark:border-red-400"
          : "border-neutral-400 dark:border-neutral-600"),
    };
  };

  const meldung = (name: FeldName) =>
    fehler[name] && (
      <p id={`${name}-fehler`} className="mt-1 text-sm font-medium text-red-700 dark:text-red-400">
        {fehler[name]}
      </p>
    );

  return (
    <>
      <form
        action={abfragen}
        noValidate
        autoComplete="off"
        key={zustand ? JSON.stringify(zustand.eingaben) : "leer"}
        className="mt-6 flex flex-wrap items-start gap-4"
      >
        <div className="min-w-0 grow basis-64">
          <label htmlFor="email" className="block text-sm font-medium">
            E-Mail-Adresse
          </label>
          <input type="email" defaultValue={werte.email} {...attribute("email", true)} />
          {meldung("email")}
          <p id="email-hinweis" className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            Die Adresse, mit der Sie reserviert haben
          </p>
        </div>

        <div className="min-w-0 basis-40">
          <label htmlFor="vorgangsnummer" className="block text-sm font-medium">
            Vorgangsnummer
          </label>
          <input
            type="text"
            defaultValue={werte.vorgangsnummer}
            {...attribute("vorgangsnummer", true)}
            className={attribute("vorgangsnummer", true).className + " font-mono"}
          />
          {meldung("vorgangsnummer")}
          <p
            id="vorgangsnummer-hinweis"
            className="mt-1 text-xs text-neutral-600 dark:text-neutral-400"
          >
            Steht in der Bestätigung, zum Beispiel R-0001
          </p>
        </div>

        <button
          type="submit"
          disabled={laeuft}
          className="mt-6 rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {laeuft ? "Wird gesucht …" : "Anzeigen"}
        </button>
      </form>

      {zustand?.ok && (
        <section aria-labelledby="ergebnis" className="mt-8">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h2 id="ergebnis" className="text-lg font-semibold">
              Ihre Reservierungen
            </h2>
            <p role="status" className="text-sm text-neutral-600 dark:text-neutral-400">
              {zustand.zeilen.length === 1 ? "1 Vorgang" : `${zustand.zeilen.length} Vorgänge`}
            </p>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">
                Reservierungen zu {zustand.eingaben.email}, neueste zuerst
              </caption>
              <thead>
                <tr className="border-b border-neutral-300 text-left dark:border-neutral-700">
                  <th scope="col" className="py-2 pr-4 font-medium">Vorgang</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Maschine</th>
                  <th scope="col" className="py-2 font-medium">Zeitraum</th>
                </tr>
              </thead>
              <tbody>
                {zustand.zeilen.map((z) => (
                  <tr key={z.id} className="border-b border-neutral-200 dark:border-neutral-800">
                    <td className="py-2 pr-4 font-mono">{z.id}</td>
                    <td className="py-2 pr-4">
                      {z.bezeichnung}{" "}
                      <span className="font-mono text-neutral-600 dark:text-neutral-400">
                        {z.inventarnummer}
                      </span>
                    </td>
                    <td className="py-2 whitespace-nowrap tabular-nums">
                      {zeitraumDeutsch(z.von, z.bis)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
