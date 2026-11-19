# 18 · Stufen INFO, WARNING, ERROR, CRITICAL im Journal

> Getestet am 06.11.2026 um 15:38:04 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** Prompt: „Unterschiedliche Prioritäten während auch nice: INFO, WARNING, ERROR und CRTICIAL“.

**Ablauf:** Das Monitoring schreibt Änderungen und Zustellungen mit passender Priorität ins Journal. journalctl -p filtert danach.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since '2026-11-06 15:30:56' -o short-iso -p crit --no-pager
2026-11-06T15:31:39+01:00 monitoring-test-debian-13 monitor[16523]: [CRITICAL] container/oom: oom: vom Kernel beendet, Arbeitsspeicher reichte nicht (OOM) (vorher INFO)
2026-11-06T15:32:09+01:00 monitoring-test-debian-13 monitor[20548]: [CRITICAL] port/db:5432: db:5432 (postgres): nicht erreichbar (Connection refused), 3 ms · Container exited (vorher INFO)
2026-11-06T15:32:14+01:00 monitoring-test-debian-13 monitor[21139]: [CRITICAL] container/db: db: gestoppt (Exit-Code 0), sollte aber laufen (vorher INFO)
2026-11-06T15:32:46+01:00 monitoring-test-debian-13 monitor[25207]: [CRITICAL] port/mailserver:25: mailserver:25 (smtp): nicht erreichbar (Connection refused), 4 ms · Container exited (vorher INFO)
2026-11-06T15:32:46+01:00 monitoring-test-debian-13 monitor[25207]: [CRITICAL] port/mailserver:587: mailserver:587 (smtp): nicht erreichbar (Connection refused), 4 ms · Container exited (vorher INFO)
2026-11-06T15:32:50+01:00 monitoring-test-debian-13 monitor[25812]: [CRITICAL] container/mailserver: mailserver: gestoppt (Exit-Code 137), sollte aber laufen (vorher INFO)
2026-11-06T15:32:50+01:00 monitoring-test-debian-13 monitor[25812]: [CRITICAL] port/mailserver:143: mailserver:143 (imap): nicht erreichbar (Connection refused), 2 ms · Container exited (vorher INFO)
2026-11-06T15:34:25+01:00 monitoring-test-debian-13 monitor[39158]: [CRITICAL] disk//srv/daten: Platte /srv/daten zu 100 % belegt (0 MB frei) (vorher INFO)
2026-11-06T15:35:26+01:00 monitoring-test-debian-13 monitor[47531]: [CRITICAL] port/mailserver:25: mailserver:25 (smtp): verbunden, aber keine Antwort, 3 ms (vorher INFO)
2026-11-06T15:35:26+01:00 monitoring-test-debian-13 monitor[47531]: [CRITICAL] port/mailserver:587: mailserver:587 (smtp): verbunden, aber keine Antwort, 2 ms (vorher INFO)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51134]: [CRITICAL] docker/daemon: Docker-API nicht erreichbar über /var/run/docker.sock (vorher INFO)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51134]: [CRITICAL] port/db:5432: db:5432 (postgres): nicht erreichbar (Connection refused), 2 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf (vorher INFO)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51134]: [CRITICAL] port/mailserver:143: mailserver:143 (imap): nicht erreichbar (Connection refused), 2 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf (vorher INFO)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51134]: [CRITICAL] port/mailserver:25: mailserver:25 (smtp): nicht erreichbar (Connection refused), 2 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf (vorher INFO)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51134]: [CRITICAL] port/mailserver:587: mailserver:587 (smtp): nicht erreichbar (Connection refused), 2 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf (vorher INFO)
2026-11-06T15:36:01+01:00 monitoring-test-debian-13 monitor[51722]: [CRITICAL] service/docker: Dienst docker läuft nicht (inactive) (vorher WARNING)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [CRITICAL] container/oom: oom: vom Kernel beendet, Arbeitsspeicher reichte nicht (OOM) (vorher INFO)
```

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since '2026-11-06 15:30:56' -o short-iso -p warning --no-pager | tail -n 15
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51134]: [CRITICAL] docker/daemon: Docker-API nicht erreichbar über /var/run/docker.sock (vorher INFO)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51134]: [CRITICAL] port/db:5432: db:5432 (postgres): nicht erreichbar (Connection refused), 2 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf (vorher INFO)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51134]: [CRITICAL] port/mailserver:143: mailserver:143 (imap): nicht erreichbar (Connection refused), 2 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf (vorher INFO)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51134]: [CRITICAL] port/mailserver:25: mailserver:25 (smtp): nicht erreichbar (Connection refused), 2 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf (vorher INFO)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51134]: [CRITICAL] port/mailserver:587: mailserver:587 (smtp): nicht erreichbar (Connection refused), 2 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf (vorher INFO)
2026-11-06T15:36:01+01:00 monitoring-test-debian-13 monitor[51722]: [CRITICAL] service/docker: Dienst docker läuft nicht (inactive) (vorher WARNING)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [CRITICAL] container/oom: oom: vom Kernel beendet, Arbeitsspeicher reichte nicht (OOM) (vorher INFO)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [ERROR] container/crashloop: crashloop: Neustart-Schleife: 2 Neustarts, letzter vor 5 s · CPU 0.1 %, RAM 0.4 MB (vorher INFO)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [ERROR] container/job-fehler: job-fehler: beendet mit Fehler, Exit-Code 3 (vorher INFO)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [ERROR] container/pausiert: pausiert: hart beendet (Exit-Code 137, SIGKILL), z. B. durch den OOM-Killer bei einem Unterprozess (vorher INFO)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [ERROR] container/web-starting: web-starting: hart beendet (Exit-Code 137, SIGKILL), z. B. durch den OOM-Killer bei einem Unterprozess (vorher INFO)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [ERROR] container/web-unhealthy: web-unhealthy: Healthcheck meldet unhealthy (4 Fehlversuche in Folge) · CPU 0.7 %, RAM 0.3 MB (vorher INFO)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [WARNING] container/angelegt: angelegt: angelegt, aber nie gestartet (vorher INFO)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [WARNING] container/mailserver: mailserver: läuft, Healthcheck noch nicht bestanden · CPU 0.1 %, RAM 58.2 MB (vorher INFO)
2026-11-06T15:36:26+01:00 monitoring-test-debian-13 monitor[56415]: [ERROR] container/flapper: flapper: Healthcheck meldet unhealthy (5 Fehlversuche in Folge) · CPU 1.1 %, RAM 0.3 MB (vorher INFO)
```

## Prüfungen

- bestanden: Journal enthält CRITICAL-Einträge mit Priorität crit
- bestanden: INFO-Einträge stehen nicht im Filter ab warning

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:38:04" -o short-iso
-- No entries --
```

## Angekommene Meldungen

In diesem Schritt kam keine Meldung.

