"use client";

// Fehlerzustand (Definition of Done, Punkt 8), ohne Fachjargon.
export default function Fehler({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-xl font-semibold">Ihre Reservierungen konnten nicht geladen werden</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Bitte versuchen Sie es erneut. Bleibt der Fehler, wenden Sie sich an den Verleih.
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
      >
        Erneut versuchen
      </button>
    </main>
  );
}
