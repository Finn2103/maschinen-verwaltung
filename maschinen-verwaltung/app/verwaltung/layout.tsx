import Link from "next/link";
import { kann } from "../sitzung";

// Rahmen fuer den Verwaltungsbereich (Personal, Mockups 06 bis 13).
//
// KEINE RECHTEPRUEFUNG HIER: ein Layout laeuft beim Wechsel zwischen Seiten
// nicht neu (Next.js-Doku, Guides, Authentication). Jede Seite darunter
// prueft deshalb selbst (#8 Teil 1). Das Layout fragt nur nach, ob es den
// Link "Abgelehnte Zugriffe" zeigt; das haelt nichts fest.
//
// Die Navigation zeigt nur, was es gibt. Kunden, Reservierungen und
// Rechnungen aus dem Mockup haben noch keine Seite und stehen deshalb nicht
// da: ein Link ins Leere waere schlechter als keiner.

export default async function VerwaltungLayout({ children }: LayoutProps<"/verwaltung">) {
  const zugriffeSehen = await kann("protokoll.abgelehnte_zugriffe");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <header className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-neutral-300 pb-3 dark:border-neutral-700">
        <p className="font-semibold">Maschinenverleih · Verwaltung</p>
        <nav aria-label="Verwaltung">
          <ul className="flex gap-4 text-sm">
            <li>
              <Link href="/verwaltung/maschinen" className="underline underline-offset-2">
                Maschinen
              </Link>
            </li>
            {zugriffeSehen && (
              <li>
                <Link href="/verwaltung/zugriffe" className="underline underline-offset-2">
                  Abgelehnte Zugriffe
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
      {children}
    </div>
  );
}
