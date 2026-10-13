# Prompts Nico Laeser

Genutzte Prompts aus meinen Kommentaren in den Issues, im Wortlaut. Das Datum ist das
Datum des Kommentars. Steht ein Prompt unter mehreren Issues, ist er nur einmal aufgeführt.

Je Fall vier Angaben, wie in der [Vorlage](vorlage.md): **Aufgabe**, **Prompt**,
**Ergebnis**, **Bewertung**. Beim Ergebnis stehen die erzeugten Dokumente mit Link auf den
Commit.

---

## 2026-10-01

---

### 1. Fehlende Issue-Texte für #35 und #36

**Aufgabe**
Die Issues [#35](https://github.com/Finn2103/maschinen-verwaltung/issues/35) (Auswahl der Container-Software) und [#36](https://github.com/Finn2103/maschinen-verwaltung/issues/36) (Aufsetzen der
Container-Software) hatten noch keinen Text. Sie sollten im Aufbau der übrigen Issues
gefüllt und mit den Projektdateien verlinkt werden.

**Prompt** (Wortlaut) · [Kommentar #35](https://github.com/Finn2103/maschinen-verwaltung/issues/35#issuecomment-5928041205), [Kommentar #36](https://github.com/Finn2103/maschinen-verwaltung/issues/36#issuecomment-5928048101)

> https://github.com/Finn2103/maschinen-verwaltung #35 und #36 haben noch keinen Issue Text; Bitte entwickle basierend auf den anderen Issues und Ihrer Struktur mit Hilfe von dem Github MCP Connector, passende Issue Texte und standardisiere ihren Inhalt und die Verlinkung der Projekt files.

**Ergebnis**
Beide Issues haben jetzt Ziel, Warum, Umfang, Akzeptanzkriterien und Links im Aufbau der
anderen Issues. Es gibt keine Datei im Repository, das Ergebnis ist der Issue-Text selbst
([#35](https://github.com/Finn2103/maschinen-verwaltung/issues/35), [#36](https://github.com/Finn2103/maschinen-verwaltung/issues/36)).

**Bewertung**
Teilweise übernommen. Der Aufbau und die Verlinkung passen. Zwei Kriterien in [#36](https://github.com/Finn2103/maschinen-verwaltung/issues/36)
ließen sich dort aber nicht erfüllen: „auf der VM installiert, startet nach dem Reboot“ und
„kein manuelles Nachziehen, Konfiguration als Code“. Beide verlangen die Arbeit aus
[#5](https://github.com/Finn2103/maschinen-verwaltung/issues/5), obwohl der Umfang von [#36](https://github.com/Finn2103/maschinen-verwaltung/issues/36) #5 ausdrücklich ausschließt. Das habe ich am
02.10. in zwei Notizen unter [#36](https://github.com/Finn2103/maschinen-verwaltung/issues/36) geklärt: abgehakt, weil die Umsetzung in #5 liegt.
Lehre: Bei generierten Issue-Texten prüfe ich die Kriterien gegen die Nachbar-Issues, nicht
nur gegen die Struktur.

---

### 2. Nutzwertanalyse Container-Software

**Aufgabe**
Für [#35](https://github.com/Finn2103/maschinen-verwaltung/issues/35) Docker, Podman und Kubernetes vergleichen und die Wahl als ADR festhalten.
Meine eigene Recherche sprach für Docker. Die KI sollte das gegen die Docs prüfen und
falsche Annahmen melden, statt sie zu übernehmen.

**Prompt** (Wortlaut) · [Kommentar #35](https://github.com/Finn2103/maschinen-verwaltung/issues/35#issuecomment-5928041205)

> Lass uns die Nutzwertanalyse für die Containerisierungssoftware basierend auf dem Standard Aufbau der anderen ADR Dateien bauen. Bei meiner Recherche habe ich Kubernetes, Podman und Docker verglichen und habe folgende Punkte gefunden, welche Docker für mich aktuell ins beste Licht stellen:
> - Auch wenn Docker Standardmäßig für Root Daemon bekannt ist, gibt es eine Dokumentation für Rootless: https://docs.docker.com/engine/security/rootless/
> - Die Installation von dem neuen Docker-Compose Plugin ist mittlerweile standard, was für das automatische Deployment aus Issue #5 relevant wird;
> - Kubernetes macht aufgrund der one-Host Situation auch keinen Sinn, da man sich mehr Overhead ins Boot holt.
> - Supabase empfiehlt für die Installation tatsächlich auch Docker und installiert mit https://supabase.link/setup.sh die Docker Engine!
> - Docker hat verschiedene Logging Modes, so könnte man bspw auch das Thema "Zugriffslogs revisionssicher aufbewahren" in Angriff nehmen und bspw vom Reverse-Proxy den Traffic Loggen und dabei sogar noch Retention, Driver und mehr einstellen; Da dies auf Containerebene geht, kann man also auch bestimmte Container ausschließen, wo man keine Logs benötigt.
> - Dokumentation: Docker ist gut dokumentiert und in der Wartung einfach: apt update, apt upgrade und die Engine ist aktualisiert;
>
> In der Nutzwertanalyse vergleichst du zu Kubernetes und Podman und nutzt die Links von den Kubernetes Docs und Podman Docs um zu vergleichen mit dem MCP Web Tool sowie das von mir geschriebene Dokument, damit du maximalen Kontext hast und ich keine Sachen übersehe. Falls annahmen hier falsch sind weist du mich drauf hin und dann machen wir die analyse nicht bis es korrigiert ist. Rufe die gegebenen Links und Scripts auf und prüfe Sie: Bei meiner eigenen Prüfung habe ich nur die Docker Installs gesehen, falls dort alternativ auch Kubernetes oder Podman installiert werden kann vom Script, weise mich darauf hin.

**Ergebnis**
[ADR 0002: Container-Plattform](https://github.com/Finn2103/maschinen-verwaltung/blob/46faf9e/docs/adr/0002-container-plattform.md)
([Commit 46faf9e](https://github.com/Finn2103/maschinen-verwaltung/commit/46faf9e), PR
[#54](https://github.com/Finn2103/maschinen-verwaltung/pull/54)): Sieben gewichtete Kriterien, Docker 4,60, Podman 3,75, Kubernetes 2,90.
Entscheidung: Docker mit Compose-Plugin.

**Bewertung**
Übernommen. Zwei Dinge haben gut funktioniert:
- Die Analyse hat nicht nur meine Punkte für Docker wiederholt. Bei der Isolation gewinnt
  Podman (5 gegen 3), weil es von Haus aus rootless läuft. Das steht so im ADR und ist nicht
  schöngerechnet.
- Kubernetes bleibt in der Tabelle und fällt wegen der Control Plane auf einer einzelnen
  VM zurück. Das deckt sich mit meiner Annahme, ist aber begründet.

Hinweis zum verlinkten Commit: Beim Kriterium „Passung zum Mailserver“ steht dort „#12 ist
entschieden: docker-mailserver“. Die Entscheidung war im Team mündlich mitgeteilt, aber
noch nicht hochgeladen. Im Repository war [#12](https://github.com/Finn2103/maschinen-verwaltung/issues/12) deshalb zu dem Zeitpunkt noch offen.

---

### 3. Nutzwertanalyse Reverse Proxy

**Aufgabe**
Für [#42](https://github.com/Finn2103/maschinen-verwaltung/issues/42) apache2, nginx, Caddy und Traefik vergleichen.

**Prompt** (Wortlaut) · [Kommentar #42](https://github.com/Finn2103/maschinen-verwaltung/issues/42#issuecomment-5928627787)

> Lass uns die Nutzwertanalyse für den Reverse Proxy basierend auf dem Standard-Aufbau der anderen ADR-Dateien bauen. Bei meiner Recherche habe ich apache2, nginx, Caddy und Traefik verglichen. #42 verlangt diese vier, nicht nur die drei aus TECHSTACK. ADR 0002 ist entschieden: Docker mit Compose-Plugin, eine Strato-VM, Dienste nicht auf mehrere Hosts verteilt. Mailserver ist docker-mailserver, nicht Mailcow.
>
> Punkte, die Caddy für mich aktuell ins beste Licht stellen:
> - Für den Normalfall reicht eine knappe Caddyfile. Tiefere Einstellungen sind möglich, aber nicht nötig.
> - TLS macht Caddy selbst. nginx und apache2 brauchen Certbot. Certbot muss das Zertifikat holen und erneuern, per Cron oder Timer. Fällt der Lauf aus, läuft das Zertifikat ab, der Proxy merkt das nicht von selbst.
> - Traefik liest Routen über Labels am Container. Dafür muss der Docker-Socket in den Proxy. Wer den Socket hat, kann Container starten und stoppen, nicht nur Routen lesen. Auf einer VM brauchen wir das nicht.
> - Caddy hat eine Admin-API. Die kann bei der Einrichtung von Infrastructure as Code Vorteile bringen. Ob wir sie nutzen, entscheidet #5. Nicht beschreiben, was die API im Einzelnen kann.
> - Die Entscheidung soll #4 (IT-Grundschutz) unterstützen: öffentlich bleiben Port 80 und 443 am Proxy, die übrigen Dienste müssen nicht am öffentlichen Interface hängen. Nicht schreiben, dass alle Dienste auf 127.0.0.1 laufen müssen.
> - Dokumentation ist kurz. Wartungsaufwand im Team ist gering, solange wir nicht tiefer konfigurieren.
>
> In der Nutzwertanalyse vergleichst du apache2, nginx, Caddy und Traefik. Nutze die offiziellen Docs und das MCP-Web-Tool, plus das, was ich hier geschrieben habe, damit ich nichts übersehe. Falls Annahmen falsch sind, weist du mich darauf hin und machst die Analyse nicht fertig, bis es korrigiert ist. Rufe die gegebenen Links auf und prüfe sie. Bei meiner eigenen Prüfung habe ich nur die knappe Caddyfile und das automatische TLS gesehen. Falls Certbot bei nginx oder apache2 nicht zyklisch angestoßen werden muss, oder Traefik den Docker-Socket nicht braucht, weise mich darauf hin.
>
> Links:
> - https://caddyserver.com/docs/
> - https://doc.traefik.io/traefik/
> - https://nginx.org/en/docs/
> - https://httpd.apache.org/docs/
> - Certbot: https://eff-certbot.readthedocs.io/
> - Issue #42, #15, #5, #4 und ADR 0002 im Repo Finn2103/maschinen-verwaltung
>
> Gewichte summieren auf 1,00. Bewertung 1 bis 5. Warum-Spalte ein Satz, keine Rechnung unter der Tabelle. Entscheidung einfach erklären. Die höchste Punktzahl allein ist keine Begründung.

**Ergebnis**
[ADR 0003: Reverse Proxy](https://github.com/Finn2103/maschinen-verwaltung/blob/e7bc7c8/docs/adr/0003-reverse-proxy.md)
([Commit e7bc7c8](https://github.com/Finn2103/maschinen-verwaltung/commit/e7bc7c8), PR
[#58](https://github.com/Finn2103/maschinen-verwaltung/pull/58)): Caddy 4,70, Traefik 4,10, nginx 4,00, apache2 3,30. Entscheidung: Caddy.

**Bewertung**
Übernommen. Caddy gewinnt nicht überall: Traefik ist bei Docker Compose besser, nginx bei
der Angriffsfläche. Das steht im ADR.

Die Aussagen zu Certbot und Traefik stammen aus meiner Erfahrung und Recherche: Certbot
habe ich bisher immer per Cron laufen lassen. Am 13.10.2026 habe ich sie zusätzlich in den
offiziellen Docs nachgeprüft. Beide stimmen im Kern
([Certbot](https://eff-certbot.readthedocs.io/en/stable/using.html),
[Traefik](https://doc.traefik.io/traefik/reference/install-configuration/providers/docker/)).
Ergänzend: Manche Certbot-Pakete bringen die Erneuerung schon mit, und für den
Docker-Socket gibt es optional den Socket Proxy. Die Entscheidung bleibt.

---

## 2026-10-09

---

### 4. Nutzwertanalyse Monitoring

**Aufgabe**
Für [#14](https://github.com/Finn2103/maschinen-verwaltung/issues/14) Prometheus mit Grafana, Netdata, Uptime Kuma und ein eigenes Skript
vergleichen. Das Skript wird noch nicht gebaut, es soll nur beschrieben werden. Acht
Aussagen aus den Docs sollten einzeln geprüft werden, jede mit Link und Datum.

**Prompt** (Wortlaut) · [Kommentar #14](https://github.com/Finn2103/maschinen-verwaltung/issues/14#issuecomment-6082912300)

> Lass uns die Nutzwertanalyse für das Monitoring aus #14 basierend auf dem Standard-Aufbau der anderen ADR-Dateien bauen. Ich will Prometheus mit Grafana, Netdata, Uptime Kuma und ein eigenes Skript vergleichen. Wir gehen von Supabase (ADR 0006) und docker-mailserver (ADR 0005) aus, alles in Docker auf einer Strato-VM mit Debian 13.
>
> Punkte, die das eigene Skript für mich aktuell ins beste Licht stellen:
> - Bei voller Platte gehen viele Tools kaputt, weil sie keine Logs mehr schreiben können. Dann meldet keiner mehr „Speicher voll“.
> - Wenn Docker durch ein Update kaputt ist und das Monitoring selbst in Docker läuft, überwacht es nichts mehr. Supabase und docker-mailserver laufen beide in Docker.
> - Eine Webseite brauchen wir nicht. Die Übersicht reicht per SSH (`monitor status`). Falls doch eine Schnittstelle gebraucht wird, gibt das Skript die Werte als JSON oder TXT aus.
> - Am liebsten Bash mit systemd-Timer. Meldungen per Webhook mit curl, nur wenn sich etwas ändert.
> - Uptime Kuma war meine erste Idee, misst aber keine Ressourcen wie den Speicherplatz.
>
> Was ich in den Docs gefunden habe. Prüf bitte jeden Punkt und sag mir, ob ich das richtig verstehe:
> - Bei Docker hab ich gelesen, dass Logs standardmäßig „blocking“ geschrieben werden: "The mode log option controls whether to use the blocking (default) or non-blocking message delivery." https://docs.docker.com/engine/logging/configure/ Kann ein Tool im Container dann bei voller Platte hängen bleiben?
> - journald soll selbst etwas Platz frei halten: "SystemKeepFree= and RuntimeKeepFree= control how much disk space systemd-journald shall leave free for other uses." https://man7.org/linux/man-pages/man5/journald.conf.5.html Reicht es dann, wenn unser Skript nur ins Journal schreibt?
> - Supabase hat selbst gehostet wohl keine eigenen Metriken: "the feature is not available in self-hosted Supabase instances." https://supabase.com/docs/guides/telemetry/metrics Und wie viel RAM braucht es eigentlich? Dazu steht da was unter "Minimum requirements for running all Supabase components": https://supabase.com/docs/guides/self-hosting/docker
> - In der Compose-Datei von Supabase haben einige Container Health-URLs, zum Beispiel "http://localhost:9999/health" und "http://storage:5000/status": https://github.com/supabase/supabase/blob/master/docker/docker-compose.yml Welche davon können wir vom Host aus nutzen?
> - Der Healthcheck von docker-mailserver prüft anscheinend nur, ob die Prozesse laufen: "Verifies that all supervisor-managed services that should be running are in the `RUNNING` state." Und weiter unten: "TODO: The script could also verify that service ports have listeners bound (if justified)." https://github.com/docker-mailserver/docker-mailserver/blob/master/target/bin/dms-healthcheck Müssen wir SMTP und IMAP dann selbst prüfen?
> - Prometheus gibt es glaub ich auch als Debian-Paket: "Package: prometheus (2.53.3+ds1-2)" https://packages.debian.org/trixie/prometheus Ist das aktuell genug?
> - Bei Netdata ist die Oberfläche wohl nicht ganz Open Source: "Closed-source but free to use with Netdata Agent and Cloud." https://github.com/netdata/netdata Stimmt das?
> - Bei Uptime Kuma hab ich keine Konfigurationsdatei gefunden, im README steht nur: "Try to use WebSocket with SPA instead of a REST API." https://github.com/louislam/uptime-kuma Gibt es da einen offiziellen Weg?
>
> Welche Tools du nutzen sollst:
> - GitHub-MCP-Connector für Repo und Issues, Branch `staging`: https://github.com/Finn2103/maschinen-verwaltung/tree/staging Lies Issue #14, ADR 0002, 0003, 0005, 0006, `docs/adr/README.md` und `CLAUDE.md` selbst.
> - MCP-Web-Tool für die Docs. Ruf jede Seite oben selbst auf und antworte nicht aus dem Gedächtnis. Wenn ein Link nicht geht, sag Bescheid.
> - Alles, was du zusätzlich behauptest, belegst du mit offiziellen Quellen, Link und Datum. Was du nicht prüfen kannst, markierst du.
>
> Wichtig: Das Skript bauen wir jetzt noch nicht, erstmal brauche ich nur die Analyse. Das Skript kommt danach und baut darauf auf, sobald die anderen Sachen deployed sind: der Datenbank-Server aus #11, der Mailserver aus #13 und die automatische Bereitstellung über Infrastructure as Code aus #5. Vorher können wir es sowieso nicht richtig testen. Ob Docker rootless läuft, wird in #4 entschieden, das kann für die Docker-Prüfung im Skript noch wichtig werden. Schreib also noch keinen Code, nur wie das Skript aussehen soll.
>
> In der Nutzwertanalyse vergleichst du die vier. Bewerte die Tools so, wie sie direkt auf dem Server laufen, nicht im Container. Zabbix und Gatus nur kurz erwähnen. Falls Annahmen falsch sind, weist du mich darauf hin und machst die Analyse nicht fertig, bis es korrigiert ist und ich mindestens einmal alles richtig mit dir abgesprochen und erklärt habe.
>
> Links:
> - Prometheus: https://prometheus.io/docs/
> - Grafana: https://grafana.com/docs/grafana/latest/
> - Netdata: https://learn.netdata.cloud/
> - Uptime Kuma: https://github.com/louislam/uptime-kuma/wiki
> - docker-mailserver: https://docker-mailserver.github.io/docker-mailserver/latest/
>
> Gewichte summieren auf 1,00. Bewertung 1 bis 5. Warum-Spalte: erst die Herkunft (z. B. AK 2), dann ein Satz. Rechnung und Gegenprobe ohne meine zwei Zusatzkriterien. Beim Skript dazuschreiben, dass die Punkte erst durch den Test belegt sind. Kurz und einfache Sätze, ich will es den Lehrern präsentieren. Die Entscheidung treffe ich selbst.

**Ergebnis**
[ADR 0012: Monitoring](https://github.com/Finn2103/maschinen-verwaltung/blob/bf8e514/docs/adr/0012-monitoring.md)
([Commit bf8e514](https://github.com/Finn2103/maschinen-verwaltung/commit/bf8e514), PR
[#76](https://github.com/Finn2103/maschinen-verwaltung/pull/76)): Skript 4,40, Prometheus und Netdata je 3,80, Uptime Kuma 2,80, dazu
eine Beschreibung des Skripts ohne Code und ein Quellenabschnitt mit Stand 09.10.2026.
Die Entscheidung für das Skript steht in PR [#81](https://github.com/Finn2103/maschinen-verwaltung/pull/81).

**Bewertung**
Übernommen, am 13.10.2026 entschieden.
- Die Prüfaufträge sind im ADR mit Quelle und Datum belegt: Speicherbedarf von Supabase,
  Healthcheck von docker-mailserver (deshalb prüft das Skript SMTP und IMAP selbst),
  Docker-Logs, Netdata-Lizenz, Uptime Kuma ohne Konfigurationsdatei.
- Die Punkte des Skripts sind als Ziele gekennzeichnet, belegt erst durch den Test aus #14.
  Dazu gibt es eine Gegenprobe ohne meine zwei Zusatzkriterien (3,50 zu 3,20).
- Das Skript steht nur als Beschreibung da, ohne Code, wie verlangt.

Kurz gehalten sind Zabbix und Gatus, journald und das Debian-Paket von Prometheus. Sie
ändern die Entscheidung nicht.
