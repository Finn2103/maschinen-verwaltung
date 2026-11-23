In diesem Dokument schreibe ich auf, was ich zu Rechnung, Steuersatz und USt-Id gefunden habe, und was ich dem Entwickler empfehle.

## Unterschied zwischen USt-Id und Steuernummer

### Steuernummer

Die Steuernummer vergibt in Deutschland das Finanzamt, das für das Unternehmen zuständig ist. Der Hauptzweck ist eine generelle Zuordnung, und diese Nummer bekommt man standardmäßig. Sie ist für nationale Rechnungen gültig.

Sie dient in keinem Fall als EU-USt-Identifikationsmittel. Das Format hängt vom Bundesland ab, zum Beispiel `12/345/67890` oder `123/456/78901`. Es gibt keinen Weltstandard, und manche Länder haben ganz andere Nummern und Wege.

### USt-Id

Die USt-Id wird vom BZSt vergeben. Für Deutschland ist der Standard `DE` und 9 Ziffern, also `DE123456789`. Als Kleinunternehmer bekommt man die oft nicht automatisch, sondern nur auf Antrag.

## Kleinunternehmer und Regelbesteuerung

Als Kleinunternehmer weist man keine Umsatzsteuer aus. Auf der Rechnung ist der Betrag netto gleich brutto, mit dem Hinweis auf § 19 UStG. Das ist für den Anfang einfacher und oft der Weg, wenn man sich nebenberuflich selbstständig macht.

~~Ab dem Umsatz von 25.000 € muss man auf die Regelbesteuerung wechseln.~~ Seit 2025 gilt die Kleinunternehmerregelung, wenn der Gesamtumsatz im Vorjahr 25.000 € nicht übersteigt und im laufenden Jahr 100.000 € nicht überschreitet (§ 19 UStG).

~~Bei der Soll-Versteuerung schätzt das Finanzamt, und man muss vorauszahlen.~~ Soll heißt: die Steuer entsteht für den Zeitraum, in dem ausgeliehen oder geliefert wurde, egal wann der Kunde zahlt. Ist heißt: sie entsteht für den Zeitraum, in dem das Geld kommt (§ 13 UStG). Ist muss man beim Finanzamt beantragen (§ 20 UStG). Für den Prozentsatz auf der Rechnung ist das egal.

Bei der Regelbesteuerung ist der normale Satz 19 %. Endkunden nennen das oft MwSt. Welcher Satz wirklich auf eine Rechnung kommt, hängt vom Kunden ab, siehe die Tabellen unten.

Ich gehe für dieses Projekt von einem Unternehmen aus, das regelbesteuert ist und nicht unter die Kleinunternehmerregelung fällt. Das ist meine Annahme, im Team ist es nicht festgelegt.

## Was wir abrechnen

Eine Rechnungsposition berechnet eine Ausleihe oder eine Bestellung (`docs/datenmodell/relational.md`, 4.4). Eine Wartung wird nicht berechnet. Die Tabelle zur Wartung war mein erster Schritt. Für unsere Rechnungen gelten die Tabellen zur Ausleihe und zur Bestellung.

Rechnung und Zahlung haben noch keine User Story (`docs/rollen-und-rechte.md`, Offene Punkte). Wie die Steuer auf die Rechnung kommt, gehört zur Abrechnung und ist offen. Für #7 heißt das nur: Kundentyp, Land der Rechnungsadresse, USt-Id und Land der Lieferadresse müssen sich erfassen lassen. Davon hängt die Steuer ab.

## Steuersätze für die Wartung in Deutschland

~~EU-Privatkunde: Satz des Landes (bei NL zum Beispiel 21 %).~~

~~EU-Geschäftskunde ohne USt-Id oder mit ungültiger USt-Id: Satz des Landes.~~

~~Privatkunde außerhalb der EU: 0 %.~~

| Kunde | Steuer |
| --- | --- |
| Deutschland, privat oder Geschäft | 19 % |
| EU, privat | 19 % |
| EU, Geschäft, USt-Id fehlt oder ist ungültig | 19 % |
| EU, Geschäft, USt-Id gültig und bestätigt | in Deutschland nicht steuerbar, der Kunde führt die Steuer selbst ab |
| Privatkunde außerhalb der EU | 19 % |
| Geschäftskunde außerhalb der EU | in Deutschland nicht steuerbar |

„Nicht steuerbar“ ist kein Steuersatz von 0 % auf der Rechnung. Die deutsche Umsatzsteuer fällt nicht an.

## Steuer für die Ausleihe

Die Ausleihe ist eine Vermietung. Bei Privatkunden zählt grundsätzlich der Sitz des Verleihs, bei Geschäftskunden der Sitz des Kunden.

Baumaschinen zählen dabei nicht als Beförderungsmittel. Im Umsatzsteuer-Anwendungserlass steht ausdrücklich: „Keine Beförderungsmittel sind z. B. Bagger, Planierraupen, …“. Für Beförderungsmittel gäbe es eine eigene Regel. Radlader und Rüttelplatte stehen nicht in der Liste, dienen aber auch nicht der Beförderung. Das ist meine Einschätzung.

| Kunde | Steuer |
| --- | --- |
| Deutschland, privat oder Geschäft | 19 % |
| EU, privat | 19 % |
| EU, Geschäft, USt-Id fehlt oder ist ungültig | 19 % |
| EU, Geschäft, USt-Id gültig und bestätigt | in Deutschland nicht steuerbar, der Kunde führt die Steuer selbst ab |
| Privatkunde außerhalb der EU | in Deutschland nicht steuerbar |
| Geschäftskunde außerhalb der EU | in Deutschland nicht steuerbar |

Anders als bei der Wartung fällt beim Privatkunden außerhalb der EU keine deutsche Steuer an. Bei der Vermietung zählt hier sein Wohnsitz.

Beim EU-Geschäftskunden mit gültiger USt-Id steht auf der Rechnung, dass der Kunde die Steuer schuldet. Dazu kommen beide USt-Ids auf die Rechnung, und der Umsatz kommt in die Zusammenfassende Meldung.

Die Tabelle gilt für Maschinen ohne Fahrer. Anhänger wären Beförderungsmittel, für die gelten andere Regeln. Anhänger haben wir im Moment nicht.

## Steuer für die Bestellung

Die Bestellung ist eine Lieferung von Ware. Hier zählt, wohin die Ware geht und wer sie hinbringt. Für das Ziel zählt das Land der Lieferadresse.

| Wohin die Ware geht | Steuer |
| --- | --- |
| bleibt in Deutschland, egal welcher Kunde | 19 % |
| anderes EU-Land, Geschäft, USt-Id aus einem anderen EU-Land gültig und bestätigt | steuerfrei als innergemeinschaftliche Lieferung |
| anderes EU-Land, Geschäft, keine gültige USt-Id aus einem anderen EU-Land | 19 % |
| anderes EU-Land, privat, wir versenden | bis 10.000 € im Jahr 19 %, darüber der Satz des Ziellandes |
| anderes EU-Land, privat, der Kunde holt selbst ab | 19 % |
| außerhalb der EU, wir versenden | steuerfrei als Ausfuhr, mit Nachweis |
| außerhalb der EU, der Kunde holt selbst ab | steuerfrei als Ausfuhr nur bei einem Kunden aus dem Ausland, mit Nachweis. Bei Privatkunden gelten noch weitere Bedingungen |

Die 10.000 € gelten für alle Versandverkäufe an Privatkunden in der EU zusammen, im Vorjahr und im laufenden Jahr. Liegt man darüber, meldet man die Steuer über OSS oder registriert sich im Zielland.

Für die steuerfreie Lieferung in ein anderes EU-Land braucht man einen Nachweis, dass die Ware dort angekommen ist. Auf die Rechnung kommen beide USt-Ids, und der Umsatz kommt in die Zusammenfassende Meldung. Ohne richtige Meldung fällt die Steuerfreiheit weg.

Nicht geprüft habe ich, ob ein Verbrauchsmaterial unter 7 % fällt, Sonderregeln für Kraftstoff und Öl, und Sonderfälle bei Geschäftskunden ohne USt-Id.

## Prüfung der USt-Id

Möglichkeiten: die Eingabe vor der Prüfung zurechtschneiden (Leerzeichen, Punkte, Bindestriche weg, klein zu groß), oder die Nummer nur annehmen, wenn sie schon in der richtigen Form dasteht.

Empfehlung für dieses Issue: nur die Form prüfen, nichts zurechtschneiden. Leer ist gültig, das Feld gibt es nur bei `unternehmen`. Gültig ist der Aufbau aus der Tabelle unten, Ländercode groß. `DE 123456789` und `de123456789` sind ungültig. Den Ländercode nicht aus dem ISO-Land der Adresse bauen, da weichen ein paar ab:

- Griechenland ist `EL`, nicht `GR`.
- `UK` gibt es nicht. England, Schottland und Wales haben kein eigenes Kürzel. Der ISO-Code des Vereinigten Königreichs ist `GB`, nicht `UK`. `GB` ist seit dem Brexit keine EU-USt-Id mehr und kommt in dieser Prüfung nicht durch.
- Nordirland ist `XI`, nicht `GB` und nicht `UK`.

### Aufbau in allen EU-Ländern

Aus dem Merkblatt des BZSt und den FAQ von VIES. Die Beispiele sind erfunden und passen nur zur Form. Der Regex prüft nur die Form, keine Prüfziffer.

| Land | Aufbau | Beispiel | Regex |
| --- | --- | --- | --- |
| Belgien | `BE` + 10 Ziffern, die erste 0 oder 1 | BE0123456789 | `^BE[01]\d{9}$` |
| Bulgarien | `BG` + 9 oder 10 Ziffern | BG123456789 | `^BG\d{9,10}$` |
| Dänemark | `DK` + 8 Ziffern | DK12345678 | `^DK\d{8}$` |
| Deutschland | `DE` + 9 Ziffern | DE123456789 | `^DE\d{9}$` |
| Estland | `EE` + 9 Ziffern | EE123456789 | `^EE\d{9}$` |
| Finnland | `FI` + 8 Ziffern | FI12345678 | `^FI\d{8}$` |
| Frankreich | `FR` + 2 Prüfzeichen (Ziffer oder Buchstabe) + 9 Ziffern | FR12123456789 | `^FR[A-Z0-9]{2}\d{9}$` |
| Griechenland | `EL` + 9 Ziffern | EL123456789 | `^EL\d{9}$` |
| Irland | `IE` + 8 Zeichen (Ziffer, Zeichen, 5 Ziffern, Buchstabe) oder 9 Zeichen (7 Ziffern, 2 Buchstaben) | IE1234567AB | `^IE(\d[A-Z0-9+*]\d{5}[A-Z]\|\d{7}[A-W][A-I])$` |
| Italien | `IT` + 11 Ziffern | IT12345678901 | `^IT\d{11}$` |
| Kroatien | `HR` + 11 Ziffern | HR12345678901 | `^HR\d{11}$` |
| Lettland | `LV` + 11 Ziffern | LV12345678901 | `^LV\d{11}$` |
| Litauen | `LT` + 9 oder 12 Ziffern | LT123456789 | `^LT(\d{9}\|\d{12})$` |
| Luxemburg | `LU` + 8 Ziffern | LU12345678 | `^LU\d{8}$` |
| Malta | `MT` + 8 Ziffern | MT12345678 | `^MT\d{8}$` |
| Niederlande | `NL` + 12 Zeichen, meist 9 Ziffern + `B` + 2 Ziffern | NL123456789B01 | `^NL[A-Z0-9+*]{12}$` |
| Nordirland | `XI` + 9 oder 12 Ziffern, oder `GD`/`HA` + 3 Ziffern | XI123456789 | `^XI(\d{9}\|\d{12}\|GD\d{3}\|HA\d{3})$` |
| Österreich | `ATU` + 8 Ziffern | ATU12345678 | `^ATU\d{8}$` |
| Polen | `PL` + 10 Ziffern | PL1234567890 | `^PL\d{10}$` |
| Portugal | `PT` + 9 Ziffern | PT123456789 | `^PT\d{9}$` |
| Rumänien | `RO` + 2 bis 10 Ziffern, nicht mit 0 vorne | RO1234567 | `^RO[1-9]\d{1,9}$` |
| Schweden | `SE` + 12 Ziffern, die letzten zwei `01` | SE123456789001 | `^SE\d{10}01$` |
| Slowakei | `SK` + 10 Ziffern | SK1234567890 | `^SK\d{10}$` |
| Slowenien | `SI` + 8 Ziffern | SI12345678 | `^SI\d{8}$` |
| Spanien | `ES` + 9 Zeichen, das erste und/oder das letzte ein Buchstabe | ESA1234567B | `^ES(?![0-9]{9}$)[A-Z0-9]\d{7}[A-Z0-9]$` |
| Tschechien | `CZ` + 8, 9 oder 10 Ziffern | CZ12345678 | `^CZ\d{8,10}$` |
| Ungarn | `HU` + 8 Ziffern | HU12345678 | `^HU\d{8}$` |
| Zypern | `CY` + 8 Ziffern + 1 Buchstabe | CY12345678X | `^CY\d{8}[A-Z]$` |

Drei Stellen sind in den Quellen nicht ganz gleich:

- Niederlande: Die Regierung dort nennt 9 Ziffern + `B` + 2 Ziffern. VIES und BZSt lassen 12 Zeichen in beliebiger Reihenfolge zu. Der Regex nimmt die weite Form, damit keine gültige Nummer abgelehnt wird.
- Belgien: Seit September 2023 gibt es Nummern mit 1 vorne. Das BZSt nennt nur 10 Ziffern.
- Irland und Schweden: Die Buchstaben bei Irland und das `01` bei Schweden stehen nur beim BZSt.

Die Prüfung liegt auf dem Server, beim Anlegen und beim Bearbeiten. Empfehlung für die Formularprüfung im ganzen Produkt: Zod (https://zod.dev). Der Fehler darf im Formular früher erscheinen. Maßgeblich ist der Server.

~~Der Regex wartet 300 ms, ob der Nutzer weiter tippt.~~ Ein lokaler Regex braucht kein Debounce.

~~Damit der Server nicht rate-limited wird, prüft das Frontend direkt gegen VIES.~~ VIES ist keine Formatprüfung und wird nicht aus dem Browser aufgerufen.

Empfehlung: die Bestätigung der USt-Id ist VIES, auf dem Server. Deutsch heißt das MIAS. VIES sagt, ob die Nummer gültig ist. Für die Zeile „gültig und bestätigt“ ist diese Bestätigung gemeint. Den Beleg der Abfrage aufbewahren. Name und Anschrift gleicht man mit ab, wenn VIES sie mitliefert. Liefert ein Land sie nicht, bestätigt die Behörde nur, ob Name und Anschrift zu der Nummer gehören. In Deutschland ist das die qualifizierte Bestätigung beim BZSt nach § 18e UStG. Das ist das spätere Issue, nicht die Formatprüfung.

~~Zusätzlich baue ich aus Browsersprache, IP-Land und einer Wahrscheinlichkeit, ob die USt-Id plausibel ist.~~ Gemeint ist der Abgleich, ob USt-Id, Name und Anschrift zusammenpassen. Den soll man machen. Die Bestätigung der Nummer ist VIES. Artikel 18 verlangt dazu die Bestätigung von Nummer, Name und Anschrift. Browsersprache und IP-Land sind kein Abgleich. Unterstützend können sie sein: passen sie zum Land der USt-Id oder zur Rechnungsadresse nicht, ist das ein Hinweis zum Nachsehen. Die Steuer entscheidet das nicht, und eine eigene Wahrscheinlichkeit, ob die Nummer plausibel ist, auch nicht.

## Quellen

Abgerufen am 18.11.2026. Keine Rechtsberatung.

- [§ 3 UStG](https://www.gesetze-im-internet.de/ustg_1980/__3.html), Ort der Lieferung in Abs. 6
- [§ 3a UStG](https://www.gesetze-im-internet.de/ustg_1980/__3a.html), Ort der Leistung, Wartung in Abs. 3 Nr. 3a Buchst. b, Geschäftskunde in Abs. 2, Beförderungsmittel in Abs. 3 Nr. 2, Vermietung an Privatkunden außerhalb der EU in Abs. 4 Satz 2 Nr. 10, digitale Dienste in Abs. 5
- [§ 3c UStG](https://www.gesetze-im-internet.de/ustg_1980/__3c.html), 10.000-Euro-Grenze für Fernverkäufe und die in § 3a Abs. 5 genannten Dienste
- [§ 4 UStG](https://www.gesetze-im-internet.de/ustg_1980/__4.html), Nr. 1 Buchst. a und b, mit [§ 6](https://www.gesetze-im-internet.de/ustg_1980/__6.html) (Ausfuhr, Abholung durch den Kunden in Abs. 1 Nr. 2, Reisegepäck in Abs. 3a) und [§ 6a](https://www.gesetze-im-internet.de/ustg_1980/__6a.html) (innergemeinschaftliche Lieferung)
- [§ 13 UStG](https://www.gesetze-im-internet.de/ustg_1980/__13.html), wann die Steuer entsteht
- [§ 14a UStG](https://www.gesetze-im-internet.de/ustg_1980/__14a.html), Rechnung, wenn der Kunde die Steuer schuldet, und bei innergemeinschaftlicher Lieferung
- [§ 18a UStG](https://www.gesetze-im-internet.de/ustg_1980/__18a.html), Zusammenfassende Meldung
- [§ 18j UStG](https://www.gesetze-im-internet.de/ustg_1980/__18j.html), OSS
- [§ 19 UStG](https://www.gesetze-im-internet.de/ustg_1980/__19.html), Kleinunternehmer, 25.000 € und 100.000 €
- [§ 20 UStG](https://www.gesetze-im-internet.de/ustg_1980/__20.html), Ist-Versteuerung
- [§§ 17a und 17b UStDV](https://www.gesetze-im-internet.de/ustdv_1980/__17a.html), Nachweis, dass die Ware im anderen EU-Land angekommen ist
- [Umsatzsteuer-Anwendungserlass](https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Umsatzsteuer/Umsatzsteuer-Anwendungserlass/Umsatzsteuer-Anwendungserlass-aktuell.pdf?__blob=publicationFile), Abschnitt 3a.5 Abs. 2, Beförderungsmittel
- [Art. 18 VO (EU) Nr. 282/2011](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32011R0282)
- [BZSt, Aufbau der USt-IdNr. in den EU-Mitgliedstaaten](https://www.bzst.de/SharedDocs/Downloads/DE/Merkblaetter/ust_idnr_aufbau.html)
- [VIES, FAQ zum Aufbau der Nummern](https://ec.europa.eu/taxation_customs/vies/#/faq)
- [VIES / MIAS, Prüfung einer USt-Id](https://europa.eu/youreurope/business/finance-and-tax/vat/check-vat-number-vies/index_de.htm)
- [BZSt, Bestätigung nach § 18e UStG](https://online.portal.bzst.de/SharedDocs/Leistungsbeschreibung/DE/gueltigkeit_einer_umsatzsteuer-identifikationsnummer_nach_18_e_UStG.html)
