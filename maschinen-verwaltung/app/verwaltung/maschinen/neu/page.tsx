import Link from "next/link";
import { Maschinenformular } from "@/components/Maschinenformular";
import { maschineAnlegenAbsenden } from "../aktionen";
import { formulardaten } from "../formulardaten";

// Maschine anlegen (#2, Mockup 07 und 08).

export const metadata = { title: "Maschine anlegen" };

export default async function MaschineAnlegen() {
  const { typen, standorte } = await formulardaten();

  return (
    <main className="py-8">
      <Link href="/verwaltung/maschinen" className="text-sm underline underline-offset-2">
        Zurück zur Liste
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Maschine anlegen</h1>

      <Maschinenformular
        modus="anlegen"
        aktion={maschineAnlegenAbsenden}
        typen={typen}
        standorte={standorte}
        vorgabe={{
          inventarnummer: "",
          typnummer: "",
          seriennummer: "",
          baujahr: "",
          betriebsstunden: "0",
          wartungsintervall: "",
          standort: "",
          benutzer: "",
        }}
      />
    </main>
  );
}
