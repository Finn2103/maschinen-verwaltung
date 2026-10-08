import { kategorien, standorte } from "@/lib/maschinen";
import type { Suchfilter } from "@/lib/verfuegbarkeit";
import Link from "next/link";
import { suchlinkOhne } from "@/lib/suchlink";

type Props = { werte: Suchfilter; fehler: string | null };

export function Suchformular({ werte, fehler }: Props) {
    const zeitraumGesetzt = Boolean(werte.von || werte.bis);
    const filterGesetzt = Boolean(werte.kategorie || werte.standort);

    // defaultValue greift nur beim ersten Einhaengen. Aendert sich die Suche,
    // muss React das Formular neu aufbauen, sonst behalten die Felder ihren
    // alten Wert. Der Schluessel erzwingt das.
    const schluessel = [werte.von, werte.bis, werte.kategorie, werte.standort].join("|");

    return (
        <form method="get" key={schluessel} className="mt-6 space-y-4">
            <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Zeitraum</legend>

                <div className="flex flex-wrap gap-4">
                    <div>
                        <label htmlFor="von" className="block text-sm">Von</label>
                        <input
                            type="date"
                            id="von"
                            name="von"
                            defaultValue={werte.von ?? ""}
                            aria-invalid={fehler ? true : undefined}
                            aria-describedby={fehler ? "zeitraum-fehler" : undefined}
                            className="mt-1 rounded border border-neutral-300 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-900"
                        />
                    </div>

                    <div>
                        <label htmlFor="bis" className="block text-sm">Bis</label>
                        <input
                            type="date"
                            id="bis"
                            name="bis"
                            defaultValue={werte.bis ?? ""}
                            aria-invalid={fehler ? true : undefined}
                            aria-describedby={fehler ? "zeitraum-fehler" : undefined}
                            className="mt-1 rounded border border-neutral-300 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-900"
                        />
                    </div>
                </div>

                {fehler && (
                    <p id="zeitraum-fehler" className="text-sm text-red-700 dark:text-red-400">
                        {fehler}
                    </p>
                )}
            </fieldset>

            <div className="flex flex-wrap gap-4">
                <div>
                    <label htmlFor="kategorie" className="block text-sm">Kategorie</label>
                    <select
                        id="kategorie"
                        name="kategorie"
                        defaultValue={werte.kategorie ?? ""}
                        className="mt-1 rounded border border-neutral-300 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-900"
                    >
                        <option value="">alle</option>
                        {kategorien.map((k) => (
                            <option key={k} value={k}>{k}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="standort" className="block text-sm">Standort</label>
                    <select
                        id="standort"
                        name="standort"
                        defaultValue={werte.standort ?? ""}
                        className="mt-1 rounded border border-neutral-300 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-900"
                    >
                        <option value="">alle</option>
                        {standorte.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <button
                    type="submit"
                    className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
                >
                    Suchen
                </button>

                {zeitraumGesetzt && (
                    <Link
                        href={suchlinkOhne(werte, "von", "bis")}
                        className="text-sm underline underline-offset-2 hover:no-underline"
                    >
                        Zeitraum leeren
                    </Link>
                )}

                {filterGesetzt && (
                    <Link
                        href={suchlinkOhne(werte, "kategorie", "standort")}
                        className="text-sm underline underline-offset-2 hover:no-underline"
                    >
                        Filter leeren
                    </Link>
                )}

                {(zeitraumGesetzt || filterGesetzt) && (
                    <Link
                        href="/"
                        className="text-sm underline underline-offset-2 hover:no-underline"
                    >
                        Alles zurücksetzen
                    </Link>
                )}
            </div>
        </form>
    );
}