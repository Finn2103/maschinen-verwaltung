import { redirect } from "next/navigation";

// Die Verwaltung hat bisher nur die Maschinen. Wer /verwaltung aufruft,
// landet dort statt auf einer leeren Seite.
export default function Verwaltung() {
  redirect("/verwaltung/maschinen");
}
