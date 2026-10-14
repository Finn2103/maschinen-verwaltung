// Die eine Stelle, die die Umsetzung auswaehlt (ADR 0011).
// Nach #45 wird hier auf die PostgreSQL-Umsetzung umgestellt. Nur diese Zeile.

import type { ReservierungSpeicher } from "../reservierung";
import { arbeitsspeicher } from "./arbeitsspeicher";

export const speicher: ReservierungSpeicher = arbeitsspeicher;
