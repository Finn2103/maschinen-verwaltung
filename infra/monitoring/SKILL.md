---
name: monitor-einrichten
description: Hilft beim Einrichten des Monitoring-Skripts "monitor" (Issue #14, ADR 0012) auf Debian 13 und beim Erstellen oder Ändern der Konfiguration monitor.conf. Verwenden, wenn jemand das Monitoring installieren, wichtige Container festlegen, Dienste oder Schnittstellen ergänzen, einen Webhook eintragen, Schwellwerte ändern oder eine fehlerhafte Konfiguration reparieren will.
---

# monitor einrichten und konfigurieren

`monitor` überwacht Docker-Container, systemd-Dienste, CPU, RAM, Platten und Schnittstellen
und meldet Änderungen per Webhook. Es braucht **keine Zugangsdaten**: Datenbank und
Mailserver prüft es über ihre Ports, ohne sich anzumelden.

## Dateien

| Datei | im Repository | auf dem Server |
| --- | --- | --- |
| Skript | `infra/monitoring/monitor` | `/usr/local/bin/monitor` |
| Konfiguration | `infra/monitoring/monitor.conf` | `/etc/monitor/monitor.conf` (root, 0600) |
| Laufzeitdaten | – | `/run/monitor/` (RAM): `status.json`, `ports.tsv` |
| systemd-Unit | erzeugt `monitor install` | `/etc/systemd/system/monitor.service` |

Installation Schritt für Schritt: [`INSTALL.md`](INSTALL.md).

## Regeln

1. **Keine Passwörter, Schlüssel oder Tokens in die Konfiguration.** `monitor` braucht keine.
   Wer eine Anmeldung prüfen will, nimmt stattdessen die Port-Prüfung (siehe unten).
2. **Einziges Geheimnis ist die Webhook-Adresse.** Sie kommt nie ins Repository, sondern nur
   auf dem Server mit `monitor webhook-add`. Die Repository-Datei behält `WEBHOOKS='[]'`.
3. Die Konfiguration wird als Bash geladen: nur Zeilen `NAME=WERT`, keine Befehle, JSON in
   einfachen Anführungszeichen, kein `'` im Wert. Einzelwerte besser mit `monitor set`.
4. Nur Namen aus der Referenz unten, klar gegliedert nach den sechs Abschnitten wie in `monitor.conf`.
5. Kurze einzeilige Abschnitts-Überschriften sind erlaubt, keine langen Erklärtexte in `monitor.conf`.
6. Nicht über den eigenen Mailserver melden: fällt er aus, kommt die Meldung nicht an.

## Was `monitor` von selbst findet

- **Alle Container** über den Docker-Socket, mit Zustand, Healthcheck, CPU, RAM und Pfaden.
- **Alle veröffentlichten Ports** der Container (`PORT_CHECKS="auto"`). Jeder Port wird mit
  dem passenden Protokoll geprüft, ohne Anmeldung:

  | Container-Port | Prüfung | in Ordnung, wenn |
  | --- | --- | --- |
  | 5432, 6543 | PostgreSQL-Handshake wie `pg_isready` | der Server eine Anmeldung anfordert |
  | 25, 587, 2525 | SMTP | die Begrüßung mit `220` beginnt |
  | 143 | IMAP | die Begrüßung mit `* OK` beginnt |
  | 80, 3000, 4000, 5000, 8000, 8080 | HTTP | irgendein HTTP-Statuscode kommt (auch 401) |
  | 443, 8443 | HTTPS | irgendein HTTP-Statuscode kommt |
  | andere | TCP | die Verbindung klappt |

  Gestoppte Container, die laufen sollen, werden über ihre konfigurierten Ports weiter
  geprüft. Fällt Docker aus, prüft `monitor` die Ports aus dem letzten Durchlauf.

Für Supabase heißt das: Datenbank und Pooler über 5432/6543, der API-Gateway (Kong) über
8000, die internen Dienste über ihre Docker-Healthchecks. Für docker-mailserver: SMTP 25 und
587, IMAP 143. Dafür ist **nichts** in `ENDPOINTS` nötig.

## Ablauf

1. Klären, nur was nicht aus dem Repository hervorgeht:
   - Welche Container sind wichtig (Ausfall = CRITICAL)? Namen mit `docker ps --format '{{.Names}}'`.
   - Welche Container sollen nicht überwacht werden?
   - Welche systemd-Dienste?
   - Welche externen Schnittstellen (z. B. VIES)?
   - Wohin melden: Discord-Webhook oder eigener JSON-Endpunkt, ab welcher Stufe?
2. `monitor.conf` schreiben oder ändern.
3. Prüfen:
   ```bash
   bash -n monitor.conf
   sudo install -m 0600 -o root -g root monitor.conf /tmp/monitor.conf
   sudo MONITOR_CONF=/tmp/monitor.conf ./monitor validate
   sudo MONITOR_CONF=/tmp/monitor.conf ./monitor check
   ```
   `monitor` startet nur, wenn die Konfiguration root gehört und nur für root beschreibbar ist.
   `validate` warnt, wenn `ENDPOINTS` nach Zugangsdaten aussieht.
4. Installieren, dann Webhook eintragen und testen (Befehle in [`INSTALL.md`](INSTALL.md)).

Einzelwerte ändern: `sudo monitor set NAME=WERT`. Entfernen: `webhook-remove NAME`,
`uninstall [--purge]`. Jede Änderung startet den Dienst neu.
`sudo monitor show` zeigt die Konfiguration, Webhook-Adressen gekürzt.

## Referenz der Optionen

| Name | Standard | Bedeutung |
| --- | --- | --- |
| `INTERVAL` | `10` | Sekunden zwischen zwei Durchläufen |
| `CHECKS` | `system docker services endpoints` | Module, laufen gleichzeitig |
| `COLLECT_TIMEOUT` | `25` | Sekunden, nach denen ein Modul abgebrochen wird (ERROR) |
| `CPU_THRESHOLDS` | `85 95 -` | WARNING ERROR CRITICAL in %, `-` = Stufe nie |
| `MEMORY_THRESHOLDS` | `85 95 98` | RAM in % |
| `DISK_THRESHOLDS` | `80 90 95` | Platte und Inodes in % |
| `LOAD_THRESHOLDS` | `2 4 -` | Load (5 min) je CPU-Kern |
| `DISK_PATHS` | `auto` | `auto` = alle echten Dateisysteme, sonst Pfade mit Leerzeichen |
| `DISK_TOP_DIRS` | `5` | größte Ordner in der Meldung ab ERROR, `0` = aus |
| `DOCKER_SOCKET` | `/var/run/docker.sock` | bei rootless Docker `/run/user/<uid>/docker.sock` |
| `CRITICAL_CONTAINERS` | leer | Containernamen mit Leerzeichen, ERROR wird CRITICAL, auch für ihre Ports |
| `IGNORE_CONTAINERS` | leer | Regex auf Containernamen, auch ihre Ports werden nicht geprüft |
| `RESTART_LOOP_WINDOW` | `120` | Neustart innerhalb dieser Sekunden = Neustart-Schleife |
| `PORT_CHECKS` | `auto` | veröffentlichte Ports der Container prüfen, `off` = aus |
| `PORT_TIMEOUT` | `5` | Sekunden je Port-Prüfung |
| `SERVICES` | `docker` | systemd-Units mit Leerzeichen |
| `CRITICAL_SERVICES` | `docker` | Ausfall dieser Units = CRITICAL |
| `ENDPOINTS` | `[]` | zusätzliche Schnittstellen, siehe unten |
| `WEBHOOKS` | `[]` | Meldeziele, nur mit `monitor webhook-add` |
| `CONFIRM_CYCLES` | `2` | so viele Durchläufe muss eine neue Stufe anliegen |
| `NOTIFY_WINDOW` | `600` | Zeitfenster für den Spam-Schutz in Sekunden |
| `NOTIFY_MAX` | `2` | höchstens so viele Meldungen je Prüfung im Fenster |
| `REPORT_INTERVAL` | `3600` | Bericht alle n Sekunden, `0` = aus |
| `REPORT_ON_START` | `1` | Bericht direkt nach dem Start |
| `DELIVERY_RETRIES` | `3` | Zustellversuche je Meldung |
| `LOG_LEVEL` | `INFO` | ab welcher Stufe ins Journal geschrieben wird |
| `RUN_DIR` | `/run/monitor` | muss auf tmpfs liegen |

### ENDPOINTS

Nur für Schnittstellen, die nicht als Container-Port auf diesem Server laufen, zum Beispiel
externe APIs oder Dienste ohne Docker. Gemeinsame Felder: `name` (Pflicht, eindeutig),
`type`, `timeout` (5), `level` bei Fehler (`ERROR`), `slow_ms` (WARNING ab dieser Dauer).

| Typ | Felder | in Ordnung, wenn |
| --- | --- | --- |
| `http` | `url`, `method` (`GET`), `headers`, `body`, `expect` (200 oder Liste) | Statuscode in `expect` |
| `postgres` | `host` (`127.0.0.1`), `port` | der Server eine Anmeldung anfordert |
| `smtp`, `imap` | `host`, `port` | die Begrüßung passt |
| `tcp` | `host`, `port`, `banner` (Regex auf die erste Zeile), `send` | Verbindung, Banner passt |

Beispiel aus diesem Projekt (VIES für die USt-IdNr.-Prüfung, #7):

```json
{"name":"vies-ustid","method":"POST","url":"https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-test-service","headers":{"Content-Type":"application/json"},"body":"{\"countryCode\":\"DE\",\"vatNumber\":\"100\"}","expect":200,"timeout":10,"level":"WARNING"}
```

In der Bash-Datei steht ein Backslash im JSON doppelt: `"^\\* OK"`.

### WEBHOOKS

Felder: `name`, `type` (`discord` oder `json`), `url`, `events` (`["change","report"]`),
`min_level` (`WARNING`), `headers`. Eintragen nur auf dem Server:

```bash
sudo monitor webhook-add team-discord discord 'https://discord.com/api/webhooks/…' change,report WARNING
sudo monitor test-webhook team-discord
```

### Labels an Containern

| Label | Wirkung |
| --- | --- |
| `monitor.ignore=true` | Container und seine Ports werden nicht überwacht |
| `monitor.level=CRITICAL` | wie `CRITICAL_CONTAINERS` |
| `monitor.expect=running` | gestoppt = ERROR, Ports werden weiter geprüft |

Container mit Restart-Policy `always` oder `unless-stopped` sollen immer laufen. Ein Job mit
Exit-Code 0 ohne Policy ist INFO.

## Fehlerbilder

| Meldung | Ursache, Lösung |
| --- | --- |
| `muss root gehören` | `chown root:root` und `chmod 600` auf die Konfiguration |
| `Kein Zustand` / Exit-Code 4 | Dienst läuft nicht: `systemctl status monitor`, `journalctl -u monitor -n 50` |
| `WEBHOOKS ist keine JSON-Liste` | Anführungszeichen prüfen, `bash -n` und `jq .` auf den Wert |
| `ENDPOINTS scheint Zugangsdaten zu enthalten` | Zugangsdaten entfernen, Port-Prüfung nutzen |
| Meldung kommt nicht an | `journalctl -u monitor -p err`, dann `monitor test-webhook NAME` |
| `docker/daemon` CRITICAL, Docker läuft aber | `DOCKER_SOCKET` falsch (rootless) |
| Port `nicht erreichbar (No route to host)`, Container läuft | Netz des Hosts: z. B. systemd-networkd übernimmt die Docker-Schnittstellen, dann `Name=veth* docker0 br-*` mit `Unmanaged=yes` |
| Port `antwortet nicht wie PostgreSQL` | falscher Port oder anderer Dienst dahinter |
| zu viele Meldungen | `CONFIRM_CYCLES` erhöhen, `NOTIFY_WINDOW` verlängern, Container per Label ignorieren |
| voller RAM nur als WARNING | Server mit Swap: der Kernel lagert aus, die Belegung bleibt unter 95 %. `swap_used_mb` steht in der Meldung, bei Bedarf `MEMORY_THRESHOLDS` senken |
