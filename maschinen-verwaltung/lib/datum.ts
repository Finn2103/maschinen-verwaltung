// Datumsformat fuer die Anzeige.
//
// Im Code steht ISO-8601 (JJJJ-MM-TT), weil es als Text genauso sortiert wie
// chronologisch. In der Oberflaeche steht das deutsche Format, weil die
// Anwendung auf Deutsch bedient wird. Entschieden am 13.10.2026.
//
// Bewusst OHNE Date und ohne Intl: beides braucht eine Zeitzone, und bei reinen
// Kalendertagen verschiebt sich dann ein Datum ueber Mitternacht. Hier wird nur
// eine Zeichenkette umgestellt. Ausnahme ist zeitpunktDeutsch() unten, fuer
// Zeitpunkte mit Uhrzeit (#2), Begruendung dort.
//
// Die Datumsfelder im Formular sind type="date". Deren Anzeige bestimmt der
// Browser nach der Spracheinstellung des Nutzers, nicht dieser Code.

/** "2026-09-24" wird zu "24.09.2026". Unerwartete Eingaben bleiben unveraendert. */
export function deutsch(iso: string): string {
    const teile = iso.split("-");
    if (teile.length !== 3) return iso;

    const [jahr, monat, tag] = teile;
    if (jahr.length !== 4 || monat.length !== 2 || tag.length !== 2) return iso;

    return `${tag}.${monat}.${jahr}`;
}

/** "24.09.2026 bis 28.09.2026". Bei einem einzigen Tag nur dieser Tag. */
export function zeitraumDeutsch(von: string, bis: string): string {
    return von === bis ? deutsch(von) : `${deutsch(von)} bis ${deutsch(bis)}`;
}

/**
 * Ein Zeitpunkt mit Uhrzeit fuer die Anzeige, z. B. im Aenderungsprotokoll:
 * "2026-11-12T09:42:00.000Z" wird "12.11.2026, 10:42".
 *
 * Hier ist Intl richtig und oben nicht: ein Kalendertag hat keine Zeitzone,
 * ein Zeitpunkt schon. Gespeichert wird in UTC, angezeigt in deutscher Zeit,
 * fest eingestellt statt der Zeitzone des Servers. Sonst zeigt ein Server in
 * einer anderen Zeitzone andere Uhrzeiten.
 */
export function zeitpunktDeutsch(iso: string): string {
    const zeit = new Date(iso);
    if (Number.isNaN(zeit.getTime())) return iso;
    return new Intl.DateTimeFormat("de-DE", {
        timeZone: "Europe/Berlin",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(zeit);
}
