# 12 · Docker fällt aus

> Getestet am 06.11.2026 um 15:35:36 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** ADR 0012, Fall „Docker fällt aus“: Das Monitoring läuft außerhalb von Docker und muss das melden.

**Ablauf:** Docker wird gestoppt. Erwartet: CRITICAL für die Docker-API und den Dienst. Die Ports aus dem letzten Durchlauf werden weiter geprüft, die Datenbank meldet sich als nicht erreichbar. Der Wiederhol-Webhook lehnt die erste Zustellung ab.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# systemctl stop docker.socket docker
```

```console
root@monitoring-test-debian-13:~# monitor status --problems
Monitor auf monitoring-test-debian-13 · Gesamt: CRITICAL · Stand vor 0 s · Durchlauf 4161 ms
CPU 10.9 % · RAM 24.9 % · Load 0.50 0.39 0.18 (2 Kerne) · Uptime 6 Min 1 s
Container: 0 von 0 laufen · INFO 13 · WARNING 0 · ERROR 0 · CRITICAL 6

STUFE     PRÜFUNG                             ZUSTAND        MELDUNG
CRITICAL  docker/daemon                        unreachable    Docker-API nicht erreichbar über /var/run/docker.sock
CRITICAL  port/db:5432                         unreachable    db:5432 (postgres): nicht erreichbar (Connection refused), 5 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf
CRITICAL  port/mailserver:143                  unreachable    mailserver:143 (imap): nicht erreichbar (Connection refused), 3 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf
CRITICAL  port/mailserver:25                   unreachable    mailserver:25 (smtp): nicht erreichbar (Connection refused), 2 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf
CRITICAL  port/mailserver:587                  unreachable    mailserver:587 (smtp): nicht erreichbar (Connection refused), 3 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf
CRITICAL  service/docker                       inactive       Dienst docker läuft nicht (inactive)
```
_Exit-Code 3 (monitor status und check: 1 WARNING, 2 ERROR, 3 CRITICAL, 4 kein Zustand oder Fehler)_

```console
root@monitoring-test-debian-13:~# systemctl start docker
```

## Prüfungen

- bestanden: docker/daemon CRITICAL gemeldet
- bestanden: service/docker CRITICAL gemeldet
- bestanden: port/db:5432 ohne Docker weiter geprüft und CRITICAL
- bestanden: Wiederhol-Webhook: Zustellung nach Ablehnung im 2. Versuch
- bestanden: Entwarnung docker/daemon
- bestanden: Entwarnung port/db:5432

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:35:36" -o short-iso
2026-11-06T15:35:37+01:00 monitoring-test-debian-13 monitor[49132]: [INFO] Meldung (change) an wiederhol-test zugestellt (HTTP 204, Versuch 2)
2026-11-06T15:35:46+01:00 monitoring-test-debian-13 monitor[49998]: [INFO] container/crashloop: container/crashloop gibt es nicht mehr (vorher ERROR)
2026-11-06T15:35:46+01:00 monitoring-test-debian-13 monitor[49998]: [INFO] container/angelegt: container/angelegt gibt es nicht mehr (vorher WARNING)
2026-11-06T15:35:46+01:00 monitoring-test-debian-13 monitor[49998]: [INFO] container/pausiert: container/pausiert gibt es nicht mehr (vorher WARNING)
2026-11-06T15:35:46+01:00 monitoring-test-debian-13 monitor[49998]: [INFO] container/job-fehler: container/job-fehler gibt es nicht mehr (vorher ERROR)
2026-11-06T15:35:46+01:00 monitoring-test-debian-13 monitor[49998]: [INFO] container/web-unhealthy: container/web-unhealthy gibt es nicht mehr (vorher ERROR)
2026-11-06T15:35:46+01:00 monitoring-test-debian-13 monitor[49998]: [INFO] container/web-starting: container/web-starting gibt es nicht mehr (vorher WARNING)
2026-11-06T15:35:46+01:00 monitoring-test-debian-13 monitor[49998]: [INFO] container/oom: container/oom gibt es nicht mehr (vorher CRITICAL)
2026-11-06T15:35:46+01:00 monitoring-test-debian-13 monitor[50033]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:35:46+01:00 monitoring-test-debian-13 monitor[50047]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:35:48+01:00 monitoring-test-debian-13 monitor[50061]: [INFO] Meldung (change) an wiederhol-test zugestellt (HTTP 204, Versuch 2)
2026-11-06T15:35:50+01:00 monitoring-test-debian-13 monitor[50600]: [WARNING] service/docker: Dienst docker ist im Übergang: deactivating (vorher INFO)
2026-11-06T15:35:50+01:00 monitoring-test-debian-13 monitor[50615]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:35:50+01:00 monitoring-test-debian-13 monitor[50629]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51134]: [CRITICAL] docker/daemon: Docker-API nicht erreichbar über /var/run/docker.sock (vorher INFO)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51134]: [CRITICAL] port/db:5432: db:5432 (postgres): nicht erreichbar (Connection refused), 2 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf (vorher INFO)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51134]: [CRITICAL] port/mailserver:143: mailserver:143 (imap): nicht erreichbar (Connection refused), 2 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf (vorher INFO)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51134]: [CRITICAL] port/mailserver:25: mailserver:25 (smtp): nicht erreichbar (Connection refused), 2 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf (vorher INFO)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51134]: [CRITICAL] port/mailserver:587: mailserver:587 (smtp): nicht erreichbar (Connection refused), 2 ms · Docker nicht erreichbar, Port aus dem letzten Durchlauf (vorher INFO)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51150]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:35:55+01:00 monitoring-test-debian-13 monitor[51163]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:35:57+01:00 monitoring-test-debian-13 monitor[51178]: [INFO] Meldung (change) an wiederhol-test zugestellt (HTTP 204, Versuch 2)
2026-11-06T15:36:01+01:00 monitoring-test-debian-13 monitor[51722]: [CRITICAL] service/docker: Dienst docker läuft nicht (inactive) (vorher WARNING)
2026-11-06T15:36:01+01:00 monitoring-test-debian-13 monitor[51737]: [INFO] Meldung (change) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:36:01+01:00 monitoring-test-debian-13 monitor[51750]: [INFO] Meldung (change) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:36:03+01:00 monitoring-test-debian-13 monitor[51765]: [INFO] Meldung (change) an wiederhol-test zugestellt (HTTP 204, Versuch 2)
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
```

## Angekommene Meldungen

| Nr. | Zeit | Webhook | Art | Stufe | Inhalt | Discord-Grenzen |
| --- | --- | --- | --- | --- | --- | --- |
| 0066 | 15:35:37 | flaky | change | INFO | port/mailserver:25 CRITICAL->INFO · port/mailserver:587 CRITICAL->INFO | - |
| 0067 | 15:35:46 | discord | change | - | 🟢 INFO · container/crashloop · 🟢 INFO · container/angelegt · 🟢 INFO · container/pausiert · Weitere 4 Änderungen | ok (4 Embeds, 590 Zeichen) |
| 0068 | 15:35:46 | json | change | INFO | container/crashloop ERROR->INFO · container/angelegt WARNING->INFO · container/pausiert WARNING->INFO · container/job-fehler ERROR->INFO · container/web-unhealthy ERROR->INFO · container/web-starting WARNING->INFO · container/oom CRITICAL->INFO | - |
| 0069 | 15:35:48 | flaky | change | INFO | container/oom CRITICAL->INFO | - |
| 0070 | 15:35:50 | discord | change | - | 🟡 WARNING · service/docker | ok (1 Embeds, 341 Zeichen) |
| 0071 | 15:35:50 | json | change | WARNING | service/docker INFO->WARNING | - |
| 0072 | 15:35:55 | discord | change | - | 🔴 CRITICAL · docker/daemon · 🔴 CRITICAL · port/db:5432 · 🔴 CRITICAL · port/mailserver:143 · Weitere 2 Änderungen | ok (4 Embeds, 1139 Zeichen) |
| 0073 | 15:35:55 | json | change | CRITICAL | docker/daemon INFO->CRITICAL · port/db:5432 INFO->CRITICAL · port/mailserver:143 INFO->CRITICAL · port/mailserver:25 INFO->CRITICAL · port/mailserver:587 INFO->CRITICAL | - |
| 0074 | 15:35:57 | flaky | change | CRITICAL | docker/daemon INFO->CRITICAL · port/db:5432 INFO->CRITICAL · port/mailserver:143 INFO->CRITICAL · port/mailserver:25 INFO->CRITICAL · port/mailserver:587 INFO->CRITICAL | - |
| 0075 | 15:36:01 | discord | change | - | 🔴 CRITICAL · service/docker | ok (1 Embeds, 357 Zeichen) |
| 0076 | 15:36:01 | json | change | CRITICAL | service/docker WARNING->CRITICAL | - |
| 0077 | 15:36:03 | flaky | change | CRITICAL | service/docker WARNING->CRITICAL | - |
| 0078 | 15:36:15 | discord | change | - | 🔴 CRITICAL · container/oom · 🟠 ERROR · container/crashloop · 🟠 ERROR · container/job-fehler · Weitere 11 Änderungen | ok (4 Embeds, 1948 Zeichen) |
| 0079 | 15:36:15 | json | change | CRITICAL | container/oom INFO->CRITICAL · container/crashloop INFO->ERROR · container/job-fehler INFO->ERROR · container/pausiert INFO->ERROR · container/web-starting INFO->ERROR · container/web-unhealthy INFO->ERROR · container/angelegt INFO->WARNING · container/mailserver INFO->WARNING · docker/daemon CRITICAL->INFO · port/db:5432 CRITICAL->INFO · port/mailserver:143 CRITICAL->INFO · port/mailserver:25 CRITICAL->INFO · port/mailserver:587 CRITICAL->INFO · service/docker CRITICAL->INFO | - |

### JSON-Meldung Nr. 0068 im Original

```json
{
  "schema": "monitor.event/v1",
  "type": "change",
  "host": "monitoring-test-debian-13",
  "time": "2026-11-06T15:35:46+01:00",
  "level": "INFO",
  "summary": {
    "level": "ERROR",
    "counts": {
      "INFO": 13,
      "WARNING": 1,
      "ERROR": 1,
      "CRITICAL": 0
    },
    "system": {
      "cpu_percent": 16.3,
      "mem_percent": 30.0,
      "mem_total_mb": 3917,
      "load1": 0.49,
      "load5": 0.38,
      "load15": 0.18,
      "cores": 2,
      "uptime_seconds": 341,
      "uptime": "5 Min 41 s",
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
      "total": 0,
      "running": 0,
      "problems": 0
    }
  },
  "events": [
    {
      "id": "container/crashloop",
      "kind": "container",
      "name": "crashloop",
      "level": "INFO",
      "status": "gone",
      "message": "container/crashloop gibt es nicht mehr",
      "details": {},
      "previous_level": "ERROR",
      "change": "recovered",
      "suppressed_changes": 0
    },
    {
      "id": "container/angelegt",
      "kind": "container",
      "name": "angelegt",
      "level": "INFO",
      "status": "gone",
      "message": "container/angelegt gibt es nicht mehr",
      "details": {},
      "previous_level": "WARNING",
      "change": "recovered",
      "suppressed_changes": 0
    },
    {
      "id": "container/pausiert",
      "kind": "container",
      "name": "pausiert",
      "level": "INFO",
      "status": "gone",
      "message": "container/pausiert gibt es nicht mehr",
      "details": {},
      "previous_level": "WARNING",
      "change": "recovered",
      "suppressed_changes": 0
    },
    {
      "id": "container/job-fehler",
      "kind": "container",
      "name": "job-fehler",
      "level": "INFO",
      "status": "gone",
      "message": "container/job-fehler gibt es nicht mehr",
      "details": {},
… 42 Zeilen gekürzt …
```

### Discord-Meldung Nr. 0067 im Original

```json
{
  "username": "Monitor monitoring-test-debian-13",
  "content": "Entwarnung auf **monitoring-test-debian-13**",
  "embeds": [
    {
      "title": "🟢 INFO · container/crashloop",
      "description": "container/crashloop gibt es nicht mehr\nvorher ERROR, jetzt INFO",
      "color": 3066993,
      "fields": [],
      "timestamp": "2026-11-06T15:35:46+01:00",
      "footer": {
        "text": "monitoring-test-debian-13 · container · gone"
      }
    },
    {
      "title": "🟢 INFO · container/angelegt",
      "description": "container/angelegt gibt es nicht mehr\nvorher WARNING, jetzt INFO",
      "color": 3066993,
      "fields": [],
      "timestamp": "2026-11-06T15:35:46+01:00",
      "footer": {
        "text": "monitoring-test-debian-13 · container · gone"
      }
    },
    {
      "title": "🟢 INFO · container/pausiert",
      "description": "container/pausiert gibt es nicht mehr\nvorher WARNING, jetzt INFO",
      "color": 3066993,
      "fields": [],
      "timestamp": "2026-11-06T15:35:46+01:00",
      "footer": {
        "text": "monitoring-test-debian-13 · container · gone"
      }
    },
    {
      "title": "Weitere 4 Änderungen",
      "color": 3066993,
      "description": "🟢 container/job-fehler gibt es nicht mehr\n🟢 container/web-unhealthy gibt es nicht mehr\n🟢 container/web-starting gibt es nicht mehr\n🟢 container/oom gibt es nicht mehr"
    }
  ]
}
```

