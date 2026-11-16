import Link from "next/link";
import { KeinZugriff } from "@/components/KeinZugriff";
import { Maschinenformular } from "@/components/Maschinenformular";
import { imProtokoll } from "@/lib/benutzer";
import { zugriff } from "../../../sitzung";
import { maschineAnlegenAbsenden } from "../aktionen";
import { formulardaten } from "../formulardaten";

// Maschine anlegen (#2, Mockup 07 und 08). Recht "maschine.anlegen" (#8);
// die Action prueft beim Absenden noch einmal selbst.

export const metadata = { title: "Maschine anlegen" };

export default async function MaschineAnlegen() {
  const zugang = await zugriff("maschine.anlegen", "/verwaltung/maschinen/neu");
  if (!zugang.erlaubt) return <KeinZugriff meldung={zugang.meldung} />;

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
        protokolliertAls={imProtokoll(zugang.benutzer)}
        vorgabe={{
          inventarnummer: "",
          typnummer: "",
          seriennummer: "",
          baujahr: "",
          betriebsstunden: "0",
          wartungsintervall: "",
          standort: "",
        }}
      />
    </main>
  );
}
