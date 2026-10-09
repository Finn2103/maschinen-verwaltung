# ADR 0009: Was „barrierefrei nach ISO 9241" für dieses Projekt heißt

- **Status:** **Entschieden** am 08.10.2026
- **Datum:** 2026-10-08
- **Entschieden von:** Finn Jendras (Anwendungsentwicklung)
- **Betrifft:** [#1](https://github.com/Finn2103/maschinen-verwaltung/issues/1) · [#2](https://github.com/Finn2103/maschinen-verwaltung/issues/2) · [#7](https://github.com/Finn2103/maschinen-verwaltung/issues/7) · [#8](https://github.com/Finn2103/maschinen-verwaltung/issues/8) · [#44](https://github.com/Finn2103/maschinen-verwaltung/issues/44)

## In einem Satz

ISO 9241 wird **einmal** in eine Liste prüfbarer Kriterien übersetzt. Jedes
Oberflächen-Item wird gegen diese Liste abgenommen, nicht gegen die Norm. Einschlägig
sind ISO 9241-110:2020 und -171:2008.

## Kontext

Die Aufgabenstellung verlangt eine Oberfläche, die **barrierefrei nach ISO 9241** ist. Das
ist eine Pflichtvorgabe, steht aber so allgemein da, dass sich daran nichts abnehmen lässt.

In #1 stand deshalb bis zum 08.10.2026 ein Akzeptanzkriterium, das auf eine Checkliste
verwies, **die es nicht gab**. Solange sie fehlt, ist das Kriterium nicht prüfbar und #1
nicht abschließbar. Dasselbe gilt für #2, #7 und #8.

Dazu kommt ein Fehler aus der Backlog-Arbeit, der hier mitgelöst wird: der Normbezug war
einmal durch zwei konkrete Häkchen **ersetzt** worden, weil er nicht prüfbar sei. Das war
in zwei Richtungen falsch. Die Norm steht in der Pflichtliste und muss auffindbar bleiben,
und zwei Häkchen sind nicht dasselbe wie eine Norm. Gebraucht wird **beides**: der
Normbezug und die Prüfbarkeit.

## Welche Teile der Norm gelten

ISO 9241 ist eine Normenreihe mit über vierzig Teilen, von Bildschirmanforderungen bis
Haptik. Für eine Webanwendung sind drei Teile einschlägig:

| Teil | Titel | Warum er hier gilt |
| --- | --- | --- |
| **ISO 9241-110:2020** | Interaktionsprinzipien | Die sieben Prinzipien, an denen sich die Bedienung messen lässt |
| **ISO 9241-171:2008** | Leitlinien für die Zugänglichkeit von Software | Der Teil, der Barrierefreiheit im engeren Sinn behandelt |
| ISO 9241-11:2018 | Gebrauchstauglichkeit, Begriffe | Liefert die Begriffe Effektivität, Effizienz, Zufriedenheit |

> **Achtung bei der Jahreszahl.** ISO 9241-110 heißt seit **2020 „Interaktionsprinzipien"**
> und löst die Fassung von 2006 ab, die „Grundsätze der Dialoggestaltung" hieß. Die alten
> Namen **Lernförderlichkeit**, **Fehlertoleranz** und **Individualisierbarkeit** gibt es
> nicht mehr: Individualisierbarkeit ist in der Steuerbarkeit aufgegangen,
> Lernförderlichkeit heißt jetzt Erlernbarkeit, Fehlertoleranz heißt Robustheit gegen
> Benutzungsfehler. Neu ist die Benutzerbindung. Wer die alten Namen nennt, zitiert eine
> zurückgezogene Ausgabe.

### Die sieben Interaktionsprinzipien (ISO 9241-110:2020)

1. Aufgabenangemessenheit
2. Selbstbeschreibungsfähigkeit
3. Erwartungskonformität
4. Erlernbarkeit
5. Steuerbarkeit
6. Robustheit gegen Benutzungsfehler
7. Benutzerbindung

## Entscheidung

**Die Norm wird einmal in eine Liste prüfbarer Kriterien übersetzt. Jedes Oberflächen-Item
wird gegen diese Liste abgenommen, nicht gegen die Norm selbst.**

Jeder Punkt der Liste ist mit **Tastatur, Screenreader oder Kontrastmessung** nachweisbar.
Punkte, die nur durch Einschätzung zu beurteilen wären, stehen nicht drin.

### Verhältnis zu WCAG 2.1 AA

ISO 9241-171 und die WCAG überschneiden sich stark, sind aber nicht dasselbe: die Norm ist
breiter und weniger operationalisiert, die WCAG sind enger und prüfbar formuliert.

**Deshalb wird die Liste an den WCAG-Erfolgskriterien aufgehängt und auf die
ISO-Prinzipien zurückgeführt.** Das ist kein Ausweichen vor der Norm, sondern der Weg, sie
prüfbar zu machen. Wer fragt, warum WCAG-Nummern dastehen, bekommt diese Antwort.

Was die WCAG **nicht** abdecken, ist der Teil von ISO 9241-110, der über Zugänglichkeit
hinausgeht: Aufgabenangemessenheit, Erwartungskonformität, Erlernbarkeit. Dafür stehen
unten eigene Punkte.

## Die Checkliste

> **Das ist eine Vorlage, keine offene Arbeit.** Die leeren Kästchen unten gehören
> hierher und bleiben leer. Abgehakt wird in dem Issue, in das die Liste kopiert wird.
> Wer hier 30 offene Punkte sieht, sieht die Vorlage, nicht einen Arbeitsrückstand.

Zum Kopieren in das jeweilige Issue. Ein Item ist barrierefrei abgenommen, wenn alle
zutreffenden Punkte erfüllt sind.

### A. Tastatur

- [ ] Jede Funktion ist **ohne Maus** erreichbar und auslösbar (WCAG 2.1.1)
- [ ] Der Fokus kommt überall wieder heraus, keine Tastaturfalle (WCAG 2.1.2)
- [ ] Die Fokusreihenfolge folgt der Leserichtung (WCAG 2.4.3)
- [ ] Der Fokus ist **immer sichtbar**, auch auf eigenen Bedienelementen (WCAG 2.4.7)

> **Prüfung:** Maus weglegen. Mit Tabulator durch die ganze Seite, mit Enter und Leertaste
> bedienen. Wer hängen bleibt oder nicht sieht, wo er ist, hat einen Fehler gefunden.
> *ISO-Prinzipien: Steuerbarkeit, Selbstbeschreibungsfähigkeit.*

### B. Beschriftung und Struktur

- [ ] Jedes Formularfeld hat ein `<label>` mit `for` auf seine `id` (WCAG 3.3.2)
- [ ] Zusammengehörige Felder stehen in `<fieldset>` mit `<legend>` (WCAG 1.3.1)
- [ ] Überschriftenebenen ohne Sprung, genau ein `<h1>` je Seite (WCAG 1.3.1)
- [ ] Der Seitentitel benennt die Seite, nicht die Anwendung (WCAG 2.4.2)
- [ ] Die Seitensprache steht im `<html lang>` (WCAG 3.1.1)
- [ ] Bedienelemente heißen, was sie tun. Kein „hier klicken" (WCAG 2.4.4)

> **Prüfung:** Im Browser die Entwicklerwerkzeuge öffnen, Element prüfen. Hilfstechnik
> liest den **Dokumentenbaum**, nicht den Bildschirm: ein Text, der daneben steht, gehört
> nicht dazu.
> *ISO-Prinzipien: Selbstbeschreibungsfähigkeit, Erwartungskonformität.*

### C. Fehler und Rückmeldung

- [ ] Ein fehlerhaftes Feld trägt `aria-invalid="true"` (WCAG 3.3.1)
- [ ] Die Meldung ist über `aria-describedby` mit dem Feld verknüpft (WCAG 3.3.1)
- [ ] Die Meldung sagt, **was zu tun ist**, nicht nur dass etwas falsch ist (WCAG 3.3.3)
- [ ] Nach einem fehlgeschlagenen Absenden springt der Fokus auf das erste betroffene Feld
- [ ] Eingaben gehen bei einer Ablehnung **nicht verloren**
- [ ] Änderungen, die nicht im Fokus passieren, werden angesagt: `aria-live` oder `role="alert"` (WCAG 4.1.3)

> **Prüfung:** Absenden mit leeren und mit falschen Feldern. Unter Windows mit der
> Sprachausgabe gegenhören, das kostet zehn Minuten.
> *ISO-Prinzipien: Robustheit gegen Benutzungsfehler, Selbstbeschreibungsfähigkeit.*

### D. Farbe und Kontrast

- [ ] Fließtext mindestens **4,5:1** gegen seinen Hintergrund (WCAG 1.4.3)
- [ ] Große Schrift ab 18,5 px fett oder 24 px mindestens **3:1** (WCAG 1.4.3)
- [ ] Umrisse von Bedienelementen und der Fokusrahmen mindestens **3:1** (WCAG 1.4.11)
- [ ] Keine Information **allein** über Farbe. Fehler sind nicht nur rot, sondern haben Text (WCAG 1.4.1)
- [ ] Die Werte gelten in **heller und dunkler** Darstellung

> **Prüfung:** Messen, nicht schätzen. Die Kontrastprüfung der Browser-Entwicklerwerkzeuge
> genügt. Der letzte Punkt wird gern vergessen, weil die dunkle Darstellung später kommt.

### E. Zustände und Zoom

- [ ] **Ladezustand** vorhanden (Definition of Done, Punkt 8)
- [ ] **Leerzustand** sagt, was man jetzt tun kann, nicht nur „nichts gefunden"
- [ ] **Fehlerzustand** vorhanden und ohne Fachjargon
- [ ] Bei 200 % Zoom bleibt alles bedienbar, kein waagerechtes Scrollen (WCAG 1.4.4)

> *ISO-Prinzipien: Aufgabenangemessenheit, Erlernbarkeit.*

### F. Aus ISO 9241-110, über die WCAG hinaus

- [ ] **Aufgabenangemessenheit:** Vorbelegungen passen zur Aufgabe. Wer aus einer Suche
      heraus reserviert, findet den Zeitraum schon ausgefüllt
- [ ] **Erwartungskonformität:** gleiche Dinge sehen gleich aus und verhalten sich gleich
- [ ] **Steuerbarkeit:** jeder Schritt ist umkehrbar oder abbrechbar, nichts passiert ohne Bestätigung
- [ ] **Selbstbeschreibungsfähigkeit:** der Nutzer sieht, wo er ist und was als Nächstes passiert

## Konsequenzen

**Diese Liste ist die Abnahme, nicht die Norm.** Im Fachgespräch zeigt man die Liste und
sagt, welche Teile der ISO 9241 dahinterstehen. Die Norm auswendig zu zitieren ist nicht
verlangt, die eigene Übersetzung begründen zu können schon.

**Die Liste gilt für alle Oberflächen-Items**, nicht nur für #1. Sie wird in #2, #7 und #8
mitverwendet, damit nicht jedes Mal neu verhandelt wird, was barrierefrei heißt.

**Zwei Punkte kosten Arbeit, die oft vergessen wird:** die Kontrastwerte in **beiden**
Darstellungen, und der Fokus nach einem fehlgeschlagenen Absenden. Beides fällt erst beim
Prüfen auf, nicht beim Bauen.

**Der Einstieg ist der Tastaturdurchlauf.** Er dauert zwei Minuten, braucht kein Werkzeug
und findet die meisten Fehler. Wer nur einen Punkt dieser Liste macht, macht diesen.

## Stand in #1 am 08.10.2026

Geprüft und erfüllt: `aria-invalid`, `aria-describedby`, `role="alert"`, Fokus auf dem
betroffenen Feld, Eingaben bleiben erhalten, Label an jedem Feld, `fieldset` mit `legend`
für den Zeitraum, Lade-, Leer- und Fehlerzustand, Trefferzahl in einem `aria-live`-Bereich.

Noch offen: vollständiger Tastaturdurchlauf, Kontrastmessung in beiden Darstellungen,
Zoom auf 200 %, Prüfung mit einer Sprachausgabe.
