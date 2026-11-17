"use client";

// Auswahl und Knopf "Wechseln" der Probe-Anmeldung (#124).
//
// Begruendung, weil "use client" laut Oberflaechen-Konventionen Abschnitt 3 die
// Ausnahme ist: Im Klicktest sah man nach "Wechseln" nichts, und der Knopf
// wurde mehrfach gedrueckt. Rueckmeldung braucht Zustand im Browser:
//
// - waehrend des Wechsels: Knopf gesperrt, "Wechsle …" (useActionState)
// - danach: als wer man jetzt arbeitet, sichtbar und als Statusmeldung
// - der Knopf erst aktiv, wenn eine andere Wahl getroffen ist (useState)
//
// Die Benutzerliste bleibt auf dem Server: die <option>-Elemente rendert
// components/ProbeAnmeldung.tsx und gibt sie als children herein. Diese
// Komponente kennt weder Speicher noch Benutzer, nur die benutzer_id der
// aktuellen Anmeldung.
//
// Ohne JavaScript schickt das Formular normal an die Server Action ab. Damit
// der Knopf dann nicht gesperrt bleibt, gilt die Sperre "keine andere Wahl"
// erst, wenn die Seite im Browser laeuft.

import { useActionState, useState, useSyncExternalStore, type ReactNode } from "react";
import { probeAnmelden } from "@/app/probe-anmeldung";

type Props = {
  /** benutzer_id der aktuellen Anmeldung, leer heisst ohne Anmeldung. */
  aktuell: string;
  /** Die <option>-Elemente, gerendert auf dem Server. */
  children: ReactNode;
};

// Fuer useSyncExternalStore: es gibt nichts zu abonnieren. Auf dem Server und
// beim ersten Rendern im Browser false, danach true.
const nichtsAbonnieren = () => () => {};

export function ProbeWechsel({ aktuell, children }: Props) {
  const [meldung, wechseln, laeuft] = useActionState<string | null, FormData>(probeAnmelden, null);
  // Die Wahl gilt nur fuer die Anmeldung, zu der sie getroffen wurde. Kommt
  // vom Server eine andere (nach dem Wechsel), zaehlt wieder die aktuelle.
  const [wahl, setWahl] = useState({ zu: aktuell, wert: aktuell });
  const gewaehlt = wahl.zu === aktuell ? wahl.wert : aktuell;
  const imBrowser = useSyncExternalStore(
    nichtsAbonnieren,
    () => true,
    () => false,
  );

  const unveraendert = gewaehlt === aktuell;
  const gesperrt = laeuft || (imBrowser && unveraendert);

  return (
    <form
      action={wechseln}
      aria-busy={laeuft}
      className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2"
    >
      <label htmlFor="probe-benutzer">Wechseln zu</label>
      {/* Ungesteuert mit defaultValue und key: React setzt ein Formular nach
          einer Action zurueck (form.reset()). Eine gesteuerte Auswahl spraenge
          dabei auf die erste Option "ohne Anmeldung". So baut der key die
          Auswahl mit dem neuen Benutzer neu auf, und reset() bleibt dort. */}
      <select
        key={aktuell}
        id="probe-benutzer"
        name="benutzer"
        defaultValue={aktuell}
        onChange={(e) => setWahl({ zu: aktuell, wert: e.target.value })}
        aria-describedby="probe-hinweis"
        className="max-w-full min-w-0 rounded border border-amber-800 bg-white px-2 py-1 text-neutral-900 dark:border-amber-300 dark:bg-neutral-900 dark:text-neutral-100"
      >
        {children}
      </select>
      <button
        type="submit"
        disabled={gesperrt}
        className="rounded border border-amber-800 bg-white px-3 py-1 font-medium text-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-300 dark:bg-neutral-900 dark:text-neutral-100"
      >
        {laeuft ? "Wechsle …" : "Wechseln"}
      </button>
      <span id="probe-hinweis" className="sr-only">
        Probe-Anmeldung ohne Passwort, bis es die Anmeldung aus #43 gibt. Was die
        gewählte Rolle darf, prüft der Server.
      </span>
      {/* Immer im DOM, damit Screenreader die neue Meldung vorlesen. Sie
          verschwindet, sobald eine andere Wahl getroffen ist, damit sie nicht
          neben einer noch nicht uebernommenen Auswahl steht. */}
      <p role="status" className="font-semibold">
        {meldung && unveraendert && !laeuft ? `✓ ${meldung}` : ""}
      </p>
    </form>
  );
}
