# 09 · Fall 2a: Speicher voll (Platte)

> Getestet am 06.11.2026 um 15:34:15 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** AK 2 und 3 aus #14: „bei vollem Speicher wird eine Benachrichtigung ausgelöst“. ADR 0012: Das Monitoring muss bei voller Platte selbst weiterarbeiten.

**Ablauf:** Die Testplatte /srv/daten (1 GB) wird bis zum letzten Block gefüllt. Erwartet: CRITICAL mit den größten Ordnern, das Monitoring prüft weiter, nach dem Aufräumen Entwarnung.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# df -h /srv/daten
Filesystem      Size  Used Avail Use% Mounted on
/dev/loop0      974M  288K  906M   1% /srv/daten
```

```console
root@monitoring-test-debian-13:~# df -h /srv/daten
Filesystem      Size  Used Avail Use% Mounted on
/dev/loop0      974M  958M     0 100% /srv/daten
```

```console
root@monitoring-test-debian-13:~# touch /srv/daten/uploads/noch-eine-datei
```

```console
root@monitoring-test-debian-13:~# monitor status | grep -E 'Monitor auf|disk/'
Monitor auf monitoring-test-debian-13 · Gesamt: CRITICAL · Stand vor 2 s · Durchlauf 4170 ms
CRITICAL  disk//srv/daten                      100%           Platte /srv/daten zu 100 % belegt (0 MB frei)
INFO      disk//                               1%             Platte / zu 1 % belegt (881640 MB frei)
```

```console
root@monitoring-test-debian-13:~# rm -f /srv/daten/uploads/grosse-datei.bin /srv/daten/uploads/rest.bin /srv/daten/backups/sicherung-alt.tar /srv/daten/uploads/noch-eine-datei
```

## Prüfungen

- bestanden: disk//srv/daten CRITICAL gemeldet
- bestanden: Discord-Meldung zur vollen Platte angekommen
- bestanden: Meldung nennt die größten Ordner (uploads, backups)
- bestanden: Monitoring arbeitet weiter, während die Platte voll ist (Zustand jünger als 15 s)
- bestanden: Entwarnung disk//srv/daten

## Beobachtungen

- Gemeldet nach 11 s.

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:34:15" -o short-iso
2026-11-06T15:34:15+01:00 monitoring-test-debian-13 monitor[37584]: [INFO] endpoint/test-dienst: test-dienst antwortet mit 200 in 3 ms (vorher ERROR)
2026-11-06T15:34:15+01:00 monitoring-test-debian-13 monitor[37599]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:34:15+01:00 monitoring-test-debian-13 monitor[37612]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:34:25+01:00 monitoring-test-debian-13 monitor[15250]: [INFO] container/flapper: Wechsel zu ERROR unterdrückt (Spam-Schutz, 2 Meldungen in 120 s)
2026-11-06T15:34:25+01:00 monitoring-test-debian-13 monitor[39158]: [CRITICAL] disk//srv/daten: Platte /srv/daten zu 100 % belegt (0 MB frei) (vorher INFO)
2026-11-06T15:34:25+01:00 monitoring-test-debian-13 monitor[39173]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:34:25+01:00 monitoring-test-debian-13 monitor[39187]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:34:27+01:00 monitoring-test-debian-13 monitor[39201]: [INFO] Meldung (change) an wiederhol-test zugestellt (HTTP 204, Versuch 2)
2026-11-06T15:34:36+01:00 monitoring-test-debian-13 monitor[40402]: [INFO] Meldung (report) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:34:36+01:00 monitoring-test-debian-13 monitor[40411]: [INFO] Meldung (report) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:34:50+01:00 monitoring-test-debian-13 monitor[15250]: [INFO] container/flapper: Wechsel zu ERROR unterdrückt (Spam-Schutz, 2 Meldungen in 120 s)
2026-11-06T15:34:50+01:00 monitoring-test-debian-13 monitor[42307]: [INFO] disk//srv/daten: Platte /srv/daten zu 1 % belegt (905 MB frei) (vorher CRITICAL)
2026-11-06T15:34:50+01:00 monitoring-test-debian-13 monitor[42322]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:34:50+01:00 monitoring-test-debian-13 monitor[42335]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
```

## Angekommene Meldungen

| Nr. | Zeit | Webhook | Art | Stufe | Inhalt | Discord-Grenzen |
| --- | --- | --- | --- | --- | --- | --- |
| 0047 | 15:34:25 | discord | change | - | 🔴 CRITICAL · disk//srv/daten | ok (1 Embeds, 228 Zeichen) |
| 0048 | 15:34:25 | json | change | CRITICAL | disk//srv/daten INFO->CRITICAL | - |
| 0049 | 15:34:27 | flaky | change | CRITICAL | disk//srv/daten INFO->CRITICAL | - |
| 0050 | 15:34:36 | discord | report | - | 🔴 Bericht monitoring-test-debian-13: CRITICAL | ok (1 Embeds, 768 Zeichen) |
| 0051 | 15:34:36 | json | report | CRITICAL | Probleme: 8 | - |
| 0052 | 15:34:50 | discord | change | - | 🟢 INFO · disk//srv/daten | ok (1 Embeds, 220 Zeichen) |
| 0053 | 15:34:50 | json | change | INFO | disk//srv/daten CRITICAL->INFO | - |

### JSON-Meldung Nr. 0048 im Original

```json
{
  "schema": "monitor.event/v1",
  "type": "change",
  "host": "monitoring-test-debian-13",
  "time": "2026-11-06T15:34:25+01:00",
  "level": "CRITICAL",
  "summary": {
    "level": "CRITICAL",
    "counts": {
      "INFO": 21,
      "WARNING": 3,
      "ERROR": 4,
      "CRITICAL": 2
    },
    "system": {
      "cpu_percent": 20.3,
      "mem_percent": 30.5,
      "mem_total_mb": 3917,
      "load1": 0.35,
      "load5": 0.33,
      "load15": 0.15,
      "cores": 2,
      "uptime_seconds": 266,
      "uptime": "4 Min 26 s",
      "disks": [
        {
          "mount": "/srv/daten",
          "used_percent": 100,
          "free_mb": 0,
          "level": "CRITICAL"
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
      "id": "disk//srv/daten",
      "kind": "disk",
      "name": "/srv/daten",
      "level": "CRITICAL",
      "status": "100%",
      "message": "Platte /srv/daten zu 100 % belegt (0 MB frei)",
      "details": {
        "mount": "/srv/daten",
        "used_percent": 100,
        "inode_percent": 1,
        "free_mb": 0,
        "size_mb": 973,
        "used_mb": 957,
        "device": "/dev/loop0",
        "fstype": "ext4",
        "largest_dirs": [
          {
            "path": "/srv/daten/uploads",
            "size_mb": 657
          },
          {
            "path": "/srv/daten/backups",
            "size_mb": 300
          },
          {
            "path": "/srv/daten/lost+found",
            "size_mb": 0
          }
        ]
      },
      "previous_level": "INFO",
      "change": "worse",
      "suppressed_changes": 0
    }
  ]
}
```

### Discord-Meldung Nr. 0047 im Original

```json
{
  "username": "Monitor monitoring-test-debian-13",
  "content": "🔴 **CRITICAL** auf **monitoring-test-debian-13**",
  "embeds": [
    {
      "title": "🔴 CRITICAL · disk//srv/daten",
      "description": "Platte /srv/daten zu 100 % belegt (0 MB frei)\nvorher INFO, jetzt CRITICAL",
      "color": 15158332,
      "fields": [
        {
          "name": "mount",
          "value": "/srv/daten",
          "inline": true
        },
        {
          "name": "used_percent",
          "value": "100",
          "inline": true
        },
        {
          "name": "inode_percent",
          "value": "1",
          "inline": true
        },
        {
          "name": "free_mb",
          "value": "0",
          "inline": true
        },
        {
          "name": "size_mb",
          "value": "973",
          "inline": true
        },
        {
          "name": "used_mb",
          "value": "957",
          "inline": true
        },
        {
          "name": "device",
          "value": "/dev/loop0",
          "inline": true
        }
      ],
      "timestamp": "2026-11-06T15:34:25+01:00",
      "footer": {
        "text": "monitoring-test-debian-13 · disk · 100%"
      }
    }
  ]
}
```

