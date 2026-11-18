In diesem Dokument schreibe ich auf, welche Möglichkeiten es gibt, beim Anlegen auf eine mögliche Dublette hinzuweisen, und was ich dem Entwickler empfehle.

Aufgabe: Beim Anlegen wird auf mögliche Dubletten hingewiesen (gleicher Name, gleiche Adresse).

## Möglichkeiten

**Harter Stopp oder Hinweis.** Man kann das Speichern verbieten, oder nur den schon vorhandenen Kunden zeigen und trotzdem speichern lassen. Empfehlung: Hinweis. Sonst kommt man aus einem Fehlalarm nicht mehr raus. Der vorhandene Kunde soll sichtbar sein, bevor aus Versehen ein zweiter entsteht.

**Wonach verglichen wird.** Möglichkeiten: nur der Name, nur die Adresse, oder beides zusammen. Nur der Name trifft Vater und Sohn und zwei Müller Bau an verschiedenen Orten. Nur die Adresse trifft ein Bürohaus. Empfehlung: Name und Rechnungsadresse zusammen. Eines von beiden reicht nicht.

**Wie gleich „gleich“ ist.** Möglichkeiten: Zeichen für Zeichen, eine kleine Normalisierung, oder eine Ähnlichkeitssuche (Bibliothek, „Str.“ gleich „Straße“, Tippfehler). Empfehlung: die kleine Normalisierung, keine Bibliothek. Sobald man rät, wird die Regel unscharf.

Die Normalisierung, die ich empfehle:

- vorne und hinten Leerzeichen weg
- mehrere Leerzeichen zu einem
- Groß und Klein egal
- Punkte weg
- in der Postleitzahl alle Leerzeichen weg

Aus `Nico  Laeser` und `Musterstraße 12a.` wird damit `nico laeser` und `musterstraße 12a`. Dieselbe Form muss der schon gespeicherte Kunde ergeben, zusammen mit Postleitzahl, Ort und Ländercode.

**Welcher Name.** Bei PRIVAT Vorname plus Nachname. Bei BUSINESS der Unternehmensname. Den Ansprechpartner nicht mit vergleichen, sonst warnt es ständig, nur weil der Geschäftsführer so heißt wie ein Privatkunde. Privat und Firma nicht miteinander vergleichen. Ein Nico Laeser und eine Laeser GmbH an derselben Adresse sind zwei Kunden.

**Welche Adresse.** Straße, Postleitzahl, Ort und Land der Rechnungsadresse. Den Adresszusatz weglassen, sonst verpasst man die Dublette, sobald einer „3. Stock“ einträgt und der andere das Feld leer lässt. Die Lieferadresse weglassen, die Baustelle teilen sich viele.

**Gelöschte Kunden.** Möglichkeit: nur ACTIVE durchsuchen, oder auch DELETED. Empfehlung: DELETED mit anzeigen. Die Nummer wird nicht wieder frei, oft will man den alten Satz wieder aufmachen.

## Beispiele zur Empfehlung

Vorhanden ist K017, Nico Laeser, Musterstraße 12a, 51766 Engelskirchen, DE, Status ACTIVE.

Einen Hinweis gibt es bei:

- `nico laeser`, `Musterstraße 12a`, `51766`, `Engelskirchen`. Nur anders geschrieben.
- `Nico  Laeser`, `musterstraße 12a.`, `51 766`, `engelskirchen`. Leerzeichen, Punkt, Postleitzahl mit Lücke.
- K004, Schmidt Bau GmbH, Industriestraße 4, 50667 Köln, Status DELETED. Jemand legt dieselbe Firma an derselben Adresse noch einmal an. Im Hinweis steht DELETED, damit man K004 wieder nimmt.

Es können mehrere Treffer zurückkommen. Anzeigen: Kundennummer, Name, Ort, Status. Darüber kann man den vorhandenen Kunden aufmachen.

Keinen Hinweis gibt es bei:

- Nico Laeser, Musterstraße 12, 51766 Engelskirchen. Andere Hausnummer.
- Nico Laeser, Musterstraße 12a, 04109 Leipzig. Anderer Ort.
- Anna Laeser, Musterstraße 12a, 51766 Engelskirchen. Gleicher Ort, anderer Name. Kann Familie sein.
- Laeser GmbH, dieselbe Adresse, Ansprechpartner Nico Laeser. Verglichen wird `Laeser GmbH`, nicht der Ansprechpartner.
- Müller Bau GmbH gegen Müller Bau. Das `GmbH` nicht abschneiden.
- Musterstr. 12a gegen Musterstraße 12a. Sieht gleich aus, ist es bei dieser Regel nicht.
- Musterstraße 12a gegen Musterstraße 12 a. Das Leerzeichen in der Hausnummer nicht zusammenziehen.
- Mueller gegen Müller. Aus ue kein ü machen.
- Gleiche Telefonnummer, aber Name oder Adresse anders.
- Gleiche Lieferadresse, andere Rechnungsadresse.

## Unique auf USt-Id und Mail

Möglichkeiten: auch das nur als Hinweis, oder als Unique in der Datenbank, dann lehnt der Server das Speichern ab.

Empfehlung: Name und Adresse bleiben der Hinweis. USt-Id und Mail zusätzlich als Unique. Dieselbe Nummer oder dieselbe Mail bei einem zweiten Kunden ist kein Hinweis mehr.

Die USt-Id nur eindeutig, wenn sie gesetzt ist. Leer darf bei vielen Kunden leer bleiben. Verglichen wird der gespeicherte Wert, ohne etwas wegzuschneiden. `DE 123456789` und `de123456789` sind ungültig und damit nicht dieselbe Nummer wie `DE123456789`.

Die Mail eindeutig pro Kunde, nicht pro Zeile. Groß und Klein egal, Leerzeichen vorne und hinten weg. `markus@example.com` und `Markus@example.com` sind gleich. Am selben Kunden darf dieselbe Adresse für einen zweiten Typ noch einmal stehen, CONTACT und INVOICE beide `buchhaltung@example.com`. Ein anderer Kunde darf sie nicht haben.

Beispiel: K017 hat `markus@example.com`. Ein neuer Kunde mit demselben Postfach wird abgelehnt, auch wenn Name und Adresse anders sind. K020 hat `DE123456789`. Dieselbe USt-Id bei einem zweiten BUSINESS-Kunden wird abgelehnt.

Gelöschte Kunden im Unique drin lassen. Die Nummer wird nicht frei, also auch nicht die USt-Id und nicht die Mail. Legt man wegen GoBD einen neuen Account an, weil aus PRIVAT ein BUSINESS wird, bleibt die Mail am alten Account belegt. Der neue braucht eine eigene, oder sie wird am alten entfernt.

Telefon und Steuernummer nicht unique. Die Telefonnummer teilen sich Leute. Die Steuernummer ist ein anderes Feld als die USt-Id.

## Empfehlung an den Entwickler

Die Hinweis-Prüfung auf dem Server, beim Speichern des Anlegens. Das Formular darf den Hinweis früher zeigen. Maßgeblich ist der Server. Keine Bibliothek für Ähnlichkeit.

Kommt ein Treffer, zeigt das Formular den vorhandenen Kunden. Anlegen bleibt möglich. Ein zweites Mal fragen, nachdem man sich entschieden hat, muss nicht sein.

Der Hinweis auf Name und Adresse gilt beim Anlegen. Das Unique auf USt-Id und Mail gilt auch beim Bearbeiten, sonst setzt jemand die Mail auf ein Postfach, das schon einem anderen Kunden gehört.
