# 10 · Fall 2b: Speicher voll (Arbeitsspeicher)

> Getestet am 06.11.2026 um 15:34:51 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** AK 2 und 3 aus #14: „bei vollem Speicher wird eine Benachrichtigung ausgelöst“.

**Ablauf:** Ein Testprozess (python3) belegt den Arbeitsspeicher bis rund 97 % und hält ihn. Swap ist dafür abgeschaltet, sonst lagert der Kernel aus und der RAM läuft nie ganz voll. Erwartet: ERROR oder CRITICAL mit python3 als größtem Prozess, nach dem Beenden Entwarnung.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# swapon --show
NAME      TYPE      SIZE USED PRIO
/dev/vda4 partition 3.7G   0B   -2
```

```console
root@monitoring-test-debian-13:~# free -m
               total        used        free      shared  buff/cache   available
Mem:            3917        1214        1993         180        1064        2703
Swap:              0           0           0
```

```console
root@monitoring-test-debian-13:~# free -m
               total        used        free      shared  buff/cache   available
Mem:            3917        3723          98         180         418         194
Swap:              0           0           0
```

```console
root@monitoring-test-debian-13:~# monitor status | grep -E 'Monitor auf|CPU|system/memory'
Monitor auf monitoring-test-debian-13 · Gesamt: CRITICAL · Stand vor 1 s · Durchlauf 4144 ms
CPU 18.9 % · RAM 95.4 % · Load 0.44 0.35 0.16 (2 Kerne) · Uptime 5 Min 5 s
ERROR     container/flapper                    unhealthy      flapper: Healthcheck meldet unhealthy (1 Fehlversuche in Folge) · CPU 0 %, RAM 0.4 MB
ERROR     container/web-unhealthy              unhealthy      web-unhealthy: Healthcheck meldet unhealthy (118 Fehlversuche in Folge) · CPU 0.7 %, RAM 1.6 MB
ERROR     system/memory                        95.4%          RAM belegt 95.4 % (3736 von 3917 MB)
WARNING   container/web-starting               starting       web-starting: läuft, Healthcheck noch nicht bestanden · CPU 0 %, RAM 0.3 MB
INFO      container/db                         healthy        db: läuft, Healthcheck bestanden · CPU 1.4 %, RAM 35.1 MB
INFO      container/mailserver                 healthy        mailserver: läuft, Healthcheck bestanden · CPU 0.1 %, RAM 60.6 MB
INFO      system/cpu                           18.9%          CPU-Auslastung 18.9 %
```

```console
root@monitoring-test-debian-13:~# free -m
               total        used        free      shared  buff/cache   available
Mem:            3917        1139        2681         180         419        2778
Swap:           3825           0        3825
```

## Prüfungen

- bestanden: system/memory ERROR oder CRITICAL gemeldet
- bestanden: Discord-Meldung zum Arbeitsspeicher angekommen
- bestanden: Meldung nennt python3 als größten Prozess
- bestanden: Monitoring arbeitet weiter, während der RAM voll ist (Zustand jünger als 20 s)
- bestanden: Entwarnung system/memory

## Beobachtungen

- Gemeldet nach 14 s, gemeldete Stufe: ERROR.

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:34:51" -o short-iso
2026-11-06T15:34:52+01:00 monitoring-test-debian-13 monitor[42350]: [INFO] Meldung (change) an wiederhol-test zugestellt (HTTP 204, Versuch 2)
2026-11-06T15:35:05+01:00 monitoring-test-debian-13 monitor[44375]: [ERROR] system/memory: RAM belegt 95.4 % (3736 von 3917 MB) (vorher INFO)
2026-11-06T15:35:05+01:00 monitoring-test-debian-13 monitor[44390]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:35:05+01:00 monitoring-test-debian-13 monitor[44404]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:35:10+01:00 monitoring-test-debian-13 monitor[15250]: [INFO] container/flapper: Wechsel zu ERROR unterdrückt (Spam-Schutz, 2 Meldungen in 120 s)
2026-11-06T15:35:15+01:00 monitoring-test-debian-13 monitor[45899]: [INFO] system/memory: RAM belegt 29.5 % (1154 von 3917 MB) (vorher ERROR)
2026-11-06T15:35:15+01:00 monitoring-test-debian-13 monitor[45914]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:35:15+01:00 monitoring-test-debian-13 monitor[45927]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
```

## Angekommene Meldungen

| Nr. | Zeit | Webhook | Art | Stufe | Inhalt | Discord-Grenzen |
| --- | --- | --- | --- | --- | --- | --- |
| 0054 | 15:34:52 | flaky | change | INFO | disk//srv/daten CRITICAL->INFO | - |
| 0055 | 15:35:05 | discord | change | - | 🟠 ERROR · system/memory | ok (1 Embeds, 341 Zeichen) |
| 0056 | 15:35:05 | json | change | ERROR | system/memory INFO->ERROR | - |
| 0057 | 15:35:15 | discord | change | - | 🟢 INFO · system/memory | ok (1 Embeds, 340 Zeichen) |
| 0058 | 15:35:15 | json | change | INFO | system/memory ERROR->INFO | - |

### JSON-Meldung Nr. 0056 im Original

```json
{
  "schema": "monitor.event/v1",
  "type": "change",
  "host": "monitoring-test-debian-13",
  "time": "2026-11-06T15:35:05+01:00",
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
      "cpu_percent": 18.9,
      "mem_percent": 95.4,
      "mem_total_mb": 3917,
      "load1": 0.44,
      "load5": 0.35,
      "load15": 0.16,
      "cores": 2,
      "uptime_seconds": 305,
      "uptime": "5 Min 5 s",
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
      "problems": 8
    }
  },
  "events": [
    {
      "id": "system/memory",
      "kind": "system",
      "name": "memory",
      "level": "ERROR",
      "status": "95.4%",
      "message": "RAM belegt 95.4 % (3736 von 3917 MB)",
      "details": {
        "used_percent": 95.4,
        "total_mb": 3917,
        "available_mb": 180,
        "swap_total_mb": 0,
        "swap_used_mb": 0,
        "top_processes": "python3 (PID 42620, CPU 19.4 %, RAM 66.3 %); gnome-shell (PID 3095, CPU 0.3 %, RAM 3.4 %); nautilus (PID 6876, CPU 0.1 %, RAM 3.4 %)"
      },
      "previous_level": "INFO",
      "change": "worse",
      "suppressed_changes": 0
    }
  ]
}
```

### Discord-Meldung Nr. 0055 im Original

```json
{
  "username": "Monitor monitoring-test-debian-13",
  "content": "🟠 **ERROR** auf **monitoring-test-debian-13**",
  "embeds": [
    {
      "title": "🟠 ERROR · system/memory",
      "description": "RAM belegt 95.4 % (3736 von 3917 MB)\nvorher INFO, jetzt ERROR",
      "color": 15105570,
      "fields": [
        {
          "name": "used_percent",
          "value": "95.4",
          "inline": true
        },
        {
          "name": "total_mb",
          "value": "3917",
          "inline": true
        },
        {
          "name": "available_mb",
          "value": "180",
          "inline": true
        },
        {
          "name": "swap_total_mb",
          "value": "0",
          "inline": true
        },
        {
          "name": "swap_used_mb",
          "value": "0",
          "inline": true
        },
        {
          "name": "top_processes",
          "value": "python3 (PID 42620, CPU 19.4 %, RAM 66.3 %); gnome-shell (PID 3095, CPU 0.3 %, RAM 3.4 %); nautilus (PID 6876, CPU 0.1 %, RAM 3.4 %)",
          "inline": false
        }
      ],
      "timestamp": "2026-11-06T15:35:05+01:00",
      "footer": {
        "text": "monitoring-test-debian-13 · system · 95.4%"
      }
    }
  ]
}
```

