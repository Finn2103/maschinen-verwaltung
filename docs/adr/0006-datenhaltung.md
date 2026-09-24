# ADR 0006: Datenhaltung und Datenbank-API

- **Status:** Entwurf, Formulierung wird vom Team überschrieben
- **Datum:** 2026-09-18
- **Entschieden von:** Team (Gruppe 11); Nutzwertanalyse aus [#10](https://github.com/Finn2103/maschinen-verwaltung/issues/10)
- **Betrifft:** [#10](https://github.com/Finn2103/maschinen-verwaltung/issues/10) · [#11](https://github.com/Finn2103/maschinen-verwaltung/issues/11) · [#6](https://github.com/Finn2103/maschinen-verwaltung/issues/6) · [#8](https://github.com/Finn2103/maschinen-verwaltung/issues/8)
- **Ersetzt:** ADR 0007 (Cloud oder selbst gehostet), die Frage ist hier mitentschieden

## Kontext

Die Pflichtliste verlangt eine **Datenbank-API**: der Client spricht nicht mit der Datenbank,
sondern über eine Schnittstelle. Und sie verbietet **Software, die die Datenbank implizit
erzeugt**, das Schema wird von Hand als SQL-DDL geschrieben und versioniert.

### Eine Unterscheidung, die wir zuerst klären mussten

In der Diskussion zu #10 standen „Oracle", „Supabase" und „PocketBase" nebeneinander. Das
sind aber keine gleichartigen Dinge:

- **Oracle** ist ein Datenbanksystem. Die Datenbank-API wäre zusätzlich aufzusetzen.
- **Supabase** ist ein Paket **um PostgreSQL herum**: Datenbank, Datenbank-API (PostgREST),
  Anmeldung, Dateiablage. Wer Supabase wählt, wählt PostgreSQL mit.
- **PocketBase** ist ein Paket um SQLite herum, mit eigener Schnittstelle.

Verglichen werden deshalb **vollständige Antworten auf „Datenhaltung plus Datenbank-API"**,
nicht Datenbanksysteme allein. Das ist der Punkt, an dem die Analyse in #10 nachgeschärft
wurde.

### Betrieb

Alles läuft auf **der eigenen Strato-VM**, nicht in einer fremden Cloud. Gründe:

1. Uns wurde eine VM zugewiesen, damit jedes Team seine Umgebung selbst betreibt.
2. Rechnung, Zahlung und Umsatzsteuer sind steuerrelevant. Bei eigener Hardware entfällt
   die Frage, wo die Daten liegen und wer darauf zugreift.
3. Infrastructure as Code ist Pflicht, die Umgebung muss sich zerstören und neu aufbauen
   lassen. Bei einem Fremddienst gilt das nur für die Hälfte.

## Optionen

1. **Supabase, selbst gehostet**, PostgreSQL mit PostgREST, Anmeldung, Dateiablage
2. **Oracle Database**, Datenbanksystem, Datenbank-API über Oracle REST Data Services
3. **PocketBase**, SQLite mit eigener Schnittstelle, eine ausführbare Datei

## Ausschlusskriterien aus der Pflichtliste

| Ausschlusskriterium | Supabase | Oracle | PocketBase |
| --- | --- | --- | --- |
| Über eine Datenbank-API ansprechbar | ja, PostgREST | ja, zusätzlich aufzusetzen | ja |
| Schema bleibt handgeschriebenes SQL-DDL | ja, bei Disziplin | ja | **fraglich** |
| Containerisierbar und per Infrastructure as Code aufsetzbar | ja | ja, ressourcenhungrig | ja |
| Nach IT-Grundschutz absicherbar | ja | ja | ja |
| Auf der eigenen VM betreibbar | ja | ja, Lizenz prüfen | ja |

**Zu PocketBase:** Das Schema wird von PocketBase selbst verwaltet, nicht als freies
SQL-DDL. Damit steht es im Konflikt mit der Pflichtvorgabe „kein implizit erzeugtes Schema".
Das ist der schwerwiegendste Punkt der ganzen Analyse, **vor einem endgültigen Ausschluss
am laufenden System prüfen**, nicht nach Aktenlage entscheiden.

**Zu Oracle:** Lizenzfrei nur in der kostenlosen Ausgabe, und die ist bei Prozessorkernen,
Arbeitsspeicher und Datenvolumen begrenzt. Die genauen Grenzen **müssen geprüft werden**,
bevor man sich darauf verlässt, hier steht keine Zahl, die wir nicht selbst nachgesehen
haben.

## Nutzwertanalyse

Punkte 1 (ungeeignet) bis 5 (sehr gut geeignet). Nutzwert = Summe aus Gewicht × Punkte.

| Kriterium | Warum dieses Kriterium | Gewicht | Supabase | Oracle | PocketBase |
| --- | --- | --- | --- | --- | --- |
| Datenbank-API ohne Eigenbau | Pflicht, und die Zeit ist knapp. Eine selbst gebaute Schnittstelle ist ein eigenes Projekt. | 0,20 | 5 | 3 | 5 |
| Schema bleibt handgeschriebenes SQL-DDL | Pflicht, und die Vorgabe, gegen die am leichtesten aus Versehen verstoßen wird. | 0,20 | 4 | 5 | 1 |
| Betrieb auf einer VM mit begrenzten Ressourcen | Eine VM trägt den ganzen Stack: Proxy, Anwendung, Datenbank, Mailserver. | 0,15 | 3 | 1 | 5 |
| Eignung für steuerrelevante Daten | UStG und GoBD: Transaktionen, fortlaufende Nummern, keine stille Änderung. | 0,15 | 5 | 5 | 2 |
| Lernzuwachs im Team | Vorgabe des Bildungsgangs. | 0,10 | 5 | 5 | 4 |
| Lizenz- und Kostenfreiheit | Schulprojekt ohne Budget. | 0,10 | 5 | 2 | 5 |
| Dokumentation und Verbreitung | Hilfe bei Problemen, vier Systemintegrationen am Aufbau. | 0,10 | 4 | 4 | 2 |
| **Nutzwert** | | **1,00** | **4,40** | **3,60** | **3,35** |

## Entscheidung

**Supabase, selbst gehostet auf der Strato-VM.**

Supabase liefert die von der Pflichtliste geforderte **Datenbank-API, ohne dass wir sie
bauen müssen**, und zwar auf PostgreSQL, das für steuerrelevante Daten ohne Einschränkung
taugt. Beides zusammen bekommt keine der Alternativen hin.

**Oracle gewinnt das wichtigste Einzelkriterium**: klassisches SQL-DDL, ohne Werkzeug, das
einem das Schema abnimmt. Es scheitert am Ressourcenbedarf auf einer geteilten VM und an der
Lizenzfrage. Die Datenbank-API wäre zusätzlich aufzusetzen, Arbeit, die niemand frei hat.

**PocketBase gewinnt beim Ressourcenbedarf** und ist mit einer ausführbaren Datei in Minuten
betriebsbereit. Es fällt an der Schemaverwaltung und daran, dass SQLite für die
steuerrelevanten Anforderungen die schwächste Wahl ist.

Der Abstand zwischen Oracle (3,60) und PocketBase (3,35) ist klein. **Die Punktzahl allein
entscheidet hier nicht**, beide scheitern an je einem Punkt, der sich nicht durch andere
Stärken ausgleichen lässt.

## Die Falle, die wir schriftlich festhalten

Supabase bringt eine Verwaltungsoberfläche mit, in der man **Tabellen zusammenklicken**
kann. Genau das wäre ein Verstoß gegen „kein implizit erzeugtes Schema", und es ist der
bequemste Weg, der sich anbietet.

**Teamregel:** Das Schema entsteht ausschließlich als SQL-DDL-Datei im Repository. Die
Verwaltungsoberfläche wird zum **Ansehen** benutzt, nicht zum Ändern. Wer eine Änderung
braucht, schreibt sie in die DDL und spielt sie ein.

Das ist keine Formalie: es ist die eine Pflichtvorgabe, gegen die man verstoßen kann, ohne
es zu merken, weil die Anwendung danach funktioniert.

## Lernzuwachs

Hier ist der Lernanteil am größten, und zwar für alle fünf im Team:

- **Einen Dienstverbund selbst betreiben.** Supabase selbst zu hosten heißt rund zehn
  Container: Datenbank, API-Gateway, Anmeldung, Datenbank-API, Dateiablage, Ereignisdienst.
  Zu verstehen, wer davon was macht und wie sie zusammenhängen, ist deutlich mehr, als eine
  Cloud-Oberfläche zu bedienen.
- **Rechteprüfung in der Datenbank.** PostgreSQL kann Zugriffsrechte auf Zeilenebene
  durchsetzen. Für #8 heißt das: die Prüfung „ein Kunde sieht nur eigene Vorgänge" kann
  zusätzlich in der Datenbank liegen, nicht nur in der Anwendung. Das ist für alle neu und
  fachlich das Interessanteste am ganzen Thema.
- **Schema von Hand führen.** Versionierte Migrationen ohne Werkzeug, das sie erzeugt, 
  inklusive der Frage, wie man eine Änderung einspielt, ohne Daten zu verlieren.
- **Sicherung und Wiederherstellung** eines selbst betriebenen PostgreSQL. Und den Restore
  **einmal wirklich durchführen**, nicht nur einrichten, so steht es in #11.

## Konsequenzen

- ADR 0007 (Cloud oder selbst gehostet) ist damit beantwortet und entfällt.
- Der Ressourcenbedarf auf der VM ist der Preis dieser Entscheidung. Vor #11 sollte
  geprüft werden, ob Arbeitsspeicher und Plattenplatz für den vollen Verbund reichen, 
  sonst müssen einzelne Dienste entfallen, etwa der Ereignisdienst.
- Die Teamregel zur Verwaltungsoberfläche gehört in die Definition of Done, sonst wird sie
  vergessen.
- Der Ereignisdienst und die Dateiablage von Supabase werden in Sprint 1 nicht gebraucht.
  Sie werden erst aufgesetzt, wenn ein Item sie fordert.
