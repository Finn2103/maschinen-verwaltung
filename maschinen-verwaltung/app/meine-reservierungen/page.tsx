import Link from "next/link";
import { Reservierungsuebersicht } from "@/components/Reservierungsuebersicht";

// "Meine Reservierungen" (#1, Mockup 05, Rolle Kunde).
//
// Woran die Seite den Kunden erkennt, hat Finn am 12.11. entschieden: E-Mail-
// Adresse und Vorgangsnummer zusammen (Begruendung in lib/uebersicht.ts). Mit
// der Anmeldung aus #43 faellt das Formular weg, dann kommt der Kunde aus der
// Sitzung.
//
// ?vorgang=R-0001 belegt die Vorgangsnummer vor, wenn man aus der
// Bestaetigung kommt. Die Nummer allein zeigt nichts, die E-Mail-Adresse steht
// nie in der Adresse.

export const metadata = { title: "Meine Reservierungen" };

type Props = { searchParams: Promise<{ vorgang?: string }> };

export default async function MeineReservierungen({ searchParams }: Props) {
  const { vorgang } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm underline underline-offset-2">
        Zurück zur Suche
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Meine Reservierungen</h1>
      <p className="mt-2 max-w-prose text-sm text-neutral-600 dark:text-neutral-400">
        Geben Sie die E-Mail-Adresse und eine Vorgangsnummer aus Ihrer Bestätigung ein. Sie
        sehen dann alle Reservierungen zu dieser E-Mail-Adresse.
      </p>

      <Reservierungsuebersicht vorgang={vorgang} />

      <p className="mt-10 text-xs text-neutral-600 dark:text-neutral-400">
        Die Reservierungen liegen im Arbeitsspeicher des Servers und sind nach einem Neustart weg
        (ADR 0011). Eine Bestätigung per E-Mail wird noch nicht verschickt (#92).
      </p>
    </main>
  );
}
