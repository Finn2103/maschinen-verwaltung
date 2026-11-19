# 03 · Alle Container-Zustände

> Getestet am 06.11.2026 um 15:32:00 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** Prompts: „Das Skript ignoriert teilweise die States der Container“ und „Created, running, paused, restarting, exited und healthy, unhealthy starting wird nicht berücksichtigt“.

**Ablauf:** Elf echte Container in verschiedenen Zuständen. Zustände, die sich nicht gezielt herstellen lassen (dead, removing, OOMKilled), werden mit nachgestellten Antworten der Docker-API gegen genau das jq-Programm aus /usr/local/bin/monitor geprüft.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# docker ps -a --format 'table {{.Names}}\t{{.Status}}'
NAMES           STATUS
flapper         Up 59 seconds (healthy)
oom             Exited (137) 59 seconds ago
crashloop       Restarting (1) 5 seconds ago
angelegt        Created
pausiert        Up About a minute (Paused)
job-fehler      Exited (3) About a minute ago
job-ok          Exited (0) About a minute ago
web-starting    Up About a minute (health: starting)
web-unhealthy   Up About a minute (unhealthy)
mailserver      Up About a minute (healthy)
db              Up About a minute (healthy)
```

```console
root@monitoring-test-debian-13:~# monitor status | grep -E 'STUFE|container/'
STUFE     PRÜFUNG                             ZUSTAND        MELDUNG
CRITICAL  container/oom                        oom-killed     oom: vom Kernel beendet, Arbeitsspeicher reichte nicht (OOM)
ERROR     container/crashloop                  restarting     crashloop: startet neu (9 Neustarts, letzter Exit-Code 1)
ERROR     container/flapper                    unhealthy      flapper: Healthcheck meldet unhealthy (4 Fehlversuche in Folge) · CPU 1 %, RAM 0.3 MB
ERROR     container/job-fehler                 exited         job-fehler: beendet mit Fehler, Exit-Code 3
ERROR     container/web-unhealthy              unhealthy      web-unhealthy: Healthcheck meldet unhealthy (27 Fehlversuche in Folge) · CPU 1 %, RAM 0.3 MB
WARNING   container/angelegt                   created        angelegt: angelegt, aber nie gestartet
WARNING   container/pausiert                   paused         pausiert: pausiert
WARNING   container/web-starting               starting       web-starting: läuft, Healthcheck noch nicht bestanden · CPU 0 %, RAM 0.3 MB
INFO      container/db                         healthy        db: läuft, Healthcheck bestanden · CPU 1.3 %, RAM 34.3 MB
INFO      container/job-ok                     exited         job-ok: beendet mit Exit-Code 0 (einmaliger Job)
INFO      container/mailserver                 healthy        mailserver: läuft, Healthcheck bestanden · CPU 0.8 %, RAM 51.6 MB
```

## Zuordnung aller Zustände (nachgestellte Docker-Antworten)

| Zustand | Healthcheck | Exit-Code | OOMKilled | Restart-Policy | erwartet | Ergebnis |
| --- | --- | --- | --- | --- | --- | --- |
| running | none | 0 | false | no | INFO running | INFO running |
| running | healthy | 0 | false | no | INFO healthy | INFO healthy |
| running | starting | 0 | false | no | WARNING starting | WARNING starting |
| running | unhealthy | 0 | false | no | ERROR unhealthy | ERROR unhealthy |
| restarting | none | 1 | false | always | ERROR restarting | ERROR restarting |
| paused | none | 0 | false | no | WARNING paused | WARNING paused |
| created | none | 0 | false | no | WARNING created | WARNING created |
| exited | none | 0 | false | no | INFO exited | INFO exited |
| exited | none | 0 | false | unless-stopped | ERROR exited | ERROR exited |
| exited | none | 3 | false | no | ERROR exited | ERROR exited |
| exited | none | 137 | true | no | CRITICAL oom-killed | CRITICAL oom-killed |
| dead | none | 0 | false | no | CRITICAL dead | CRITICAL dead |
| removing | none | 0 | false | no | WARNING removing | WARNING removing |

## Prüfungen

- bestanden: web-unhealthy: unhealthy, ERROR
- bestanden: web-starting: Healthcheck starting, WARNING
- bestanden: job-ok: exited 0 als Job, INFO
- bestanden: job-fehler: exited 3, ERROR
- bestanden: pausiert: paused, WARNING
- bestanden: angelegt: created, WARNING
- bestanden: crashloop: restarting oder Neustart-Schleife, ERROR
- bestanden: oom: Docker meldet OOMKilled, Monitoring CRITICAL
- bestanden: Zuordnung running/none/exit 0/oom false/no ergibt INFO running
- bestanden: Zuordnung running/healthy/exit 0/oom false/no ergibt INFO healthy
- bestanden: Zuordnung running/starting/exit 0/oom false/no ergibt WARNING starting
- bestanden: Zuordnung running/unhealthy/exit 0/oom false/no ergibt ERROR unhealthy
- bestanden: Zuordnung restarting/none/exit 1/oom false/always ergibt ERROR restarting
- bestanden: Zuordnung paused/none/exit 0/oom false/no ergibt WARNING paused
- bestanden: Zuordnung created/none/exit 0/oom false/no ergibt WARNING created
- bestanden: Zuordnung exited/none/exit 0/oom false/no ergibt INFO exited
- bestanden: Zuordnung exited/none/exit 0/oom false/unless-stopped ergibt ERROR exited
- bestanden: Zuordnung exited/none/exit 3/oom false/no ergibt ERROR exited
- bestanden: Zuordnung exited/none/exit 137/oom true/no ergibt CRITICAL oom-killed
- bestanden: Zuordnung dead/none/exit 0/oom false/no ergibt CRITICAL dead
- bestanden: Zuordnung removing/none/exit 0/oom false/no ergibt WARNING removing

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:32:00" -o short-iso
-- No entries --
```

## Angekommene Meldungen

In diesem Schritt kam keine Meldung.

