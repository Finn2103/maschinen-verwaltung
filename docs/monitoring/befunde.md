# Befunde aus den Testläufen

Hier halte ich fest, welche Fehler mir erst beim echten Testen in der Debian-13-VM (VMPal auf
meinem MacBook) aufgefallen sind – inklusive Original-Ausgaben. Die vollständigen Nachweise
stehen in [`tests/`](tests/README.md).

| Wann | Befund | betrifft |
| --- | --- | --- |
| 05.11. | `set` und `webhook-add` zerstörten mehrzeilige Werte | Skript |
| 06.11. (Lauf 1) | Container über `127.0.0.1` nicht erreichbar | Test-VM / Netz |
| 06.11. (Lauf 2) | Entwarnung vom Spam-Schutz zurückgehalten | Skript |
| 06.11. (Lauf 2) | Testskript zählte unterdrückte Wechsel falsch | Testskript |
| 06.11. (Lauf 4) | RAM voll löste wegen Swap nur WARNING aus | Testaufbau |
| 06.11. (Lauf 5) | Testlauf startete nach Abbruch ohne Docker | Testskript |
| 06.11. | `monitor status` ohne `sudo` las falschen Pfad (`/dev/shm`) | Skript |
| 06.11. | Gefilterte Webhooks übernahmen falsches Gesamt-Level bei Entwarnung | Skript |

| 19.11. | VIES-Endpoints in der Standardkonfiguration liefen bei jedem Durchlauf mit: bei 10 s Takt über 17.000 Anfragen pro Tag an die EU-API, Sperrgefahr | Konfiguration |
| 19.11. | Weggefallene Prüfungen (`gone`) umgingen die Bestätigung und meldeten sofort Entwarnung | Skript |
| 19.11. | Doku und Code widersprachen sich zur Entwarnung („immer sofort"), ADR 0012 teils veraltet | Doku |

## 06.11. · Lauf 1: Container über 127.0.0.1 nicht erreichbar

Beim ersten Test kamen SMTP, IMAP und `psql` über die veröffentlichten Ports gar nicht an:

```console
root@monitoring-test-debian-13:~# timeout 8 bash -c "exec 3<>/dev/tcp/172.17.0.3/25; head -1 <&3"
bash: connect: No route to host
bash: line 1: /dev/tcp/172.17.0.3/25: No route to host
root@monitoring-test-debian-13:~# networkctl list
IDX LINK        TYPE     OPERATIONAL SETUP
  1 lo          loopback carrier     unmanaged
  2 enp0s1      ether    routable    configured
  3 enp0s2      ether    routable    configured
  4 docker0     bridge   no-carrier  unmanaged
 82 veth10f1cc9 ether    degraded    configuring
 84 veth2901d4e ether    degraded    configuring
 86 veth7dc4248 ether    degraded    configuring
 88 veth69ff6eb ether    degraded    configuring
 94 veth848cedb ether    degraded    configuring
100 veth0dfdfba ether    degraded    configuring
root@monitoring-test-debian-13:~# cat /etc/systemd/network/20-vmpal.network
[Match]
Type=ether

[Network]
DHCP=yes
```

Die Regel griff auf alle Ethernet-Interfaces – also auch auf die `veth`-Interfaces von Docker.
Dadurch hat `systemd-networkd` die Container-Schnittstellen übernommen und `docker0` blieb tot.
Mit einer Ausnahme für Docker lief es sofort:

```console
root@monitoring-test-debian-13:~# cat /etc/systemd/network/10-docker-unmanaged.network
[Match]
Name=veth* docker0 br-*

[Link]
Unmanaged=yes
root@monitoring-test-debian-13:~# networkctl list --no-pager | grep -E 'docker0|veth'
  4 docker0     bridge   routable    unmanaged
122 vethe0bcf49 ether    enslaved    unmanaged
root@monitoring-test-debian-13:~# curl -s -m 5 http://127.0.0.1:18080/
ok
```

**Merker für die Strato-VM (#5):** Falls dort `systemd-networkd` ähnlich pauschal konfiguriert
ist, brauchen wir dieselbe Ausnahme. Das Monitoring würde das Problem aber sofort über
`CRITICAL` auf den Container-Ports sichtbar machen.

## 06.11. · Lauf 2: Entwarnung vom Spam-Schutz zurückgehalten

Beim Neustart des Mailservers kamen erst `CRITICAL` (gestoppt) und direkt danach `WARNING`
(Healthcheck startet). Damit war das Limit von zwei Meldungen im Zeitfenster voll – und die
eigentliche Entwarnung (`INFO`) hing fest, bis das 120-s-Fenster abgelaufen war:

```console
root@monitoring-test-debian-13:~# journalctl -u monitor -o short-iso | grep -E 'container/mailserver|endpoint/(smtp|imap)'
2026-11-17T21:48:13+01:00 monitoring-test-debian-13 monitor[174835]: [CRITICAL] container/mailserver: mailserver: gestoppt (Exit-Code 137), sollte aber laufen (vorher INFO)
2026-11-17T21:48:13+01:00 monitoring-test-debian-13 monitor[174835]: [CRITICAL] endpoint/imap: imap: 127.0.0.1:143 nicht erreichbar (Connection refused) (vorher INFO)
2026-11-17T21:48:13+01:00 monitoring-test-debian-13 monitor[174835]: [CRITICAL] endpoint/smtp: smtp: 127.0.0.1:25 nicht erreichbar (Connection refused) (vorher INFO)
2026-11-17T21:48:22+01:00 monitoring-test-debian-13 monitor[176630]: [WARNING] container/mailserver: mailserver: läuft, Healthcheck noch nicht bestanden · CPU 1 %, RAM 46.3 MB (vorher CRITICAL)
2026-11-17T21:48:27+01:00 monitoring-test-debian-13 monitor[177380]: [INFO] endpoint/imap: imap: 127.0.0.1:143 erreichbar in 52 ms, meldet "* OK [CAPABILITY IMAP4rev1 LOGIN-REFERRALS ID ENABLE IDLE SA" (vorher CRITICAL)
2026-11-17T21:48:27+01:00 monitoring-test-debian-13 monitor[177380]: [INFO] endpoint/smtp: smtp: 127.0.0.1:25 erreichbar in 4 ms, meldet "220-mail.example.test ESMTP" (vorher CRITICAL)
2026-11-17T21:48:52+01:00 monitoring-test-debian-13 monitor[163906]: [INFO] container/mailserver: Wechsel zu INFO unterdrückt (Spam-Schutz, 2 Meldungen in 120 s)
2026-11-17T21:50:13+01:00 monitoring-test-debian-13 monitor[191410]: [INFO] container/mailserver: mailserver: läuft, Healthcheck bestanden · CPU 0.8 %, RAM 39.1 MB (vorher WARNING)
```

Im Produktivbetrieb (Fenster 600 s) hätte eine Entwarnung so bis zu 10 Minuten hängen können.
Ich habe die Regel im Spam-Schutz geändert: Eine Entwarnung nach einem gemeldeten Problem geht
jetzt immer sofort durch. Test [06](tests/06-mailserver-aus.md) prüft das explizit mit.

## 06.11. · Lauf 2: Testskript zählte unterdrückte Wechsel falsch

```console
  Unterdrückte Wechsel laut Journal: 408
```

Das sah erst plausibel aus, war aber falsch: Das Testskript las das ganze Journal inklusive des
alten Dienstes vom 05.11. Tatsächlich waren es nur 3. Seitdem filtern die Journal-Abfragen
strikt ab Testbeginn.

## 06.11. · Lauf 4: RAM voll nur als WARNING

```console
  Gemeldet nach 90 s, gemeldete Stufe: , Messwert danach: RAM belegt 92.7 % (3630 von 3917 MB).
22:16:54	discord	change	-	🟡 WARNING · system/memory
22:16:54	json	change	WARNING	system/memory INFO->WARNING
22:18:29	json	change	INFO	system/memory WARNING->INFO
```

Mit aktivem Swap lagert der Kernel andere Prozesse aus, sodass die RAM-Belegung unter 95 %
hängen blieb. Deshalb schaltet Test [10](tests/10-ram-voll.md) Swap für diesen Schritt kurz ab.
Auf einem Server mit Swap sieht man die Swap-Nutzung trotzdem direkt in den Details der Meldung.

## 06.11. · Lauf 5: ohne Docker gestartet

```console
docker: Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?.
```

Lauf 4 war mitten im Test „Docker stoppen“ abgebrochen, sodass Docker danach aus blieb. Seitdem
stellt `vm-test.sh` zu Beginn selbst sicher, dass Docker und Swap aktiv sind.

## 05.11. · mehrzeilige Werte in `monitor.conf`

`set` und `webhook-add` hatten bei mehrzeiligem JSON (z. B. `WEBHOOKS='[ … ]'`) nur die erste
Zeile ersetzt und den Rest stehen lassen – danach war die Datei kaputtes Bash. Beim Durchsehen
des Codes aufgefallen, behoben und seitdem fest in Test [01](tests/01-installation.md) geprüft.

## 06.11. · `monitor status` ohne `sudo` & gefilterte Entwarnung

Beim direkten Testen im Terminal der VM als normaler Benutzer (`nl`, ohne `sudo`) meldete
`monitor status`:

```console
Kein Zustand in /dev/shm/monitor-1000/status.json. Läuft der Dienst?
```

Ursache war die Pfad-Prüfung ganz oben im Skript: Weil `/run/monitor` für `nl` nicht
*beschreibbar* ist, wich das Skript selbst beim reinen Lesen auf `/dev/shm/monitor-1000` aus,
obwohl `/run/monitor/status.json` für alle lesbar war. Die Bedingung prüft jetzt zuerst, ob
`$RUN_DIR/status.json` lesbar ist – seitdem funktioniert `monitor status` per SSH ohne `sudo`.

Beim Durchsehen von `notify()` fiel außerdem auf, dass nach dem Filtern nach `min_level` das
Gesamt-Level der Meldung nicht neu berechnet wurde (eine reine Entwarnung konnte dadurch in
Discord mit `WARNING` statt „Entwarnung“ erscheinen, wenn ein anderes Event herausgefiltert
wurde), und `monitor install --config` brach ab, wenn Quelle und Ziel dieselbe Datei waren.
Beides ist behoben und im Testlauf vom 06.11. nachgewiesen.

## 19.11. · Gegenlesen vor dem Commit

Vor dem Commit habe ich das Skript noch einmal mit Claude gegengelesen. Drei Punkte:

1. **VIES bei jedem Durchlauf:** Die zwei VIES-Endpoints standen in der Standardkonfiguration
   und liefen alle 10 s mit – über 17.000 Anfragen pro Tag an eine EU-Behörden-API, dafür
   droht eine Sperre. #7 nutzt VIES noch gar nicht. Die Endpoints sind aus der
   Standardkonfiguration raus, ein Beispiel steht auskommentiert in `monitor.conf`.
2. **Falsche Entwarnung bei `gone`:** Fällt ein Modul einmal aus (Timeout), verschwinden
   seine Prüfungen. Bisher kam dann sofort die Entwarnung für einen bereits gemeldeten Fehler,
   der eigentliche Fehler wurde erst einen Durchlauf später gemeldet. Jetzt wird eine
   weggefallene Prüfung wie jeder Wechsel über zwei Durchläufe bestätigt, bevor die
   Entwarnung rausgeht (`decide_changes`).
3. **Doku widersprach dem Code:** README und Kommentar sagten „Entwarnung geht immer sofort
   durch". Richtig ist: Sie wird nicht vom Spam-Schutz zurückgehalten, bestätigt wird sie
   aber wie jeder Wechsel. Doku und Kommentar sind korrigiert, dazu die Konsequenzen und das
   FAQ in ADR 0012 (Test mit Containern der echten Software, Health-Checks über die
   Docker-API).
