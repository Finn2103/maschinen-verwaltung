# 13 · Spam-Schutz bei Neustarts und Flattern

> Getestet am 06.11.2026 um 15:36:15 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** Prompt: „Doppelte Benachrichtigungen und Spam soll bei Restarts / Loops verhindert werden.“

**Ablauf:** flapper wechselt alle 12 s zwischen healthy und unhealthy, crashloop startet alle paar Sekunden neu. Ohne Schutz gäbe es in 100 s etwa 8 Meldungen. Regel im Test: höchstens 2 Meldungen je Prüfung in 120 s.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since '2026-11-06 15:36:15' -o cat | grep 'unterdrückt'
[INFO] container/flapper: Wechsel zu ERROR unterdrückt (Spam-Schutz, 2 Meldungen in 120 s)
[INFO] container/flapper: Wechsel zu ERROR unterdrückt (Spam-Schutz, 2 Meldungen in 120 s)
[INFO] container/flapper: Wechsel zu ERROR unterdrückt (Spam-Schutz, 2 Meldungen in 120 s)
```

## Prüfungen

- bestanden: flapper: höchstens 3 Meldungen in 100 s (ohne Schutz etwa 8)
- bestanden: crashloop: höchstens 1 Meldung trotz 10 Neustarts
- bestanden: Spam-Schutz hat Wechsel unterdrückt und protokolliert

## Beobachtungen

- In 100 s: 2 Meldungen zu flapper, 0 zu crashloop (crashloop hat jetzt 10 Neustarts).

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:36:15" -o short-iso
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [CRITICAL] container/oom: oom: vom Kernel beendet, Arbeitsspeicher reichte nicht (OOM) (vorher INFO)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [ERROR] container/crashloop: crashloop: Neustart-Schleife: 2 Neustarts, letzter vor 5 s · CPU 0.1 %, RAM 0.4 MB (vorher INFO)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [ERROR] container/job-fehler: job-fehler: beendet mit Fehler, Exit-Code 3 (vorher INFO)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [ERROR] container/pausiert: pausiert: hart beendet (Exit-Code 137, SIGKILL), z. B. durch den OOM-Killer bei einem Unterprozess (vorher INFO)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [ERROR] container/web-starting: web-starting: hart beendet (Exit-Code 137, SIGKILL), z. B. durch den OOM-Killer bei einem Unterprozess (vorher INFO)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [ERROR] container/web-unhealthy: web-unhealthy: Healthcheck meldet unhealthy (4 Fehlversuche in Folge) · CPU 0.7 %, RAM 0.3 MB (vorher INFO)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [WARNING] container/angelegt: angelegt: angelegt, aber nie gestartet (vorher INFO)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [WARNING] container/mailserver: mailserver: läuft, Healthcheck noch nicht bestanden · CPU 0.1 %, RAM 58.2 MB (vorher INFO)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [INFO] docker/daemon: Docker 26.1.5+dfsg1 erreichbar, 5 von 11 Containern laufen (vorher CRITICAL)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [INFO] port/db:5432: db:5432 (postgres): PostgreSQL nimmt Verbindungen an (fordert Anmeldung an), 6 ms (vorher CRITICAL)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [INFO] port/mailserver:143: mailserver:143 (imap): erreichbar, meldet "* OK [CAPABILITY IMAP4rev1 LOGIN-REFERRALS ID ENABLE IDLE SA", 6 ms (vorher CRITICAL)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [INFO] port/mailserver:25: mailserver:25 (smtp): erreichbar, meldet "220-mail.example.test ESMTP", 4 ms (vorher CRITICAL)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [INFO] port/mailserver:587: mailserver:587 (smtp): erreichbar, meldet "220 mail.example.test ESMTP", 4 ms (vorher CRITICAL)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54936]: [INFO] service/docker: Dienst docker läuft (running) (vorher CRITICAL)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54951]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:36:15+01:00 monitoring-test-debian-13 monitor[54965]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:36:17+01:00 monitoring-test-debian-13 monitor[54986]: [INFO] Meldung (change) an wiederhol-test zugestellt (HTTP 204, Versuch 2)
2026-11-06T15:36:26+01:00 monitoring-test-debian-13 monitor[56415]: [ERROR] container/flapper: flapper: Healthcheck meldet unhealthy (5 Fehlversuche in Folge) · CPU 1.1 %, RAM 0.3 MB (vorher INFO)
2026-11-06T15:36:26+01:00 monitoring-test-debian-13 monitor[56430]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:36:26+01:00 monitoring-test-debian-13 monitor[56443]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:36:35+01:00 monitoring-test-debian-13 monitor[57620]: [INFO] container/flapper: flapper: läuft, Healthcheck bestanden · CPU 1 %, RAM 0.3 MB (vorher ERROR)
2026-11-06T15:36:35+01:00 monitoring-test-debian-13 monitor[57635]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:36:35+01:00 monitoring-test-debian-13 monitor[57649]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:36:35+01:00 monitoring-test-debian-13 monitor[57673]: [INFO] Meldung (report) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:36:35+01:00 monitoring-test-debian-13 monitor[57681]: [INFO] Meldung (report) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:36:45+01:00 monitoring-test-debian-13 monitor[58848]: [INFO] container/mailserver: mailserver: läuft, Healthcheck bestanden · CPU 0.2 %, RAM 58.4 MB (vorher WARNING)
2026-11-06T15:36:45+01:00 monitoring-test-debian-13 monitor[58863]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:36:45+01:00 monitoring-test-debian-13 monitor[58877]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:36:51+01:00 monitoring-test-debian-13 monitor[15250]: [INFO] container/flapper: Wechsel zu ERROR unterdrückt (Spam-Schutz, 2 Meldungen in 120 s)
2026-11-06T15:37:16+01:00 monitoring-test-debian-13 monitor[15250]: [INFO] container/flapper: Wechsel zu ERROR unterdrückt (Spam-Schutz, 2 Meldungen in 120 s)
2026-11-06T15:37:35+01:00 monitoring-test-debian-13 monitor[15250]: [INFO] container/flapper: Wechsel zu ERROR unterdrückt (Spam-Schutz, 2 Meldungen in 120 s)
2026-11-06T15:37:35+01:00 monitoring-test-debian-13 monitor[64257]: [INFO] Meldung (report) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:37:35+01:00 monitoring-test-debian-13 monitor[64265]: [INFO] Meldung (report) an json-test zugestellt (HTTP 204, Versuch 1)
```

## Angekommene Meldungen

| Nr. | Zeit | Webhook | Art | Stufe | Inhalt | Discord-Grenzen |
| --- | --- | --- | --- | --- | --- | --- |
| 0080 | 15:36:17 | flaky | change | CRITICAL | container/oom INFO->CRITICAL · docker/daemon CRITICAL->INFO · port/db:5432 CRITICAL->INFO · port/mailserver:143 CRITICAL->INFO · port/mailserver:25 CRITICAL->INFO · port/mailserver:587 CRITICAL->INFO · service/docker CRITICAL->INFO | - |
| 0081 | 15:36:26 | discord | change | - | 🟠 ERROR · container/flapper | ok (1 Embeds, 282 Zeichen) |
| 0082 | 15:36:26 | json | change | ERROR | container/flapper INFO->ERROR | - |
| 0083 | 15:36:35 | discord | change | - | 🟢 INFO · container/flapper | ok (1 Embeds, 247 Zeichen) |
| 0084 | 15:36:35 | json | change | INFO | container/flapper ERROR->INFO | - |
| 0085 | 15:36:35 | discord | report | - | 🔴 Bericht monitoring-test-debian-13: CRITICAL | ok (1 Embeds, 904 Zeichen) |
| 0086 | 15:36:35 | json | report | CRITICAL | Probleme: 8 | - |
| 0087 | 15:36:45 | discord | change | - | 🟢 INFO · container/mailserver | ok (1 Embeds, 263 Zeichen) |
| 0088 | 15:36:45 | json | change | INFO | container/mailserver WARNING->INFO | - |
| 0089 | 15:37:35 | discord | report | - | 🔴 Bericht monitoring-test-debian-13: CRITICAL | ok (1 Embeds, 916 Zeichen) |
| 0090 | 15:37:35 | json | report | CRITICAL | Probleme: 8 | - |

### JSON-Meldung Nr. 0082 im Original

```json
{
  "schema": "monitor.event/v1",
  "type": "change",
  "host": "monitoring-test-debian-13",
  "time": "2026-11-06T15:36:25+01:00",
  "level": "ERROR",
  "summary": {
    "level": "CRITICAL",
    "counts": {
      "INFO": 21,
      "WARNING": 2,
      "ERROR": 6,
      "CRITICAL": 1
    },
    "system": {
      "cpu_percent": 14.1,
      "mem_percent": 29.2,
      "mem_total_mb": 3917,
      "load1": 0.4,
      "load5": 0.37,
      "load15": 0.18,
      "cores": 2,
      "uptime_seconds": 386,
      "uptime": "6 Min 26 s",
      "disks": [
        {
          "mount": "/srv/daten",
          "used_percent": 1,
          "free_mb": 905,
          "level": "INFO"
        },
        {
          "mount": "/",
          "used_percent": 1,
          "free_mb": 881640,
          "level": "INFO"
        }
      ]
    },
    "containers": {
      "total": 11,
      "running": 5,
      "problems": 9
    }
  },
  "events": [
    {
      "id": "container/flapper",
      "kind": "container",
      "name": "flapper",
      "level": "ERROR",
      "status": "unhealthy",
      "message": "flapper: Healthcheck meldet unhealthy (5 Fehlversuche in Folge) · CPU 1.1 %, RAM 0.3 MB",
      "details": {
        "state": "running",
        "health": "unhealthy",
        "restart_count": 0,
        "cpu_percent": 1.1,
        "mem_mb": 0.3,
        "mem_limit_mb": 3917.7,
        "mem_percent": 0,
        "log_path": "/var/lib/docker/containers/3558d323e43c18fc368915ddbf894ace978022f7a3b63f1aa8694bdfd03fa405/3558d323e43c18fc368915ddbf894ace978022f7a3b63f1aa8694bdfd03fa405-json.log",
        "health_output": "",
        "image": "alpine:3.22",
        "restart_policy": "unless-stopped",
        "started_at": "2026-11-06T14:36:02.303578506Z",
        "finished_at": "2026-11-06T14:35:46.439903841Z",
        "container_id": "3558d323e43c",
        "hint": "docker logs --tail 50 flapper"
      },
      "previous_level": "INFO",
      "change": "worse",
      "suppressed_changes": 0
    }
  ]
}
```

### Discord-Meldung Nr. 0081 im Original

```json
{
  "username": "Monitor monitoring-test-debian-13",
  "content": "🟠 **ERROR** auf **monitoring-test-debian-13**",
  "embeds": [
    {
      "title": "🟠 ERROR · container/flapper",
      "description": "flapper: Healthcheck meldet unhealthy (5 Fehlversuche in Folge) · CPU 1.1 %, RAM 0.3 MB\nvorher INFO, jetzt ERROR",
      "color": 15105570,
      "fields": [
        {
          "name": "state",
          "value": "running",
          "inline": true
        },
        {
          "name": "health",
          "value": "unhealthy",
          "inline": true
        },
        {
          "name": "restart_count",
          "value": "0",
          "inline": true
        },
        {
          "name": "cpu_percent",
          "value": "1.1",
          "inline": true
        },
        {
          "name": "mem_mb",
          "value": "0.3",
          "inline": true
        },
        {
          "name": "mem_limit_mb",
          "value": "3917.7",
          "inline": true
        },
        {
          "name": "mem_percent",
          "value": "0",
          "inline": true
        }
      ],
      "timestamp": "2026-11-06T15:36:25+01:00",
      "footer": {
        "text": "monitoring-test-debian-13 · container · unhealthy"
      }
    }
  ]
}
```

