// Tests der Fachregeln mit Vitest (entschieden von Finn am 12.11.2026).
//
// Warum Vitest: es versteht TypeScript ohne eigenen Uebersetzungsschritt und
// laeuft in Node, ohne Browser. Die Fachlogik in lib/ ist reines TypeScript
// ohne React und ohne Next.js, deshalb reicht das.
//
// Getestet wird nur lib/: dort stehen die Regeln, die ein Akzeptanzkriterium
// tragen (Ueberlappung, Suche, Reservierungskonflikt, Pruefregeln, Uebersicht).
// Die Oberflaeche pruefen wir weiter von Hand gegen die Checkliste aus ADR 0009.
//
// Aufruf: npm test

import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["lib/**/*.test.ts"],
        environment: "node",
    },
});
