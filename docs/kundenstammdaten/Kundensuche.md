In diesem Dokument schreibe ich auf, welche Möglichkeiten es gibt, einen vorhandenen Kunden wiederzufinden, und was ich dem Entwickler empfehle.

Aufgabe: Kunden sind über Name, Kundennummer und Ort auffindbar.

Möglichkeiten: drei getrennte Filter, oder ein Suchfeld, das die Eingabe gegen alle drei prüft.

Empfehlung: ein Suchfeld. Raus kommt eine Liste. Das ist keine Dublettenwarnung, die sitzt beim Anlegen.

- Name: bei PRIVAT Vorname und Nachname, bei BUSINESS der Unternehmensname. Ein Stück reicht. `Laeser` findet `Nico Laeser` und `Laeser GmbH`. Den Ansprechpartner nicht mit durchsuchen, sonst findet man über den Geschäftsführer ständig die Firma mit.
- Kundennummer: `K017` und `17` finden denselben Kunden.
- Ort: der Ort der Rechnungsadresse. `Dresden` findet die Kunden dort. Die Lieferadresse, also die Baustelle, nicht mit durchsuchen. Die teilen sich zu viele.

Groß und klein egal. Gelöschte Kunden drin lassen, die Nummer wird nicht wieder frei und man will den alten Satz oft wieder aufmachen. Die Suche auf dem Server laufen lassen, sonst fehlen die Kunden, die gerade nicht auf der Seite stehen.
