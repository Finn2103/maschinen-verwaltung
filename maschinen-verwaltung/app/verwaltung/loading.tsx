// Ladezustand fuer den Verwaltungsbereich (Definition of Done, Punkt 8).
// Ohne diese Datei griffe app/loading.tsx mit "Maschinen werden gesucht",
// das passt hier nicht.
export default function Laedt() {
  return (
    <main className="py-8">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">Wird geladen …</p>
    </main>
  );
}
