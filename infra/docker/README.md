# Docker installieren und einrichten

Hier steht, wie wir Docker mit Compose auf unserer Strato-VM (Debian 13) installieren.
Die Entscheidung für Docker steht in [ADR 0002](../../docs/adr/0002-container-plattform.md),
das Ticket dazu ist [#36](https://github.com/Finn2103/maschinen-verwaltung/issues/36).

Das IaC-Skript aus [#5](https://github.com/Finn2103/maschinen-verwaltung/issues/5)
soll diese Schritte später automatisch ausführen.

> **Rootless oder normal?** Ob Docker normal (als root) oder Rootless läuft, entscheidet
> der Bearbeiter vom IT-Grundschutz-Issue
> [#4](https://github.com/Finn2103/maschinen-verwaltung/issues/4). Schritte 1 bis 5 sind
> die normale Installation. Wenn es Rootless sein soll, danach noch Schritt 6 machen.

## 1. Docker Repository hinzufügen

```bash
# Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
```

## 2. Docker installieren

```bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## 3. Neustart

Docker startet nach einem Reboot automatisch, das macht das Paket schon. Prüfen:

```bash
systemctl is-enabled docker   # muss "enabled" anzeigen
```

In jeder Compose-Datei bekommt jeder Dienst:

```yaml
restart: unless-stopped
```

Wir nehmen `unless-stopped` und nicht `always`, weil ein Container, den wir selbst
gestoppt haben, dann auch nach einem Reboot aus bleibt. Supabase macht das genauso.

## 4. Logs

Wir nehmen den Log-Treiber `local`. Der dreht die Logs automatisch weiter (Rotation),
damit die Festplatte nicht voll läuft. Das passiert beim Standard-Treiber nicht.

Datei `/etc/docker/daemon.json`:

```json
{
  "log-driver": "local",
  "log-opts": {
    "max-size": "20m",
    "max-file": "5"
  }
}
```

Danach Docker neu starten:

```bash
sudo systemctl restart docker
```

Logs anschauen geht mit `docker compose logs <dienst>`.

> **Achtung, #19:** Die Docker-Logs werden rotiert und irgendwann gelöscht. Die
> Zugriffslogs von Datenbank und Mailserver müssen laut
> [#19](https://github.com/Finn2103/maschinen-verwaltung/issues/19) aber dauerhaft
> aufbewahrt werden, nicht nur rotiert. Die dürfen also nicht nur in den Docker-Logs
> landen, sondern müssen zusätzlich gespeichert werden. Wie, wird in #19 entschieden.

## 5. Testen mit Caddy

Zum Testen starten wir Caddy als Platzhalterdienst. Dafür im Ordner `infra/caddy/`
die Beispieldatei kopieren und `example.com` durch die Domain der VM ersetzen:

```bash
cp Caddyfile.example Caddyfile
```

`infra/caddy/compose.yml`:

```yaml
services:
  caddy:
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data   # Zertifikate, sonst bei jedem Neustart neu angefordert

volumes:
  caddy_data:
```

Starten und testen:

```bash
docker compose up -d
curl -i https://<domain>      # muss 200 und "Hello world" zurückgeben
docker version                # Version, kommt in docs/TECHSTACK.md
```

Dann die VM neu starten und nochmal testen.

## 6. Nur wenn Rootless: zusätzliche Schritte

Anleitung: https://docs.docker.com/engine/security/rootless/

Bei Rootless läuft Docker unter einem normalen Benutzer statt als root. Wenn jemand
aus einem Container ausbricht, hat er dann keine Root-Rechte.

`<dienstnutzer>` ist der Benutzer, unter dem Docker laufen soll.

Zusätzliche Pakete installieren:

```bash
sudo apt install docker-ce-rootless-extras uidmap dbus-user-session
```

Das normale Docker (als root) ausschalten:

```bash
sudo systemctl disable --now docker.service docker.socket
sudo rm /var/run/docker.sock
```

Prüfen, ob der Benutzer Einträge in `/etc/subuid` und `/etc/subgid` hat (sollte Debian
automatisch anlegen):

```bash
grep <dienstnutzer> /etc/subuid /etc/subgid
```

Als `<dienstnutzer>` Rootless installieren:

```bash
dockerd-rootless-setuptool.sh install
export DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock
```

Caddy braucht Port 80 und 443. Ohne root darf Docker diese Ports nicht benutzen, deshalb:

```bash
echo 'net.ipv4.ip_unprivileged_port_start=80' | sudo tee /etc/sysctl.d/90-docker-rootless.conf
sudo sysctl --system
```

Damit Docker nach einem Reboot automatisch startet:

```bash
systemctl --user enable docker
sudo loginctl enable-linger <dienstnutzer>
```

Die Log-Einstellung aus Schritt 4 kommt bei Rootless nicht nach `/etc/docker/daemon.json`,
sondern nach `~/.config/docker/daemon.json` beim `<dienstnutzer>`. Neu starten mit
`systemctl --user restart docker`.

Prüfen:

```bash
docker info | grep -i rootless     # muss "rootless" anzeigen
systemctl --user is-enabled docker # muss "enabled" anzeigen
```

Danach den Test aus Schritt 5 wiederholen.

Bei Rootless noch beachten:

- Caddy sieht vielleicht nicht die echte IP vom Besucher. Das ist wichtig für die
  Zugriffslogs (#19) und muss getestet werden.
- Supabase braucht den Docker-Socket. Der liegt dann unter
  `/run/user/<uid>/docker.sock`, das muss in der Supabase-`.env` eingetragen werden.
- Beim Mailserver (#12) muss geprüft werden, ob er mit Rootless läuft.

## 7. Dienste starten, stoppen, aktualisieren

Im Ordner mit der `compose.yml`:

| Was | Befehl |
| --- | --- |
| Starten | `docker compose up -d` |
| Stoppen | `docker compose stop` |
| Stoppen und Container löschen (Daten bleiben) | `docker compose down` |
| Aktualisieren | `docker compose pull && docker compose up -d` |
| Status | `docker compose ps` |
| Logs | `docker compose logs -f <dienst>` |

## 8. Regeln für Compose-Dateien

**Namen:** Docker Compose benennt Container, Netzwerke und Volumes automatisch nach
Projekt und Dienst (z. B. `caddy-caddy-1`). Bei Supabase übernehmen wir die Namen aus
deren Compose-Vorlage. Images nehmen wir offiziell vom Hersteller mit dem Tag, den er
vorgibt.

Ein eigener Name mit `container_name:` ist okay, wenn es Sinn macht, z. B. damit man
den Container bei `docker logs` oder `docker exec` leichter findet:

```yaml
    container_name: caddy
```

**Daten:** Gespeichert wird nur, was in der Compose-Datei als Volume steht (z. B.
`caddy_data` für die Zertifikate). Alles andere ist nach `docker compose down` weg.

**Ports nur auf 127.0.0.1 (außer Caddy):** Docker geht bei veröffentlichten Ports an der Firewall
vorbei. Ein Port wie `"8000:8000"` ist deshalb direkt aus dem Internet erreichbar.
Darum binden wir alle Dienste außer Caddy nur an `127.0.0.1`, dann kommt man nur über
Caddy dran:

```yaml
    ports:
      - "127.0.0.1:8000:8000"
```

Ausnahme ist Caddy: Der bekommt Port 80 und 443 nach außen, ohne `127.0.0.1` (siehe
Compose in Schritt 5).
