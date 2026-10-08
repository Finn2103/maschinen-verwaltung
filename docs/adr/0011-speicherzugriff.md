# ADR 0011: Speicherzugriff über eine Schnittstelle

- **Status:** **Entschieden** am 08.10.2026
- **Datum:** 2026-10-08
- **Entschieden von:** Finn Jendras (Anwendungsentwicklung)
- **Betrifft:** [#1](https://github.com/Finn2103/maschinen-verwaltung/issues/1) · [#2](https://github.com/Finn2103/maschinen-verwaltung/issues/2) · [#8](https://github.com/Finn2103/maschinen-verwaltung/issues/8) · [#9](https://github.com/Finn2103/maschinen-verwaltung/issues/9) · [#45](https://github.com/Finn2103/maschinen-verwaltung/issues/45)

## Kontext

Die Oberfläche zu #1 wird gebaut, **bevor** das Datenmodell aus #45 abgenommen und das
SQL-DDL geschrieben ist. Es gibt also noch keine Tabellen, in die eine Reservierung
geschrieben werden könnte.

Die Frage, die dabei aufkam und die im Review zu erwarten ist: *„Sie arbeiten ohne
Datenbank. Müssen Sie danach alles umschreiben?"*

Ohne Vorkehrung wäre die Antwort ja. Wenn Komponenten und Fachlogik direkt auf ein Array im
Arbeitsspeicher zugreifen, muss jede dieser Stellen angefasst werden, sobald die Datenbank
kommt.

## Optionen

| Option | Dafür | Dagegen |
| --- | --- | --- |
| **Warten, bis #45 fertig ist** | kein Zwischenstand, kein doppelter Weg | #45 blockiert sieben Items und braucht die Team-Abnahme des ERD. Bis dahin entsteht keine Oberfläche, und der Review am 15.10. hätte keinen Code zu zeigen |
| **Direkt auf den Arbeitsspeicher zugreifen** | am schnellsten geschrieben | Jede aufrufende Stelle kennt die Speicherart. Beim Umstellen ist es ein echter Umbau |
| **Schnittstelle dazwischen** (gewählt) | Die Fachlogik kennt nur einen Vertrag. Das Umstellen ist eine zweite Umsetzung, kein Umbau | Eine Datei und ein Begriff mehr, bevor der erste Nutzen sichtbar ist |

## Entscheidung

**Der Zugriff auf gespeicherte Reservierungen läuft über eine Schnittstelle, die die
Fachlogik vorgibt.**

```ts
export type ReservierungSpeicher = {
  belegungenFuer(inventarnummer: string): Promise<Belegung[]>;
  anlegen(neu: Omit<Reservierung, "id">): Promise<Reservierung>;
};
```

Davon gibt es zwei Umsetzungen und **eine** Stelle, die auswählt:

| Umsetzung | Wann |
| --- | --- |
| `lib/speicher/arbeitsspeicher.ts` | jetzt. Hält ein Array im Serverprozess, beim Neustart leer |
| `lib/speicher/postgres.ts` | nach #45. Spricht über die Datenbank-API mit PostgreSQL |

Das ist **Dependency Inversion**: nicht die Fachlogik richtet sich nach dem Speicher,
sondern der Speicher nach der Fachlogik. Die Schnittstelle gehört zur Domänenschicht, die
Umsetzungen liegen außen.

### Die Methoden sind von Anfang an asynchron

Obwohl ein Array im Arbeitsspeicher kein `Promise` braucht. Das ist der entscheidende
Punkt der Entscheidung, nicht ein Detail.

Eine synchrone Schnittstelle ließe sich später nicht gegen eine Datenbank austauschen, ohne
**jede aufrufende Stelle** von synchron auf asynchron umzuschreiben. Genau das ist der
Umbau, den diese Entscheidung vermeiden soll. Wer die Asynchronität wegstreicht, weil sie
heute unnötig aussieht, macht die Entscheidung wirkungslos.

## Konsequenzen

**Der Arbeitsspeicher ist ein gekennzeichneter Zwischenstand.** Reservierungen sind nach
einem Neustart des Servers weg. Das ist für die Oberflächenarbeit und für den Review
ausreichend, aber es ist kein Zustand, der ausgeliefert wird. Das Akzeptanzkriterium in #1,
*„nach dem Absenden ist die Reservierung gespeichert"*, ist damit **nicht** erfüllt. Es
wird erst mit der zweiten Umsetzung erfüllt.

**Die Schnittstelle schützt nicht gegen Änderungen am Modell.** Wenn das Team bei #45 das
ERD abnimmt und Entitäten oder Feldnamen anders aussehen als der hier benutzte Entwurf,
ändert sich der Typ und alles, was ihn anfasst. Davor schützt keine Schnittstelle. Die
Entitätsnamen sollten deshalb früh festgelegt werden, auch bevor das vollständige ERD
abgenommen ist.

**Die Pflichtvorgabe objektorientierter Ansatz wird hier konkret.** Eine Schnittstelle mit
zwei Umsetzungen ist Polymorphie an einer Stelle, an der sie einen echten Zweck hat, und
nicht als Übungsbeispiel. Das ist im Fachgespräch vorzeigbar.

**Kein Werkzeug darf das Schema erzeugen.** Die Umsetzung für PostgreSQL schreibt von Hand
geschriebenes SQL gegen das Schema aus #45. Ein ORM, das Tabellen aus diesen Typen
ableitet, wäre ein implizit erzeugtes Schema und laut Aufgabenstellung unzulässig. Die
Richtung ist: **Schema zuerst, Typen danach.**

## Die Frage im Fachgespräch

> **„Sie haben ohne Datenbank angefangen. Mussten Sie danach alles umschreiben?"**
>
> Nein. Die Fachlogik kennt nur eine Schnittstelle mit zwei Methoden, nicht die
> Speicherart. Es gibt zwei Umsetzungen davon und eine Stelle, die auswählt. Die
> Schnittstelle war von Anfang an asynchron, damit sich beim Wechsel kein Aufrufer ändert.
>
> Was sich geändert hätte, wären Änderungen am Datenmodell. Dagegen hilft die Schnittstelle
> nicht, deshalb wurden die Entitätsnamen früh festgelegt.
