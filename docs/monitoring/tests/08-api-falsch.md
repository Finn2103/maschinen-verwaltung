# 08 · Fall 1d: Schnittstelle antwortet falsch

> Getestet am 06.11.2026 um 15:33:55 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** Prompt: „optionale API Punkte Monitoren … mit GET, POST, etc aus einer Liste … einen Statuscode erwarten … VIES“.

**Ablauf:** Die Test-API /dienst antwortet mit 503 statt 200. Erwartet: ERROR mit Statuscode und Antworttext in der Meldung.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# curl -s -X POST http://127.0.0.1:9000/admin/dienst-down
```

```console
root@monitoring-test-debian-13:~# curl -s -i http://127.0.0.1:9000/dienst
HTTP/1.0 503 Service Unavailable
Server: BaseHTTP/0.6 Python/3.13.5
Date: Mon, 23 Nov 2026 14:33:55 GMT
Content-Length: 44

{"error":"Wartung, Dienst nicht verfuegbar"}
```

```console
root@monitoring-test-debian-13:~# curl -s -X POST http://127.0.0.1:9000/admin/dienst-up
```

## Prüfungen

- bestanden: endpoint/test-dienst ERROR gemeldet
- bestanden: Meldung enthält http_code 503 und die Antwort der API
- bestanden: Entwarnung endpoint/test-dienst

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:33:55" -o short-iso
2026-11-06T15:33:55+01:00 monitoring-test-debian-13 monitor[34730]: [INFO] service/demo-dienst: Dienst demo-dienst läuft (running) (vorher ERROR)
2026-11-06T15:33:55+01:00 monitoring-test-debian-13 monitor[34745]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:33:55+01:00 monitoring-test-debian-13 monitor[34758]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:34:00+01:00 monitoring-test-debian-13 monitor[35509]: [ERROR] container/flapper: flapper: Healthcheck meldet unhealthy (4 Fehlversuche in Folge) · CPU 1.1 %, RAM 0.3 MB (vorher INFO)
2026-11-06T15:34:00+01:00 monitoring-test-debian-13 monitor[35524]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:34:00+01:00 monitoring-test-debian-13 monitor[35538]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:34:05+01:00 monitoring-test-debian-13 monitor[36217]: [ERROR] endpoint/test-dienst: test-dienst antwortet mit 503, erwartet 200 (vorher INFO)
2026-11-06T15:34:05+01:00 monitoring-test-debian-13 monitor[36232]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:34:05+01:00 monitoring-test-debian-13 monitor[36246]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:34:10+01:00 monitoring-test-debian-13 monitor[36936]: [INFO] container/flapper: flapper: läuft, Healthcheck bestanden · CPU 0 %, RAM 0.3 MB (vorher ERROR)
2026-11-06T15:34:11+01:00 monitoring-test-debian-13 monitor[36951]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:34:11+01:00 monitoring-test-debian-13 monitor[36965]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:34:15+01:00 monitoring-test-debian-13 monitor[37584]: [INFO] endpoint/test-dienst: test-dienst antwortet mit 200 in 3 ms (vorher ERROR)
2026-11-06T15:34:15+01:00 monitoring-test-debian-13 monitor[37599]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:34:15+01:00 monitoring-test-debian-13 monitor[37612]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
```

## Angekommene Meldungen

| Nr. | Zeit | Webhook | Art | Stufe | Inhalt | Discord-Grenzen |
| --- | --- | --- | --- | --- | --- | --- |
| 0039 | 15:34:00 | discord | change | - | 🟠 ERROR · container/flapper | ok (1 Embeds, 329 Zeichen) |
| 0040 | 15:34:00 | json | change | ERROR | container/flapper INFO->ERROR | - |
| 0041 | 15:34:05 | discord | change | - | 🟠 ERROR · endpoint/test-dienst | ok (1 Embeds, 277 Zeichen) |
| 0042 | 15:34:05 | json | change | ERROR | endpoint/test-dienst INFO->ERROR | - |
| 0043 | 15:34:11 | discord | change | - | 🟢 INFO · container/flapper | ok (1 Embeds, 247 Zeichen) |
| 0044 | 15:34:11 | json | change | INFO | container/flapper ERROR->INFO | - |
| 0045 | 15:34:15 | discord | change | - | 🟢 INFO · endpoint/test-dienst | ok (1 Embeds, 217 Zeichen) |
| 0046 | 15:34:15 | json | change | INFO | endpoint/test-dienst ERROR->INFO | - |

### JSON-Meldung Nr. 0040 im Original

```json
{
  "schema": "monitor.event/v1",
  "type": "change",
  "host": "monitoring-test-debian-13",
  "time": "2026-11-06T15:34:00+01:00",
  "level": "ERROR",
  "summary": {
    "level": "CRITICAL",
    "counts": {
      "INFO": 21,
      "WARNING": 3,
      "ERROR": 5,
      "CRITICAL": 1
    },
    "system": {
      "cpu_percent": 15.6,
      "mem_percent": 30.6,
      "mem_total_mb": 3917,
      "load1": 0.42,
      "load5": 0.35,
      "load15": 0.14,
      "cores": 2,
      "uptime_seconds": 241,
      "uptime": "4 Min 1 s",
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
          "free_mb": 881690,
          "level": "INFO"
        }
      ]
    },
    "containers": {
      "total": 11,
      "running": 5,
      "problems": 8
    }
  },
  "events": [
    {
      "id": "container/flapper",
      "kind": "container",
      "name": "flapper",
      "level": "ERROR",
      "status": "unhealthy",
      "message": "flapper: Healthcheck meldet unhealthy (4 Fehlversuche in Folge) · CPU 1.1 %, RAM 0.3 MB",
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
        "started_at": "2026-11-06T14:31:01.205616893Z",
        "container_id": "3558d323e43c",
        "hint": "docker logs --tail 50 flapper"
      },
      "previous_level": "INFO",
      "change": "worse",
      "suppressed_changes": 5
    }
  ]
}
```

### Discord-Meldung Nr. 0039 im Original

```json
{
  "username": "Monitor monitoring-test-debian-13",
  "content": "🟠 **ERROR** auf **monitoring-test-debian-13**",
  "embeds": [
    {
      "title": "🟠 ERROR · container/flapper",
      "description": "flapper: Healthcheck meldet unhealthy (4 Fehlversuche in Folge) · CPU 1.1 %, RAM 0.3 MB\nvorher INFO, jetzt ERROR\n5 Wechsel dazwischen unterdrückt (Spam-Schutz)",
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
      "timestamp": "2026-11-06T15:34:00+01:00",
      "footer": {
        "text": "monitoring-test-debian-13 · container · unhealthy"
      }
    }
  ]
}
```

