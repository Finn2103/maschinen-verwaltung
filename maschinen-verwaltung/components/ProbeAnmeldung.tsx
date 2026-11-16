import Link from "next/link";
import { probeAnmelden } from "@/app/probe-anmeldung";
import { benutzerDerAnfrage } from "@/app/sitzung";
import { speicher } from "@/lib/speicher";

// Kopfleiste der Probe-Anmeldung (#8 Teil 1, Antwort 60), auf jeder Seite.
//
// Server-Komponente mit einem gewoehnlichen Formular: Auswahl und Knopf
// "Wechseln" gehen auch ohne JavaScript, und die Liste der Benutzer kommt nie
// als Fachobjekt in den Browser, nur als Text in den <option>-Elementen.
//
// Gelb und mit "Probe bis #43" beschriftet, damit niemand sie fuer die echte
// Anmeldung haelt: es gibt kein Passwort, jeder kann jede Rolle waehlen.

export async function ProbeAnmeldung() {
  const [aktuell, alle] = await Promise.all([benutzerDerAnfrage(), speicher.alleBenutzer()]);
  const auswahl = alle.filter((b) => b.aktiv).map((b) => b.alsAnzeige());

  return (
    <div className="border-b border-amber-300 bg-amber-50 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-50">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
        <form action={probeAnmelden} className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="rounded border border-amber-800 px-1.5 text-xs font-semibold tracking-wide uppercase dark:border-amber-300">
            Probe bis #43
          </span>
          <label htmlFor="probe-benutzer">Angemeldet als</label>
          <select
            // Neu aufbauen, wenn sich der Benutzer geaendert hat, damit die
            // Auswahl den aktuellen Stand zeigt.
            key={aktuell?.benutzerId ?? "ohne"}
            id="probe-benutzer"
            name="benutzer"
            defaultValue={aktuell?.benutzerId ?? ""}
            aria-describedby="probe-hinweis"
            className="rounded border border-amber-800 bg-white px-2 py-1 text-neutral-900 dark:border-amber-300 dark:bg-neutral-900 dark:text-neutral-100"
          >
            <option value="">ohne Anmeldung</option>
            {auswahl.map((b) => (
              <option key={b.benutzerId} value={b.benutzerId}>
                {b.name} · {b.rollenname}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded border border-amber-800 bg-white px-3 py-1 font-medium text-neutral-900 dark:border-amber-300 dark:bg-neutral-900 dark:text-neutral-100"
          >
            Wechseln
          </button>
          <span id="probe-hinweis" className="sr-only">
            Probe-Anmeldung ohne Passwort, bis es die Anmeldung aus #43 gibt. Was die
            gewählte Rolle darf, prüft der Server.
          </span>
        </form>
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
