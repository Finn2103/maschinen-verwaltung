In diesem Dokument schreibe ich auf, welche Möglichkeiten es gibt, beim Anlegen auf eine mögliche Dublette hinzuweisen, und was ich dem Entwickler empfehle.

Aufgabe: Beim Anlegen wird auf mögliche Dubletten hingewiesen (gleicher Name, gleiche Adresse).

## Wer den Hinweis sieht

Nur das Personal, also wer `kunde.suchen` hat. Das sind Mitarbeiter, Manager, Owner und Admin (`docs/rollen-und-rechte.md`). Der Hinweis zeigt andere Kunden mit Kundennummer, Name, Ort und Status. Das ist dasselbe wie eine Suche.

Ein Kunde, der sich selbst anlegt (F14), bekommt keinen Hinweis. Er darf nur seine eigenen Daten sehen und keine Kunden suchen. Seine Anlage wird ohne Hinweis gespeichert.

Offen: Soll das Personal davon erfahren, wenn es bei einer Selbstanlage einen Treffer gibt? Zum Beispiel über den Status `pruefen`.

## Möglichkeiten

**Harter Stopp oder Hinweis.** Man kann das Speichern verbieten, oder nur den schon vorhandenen Kunden zeigen und trotzdem speichern lassen. Empfehlung: Hinweis. Sonst kommt man aus einem Fehlalarm nicht mehr raus. Der vorhandene Kunde soll sichtbar sein, bevor aus Versehen ein zweiter entsteht.

**Wonach verglichen wird.** Möglichkeiten: nur der Name, nur die Adresse, oder beides zusammen. Nur der Name trifft Vater und Sohn und zwei Müller Bau an verschiedenen Orten. Nur die Adresse trifft ein Bürohaus. Empfehlung: Name und Rechnungsadresse zusammen. Eines von beiden reicht nicht.

Die Adresse ist am Kunden keine Pflicht (#1, siehe Pflichtfelder.md). Hat der neue Kunde keine Rechnungsadresse, gibt es nichts zu vergleichen und damit keinen Hinweis. Dasselbe gilt für einen vorhandenen Kunden ohne Adresse.

**Wie gleich „gleich“ ist.** Möglichkeiten: Zeichen für Zeichen, eine kleine Normalisierung, oder eine Ähnlichkeitssuche (Bibliothek, „Str.“ gleich „Straße“, Tippfehler). Empfehlung: die kleine Normalisierung, keine Bibliothek. Sobald man rät, wird die Regel unscharf.

Die Normalisierung, die ich empfehle:

- vorne und hinten Leerzeichen weg
- mehrere Leerzeichen zu einem
- Groß und Klein egal
- Punkte weg
- in der Postleitzahl alle Leerzeichen weg

Aus `Max  Mustermann` und `Musterstraße 12a.` wird damit `max mustermann` und `musterstraße 12a`. Dieselbe Form muss der schon gespeicherte Kunde ergeben, zusammen mit Postleitzahl, Ort und Land.

**Welcher Name.** Bei `privat` Vorname plus Nachname. Bei `unternehmen` der Unternehmensname. Den Ansprechpartner nicht mit vergleichen, sonst warnt es ständig, nur weil der Geschäftsführer so heißt wie ein Privatkunde. Privat und Unternehmen nicht miteinander vergleichen. Ein Max Mustermann und eine Mustermann GmbH an derselben Adresse sind zwei Kunden.

**Welche Adresse.** Straße, Postleitzahl, Ort und Land der Rechnungsadresse. Den Adresszusatz weglassen, sonst verpasst man die Dublette, sobald einer „3. Stock“ einträgt und der andere das Feld leer lässt. Die Lieferadresse weglassen, die Baustelle teilen sich viele.

**Gelöschte Kunden.** Möglichkeit: nur `aktiv` durchsuchen, oder auch `geloescht`. Empfehlung: `geloescht` mit anzeigen. Die Nummer wird nicht wieder frei, oft will man den alten Satz wieder aufmachen.

## Beispiele zur Empfehlung

Vorhanden ist K017, Max Mustermann, Musterstraße 12a, 01067 Dresden, DE, Status `aktiv`.

Das Personal bekommt einen Hinweis bei:

- `max mustermann`, `Musterstraße 12a`, `01067`, `Dresden`. Nur anders geschrieben.
- `Max  Mustermann`, `musterstraße 12a.`, `01 067`, `dresden`. Leerzeichen, Punkt, Postleitzahl mit Lücke.
- K004, Schmidt Bau GmbH, Industriestraße 4, 50667 Köln, Status `geloescht`. Jemand legt dieselbe Firma an derselben Adresse noch einmal an. Im Hinweis steht `geloescht`, damit man K004 wieder nimmt.

Es können mehrere Treffer zurückkommen. Anzeigen: Kundennummer, Name, Ort, Status. Darüber kann man den vorhandenen Kunden aufmachen.

Keinen Hinweis gibt es bei:

- Max Mustermann, Musterstraße 12, 01067 Dresden. Andere Hausnummer.
- Max Mustermann, Musterstraße 12a, 04109 Leipzig. Anderer Ort.
- Erika Mustermann, Musterstraße 12a, 01067 Dresden. Gleiche Adresse, anderer Name. Kann Familie sein.
- Mustermann GmbH, dieselbe Adresse, Ansprechpartner Max Mustermann. Verglichen wird `Mustermann GmbH`, nicht der Ansprechpartner.
- Müller Bau GmbH gegen Müller Bau. Das `GmbH` nicht abschneiden.
- Musterstr. 12a gegen Musterstraße 12a. Sieht gleich aus, ist es bei dieser Regel nicht.
- Musterstraße 12a gegen Musterstraße 12 a. Das Leerzeichen in der Hausnummer nicht zusammenziehen.
- Mueller gegen Müller. Aus ue kein ü machen.
- Gleiche Telefonnummer, aber Name oder Adresse anders.
- Gleiche Lieferadresse, andere Rechnungsadresse.
- Max Mustermann ohne Adresse. Ohne Adresse kein Vergleich.
- Max Mustermann legt sich selbst an, mit genau derselben Adresse wie K017. Ein Kunde sieht keinen Hinweis.

## Unique auf USt-Id und Mail

Möglichkeiten: auch das nur als Hinweis, oder als Unique in der Datenbank, dann lehnt der Server das Speichern ab.

Empfehlung: Name und Adresse bleiben der Hinweis. USt-Id und Mail zusätzlich als Unique. Dieselbe Nummer oder dieselbe Mail bei einem zweiten Kunden ist kein Hinweis mehr.

Die USt-Id nur eindeutig, wenn sie gesetzt ist. Leer darf bei vielen Kunden leer bleiben. Verglichen wird der gespeicherte Wert, ohne etwas wegzuschneiden. `DE 123456789` und `de123456789` sind ungültig und damit nicht dieselbe Nummer wie `DE123456789`.

Die Mail eindeutig pro Kunde, nicht pro Zeile. Groß und Klein egal, Leerzeichen vorne und hinten weg. `max.mustermann@example.com` und `Max.Mustermann@example.com` sind gleich. Am selben Kunden darf dieselbe Adresse für einen zweiten Typ noch einmal stehen, `kontakt` und `rechnung` beide `buchhaltung@example.com`. Ein anderer Kunde darf sie nicht haben.

Beispiel: K017 hat `max.mustermann@example.com`. Ein neuer Kunde mit demselben Postfach wird abgelehnt, auch wenn Name und Adresse anders sind. K020 hat `DE123456789`. Dieselbe USt-Id bei einem zweiten Kunden vom Typ `unternehmen` wird abgelehnt.

Legt ein Kunde sich selbst an, sagt die Ablehnung nur, dass die Mail oder die USt-Id schon vergeben ist. Welcher Kunde sie hat, sieht er nicht.

Offen: Auch das verrät dem Kunden, dass es die Mail oder die USt-Id bei uns schon gibt. Ist das so in Ordnung?

Gelöschte Kunden im Unique drin lassen. Die Nummer wird nicht frei, also auch nicht die USt-Id und nicht die Mail. Legt man einen neuen Account an, weil aus `privat` ein `unternehmen` wird, bleibt die Mail am alten Account belegt. Der neue braucht eine eigene.

Telefon und Steuernummer nicht unique. Die Telefonnummer teilen sich Leute. Die Steuernummer ist ein anderes Feld als die USt-Id.

## Empfehlung an den Entwickler

Die Hinweis-Prüfung auf dem Server, beim Speichern des Anlegens. Das Formular darf den Hinweis früher zeigen. Maßgeblich ist der Server. Keine Bibliothek für Ähnlichkeit.

Den Hinweis nur zurückgeben, wenn der angemeldete Benutzer `kunde.suchen` hat. Das prüft der Server gegen `rolle_recht` (#8), wie jedes andere Recht. Ein Kunde bekommt keine Treffer, auch nicht versteckt in der Antwort des Servers.

Kommt ein Treffer, zeigt das Formular dem Personal den vorhandenen Kunden. Anlegen bleibt möglich. Ein zweites Mal fragen, nachdem man sich entschieden hat, muss nicht sein.

Der Hinweis auf Name und Adresse gilt beim Anlegen. Das Unique auf USt-Id und Mail gilt auch beim Bearbeiten, sonst setzt jemand die Mail auf ein Postfach, das schon einem anderen Kunden gehört.
