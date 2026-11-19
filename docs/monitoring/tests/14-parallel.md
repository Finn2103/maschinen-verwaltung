# 14 · Parallele Prüfung

> Getestet am 06.11.2026 um 15:37:55 auf einer VMPal-VM (Debian 13) auf meinem MacBook.

**Anforderung:** Prompt: „dass die Sachen teilweise nicht parallel laufen. Wir müssen parallel arbeiten.“

**Ablauf:** Alle Module und Schnittstellen laufen gleichzeitig. test-langsam braucht allein 4 s, die CPU-Messung 1 s, dazu VIES über das Internet, die Port-Prüfungen und die Docker-Statistik. Nacheinander müsste ein Durchlauf mindestens so lange dauern wie die Summe dieser Zeiten.

## Befehle und Ausgaben

```console
root@monitoring-test-debian-13:~# cat /root/monitor-test/dauer.json
{
  "cycle_ms": 4162,
  "einzelzeiten_ms": {
    "endpoint/test-api": 1,
    "endpoint/test-dienst": 9,
    "endpoint/test-health": 1,
    "endpoint/test-langsam": 4003,
    "endpoint/vies-status": 143,
    "endpoint/vies-ustid": 72,
    "port/db:5432": 4,
    "port/mailserver:143": 5,
    "port/mailserver:25": 6,
    "port/mailserver:587": 3,
    "system/cpu (Messung)": 1000
  },
  "summe_einzelzeiten_ms": 5247
}
```

```console
root@monitoring-test-debian-13:~# time monitor check >/dev/null

real	0m4.125s
user	0m0.288s
sys	0m0.067s
```
_Exit-Code 3_

## Prüfungen

- bestanden: Durchlauf ist kürzer als die Summe der Einzelzeiten (also parallel)
- bestanden: Durchlauf ist kürzer als 4 s Endpoint + 1 s CPU-Messung + 3 s

## Beobachtungen

- Ein Durchlauf dauerte 4162 ms, die Einzelzeiten ergeben zusammen 5247 ms.

## Server-Log

```console
root@monitoring-test-debian-13:~# journalctl -u monitor --since "2026-11-06 15:37:55" -o short-iso
-- No entries --
```

## Angekommene Meldungen

In diesem Schritt kam keine Meldung.

