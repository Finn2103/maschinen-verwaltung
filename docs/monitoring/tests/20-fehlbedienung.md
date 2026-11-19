# 20 · Fehlbedienung und Absturz

> Getestet am 06.11.2026 um 15:39:04 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** Prompt: „standardisieren was die Fehlermeldungen … angeht“. ADR 0012: Das Monitoring läuft allein auf dem Server und muss Fehler selbst sichtbar machen.

**Ablauf:** Unsichere Rechte an der Konfiguration, kaputtes JSON, eine unbekannte Option, ein Absturz des Dienstes (kill -9) und monitor status bei gestopptem Dienst.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# ls -l /root/monitor-test/unsicher.conf; MONITOR_CONF=/root/monitor-test/unsicher.conf monitor check
-rw-rw-rw- 1 root root 1540 Nov 23 15:39 /root/monitor-test/unsicher.conf
monitor: /root/monitor-test/unsicher.conf muss root gehören und darf nur für root beschreibbar sein
```
_Exit-Code 4 (monitor status und check: 1 WARNING, 2 ERROR, 3 CRITICAL, 4 kein Zustand oder Fehler)_

```console
root@monitoring-test-debian-13:~# cat /root/monitor-test/kaputt.conf
CHECKS="endpoints"
ENDPOINTS='[{"name":"kaputt",'
```

```console
root@monitoring-test-debian-13:~# MONITOR_CONF=/root/monitor-test/kaputt.conf monitor validate
FEHLER: ENDPOINTS ist keine JSON-Liste
FEHLER: jeder Endpoint braucht url (http), port (tcp, postgres, smtp, imap, pop3) oder command
Webhooks: 
Endpoints: 
```
_Exit-Code 1_

```console
root@monitoring-test-debian-13:~# MONITOR_CONF=/root/monitor-test/kaputt.conf monitor check --json | jq '.checks[] | select(.id == "monitor/endpoints")'
{
  "id": "monitor/endpoints",
  "kind": "monitor",
  "name": "endpoints",
  "level": "ERROR",
  "status": "config",
  "message": "ENDPOINTS ist keine gültige JSON-Liste",
  "details": {}
}
```

```console
root@monitoring-test-debian-13:~# monitor set GIBTSNICHT=1
monitor: unbekannte Option: GIBTSNICHT
```
_Exit-Code 4_

```console
root@monitoring-test-debian-13:~# kill -9 15250
```

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since '2026-11-06 15:39:04' -o short-iso | grep -E 'Main process exited|Scheduled restart|Started|gestartet'
2026-11-06T15:39:04+01:00 monitoring-test-debian-13 systemd[1]: monitor.service: Main process exited, code=killed, status=9/KILL
2026-11-06T15:39:09+01:00 monitoring-test-debian-13 systemd[1]: monitor.service: Scheduled restart job, restart counter is at 1.
2026-11-06T15:39:09+01:00 monitoring-test-debian-13 systemd[1]: Started monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
2026-11-06T15:39:09+01:00 monitoring-test-debian-13 monitor[75664]: [INFO] monitor 2.0.0 gestartet: alle 5 s, Module: system docker services endpoints, 3 Webhook(s)
```

```console
root@monitoring-test-debian-13:~# systemctl stop monitor
```

```console
root@monitoring-test-debian-13:~# monitor status
Kein Zustand in /run/monitor/status.json. Läuft der Dienst? systemctl status monitor
```
_Exit-Code 4 (monitor status und check: 1 WARNING, 2 ERROR, 3 CRITICAL, 4 kein Zustand oder Fehler)_

```console
root@monitoring-test-debian-13:~# systemctl start monitor
```

## Prüfungen

- bestanden: Konfiguration für alle beschreibbar: monitor startet nicht (Exit-Code 4)
- bestanden: validate erkennt kaputtes JSON
- bestanden: Kaputtes JSON wird als ERROR gemeldet, nicht verschluckt
- bestanden: Unbekannte Option wird abgelehnt
- bestanden: systemd startet monitor nach kill -9 neu
- bestanden: Nach dem Neustart wieder ein aktueller Zustand
- bestanden: monitor status bei gestopptem Dienst: Exit-Code 4 mit Hinweis
- bestanden: Dienst läuft wieder mit aktuellem Zustand

## Beobachtungen

- Nach einem Neustart kennt monitor die alten Meldungen nicht mehr (Spam-Schutz im RAM). Offene Probleme werden deshalb einmal neu gemeldet.

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:39:04" -o short-iso
2026-11-06T15:39:04+01:00 monitoring-test-debian-13 systemd[1]: monitor.service: Main process exited, code=killed, status=9/KILL
2026-11-06T15:39:04+01:00 monitoring-test-debian-13 systemd[1]: monitor.service: Failed with result 'signal'.
2026-11-06T15:39:04+01:00 monitoring-test-debian-13 systemd[1]: monitor.service: Consumed 37.794s CPU time, 75.5M memory peak.
2026-11-06T15:39:09+01:00 monitoring-test-debian-13 systemd[1]: monitor.service: Scheduled restart job, restart counter is at 1.
2026-11-06T15:39:09+01:00 monitoring-test-debian-13 systemd[1]: Started monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
2026-11-06T15:39:09+01:00 monitoring-test-debian-13 monitor[75664]: [INFO] monitor 2.0.0 gestartet: alle 5 s, Module: system docker services endpoints, 3 Webhook(s)
2026-11-06T15:39:13+01:00 monitoring-test-debian-13 monitor[76179]: [INFO] Meldung (report) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:39:13+01:00 monitoring-test-debian-13 monitor[76187]: [INFO] Meldung (report) an json-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:39:14+01:00 monitoring-test-debian-13 systemd[1]: Stopping monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14)...
2026-11-06T15:39:14+01:00 monitoring-test-debian-13 monitor[75664]: [INFO] monitor beendet
2026-11-06T15:39:14+01:00 monitoring-test-debian-13 systemd[1]: monitor.service: Deactivated successfully.
2026-11-06T15:39:14+01:00 monitoring-test-debian-13 systemd[1]: Stopped monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
2026-11-06T15:39:14+01:00 monitoring-test-debian-13 systemd[1]: Started monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
2026-11-06T15:39:14+01:00 monitoring-test-debian-13 monitor[76277]: [INFO] monitor 2.0.0 gestartet: alle 5 s, Module: system docker services endpoints, 3 Webhook(s)
2026-11-06T15:39:19+01:00 monitoring-test-debian-13 monitor[76787]: [INFO] Meldung (report) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:39:19+01:00 monitoring-test-debian-13 monitor[76795]: [INFO] Meldung (report) an json-test zugestellt (HTTP 204, Versuch 1)
```

## Angekommene Meldungen

| Nr. | Zeit | Webhook | Art | Stufe | Inhalt | Discord-Grenzen |
| --- | --- | --- | --- | --- | --- | --- |
| 0098 | 15:39:13 | discord | report | - | 🔴 Bericht monitoring-test-debian-13: CRITICAL | ok (1 Embeds, 914 Zeichen) |
| 0099 | 15:39:13 | json | report | CRITICAL | Probleme: 8 | - |
| 0100 | 15:39:19 | discord | report | - | 🔴 Bericht monitoring-test-debian-13: CRITICAL | ok (1 Embeds, 826 Zeichen) |
| 0101 | 15:39:19 | json | report | CRITICAL | Probleme: 7 | - |

### Discord-Meldung Nr. 0098 im Original

```json
{
  "username": "Monitor monitoring-test-debian-13",
  "embeds": [
    {
      "title": "🔴 Bericht monitoring-test-debian-13: CRITICAL",
      "color": 15158332,
      "timestamp": "2026-11-06T15:39:13+01:00",
      "fields": [
        {
          "name": "CPU",
          "value": "15.3 %",
          "inline": true
        },
        {
          "name": "RAM",
          "value": "29.1 % von 3917 MB",
          "inline": true
        },
        {
          "name": "Load",
          "value": "0.35 / 0.36 / 0.20 (2 Kerne)",
          "inline": true
        },
        {
          "name": "Uptime",
          "value": "9 Min 14 s",
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
          "value": "🔴 oom: vom Kernel beendet, Arbeitsspeicher reichte nicht (OOM)\n🟠 crashloop: startet neu (11 Neustarts, letzter Exit-Code 1)\n🟠 flapper: Healthcheck meldet unhealthy (5 Fehlversuche in Folge) · CPU 0 %, RAM 0.3 MB\n🟠 job-fehler: beendet mit Fehler, Exit-Code 3\n🟠 pausiert: hart beendet (Exit-Code 137, SIGKILL), z. B. durch den OOM-Killer bei einem Unterprozess\n🟠 web-starting: hart beendet (Exit-Code 137, SIGKILL), z. B. durch den OOM-Killer bei einem Unterprozess\n🟠 web-unhealthy: Healthcheck meldet unhealthy (91 Fehlversuche in Folge) · CPU 1 %, RAM 0.3 MB\n🟡 angelegt: angelegt, aber nie gestartet"
        }
      ],
      "footer": {
        "text": "monitor · Durchlauf 4117 ms"
      }
    }
  ]
}
```

