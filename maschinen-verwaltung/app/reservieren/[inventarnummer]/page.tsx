import { notFound } from "next/navigation";
import Link from "next/link";
import { maschinen } from "@/lib/maschinen";
import { speicher } from "@/lib/speicher";
import { Reservierungsformular } from "@/components/Reservierungsformular";

// In Next.js 16 sind params und searchParams Promises und muessen awaited
// werden. In 15 gab es dafuer nur eine Warnung, in 16 schlaegt der
// synchrone Zugriff fehl.
type Props = {
  params: Promise<{ inventarnummer: string }>;
  searchParams: Promise<{ von?: string; bis?: string }>;
};

export default async function Reservieren({ params, searchParams }: Props) {
  const { inventarnummer } = await params;
  const { von, bis } = await searchParams;

  const maschine = maschinen.find((m) => m.inventarnummer === inventarnummer);
  if (!maschine) notFound();

  // Ueber den Speicher, nicht ueber maschine.belegungen: so sind bereits
  // angelegte Reservierungen mit dabei (ADR 0011).
  const belegungen = await speicher.belegungenFuer(inventarnummer);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm underline underline-offset-2">
        Zurück zur Suche
      </Link>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        {maschine.bezeichnung} reservieren
      </h1>

      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 text-sm text-neutral-600 dark:text-neutral-400">
        <dt>Inventarnummer</dt>
        <dd>{maschine.inventarnummer}</dd>
        <dt>Kategorie</dt>
        <dd>{maschine.kategorie}</dd>
        <dt>Standort</dt>
        <dd>{maschine.standort}</dd>
      </dl>

      <section className="mt-6">
        <h2 className="text-sm font-medium">Schon belegt</h2>
        {belegungen.length === 0 ? (
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Keine Belegung erfasst, die Maschine ist durchgehend frei.
          </p>
        ) : (
          <ul className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {belegungen.map((belegung) => (
              <li key={`${belegung.von}-${belegung.bis}`}>
                {belegung.von} bis {belegung.bis}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Der Rückgabetag bleibt belegt. Eine Reservierung, die am letzten Tag
          eines belegten Zeitraums beginnt, wird abgelehnt.
        </p>
      </section>

      <Reservierungsformular maschine={maschine} von={von} bis={bis} />
    </main>
  );
}
