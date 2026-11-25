# 21 · Neue Container werden automatisch überwacht

> Getestet am 06.11.2026 um 15:39:19 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** Prompts: „erkennt noch nicht die container alle automatisch richtig“ und vom 06.11.: „so dass er das unabhängig hin kriegt“.

**Ablauf:** Ein neuer Webdienst wird mit Port 8000 auf allen Adressen gestartet, ohne die Konfiguration zu ändern. Dann stirbt nur der Webserver im Container, der Container läuft weiter. Ein zweiter Container mit dem Label monitor.ignore=true darf nicht auftauchen.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# docker run -d --name web8000 --label projekt=monitor-test --restart unless-stopped -p 8000:80 alpine:3.22 sh -c 'while [ ! -e /tmp/stop ]; do printf "HTTP/1.0 200 OK\r\nContent-Length: 2\r\n\r\nok" | nc -l -p 80 >/dev/null; done; sleep infinity'
e238768f1f57ed879b3c54d3eccc1faf58ea37168051eaa6dc826ef3d17fc292
```

```console
root@monitoring-test-debian-13:~# docker run -d --name ignoriert --label projekt=monitor-test --label monitor.ignore=true -p 127.0.0.1:8081:80 alpine:3.22 sh -c 'while [ ! -e /tmp/stop ]; do printf "HTTP/1.0 200 OK\r\nContent-Length: 2\r\n\r\nok" | nc -l -p 80 >/dev/null; done; sleep infinity'
fcd92bdbfd0a5df6a9bc755e26ad90679c9113d6e65a07b8bfd03a5e9c12fb8b
```

```console
root@monitoring-test-debian-13:~# monitor status | grep -E 'STUFE|web8000|ignoriert'
STUFE     PRÜFUNG                             ZUSTAND        MELDUNG
INFO      container/web8000                    running        web8000: läuft (ohne Healthcheck) · CPU 0 %, RAM 0.5 MB
INFO      port/web8000:8000                    http-up        web8000:8000 (http): antwortet mit HTTP 200, 9 ms
```

```console
root@monitoring-test-debian-13:~# docker exec web8000 sh -c 'touch /tmp/stop; pkill nc'
```

```console
root@monitoring-test-debian-13:~# docker exec -d web8000 sh -c 'rm -f /tmp/stop; while [ ! -e /tmp/stop ]; do printf "HTTP/1.0 200 OK\r\nContent-Length: 2\r\n\r\nok" | nc -l -p 80 >/dev/null; done; sleep infinity'
```

## Prüfungen

- bestanden: Neuer Port 8000 nach höchstens 30 s automatisch geprüft (HTTP)
- bestanden: Container web8000 erscheint ohne Konfiguration
- bestanden: Container mit monitor.ignore=true und sein Port werden nicht überwacht
- bestanden: Webserver tot, Container läuft: port/web8000:8000 ERROR gemeldet
- bestanden: Container selbst bleibt INFO
- bestanden: Entwarnung port/web8000:8000

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:39:19" -o short-iso
2026-11-06T15:39:19+01:00 monitoring-test-debian-13 monitor[76787]: [INFO] Meldung (report) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:39:19+01:00 monitoring-test-debian-13 monitor[76795]: [INFO] Meldung (report) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:39:23+01:00 monitoring-test-debian-13 monitor[77728]: [CRITICAL] container/oom: oom: vom Kernel beendet, Arbeitsspeicher reichte nicht (OOM) (vorher INFO)
2026-11-06T15:39:23+01:00 monitoring-test-debian-13 monitor[77728]: [ERROR] container/crashloop: crashloop: startet neu (11 Neustarts, letzter Exit-Code 1) (vorher INFO)
2026-11-06T15:39:23+01:00 monitoring-test-debian-13 monitor[77728]: [ERROR] container/job-fehler: job-fehler: beendet mit Fehler, Exit-Code 3 (vorher INFO)
2026-11-06T15:39:23+01:00 monitoring-test-debian-13 monitor[77728]: [ERROR] container/pausiert: pausiert: hart beendet (Exit-Code 137, SIGKILL), z. B. durch den OOM-Killer bei einem Unterprozess (vorher INFO)
2026-11-06T15:39:23+01:00 monitoring-test-debian-13 monitor[77728]: [ERROR] container/web-starting: web-starting: hart beendet (Exit-Code 137, SIGKILL), z. B. durch den OOM-Killer bei einem Unterprozess (vorher INFO)
2026-11-06T15:39:23+01:00 monitoring-test-debian-13 monitor[77728]: [ERROR] container/web-unhealthy: web-unhealthy: Healthcheck meldet unhealthy (96 Fehlversuche in Folge) · CPU 1.2 %, RAM 0.3 MB (vorher INFO)
2026-11-06T15:39:23+01:00 monitoring-test-debian-13 monitor[77728]: [WARNING] container/angelegt: angelegt: angelegt, aber nie gestartet (vorher INFO)
2026-11-06T15:39:23+01:00 monitoring-test-debian-13 monitor[77743]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:39:23+01:00 monitoring-test-debian-13 monitor[77757]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:39:25+01:00 monitoring-test-debian-13 monitor[77771]: [INFO] Meldung (change) an wiederhol-test zugestellt (HTTP 204, Versuch 2)
2026-11-06T15:39:38+01:00 monitoring-test-debian-13 monitor[79979]: [ERROR] container/flapper: flapper: Healthcheck meldet unhealthy (5 Fehlversuche in Folge) · CPU 0 %, RAM 0.3 MB (vorher INFO)
2026-11-06T15:39:38+01:00 monitoring-test-debian-13 monitor[79979]: [ERROR] port/web8000:8000: web8000:8000 (http): nicht erreichbar (curl 52), 9 ms (vorher INFO)
2026-11-06T15:39:38+01:00 monitoring-test-debian-13 monitor[79994]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:39:38+01:00 monitoring-test-debian-13 monitor[80008]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:39:48+01:00 monitoring-test-debian-13 monitor[81572]: [INFO] container/flapper: flapper: läuft, Healthcheck bestanden · CPU 0.8 %, RAM 0.3 MB (vorher ERROR)
2026-11-06T15:39:48+01:00 monitoring-test-debian-13 monitor[81572]: [INFO] port/web8000:8000: web8000:8000 (http): antwortet mit HTTP 200, 6 ms (vorher ERROR)
2026-11-06T15:39:48+01:00 monitoring-test-debian-13 monitor[81587]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:39:48+01:00 monitoring-test-debian-13 monitor[81601]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
```

## Angekommene Meldungen

| Nr. | Zeit | Webhook | Art | Stufe | Inhalt | Discord-Grenzen |
| --- | --- | --- | --- | --- | --- | --- |
| 0102 | 15:39:23 | discord | change | - | 🔴 CRITICAL · container/oom · 🟠 ERROR · container/crashloop · 🟠 ERROR · container/job-fehler · Weitere 4 Änderungen | ok (4 Embeds, 1549 Zeichen) |
| 0103 | 15:39:23 | json | change | CRITICAL | container/oom INFO->CRITICAL · container/crashloop INFO->ERROR · container/job-fehler INFO->ERROR · container/pausiert INFO->ERROR · container/web-starting INFO->ERROR · container/web-unhealthy INFO->ERROR · container/angelegt INFO->WARNING | - |
| 0104 | 15:39:25 | flaky | change | CRITICAL | container/oom INFO->CRITICAL | - |
| 0105 | 15:39:38 | discord | change | - | 🟠 ERROR · container/flapper · 🟠 ERROR · port/web8000:8000 | ok (2 Embeds, 515 Zeichen) |
| 0106 | 15:39:38 | json | change | ERROR | container/flapper INFO->ERROR · port/web8000:8000 INFO->ERROR | - |
| 0107 | 15:39:48 | discord | change | - | 🟢 INFO · container/flapper · 🟢 INFO · port/web8000:8000 | ok (2 Embeds, 479 Zeichen) |
| 0108 | 15:39:48 | json | change | INFO | container/flapper ERROR->INFO · port/web8000:8000 ERROR->INFO | - |

### JSON-Meldung Nr. 0103 im Original

```json
{
  "schema": "monitor.event/v1",
  "type": "change",
  "host": "monitoring-test-debian-13",
  "time": "2026-11-06T15:39:23+01:00",
  "level": "CRITICAL",
  "summary": {
    "level": "CRITICAL",
    "counts": {
      "INFO": 23,
      "WARNING": 1,
      "ERROR": 5,
      "CRITICAL": 1
    },
    "system": {
      "cpu_percent": 23.3,
      "mem_percent": 29.1,
      "mem_total_mb": 3917,
      "load1": 0.44,
      "load5": 0.38,
      "load15": 0.21,
      "cores": 2,
      "uptime_seconds": 563,
      "uptime": "9 Min 23 s",
      "disks": [
        {
          "mount": "/",
          "used_percent": 1,
          "free_mb": 881639,
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
      "problems": 7
    }
  },
  "events": [
    {
      "id": "container/oom",
      "kind": "container",
      "name": "oom",
      "level": "CRITICAL",
      "status": "oom-killed",
      "message": "oom: vom Kernel beendet, Arbeitsspeicher reichte nicht (OOM)",
      "details": {
        "state": "exited",
        "health": "none",
        "exit_code": 137,
        "restart_count": 0,
        "log_path": "/var/lib/docker/containers/2ba607993f2bc569651e3cce91c6908ca7274188299574e9c4292a9544373e1a/2ba607993f2bc569651e3cce91c6908ca7274188299574e9c4292a9544373e1a-json.log",
        "image": "alpine:3.22",
        "restart_policy": "no",
        "started_at": "2026-11-06T14:31:00.945337415Z",
        "finished_at": "2026-11-06T14:31:00.971219436Z",
        "oom_killed": true,
        "container_id": "2ba607993f2b",
        "hint": "docker logs --tail 50 oom"
      },
      "previous_level": "INFO",
      "change": "worse",
      "suppressed_changes": 0
    },
    {
      "id": "container/crashloop",
      "kind": "container",
      "name": "crashloop",
      "level": "ERROR",
      "status": "restarting",
      "message": "crashloop: startet neu (11 Neustarts, letzter Exit-Code 1)",
      "details": {
        "state": "restarting",
        "health": "none",
        "exit_code": 1,
        "restart_count": 11,
        "log_path": "/var/lib/docker/containers/b8ff615aaf4de2a24272ef133f959de562c398b9626121e00369d2c7879f0c6c/b8ff615aaf4de2a24272ef133f959de562c398b9626121e00369d2c7879f0c6c-json.log",
        "image": "alpine:3.22",
        "restart_policy": "always",
        "started_at": "2026-11-06T14:38:16.458623872Z",
        "finished_at": "2026-11-06T14:38:19.581487806Z",
        "container_id": "b8ff615aaf4d",
        "hint": "docker logs --tail 50 crashloop"
… 128 Zeilen gekürzt …
```

### Discord-Meldung Nr. 0102 im Original

```json
{
  "username": "Monitor monitoring-test-debian-13",
  "content": "🔴 **CRITICAL** auf **monitoring-test-debian-13**",
  "embeds": [
    {
      "title": "🔴 CRITICAL · container/oom",
      "description": "oom: vom Kernel beendet, Arbeitsspeicher reichte nicht (OOM)\nvorher INFO, jetzt CRITICAL",
      "color": 15158332,
      "fields": [
        {
          "name": "state",
          "value": "exited",
          "inline": true
        },
        {
          "name": "health",
          "value": "none",
          "inline": true
        },
        {
          "name": "exit_code",
          "value": "137",
          "inline": true
        },
        {
          "name": "restart_count",
          "value": "0",
          "inline": true
        },
        {
          "name": "log_path",
          "value": "/var/lib/docker/containers/2ba607993f2bc569651e3cce91c6908ca7274188299574e9c4292a9544373e1a/2ba607993f2bc569651e3cce91c6908ca7274188299574e9c4292a954…",
          "inline": false
        },
        {
          "name": "image",
          "value": "alpine:3.22",
          "inline": true
        },
        {
          "name": "restart_policy",
          "value": "no",
          "inline": true
        }
      ],
      "timestamp": "2026-11-06T15:39:23+01:00",
      "footer": {
        "text": "monitoring-test-debian-13 · container · oom-killed"
      }
    },
    {
      "title": "🟠 ERROR · container/crashloop",
      "description": "crashloop: startet neu (11 Neustarts, letzter Exit-Code 1)\nvorher INFO, jetzt ERROR",
      "color": 15105570,
      "fields": [
        {
          "name": "state",
          "value": "restarting",
          "inline": true
        },
        {
          "name": "health",
          "value": "none",
          "inline": true
        },
        {
          "name": "exit_code",
          "value": "1",
          "inline": true
        },
        {
          "name": "restart_count",
          "value": "11",
          "inline": true
        },
        {
          "name": "log_path",
          "value": "/var/lib/docker/containers/b8ff615aaf4de2a24272ef133f959de562c398b9626121e00369d2c7879f0c6c/b8ff615aaf4de2a24272ef133f959de562c398b9626121e00369d2c78…",
          "inline": false
        },
        {
          "name": "image",
          "value": "alpine:3.22",
          "inline": true
        },
        {
          "name": "restart_policy",
          "value": "always",
          "inline": true
        }
… 59 Zeilen gekürzt …
```

