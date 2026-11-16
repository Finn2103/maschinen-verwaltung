import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { zeitpunktDeutsch } from "@/lib/datum";
import { speicher } from "@/lib/speicher";

// Aenderungsprotokoll einer Maschine (#2, Mockup 09): Zeitpunkt, Benutzer,
// Feld, alter und neuer Wert, neueste zuerst.
//
// Nur lesen. Es gibt hier keinen Knopf zum Aendern oder Loeschen, und der
// Speicher hat keine Methode dafuer.

type Props = { params: Promise<{ inventarnummer: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { inventarnummer } = await params;
  return { title: `Protokoll ${inventarnummer}` };
}

const leer = (text: string) =>
  text === "" ? (
    <span className="text-neutral-500">
      <span aria-hidden="true">—</span>
      <span className="sr-only">kein Wert</span>
    </span>
  ) : (
    text
  );

export default async function Protokoll({ params }: Props) {
  const { inventarnummer } = await params;
  const maschine = await speicher.maschine(inventarnummer);
  if (!maschine) notFound();

  const eintraege = await speicher.protokollFuer(inventarnummer);

  return (
    <main className="py-8">
      <Link
        href={`/verwaltung/maschinen/${maschine.inventarnummer}`}
        className="text-sm underline underline-offset-2"
      >
        Zurück zur Maschine
      </Link>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Änderungsprotokoll</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {maschine.bezeichnung} · <span className="font-mono">{maschine.inventarnummer}</span>
        </p>
      </div>

      {eintraege.length === 0 ? (
        <div className="mt-6 rounded border border-neutral-300 p-6 text-sm dark:border-neutral-700">
          <p className="font-medium">Noch keine Änderung protokolliert.</p>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Die Beispieldaten stammen aus der Zeit vor dem Protokoll. Jede Änderung über{" "}
            <Link
              href={`/verwaltung/maschinen/${maschine.inventarnummer}`}
              className="underline underline-offset-2"
            >
              Bearbeiten
            </Link>{" "}
            erscheint hier.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">
              Änderungen an {maschine.inventarnummer}, neueste zuerst
            </caption>
            <thead>
              <tr className="border-b border-neutral-300 text-left dark:border-neutral-700">
                <th scope="col" className="py-2 pr-4 font-medium">Zeitpunkt</th>
                <th scope="col" className="py-2 pr-4 font-medium">Benutzer</th>
                <th scope="col" className="py-2 pr-4 font-medium">Feld</th>
                <th scope="col" className="py-2 pr-4 font-medium">Vorher</th>
                <th scope="col" className="py-2 font-medium">Nachher</th>
              </tr>
            </thead>
            <tbody>
              {eintraege.map((e, i) => (
                <tr
                  key={`${e.zeitpunkt}-${e.feld}-${i}`}
                  className="border-b border-neutral-200 dark:border-neutral-800"
                >
                  <td className="py-2 pr-4 whitespace-nowrap tabular-nums">
                    {zeitpunktDeutsch(e.zeitpunkt)}
                  </td>
                  <td className="py-2 pr-4 font-mono">{e.benutzer}</td>
                  <td className="py-2 pr-4">{e.feld}</td>
                  <td className="py-2 pr-4">{leer(e.alt)}</td>
                  <td className="py-2">{leer(e.neu)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-xs text-neutral-600 dark:text-neutral-400">
        Das Protokoll liegt wie die Maschinen im Arbeitsspeicher des Servers und ist nach einem
        Neustart leer (ADR 0011). Die Tabelle dafür kommt mit dem Item zu Rollen, Rechten und
        Protokoll.
      </p>
    </main>
  );
}
