# 04 · Ohne Passwörter: Ports werden automatisch erkannt

> Getestet am 06.11.2026 um 15:32:00 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** Prompt vom 06.11.: „möglichst keinerlei Passwörter an das Monitoring Skript geben … so dass er das unabhängig hin kriegt“. Dazu ADR 0012: Datenbank prüfen, docker-mailserver über SMTP und IMAP.

**Ablauf:** Die Konfiguration enthält keine Zugangsdaten und keine Ports. monitor liest die veröffentlichten Ports der Container aus der Docker-API und prüft jeden mit dem passenden Protokoll: PostgreSQL-Handshake ohne Anmeldung (wie pg_isready), SMTP- und IMAP-Begrüßung. Zusätzlich die Prüfungstypen postgres, smtp, imap und tcp aus einer Konfiguration, einmal mit monitor check. Im Log der Datenbank darf keine fehlgeschlagene Anmeldung stehen.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# grep -inE 'passw|pgpass|apikey|secret|token' /etc/monitor/monitor.conf || echo 'keine Zugangsdaten in /etc/monitor/monitor.conf'
keine Zugangsdaten in /etc/monitor/monitor.conf
```

```console
root@monitoring-test-debian-13:~# monitor status | grep -E 'STUFE|port/'
STUFE     PRÜFUNG                             ZUSTAND        MELDUNG
INFO      port/db:5432                         pg-ready       db:5432 (postgres): PostgreSQL nimmt Verbindungen an (fordert Anmeldung an), 4 ms
INFO      port/mailserver:143                  imap-ok        mailserver:143 (imap): erreichbar, meldet "* OK [CAPABILITY IMAP4rev1 LOGIN-REFERRALS ID ENABLE IDLE SA", 8 ms
INFO      port/mailserver:25                   smtp-ok        mailserver:25 (smtp): erreichbar, meldet "220-mail.example.test ESMTP", 5 ms
INFO      port/mailserver:587                  smtp-ok        mailserver:587 (smtp): erreichbar, meldet "220 mail.example.test ESMTP", 6 ms
```

```console
root@monitoring-test-debian-13:~# cat /run/monitor/ports.tsv
mailserver	127.0.0.1	143	143	CRITICAL	running
mailserver	127.0.0.1	25	25	CRITICAL	running
mailserver	127.0.0.1	587	587	CRITICAL	running
db	127.0.0.1	5432	5432	CRITICAL	running
```

```console
root@monitoring-test-debian-13:~# cat /root/monitor-test/typen.conf
CHECKS="endpoints"
ENDPOINTS='[
  {"name":"db-handshake","type":"postgres","host":"127.0.0.1","port":5432,"level":"CRITICAL"},
  {"name":"smtp-submission","type":"smtp","port":587},
  {"name":"imap","type":"imap","port":143},
  {"name":"smtp-banner","type":"tcp","port":25,"banner":"^220","send":"QUIT\r\n"},
  {"name":"geschlossen","type":"tcp","port":5433,"level":"WARNING"}
]'
```

```console
root@monitoring-test-debian-13:~# MONITOR_CONF=/root/monitor-test/typen.conf monitor check
Monitor auf monitoring-test-debian-13 · Gesamt: WARNING · Stand vor 0 s · Durchlauf 36 ms
CPU null % · RAM null % · Load null null null (null Kerne) · Uptime null
Container: 0 von 0 laufen · INFO 4 · WARNING 1 · ERROR 0 · CRITICAL 0

STUFE     PRÜFUNG                             ZUSTAND        MELDUNG
WARNING   endpoint/geschlossen                 unreachable    geschlossen: 127.0.0.1:5433 nicht erreichbar (Connection refused)
INFO      endpoint/db-handshake                pg-ready       db-handshake: 127.0.0.1:5432 PostgreSQL nimmt Verbindungen an (fordert Anmeldung an) in 5 ms
INFO      endpoint/imap                        imap-ok        imap: 127.0.0.1:143 erreichbar, meldet "* OK [CAPABILITY IMAP4rev1 LOGIN-REFERRALS ID ENABLE IDLE SA" in 8 ms
INFO      endpoint/smtp-banner                 tcp-ok         smtp-banner: 127.0.0.1:25 erreichbar, meldet "220-mail.example.test ESMTP" in 3 ms
INFO      endpoint/smtp-submission             smtp-ok        smtp-submission: 127.0.0.1:587 erreichbar, meldet "220 mail.example.test ESMTP" in 6 ms
```
_Exit-Code 1 (monitor status und check: 1 WARNING, 2 ERROR, 3 CRITICAL, 4 kein Zustand oder Fehler)_

```console
root@monitoring-test-debian-13:~# docker logs db 2>&1 | tail -n 12
2026-11-06 14:30:59.666 UTC [41] LOG:  database system is shut down
 done
server stopped

PostgreSQL init process complete; ready for start up.

2026-11-06 14:30:59.699 UTC [1] LOG:  starting PostgreSQL 17.11 on aarch64-unknown-linux-musl, compiled by gcc (Alpine 15.2.0) 15.2.0, 64-bit
2026-11-06 14:30:59.699 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2026-11-06 14:30:59.699 UTC [1] LOG:  listening on IPv6 address "::", port 5432
2026-11-06 14:30:59.705 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2026-11-06 14:30:59.714 UTC [55] LOG:  database system was shut down at 2026-11-06 14:30:59 UTC
2026-11-06 14:30:59.718 UTC [1] LOG:  database system is ready to accept connections
```

## Prüfungen

- bestanden: Konfiguration enthält keine Zugangsdaten
- bestanden: Ports von db und mailserver automatisch gefunden (5432, 25, 143, 587)
- bestanden: PostgreSQL ohne Passwort geprüft: Server fordert Anmeldung an
- bestanden: Typ postgres: db-handshake INFO
- bestanden: Typ smtp: Port 587 INFO
- bestanden: Typ imap: Port 143 INFO
- bestanden: Typ tcp mit Banner: Port 25 INFO
- bestanden: Geschlossener Port 5433 wird erkannt (WARNING, Connection refused)
- bestanden: Datenbank-Log: keine fehlgeschlagene Anmeldung durch das Monitoring

## Beobachtungen

- Einziges Geheimnis bleibt die Webhook-Adresse (Ziel der Meldungen). Für Datenbank und Mailserver braucht monitor keine Zugangsdaten.

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:32:00" -o short-iso
-- No entries --
```

## Angekommene Meldungen

In diesem Schritt kam keine Meldung.

