In diesem Dokument schreibe ich auf, welche Möglichkeiten es gibt, einen vorhandenen Kunden wiederzufinden, und was ich dem Entwickler empfehle.

Aufgabe: Kunden sind über Name, Kundennummer und Ort auffindbar.

Suchen darf nur das Personal, also wer `kunde.suchen` hat. Der Kunde sucht keine Kunden (`docs/rollen-und-rechte.md`).

Möglichkeiten: drei getrennte Filter, oder ein Suchfeld, das die Eingabe gegen alle drei prüft.

Empfehlung: ein Suchfeld. Raus kommt eine Liste. Das ist keine Dublettenwarnung, die sitzt beim Anlegen.

- Name: bei `privat` Vorname und Nachname, bei `unternehmen` der Unternehmensname. Ein Stück reicht. `Mustermann` findet `Max Mustermann` und `Mustermann GmbH`. Den Ansprechpartner nicht mit durchsuchen, sonst findet man über den Geschäftsführer ständig die Firma mit.
- Kundennummer: `K017` und `17` finden denselben Kunden.
- Ort: der Ort der Rechnungsadresse. `Dresden` findet die Kunden dort. Die Lieferadresse, also die Baustelle, nicht mit durchsuchen. Die teilen sich zu viele. Ein Kunde ohne Adresse (#1) ist über den Ort nicht zu finden, über Name und Kundennummer schon.

Groß und klein egal. Gelöschte Kunden drin lassen, die Nummer wird nicht wieder frei und man will den alten Satz oft wieder aufmachen. Die Suche auf dem Server laufen lassen, sonst fehlen die Kunden, die gerade nicht auf der Seite stehen.
