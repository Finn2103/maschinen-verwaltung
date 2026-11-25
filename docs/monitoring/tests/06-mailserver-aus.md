# 06 · Fall 1b: Mailserver nicht erreichbar

> Getestet am 06.11.2026 um 15:32:31 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** AK 2 und 3 aus #14. ADR 0012: docker-mailserver über SMTP und IMAP prüfen.

**Ablauf:** Der Container mailserver (docker-mailserver) wird gestoppt. Erwartet: CRITICAL für den Container und die Ports 25, 143 und 587, nach dem Start eine Entwarnung, die nicht vom Spam-Schutz zurückgehalten wird.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# docker stop mailserver
mailserver
```

```console
root@monitoring-test-debian-13:~# monitor status --problems
Monitor auf monitoring-test-debian-13 · Gesamt: CRITICAL · Stand vor 1 s · Durchlauf 4128 ms
CPU 10.6 % · RAM 28.8 % · Load 0.83 0.37 0.14 (2 Kerne) · Uptime 2 Min 50 s
Container: 4 von 11 laufen · INFO 18 · WARNING 3 · ERROR 4 · CRITICAL 5

STUFE     PRÜFUNG                             ZUSTAND        MELDUNG
CRITICAL  container/mailserver                 exited         mailserver: gestoppt (Exit-Code 137), sollte aber laufen
CRITICAL  container/oom                        oom-killed     oom: vom Kernel beendet, Arbeitsspeicher reichte nicht (OOM)
CRITICAL  port/mailserver:143                  unreachable    mailserver:143 (imap): nicht erreichbar (Connection refused), 2 ms · Container exited
CRITICAL  port/mailserver:25                   unreachable    mailserver:25 (smtp): nicht erreichbar (Connection refused), 3 ms · Container exited
CRITICAL  port/mailserver:587                  unreachable    mailserver:587 (smtp): nicht erreichbar (Connection refused), 4 ms · Container exited
ERROR     container/crashloop                  restarting     crashloop: startet neu (10 Neustarts, letzter Exit-Code 1)
ERROR     container/flapper                    unhealthy      flapper: Healthcheck meldet unhealthy (5 Fehlversuche in Folge) · CPU 0.9 %, RAM 0.3 MB
ERROR     container/job-fehler                 exited         job-fehler: beendet mit Fehler, Exit-Code 3
ERROR     container/web-unhealthy              unhealthy      web-unhealthy: Healthcheck meldet unhealthy (52 Fehlversuche in Folge) · CPU 1.1 %, RAM 0.3 MB
WARNING   container/angelegt                   created        angelegt: angelegt, aber nie gestartet
WARNING   container/pausiert                   paused         pausiert: pausiert
WARNING   container/web-starting               starting       web-starting: läuft, Healthcheck noch nicht bestanden · CPU 0 %, RAM 0.3 MB
```
_Exit-Code 3 (monitor status und check: 1 WARNING, 2 ERROR, 3 CRITICAL, 4 kein Zustand oder Fehler)_

```console
root@monitoring-test-debian-13:~# docker start mailserver
mailserver
```

## Prüfungen

- bestanden: JSON-Webhook: container/mailserver CRITICAL angekommen
- bestanden: JSON-Webhook: port/mailserver:25 (SMTP) CRITICAL angekommen
- bestanden: JSON-Webhook: port/mailserver:143 (IMAP) CRITICAL angekommen
- bestanden: JSON-Webhook: port/mailserver:587 (SMTP) CRITICAL angekommen
- bestanden: Discord-Webhook: Meldung zum Mailserver angekommen
- bestanden: Entwarnung: port/mailserver:25 wieder INFO
- bestanden: Entwarnung: port/mailserver:143 wieder INFO
- bestanden: Entwarnung: container/mailserver wieder INFO
- bestanden: Entwarnung wurde nicht vom Spam-Schutz zurückgehalten

## Beobachtungen

- Erkannt und gemeldet nach 9 s.
- SMTP wieder erreichbar nach 10 s, Container wieder healthy und Entwarnung angekommen nach 34 s.

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:32:31" -o short-iso
2026-11-06T15:32:32+01:00 monitoring-test-debian-13 monitor[23345]: [INFO] Meldung (change) an wiederhol-test zugestellt (HTTP 204, Versuch 2)
2026-11-06T15:32:35+01:00 monitoring-test-debian-13 monitor[23998]: [INFO] Meldung (report) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:32:35+01:00 monitoring-test-debian-13 monitor[24006]: [INFO] Meldung (report) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:32:46+01:00 monitoring-test-debian-13 monitor[25207]: [CRITICAL] port/mailserver:25: mailserver:25 (smtp): nicht erreichbar (Connection refused), 4 ms · Container exited (vorher INFO)
2026-11-06T15:32:46+01:00 monitoring-test-debian-13 monitor[25207]: [CRITICAL] port/mailserver:587: mailserver:587 (smtp): nicht erreichbar (Connection refused), 4 ms · Container exited (vorher INFO)
2026-11-06T15:32:46+01:00 monitoring-test-debian-13 monitor[25222]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:32:46+01:00 monitoring-test-debian-13 monitor[25236]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:32:48+01:00 monitoring-test-debian-13 monitor[25250]: [INFO] Meldung (change) an wiederhol-test zugestellt (HTTP 204, Versuch 2)
2026-11-06T15:32:50+01:00 monitoring-test-debian-13 monitor[15250]: [INFO] container/flapper: Wechsel zu ERROR unterdrückt (Spam-Schutz, 2 Meldungen in 120 s)
2026-11-06T15:32:50+01:00 monitoring-test-debian-13 monitor[25812]: [CRITICAL] container/mailserver: mailserver: gestoppt (Exit-Code 137), sollte aber laufen (vorher INFO)
2026-11-06T15:32:50+01:00 monitoring-test-debian-13 monitor[25812]: [CRITICAL] port/mailserver:143: mailserver:143 (imap): nicht erreichbar (Connection refused), 2 ms · Container exited (vorher INFO)
2026-11-06T15:32:50+01:00 monitoring-test-debian-13 monitor[25827]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:32:50+01:00 monitoring-test-debian-13 monitor[25841]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:32:52+01:00 monitoring-test-debian-13 monitor[25855]: [INFO] Meldung (change) an wiederhol-test zugestellt (HTTP 204, Versuch 2)
2026-11-06T15:33:00+01:00 monitoring-test-debian-13 monitor[27571]: [WARNING] container/mailserver: mailserver: läuft, Healthcheck noch nicht bestanden · CPU 0.1 %, RAM 41.1 MB (vorher CRITICAL)
2026-11-06T15:33:00+01:00 monitoring-test-debian-13 monitor[27571]: [INFO] port/mailserver:143: mailserver:143 (imap): erreichbar, meldet "* OK [CAPABILITY IMAP4rev1 LOGIN-REFERRALS ID ENABLE IDLE SA", 6 ms (vorher CRITICAL)
2026-11-06T15:33:00+01:00 monitoring-test-debian-13 monitor[27571]: [INFO] port/mailserver:25: mailserver:25 (smtp): erreichbar, meldet "220-mail.example.test ESMTP", 3 ms (vorher CRITICAL)
2026-11-06T15:33:00+01:00 monitoring-test-debian-13 monitor[27571]: [INFO] port/mailserver:587: mailserver:587 (smtp): erreichbar, meldet "220 mail.example.test ESMTP", 5 ms (vorher CRITICAL)
2026-11-06T15:33:00+01:00 monitoring-test-debian-13 monitor[27586]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:33:00+01:00 monitoring-test-debian-13 monitor[27599]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:33:02+01:00 monitoring-test-debian-13 monitor[27614]: [INFO] Meldung (change) an wiederhol-test zugestellt (HTTP 204, Versuch 2)
2026-11-06T15:33:15+01:00 monitoring-test-debian-13 monitor[15250]: [INFO] container/flapper: Wechsel zu ERROR unterdrückt (Spam-Schutz, 2 Meldungen in 120 s)
2026-11-06T15:33:35+01:00 monitoring-test-debian-13 monitor[15250]: [INFO] container/flapper: Wechsel zu ERROR unterdrückt (Spam-Schutz, 2 Meldungen in 120 s)
2026-11-06T15:33:35+01:00 monitoring-test-debian-13 monitor[32021]: [INFO] container/mailserver: mailserver: läuft, Healthcheck bestanden · CPU 0 %, RAM 41.3 MB (vorher WARNING)
2026-11-06T15:33:35+01:00 monitoring-test-debian-13 monitor[32036]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:33:35+01:00 monitoring-test-debian-13 monitor[32050]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:33:35+01:00 monitoring-test-debian-13 monitor[32074]: [INFO] Meldung (report) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:33:35+01:00 monitoring-test-debian-13 monitor[32082]: [INFO] Meldung (report) an json-test zugestellt (HTTP 204, Versuch 1)
```

## Angekommene Meldungen

| Nr. | Zeit | Webhook | Art | Stufe | Inhalt | Discord-Grenzen |
| --- | --- | --- | --- | --- | --- | --- |
| 0019 | 15:32:32 | flaky | change | INFO | container/db CRITICAL->INFO | - |
| 0020 | 15:32:35 | discord | report | - | 🔴 Bericht monitoring-test-debian-13: CRITICAL | ok (1 Embeds, 721 Zeichen) |
| 0021 | 15:32:35 | json | report | CRITICAL | Probleme: 7 | - |
| 0022 | 15:32:46 | discord | change | - | 🔴 CRITICAL · port/mailserver:25 · 🔴 CRITICAL · port/mailserver:587 | ok (2 Embeds, 546 Zeichen) |
| 0023 | 15:32:46 | json | change | CRITICAL | port/mailserver:25 INFO->CRITICAL · port/mailserver:587 INFO->CRITICAL | - |
| 0024 | 15:32:48 | flaky | change | CRITICAL | port/mailserver:25 INFO->CRITICAL · port/mailserver:587 INFO->CRITICAL | - |
| 0025 | 15:32:50 | discord | change | - | 🔴 CRITICAL · container/mailserver · 🔴 CRITICAL · port/mailserver:143 | ok (2 Embeds, 749 Zeichen) |
| 0026 | 15:32:50 | json | change | CRITICAL | container/mailserver INFO->CRITICAL · port/mailserver:143 INFO->CRITICAL | - |
| 0027 | 15:32:52 | flaky | change | CRITICAL | container/mailserver INFO->CRITICAL · port/mailserver:143 INFO->CRITICAL | - |
| 0028 | 15:33:00 | discord | change | - | 🟡 WARNING · container/mailserver · 🟢 INFO · port/mailserver:143 · 🟢 INFO · port/mailserver:25 · Weitere 1 Änderungen | ok (4 Embeds, 1060 Zeichen) |
| 0029 | 15:33:00 | json | change | WARNING | container/mailserver CRITICAL->WARNING · port/mailserver:143 CRITICAL->INFO · port/mailserver:25 CRITICAL->INFO · port/mailserver:587 CRITICAL->INFO | - |
| 0030 | 15:33:02 | flaky | change | WARNING | container/mailserver CRITICAL->WARNING · port/mailserver:143 CRITICAL->INFO · port/mailserver:25 CRITICAL->INFO · port/mailserver:587 CRITICAL->INFO | - |
| 0031 | 15:33:35 | discord | change | - | 🟢 INFO · container/mailserver | ok (1 Embeds, 259 Zeichen) |
| 0032 | 15:33:35 | json | change | INFO | container/mailserver WARNING->INFO | - |
| 0033 | 15:33:35 | discord | report | - | 🔴 Bericht monitoring-test-debian-13: CRITICAL | ok (1 Embeds, 807 Zeichen) |
| 0034 | 15:33:35 | json | report | CRITICAL | Probleme: 8 | - |

### JSON-Meldung Nr. 0023 im Original

```json
{
  "schema": "monitor.event/v1",
  "type": "change",
  "host": "monitoring-test-debian-13",
  "time": "2026-11-06T15:32:46+01:00",
  "level": "CRITICAL",
  "summary": {
    "level": "CRITICAL",
    "counts": {
      "INFO": 18,
      "WARNING": 3,
      "ERROR": 4,
      "CRITICAL": 5
    },
    "system": {
      "cpu_percent": 10.6,
      "mem_percent": 28.3,
      "mem_total_mb": 3917,
      "load1": 0.9,
      "load5": 0.37,
      "load15": 0.14,
      "cores": 2,
      "uptime_seconds": 166,
      "uptime": "2 Min 46 s",
      "disks": [
        {
          "mount": "/",
          "used_percent": 1,
          "free_mb": 881691,
          "level": "INFO"
        },
        {
          "mount": "/srv/daten",
          "used_percent": 1,
          "free_mb": 905,
          "level": "INFO"
        }
      ]
    },
    "containers": {
      "total": 11,
      "running": 4,
      "problems": 9
    }
  },
  "events": [
    {
      "id": "port/mailserver:25",
      "kind": "port",
      "name": "mailserver:25",
      "level": "CRITICAL",
      "status": "unreachable",
      "message": "mailserver:25 (smtp): nicht erreichbar (Connection refused), 4 ms · Container exited",
      "details": {
        "type": "port",
        "container": "mailserver",
        "host": "127.0.0.1",
        "port": 25,
        "container_port": 25,
        "protocol": "smtp",
        "time_ms": 4,
        "container_state": "exited"
      },
      "previous_level": "INFO",
      "change": "worse",
      "suppressed_changes": 0
    },
    {
      "id": "port/mailserver:587",
      "kind": "port",
      "name": "mailserver:587",
      "level": "CRITICAL",
      "status": "unreachable",
      "message": "mailserver:587 (smtp): nicht erreichbar (Connection refused), 4 ms · Container exited",
      "details": {
        "type": "port",
        "container": "mailserver",
        "host": "127.0.0.1",
        "port": 587,
        "container_port": 587,
        "protocol": "smtp",
        "time_ms": 4,
        "container_state": "exited"
      },
      "previous_level": "INFO",
      "change": "worse",
      "suppressed_changes": 0
    }
  ]
}
```

### Discord-Meldung Nr. 0020 im Original

```json
{
  "username": "Monitor monitoring-test-debian-13",
  "embeds": [
    {
      "title": "🔴 Bericht monitoring-test-debian-13: CRITICAL",
      "color": 15158332,
      "timestamp": "2026-11-06T15:32:35+01:00",
      "fields": [
        {
          "name": "CPU",
          "value": "11.8 %",
          "inline": true
        },
        {
          "name": "RAM",
          "value": "30.1 % von 3917 MB",
          "inline": true
        },
        {
          "name": "Load",
          "value": "1.07 / 0.39 / 0.14 (2 Kerne)",
          "inline": true
        },
        {
          "name": "Uptime",
          "value": "2 Min 36 s",
          "inline": true
        },
        {
          "name": "Container",
          "value": "5 von 11 laufen, 7 mit Problem",
          "inline": true
        },
        {
          "name": "Prüfungen",
          "value": "INFO 23 · WARNING 3 · ERROR 3 · CRITICAL 1",
          "inline": false
        },
        {
          "name": "Platten",
          "value": "/srv/daten: 1 % (905 MB frei)\n/: 1 % (881691 MB frei)",
          "inline": false
        },
        {
          "name": "Offene Probleme",
          "inline": false,
          "value": "🔴 oom: vom Kernel beendet, Arbeitsspeicher reichte nicht (OOM)\n🟠 crashloop: startet neu (10 Neustarts, letzter Exit-Code 1)\n🟠 job-fehler: beendet mit Fehler, Exit-Code 3\n🟠 web-unhealthy: Healthcheck meldet unhealthy (45 Fehlversuche in Folge) · CPU 0.5 %, RAM 0.3 MB\n🟡 angelegt: angelegt, aber nie gestartet\n🟡 pausiert: pausiert\n🟡 web-starting: läuft, Healthcheck noch nicht bestanden · CPU 0 %, RAM 0.3 MB"
        }
      ],
      "footer": {
        "text": "monitor · Durchlauf 4073 ms"
      }
    }
  ]
}
```

