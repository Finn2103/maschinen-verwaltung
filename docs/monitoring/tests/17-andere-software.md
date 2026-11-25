# 17 · Nutzung durch andere Software

> Getestet am 06.11.2026 um 15:38:00 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** Prompts: „Skript Modularer Bauen und standardisieren was die Fehlermeldungen und Report Meldungen angeht“, „dass dieses Skript zukünftig auch von anderer Software genutzt werden kann“.

**Ablauf:** Andere Programme lesen den Zustand als JSON (monitor status --json oder /run/monitor/status.json), werten Exit-Codes aus oder empfangen den JSON-Webhook mit festem Schema.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# monitor status --json | jq "{schema, host, level, counts, system}"
{
  "schema": "monitor.status/v1",
  "host": "monitoring-test-debian-13",
  "level": "CRITICAL",
  "counts": {
    "INFO": 22,
    "WARNING": 1,
    "ERROR": 6,
    "CRITICAL": 1
  },
  "system": {
    "cpu_percent": 13.2,
    "mem_percent": 28.8,
    "mem_total_mb": 3917,
    "load1": 0.28,
    "load5": 0.35,
    "load15": 0.19,
    "cores": 2,
    "uptime_seconds": 476,
    "uptime": "7 Min 56 s",
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
  }
}
```

```console
root@monitoring-test-debian-13:~# monitor status >/dev/null; echo "Exit-Code: $?"
Exit-Code: 3
```

```console
root@monitoring-test-debian-13:~# monitor check --json | jq -r ".checks[] | [.level, .id] | @tsv" | head -n 12
CRITICAL	container/oom
ERROR	container/crashloop
ERROR	container/flapper
ERROR	container/job-fehler
ERROR	container/pausiert
ERROR	container/web-starting
ERROR	container/web-unhealthy
WARNING	container/angelegt
INFO	container/db
INFO	container/job-ok
INFO	container/mailserver
INFO	disk//
```

```console
root@monitoring-test-debian-13:~# monitor test-webhook json-test
[INFO] Meldung (test) an json-test zugestellt (HTTP 204, Versuch 1)
```

## Prüfungen

- bestanden: status.json hat schema monitor.status/v1
- bestanden: JSON-Webhook hat schema monitor.event/v1
- bestanden: Bericht hat schema monitor.report/v1
- bestanden: Exit-Code von monitor status entspricht der Gesamtstufe

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:38:00" -o short-iso
2026-11-06T15:38:00+01:00 monitoring-test-debian-13 monitor[15250]: [INFO] container/flapper: Wechsel zu ERROR unterdrückt (Spam-Schutz, 2 Meldungen in 120 s)
```

## Angekommene Meldungen

| Nr. | Zeit | Webhook | Art | Stufe | Inhalt | Discord-Grenzen |
| --- | --- | --- | --- | --- | --- | --- |
| 0091 | 15:38:04 | json | test | INFO | Probleme: 0 | - |

