import Link from "next/link";

// Rahmen fuer den Verwaltungsbereich (Rolle Mitarbeiter, Mockups 06 bis 09).
//
// Noch ohne Anmeldung und ohne Rechtepruefung: wer die Adresse kennt, kommt
// hinein. Das kommt mit #8 und #43 und steht deshalb sichtbar im Kopf, damit
// es im Review niemand fuer fertig haelt.
//
// Die Navigation hat bisher einen Eintrag. Kunden, Reservierungen und
// Rechnungen aus dem Mockup haben noch keine Seite und stehen deshalb nicht
// da: ein Link ins Leere waere schlechter als keiner.

export default function VerwaltungLayout({ children }: LayoutProps<"/verwaltung">) {
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
          </ul>
        </nav>
        <p className="text-xs text-neutral-600 sm:ml-auto dark:text-neutral-400">
          Ohne Anmeldung, Rechte kommen mit #8
        </p>
      </header>
      {children}
    </div>
  );
}
