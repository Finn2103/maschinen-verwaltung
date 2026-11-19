# 07 · Fall 1c: systemd-Dienst ausgefallen

> Getestet am 06.11.2026 um 15:33:36 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** Prompt: „Das Monitoring von Docker Containern und theoretisch auch System Services soll möglich sein“.

**Ablauf:** Der Test-Dienst demo-dienst wird gestoppt. Erwartet: ERROR, nach dem Start Entwarnung.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# systemctl stop demo-dienst
```

```console
root@monitoring-test-debian-13:~# systemctl start demo-dienst
```

## Prüfungen

- bestanden: service/demo-dienst ERROR gemeldet
- bestanden: Entwarnung service/demo-dienst

## Beobachtungen

- Gemeldet nach 10 s.

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:33:36" -o short-iso
2026-11-06T15:33:45+01:00 monitoring-test-debian-13 monitor[33414]: [ERROR] service/demo-dienst: Dienst demo-dienst läuft nicht (inactive) (vorher INFO)
2026-11-06T15:33:45+01:00 monitoring-test-debian-13 monitor[33429]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:33:45+01:00 monitoring-test-debian-13 monitor[33443]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:33:55+01:00 monitoring-test-debian-13 monitor[34730]: [INFO] service/demo-dienst: Dienst demo-dienst läuft (running) (vorher ERROR)
2026-11-06T15:33:55+01:00 monitoring-test-debian-13 monitor[34745]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:33:55+01:00 monitoring-test-debian-13 monitor[34758]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
```

## Angekommene Meldungen

| Nr. | Zeit | Webhook | Art | Stufe | Inhalt | Discord-Grenzen |
| --- | --- | --- | --- | --- | --- | --- |
| 0035 | 15:33:45 | discord | change | - | 🟠 ERROR · service/demo-dienst | ok (1 Embeds, 289 Zeichen) |
| 0036 | 15:33:45 | json | change | ERROR | service/demo-dienst INFO->ERROR | - |
| 0037 | 15:33:55 | discord | change | - | 🟢 INFO · service/demo-dienst | ok (1 Embeds, 334 Zeichen) |
| 0038 | 15:33:55 | json | change | INFO | service/demo-dienst ERROR->INFO | - |

### JSON-Meldung Nr. 0036 im Original

```json
{
  "schema": "monitor.event/v1",
  "type": "change",
  "host": "monitoring-test-debian-13",
  "time": "2026-11-06T15:33:45+01:00",
  "level": "ERROR",
  "summary": {
    "level": "CRITICAL",
    "counts": {
      "INFO": 22,
      "WARNING": 3,
      "ERROR": 4,
      "CRITICAL": 1
    },
    "system": {
      "cpu_percent": 12.9,
      "mem_percent": 30.8,
      "mem_total_mb": 3917,
      "load1": 0.54,
      "load5": 0.36,
      "load15": 0.15,
      "cores": 2,
      "uptime_seconds": 226,
      "uptime": "3 Min 46 s",
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
          "free_mb": 881691,
          "level": "INFO"
        }
      ]
    },
    "containers": {
      "total": 11,
      "running": 5,
      "problems": 7
    }
  },
  "events": [
    {
      "id": "service/demo-dienst",
      "kind": "service",
      "name": "demo-dienst",
      "level": "ERROR",
      "status": "inactive",
      "message": "Dienst demo-dienst läuft nicht (inactive)",
      "details": {
        "sub_state": "dead",
        "result": "success",
        "unit_file": "/etc/systemd/system/demo-dienst.service",
        "restarts": 0,
        "hint": "systemctl status demo-dienst; journalctl -u demo-dienst -n 50"
      },
      "previous_level": "INFO",
      "change": "worse",
      "suppressed_changes": 0
    }
  ]
}
```

### Discord-Meldung Nr. 0035 im Original

```json
{
  "username": "Monitor monitoring-test-debian-13",
  "content": "🟠 **ERROR** auf **monitoring-test-debian-13**",
  "embeds": [
    {
      "title": "🟠 ERROR · service/demo-dienst",
      "description": "Dienst demo-dienst läuft nicht (inactive)\nvorher INFO, jetzt ERROR",
      "color": 15105570,
      "fields": [
        {
          "name": "sub_state",
          "value": "dead",
          "inline": true
        },
        {
          "name": "result",
          "value": "success",
          "inline": true
        },
        {
          "name": "unit_file",
          "value": "/etc/systemd/system/demo-dienst.service",
          "inline": false
        },
        {
          "name": "restarts",
          "value": "0",
          "inline": true
        },
        {
          "name": "hint",
          "value": "systemctl status demo-dienst; journalctl -u demo-dienst -n 50",
          "inline": false
        }
      ],
      "timestamp": "2026-11-06T15:33:45+01:00",
      "footer": {
        "text": "monitoring-test-debian-13 · service · inactive"
      }
    }
  ]
}
```

