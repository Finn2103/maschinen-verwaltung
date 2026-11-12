import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Maschinenformular } from "@/components/Maschinenformular";
import { speicher } from "@/lib/speicher";
import { maschineAendernAbsenden } from "../aktionen";
import { formulardaten } from "../formulardaten";

// Maschine bearbeiten (#2). Nach dem Speichern leitet die Action hierher
// zurueck, mit ?gespeichert=<Anzahl geaenderter Felder>.

type Props = {
  params: Promise<{ inventarnummer: string }>;
  searchParams: Promise<{ gespeichert?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { inventarnummer } = await params;
  const maschine = await speicher.maschine(inventarnummer);
  return { title: maschine ? `${maschine.inventarnummer} bearbeiten` : "Maschine nicht gefunden" };
}

export default async function MaschineBearbeiten({ params, searchParams }: Props) {
  const { inventarnummer } = await params;
  const { gespeichert } = await searchParams;

  const maschine = await speicher.maschine(inventarnummer);
  if (!maschine) notFound();

  const { typen, standorte } = await formulardaten();
  const anzahl = gespeichert === undefined ? null : Number(gespeichert);

  return (
    <main className="py-8">
      <Link href="/verwaltung/maschinen" className="text-sm underline underline-offset-2">
        Zurück zur Liste
      </Link>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{maschine.bezeichnung} bearbeiten</h1>
        <p className="font-mono text-sm text-neutral-600 dark:text-neutral-400">
          {maschine.inventarnummer}
        </p>
        <Link
          href={`/verwaltung/maschinen/${maschine.inventarnummer}/protokoll`}
          className="text-sm underline underline-offset-2 sm:ml-auto"
        >
          Änderungsprotokoll
        </Link>
      </div>

      {anzahl !== null && Number.isInteger(anzahl) && (
        <p
          role="status"
          className="mt-6 rounded border-l-4 border-green-700 bg-green-50 p-3 text-sm dark:border-green-400 dark:bg-green-950"
        >
          {anzahl === 0
            ? "Keine Änderung, es wurde nichts gespeichert."
            : `${anzahl === 1 ? "1 Änderung" : `${anzahl} Änderungen`} gespeichert und protokolliert.`}
        </p>
      )}

      <Maschinenformular
        // Nach dem Speichern neu aufbauen, damit die Felder den neuen Stand zeigen.
        key={JSON.stringify(maschine.alsEingabe())}
        modus="aendern"
        aktion={maschineAendernAbsenden}
        typen={typen}
        standorte={standorte}
        vorgabe={{ ...maschine.alsEingabe(), benutzer: "" }}
      />
    </main>
  );
}
