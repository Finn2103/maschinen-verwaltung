import Link from "next/link";
import { speicher } from "@/lib/speicher";
import { zahlDeutsch } from "@/lib/zahl";

// Maschinenliste der Verwaltung (#2, Mockup 06): "Maschinen sind ueber
// Inventarnummer, Typ und Standort auffindbar."
//
// Ein Suchfeld fuer alle drei, wie im Mockup. Der Suchbegriff steht in der
// Adresse (?q=...), nicht im Browserzustand, wie bei der Kundensuche
// (docs/frontend-konventionen.md, Abschnitt 3): teilbar, Zurueck-Taste geht,
// Zuruecksetzen ist ein Link.
//
// Die Spalte "Status" aus dem Mockup (verfuegbar, verliehen, in Wartung) fehlt:
// Ausleihe (#9) und Wartung (#3) gibt es noch nicht, ein Status ohne Grundlage
// waere erfunden.

export const metadata = { title: "Maschinen verwalten" };

type Props = { searchParams: Promise<{ q?: string; angelegt?: string }> };

export default async function Maschinenliste({ searchParams }: Props) {
  const { q = "", angelegt } = await searchParams;
  const alle = await speicher.maschinen();
  const treffer = alle.filter((m) => m.trifftSuchbegriff(q));
  const neu = angelegt ? await speicher.maschine(angelegt) : undefined;

  return (
    <main className="py-8">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Maschinen</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{alle.length} Datensätze</p>
        <Link
          href="/verwaltung/maschinen/neu"
          className="ml-auto rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          Maschine anlegen
        </Link>
      </div>

      {neu && (
        <p
          role="status"
          className="mt-6 rounded border-l-4 border-green-700 bg-green-50 p-3 text-sm dark:border-green-400 dark:bg-green-950"
        >
          Maschine <span className="font-mono">{neu.inventarnummer}</span> ({neu.bezeichnung})
          angelegt.{" "}
          <Link
            href={`/verwaltung/maschinen/${neu.inventarnummer}/protokoll`}
            className="underline underline-offset-2"
          >
            Protokoll ansehen
          </Link>
        </p>
      )}

      <form method="get" key={q} autoComplete="off" className="mt-6 flex flex-wrap items-end gap-3">
        <div className="min-w-0 grow sm:max-w-md">
          <label htmlFor="q" className="block text-sm font-medium">
            Suche
          </label>
          <input
            type="search"
            id="q"
            name="q"
            defaultValue={q}
            aria-describedby="q-hinweis"
            className="mt-1 w-full rounded border border-neutral-400 px-2 py-1.5 dark:border-neutral-600 dark:bg-neutral-900"
          />
          <p id="q-hinweis" className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            Inventarnummer, Maschinentyp oder Standort
          </p>
        </div>
        <div className="flex items-center gap-4 pb-6">
          <button
            type="submit"
            className="rounded border border-neutral-400 px-4 py-1.5 text-sm font-medium dark:border-neutral-600"
          >
            Suchen
          </button>
          {q && (
            <Link href="/verwaltung/maschinen" className="text-sm underline underline-offset-2">
              Suche leeren
            </Link>
          )}
        </div>
      </form>

      <p aria-live="polite" className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        {q ? `${treffer.length} von ${alle.length} Maschinen passen zu „${q}“.` : null}
      </p>

      {treffer.length === 0 ? (
        <div className="mt-4 rounded border border-neutral-300 p-6 text-sm dark:border-neutral-700">
          <p className="font-medium">Keine Maschine passt zu „{q}“.</p>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Prüfen Sie die Schreibweise oder suchen Sie nach einem Teil, zum Beispiel „1003“
            oder „Bagger“.{" "}
            <Link href="/verwaltung/maschinen" className="underline underline-offset-2">
              Alle Maschinen zeigen
            </Link>
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">Maschinen, nach Inventarnummer sortiert</caption>
            <thead>
              <tr className="border-b border-neutral-300 text-left dark:border-neutral-700">
                <th scope="col" className="py-2 pr-4 font-medium">Inventarnr.</th>
                <th scope="col" className="py-2 pr-4 font-medium">Maschinentyp</th>
                <th scope="col" className="py-2 pr-4 text-right font-medium">Baujahr</th>
                <th scope="col" className="py-2 pr-4 text-right font-medium">Betriebsstd.</th>
                <th scope="col" className="py-2 pr-4 font-medium">Standort</th>
                <th scope="col" className="py-2 font-medium">
                  <span className="sr-only">Aktion</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {treffer.map((m) => (
                <tr
                  key={m.inventarnummer}
                  className="border-b border-neutral-200 dark:border-neutral-800"
                >
                  <td className="py-2 pr-4 font-mono">{m.inventarnummer}</td>
                  <td className="py-2 pr-4">{m.bezeichnung}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{m.baujahr}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">
                    {zahlDeutsch(m.betriebsstunden)}
                  </td>
                  <td className="py-2 pr-4">{m.standort}</td>
                  <td className="py-2 text-right">
                    <Link
                      href={`/verwaltung/maschinen/${m.inventarnummer}`}
                      className="underline underline-offset-2"
                    >
                      Bearbeiten<span className="sr-only"> {m.inventarnummer}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
