import Link from "next/link";
import { benutzerDerAnfrage } from "@/app/sitzung";
import { speicher } from "@/lib/speicher";
import { ProbeWechsel } from "./ProbeWechsel";

// Kopfleiste der Probe-Anmeldung (#8 Teil 1, Antwort 60), auf jeder Seite.
//
// Server-Komponente: die Liste der Benutzer kommt nie als Fachobjekt in den
// Browser, nur als Text in den <option>-Elementen. Auswahl und Knopf stecken
// in components/ProbeWechsel.tsx, dort steht, warum das eine Client-Komponente
// ist (#124). Ohne JavaScript geht der Wechsel weiter.
//
// "Angemeldet als" steht als Text fuer sich, getrennt von der Auswahl (#124):
// er zeigt, mit wem der Server gerade prueft. Eine Auswahl ohne "Wechseln"
// steht so nie als "Angemeldet als" da.
//
// Gelb und mit "Probe bis #43" beschriftet, damit niemand sie fuer die echte
// Anmeldung haelt: es gibt kein Passwort, jeder kann jede Rolle waehlen.

export async function ProbeAnmeldung() {
  const [aktuell, alle] = await Promise.all([benutzerDerAnfrage(), speicher.alleBenutzer()]);
  const auswahl = alle.filter((b) => b.aktiv).map((b) => b.alsAnzeige());

  return (
    <div className="border-b border-amber-300 bg-amber-50 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-50">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
        <span className="rounded border border-amber-800 px-1.5 text-xs font-semibold tracking-wide uppercase dark:border-amber-300">
          Probe bis #43
        </span>
        <p>
          Angemeldet als{" "}
          <strong>{aktuell ? `${aktuell.name} · ${aktuell.rollenname}` : "ohne Anmeldung"}</strong>
        </p>
        <ProbeWechsel aktuell={aktuell?.benutzerId ?? ""}>
          <option value="">ohne Anmeldung</option>
          {auswahl.map((b) => (
            <option key={b.benutzerId} value={b.benutzerId}>
              {b.name} · {b.rollenname}
            </option>
          ))}
        </ProbeWechsel>
        <nav aria-label="Bereiche" className="flex gap-4 sm:ml-auto">
          <Link href="/" className="underline underline-offset-2">
            Suche
          </Link>
          <Link href="/verwaltung" className="underline underline-offset-2">
            Verwaltung
          </Link>
        </nav>
      </div>
    </div>
  );
}
