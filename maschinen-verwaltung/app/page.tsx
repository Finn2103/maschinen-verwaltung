import { maschinen } from "@/lib/maschinen";
import { suche, zeitraumFehler, type Suchfilter } from "@/lib/verfuegbarkeit";
import { Suchformular } from "@/components/Suchformular";
import Link from "next/link";

type Props = { searchParams: Promise<Suchfilter> };

export default async function Startseite({ searchParams }: Props) {
  const filter = await searchParams;
  const fehler = zeitraumFehler(filter.von, filter.bis);
  const treffer = fehler ? [] : suche(maschinen, filter);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Maschinen suchen</h1>

      <Suchformular werte={filter} fehler={fehler} />

      <p
        aria-live="polite"
        className="mt-8 text-sm text-neutral-600 dark:text-neutral-400"
      >
        {fehler
          ? "Suche nicht ausgeführt, bitte Eingabe prüfen."
          : `${treffer.length} von ${maschinen.length} Maschinen verfügbar.`}
      </p>

      {!fehler && treffer.length === 0 ? (
        <div className="mt-6 rounded border border-neutral-200 p-6 text-sm dark:border-neutral-800">
          <p className="font-medium">Keine Maschine im gewählten Zeitraum frei.</p>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Wählen Sie einen anderen Zeitraum, oder setzen Sie Kategorie und
            Standort auf &bdquo;alle&ldquo;.
          </p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-neutral-200 dark:divide-neutral-800">
          {treffer.map((maschine) => (
            <li key={maschine.inventarnummer} className="py-4">
              <h2 className="font-medium">{maschine.bezeichnung}</h2>
              <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-4 text-sm text-neutral-600 dark:text-neutral-400">
                <dt>Inventarnummer</dt>
                <dd>{maschine.inventarnummer}</dd>
                <dt>Kategorie</dt>
                <dd>{maschine.kategorie}</dd>
                <dt>Standort</dt>
                <dd>{maschine.standort}</dd>
              </dl>

              <Link
                href={`/reservieren/${maschine.inventarnummer}${
                  filter.von && filter.bis
                    ? `?von=${filter.von}&bis=${filter.bis}`
                    : ""
                }`}
                className="mt-2 inline-block text-sm underline underline-offset-2"
              >
                Reservieren
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}