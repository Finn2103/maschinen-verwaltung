# 15 · Regelmäßiger Bericht an Discord und JSON

> Getestet am 06.11.2026 um 15:37:59 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** Prompts: „Discord für eine Discord Webhook oder einfach nur Json Webhook“, „In der Regelmäßigen Webhook wäre noch die Load Average und Uptime gut“.

**Ablauf:** Alle 60 s (im Test) geht ein Bericht mit CPU, RAM, Platten, Load Average und Uptime an die Webhooks. Unten der letzte Bericht im Original, einmal als JSON, einmal im Discord-Format.

## Letzter Bericht als JSON (Original)

```json
{
  "schema": "monitor.report/v1",
  "type": "report",
  "host": "monitoring-test-debian-13",
  "time": "2026-11-06T15:37:35+01:00",
  "level": "CRITICAL",
  "counts": {
    "INFO": 22,
    "WARNING": 1,
    "ERROR": 6,
    "CRITICAL": 1
  },
  "system": {
    "cpu_percent": 17.9,
    "mem_percent": 29.0,
    "mem_total_mb": 3917,
    "load1": 0.4,
    "load5": 0.38,
    "load15": 0.2,
    "cores": 2,
    "uptime_seconds": 456,
    "uptime": "7 Min 36 s",
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
    "problems": 8
  },
  "cycle_ms": 4097,
  "problems": [
    {
      "id": "container/oom",
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
      }
    },
    {
      "id": "container/crashloop",
      "level": "ERROR",
      "status": "restarting",
      "message": "crashloop: startet neu (10 Neustarts, letzter Exit-Code 1)",
      "details": {
        "state": "restarting",
        "health": "none",
        "exit_code": 1,
        "restart_count": 10,
        "log_path": "/var/lib/docker/containers/b8ff615aaf4de2a24272ef133f959de562c398b9626121e00369d2c7879f0c6c/b8ff615aaf4de2a24272ef133f959de562c398b9626121e00369d2c7879f0c6c-json.log",
        "image": "alpine:3.22",
        "restart_policy": "always",
        "started_at": "2026-11-06T14:37:22.061042811Z",
        "finished_at": "2026-11-06T14:37:25.175040505Z",
        "container_id": "b8ff615aaf4d",
… 124 Zeilen gekürzt …
```

## Letzter Bericht im Discord-Format (Original)

```json
{
  "username": "Monitor monitoring-test-debian-13",
  "embeds": [
    {
      "title": "🔴 Bericht monitoring-test-debian-13: CRITICAL",
      "color": 15158332,
      "timestamp": "2026-11-06T15:37:35+01:00",
      "fields": [
        {
          "name": "CPU",
          "value": "17.9 %",
          "inline": true
        },
        {
          "name": "RAM",
          "value": "29.0 % von 3917 MB",
          "inline": true
        },
        {
          "name": "Load",
          "value": "0.40 / 0.38 / 0.20 (2 Kerne)",
          "inline": true
        },
        {
          "name": "Uptime",
          "value": "7 Min 36 s",
          "inline": true
        },
        {
          "name": "Container",
          "value": "4 von 11 laufen, 8 mit Problem",
          "inline": true
        },
        {
          "name": "Prüfungen",
          "value": "INFO 22 · WARNING 1 · ERROR 6 · CRITICAL 1",
          "inline": false
        },
        {
          "name": "Platten",
          "value": "/: 1 % (881639 MB frei)\n/srv/daten: 1 % (905 MB frei)",
          "inline": false
        },
        {
          "name": "Offene Probleme",
          "inline": false,
          "value": "🔴 oom: vom Kernel beendet, Arbeitsspeicher reichte nicht (OOM)\n🟠 crashloop: startet neu (10 Neustarts, letzter Exit-Code 1)\n🟠 flapper: Healthcheck meldet unhealthy (4 Fehlversuche in Folge) · CPU 1.1 %, RAM 0.3 MB\n🟠 job-fehler: beendet mit Fehler, Exit-Code 3\n🟠 pausiert: hart beendet (Exit-Code 137, SIGKILL), z. B. durch den OOM-Killer bei einem Unterprozess\n🟠 web-starting: hart beendet (Exit-Code 137, SIGKILL), z. B. durch den OOM-Killer bei einem Unterprozess\n🟠 web-unhealthy: Healthcheck meldet unhealthy (43 Fehlversuche in Folge) · CPU 0 %, RAM 0.3 MB\n🟡 angelegt: angelegt, aber nie gestartet"
        }
      ],
      "footer": {
        "text": "monitor · Durchlauf 4097 ms"
      }
    }
  ]
}
```

_Keine Befehle: geprüft wurde der Zustand des laufenden Dienstes._

## Prüfungen

- bestanden: Mindestens 2 Berichte an den JSON-Webhook
- bestanden: Bericht enthält Load Average und Uptime
- bestanden: Bericht enthält CPU, RAM und Platten
- bestanden: Discord-Bericht hat die Felder Load und Uptime
- bestanden: Alle Discord-Nachrichten halten die Grenzen ein (10 Embeds, 6000 Zeichen)

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:37:59" -o short-iso
-- No entries --
```

## Angekommene Meldungen

In diesem Schritt kam keine Meldung.

