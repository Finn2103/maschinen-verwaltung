In diesem Dokument schreibe ich auf, was ich zu Rechnung, Steuersatz und USt-Id gefunden habe, und was ich dem Entwickler empfehle.

## Unterschied zwischen USt-Id und Steuernummer

### Steuernummer

Die Steuernummer vergibt in Deutschland das Finanzamt, hier wäre es zum Beispiel das Finanzamt Gummersbach. Der Hauptzweck ist eine generelle Zuordnung, und diese Nummer bekommt man standardmäßig. Sie ist für nationale Rechnungen gültig.

Sie dient in keinem Fall als EU-USt-Identifikationsmittel. Das Format hängt vom Bundesland ab, meistens `123/123/1234`. Es gibt keinen Weltstandard, und manche Länder haben ganz andere Nummern und Wege.

### USt-Id

Die USt-Id wird vom BZSt vergeben. Für Deutschland ist der Standard `DE` und 9 Ziffern, also `DE123456789`. Als Kleinunternehmer bekommt man die oft nicht automatisch, sondern nur auf Antrag.

## Kleinunternehmer und Regelbesteuerung

Als Kleinunternehmer weist man keine Umsatzsteuer aus. Auf der Rechnung ist der Betrag netto gleich brutto, mit dem Hinweis auf § 19 UStG. Das ist für den Anfang einfacher und oft der Weg, wenn man sich nebenberuflich selbstständig macht.

~~Ab dem Umsatz von 25.000 € muss man auf die Regelbesteuerung wechseln.~~ Seit 2025 gilt die Kleinunternehmerregelung, wenn der Gesamtumsatz im Vorjahr 25.000 € nicht übersteigt und im laufenden Jahr 100.000 € nicht überschreitet (§ 19 UStG).

~~Bei der Soll-Versteuerung schätzt das Finanzamt, und man muss vorauszahlen.~~ Soll heißt: die Steuer entsteht mit der Rechnung. Ist heißt: die Steuer entsteht mit dem Zahlungseingang. Ist muss man beim Finanzamt beantragen (§ 20 UStG). Für den Prozentsatz auf der Rechnung ist das egal.

Bei der Regelbesteuerung schreiben wir die Rechnung mit 19 % Umsatzsteuer aus. Endkunden nennen das oft MwSt.

Für dieses Projekt gehen wir von einem Unternehmen aus, das regelbesteuert ist und nicht unter die Kleinunternehmerregelung fällt.

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

## Prüfung der USt-Id

Möglichkeiten: die Eingabe vor der Prüfung zurechtschneiden (Leerzeichen, Punkte, Bindestriche weg, klein zu groß), oder die Nummer nur annehmen, wenn sie schon in der richtigen Form dasteht.

Empfehlung für dieses Issue: nur die Form prüfen, nichts zurechtschneiden. Leer ist gültig, das Feld gibt es nur bei BUSINESS. Gültig ist `DE` plus 9 Ziffern, `ATU` plus 8 Ziffern, Ländercode groß. `DE 123456789` und `de123456789` sind ungültig. Den Ländercode nicht aus dem ISO-Land der Adresse bauen, da weichen ein paar ab:

- Griechenland ist `EL`, nicht `GR`.
- `UK` gibt es nicht. England, Schottland und Wales haben kein eigenes Kürzel. Der ISO-Code des Vereinigten Königreichs ist `GB`, nicht `UK`. `GB` ist seit dem Brexit keine EU-USt-Id mehr und kommt in dieser Prüfung nicht durch.
- Nordirland ist `XI`, nicht `GB` und nicht `UK`.

Die Prüfung liegt auf dem Server, beim Anlegen und beim Bearbeiten. Empfehlung für die Formularprüfung im ganzen Produkt: Zod (https://zod.dev). Der Fehler darf im Formular früher erscheinen. Maßgeblich ist der Server.

~~Der Regex wartet 300 ms, ob der Nutzer weiter tippt.~~ Ein lokaler Regex braucht kein Debounce.

~~Damit der Server nicht rate-limited wird, prüft das Frontend direkt gegen VIES.~~ VIES ist keine Formatprüfung und wird nicht aus dem Browser aufgerufen.

Empfehlung: die Bestätigung der USt-Id ist VIES, auf dem Server. Deutsch heißt das MIAS. VIES sagt, ob die Nummer gültig ist. Für die Zeile „gültig und bestätigt“ ist diese Bestätigung gemeint. Den Beleg der Abfrage aufbewahren. Name und Anschrift gleicht man mit ab, wenn VIES sie mitliefert. Liefert ein Land sie nicht, bestätigt die Behörde nur, ob Name und Anschrift zu der Nummer gehören. In Deutschland ist das die qualifizierte Bestätigung beim BZSt nach § 18e UStG. Das ist das spätere Issue, nicht die Formatprüfung.

~~Zusätzlich baue ich aus Browsersprache, IP-Land und einer Wahrscheinlichkeit, ob die USt-Id plausibel ist.~~ Gemeint ist der Abgleich, ob USt-Id, Name und Anschrift zusammenpassen. Den soll man machen. Die Bestätigung der Nummer ist VIES. Artikel 18 verlangt dazu die Bestätigung von Nummer, Name und Anschrift. Browsersprache und IP-Land sind kein Abgleich. Unterstützend können sie sein: passen sie zum Land der USt-Id oder zur Rechnungsadresse nicht, ist das ein Hinweis zum Nachsehen. Die Steuer entscheidet das nicht, und eine eigene Wahrscheinlichkeit, ob die Nummer plausibel ist, auch nicht.

## Quellen

- [§ 3a UStG](https://www.gesetze-im-internet.de/ustg_1980/__3a.html), Ort der Leistung, Wartung in Abs. 3 Nr. 3a Buchst. b, Geschäftskunde in Abs. 2, digitale Dienste in Abs. 5
- [§ 3c UStG](https://www.gesetze-im-internet.de/ustg_1980/__3c.html), 10.000-Euro-Grenze für Fernverkäufe und die in § 3a Abs. 5 genannten Dienste
- [§ 18j UStG](https://www.gesetze-im-internet.de/ustg_1980/__18j.html), OSS
- [§ 19 UStG](https://www.gesetze-im-internet.de/ustg_1980/__19.html), Kleinunternehmer, 25.000 € und 100.000 €
- [§ 20 UStG](https://www.gesetze-im-internet.de/ustg_1980/__20.html), Ist-Versteuerung
- [Art. 18 VO (EU) Nr. 282/2011](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32011R0282)
- [VIES / MIAS, Prüfung einer USt-Id](https://europa.eu/youreurope/business/finance-and-tax/vat/check-vat-number-vies/index_de.htm)
- [BZSt, Bestätigung nach § 18e UStG](https://online.portal.bzst.de/SharedDocs/Leistungsbeschreibung/DE/gueltigkeit_einer_umsatzsteuer-identifikationsnummer_nach_18_e_UStG.html)
