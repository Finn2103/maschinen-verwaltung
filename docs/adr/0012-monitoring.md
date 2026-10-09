# ADR 0012: Monitoring für Datenbank- und Mailserver

- **Status:** Entwurf
- **Datum:** 2026-10-09
- **Entschieden von:** offen
- **Betrifft:** [#14](https://github.com/Finn2103/maschinen-verwaltung/issues/14) · [#11](https://github.com/Finn2103/maschinen-verwaltung/issues/11) · [#12](https://github.com/Finn2103/maschinen-verwaltung/issues/12) · [#13](https://github.com/Finn2103/maschinen-verwaltung/issues/13)
- **Quelle:** Recherche, Stand 09.10.2026. KI-gestützter Entwurf, Gewichte und Punkte sind
  Vorschläge und werden vor der Entscheidung geprüft.

## Kontext

Für [#14](https://github.com/Finn2103/maschinen-verwaltung/issues/14) brauchen wir ein Monitoring für Datenbank- und Mailserver. Die Akzeptanzkriterien
(AK) aus dem Issue:

1. Verfügbarkeit, Auslastung und Fehler beider Dienste sind in einer Übersicht sichtbar.
2. Ist ein Dienst nicht erreichbar oder der Speicher voll, kommt eine Meldung.
3. Beide Fälle werden künstlich ausgelöst, und die Meldung kommt an.
4. Die Konfiguration liegt als Code im Repository.

Gerechnet wird mit Supabase als Datenbank ([ADR 0006](0006-datenhaltung.md)) und
docker-mailserver als Mailserver ([ADR 0005](0005-mailserver.md)). Beide laufen in Docker
auf derselben Strato-VM und bringen kein brauchbares eigenes Monitoring mit: Supabase hat
selbst gehostet keine Metrik-Schnittstelle, der Healthcheck von docker-mailserver prüft nur,
ob die Prozesse laufen. Zusammen brauchen beide mindestens 4,5 GB Arbeitsspeicher, das
Monitoring muss also sparsam sein.

Verglichen werden:

1. **Prometheus** mit Grafana, der Standard unter den fertigen Werkzeugen
2. **Netdata**, eine schlanke fertige Alternative
3. **Uptime Kuma**, im Issue als erste Idee genannt
4. **Eigenes Skript**, mit KI erstellt

Weitere bekannte Werkzeuge sind nicht in der Tabelle, weil sie für eine einzelne VM zu groß
sind oder nur als Container laufen.

## Zwei Fälle, die das Monitoring selbst überstehen muss

- **Volle Platte:** Ein Werkzeug, das laufend Daten oder Logs schreibt, kann bei voller
  Platte selbst ausfallen. Dann kommt die Meldung „Speicher voll“ nie an.
- **Docker fällt aus:** Supabase und docker-mailserver laufen in Docker. Läuft das
  Monitoring auch dort, fällt es mit aus.

Deshalb wird jedes Werkzeug so bewertet, wie es **direkt auf dem Server** läuft, nicht als
Container.

## Ausschlusskriterien

| Ausschlusskriterium | Prometheus | Netdata | Uptime Kuma | Skript |
| --- | --- | --- | --- | --- |
| Läuft direkt auf Debian 13, ohne Docker | ja | ja | ja, über Node.js | ja |
| Ohne fremde Cloud | ja | ja | ja | ja |

Keiner fällt raus.

## Nutzwertanalyse

Punkte 1 (ungeeignet) bis 5 (sehr gut). Nutzwert = Summe aus Gewicht × Punkte.

| Kriterium | Warum dieses Kriterium | Gewicht | Prometheus | Netdata | Uptime Kuma | Skript |
| --- | --- | --- | --- | --- | --- | --- |
| Prüfumfang | **AK 1 und 2.** Der eigentliche Auftrag: Datenbank, Mailserver, Speicherplatz und Auslastung überwachen. | 0,30 | 5 | 4 | 2 | 4 |
| Benachrichtigung | **AK 2.** Wir wollen eine Meldung beim Ausfall und eine Entwarnung, wenn alles wieder läuft. | 0,10 | 5 | 5 | 4 | 4 |
| Robust bei voller Platte | **AK 2.** Gerade wenn die Platte voll ist, muss die Meldung noch rausgehen. | 0,10 | 2 | 3 | 2 | 4 |
| Robust bei Docker-Ausfall | **AK 2.** Fällt Docker aus, sind Datenbank und Mailserver weg, und das muss gemeldet werden. | 0,10 | 4 | 5 | 3 | 5 |
| Konfiguration als Code | **AK 4 und Pflichtvorgabe.** Der Server muss sich aus dem Repository neu aufbauen lassen. | 0,10 | 5 | 4 | 1 | 5 |
| Ressourcenbedarf | **Projektrahmen.** Alles läuft auf einer VM, jedes Megabyte fürs Monitoring fehlt den Diensten. | 0,10 | 2 | 3 | 4 | 5 |
| Angriffsfläche | **Pflichtvorgabe IT-Grundschutz.** Jeder offene Port und jede Weboberfläche ist ein zusätzliches Risiko. | 0,10 | 2 | 3 | 3 | 5 |
| Erklärbarkeit | **Projektrahmen.** Wir müssen im Fachgespräch erklären können, wie es funktioniert. | 0,10 | 3 | 3 | 5 | 4 |
| **Nutzwert** | | **1,00** | **3,80** | **3,80** | **2,80** | **4,40** |

Zu den Gewichten: Der Prüfumfang ist der Auftrag selbst und zählt deshalb dreifach. Die
übrigen sieben zählen gleich, weil keins davon wichtiger ist als die anderen.

Rechnung Skript: \(1,20 + 0,40 + 0,40 + 0,50 + 0,50 + 0,50 + 0,50 + 0,40 = 4,40\).
Prometheus: \(1,50 + 0,50 + 0,20 + 0,40 + 0,50 + 0,20 + 0,20 + 0,30 = 3,80\).
Netdata: \(1,20 + 0,50 + 0,30 + 0,50 + 0,40 + 0,30 + 0,30 + 0,30 = 3,80\).
Uptime Kuma: \(0,60 + 0,40 + 0,20 + 0,30 + 0,10 + 0,40 + 0,30 + 0,50 = 2,80\).

**Gegenprobe:** Ohne die Kriterien „Robust bei voller Platte“ und „Robust bei
Docker-Ausfall“ liegt das Skript mit 3,50 weiterhin vor Prometheus mit 3,20. Das Ergebnis
hängt also nicht an diesen beiden Kriterien.

## Ergebnis

- **Das Skript liegt vorn**, stark bei Docker, Konfiguration, Ressourcenbedarf und
  Angriffsfläche. Nicht vorn liegt es beim Prüfumfang, bei der Benachrichtigung und bei der
  Erklärbarkeit. Seine Punkte sind Ziele und keine Messwerte. Belegt sind sie erst, wenn
  der Test aus [#14](https://github.com/Finn2103/maschinen-verwaltung/issues/14) bestanden ist.
- **Prometheus und Netdata liegen gleichauf.** Prometheus prüft am gründlichsten, braucht
  aber mehrere Dienste und viel Speicher. Netdata ist sparsamer und robuster, seine
  Oberfläche ist aber nicht frei lizenziert.
- **Uptime Kuma** misst keine Ressourcen und hat keine Konfigurationsdatei.

Zwischen Skript und den fertigen Werkzeugen liegen 0,60. Die Tabelle allein entscheidet das nicht.

## Wie das Skript aussehen würde

- Am liebsten Bash, läuft direkt auf dem Server. Ein systemd-Timer startet es jede Minute.
- Prüft Supabase mit echter Anmeldung, docker-mailserver über SMTP und IMAP, dazu Platte,
  Arbeitsspeicher und Docker.
- Wo ein Container eine Health-URL hat, fragt es die zusätzlich mit `curl` ab. Bei Supabase
  haben zum Beispiel Auth, Storage und der Pooler eine. docker-mailserver hat nur einen
  internen Healthcheck, dort bleiben SMTP und IMAP.
- Meldet nur Änderungen, also Ausfall und Entwarnung, per Webhook mit `curl`. Dafür
  schreibt es nichts auf die Platte.
- Übersicht per SSH mit `monitor status`, keine Webseite.
- Bei Bedarf stellt es die Werte zusätzlich als JSON- oder Textdatei in `/run` bereit, damit
  andere Programme sie lesen können. `/run` liegt im Arbeitsspeicher und funktioniert auch
  bei voller Platte.

## Konsequenzen

- Getestet werden kann erst, wenn [#11](https://github.com/Finn2103/maschinen-verwaltung/issues/11) und [#13](https://github.com/Finn2103/maschinen-verwaltung/issues/13) fertig sind. Dazu gehört auch, die Platte
  vollzuschreiben und Docker zu stoppen.
- Das Monitoring läuft bewusst außerhalb von Docker und weicht damit von
  [ADR 0002](0002-container-plattform.md) ab. Installiert wird es trotzdem per Skript aus
  dem Repository.
- Fällt die ganze VM aus, meldet das kein Monitoring auf derselben VM. Das wird als Grenze
  dokumentiert.
- Webhook-Adresse und Datenbank-Zugang liegen nicht im Repository, sondern nur auf dem
  Server ([Definition of Done](../scrum/definition-of-done.md), Punkt 6).
- Wird es das Skript, kommen Prompt und Bewertung nach [`docs/ki/prompts`](../ki/prompts/README.md).

## Fragen und Antworten

**Warum zählt der Prüfumfang dreifach?**
- Das sind AK 1 und 2
- Kann ein Werkzeug das nicht, ist [#14](https://github.com/Finn2103/maschinen-verwaltung/issues/14) nicht erfüllt

**Warum bekommt das Skript Punkte, obwohl es noch nicht existiert?**
- Bewertet wird der Plan
- Einen Punkt weniger überall dort, wo die fertigen Werkzeuge es schon können
- Belegt erst durch den Test aus AK 3

**Widerspricht das Monitoring außerhalb von Docker nicht ADR 0002?**
- Nein, ADR 0002 regelt, worauf unsere Dienste laufen
- Das Monitoring überwacht Docker und darf deshalb nicht davon abhängen
- Installiert wird es trotzdem per Skript aus dem Repository

**Was passiert bei Prometheus, wenn die Platte voll ist?**
- Es schreibt seine Messwerte laufend auf die Platte
- Bei voller Platte schlagen die Schreibvorgänge fehl
- Laut Fehlerberichten Absturz oder beschädigte Daten

**Warum ist das Skript bei der Erklärbarkeit eine 4, obwohl es mit KI erstellt wird?**
- Es ist ein kleines Bash-Skript ohne versteckte Teile
- Wir gehen es vor dem Einsatz Zeile für Zeile durch
- Uptime Kuma ist noch einfacher, deshalb keine 5

**Was ist `/run`, und warum hilft das?**
- Liegt im Arbeitsspeicher, nicht auf der Platte
- Das Skript kann dort auch bei voller Platte noch schreiben

**Wie kommt eine Meldung an, wenn der Mailserver ausgefallen ist?**
- Nicht über unseren Mailserver
- Per Webhook nach außen, zum Beispiel an einen Messenger
- Welcher Dienst, ist noch offen

**Passt Bash zur Pflicht zum objektorientierten Ansatz?**
- Die Pflicht gilt für die Anwendung
- Umgesetzt in der Domänenschicht im Next.js-Server, siehe [TECHSTACK](../TECHSTACK.md)
- Das Skript ist ein Betriebswerkzeug

**Wie erreicht das Skript die Health-URLs der Container?**
- Es läuft direkt auf dem Server
- Der Server erreicht die Container im Docker-Netz
- Von außen erreichbar sind nur der API-Gateway und der Pooler von Supabase

## Quellen

Stand 09.10.2026.

- Supabase: [Self-Hosting mit Docker](https://supabase.com/docs/guides/self-hosting/docker) · [Metriken nur in der Cloud](https://supabase.com/docs/guides/telemetry/metrics)
- docker-mailserver: [Systemanforderungen](https://docker-mailserver.github.io/docker-mailserver/latest/faq/) · [Healthcheck](https://github.com/docker-mailserver/docker-mailserver/blob/master/target/bin/dms-healthcheck)
- Prometheus: [Paket in Debian 13](https://packages.debian.org/trixie/prometheus) · [Fehlerbericht volle Platte](https://access.redhat.com/node/6724901)
- Netdata: [Ressourcenbedarf](https://learn.netdata.cloud/docs/netdata-agent/resource-utilization) · [Lizenz der Oberfläche](https://github.com/netdata/netdata)
- Uptime Kuma: [Installation ohne Docker](https://github.com/louislam/uptime-kuma/wiki)
- Docker: [Logs werden standardmäßig blockierend geschrieben](https://docs.docker.com/engine/logging/configure/)
