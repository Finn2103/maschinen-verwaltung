# 01 · Installation und Einrichtung als Code

> Getestet am 06.11.2026 um 15:31:29 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** AK 4 aus #14 (Konfiguration als Code im Repository). Prompts: „separates Konfiguration Script … per IaC“, „Webhook und config Options ganz oben im Skript“, Vorgabe „ein Skript und eine Config“.

**Ablauf:** monitor install legt das Skript nach /usr/local/bin, die Konfiguration nach /etc/monitor/monitor.conf, erzeugt die systemd-Unit und startet den Dienst. Zweimal hintereinander, danach Werte mit monitor set und webhook-add ändern.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# /root/abgabe/monitor install --config /root/monitor-test/test.conf
Monitoring installieren
  Programm nach /usr/local/bin/monitor
  Konfiguration aus /root/monitor-test/test.conf
  systemd-Unit /etc/systemd/system/monitor.service
Konfiguration prüfen
  OK: Docker-Socket /var/run/docker.sock
  Webhooks: discord-test (discord), json-test (json), wiederhol-test (json)
  Endpoints: test-health, test-api, test-dienst, test-langsam, vies-status, vies-ustid
  Konfiguration in Ordnung.
  monitor.service: active
Fertig. Zustand ansehen: monitor status
```

```console
root@monitoring-test-debian-13:~# /root/abgabe/monitor install --config /root/monitor-test/test.conf
Monitoring installieren
  Programm nach /usr/local/bin/monitor
  Konfiguration aus /root/monitor-test/test.conf
  systemd-Unit /etc/systemd/system/monitor.service
Konfiguration prüfen
  OK: Docker-Socket /var/run/docker.sock
  Webhooks: discord-test (discord), json-test (json), wiederhol-test (json)
  Endpoints: test-health, test-api, test-dienst, test-langsam, vies-status, vies-ustid
  Konfiguration in Ordnung.
  monitor.service: active
Fertig. Zustand ansehen: monitor status
```

```console
root@monitoring-test-debian-13:~# monitor set LOG_LEVEL=INFO
  LOG_LEVEL gesetzt
  monitor.service neu gestartet
```

```console
root@monitoring-test-debian-13:~# monitor webhook-add extra json http://127.0.0.1:9000/json change CRITICAL
  WEBHOOKS gesetzt
  monitor.service neu gestartet
```

```console
root@monitoring-test-debian-13:~# monitor webhook-remove extra
  WEBHOOKS gesetzt
  monitor.service neu gestartet
```

```console
root@monitoring-test-debian-13:~# monitor validate
OK: Docker-Socket /var/run/docker.sock
Webhooks: discord-test (discord), json-test (json), wiederhol-test (json)
Endpoints: test-health, test-api, test-dienst, test-langsam, vies-status, vies-ustid
Konfiguration in Ordnung.
```

```console
root@monitoring-test-debian-13:~# monitor show
INTERVAL=5
CHECKS=system docker services endpoints
COLLECT_TIMEOUT=25
CPU_THRESHOLDS=85 95 -
MEMORY_THRESHOLDS=85 95 98
DISK_THRESHOLDS=80 90 95
LOAD_THRESHOLDS=2 4 -
DISK_PATHS=/ /srv/daten
DISK_TOP_DIRS=5
DOCKER_SOCKET=/var/run/docker.sock
CRITICAL_CONTAINERS=db mailserver
IGNORE_CONTAINERS=
RESTART_LOOP_WINDOW=120
PORT_CHECKS=auto
PORT_TIMEOUT=5
SERVICES=docker cron demo-dienst
CRITICAL_SERVICES=docker
ENDPOINTS=[{"name":"test-health","method":"GET","url":"http://127.0.0.1:9000/health","expect":200},{"name":"test-api","method":"POST","url":"http://127.0.0.1:9000/api","body":"{\"probe\":true}","headers":{"Content-Type":"applicat…"},"expect":[200,201]},{"name":"test-dienst","method":"GET","url":"http://127.0.0.1:9000/dienst","expect":200,"level":"ERROR"},{"name":"test-langsam","method":"GET","url":"http://127.0.0.1:9000/slow","expect":200,"timeout":8,"slow_ms":10000},{"name":"vies-status","method":"GET","url":"https://ec.europa.eu/taxation_customs/vies/rest-api/check-status","expect":200,"timeout":10,"level":"WARNING"},{"name":"vies-ustid","method":"POST","url":"https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-test-service","headers":{"Content-Type":"applicat…"},"body":"{\"countryCode\":\"DE\",\"vatNumber\":\"100\"}","expect":200,"timeout":10,"level":"WARNING"}]
WEBHOOKS=[{"name":"discord-test","type":"discord","url":"http://127.0.0.1:9000/discord…","events":["change","report"],"min_level":"WARNING"},{"name":"json-test","type":"json","url":"http://127.0.0.1:9000/json…","events":["change","report"],"min_level":"INFO"},{"name":"wiederhol-test","type":"json","url":"http://127.0.0.1:9000/flaky…","events":["change"],"min_level":"CRITICAL"}]
CONFIRM_CYCLES=2
NOTIFY_WINDOW=120
NOTIFY_MAX=2
REPORT_INTERVAL=60
REPORT_ON_START=1
DELIVERY_RETRIES=3
LOG_LEVEL=INFO
RUN_DIR=/run/monitor
```

```console
root@monitoring-test-debian-13:~# ls -la /usr/local/bin/monitor /etc/monitor/monitor.conf
-rw------- 1 root root  1540 Nov 23 15:31 /etc/monitor/monitor.conf
-rwxr-xr-x 1 root root 63163 Nov 23 15:31 /usr/local/bin/monitor
```

```console
root@monitoring-test-debian-13:~# systemctl cat monitor
# /etc/systemd/system/monitor.service
[Unit]
Description=Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/monitor run
Environment=MONITOR_CONF=/etc/monitor/monitor.conf
Restart=always
RestartSec=5
RuntimeDirectory=monitor
RuntimeDirectoryMode=0755
ProtectSystem=strict
ProtectHome=read-only
PrivateTmp=yes
NoNewPrivileges=yes
ProtectKernelTunables=yes
ProtectKernelModules=yes
ProtectControlGroups=yes
RestrictSUIDSGID=yes
Nice=5
MemoryMax=256M
CPUQuota=100%

[Install]
WantedBy=multi-user.target
```

```console
root@monitoring-test-debian-13:~# systemctl status monitor --no-pager
● monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14)
     Loaded: loaded (/etc/systemd/system/monitor.service; enabled; preset: enabled)
     Active: active (running) since Mon 2026-11-06 15:31:30 CET; 26ms ago
 Invocation: 1a2a8d5397814732887ee783e1be1b59
   Main PID: 15250 ((monitor))
      Tasks: 1 (limit: 4579)
     Memory: 1.9M (max: 256M, available: 254M, peak: 1.9M)
        CPU: 9ms
     CGroup: /system.slice/monitor.service
             └─15250 "(monitor)"

Nov 23 15:31:30 monitoring-test-debian-13 systemd[1]: monitor.service: Deactivated successfully.
Nov 23 15:31:30 monitoring-test-debian-13 systemd[1]: Stopped monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
Nov 23 15:31:30 monitoring-test-debian-13 systemd[1]: Started monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
```

## Prüfungen

- bestanden: webhook-add auf mehrzeiliger Konfiguration: Datei bleibt gültiges Bash
- bestanden: webhook-add: jetzt 4 Webhooks
- bestanden: webhook-remove: wieder 3 Webhooks
- bestanden: Eine einzige Programmdatei: /usr/local/bin/monitor ist eine normale Datei
- bestanden: monitor.service ist aktiv
- bestanden: monitor validate meldet keine Fehler
- bestanden: Konfiguration hat Rechte 0600 und gehört root
- bestanden: Erster Zustand liegt nach höchstens 30 s in /run/monitor/status.json

## Beobachtungen

- Die Installation lief zweimal hintereinander ohne Fehler (idempotent).

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:31:29" -o short-iso
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: Started monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 monitor[14667]: [INFO] monitor 2.0.0 gestartet: alle 5 s, Module: system docker services endpoints, 3 Webhook(s)
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 monitor[14667]: [INFO] monitor beendet
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: Stopping monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14)...
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: monitor.service: Deactivated successfully.
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: Stopped monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: Started monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 monitor[15144]: [INFO] monitor 2.0.0 gestartet: alle 5 s, Module: system docker services endpoints, 3 Webhook(s)
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 monitor[15144]: [INFO] monitor beendet
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: Stopping monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14)...
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: monitor.service: Deactivated successfully.
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: Stopped monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: Started monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: Stopping monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14)...
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: monitor.service: Deactivated successfully.
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: Stopped monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: Started monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: Stopping monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14)...
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 monitor[15216]: [INFO] monitor beendet
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: monitor.service: Deactivated successfully.
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: Stopped monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 systemd[1]: Started monitor.service - Monitoring für Container, Dienste, Ressourcen und Schnittstellen (#14).
2026-11-06T15:31:30+01:00 monitoring-test-debian-13 monitor[15250]: [INFO] monitor 2.0.0 gestartet: alle 5 s, Module: system docker services endpoints, 3 Webhook(s)
2026-11-06T15:31:34+01:00 monitoring-test-debian-13 monitor[15830]: [INFO] Meldung (report) an discord-test zugestellt (HTTP 204, Versuch 1)
2026-11-06T15:31:34+01:00 monitoring-test-debian-13 monitor[15838]: [INFO] Meldung (report) an json-test zugestellt (HTTP 204, Versuch 1)
```

## Angekommene Meldungen

| Nr. | Zeit | Webhook | Art | Stufe | Inhalt | Discord-Grenzen |
| --- | --- | --- | --- | --- | --- | --- |
| 0001 | 15:31:34 | discord | report | - | 🔴 Bericht monitoring-test-debian-13: CRITICAL | ok (1 Embeds, 806 Zeichen) |
| 0002 | 15:31:34 | json | report | CRITICAL | Probleme: 8 | - |

### Discord-Meldung Nr. 0001 im Original

```json
{
  "username": "Monitor monitoring-test-debian-13",
  "embeds": [
    {
      "title": "🔴 Bericht monitoring-test-debian-13: CRITICAL",
      "color": 15158332,
      "timestamp": "2026-11-06T15:31:34+01:00",
      "fields": [
        {
          "name": "CPU",
          "value": "12.3 %",
          "inline": true
        },
        {
          "name": "RAM",
          "value": "29.1 % von 3917 MB",
          "inline": true
        },
        {
          "name": "Load",
          "value": "0.91 / 0.26 / 0.09 (2 Kerne)",
          "inline": true
        },
        {
          "name": "Uptime",
          "value": "1 Min 35 s",
          "inline": true
        },
        {
          "name": "Container",
          "value": "5 von 11 laufen, 8 mit Problem",
          "inline": true
        },
        {
          "name": "Prüfungen",
          "value": "INFO 22 · WARNING 3 · ERROR 4 · CRITICAL 1",
          "inline": false
        },
        {
          "name": "Platten",
          "value": "/srv/daten: 1 % (905 MB frei)\n/: 1 % (881691 MB frei)",
          "inline": false
        },
        {
          "name": "Offene Probleme",
          "inline": false,
          "value": "🔴 oom: vom Kernel beendet, Arbeitsspeicher reichte nicht (OOM)\n🟠 crashloop: startet neu (7 Neustarts, letzter Exit-Code 1)\n🟠 flapper: Healthcheck meldet unhealthy (3 Fehlversuche in Folge) · CPU 1 %, RAM 0.3 MB\n🟠 job-fehler: beendet mit Fehler, Exit-Code 3\n🟠 web-unhealthy: Healthcheck meldet unhealthy (15 Fehlversuche in Folge) · CPU 0 %, RAM 0.3 MB\n🟡 angelegt: angelegt, aber nie gestartet\n🟡 pausiert: pausiert\n🟡 web-starting: läuft, Healthcheck noch nicht bestanden · CPU 0 %, RAM 0.3 MB"
        }
      ],
      "footer": {
        "text": "monitor · Durchlauf 4118 ms"
      }
    }
  ]
}
```

