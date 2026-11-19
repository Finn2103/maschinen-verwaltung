# 19 · Ressourcenbedarf und Angriffsfläche

> Getestet am 06.11.2026 um 15:38:04 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** ADR 0012, Kriterien „Ressourcenbedarf“ und „Angriffsfläche“: Das Skript bekam dort je 5 Punkte als Ziel, belegt erst durch den Test.

**Ablauf:** Über 60 s werden CPU-Zeit und Arbeitsspeicher des Dienstes aus systemd gemessen, im Test mit einer Prüfung alle 5 s. Danach wird geprüft, ob monitor einen Port öffnet oder als Container läuft.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# systemctl show monitor -p MemoryCurrent -p MemoryPeak -p MemoryMax -p TasksCurrent -p CPUUsageNSec -p Nice
MemoryCurrent=27136000
MemoryPeak=79208448
CPUUsageNSec=37793696000
TasksCurrent=6
MemoryMax=268435456
Nice=5
```

```console
root@monitoring-test-debian-13:~# ss -ltnup | grep -i monitor || echo 'monitor lauscht auf keinem Port'
monitor lauscht auf keinem Port
```

```console
root@monitoring-test-debian-13:~# docker ps --format '{{.Names}}' | grep -i monitor || echo 'kein Container für das Monitoring'
kein Container für das Monitoring
```

```console
root@monitoring-test-debian-13:~# du -sh /run/monitor && ls -la /run/monitor
168K	/run/monitor
total 24
drwxr-xr-x  4 root root   120 Nov 23 15:39 .
drwxr-xr-x 25 root root   640 Nov 23 15:36 ..
drwx------  2 root root    40 Nov 23 15:38 outbox
-rw-r--r--  1 root root   176 Nov 23 15:39 ports.tsv
-rw-r--r--  1 root root 19654 Nov 23 15:39 status.json
drwxr-xr-x  3 root root    60 Nov 23 15:39 work
```

## Prüfungen

- bestanden: Arbeitsspeicher-Spitze unter der Grenze der Unit (256 MB)
- bestanden: CPU im Mittel unter 20 % eines Kerns
- bestanden: monitor öffnet keinen Port
- bestanden: kein Container und keine Weboberfläche für das Monitoring

## Beobachtungen

- CPU im Mittel über 60 s: 8.9 % eines Kerns (Prüfung alle 5 s, auf dem Server alle 10 s).
- Arbeitsspeicher jetzt 25 MB, Spitze seit dem Start 75 MB, Grenze der Unit 256 MB.

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:38:04" -o short-iso
2026-11-06T15:38:25+01:00 monitoring-test-debian-13 monitor[71052]: [ERROR] container/flapper: flapper: Healthcheck meldet unhealthy (5 Fehlversuche in Folge) · CPU 1 %, RAM 0.3 MB (vorher INFO)
2026-11-06T15:38:25+01:00 monitoring-test-debian-13 monitor[71067]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:38:25+01:00 monitoring-test-debian-13 monitor[71081]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:38:36+01:00 monitoring-test-debian-13 monitor[72152]: [INFO] container/flapper: flapper: läuft, Healthcheck bestanden · CPU 0 %, RAM 0.3 MB (vorher ERROR)
2026-11-06T15:38:36+01:00 monitoring-test-debian-13 monitor[72167]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:38:36+01:00 monitoring-test-debian-13 monitor[72181]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:38:36+01:00 monitoring-test-debian-13 monitor[72205]: [INFO] Meldung (report) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:38:36+01:00 monitoring-test-debian-13 monitor[72213]: [INFO] Meldung (report) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:38:50+01:00 monitoring-test-debian-13 monitor[15250]: [INFO] container/flapper: Wechsel zu ERROR unterdrückt (Spam-Schutz, 2 Meldungen in 120 s)
```

## Angekommene Meldungen

| Nr. | Zeit | Webhook | Art | Stufe | Inhalt | Discord-Grenzen |
| --- | --- | --- | --- | --- | --- | --- |
| 0092 | 15:38:25 | discord | change | - | 🟠 ERROR · container/flapper | ok (1 Embeds, 325 Zeichen) |
| 0093 | 15:38:25 | json | change | ERROR | container/flapper INFO->ERROR | - |
| 0094 | 15:38:36 | discord | change | - | 🟢 INFO · container/flapper | ok (1 Embeds, 247 Zeichen) |
| 0095 | 15:38:36 | json | change | INFO | container/flapper ERROR->INFO | - |
| 0096 | 15:38:36 | discord | report | - | 🔴 Bericht monitoring-test-debian-13: CRITICAL | ok (1 Embeds, 828 Zeichen) |
| 0097 | 15:38:36 | json | report | CRITICAL | Probleme: 7 | - |

### JSON-Meldung Nr. 0093 im Original

```json
{
  "schema": "monitor.event/v1",
  "type": "change",
  "host": "monitoring-test-debian-13",
  "time": "2026-11-06T15:38:25+01:00",
  "level": "ERROR",
  "summary": {
    "level": "CRITICAL",
    "counts": {
      "INFO": 22,
      "WARNING": 1,
      "ERROR": 6,
      "CRITICAL": 1
    },
    "system": {
      "cpu_percent": 10.6,
      "mem_percent": 29.6,
      "mem_total_mb": 3917,
      "load1": 0.3,
      "load5": 0.35,
      "load15": 0.19,
      "cores": 2,
      "uptime_seconds": 506,
      "uptime": "8 Min 26 s",
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
          "free_mb": 881639,
          "level": "INFO"
        }
      ]
    },
    "containers": {
      "total": 11,
      "running": 4,
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
      "message": "flapper: Healthcheck meldet unhealthy (5 Fehlversuche in Folge) · CPU 1 %, RAM 0.3 MB",
      "details": {
        "state": "running",
        "health": "unhealthy",
        "restart_count": 0,
        "cpu_percent": 1,
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
      "suppressed_changes": 4
    }
  ]
}
```

### Discord-Meldung Nr. 0092 im Original

```json
{
  "username": "Monitor monitoring-test-debian-13",
  "content": "🟠 **ERROR** auf **monitoring-test-debian-13**",
  "embeds": [
    {
      "title": "🟠 ERROR · container/flapper",
      "description": "flapper: Healthcheck meldet unhealthy (5 Fehlversuche in Folge) · CPU 1 %, RAM 0.3 MB\nvorher INFO, jetzt ERROR\n4 Wechsel dazwischen unterdrückt (Spam-Schutz)",
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
          "value": "1",
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
      "timestamp": "2026-11-06T15:38:25+01:00",
      "footer": {
        "text": "monitoring-test-debian-13 · container · unhealthy"
      }
    }
  ]
}
```

