# 22 · Neustart des Servers

> Getestet am 06.11.2026 um 15:42:11 auf einer VMPal-VM (Debian 13) auf meinem MacBook.
> Von Hand ausgeführt, nicht mit `vm-test.sh`, weil der Neustart das Testskript beenden würde.

**Anforderung:** Dauerbetrieb aus ADR 0012 („Ein systemd-… startet es“): Das Monitoring muss
nach einem Neustart des Servers von selbst wieder laufen, ohne dass jemand eingreift.

**Ablauf:** Zustand vor dem Neustart festhalten, die VM mit `systemctl reboot` neu starten,
danach prüfen, ob `monitor.service` von selbst läuft, wann es gestartet ist und ob Datenbank
und Mailserver wieder erreichbar gemeldet werden. Der Test-Empfänger für die Webhooks läuft
nach dem Neustart nicht mehr. Deshalb zeigt das Log hier auch, wie eine fehlgeschlagene
Zustellung aussieht.

## Vor dem Neustart

```console
root@monitoring-test-debian-13:~# date
Mon Nov 23 15:42:11 CET 2026
root@monitoring-test-debian-13:~# uptime -s
2026-11-06 15:29:55
root@monitoring-test-debian-13:~# systemctl is-enabled monitor
enabled
root@monitoring-test-debian-13:~# systemctl is-active monitor
active
root@monitoring-test-debian-13:~# monitor status | head -3
Monitor auf monitoring-test-debian-13 · Gesamt: CRITICAL · Stand vor 4 s · Durchlauf 2270 ms
CPU 17.3 % · RAM 29.6 % · Load 1.82 0.86 0.40 (2 Kerne) · Uptime 12 Min 10 s
Container: 4 von 11 laufen · INFO 19 · WARNING 1 · ERROR 9 · CRITICAL 1
root@monitoring-test-debian-13:~# systemd-run --on-active=3 --unit=testneustart systemctl reboot
Running timer as unit: testneustart.timer
Will run service as unit: testneustart.service
```

## Nach dem Neustart

```console
root@monitoring-test-debian-13:~# date
Mon Nov 23 15:50:51 CET 2026
root@monitoring-test-debian-13:~# uptime -s
2026-11-06 15:42:26
root@monitoring-test-debian-13:~# systemctl is-enabled monitor
enabled
root@monitoring-test-debian-13:~# systemctl is-active monitor
active
root@monitoring-test-debian-13:~# systemctl show monitor -p ActiveEnterTimestamp -p NRestarts
NRestarts=0
ActiveEnterTimestamp=Mon 2026-11-06 15:42:30 CET
root@monitoring-test-debian-13:~# systemd-analyze critical-chain monitor.service
The time when unit became active or started is printed after the "@" character.
The time the unit took to start is printed after the "+" character.

monitor.service @2.394s
└─network-online.target @2.391s
  └─systemd-networkd-wait-online.service @422ms +1.967s
    └─systemd-networkd.service @283ms +135ms
      └─systemd-udevd.service @244ms +37ms
        └─systemd-tmpfiles-setup-dev.service @231ms +10ms
          └─systemd-tmpfiles-setup-dev-early.service @167ms +57ms
            └─kmod-static-nodes.service @155ms +8ms
              └─systemd-journald.socket @148ms
                └─system.slice @131ms
                  └─-.slice @131ms
root@monitoring-test-debian-13:~# monitor status | head -n 4
Monitor auf monitoring-test-debian-13 · Gesamt: CRITICAL · Stand vor 0 s · Durchlauf 2186 ms
CPU 11.8 % · RAM 24.8 % · Load 0.59 0.39 0.18 (2 Kerne) · Uptime 8 Min 22 s
Container: 4 von 11 laufen · INFO 17 · WARNING 1 · ERROR 10 · CRITICAL 1

root@monitoring-test-debian-13:~# monitor status | grep -E "STUFE|container/(db|mailserver) |port/(db|mailserver)|docker/daemon|service/docker"
STUFE     PRÜFUNG                             ZUSTAND        MELDUNG
INFO      container/db                         healthy        db: läuft, Healthcheck bestanden · CPU 1.9 %, RAM 44.6 MB
INFO      container/mailserver                 healthy        mailserver: läuft, Healthcheck bestanden · CPU 0.7 %, RAM 94.6 MB
INFO      docker/daemon                        running        Docker 26.1.5+dfsg1 erreichbar, 4 von 11 Containern laufen
INFO      port/db:5432                         pg-ready       db:5432 (postgres): PostgreSQL nimmt Verbindungen an (fordert Anmeldung an), 10 ms
INFO      port/mailserver:143                  imap-ok        mailserver:143 (imap): erreichbar, meldet "* OK [CAPABILITY IMAP4rev1 LOGIN-REFERRALS ID ENABLE IDLE SA", 19 ms
INFO      port/mailserver:25                   smtp-ok        mailserver:25 (smtp): erreichbar, meldet "220-mail.example.test ESMTP", 7 ms
INFO      port/mailserver:587                  smtp-ok        mailserver:587 (smtp): erreichbar, meldet "220 mail.example.test ESMTP", 19 ms
INFO      service/docker                       active         Dienst docker läuft (running)
root@monitoring-test-debian-13:~# docker ps --format "table {{.Names}}\t{{.Status}}"
NAMES           STATUS
flapper         Up 8 minutes (healthy)
crashloop       Restarting (1) 48 seconds ago
web-unhealthy   Up 8 minutes (unhealthy)
mailserver      Up 8 minutes (healthy)
db              Up 8 minutes (healthy)
```

## Prüfungen

- bestanden: `monitor.service` ist nach dem Neustart aktiv, ohne Eingriff
- bestanden: gestartet 4 s nach dem Booten (15:42:26 → 15:42:30), direkt nach dem Netz, ohne Fehlstart (`NRestarts=0`)
- bestanden: Datenbank-Port 5432 und Mailserver-Ports 25, 143, 587 nach dem Neustart wieder INFO
- bestanden: fehlgeschlagene Zustellung steht als ERROR im Journal (Test-Empfänger läuft nicht mehr)

## Beobachtungen

- Nach dem Neustart meldet `monitor` alle offenen Probleme einmal neu, weil der Spam-Schutz nur im RAM lebt. Das ist gewollt: Nach einem Neustart soll man den aktuellen Stand bekommen.
- Der Mailserver braucht nach dem Booten kurz Zeit, bis sein Healthcheck besteht (im Journal 15:42:37 zunächst `WARNING starting`), danach sind Container und Ports `INFO`.
- Die Testplatte `/srv/daten` und die Test-Dienste kommen nach dem Neustart nicht wieder. Sie gehören zum Testaufbau, nicht zum Server.

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor -b -o short-iso --no-pager | head -n 20
2026-11-06T15:42:30+01:00 monitoring-test-debian-13 systemd[1]: Started monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
2026-11-06T15:42:30+01:00 monitoring-test-debian-13 monitor[625]: [INFO] monitor 2.0.0 gestartet: alle 5 s, Module: system docker services endpoints, 3 Webhook(s)
2026-11-06T15:42:37+01:00 monitoring-test-debian-13 monitor[2723]: [CRITICAL] container/oom: oom: vom Kernel beendet, Arbeitsspeicher reichte nicht (OOM) (vorher INFO)
2026-11-06T15:42:37+01:00 monitoring-test-debian-13 monitor[2723]: [ERROR] container/job-fehler: job-fehler: beendet mit Fehler, Exit-Code 3 (vorher INFO)
2026-11-06T15:42:37+01:00 monitoring-test-debian-13 monitor[2723]: [ERROR] container/pausiert: pausiert: hart beendet (Exit-Code 137, SIGKILL), z. B. durch den OOM-Killer bei einem Unterprozess (vorher INFO)
2026-11-06T15:42:37+01:00 monitoring-test-debian-13 monitor[2723]: [ERROR] container/web-starting: web-starting: hart beendet (Exit-Code 137, SIGKILL), z. B. durch den OOM-Killer bei einem Unterprozess (vorher INFO)
2026-11-06T15:42:37+01:00 monitoring-test-debian-13 monitor[2723]: [ERROR] endpoint/test-api: test-api nicht erreichbar: curl: (7) Failed to connect to 127.0.0.1 port 9000 after 0 ms: Could not connect to server  (vorher INFO)
2026-11-06T15:42:37+01:00 monitoring-test-debian-13 monitor[2723]: [ERROR] endpoint/test-dienst: test-dienst nicht erreichbar: curl: (7) Failed to connect to 127.0.0.1 port 9000 after 0 ms: Could not connect to server  (vorher INFO)
2026-11-06T15:42:37+01:00 monitoring-test-debian-13 monitor[2723]: [ERROR] endpoint/test-health: test-health nicht erreichbar: curl: (7) Failed to connect to 127.0.0.1 port 9000 after 0 ms: Could not connect to server  (vorher INFO)
2026-11-06T15:42:37+01:00 monitoring-test-debian-13 monitor[2723]: [ERROR] endpoint/test-langsam: test-langsam nicht erreichbar: curl: (7) Failed to connect to 127.0.0.1 port 9000 after 0 ms: Could not connect to server  (vorher INFO)
2026-11-06T15:42:37+01:00 monitoring-test-debian-13 monitor[2723]: [ERROR] service/demo-dienst: Dienst demo-dienst läuft nicht (inactive) (vorher INFO)
2026-11-06T15:42:37+01:00 monitoring-test-debian-13 monitor[2723]: [WARNING] container/angelegt: angelegt: angelegt, aber nie gestartet (vorher INFO)
2026-11-06T15:42:37+01:00 monitoring-test-debian-13 monitor[2723]: [WARNING] container/mailserver: mailserver: läuft, Healthcheck noch nicht bestanden · CPU 0.7 %, RAM 95.3 MB (vorher INFO)
2026-11-06T15:42:39+01:00 monitoring-test-debian-13 monitor[1966]: [ERROR] Meldung (report) an discord-test nicht zugestellt (zuletzt HTTP 000, 3 Versuche)
2026-11-06T15:42:39+01:00 monitoring-test-debian-13 monitor[1974]: [ERROR] Meldung (report) an json-test nicht zugestellt (zuletzt HTTP 000, 3 Versuche)
2026-11-06T15:42:42+01:00 monitoring-test-debian-13 monitor[3905]: [ERROR] container/crashloop: crashloop: startet neu (3 Neustarts, letzter Exit-Code 1) (vorher INFO)
2026-11-06T15:42:42+01:00 monitoring-test-debian-13 monitor[3905]: [ERROR] container/web-unhealthy: web-unhealthy: Healthcheck meldet unhealthy (4 Fehlversuche in Folge) · CPU 0 %, RAM 0.3 MB (vorher INFO)
2026-11-06T15:42:42+01:00 monitoring-test-debian-13 monitor[2751]: [ERROR] Meldung (change) an json-test nicht zugestellt (zuletzt HTTP 000, 3 Versuche)
2026-11-06T15:42:42+01:00 monitoring-test-debian-13 monitor[2738]: [ERROR] Meldung (change) an discord-test nicht zugestellt (zuletzt HTTP 000, 3 Versuche)
2026-11-06T15:42:43+01:00 monitoring-test-debian-13 monitor[2764]: [ERROR] Meldung (change) an wiederhol-test nicht zugestellt (zuletzt HTTP 000, 3 Versuche)
```

## Angekommene Meldungen

Keine: Der Test-Empfänger läuft nach dem Neustart nicht mehr. Die Zustellversuche und ihr
Scheitern stehen oben im Server-Log.
