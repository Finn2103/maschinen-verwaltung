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

---

## 2026-11-05

Umsetzung des Skripts aus [ADR 0012](../../adr/0012-monitoring.md) für
[#14](https://github.com/Finn2103/maschinen-verwaltung/issues/14). Die Prompts stehen im
Wortlaut aus meinen Notizen. Committet habe ich an beiden Tagen nichts: dazwischen hing
niemand von dem Stand ab.

Das Skript ist Stück für Stück entstanden: Prompt, Gegenlesen, Korrektur, wieder Prompt.
Nicht jede Änderung am Code ist hier festgehalten, das fertige Skript hat 1493 Zeilen.
Dokumentiert sind die Fälle, an denen eine Entscheidung hing. Genau Wortlaut der Antworten
der KI gibt es nicht: Die Sitzungen hatten teilweise sehr große Kontextfenster, mit
Werkzeugaufrufen und langen Antworten hätte ich nach jeder Nachricht endlos lange Passagen
einführen müssen. Je Fall steht das Ergebnis in einem Satz. Der vollständige Chatverlauf
jeder Sitzung liegt, wie in der [README](README.md) beschrieben, lokal auf dem
Arbeitsgerät und ist auf Nachfrage vorzeigbar.

---

### 5. Grundgerüst des Skripts

**Aufgabe**
Das in ADR 0012 beschriebene Skript bauen: Container und Dienste überwachen, Ressourcen
erfassen, Änderungen per Webhook melden, Konfiguration oben im Skript.

**Prompt** (Wortlaut, zwei Eingaben)

> Bitte entwickle ein Bash Script, welches auf einem Debian 13 Server ausgeführt werden kann, um mehrere Schritte zu erledigen:
>
> Das Monitoring von Docker Containern und theoretisch auch System Services soll möglich sein, dafür soll der Docker Socken genutzt werden und die Ressourcen vom System erfasst werden.
>
> Alle paar Sekunden wird gemonitored und an eine Webhook Reported wenn aktiviert. Die Webhook und config Options hat man ganz oben im Skript zum konfigurieren

> Bei Statusänderungen sollen nun bitte noch folgende Typen ausgelöst werden können (gerne auch aus einer JSON Liste oder anderem Format parsebar machen, so dass es mehrere Geben kann: „Discord für eine Discord Webhook“ oder einfach nur Json Webhook zu einem Endpoint

**Ergebnis**
Bash-Skript mit einem Konfigurationsblock oben. Docker wird nur über den Socket abgefragt
(`curl --unix-socket`), Dienste über `systemctl`, Ressourcen aus `/proc`. Webhooks als
JSON-Liste, je Eintrag Typ `discord` oder `json`.

**Bewertung**
Teilweise übernommen. Aufbau und Webhook-Liste passten. Die Container-Zustände waren nicht
vollständig (Fall 6 und 10). „Alle paar Sekunden“ weicht vom systemd-Timer aus ADR 0012 ab.
Das war gewollt und steht als Abweichung im ADR.

---

### 6. Container-Zustände unvollständig

**Aufgabe**
Fehler aus der eigenen Prüfung des ersten Ergebnisses beheben.

**Prompt** (Wortlaut)

> Das Skript ignoriert teilweise die States der Container und erkennt noch nicht die container alle automatisch richtig

**Ergebnis**
Alle Container kommen jetzt aus `/containers/json?all=1`, also auch gestoppte und nie
gestartete. Inspect und Statistik je Container werden gleichzeitig geholt.

**Bewertung**
Korrektur. Das erste Ergebnis hatte Container übersehen. Behoben war damit aber nur die
Erkennung, nicht die Bewertung der Zustände: am 06.11. musste ich noch einmal nachschärfen
(Fall 10). Der Prompt war zu allgemein, er nannte keinen einzigen Zustand.

---

### 7. Pfade und Kennzahlen in den Meldungen, nichts auf die Platte

**Aufgabe**
Meldungen sollen zeigen, wo das Problem liegt. Das Monitoring darf selbst keinen
Speicherplatz belegen (ADR 0012, Fall „Volle Platte“).

**Prompt** (Wortlaut, zwei Eingaben)

> Ich würde gerne Pfade und Statistiken in den Status Meldungen mit senden, falls man die Potenziell verbinden möchte mit dem Problem

> Das Skript muss im RAM laufen damit der Speicherplatz nicht belegt wird und nicht irgendwo die Daten hinschreiben

**Ergebnis**
Jede Prüfung hat ein Feld `details`: bei Containern Compose-Ordner, Mounts, Log-Datei,
CPU, RAM; bei Platten die größten Ordner; bei Diensten die Unit-Datei. Laufzeitdaten nur in
`/run/monitor` (tmpfs), die systemd-Unit macht das Dateisystem für den Dienst
schreibgeschützt.

**Bewertung**
Übernommen. Belegt im Test vom 06.11.: bei voller Platte nennt die Meldung die größten
Ordner, das Monitoring prüft weiter, und ein Schreibversuch aus dem Dienst heraus scheitert
([Tests](../../monitoring/tests/README.md)).

---

### 8. Testinstanz, Statusbefehl, Einrichtung per IaC

**Aufgabe**
Die Fälle aus #14 in einer Test-VM auslösen, den Zustand per Shell abfragen und das
Monitoring aus dem Repository einrichten können.

**Prompt** (Wortlaut, drei Eingaben)

> Können wir eine VMLAB Test Instanz nutzen und beide Fälle einmal simulieren und auslösen und in einem Testdokument belegen?

> Ein Monitor Status command wäre auch geil damit man per Shell den aktuellen State checken kann

> Können wir ein separates Konfiguration Script bauen mit dem man das per Iac konfigurieren kann oder sowas?

**Ergebnis**
Ein Testskript für die VM, `monitor status` als Tabelle und als JSON, und ein eigenes
Skript `monitor-setup` für Installation und Konfiguration.

**Bewertung**
Übernommen. `monitor-setup` ist am 06.11. in `monitor` aufgegangen (Fall 15), weil ich am
Ende nur ein Skript und eine Konfigurationsdatei haben wollte.

---

## 2026-11-06

---

### 9. Modular und für andere Software nutzbar

**Aufgabe**
Einheitliche Meldungen und eine Schnittstelle, die andere Programme lesen können.

**Prompt** (Wortlaut, zwei Eingaben)

> Können wir das Skript Modularer Bauen und standardisieren was die Fehlermeldungen und Report Meldungen angeht?

> Können wir dafür sorgen, dass dieses Skript zukünftig auch von anderer Software genutzt werden kann?

**Ergebnis**
Prüfmodule `system`, `docker`, `services`, `endpoints`. Jede Prüfung liefert dasselbe
Format (`id`, `kind`, `name`, `level`, `status`, `message`, `details`). Feste Schemata für
Zustand (`monitor.status/v1`), Änderung (`monitor.event/v1`) und Bericht
(`monitor.report/v1`), Exit-Codes je Stufe.

**Bewertung**
Übernommen. Im Test geprüft (Schritt 13).

---

### 10. Zustände noch einmal falsch

**Aufgabe**
Die Zuordnung Zustand zu Stufe vollständig machen.

**Prompt** (Wortlaut)

> Das Skript erkennt noch folgende Sachen falsch:
> Created, running, paused, restarting, exited und healthy, unhealthy starting wird nicht berücksichtigt.

**Ergebnis**
Eine Tabelle im Skript ordnet jeden Docker-Zustand einer Stufe zu, auch `dead`, `removing`
und den OOM-Killer. Container, die laufen sollen (Restart-Policy), sind gestoppt ERROR,
einmalige Jobs mit Exit-Code 0 sind INFO.

**Bewertung**
Zweite Korrektur zum selben Thema wie Fall 6. Erst mit der Liste der Zustände im Prompt war
das Ergebnis vollständig. Im Test vom 06.11. sind alle 13 Fälle richtig (Schritt 02 mit
echten Containern, 02b mit nachgestellten Antworten für `dead` und `removing`).

---

### 11. Ressourcen, Load Average und Uptime

**Aufgabe**
Platte, RAM und CPU bewerten, im regelmäßigen Bericht zusätzlich Load und Uptime.

**Prompt** (Wortlaut, zwei Eingaben)

> Das Skript soll am besten auch die Festplatte und RAM und CPU Auslastung erkennen.

> In der Regelmäßigen Webhook wäre noch die Load Average und Uptime gut mit zu senden.

**Ergebnis**
Schwellwerte je Stufe für CPU, RAM, Platte und Inodes, bei CPU und RAM die drei größten
Prozesse. Bericht mit CPU, RAM, Load 1/5/15, Uptime, Platten und offenen Problemen.

**Bewertung**
Übernommen. Belegt im Test: Platte voll und RAM voll lösen eine Meldung aus, der Bericht
enthält Load und Uptime.

---

### 12. Volltest: nicht parallel, Prioritäten, Spam

**Aufgabe**
Einen vollständigen Test in einer neuen Debian-13-VM machen und die Befunde daraus beheben.

**Prompt** (Wortlaut, drei Eingaben)

> Bitte Spawn eine VMLAB Debian 13 Maschine per MCP und sorg dafür, dass wir einmal einen vollen Test umsetzen .

> Ich habe gerade in dem Test festgestellt, dass die Sachen teilweise nicht parallel laufen. Wir müssen parallel arbeiten.
> Unterschiedliche Prioritäten während auch nice: INFO, WARNING, ERROR und CRTICIAL;

> Doppelte Benachrichtigungen und Spam soll bei Restarts / Loops verhindert werden.

**Ergebnis**
VMPal-VM „Monitoring-Test Debian 13“. Alle Module laufen gleichzeitig, jede Prüfung hat
eine der vier Stufen, das Journal bekommt die passende Priorität. Spam-Schutz: Bestätigung
über zwei Durchläufe, höchstens zwei Meldungen je Prüfung im Zeitfenster. Erster
vollständiger Testlauf am 06.11.2026: 68 von 68 bestanden.

**Bewertung**
Übernommen. Dass die Prüfungen nacheinander liefen, habe ich im Test gesehen, nicht beim
Lesen des Codes. Der Spam-Schutz hatte einen Fehler, der erst in den Testläufen aufgefallen
ist (Fall 16).

---

### 13. Schnittstellen aus einer Liste, Beispiel VIES

**Aufgabe**
Beliebige HTTP-Schnittstellen mit Methode und erwartetem Statuscode überwachen, zum
Beispiel die VIES-Schnittstelle für die USt-IdNr.-Prüfung aus #7.

**Prompt** (Wortlaut)

> Mach das so dass wir gerne auch noch optionale API Punkte Monitoren können mit GET, POST, etc aus einer Liste definierbar und dann einen Statuscode erwarten können. Beispielsweise wenn wir für die UstId Prüfung die VIES Schnittstelle checken wollen.

**Ergebnis**
`ENDPOINTS` als JSON-Liste mit `url`, `method`, `headers`, `body`, `expect`, `timeout`,
`level`. In der Konfiguration stehen der Status von VIES und der offizielle Testdienst
(POST, DE / 100), beide mit Stufe WARNING.

**Bewertung**
Übernommen. Im Test antwortet VIES mit 200, eine Test-API mit falschem Code löst ERROR mit
Statuscode und Antworttext aus.

---

## 2026-11-06 · Nachmittag

---

### 14. Abgleich mit ADR 0012

**Aufgabe**
Den Stand mit VMPal testen, gegen ADR 0012 abgleichen und passend zu meinen Notizen
dokumentieren.

**Prompt** (Auszug, Wortlaut; dazwischen standen meine Notizen mit den Prompts oben)

> das muss ich noch alles erledigen. nutze vm pal und simuliere die entwicklung eines bash scriptes für das monitoring wie hier beschrieben https://github.com/issues/assigned?issue=Finn2103%7Cmaschinen-verwaltung%7C14&issue_global_id=I_kwDOUOAbS88AAAABQzHw-g und nutze vmpal; die ergebnisse müssen dokumentiert werden in einer txt und zu unserem chat passen:

**Ergebnis**
Der Abgleich
mit ADR 0012 ergab eine Lücke: „Prüft Supabase mit echter Anmeldung, docker-mailserver über
SMTP und IMAP“ fehlte, das Skript konnte nur HTTP. Neu: Prüfungstyp `tcp` (Port und erste
Zeile, SMTP „220“, IMAP „* OK“) und `command` (z. B. `psql` mit echter Anmeldung, Passwort
in `env`).

**Bewertung**
Übernommen. Die Lücke stand in meiner eigenen Bewertung vom 09.10. (Fall 4: „deshalb prüft
das Skript SMTP und IMAP selbst“), in den Prompts vom 05. und 06.11. habe ich sie aber nicht
verlangt. Getestet wurde deshalb gegen einen echten docker-mailserver statt gegen einen
Platzhalter.

---

### 15. Ein Skript, eine Konfiguration, eine SKILL.md

**Aufgabe**
Die Abgabe klein und erklärbar halten.

**Prompt** (Wortlaut, vier Eingaben, die dritte als Auszug)

> ich brauche am ende maximal ein script und eine config fikle

> please reduce the config to only being config. i only want script (bash), config and a SKILL.md for some agent helping with setting up / creating a config

> no unecessary comments …

> alle scripts die nur für testlauf sind, bitte so protokolieren und unnötige kommentarew auch da entfernen

**Ergebnis**
[`infra/monitoring/`](../../../infra/monitoring) enthält genau drei Dateien: `monitor`
(Prüfen, Melden, Anzeigen und Einrichten mit `install`, `set`, `webhook-add` …),
`monitor.conf` (nur Werte) und `SKILL.md` (Erklärung aller Optionen für einen Agenten).
Aus rund 20 Dateien vom 05.11. wurde eine. Das Testskript ist als „nur für den Testlauf“
gekennzeichnet und liegt bei den Belegen.

**Bewertung**
Übernommen. Die Erklärungen stehen jetzt an einer Stelle (SKILL.md) statt verteilt in
Skript und Konfiguration.

---

### 16. Testläufe finden drei Fehler im erzeugten Code

**Aufgabe**
Den zusammengeführten Stand in der VM vollständig testen.

**Prompt**
Teil des Auftrags aus Fall 14.

**Ergebnis**
Sechs Testläufe, einer davon nach wenigen Sekunden abgebrochen, weil Docker vom vorigen
Abbruch noch gestoppt war. Befunde:
- **Docker-Netz der Test-VM:** systemd-networkd hatte die Schnittstellen der Container
  übernommen, SMTP, IMAP und `psql` kamen über 127.0.0.1 nicht an. Ursache in der VM, nicht
  im Skript.
- **Entwarnung zurückgehalten:** Beim Neustart des Mailservers kamen CRITICAL (gestoppt)
  und WARNING (startet) als zwei Meldungen, danach hielt der Spam-Schutz die Entwarnung
  120 s zurück, im Betrieb wären es bis zu 10 Minuten gewesen. Jetzt geht die Entwarnung
  nach einem gemeldeten Problem immer raus.
- **`set` und `webhook-add` zerstörten die Konfiguration**, wenn ein Wert über mehrere
  Zeilen ging (Fehler vom 05.11.).
- **Das Testskript zählte falsch:** 408 unterdrückte Wechsel, weil es das ganze Journal las,
  auch den alten Dienst. Richtig waren 3.
- **RAM voll nur als WARNING:** Mit Swap lagert der Kernel andere Prozesse aus, die
  Belegung blieb bei 92,7 %. Der Test schaltet Swap für diesen Schritt jetzt ab.

**Bewertung**
Drei der Befunde betreffen KI-erzeugten Code und sind erst im Test aufgefallen, nicht
beim Lesen. Die zurückgehaltene Entwarnung war in einem Lauf sogar „bestanden“, weil der
Test nur prüfte, ob sie ankommt, nicht wann. Der Test prüft das jetzt. Die Zahl 408 sah
plausibel aus und war falsch.

---

### 17. Ist #14 vollständig?

**Aufgabe**
Prüfen, ob alles aus #14 abgedeckt ist, und die Dokumentation von TXT nach Markdown
umstellen.

**Prompt** (Wortlaut)

> stell sicher dass das gesamte Issue14 abgedeckt ist und dass die dokumentation noch in markdown migriert wird

**Ergebnis**
Abgleich mit Issue, ADR 0012, Definition of Done und den Regeln in `docs/ki/prompts`.
Ergänzt: Test „Arbeitsspeicher voll“ (AK 2 und 3 sprechen von „Speicher voll“, getestet war
nur die Platte), diese Einträge (ADR 0012 verlangt Prompt und Bewertung hier), in ADR 0012
„In einem Satz“ und „Umsetzung und Nachweis“, die Dokumentation als
[`docs/monitoring/README.md`](../../monitoring/README.md).

**Bewertung**
Übernommen. Offen bleiben DoD Punkt 3 (läuft auf der Strato-VM) und die echte Zustellung an
einen Kanal des Teams. Beides geht erst, wenn #11, #13 und #5 stehen und der Kanal
entschieden ist.

---

### 18. Ohne Passwörter, jede Anforderung mit Server-Log belegt

**Aufgabe**
Das Monitoring soll ohne Zugangsdaten auskommen. Jede Funktion wird noch einmal getestet und
je Test in einer Markdown-Datei mit den Original-Ausgaben belegt. Dazu eine
Installationsanleitung aus meiner Sicht.

**Prompt** (Wortlaut)

> entwickle das so dass wir möglichst keinerlei Passwörter an das Monitoring skripot geben müssen oder so am besten keins, so dass er das unabhängig hin kriegt. dann bau das wie folgt: SKILL.md entwickelst du, das script auch und dann testest du einmal alle funktionen die jetzt so gehen und machst dafür je eine .MD wo du die server logs rein pastest. das heißt wir dokumentieren auhc die funktionalität aller anforderungen. dann machst du ein kleines INSTALL.md wo du aus meiner SIcht die Installation beschreibst. Sprich Agent skill für config, Install tutorial und dann eine MD wo Speichervoll und diverse Tests gemacht wurden im Container mit original Output etc. Schreib dazu getestet auf einem VMPAl auf meinem MacBook

**Ergebnis**
Das Skript braucht keine Zugangsdaten mehr. Es liest die veröffentlichten Ports der Container
selbst aus der Docker-API und prüft sie ohne Anmeldung: PostgreSQL über den Handshake wie
`pg_isready` (der Server fordert eine Anmeldung an, angemeldet wird nie), SMTP und IMAP über
ihre Begrüßung, Webports über HTTP. Fällt Docker aus, prüft es die zuletzt bekannten Ports
weiter. Das Feld `env` für Passwörter aus Fall 14 ist entfallen. Neu sind
[`SKILL.md`](../../../infra/monitoring/SKILL.md) und
[`INSTALL.md`](../../../infra/monitoring/INSTALL.md), dazu 22 Tests, je Test eine
Markdown-Datei mit Befehlen, Original-Ausgabe, Server-Log und den angekommenen Meldungen
([`docs/monitoring/tests`](../../monitoring/tests/README.md)): 128 von 128 Prüfungen in 21
automatischen Tests bestanden, dazu ein Neustart der VM von Hand.

**Bewertung**
Übernommen. Am deutlichsten zeigt Test 11 den Nutzen: Postfix war aus, Docker meldete den
Mailserver trotzdem als „running, healthy“, erst die Port-Prüfung hat den Ausfall gemeldet.
Das bestätigt den Hinweis aus ADR 0012, dass der Healthcheck von docker-mailserver nur
Prozesse prüft.

Der Preis für „keine Passwörter“: Der Handshake zeigt, dass die Datenbank Verbindungen
annimmt, nicht, dass eine Anmeldung klappt. Die „echte Anmeldung“ aus ADR 0012 entfällt
deshalb, das steht dort als Abweichung. Gemessen wurde auch, was im ADR nur Ziel war: rund
10 % eines Kerns und 26 MB Arbeitsspeicher bei einer Prüfung alle 5 s, kein offener Port.

---

## 2026-11-12

Recherche zu Rechnung, Steuersatz und USt-Id für [#7](https://github.com/Finn2103/maschinen-verwaltung/issues/7).
Die Notizen habe ich selbst geschrieben, dieser Prompt ließ sie prüfen. Die korrigierte
Datei ist [`Rechnung-und-Steuer.md`](../../kundenstammdaten/Rechnung-und-Steuer.md).

### 19. Selbstgeschriebene Steuer-Notizen prüfen und korrigieren

**Aufgabe**
Die selbstgeschriebenen Notizen zu Rechnung, Steuersatz und USt-Id prüfen lassen. Ich hatte
viel aus meiner Erfahrung mit SaaS übernommen und den Verdacht, dass Vermietung steuerlich
anders zählt als SaaS.

**Prompt** (Wortlaut)

> Ich hab dir mal meine selbst geschriebene Datei zu Rechnung und Steuer angehängt. Da hab ich viel aus meiner persönlichen SaaS Erfahrung mit Steuern runtergeschrieben, ich glaube aber nicht dass das 1 zu 1 auf Maschinenvermietung übertragbar ist, SaaS zählt bei Steuern ja nochmal anders. Geh die Datei bitte Punkt für Punkt durch und sag mir wo ich falsch liege. Streich die falschen Sachen nicht einfach raus sondern lass sie drin aber durchgestrichen und schreib die korrekte Regel dahinter, mit Quelle aus dem UStG. Recherchier das bitte selbst nach und schau dir besonders die Fälle mit EU Kunden und Privatpersonen an.

**Ergebnis**
Drei Annahmen aus der SaaS-Erfahrung waren falsch und stehen in
[`Rechnung-und-Steuer.md`](../../kundenstammdaten/Rechnung-und-Steuer.md) durchgestrichen, mit der korrekten Regel dahinter:
- EU-Privatkunde: nicht der Satz seines Landes wie bei SaaS, sondern 19 %. Die Ausleihe und
  die Wartung sind keine digitalen Dienste nach § 3a Abs. 5 UStG.
- OSS betrifft Fernverkäufe und digitale Dienste (§ 18j UStG), nicht die Vermietung von
  Maschinen.
- Zurückgenommen außerdem: Debounce für den Regex, VIES aus dem Browser, und eine eigene
  Plausibilitäts-Wahrscheinlichkeit für die USt-Id.

**Bewertung**
Übernommen. Die durchgestrichenen Zeilen haben zunächst gezeigt, wo die Erfahrung aus
SaaS nicht passte und was stattdessen für die Vermietung gilt. SaaS und Vermietung sind
beide sonstige Leistungen, aber bei SaaS an Privatkunden zählt das Land des Kunden, bei der
Vermietung der Sitz des Verleihs. Bei Geschäftskunden ist es bei beiden Reverse-Charge
(§ 3a Abs. 2 UStG). Nachgerechnet habe ich das an § 3a UStG und dem
Umsatzsteuer-Anwendungserlass, die Quellen stehen in der Datei. Vor dem Merge habe ich die
Streichungen aufgeräumt, die alte Fassung steht in der Git-Historie; die Wartungs-Tabelle
ist gleich mit raus, eine Wartung wird nicht berechnet.

---

## 2026-11-18

### 20. Notizen zu Markdown und Pull Request

**Aufgabe**
Die Notizen zu [#7](https://github.com/Finn2103/maschinen-verwaltung/issues/7) von TXT nach Markdown bringen, Struktur und Grammatik korrigieren, und dafür einen Pull Request öffnen, im Ablauf der bisherigen Dokumentations-PRs.

**Prompt** (Wortlaut)

> Ich habe nun mehrere Markdown Dokumente beschrieben, ich habe wahrscheinlich strukturell und grammatisch im nano beim schreiben in die TXT einige gramatikalische Fehler gemacht. Kannst du diese Bitte beheben und die Dateien in Markdown umwandeln und dann basierend auf den letzten MRs die ich gemacht habe, wieder einen öffnen für das Issue, die dateien entsprechend committen und pushen und mich den MR dann reviewen lassen

**Ergebnis**
Fünf Dateien unter [`docs/kundenstammdaten/`](https://github.com/Finn2103/maschinen-verwaltung/tree/docs/7-kundenstammdaten/docs/kundenstammdaten) ([Commit 34cfdd5](https://github.com/Finn2103/maschinen-verwaltung/commit/34cfdd5), PR [#127](https://github.com/Finn2103/maschinen-verwaltung/pull/127)): Pflichtfelder, Rechnung und Steuer, Dubletten, Suche, Änderungsprotokoll. Branch `docs/7-kundenstammdaten`, Ziel `staging`. Das Issue bleibt offen.

**Bewertung**
Übernommen. Die Dateien sind Markdown, der Pull Request ist offen zum Review. In der Checkliste standen Schema-SQL und Oberfläche als offene Punkte. Das ist nicht meine Aufgabe in diesem PR, beides habe ich streichen lassen. Gemergt ist noch nichts.

---

## 2026-11-19

Abends vor dem Commit des Monitoring-PRs (#134). Der Stand war fertig und getestet, dieser
Prompt war das Gegenlesen wie ein Reviewer.

### 21. Gegenlesen vor dem Commit

**Aufgabe**
Das fertige, getestete Skript vor dem Commit noch einmal wie ein Reviewer durchgehen lassen
und nach Fehlerquellen suchen, die beim Testen und Gegenlesen nicht aufgefallen sind.

**Prompt** (Wortlaut)

> Ich will den monitoring PR jetzt endlich committen und pushen. Lies dir das Skript bitte nochmal komplett durch wie ein Reviewer und such nach Fehlerquellen die mir entgangen sein könnten: dinge die bei jedem durchlauf mitlaufen obwohl sie selten sind, meldungen die zu früh oder zu spät kommen und stellen wo doku und code auseinander laufen. Der VIES check zum Beispiel läuft glaub ich bei jedem durchlauf mit, das sind ja tausende anfragen pro tag an die EU behörde. Gib mir eine liste mit fundstellen und sag jeweils wie du das fixen würdest, committen will ich erst danach.

**Ergebnis**
Drei Fundstellen, alle behoben (Commit 9895810, [befunde.md](../../monitoring/befunde.md), Abschnitt „Gegenlesen vor dem Commit"):
- Die zwei VIES-Endpoints standen in der Standardkonfiguration und liefen alle 10 s mit —
  über 17.000 Anfragen pro Tag an die EU-API. Raus aus der Standardkonfiguration, Beispiel
  auskommentiert.
- Weggefallene Prüfungen (`gone`) umgingen die Bestätigung und meldeten sofort Entwarnung.
  Jetzt über `CONFIRM_CYCLES` bestätigt wie jeder Wechsel (`decide_changes`).
- Doku und Code widersprachen sich zur Entwarnung, ADR 0012 war teils veraltet (Test mit
  Containern der echten Software statt „erst wenn #11 und #13 fertig").

**Bewertung**
Übernommen. Alle drei Punkte waren echt: Der VIES-Fall wäre auf dem Server spätestens bei
der Sperrung aufgefallen, die Sofort-Entwarnung bei einem Modul-Timeout. Das Gegenlesen
hat gefunden, was 22 Tests und mein Lesen nicht gefunden hatten — getestet ist damit nur
der Code vor den Fixes im Detail belegt, die Fixes betreffen Konfiguration, einen Randfall
und die Doku. Reihenfolge bleibt im Protokoll: erst testen, dann gegenlesen, dann
committen.

---

## 2026-11-20

### 22. Dokumentation nachziehen und Präsentation bauen

**Aufgabe**
Die Prompt-Liste nachziehen und die Präsentation für das Review am 26.11. bauen, im
Aufbau der Folien vom 15.10.

**Prompt** (Wortlaut)

> mach mir die folien für das review am donnerstag wie beim letzten mal, gleiche struktur: tickets fertig und offen, entscheidungen, gelernt, probleme, ki offengelegt, nächster sprint, fragen am ende. diesmal: monitoring fertig mit 128 von 128 prüfungen und die meldungen sind im team kanal angekommen, kundenstammdaten als vorschlag mit steuern und GoBD, #9 hab ich angefangen mit der protokoll tabelle. bei entscheidungen: dienst statt timer, spam schutz mit zwei durchläufen, vies raus weil zu viele anfragen, saas korrektur bei den steuern. bei ki: die 22 fälle und das gegenlesen vor dem commit, und das beispiel mit der 408. die datei heisst 2611-Laeser-Review.html wie letztes mal

**Ergebnis**
[`2611-Laeser-Review.html`](../lerntagebuch/2611-Laeser-Review.html): acht Folien im Schema vom 15.10. (PR #90), Pfeiltasten-Navigation. Dazu die
Fragen-und-Antworten-Liste fürs Fachgespräch (Monitoring, Steuern, Audit-Trail, KI).

**Bewertung**
Übernommen. Die Folienstruktur vom 15.10. hat sich bewährt, deshalb unverändert. Was ich
geändert habe: Bei #7 steht die Begründung dabei, warum die Umsetzung offen ist — das gehört
in ein ehrliches Review, nicht nur die Erfolgsmeldung.
