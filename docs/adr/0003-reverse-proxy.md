# ADR 0003: Reverse Proxy

- **Status:** Entwurf
- **Datum:** 2026-10-01
- **Entschieden von:** Nico Laeser
- **Betrifft:** [#42](https://github.com/Finn2103/maschinen-verwaltung/issues/42) · [#5](https://github.com/Finn2103/maschinen-verwaltung/issues/5) · [#15](https://github.com/Finn2103/maschinen-verwaltung/issues/15) · [#35](https://github.com/Finn2103/maschinen-verwaltung/issues/35)
- **Quelle:** Recherche zu apache2, nginx, Caddy und Traefik gegen Docker Compose, Überführung in Markdown am 01.10.2026

## Kontext

Die öffentlichen Endpunkte der Strato-VM brauchen einen Reverse Proxy. Er nimmt
TLS an, leitet auf Anwendung, Supabase und docker-mailserver weiter und muss sich
aus dem Repository wieder aufbauen lassen.

[ADR 0002](0002-container-plattform.md) ist entschieden: Docker mit Compose-Plugin.
Damit hängt die Proxy-Wahl an einer Compose-Umgebung, nicht an einem Paket, das
allein auf dem Host läuft.

#42 nennt vier Kandidaten. Die Prüfung nimmt alle vier mit.

1. **apache2**
2. **nginx**
3. **Caddy**
4. **Traefik**

Die Einrichtung selbst ist #5, die TLS-Automatisierung #15. Hier wird nur gewählt.

## Ausschlusskriterien aus der Pflichtliste

| Ausschlusskriterium | apache2 | nginx | Caddy | Traefik |
| --- | --- | --- | --- | --- |
| Containerisierbar | ja | ja | ja | ja |
| Per Infrastructure as Code aufsetzbar | ja | ja | ja | ja |
| Nach IT-Grundschutz absicherbar | ja | ja | ja | ja |
| Automatische Zertifikatserneuerung möglich | ja | ja | ja | ja |

## Nutzwertanalyse

Punkte 1 (ungeeignet) bis 5 (sehr gut geeignet). Nutzwert = Summe aus Gewicht × Punkte.
Die Gewichte summieren auf 1,00.

| Kriterium | Warum dieses Kriterium | Gewicht | apache2 | nginx | Caddy | Traefik |
| --- | --- | --- | --- | --- | --- | --- |
| Zusammenspiel mit Docker Compose | ADR 0002 ist entschieden, der Proxy muss zu Compose passen. | 0,15 | 2 | 3 | 4 | 5 |
| Automatische Zertifikate | #15 verlangt Erneuerung ohne Handarbeit. | 0,20 | 3 | 3 | 5 | 4 |
| Infrastructure as Code | Pflicht und Kern von #5. | 0,15 | 3 | 4 | 5 | 4 |
| Eine VM, Dienste nicht verteilt | App, Supabase und Mail laufen auf derselben Strato-VM. | 0,10 | 5 | 5 | 5 | 5 |
| Dokumentation | Keine erfahrenen Betreiber, die Anleitung muss kurz sein. | 0,10 | 4 | 5 | 5 | 4 |
| Angriffsfläche nach IT-Grundschutz | Weniger Module, weniger Default-Fläche. | 0,15 | 4 | 5 | 4 | 4 |
| Wartungsaufwand im Team | Harter Abgabetermin, wenig zusätzliche Konfiguration. | 0,15 | 3 | 4 | 5 | 3 |
| **Nutzwert** | | **1,00** | **3,30** | **4,00** | **4,70** | **4,10** |

## Entscheidung

**Caddy.**

Wir nehmen Caddy, weil die Config kurz ist. Für den Normalfall reicht eine knappe
Caddyfile. Tiefere Einstellungen sind möglich, aber nicht nötig. TLS macht Caddy
selbst.

Traefik wäre auch gegangen. Dafür braucht es Labels an jedem Container: Host,
Pfad und Port stehen nicht in einer Proxy-Datei, sondern am Dienst. Damit
Traefik diese Labels liest, muss der Docker-Socket in den Proxy-Container.
Wer den Socket hat, kann Container starten und stoppen, nicht nur Routen lesen.

nginx und apache2 brauchen zusätzlich Certbot. Certbot holt das Zertifikat und
muss es erneuern, per Cron oder Timer. Fällt der Lauf aus, läuft das Zertifikat
ab, der Proxy merkt das nicht von selbst.

Die Tabelle gewinnt Caddy. Die Punktzahl allein reicht nicht. Der Grund ist:
alles liegt auf einer VM, der Proxy soll nur durchreichen und nicht selbst
ein zweites System sein.

Caddy hat eine Admin-API. Die kann bei der Einrichtung von Infrastructure as
Code Vorteile bringen. Ob wir sie nutzen, entscheidet #5.

Die Entscheidung unterstützt [#4](https://github.com/Finn2103/maschinen-verwaltung/issues/4)
(IT-Grundschutz): öffentlich bleiben Port 80 und 443 am Proxy, die übrigen
Dienste müssen nicht am öffentlichen Interface hängen.

## Konsequenzen

- [#5](https://github.com/Finn2103/maschinen-verwaltung/issues/5) setzt Caddy als
  Compose-Dienst auf. Die Caddyfile liegt im Repository. Kein Docker-Socket am Proxy.
- Die Entscheidung unterstützt [#4](https://github.com/Finn2103/maschinen-verwaltung/issues/4):
  öffentlich bleiben Port 80 und 443 an Caddy. Supabase, Anwendung und
  docker-mailserver müssen keine eigenen öffentlichen Ports veröffentlichen.
- [#15](https://github.com/Finn2103/maschinen-verwaltung/issues/15) nutzt die
  automatische Zertifikatszeile von Caddy. Certbot entfällt.
- [docs/TECHSTACK.md](../TECHSTACK.md) nimmt „Reverse Proxy“ aus „Noch offen“ nach
  „Entschieden“.
