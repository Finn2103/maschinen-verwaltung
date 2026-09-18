# ADR 0004 — Client-Technologie

- **Status:** Entwurf — Formulierung wird vom Team überschrieben
- **Datum:** 2026-09-18
- **Entschieden von:** Team (Gruppe 11), im Sprint-1-Planning
- **Betrifft:** [#1](https://github.com/Finn2103/maschinen-verwaltung/issues/1) · [#2](https://github.com/Finn2103/maschinen-verwaltung/issues/2) · [#6](https://github.com/Finn2103/maschinen-verwaltung/issues/6) · [#8](https://github.com/Finn2103/maschinen-verwaltung/issues/8)

## Kontext

Für das Webportal und das Backoffice wird eine Client-Technologie gebraucht. Die
Aufgabenstellung nennt als Orientierung **Angular, C#/C++ oder Flutter**; verbindlich ist
allein die Pflichtliste. Damit ist die Wahl offen, muss aber begründet werden — und sie
muss die Pflichtpunkte tragen.

Entscheidend ist die Randbedingung **Client-Server-Architektur ist Pflicht**. Der Browser
darf nicht direkt mit der Datenbank sprechen. Es braucht also eine eigene Serverschicht —
entweder mitgeliefert oder zusätzlich zu bauen.

Zweite Randbedingung: die Anwendungsentwicklung ist **einfach besetzt**, bei rund 12 bis 18
Stunden Entwicklungszeit pro Sprint. Anlaufzeit ist damit ein echter Kostenfaktor.

## Optionen

1. **React mit Next.js** — Komponentenbibliothek plus Rahmenwerk mit eigener Serverschicht
2. **Angular** — vollständiges Rahmenwerk für den Client, Serverschicht separat
3. **Flutter** — Rahmenwerk für Oberflächen, Web als ein Ausgabeziel

## Ausschlusskriterien aus der Pflichtliste

Bevor bewertet wird: was reißt eine Pflichtvorgabe, fällt unabhängig von der Punktzahl heraus.

| Ausschlusskriterium | React/Next.js | Angular | Flutter |
| --- | --- | --- | --- |
| Client-Server-Architektur möglich | ja | ja, mit eigenem Backend | ja, mit eigenem Backend |
| Objektorientierter Ansatz möglich | ja | ja | ja |
| Barrierefreiheit nach ISO 9241 erreichbar | ja, über DOM und ARIA | ja, über DOM und ARIA | **eingeschränkt** |

Zu Flutter: Flutter Web zeichnet die Oberfläche und baut nicht auf der Semantik des
Dokuments auf. Barrierefreiheit ist dadurch deutlich schwerer erreichbar als bei
DOM-basierten Rahmenwerken. Ein harter Ausschluss ist das nicht, aber ein schwerer Nachteil
bei einer Pflichtvorgabe. **Vor einer endgültigen Entscheidung am konkreten Stand prüfen.**

## Nutzwertanalyse

Punkte 1 (ungeeignet) bis 5 (sehr gut geeignet). Nutzwert = Summe aus Gewicht × Punkte.

| Kriterium | Warum dieses Kriterium | Gewicht | React/Next.js | Angular | Flutter |
| --- | --- | --- | --- | --- | --- |
| Eigene Serverschicht im selben Projekt | Client-Server ist Pflicht. Ohne mitgelieferte Serverschicht ist ein zweites Projekt zu bauen und zu betreiben. | 0,20 | 5 | 2 | 1 |
| Barrierefreiheit nach ISO 9241 erreichbar | Pflicht. Hängt an der Semantik des Dokuments und an ARIA. | 0,20 | 5 | 5 | 2 |
| Eignung für datenlastige Oberflächen | Das Produkt ist Verwaltung: Tabellen, Formulare, Validierung — keine Grafik. | 0,15 | 4 | 5 | 2 |
| Lernzuwachs im Team | Vorgabe des Bildungsgangs. | 0,15 | 4 | 5 | 5 |
| Anlaufzeit bis zum ersten Ergebnis | Eine Person, 12 Wochen, harter Abgabetermin. | 0,15 | 4 | 2 | 2 |
| Dokumentation und Hilfe bei Problemen | Kein erfahrener Entwickler im Rücken. | 0,10 | 5 | 4 | 3 |
| Betrieb auf der eigenen VM ohne Fremddienst | Infrastructure as Code, eigene Strato-VM. | 0,05 | 5 | 4 | 3 |
| **Nutzwert** | | **1,00** | **4,55** | **3,80** | **2,40** |

## Entscheidung

**React mit Next.js.**

Die Entscheidung hängt an einem einzigen Kriterium: der **mitgelieferten Serverschicht**.
Angular und Flutter sind reine Client-Technologien. Mit ihnen wäre ein zweiter Dienst zu
bauen, zu containerisieren, per Infrastructure as Code aufzusetzen und zu betreiben — für
eine einfach besetzte Anwendungsentwicklung mit vier Schultagen pro Sprint ist das der
teuerste Posten im ganzen Vorhaben.

Bei Next.js liegt die Client-Server-Grenze **innerhalb eines Projekts**: der Browser spricht
mit den Route Handlers, die Route Handlers sprechen mit der Datenbank-API. Die
Pflichtvorgabe wird dadurch nicht nur erfüllt, sondern ist im Quelltext sichtbar an einer
Stelle nachweisbar.

**Angular ist der stärkste Gegenkandidat** und gewinnt zwei Kriterien: den Lernzuwachs und
die Eignung für datenlastige Formulare. Seine Formularvalidierung ist ausgereifter als
alles, was wir in React selbst bauen werden. Das nehmen wir bewusst in Kauf.

**Flutter fällt deutlich zurück**, und zwar nicht wegen der Verbreitung, sondern wegen der
Barrierefreiheit: eine gezeichnete Oberfläche ohne Dokumentsemantik macht eine
Pflichtvorgabe unnötig schwer.

## Lernzuwachs

Wir behaupten nicht, bei null anzufangen. **Neu ist nicht der Name der Technologie, sondern
was dieses Projekt damit verlangt:**

- **Die strikte Serverschicht.** Nahezu jede Anleitung im Netz lässt den Browser direkt mit
  dem Datendienst sprechen. Genau das ist hier verboten. Die Grenze bewusst zu ziehen und
  einzuhalten ist der eigentliche Lerninhalt — und etwas, das man aus Tutorials nicht
  mitbekommt.
- **Wo läuft welcher Code.** Die Trennung zwischen Server- und Client-Komponenten im App
  Router: was darf Zugangsdaten sehen, was landet im Browser. Das ist neu und die Stelle,
  an der Sicherheitsfehler entstehen.
- **Barrierefreiheit auf Normniveau.** Fokus gezielt setzen, Fehlermeldungen programmatisch
  mit ihrem Feld verknüpfen, vollständige Tastaturbedienung. Das haben die wenigsten je
  gebaut, und es ist hier Pflicht.

## Konsequenzen

- Die Programmiersprache ist damit auf eine JavaScript-Sprache eingeschränkt — siehe
  [ADR 0010](0010-programmiersprache.md).
- Wir weichen von der Optionsliste der Aufgabenstellung ab. Das ist zulässig, muss aber bei
  der Vorstellung von selbst angesprochen werden.
- Die Formularvalidierung baut das Team selbst. Aufwand, den Angular geschenkt hätte.
- Der objektorientierte Anteil liegt **nicht** in den Komponenten, sondern in der
  Domänenschicht auf dem Server. Er muss dort sichtbar gebaut werden, sonst ist die
  Pflichtvorgabe nur behauptet.
