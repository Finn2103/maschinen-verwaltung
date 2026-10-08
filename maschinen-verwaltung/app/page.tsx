import { maschinen } from "@/lib/maschinen";

export default function Startseite() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Maschinenpark</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        {maschinen.length} Maschinen im Bestand. Beispieldaten, noch ohne Suche.
      </p>

      <ul className="mt-8 divide-y divide-neutral-200 dark:divide-neutral-800">
        {maschinen.map((maschine) => (
          <li key={maschine.inventarnummer} className="py-4">
            <h2 className="font-medium">{maschine.bezeichnung}</h2>

            <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-4 text-sm text-neutral-600 dark:text-neutral-400">
              <dt>Inventarnummer</dt>
              <dd>{maschine.inventarnummer}</dd>

              <dt>Kategorie</dt>
              <dd>{maschine.kategorie}</dd>

              <dt>Standort</dt>
              <dd>{maschine.standort}</dd>

              <dt>Belegt</dt>
              <dd>
                {maschine.belegungen.length === 0
                  ? "keine Belegung erfasst"
                  : maschine.belegungen
                    .map((belegung) => `${belegung.von} bis ${belegung.bis}`)
                    .join(", ")}
              </dd>
            </dl>
          </li>
        ))}
      </ul>
    </main>
  );
}