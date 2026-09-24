# Arbeitsweise

Scrum nach Lehrbuch. Lehrkräfte sind Product Owner, wir sind das
Entwicklungsteam. Scrum Master: Finn2103.

## Board

Ein Board für das ganze Team: [Maschinenverwaltung-IHK](https://github.com/users/Finn2103/projects/32).
Zwei Sichten: **Planner** (Tabelle, Planung) und **Board** (Kanban, laufender Sprint).

Jedes Item trägt diese Felder:

| Feld | Werte | Bedeutung |
| --- | --- | --- |
| `Status` | Backlog · Next · Todo · In Progress · Testing · On Hold · Done | Wo das Item gerade steht |
| `work-type` | Epic · User Story · Task · Bug | Art der Arbeit |
| `prio` | P0 … P4 | P0 blockiert, P1 im Abgabe-Scope, P2 danach, P3 ohne Termin, P4 zurückgestellt |
| `story-points` | 1 · 2 · 3 · 5 · 8 · 13 | Schätzung aus dem Planning. Über 13 → Item aufteilen |
| `domain` | general · verleih · katalog · abrechnung · maintenance · shop · infra · migration | Fachlicher Schnitt |
| `plan-depth` | none · light · standard · deep | Wie ausführlich vor dem Coden geplant wird |
| `gate` | main · light · nightly · none | Welches Test-Gate das Item absichern muss |
| `Milestone` | Sprint 1 … n | Sprint-Zuordnung |

### Status-Fluss

`Backlog` → `Next` (für den nächsten Sprint vorgemerkt) → `Todo` (im Sprint,
noch nicht begonnen) → `In Progress` → `Testing` (PR offen, Review/Abnahme) →
`Done`. `On Hold` nur mit Begründung im Issue.

### Rollen und Item-Arten

- **User Story**: Anwendungsentwicklung und Datenanalyse. Aus Nutzersicht, mit Akzeptanzkriterien.
- **Task**: Systemintegration und Datenverarbeitung. Technische Arbeit ohne eigenes Nutzerverhalten.
- **Epic**: Klammer über mehrere Stories/Tasks. Label `epic`, Sub-Issues verknüpfen.

Jedes Item braucht **Akzeptanzkriterien**. Das ist Vorgabe der Lehrkräfte.

## Issues

Über die Templates anlegen (`.github/ISSUE_TEMPLATE`). Kein Item ohne Epic-Bezug,
kein Sprint-Item ohne `story-points` und `prio`.

## Branches und PRs

Gearbeitet wird auf Branches, nicht direkt auf `main`.

```
feat/<issue-nr>-kurzbeschreibung     neue Funktion
fix/<issue-nr>-kurzbeschreibung      Fehlerbehebung
infra/<issue-nr>-kurzbeschreibung    Server, Container, Netz, IaC
docs/<issue-nr>-kurzbeschreibung     Dokumentation, UML, ADR
```

Ein PR pro Issue. Im PR-Text `Closes #<issue-nr>`. Das Issue schließt der PR. Den
Status auf `Done` setzt, wer die Abnahme gemacht hat.

### Was davon technisch erzwungen ist

Damit hier nichts Falsches steht, der tatsächliche Stand des Branch-Schutzes auf `main`:

| Regel | gesetzt | gilt für Admins |
| --- | --- | --- |
| Pull Request mit **einer Freigabe** nötig | ja | **nein** |
| Offene Kommentare müssen aufgelöst sein | ja | **nein** |
| Force-Push auf `main` | gesperrt | gesperrt |
| Löschen von `main` | gesperrt | gesperrt |

`enforce_admins` ist **aus**. Repository-Admin ist derzeit nur der Scrum Master
([@Finn2103](https://github.com/Finn2103)); alle anderen haben Schreibrechte. Für alle
außer dem Admin ist die Review-Pflicht damit wirklich bindend. Der Admin kann ohne PR
auf `main` mergen.

Am 24.09.2026 nachgemessen: ein `git push origin main` als Admin geht durch, GitHub meldet
dabei `Bypassed rule violations for refs/heads/main`. Ein Merge ohne Freigabe geht über
`gh pr merge --admin`. Beides wird von GitHub protokolliert.

Das ist Absicht: in der Aufbauphase muss eine Person durchgreifen können, ohne auf eine
Freigabe zu warten. **Wer den Bypass nutzt, hält es fest**, in der Commit-Message oder im
Lerntagebuch. Ein Bypass, den niemand sieht, ist ein umgangener Prozess; ein
dokumentierter ist eine Entscheidung.

### Was noch Absprache ist, nicht Regel

Wie das Team mit Git arbeitet, wird am **Fr, 25.09.2026** gemeinsam festgelegt und danach
hier eingetragen. Die meisten im Team arbeiten zum ersten Mal mit Git. Offen sind:

- Wer reviewt wen, und wie lange darf ein PR offen liegen?
- Ist bei reinen Doku-Änderungen ein direkter Push in Ordnung?
- Bleibt der Admin-Bypass, oder wird `enforce_admins` eingeschaltet?

Bis dahin sind die Branch- und Commit-Namen oben **Empfehlung**, das Verfahren oben
**gesetzt**. Was beschlossen wird, kommt in
[`docs/scrum/entscheidungen.md`](docs/scrum/entscheidungen.md).

## Commits

Conventional Commits, auf Deutsch oder Englisch, aber einheitlich pro Commit:

```
feat(verleih): Reservierung mit Zeitraumprüfung
fix(abrechnung): Rundung der Umsatzsteuer auf Positionsebene
infra(proxy): Traefik mit Let's Encrypt
docs(datenmodell): ERD in Chen-Notation, erster Entwurf
```

## Datenbank

Das Schema wird **explizit** als SQL-DDL geschrieben und versioniert
(`docs/datenmodell`, später Migrationen). Werkzeuge, die die Datenbank implizit
aus Code erzeugen, sind laut Vorgabe nicht zulässig, also kein Auto-Migrate,
kein Schema-aus-ORM.
