# Tests Monitoring (#14)

> Getestet am 06.11.2026 auf einer VMPal-VM auf meinem MacBook.

| | |
| --- | --- |
| Testlauf | 06.11.2026 15:30 bis 15:39 (dazu Test 22 Neustart um 15:42) |
| System | Debian GNU/Linux 13 (trixie), aarch64, 2 Kerne, 3917 MB RAM |
| Docker | 26.1.5+dfsg1 |
| Datenbank | `postgres:17-alpine` (PostgreSQL, wie in Supabase) |
| Mailserver | `mailserver/docker-mailserver:latest` v17.0.0 (docker-mailserver, ADR 0005) |
| Monitoring | monitor 2.0.0, eine Datei `/usr/local/bin/monitor` (1413 Zeilen), ohne Zugangsdaten |
| Meldungen | 108 beim Test-Empfänger angekommen (statt Discord ein lokaler Empfänger, der die Grenzen von Discord prüft) |
| Ergebnis | **128 bestanden, 0 fehlgeschlagen** (Tests 01 bis 21 mit `vm-test.sh`), dazu Test 22 von Hand: 4 bestanden |

Jeder Test hat eine eigene Datei mit der Anforderung, den Befehlen mit Original-Ausgabe, dem
Server-Log (`journalctl -u monitor`) und den angekommenen Meldungen im Original.

| Test | bestanden | fehlgeschlagen |
| --- | --- | --- |
| [01 · Installation und Einrichtung als Code](01-installation.md) | 8 | 0 |
| [02 · Übersicht: Verfügbarkeit, Auslastung und Fehler beider Dienste](02-uebersicht.md) | 13 | 0 |
| [03 · Alle Container-Zustände](03-container-zustaende.md) | 21 | 0 |
| [04 · Ohne Passwörter: Ports werden automatisch erkannt](04-ohne-passwoerter.md) | 9 | 0 |
| [05 · Fall 1a: Datenbank nicht erreichbar](05-datenbank-aus.md) | 6 | 0 |
| [06 · Fall 1b: Mailserver nicht erreichbar](06-mailserver-aus.md) | 9 | 0 |
| [07 · Fall 1c: systemd-Dienst ausgefallen](07-systemd-dienst-aus.md) | 2 | 0 |
| [08 · Fall 1d: Schnittstelle antwortet falsch](08-api-falsch.md) | 3 | 0 |
| [09 · Fall 2a: Speicher voll (Platte)](09-platte-voll.md) | 5 | 0 |
| [10 · Fall 2b: Speicher voll (Arbeitsspeicher)](10-ram-voll.md) | 5 | 0 |
| [11 · Fall 1e: Dienst im laufenden Container ausgefallen (Postfix)](11-postfix-aus.md) | 4 | 0 |
| [12 · Docker fällt aus](12-docker-aus.md) | 6 | 0 |
| [13 · Spam-Schutz bei Neustarts und Flattern](13-spam-schutz.md) | 3 | 0 |
| [14 · Parallele Prüfung](14-parallel.md) | 2 | 0 |
| [15 · Regelmäßiger Bericht an Discord und JSON](15-bericht.md) | 5 | 0 |
| [16 · Kein Schreiben auf die Platte](16-nur-ram.md) | 3 | 0 |
| [17 · Nutzung durch andere Software](17-andere-software.md) | 4 | 0 |
| [18 · Stufen INFO, WARNING, ERROR, CRITICAL im Journal](18-prioritaeten.md) | 2 | 0 |
| [19 · Ressourcenbedarf und Angriffsfläche](19-ressourcen.md) | 4 | 0 |
| [20 · Fehlbedienung und Absturz](20-fehlbedienung.md) | 8 | 0 |
| [21 · Neue Container werden automatisch überwacht](21-neue-container.md) | 6 | 0 |
| [22 · Neustart des Servers](22-neustart.md), von Hand | 4 | 0 |

Test 22 lief von Hand, weil ein Neustart das Testskript beenden würde. `vm-test.sh` gehört nur zum Test, nicht zur Abgabe.
