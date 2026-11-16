import { KeinZugriff } from "@/components/KeinZugriff";
import { zeitpunktDeutsch } from "@/lib/datum";
import { speicher } from "@/lib/speicher";
import { zugriff } from "../../sitzung";

// Abgelehnte Zugriffe (#8, Kriterium 5, Mockup 13): "Jeder abgelehnte
// Zugriffsversuch wird mit Zeitpunkt, Benutzer und Ziel protokolliert."
// Dazu Rolle und Grund wie im Mockup.
//
// Recht "protokoll.abgelehnte_zugriffe": Owner und Admin (F2). Nur lesen,
// es gibt keinen Knopf zum Aendern oder Loeschen und keine Methode dafuer.
//
// Ziele sind Seiten und Server Actions der App. Das Mockup zeigt Pfade der
// Datenbank-API: Zugriffe direkt auf die Datenbank lehnt erst die Datenbank
// selbst ab (F15, spaeter), und wo sie gespeichert werden, ist offen (F16).

export const metadata = { title: "Abgelehnte Zugriffe" };

export default async function AbgelehnteZugriffe() {
  const zugang = await zugriff("protokoll.abgelehnte_zugriffe", "/verwaltung/zugriffe");
  if (!zugang.erlaubt) return <KeinZugriff meldung={zugang.meldung} />;

  const eintraege = await speicher.abgelehnteZugriffe();

  return (
    <main className="py-8">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Abgelehnte Zugriffe</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {eintraege.length === 1 ? "1 Eintrag" : `${eintraege.length} Einträge`}, neueste zuerst
        </p>
      </div>

      {eintraege.length === 0 ? (
        <div className="mt-6 rounded border border-neutral-300 p-6 text-sm dark:border-neutral-700">
          <p className="font-medium">Noch kein Zugriff abgelehnt.</p>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Wählen Sie oben „ohne Anmeldung“ oder einen Kunden und rufen Sie die Verwaltung auf.
            Der Versuch erscheint dann hier.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">Abgelehnte Zugriffe, neueste zuerst</caption>
            <thead>
              <tr className="border-b border-neutral-300 text-left dark:border-neutral-700">
                <th scope="col" className="py-2 pr-4 font-medium">Zeitpunkt</th>
                <th scope="col" className="py-2 pr-4 font-medium">Benutzer</th>
                <th scope="col" className="py-2 pr-4 font-medium">Rolle</th>
                <th scope="col" className="py-2 pr-4 font-medium">Ziel</th>
                <th scope="col" className="py-2 font-medium">Grund</th>
              </tr>
            </thead>
            <tbody>
              {eintraege.map((e, i) => (
                <tr
                  key={`${e.zeitpunkt}-${i}`}
                  className="border-b border-neutral-200 dark:border-neutral-800"
                >
                  <td className="py-2 pr-4 whitespace-nowrap tabular-nums">
                    {zeitpunktDeutsch(e.zeitpunkt)}
                  </td>
                  <td className="py-2 pr-4 font-mono">
                    {e.benutzer || <span className="text-neutral-600 dark:text-neutral-400">nicht angemeldet</span>}
                  </td>
                  <td className="py-2 pr-4">
                    {e.rolle || (
                      <span className="text-neutral-500">
                        <span aria-hidden="true">—</span>
                        <span className="sr-only">keine</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-4 font-mono">{e.ziel}</td>
                  <td className="py-2">{e.grund}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-xs text-neutral-600 dark:text-neutral-400">
        Die Einträge liegen im Arbeitsspeicher des Servers und sind nach einem Neustart leer (ADR
        0011). Wo sie in der Datenbank stehen sollen, ist noch offen (F16).
      </p>
    </main>
  );
}
