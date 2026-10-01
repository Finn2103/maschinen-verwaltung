# ADR 0003: Reverse Proxy

- **Status:** **Entschieden** am 01.10.2026
- **Datum:** 2026-10-01
- **Entschieden von:** Nico Laeser
- **Betrifft:** [#42](https://github.com/Finn2103/maschinen-verwaltung/issues/42) · [#5](https://github.com/Finn2103/maschinen-verwaltung/issues/5) · [#15](https://github.com/Finn2103/maschinen-verwaltung/issues/15) · [#35](https://github.com/Finn2103/maschinen-verwaltung/issues/35)
- **Quelle:** Recherche zu apache2, nginx, Caddy und Traefik gegen Docker Compose, Überführung in Markdown am 01.10.2026

## Kontext

Die öffentlichen Endpunkte der Strato-VM brauchen einen Reverse Proxy. Er nimmt
TLS an, leitet auf Anwendung, Supabase und den Mailserver weiter und muss sich
aus dem Repository wieder aufbauen lassen.

[ADR 0002](0002-container-plattform.md) entscheidet Docker mit Compose-Plugin.
Damit hängt die Proxy-Wahl an einer Compose-Umgebung, nicht an einem Paket, das
allein auf dem Host läuft. Der Mailserver ist daran nicht beteiligt: [#12](https://github.com/Finn2103/maschinen-verwaltung/issues/12)
ist offen.

Die Referenzarchitektur der Aufgabenstellung nennt drei Kandidaten: **apache2,
nginx oder Traefik**. Das ist Orientierung, keine Vorgabe. **Caddy nehmen wir
als vierten Kandidaten dazu**, weil automatisches TLS ohne einen zweiten Prozess
(Certbot) den Vergleich für #15 verändert. Darüber hinauszugehen ist erlaubt.
Die Begründung steht in diesem ADR, nicht in der README.

1. **apache2**
2. **nginx**
3. **Traefik**
4. **Caddy**, zusätzlich zur Vorlage

Die Einrichtung selbst ist #5, die TLS-Automatisierung #15. Hier wird nur gewählt.

## Ausschlusskriterien aus der Pflichtliste

| Ausschlusskriterium | apache2 | nginx | Caddy | Traefik |
| --- | --- | --- | --- | --- |
| Containerisierbar | ja | ja | ja | ja |
| Per Infrastructure as Code aufsetzbar | ja | ja | ja | ja |
| Nach IT-Grundschutz absicherbar | ja | ja | ja | ja |
| Automatische Zertifikatserneuerung möglich | ja | ja | ja | ja |

Keiner fällt vor der Bewertung heraus.

## Nutzwertanalyse

Punkte 1 (ungeeignet) bis 5 (sehr gut geeignet). Nutzwert = Summe aus Gewicht × Punkte.
Die Gewichte summieren auf 1,00.

| Kriterium | Warum dieses Kriterium | Gewicht | apache2 | nginx | Caddy | Traefik |
| --- | --- | --- | --- | --- | --- | --- |
| Zusammenspiel mit Docker Compose | ADR 0002 entscheidet Docker. Der Proxy muss zu Compose passen. | 0,15 | 2 | 3 | 4 | 5 |
| Automatische Zertifikate | #15 verlangt Erneuerung ohne Handarbeit. | 0,20 | 3 | 3 | 5 | 4 |
| Infrastructure as Code | Pflicht und Kern von #5. | 0,15 | 3 | 4 | 5 | 4 |
| Eine VM, Dienste nicht verteilt | App, Supabase und Mail laufen auf derselben Strato-VM. | 0,10 | 5 | 5 | 5 | 5 |
| Dokumentation | Keine erfahrenen Betreiber, die Anleitung muss kurz sein. | 0,10 | 4 | 5 | 5 | 4 |
| Angriffsfläche nach IT-Grundschutz | Weniger Module, weniger Default-Fläche. | 0,15 | 4 | 5 | 4 | 4 |
| Wartungsaufwand im Team | Harter Abgabetermin, wenig zusätzliche Konfiguration. | 0,15 | 3 | 4 | 5 | 3 |
| **Nutzwert** | | **1,00** | **3,30** | **4,00** | **4,70** | **4,10** |

Rechnung Caddy: \(0,60 + 1,00 + 0,75 + 0,50 + 0,50 + 0,60 + 0,75 = 4,70\).
nginx: \(0,45 + 0,60 + 0,60 + 0,50 + 0,50 + 0,75 + 0,60 = 4,00\).
Traefik: \(0,75 + 0,80 + 0,60 + 0,50 + 0,40 + 0,60 + 0,45 = 4,10\).
apache2: \(0,30 + 0,60 + 0,45 + 0,50 + 0,40 + 0,60 + 0,45 = 3,30\).

## Entscheidung

**Caddy.**

Caddy gewinnt die Tabelle. Die Punktzahl allein reicht nicht. Auf einer VM soll
der Proxy TLS selbst machen und eine Datei bleiben, kein zweites System.

**Caddy liegt nicht überall vorn.**

- **Traefik** gewinnt das Zusammenspiel mit Docker Compose (5 gegen 4). Dafür
  stehen Host, Pfad und Port als Labels am Dienst, nicht in einer Proxy-Datei.
  Damit Traefik die Labels liest, muss der Docker-Socket in den Proxy-Container.
  Wer den Socket hat, kann Container starten und stoppen.
- **nginx** gewinnt die Angriffsfläche (5 gegen 4). nginx und apache2 brauchen
  dafür zusätzlich Certbot. Fällt der Lauf aus, läuft das Zertifikat ab, der
  Proxy merkt das nicht von selbst.
- Bei „eine VM“ stehen alle vier auf 5. Das Kriterium trägt die Entscheidung nicht.

Traefik wäre gegangen. Der Socket-Preis ist auf dieser einen VM zu hoch. nginx
wäre gegangen. Certbot ist ein zweiter Prozess, den #15 dann extra bewachen müsste.

Caddy hat eine Admin-API. Ob wir sie für Infrastructure as Code nutzen, entscheidet #5.

Die Entscheidung unterstützt [#4](https://github.com/Finn2103/maschinen-verwaltung/issues/4)
(IT-Grundschutz): öffentlich bleiben Port 80 und 443 am Proxy, die übrigen
Dienste müssen nicht am öffentlichen Interface hängen.

## Konsequenzen

- [#5](https://github.com/Finn2103/maschinen-verwaltung/issues/5) setzt Caddy als
  Compose-Dienst auf. Die Caddyfile liegt im Repository. Kein Docker-Socket am Proxy.
- Öffentlich bleiben Port 80 und 443 an Caddy. Supabase, Anwendung und der
  Mailserver veröffentlichen keine eigenen öffentlichen Ports. Welcher Mailserver
  das ist, entscheidet [#12](https://github.com/Finn2103/maschinen-verwaltung/issues/12).
- [#15](https://github.com/Finn2103/maschinen-verwaltung/issues/15) nutzt die
  automatische Zertifikatszeile von Caddy. Certbot entfällt.
- [docs/TECHSTACK.md](../TECHSTACK.md) führt „Reverse Proxy“ unter „Entschieden“.
  In der README bleibt die Referenzarchitektur das Zitat der Aufgabenstellung
  (apache2, nginx oder Traefik). Caddy steht dort nicht.
