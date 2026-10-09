# Lerntagebuch: Finn Jendras

Rolle: Scrum Master und Anwendungsentwicklung · Gruppe 11 · Maschinenverleih

Format nach der Vorlage der Lehrkräfte: **Datum · Tätigkeit · Problem · Lösung · Lessons
Learned.** Ein Abschnitt pro Schultag, neueste Einträge oben.

Hinweise zum Ausfüllen stehen in [`README.md`](README.md), besonders der Punkt, dass für
die Abgabe zusätzlich eine Word-Fassung im Loop-Arbeitsbereich verlangt ist.

---

## 2026-10-09 · Freitag

**Tätigkeit**

- Eigenes Review des Boards und meiner User Stories, ohne KI, danach die Befunde abarbeiten lassen
- `staging` nach `main` zusammengeführt, 57 Commits
- #39 und #1 geprüft und die erfüllten Akzeptanzkriterien abgehakt
- Jede entschiedene ADR um einen Abschnitt „In einem Satz" ergänzt
- #70 und #71 angelegt für Arbeit, die in Dokumenten lag und kein Ticket hatte
- ERD-Abnahme vorbereitet: Übersichtsseite mit acht Fragen und #73 zum Antworten
- Aufgabenliste je Teammitglied für die Zeit bis zum Review geschrieben
- Kommentare an #55 und #35, damit die Hinweise dort stehen, wo gearbeitet wird

**Problem**

- In ADR 0001, 0004 und 0010 stand oben noch „Entwurf" und „die Begründung fehlt noch", obwohl die Issues geschlossen waren. Ich dachte, beim Schließen sei etwas schiefgelaufen
- Die KI hatte für #1 „sieben von zehn Kriterien erfüllt" behauptet. Es sind **neun** Kriterien, und erfüllt waren **fünf**. Keines war abgehakt
- Bei #45 war die Annahme, aus `staging` sei etwas erfüllt. Es gibt nur das ERD, kein relationales Modell und kein SQL
- Im ERD fehlen Bauteil, Verbrauchsmaterial und Bestellung, obwohl sie in unserem eigenen `docs/datenmodell/README.md` als fachliche Anker stehen. Bei sieben von neun Entitäten fehlen die Attribute
- Die Begründungen stehen verteilt in Issue-Kommentaren und ADRs und sind zu lang, um im Fachgespräch benutzbar zu sein
- #44 ist geschlossen, die Abnahme gegen die Checkliste war darin aber nicht enthalten. #2, #7 und #8 haben gar keine Barrierefreiheits-Kriterien
- Die Checkliste in ADR 0009 zeigte 30 leere Kästchen und sah aus wie Arbeitsrückstand, obwohl sie eine Vorlage ist
- Das Team konnte heute nicht gemeinsam am ERD arbeiten, und mehrere haben gesagt, dass sie nicht fertig werden
- Meine erste Aufgabenliste für die Gruppe war zu lang für den Weg, auf dem ich sie schicken wollte

**Lösung**

- Ursache der ADR-Beobachtung gefunden: **`main` lag 55 Commits hinter `staging`.** `main` ist der Standard-Branch, also sieht man dort den Stand vom 24.09. Fünf ADRs existierten auf `main` gar nicht, und alle Links in Issue-Kommentaren zeigten auf `blob/main/` und damit auf veraltete Dateien. Zusammengeführt und die Links auf `staging` umgestellt
- Kriterien in #39 und #1 nachgezählt und abgehakt, die veralteten Zahlen in #39 korrigiert
- Jede entschiedene ADR beginnt jetzt mit „In einem Satz", zwei bis drei Zeilen ganz oben. Als Konvention im ADR-Index festgehalten, zusammen mit der Regel: wer ein Issue schließt, prüft das zugehörige ADR auf offene Stellen
- #70 sammelt die offenen Stellen aus fünf ADRs, #71 die Anwendung der Barrierefreiheits-Checkliste auf #2, #7 und #8
- Hinweis über die Checkliste in ADR 0009, dass sie eine Vorlage ist
- ERD-Abnahme so gebaut, dass sie ohne Git funktioniert: Übersichtsseite zum Lesen, und in #73 eine Vorlage, bei der je Frage **ein Wort** genügt
- Aufgabenliste gekürzt, bis sie in eine Kurznachricht passt. Details bleiben in den Issues und werden nur verlinkt

**Lessons Learned**

- **Der Standard-Branch ist das, was andere sehen.** Wir arbeiten auf `staging`, aber jeder Link und jeder Repository-Aufruf landet auf `main`. Solange der nicht nachgezogen wird, ist die halbe Arbeit für Außenstehende nicht vorhanden. Wir hatten die Regel „wann geht `staging` nach `main`" als offen markiert und dann vergessen
- **Zahlen, die eine KI nennt, sind Behauptungen, bis sie gezählt sind.** Zweimal an einem Tag stimmten die Angaben nicht. Das eigene Review war die bessere Prüfung
- **Ein Dokument zu erzeugen ist nicht dasselbe wie es anzuwenden.** #44 hat die Checkliste erstellt und war damit erledigt. Dass drei von vier Oberflächen-Items sie nicht als Kriterium tragen, hatte niemandem gehört
- Arbeit, die als „offen" in einem Dokument steht, hat keinen Bearbeiter und erscheint auf keinem Board. Beim Schließen eines Issues muss man ins zugehörige Dokument schauen
- **Eine Begründung, die niemand liest, wirkt wie keine.** Drei Absätze im ADR sind richtig und nützen nichts, wenn die Frage im Fachgespräch in zehn Sekunden beantwortet werden muss. Deshalb die Kurzfassung oben und das Ausführliche darunter
- Kommunikation muss zum Medium passen. Eine Liste, die als Seite funktioniert, ist für eine Kurznachricht zu lang. Dann gehören die Details in das Issue und die Nachricht enthält nur, was ansteht und wo es steht
- Wer mit Git nicht zurechtkommt, braucht einen Weg ohne Git. Ein Kommentar in einem Issue ist ein Textfeld wie in einem Chat, und das muss man dazusagen, sonst ist die Hürde das Werkzeug und nicht die Aufgabe

---

## 2026-10-08 · Donnerstag

**Tätigkeit**

- Projektstand gegen die Review-Vorgaben vom 15.10. geprüft
- #40 und #41 abgeschlossen, jeweils mit Abschlusskommentar und Begründung
- Sprint 1 geschlossen, 14 unfertige Items nach Sprint 2 übertragen, Abschluss dokumentiert
- Reservieren gebaut: Fachlogik, Speicher-Umsetzung, Server Action, Formular
- Zwei Kriterien in #4 ergänzt, die aus Nicos Docker-Dokumentation kommen
- ADR 0009 geschrieben: ISO 9241 in prüfbare Kriterien übersetzt (#44)
- ADR 0011 geschrieben: Speicherzugriff über eine Schnittstelle
- Vier Tickets für Arbeit nachgetragen, die erledigt war und kein Ticket hatte
- #48 abgeschlossen, der Nachweis der KI-Nutzung war fast fertig

**Problem**

- Sprint 1 lag acht Tage über seinem Ende offen. Unser Plan sah ein Review am 01.10. vor, das nicht stattfand, und ohne Review gab es keinen Anlass abzuschließen
- Auf dem Board sahen drei von acht Issues erledigt aus, obwohl ich 71 Commits habe und alle anderen zusammen 13. Meine größte Arbeit hatte kein Ticket: Repo aufsetzen, Backlog neu fassen, Konventionen festlegen
- #8 kann ich nicht anfangen, weil #43 (Anmeldeverfahren) kein einziges abgehaktes Kriterium hat. Ich würde sonst eventuell doppelt bauen
- Nach einem Neuladen mit F5 standen wieder Werte in den Suchfeldern, obwohl die URL leer war
- Nach einer abgelehnten Reservierung waren Name, E-Mail und Telefon leer, der Kunde hätte alles neu eintippen müssen
- Das Akzeptanzkriterium „barrierefrei nach ISO 9241" in #1 verwies auf eine Checkliste, die es nicht gab
- Die Reservierungen liegen im Arbeitsspeicher, weil das Datenmodell aus #45 noch nicht steht

**Lösung**

- Sprint 1 geschlossen und die Zahlen festgehalten: 16 geplant, 2 fertig, 14 übertragen. Dazu der Befund, dass ein Sprint bei uns 14 Kalendertage hat, aber nur vier Schultage, und die letzten fünf Tage keine Projektzeit haben
- Vier Tickets für erledigte Arbeit nachgetragen, jedes mit Beleg und Datum aus der Git-Historie und mit dem Hinweis, dass es nachgetragen wurde. Dieselbe Logik wie bei #39 bis #41, nach denen die Lehrkräfte selbst gefragt hatten
- Den F5-Fehler mit `autoComplete="off"` behoben. Das war keine Fehlfunktion, sondern eine Hilfe des Browsers: Formularwerte werden beim Neuladen absichtlich wiederhergestellt
- Die Server Action gibt die Eingaben im Fehlerfall zurück, das Formular zeigt sie wieder an. Das Wiederanzeigen ist Darstellung und steht deshalb in der Action, nicht in der Fachlogik
- ADR 0009 geschrieben: drei einschlägige Teile der Norm benannt, Checkliste in sechs Abschnitten, jeder Punkt mit Tastatur, Screenreader oder Kontrastmessung nachweisbar
- ADR 0011 geschrieben: Schnittstelle zwischen Fachlogik und Speicher, zwei Umsetzungen, eine Auswahlstelle. Von Anfang an asynchron, damit das Umstellen kein Umbau wird

**Lessons Learned**

- **Ein Sprintende braucht einen Termin, an dem wir es selbst feststellen**, auch wenn kein Review von außen stattfindet. Sonst läuft die Arbeit weiter und niemand zieht einen Strich
- Unfertige Arbeit geht nach Scrum in den nächsten Sprint. Sie wird nicht gelöscht und nicht als erledigt gezählt
- **Arbeit ohne Ticket ist auf dem Board nicht vorhanden**, egal wie viel sie war. Das trifft Scrum-Master- und Dokumentationsarbeit besonders, weil sie nie aus einer User Story kommt
- Die Richtung der Abhängigkeit entscheidet, ob ein Wechsel ein Umbau ist. Wenn die Fachlogik sagt, **was** sie braucht, und der Speicher sich danach richtet, kostet der Wechsel eine Zeile. Das ist Dependency Inversion, und es ist die Stelle, an der der geforderte objektorientierte Ansatz einen echten Zweck hat
- Eine Schnittstelle muss **von Anfang an asynchron** sein, auch wenn die erste Umsetzung das nicht braucht. Synchron gebaut müsste beim Wechsel jeder Aufrufer mitgeändert werden, und genau das wollte man vermeiden
- **ISO 9241-110 heißt seit 2020 „Interaktionsprinzipien"** und hat sieben Prinzipien. Die Fassung von 2006 hieß „Grundsätze der Dialoggestaltung", und die Begriffe Lernförderlichkeit, Fehlertoleranz und Individualisierbarkeit gibt es nicht mehr. Wer sie nennt, zitiert eine zurückgezogene Ausgabe
- Eine Norm wird prüfbar, indem man sie **einmal** in eine Liste übersetzt, nicht indem man sie je Item neu auslegt. Die WCAG-Erfolgskriterien sind dafür der Aufhänger, weil sie enger und messbar formuliert sind
- Ein Fehler, der nach einem Neuladen auftritt, ist oft keiner: Browser helfen und stellen Formularwerte wieder her. Wer den Zustand in die URL legt, muss ihnen das abgewöhnen
- Software prüfen heißt, auch die unangenehmen Fälle auszulösen. Den Fehler mit den verlorenen Eingaben habe ich nur gefunden, weil ich eine Ablehnung absichtlich erzeugt habe

---

## 2026-10-01 · Donnerstag

**Tätigkeit**

- Board gegen den Sprintplan geprüft: Sprint 1 war seit dem 30.09. abgelaufen
- Die offenen Begründungen zu #40 (Client-Technologie) und #41 (Programmiersprache) im Team erarbeitet und in die ADRs eingetragen
- Styling-Entscheidung getroffen: **Tailwind CSS**, dazu Design-Tokens in `app/globals.css` und „nur lokaler Zustand" festgelegt
- Issue #55 für die Debian-Begründung angelegt und Laurin zugewiesen, weil er die Analyse gemacht hat und den Server einrichtet
- Commit-Typ `chore` in `CONTRIBUTING.md` aufgenommen
- Next.js-Projekt mit TypeScript, Tailwind und App Router angelegt
- Vier Pull Requests nach `staging` gemergt und dabei zwei Konflikte aufgelöst
- Nico Rückmeldung zur Doku-Ablage gegeben

**Problem**

- Als Begründung für React hatte ich „geringere Lernkurve" genannt. Das Kriterium in unserer Tabelle heißt **Lernzuwachs**, und dort gewinnt Angular mit 5 gegen 4
- Für TypeScript hatte ich Typsicherheit und Objektorientierung angeführt. Bei **beiden verliert TypeScript gegen C#** (4 gegen 5), und beide sind die höchstgewichteten Kriterien der Tabelle
- Beim Auflösen von zwei Merge-Konflikten sind zwei Stellen auf den Stand vor dem 25.09. zurückgefallen: in `TECHSTACK.md` stand beim Betriebssystem wieder 540, im ADR-Index wieder „die Abweichung ist noch nicht begründet"
- Nico hatte die Referenzarchitektur in der `README.md` verändert (caddy ergänzt, Container-Liste verkürzt) und in ADR 0002 eine Entscheidung behauptet, die noch nicht gefallen ist („#12 ist entschieden")
- Für das Projektgerüst passte keiner unserer vier Commit-Typen

**Lösung**

- Beide Argumentationen durch die tragfähigen ersetzt: bei React die **eigene Serverschicht** (trägt 0,60 der 0,75 Abstand) und die **Anlaufzeit** (0,30), bei TypeScript die **Web-Eignung**, weil C# und C++ dort je einen Punkt bekommen
- In ADR 0004 eine Warnung eingebaut, die Lernzuwachs und Lernkurve auseinanderhält, damit der Fehler nicht zurückkommt
- In beiden ADRs den Abstand Kriterium für Kriterium aufgeschlüsselt und festgehalten, wo die eigene Wahl verliert
- Die Rückschritte in `TECHSTACK.md` und im ADR-Index repariert
- Nico die Ablageregeln weitergegeben, er bessert selbst nach. Wir prüfen in den Tagen danach
- `chore` als fünften Commit-Typ aufgenommen, mit Tabelle und einem Absatz dazu, wann eine `Co-Authored-By`-Zeile gesetzt wird und wann nicht

**Lessons Learned**

- **Ein Argument muss zur eigenen Tabelle passen.** Zweimal am selben Tag hatte ich Kriterien als Begründung genannt, bei denen unsere Wahl verliert. Das wäre im Fachgespräch die erste Rückfrage gewesen
- Der Abstand zwischen zwei Optionen lässt sich als Gewicht mal Bewertungsdifferenz **Kriterium für Kriterium aufschlüsseln**. Erst danach weiß man, worauf die Entscheidung wirklich steht. Bei React sind es zwei von sieben Kriterien
- **Lernzuwachs ist nicht Lernkurve.** Ein hoher Lernzuwachs ist nach der Aufgabenstellung erwünscht, weil wir Technologien nutzen sollen, die wir noch nicht gut können
- Eine Nutzwertanalyse kann rechnerisch stimmen und trotzdem falsch begründet werden. Die Zahlen prüfen reicht nicht, die Begründung muss zu ihnen passen
- Beim Auflösen eines Merge-Konflikts muss man prüfen, **welche Seite neuer ist**. Beide Rückschritte standen drei Zeilen neben ihrem eigenen Widerspruch
- Ablage: die `README.md` beschreibt das Projekt und die Vorgabe, `docs/TECHSTACK.md` unsere Entscheidungen, die ADRs begründen sie. Wer über die eigene Wahl schreibt und in der README landet, ist in der falschen Datei
- **Zitate aus der Aufgabenstellung darf man nicht verbessern.** Ein Abschnitt, der die Vorlage der Lehrkräfte wiedergibt, muss sie wiedergeben, auch wenn uns eine Option fehlt. Zusätzliche Kandidaten gehören in den eigenen ADR
- Tailwind bewusst gewählt, obwohl CSS für mich der einfachere Weg wäre. Die Aufgabenstellung verlangt Unbekanntes, und wenn sich Tailwind hier als falsche Wahl erweist, ist genau das ein vorzeigbares Ergebnis

---

## 2026-09-25 · Freitag

**Tätigkeit**

- Git-Arbeitsweise mit dem Team festgelegt und in `CONTRIBUTING.md` eingetragen: Feature-Branch von `staging`, Pull Request zurück nach `staging`
- Die offenen Entscheidungen #39, #40 und #41 im Team durchgesprochen und moderiert
- Nutzwertanalyse zur Programmiersprache korrigiert und neu gerechnet
- ADR 0001 zur Linux-Distribution abgeschlossen: Entscheidung, Begründung der Abweichung, Konsequenzen
- Zwei Annahmen der Linux-Analyse gegen externe Quellen geprüft
- Ordner `docs/ki/prompts` für den Nachweis der KI-Nutzung angelegt (#48)
- Zehn nachgetragene Tickets #39 bis #48 aufs Board gehängt und die Felder gesetzt
- #39 geschlossen und auf `Done`, #45 mir zugewiesen, #42 an Nico, #43 an Laurin

**Problem**

- In der Nutzwertanalyse zur Sprache summierten die Gewichte auf 1,10 statt 1,00, dadurch lagen Nutzwerte über der Skalenobergrenze
- JavaScript hatte bei „Typen aus dem Datenbankschema ableitbar" die Höchstpunktzahl, obwohl es Typen gar nicht kennt. Genau dieser Posten hob es auf Platz 2
- Unsere Begründung für Debian stützte sich auf Vorkenntnisse im Team. Die eigene Tabelle bewertete Ubuntu bei genau diesem Kriterium aber besser
- Die Nutzwertanalyse gewinnt Ubuntu 26.04, entschieden ist Debian 13, und der Server läuft bereits darauf
- Der wörtliche Chatverlauf mit der KI enthält Arbeitsnotizen über die Lehrkräfte. Das Repository ist öffentlich
- Seit dieser Woche arbeiten vier weitere Personen am selben Repository, vorher nur ich

**Lösung**

- Gewicht von „Passt zur Client-Technologie" von 0,20 auf 0,10 gesenkt, weil es sich inhaltlich mit „Eignung für Weboberflächen" überschneidet. Summe jetzt 1,00
- JavaScript bekommt bei den Typen 1 Punkt statt 5. Erwogen war 0, verworfen, weil die Skala bei 1 beginnt. Neue Rangfolge: TypeScript 4,45, C# 3,70, JavaScript 3,25, C++ 2,80
- Die Bewertung „Vorkenntnisse im Team" war vertauscht und ist korrigiert. Die Entscheidung für Debian steht jetzt auf zwei Gründen: wir kennen Debian besser, und ein Wechsel würde Sprintzeit kosten, die gegen den Abgabetermin nicht da ist
- Ins ADR einen Abschnitt geschrieben, **was die Begründung nicht behauptet**: Debian gewinnt kein einziges Kriterium der Tabelle
- Zwei Annahmen extern geprüft, beide bestätigt: STRATO bietet Ubuntu 26.04 nur für eine Serverklasse, Debian 13 breiter. Ubuntu ist auf Webservern tatsächlich verbreiteter als Debian (15,1 % gegen 5,8 %)
- Prompts werden sinngemäß und geordnet dokumentiert, nicht wörtlich. Die Rohprotokolle bleiben lokal und sind auf Nachfrage vorzeigbar
- Branch-Regeln und die Pflicht, vor jedem Abzweigen zu fetchen, in `CONTRIBUTING.md` festgeschrieben

**Lessons Learned**

- Eine Gewichtung nachträglich zu verschieben, bis das gewünschte Ergebnis herauskommt, ist der auffälligste Fehler in einer Nutzwertanalyse. Damit Debian allein über „Vorkenntnisse" gewinnt, hätte das Kriterium von 5 auf 45 Punkte steigen müssen und wäre damit das schwerste von allen geworden. Das hält keiner Rückfrage stand
- Ein Argument muss zur eigenen Tabelle passen. Steht dort das Gegenteil, ist entweder das Argument falsch oder die Bewertung. Bei uns war es die Bewertung
- Von der Rangfolge abzuweichen ist erlaubt, muss aber **als Abweichung** dastehen und nicht als Rechenergebnis getarnt werden
- Aufzuschreiben, was die eigene Begründung **nicht** behauptet, nimmt der ersten Rückfrage im Review die Spitze
- Annahmen in einer Nutzwertanalyse lassen sich nachprüfen. Beide Prüfungen haben unsere Zahlen bestätigt, und ein geprüfter Wert trägt weiter als ein ungeprüfter
- Eine Skala von 1 bis 5 hat keine 0. Was eine Option grundsätzlich nicht erfüllen kann, bekommt den kleinsten Wert der Skala, nicht einen Wert außerhalb
- Nachweis der KI-Nutzung heißt nachvollziehbare Dokumentation, nicht Mitschnitt. Was in ein öffentliches Repository kommt, entscheidet man bewusst
- Sobald mehr als eine Person am Repository arbeitet, gehört vor jede Änderung ein `git fetch`. Sonst zweigt man von einem alten Stand ab und baut sich den Konflikt selbst

---

## 2026-09-24 · Donnerstag

**Tätigkeit**

- README überarbeitet nach dem ersten Gespräch mit den Lehrkräften
- Technologie-Stack als eigene Übersicht sichtbar gemacht (`docs/TECHSTACK.md`): was entschieden ist, womit begründet, was noch offen ist
- Aufgabenstellung, Projektregeln und Lerntagebuch-Vorlage ins Repo aufgenommen
- Ticket #4 in #4 und #32 aufgeteilt, weil die Projektregeln genau eine Person je Userstory verlangen
- Lerntagebuch angelegt und die zurückliegenden Schultage nachgetragen
- Oberflächen-Konventionen als Entwurf festgelegt: Styling- und React-Muster mit Begründung
- Bündelungsfach-Abdeckung über alle 20 Items ausgezählt
- Backlog darauf geprüft, zu welchen Themen noch gar kein Issue existiert
- Zehn Tickets angelegt (#39 bis #48) und aufs Board gehängt
- Branch-Schutz auf `main` nachgemessen und die Doku richtiggestellt

**Problem**

- Im Gespräch wurde gesagt, T-Shirt-Größen seien nach Scrum dasselbe wie Story Points
- #4 hatte zwei Personen zugewiesen, die Projektregeln verlangen genau eine je Userstory
- Die Lehrkräfte wollen im Review nach den verwendeten React- und Styling-Mustern fragen. Wer die beim Programmieren nebenbei wählt, kann sie hinterher nicht begründen
- Im Backlog gibt es nur ein Item im Bündelungsfach GID
- Die Projektregeln verlangen das Logbuch als Word-Datei in Loop, nicht als Markdown in Git
- Für drei bereits gefallene Entscheidungen (Linux-Distribution, Client-Technologie, Programmiersprache) gab es kein Issue. Die Lehrkräfte hatten zu Recht gefragt, was man denn auf `Done` schieben könne
- In der Doku stand, direkter Push auf `main` sei geblockt. Das stimmt nicht
- Sechs fachliche Themen der Aufgabenstellung kommen im Backlog gar nicht vor: Abrechnung, Shop, Marketing, DSGVO, Bestellhistorie und wartungsrelevante Bauteile
- Für die Datenmodell-Arbeit gab es immer noch kein Ticket, obwohl sie sieben andere Items blockiert

**Lösung**

- #4 in zwei gleichlautende Tickets aufgeteilt, mit Anleitung zur Absprache: beide streichen durch, was der andere übernimmt
- Die Regeln aus den Projektregeln im Repo festgehalten, damit sie nicht wieder untergehen
- Oberflächen-Konventionen **vor** dem Programmieren festgelegt, mit einem Abschnitt „Fragen, die im Review kommen" samt Verweis auf die Antwort
- GID-Abdeckung und die Loop-Frage beim nächsten Termin ansprechen. Vermutlich klärt sich GID von selbst, sobald die fehlenden Userstories zu Abrechnung, Shop und Marketing geschrieben sind. Dort liegen die kaufmännischen Themen
- Zehn Tickets angelegt: sechs Entscheidungen (#39 bis #44) und vier eigene Arbeitspakete (#45 bis #48). Bei den drei schon gefallenen Entscheidungen steht im Ticket, wann die Entscheidung fiel und dass der ADR vorliegt
- Branch-Schutz praktisch geprüft statt nur behauptet: PR mit einer Freigabe ist gesetzt, `enforce_admins` ist aus. Als Admin geht ein direkter Push durch, GitHub meldet dabei `Bypassed rule violations`
- CONTRIBUTING.md um eine Tabelle ergänzt, die Regel für Regel zeigt, was gilt und für wen. Wie wir tatsächlich mit Git arbeiten, legen wir am 25.09. im Team fest
- Die sechs fachlichen Stories bewusst **nicht** angelegt. Das sind User Stories, die schreibt das Team, und sie hängen an der GID-Frage

**Lessons Learned**

- Scrum schreibt **kein** Schätzverfahren vor. Der Scrum Guide nennt nur das Attribut „size" und sagt, dass die Developers schätzen. Insofern sind T-Shirt-Größen und Story Points gleichermaßen „nach Scrum"
- **Aber:** die T-Shirt-Größen der Aufgabenstellung sind in Stunden definiert (XS 1-2, S 4, M 8, L 16, XL über 16). Damit sind sie eine absolute Zeitschätzung. Story Points sind ausdrücklich keine Zeit, sondern relative Größe aus Komplexität, Aufwand und Unsicherheit
- Story Points sind addierbar und ergeben Velocity. `S + M + L` hat keine Summe. Wer mit T-Shirt-Größen prognostizieren will, muss sie erst in Zahlen übersetzen
- Die Skala 1, 2, 3, 5, 8, 13 trägt Unsicherheit: die Abstände werden absichtlich größer, weil große Aufgaben sich nicht genau schätzen lassen. `L = 16 h` ist genau das Doppelte von `M = 8 h` und behauptet damit eine Genauigkeit, die es nicht gibt
- Der eigentliche Einwand ist nicht die Einheit, sondern **wer geschätzt hat**: die T-Shirt-Größen kommen von den Lehrkräften, nach Scrum schätzen die Developers, die die Arbeit machen
- Projektregeln genau lesen lohnt sich. Mehrere Regeln mit Folgen für Board und Noten waren vorher nicht bekannt
- ADR heißt *Architecture Decision Record*: eine Datei pro Entscheidung mit Kontext, Optionen, Begründung und Konsequenzen. Der Sinn ist, dass Wochen später noch nachvollziehbar ist, **warum** etwas so ist
- Eine Entscheidung ohne Ticket ist auf dem Board unsichtbar und damit nicht bewertbar. Der ADR allein reicht nicht, weil ihn im Review niemand sieht
- Ein Ticket nachträglich anzulegen ist in Ordnung, solange im Text steht, wann die Entscheidung wirklich fiel. Sonst sieht es aus wie rückwärts erfundener Prozess
- Branch-Schutz mit ausgeschaltetem *Include administrators* heißt nicht, dass keine Regel da wäre. Sie gilt für alle außer Admins, und GitHub protokolliert jeden Bypass
- Doku, die einen technischen Zustand behauptet, muss nachgemessen werden. Ein Satz, den niemand geprüft hat, fällt spätestens im Review auf
- Zuerst das, was andere blockiert: das Datenmodell hängt vor #1, #2, #6, #7, #8, #9 und #20

---

## 2026-09-18 · Freitag

**Tätigkeit**

- Nutzwertanalysen zu Framework und Sprache selbst in Excel erstellt, drei Blätter: Framework-Ausschluss, Framework, Sprache
- Ausschlusskriterien **vor** der Bewertung angewendet, statt alles über die Gewichtung zu regeln
- Daraus die Architekturentscheidungen ADR 0004 (Client-Technologie) und ADR 0010 (Programmiersprache)
- Nutzwertanalyse zur Linux-Distribution nach Markdown überführt (ADR 0001)
- Entschieden: Supabase selbst gehostet auf der Strato-VM statt als Cloud-Dienst
- KI-erstelltes Material von der Teamarbeit getrennt

**Problem**

- Eigene Tabelle, Blatt Sprache: die Gewichte summieren auf **1,10 statt 1,00**. Dadurch Nutzwerte über 5 bei einer Skala von 1 bis 5
- JavaScript hatte bei „Typen aus dem Datenbankschema ableitbar" **5 Punkte**, obwohl JavaScript keine Typen hat. Genau dieser Posten hob es auf Platz 2
- Im Blatt Framework-Ausschluss stand „Client-Server-Architektur möglich" zweimal, die zweite Zeile meint vermutlich den objektorientierten Ansatz
- In ADR 0001 gewinnt die Analyse **Ubuntu 26.04 mit 630 Punkten**, entschieden wurde **Debian 13 mit 540**, ohne dass die Abweichung begründet ist

**Lösung**

- Fehler in den ADRs unter „Anmerkungen zur Vorlage" benannt, statt sie stillschweigend zu korrigieren. Die Zahlen bleiben meine
- Normierte Werte gegenübergestellt: TypeScript 4,50 · JavaScript 3,77 · C# 3,45 · C++ 2,64. Die Rangfolge ändert sich durch das Normieren nicht
- Korrektur der Tabelle und die Begründung für Debian sind noch offen

**Lessons Learned**

- Gewichte müssen auf 1,00 summieren, sonst ist der Nutzwert nicht interpretierbar. Ein Wert über der Skalenobergrenze fällt sofort auf
- Ein Kriterium, das eine Option grundsätzlich **nicht erfüllen kann**, bekommt 1 Punkt. Nicht dieselbe Punktzahl wie der Sieger
- „Die höchste Punktzahl allein ist keine Begründung" ist keine Floskel: wer vom Sieger abweicht, muss das schriftlich begründen
- Ausschlusskriterien vor der Bewertung sind stärker als Gewichtung allein. Was eine Pflichtvorgabe reißt, fällt unabhängig von der Punktzahl heraus
- Eine glaubwürdige Nutzwertanalyse ist die, in der die eigene Wahl **nicht** überall vorne liegt. C++ ist bei Typsicherheit und Objektorientierung besser als TypeScript und verliert nur an der Web-Eignung. Das stehen zu lassen trägt weiter, als es glattzubügeln

---

## 2026-09-17 · Donnerstag: Sprint-1-Planning

**Tätigkeit**

- Sprint 1 moderieren
- Sprintlänge auf 2 Wochen und sechs Sprints festgesetzt
- Tech Stack entschieden: React (next.js), typescript, supabase, debian 13
- Prioritäten, Zuweisungen und erste Schätzungen auf dem Board gesetzt
- ERD im Team besprochen
- Kapazität gerechnet: viert Schultage je Sprint
- 13 Oberflächen Entwürfe #1, #2, #8
- ISO-9241-Bbezug in #1 zurückgeschrieben

**Problem**

- 2 Wöchige Sprint hat nur 4 Schultage und einer geht für Review, Retor und Planning drauf
- Das Kriterium "Barrierefrei gemäß ISO 9241" ist nicht prüfbar, war aber durch zwei konkrete Kriterien ersetzt worden
- Für die Arbeit am Datenmodell gibt es kein Ticket

**Lösung**

- Kapazität mit den echten Schulzeiten gerechnet statt geschätzt
- Normbezug wieder in #1 aufgenommen, zeigt jetzt auf eine noch zu erstllende Barrierefreiheits-Checkliste. Die Zwei konkreten Kriterien daneben stehen
- Datenmodel Ticket noch offen

**Lessons Learned**

- Was der Scrum Master macht und was nicht: ***moderieren, nicht verteilen*** 

- Ein nicht prüfbares Kriterium darf man nichts ersetzt, wenn es eine Pflichtvorgabe bennent. Prüfbarkeit ***und*** Nachvollziehbarkeit sind beides nötig
- DOM und ARIA: Hilfstechnik liest den Dokumentenbaum, nicht den Bildschirm

---

## 2026-09-11 · Freitag: Projektstart

**Tätigkeit**

- Repository aufgesetz
- Git Hub Board
- 15 User Storys angehangen
- Backlog gegen Scrum Guids
- ERD + Nutzwerkanalyse
- Milestones und Sprints

**Problem**

- Neun der 15 Items waren keine User Storys

**Lösung**

- Die neue technischen Items auf "Task" umgestellt
- Board auf eigenes Schema umgestellt

**Lessons Learned**

- Woran erkennt man, ob etwas eine UserStory ist? Die Rolle im "Als ..." muss das Produkt benutzten, nicht es bauen
- Ein Akzeptanzkriterium muss prüfbar sein
- Änderung an fremden Vorgaben muss man dokumentieren, nicht nur machen

---

## Vorlage zum Kopieren

```markdown
## JJJJ-MM-TT · Wochentag

**Tätigkeit**

**Problem**

**Lösung**

**Lessons Learned**
```
