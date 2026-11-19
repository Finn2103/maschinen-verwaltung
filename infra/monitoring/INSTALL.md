# Monitoring installieren

Kurzanleitung, wie ich das Monitoring aus [#14](https://github.com/Finn2103/maschinen-verwaltung/issues/14)
auf unserem Debian-13-Server einrichte. Alles unten ist auf einer VMPal-VM (Debian 13) auf
meinem MacBook durchgetestet.

Voraussetzungen:

- Debian 13 mit `sudo`
- Docker mit Datenbank (Supabase) und Mailserver (`docker-mailserver`)
- dieses Repository auf dem Server
- die Webhook-URL unseres Meldekanals

Was ich **nicht** brauche: Datenbank- oder Mail-Passwörter, einen zusätzlichen Container,
einen offenen Port oder eine Weboberfläche.

## 1. Repository holen

```bash
git clone https://github.com/Finn2103/maschinen-verwaltung.git
cd maschinen-verwaltung
```

## 2. Containernamen in `monitor.conf` abgleichen

In [`monitor.conf`](monitor.conf) stehen nur Konfigurationswerte, keine Geheimnisse. Vor dem
Installieren schaue ich kurz, ob die Namen unter `CRITICAL_CONTAINERS` zu den laufenden
Containern passen:

```bash
docker ps --format '{{.Names}}'
grep CRITICAL_CONTAINERS infra/monitoring/monitor.conf
```

Falls ein Name auf der Strato-VM anders heißt, passe ich ihn im Repo per PR nach `staging` an.
Ports von Datenbank und Mailserver muss ich nicht eintragen – die zieht sich `monitor` selbst
aus der Docker-API.

## 3. Installieren

```bash
sudo infra/monitoring/monitor install --config infra/monitoring/monitor.conf
```

Der Befehl kopiert das Skript nach `/usr/local/bin/monitor`, legt die Konfiguration unter
`/etc/monitor/monitor.conf` (`root`, `0600`) ab, schreibt die systemd-Unit, prüft die Config
und startet `monitor.service`. Nach einem `git pull` kann ich den Befehl einfach noch einmal
laufen lassen.

## 4. Webhook eintragen (nur lokal auf dem Server)

Die Webhook-Adresse ist das einzige Geheimnis und kommt nie ins Repository:

```bash
sudo monitor webhook-add team-discord discord 'https://discord.com/api/webhooks/…' change,report WARNING
sudo monitor test-webhook team-discord
```

Danach sollte im Kanal die Testmeldung auftauchen.

## 5. Status prüfen

Funktioniert per SSH auch ohne `sudo`:

```bash
monitor status
```

| Befehl | Wofür |
| --- | --- |
| `monitor status --problems` | nur aktive Warnungen und Fehler |
| `monitor status --json` | maschinenlesbare Ausgabe (`monitor.status/v1`) |
| `journalctl -u monitor -f` | Meldungen live mitlesen |
| `journalctl -u monitor -p warning` | nur WARNING, ERROR und CRITICAL |
| `sudo monitor show` | aktive Konfiguration (Webhook-URLs gekürzt) |

## 6. Werte anpassen

```bash
sudo monitor set INTERVAL=30
sudo monitor set CRITICAL_CONTAINERS="supabase-db supabase-kong supabase-pooler mailserver"
```

Der Dienst startet danach automatisch neu. Dauerhafte Änderungen trage ich zusätzlich in
`infra/monitoring/monitor.conf` im Repo nach. Alle Optionen stehen in [`SKILL.md`](SKILL.md).

## 7. Deinstallieren

```bash
sudo monitor uninstall           # Konfiguration bleibt erhalten
sudo monitor uninstall --purge   # löscht auch /etc/monitor
```

## Wenn etwas klemmt

| Symptom | Was ich zuerst prüfe |
| --- | --- |
| `monitor status` meldet „Kein Zustand“ | `systemctl status monitor` und `journalctl -u monitor -n 50` |
| Keine Meldung im Kanal | `journalctl -u monitor -p err`, URL mit `sudo monitor show` prüfen |
| Port meldet `No route to host`, Container läuft | `networkctl list` – evtl. übernimmt `systemd-networkd` die Docker-`veth`-Interfaces (siehe `docs/monitoring/befunde.md`) |

Die kompletten Testprotokolle und Screenshots stehen in [`docs/monitoring/`](../../docs/monitoring/README.md).
