"use client";

// Die erste und bisher einzige Client-Komponente im Projekt.
//
// Begruendung, weil "use client" laut Oberflaechen-Konventionen Abschnitt 3 die
// Ausnahme ist: das Formular muss eine Fehlermeldung anzeigen, die erst der
// Server kennt, sie dem betroffenen Feld zuordnen und den Fokus dorthin setzen.
// Dafuer braucht es useActionState und useEffect, also Zustand im Browser.
//
// Der Datenzugriff bleibt trotzdem auf dem Server: abgesendet wird an eine
// Server Action, die Fachlogik und Speicher laufen dort. Diese Komponente
// kennt den Speicher nicht.

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { reservierungAbsenden, type FormularZustand } from "@/app/reservieren/aktionen";
import type { Maschine } from "@/lib/maschinen";
import type { Feld } from "@/lib/reservieren";

const FEHLER_ID = "reservierung-fehler";

type Props = {
  maschine: Maschine;
  von?: string;
  bis?: string;
};

export function Reservierungsformular({ maschine, von, bis }: Props) {
  const [ergebnis, absenden, laeuft] = useActionState<FormularZustand, FormData>(
    reservierungAbsenden,
    null,
  );

  const fehlerFeld = ergebnis && !ergebnis.ok ? ergebnis.feld : null;
  const fehlerText = ergebnis && !ergebnis.ok ? ergebnis.fehler : null;

  // Nach einer Ablehnung die Eingaben wieder anzeigen, statt den Kunden alles
  // neu eintippen zu lassen. Die Werte kommen aus dem Ergebnis der Server
  // Action zurueck, der Zeitraum sonst aus der Suche.
  const vorher = ergebnis && !ergebnis.ok ? ergebnis.eingaben : null;

  // Nach einem Fehler den Fokus auf das betroffene Feld setzen. Ohne das steht
  // man nach dem Absenden am Knopf und erfaehrt mit Hilfstechnik nicht, wo das
  // Problem liegt.
  useEffect(() => {
    if (fehlerFeld) {
      document.getElementById(fehlerFeld)?.focus();
    }
  }, [fehlerFeld, ergebnis]);

  if (ergebnis?.ok) {
    return (
      <div
        role="status"
        className="mt-6 rounded border border-green-700 bg-green-50 p-6 dark:border-green-400 dark:bg-green-950"
      >
        <h2 className="font-medium">Reservierung angelegt</h2>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 text-sm">
          <dt>Vorgangsnummer</dt>
          <dd>{ergebnis.reservierung.id}</dd>
          <dt>Maschine</dt>
          <dd>{maschine.bezeichnung}</dd>
          <dt>Zeitraum</dt>
          <dd>
            {ergebnis.reservierung.von} bis {ergebnis.reservierung.bis}
          </dd>
        </dl>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          Eine Bestätigung per E-Mail wird noch nicht verschickt, der Mailserver
          aus #12 und #13 steht noch nicht. Die Reservierung liegt im
          Arbeitsspeicher des Servers und ist nach einem Neustart weg, siehe
          ADR 0011.
        </p>
        <Link href="/" className="mt-4 inline-block text-sm underline underline-offset-2">
          Zurück zur Suche
        </Link>
      </div>
    );
  }

  /** Gemeinsame Attribute je Feld, damit die Fehlerzuordnung nicht fuenfmal dasteht. */
  const feld = (name: Feld) => {
    const betroffen = fehlerFeld === name;
    return {
      id: name,
      name,
      "aria-invalid": betroffen || undefined,
      "aria-describedby": betroffen ? FEHLER_ID : undefined,
      className:
        "mt-1 w-full rounded border px-2 py-1 dark:bg-neutral-900 " +
        (betroffen
          ? "border-red-700 dark:border-red-400"
          : "border-neutral-300 dark:border-neutral-700"),
    };
  };

  return (
    <form
      action={absenden}
      autoComplete="off"
      key={vorher ? JSON.stringify(vorher) : "leer"}
      className="mt-6 max-w-md space-y-5"
    >
      {/* Server Actions bekommen die searchParams der Seite nicht automatisch. */}
      <input type="hidden" name="inventarnummer" value={maschine.inventarnummer} />

      {fehlerText && (
        <p
          id={FEHLER_ID}
          role="alert"
          className="rounded border-l-4 border-red-700 bg-red-50 p-3 text-sm text-red-900 dark:border-red-400 dark:bg-red-950 dark:text-red-100"
        >
          {fehlerText}
        </p>
      )}

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Zeitraum</legend>

        <div className="flex flex-wrap gap-4">
          <div className="grow">
            <label htmlFor="von" className="block text-sm">
              Von
            </label>
            <input
              type="date"
              defaultValue={vorher?.von ?? von ?? ""}
              required
              {...feld("von")}
            />
          </div>

          <div className="grow">
            <label htmlFor="bis" className="block text-sm">
              Bis
            </label>
            <input
              type="date"
              defaultValue={vorher?.bis ?? bis ?? ""}
              required
              {...feld("bis")}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Ihre Daten</legend>

        <div>
          <label htmlFor="name" className="block text-sm">
            Name
          </label>
          <input
            type="text"
            defaultValue={vorher?.name ?? ""}
            required
            {...feld("name")}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm">
            E-Mail
          </label>
          <input
            type="email"
            defaultValue={vorher?.email ?? ""}
            required
            {...feld("email")}
          />
        </div>

        <div>
          <label htmlFor="telefon" className="block text-sm">
            Telefon
          </label>
          <input
            type="tel"
            defaultValue={vorher?.telefon ?? ""}
            required
            {...feld("telefon")}
          />
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={laeuft}
          className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {laeuft ? "Wird geprüft …" : "Verbindlich reservieren"}
        </button>

        <Link href="/" className="text-sm underline underline-offset-2">
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
