import Link from "next/link";

// Was eine Seite zeigt, wenn die Rechtepruefung ablehnt (#8 Teil 1).
//
// Eine eigene Komponente statt forbidden() aus next/navigation: forbidden()
// braucht in Next.js 16 die experimentelle Einstellung "authInterrupts"
// (node_modules/next/dist/docs, forbidden.md). Experimentelles schalten wir
// fuer eine Meldung nicht ein. Deshalb antwortet die Seite mit Status 200 und
// diesem Inhalt; der Schutz liegt darin, dass sie keine Daten liest.
//
// Die Meldung nennt den Grund und kommt aus lib/rechte.ts. Der Versuch ist
// dort schon festgehalten, bevor diese Seite erscheint.

export function KeinZugriff({ meldung }: { meldung: string }) {
  return (
    <main className="py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Kein Zugriff</h1>
      <p
        role="alert"
        className="mt-4 max-w-prose rounded border-l-4 border-red-700 bg-red-50 p-3 text-sm text-red-900 dark:border-red-400 dark:bg-red-950 dark:text-red-100"
      >
        {meldung}
      </p>
      <p className="mt-3 max-w-prose text-sm text-neutral-600 dark:text-neutral-400">
        Der Versuch ist mit Zeitpunkt, Benutzer und Ziel protokolliert. Zum Ausprobieren
        oben einen Benutzer mit einer anderen Rolle wählen.
      </p>
      <Link href="/" className="mt-4 inline-block text-sm underline underline-offset-2">
        Zur Suche
      </Link>
    </main>
  );
}
