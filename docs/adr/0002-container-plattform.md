# ADR 0002: Container-Plattform

- **Status:** Entwurf
- **Datum:** 2026-10-01
- **Entschieden von:** Nico Laeser
- **Betrifft:** [#35](https://github.com/Finn2103/maschinen-verwaltung/issues/35) · [#36](https://github.com/Finn2103/maschinen-verwaltung/issues/36) · [#5](https://github.com/Finn2103/maschinen-verwaltung/issues/5) · [#42](https://github.com/Finn2103/maschinen-verwaltung/issues/42)
- **Quelle:** Recherche (Docker Engine, Compose-Plugin, Rootless, Self-Hosting von Supabase, docker-mailserver aus #12), Überführung in Markdown am 01.10.2026

## Kontext

Auf der Strato-VM laufen Anwendung, selbst gehostetes Supabase und später der
Mailserver nebeneinander. Die Pflichtliste verlangt Infrastructure as Code: die
Umgebung muss sich zerstören und aus dem Repository wieder aufbauen lassen.
Dafür braucht es eine Container-Plattform.

Bewertet werden drei Kandidaten, so steht es in
[docs/TECHSTACK.md](../TECHSTACK.md) noch unter „Noch offen“:

1. **Docker** mit Compose-Plugin
2. **Podman** mit Compose-Kompatibilität
3. **Kubernetes**

Die Wahl hängt an [ADR 0001](0001-linux-distribution.md) (Debian 13) und an
[ADR 0006](0006-datenhaltung.md) (Supabase selbst gehostet). Sie wird in #35
getroffen, in #36 aufgesetzt und von #5 (Infrastructure as Code) und #42
(Reverse Proxy) benutzt.

## Ausschlusskriterien aus der Pflichtliste

| Ausschlusskriterium | Docker | Podman | Kubernetes |
| --- | --- | --- | --- |
| Läuft auf einer Strato-VM mit Debian 13 | ja | ja | ja |
| Containerisierbar und per Infrastructure as Code aufsetzbar | ja | ja | ja |
| Nach IT-Grundschutz absicherbar | ja | ja | ja |
| Selbst gehostetes Supabase betreibbar | ja | ja | ja |

## Nutzwertanalyse

Punkte 1 (ungeeignet) bis 5 (sehr gut geeignet). Nutzwert = Summe aus Gewicht × Punkte.
Die Gewichte summieren auf 1,00.

| Kriterium | Warum dieses Kriterium | Gewicht | Docker | Podman | Kubernetes |
| --- | --- | --- | --- | --- | --- |
| Offizieller Weg für selbst gehostetes Supabase | ADR 0006 ist entschieden. Compose ist der dokumentierte Betriebsweg. Ob `setup.sh` genutzt wird, ist offen; die Engine steht vorher schon. | 0,20 | 5 | 3 | 2 |
| Wiederaufbau per Infrastructure as Code | Pflicht und Kern von #5: ein Befehl, kein Cluster-Betrieb. Compose-Plugin ist der Standardweg (`docker compose`). | 0,15 | 5 | 4 | 2 |
| Betrieb auf einer einzelnen VM | Alle drei laufen auf einer VM. Docker und Podman sind dafür gebaut. Kubernetes läuft ebenfalls, trägt aber eine Control Plane mit. | 0,15 | 5 | 5 | 4 |
| Passung zu docker-mailserver | #12 ist entschieden: **docker-mailserver**. Der Stack ist ein Docker-Compose-Projekt, Updates laufen über Compose. Eine zweite Runtime daneben wäre ein zweiter Betriebsweg. | 0,15 | 5 | 3 | 2 |
| Dokumentation und Wartung | Vier Systemintegrationen am Aufbau, harter Abgabetermin. Engine-Updates über das Docker-Apt-Repository. | 0,10 | 5 | 3 | 3 |
| Isolation nach IT-Grundschutz | Podman ist nativ rootless. Docker startet rootful; Rootless muss manuell aktiviert werden. | 0,15 | 3 | 5 | 4 |
| Logging als Hebel für #19 | Driver, Retention und Filter je Container. Revisionssicherheit erfüllt das allein nicht; die Senke bleibt Aufgabe von #19. | 0,10 | 4 | 3 | 4 |
| **Nutzwert** | | **1,00** | **4,60** | **3,75** | **2,90** |

Rechnung Docker: \(1,00 + 0,75 + 0,75 + 0,75 + 0,50 + 0,45 + 0,40 = 4,60\).
Podman: \(0,60 + 0,60 + 0,75 + 0,45 + 0,30 + 0,75 + 0,30 = 3,75\).
Kubernetes: \(0,40 + 0,30 + 0,60 + 0,30 + 0,30 + 0,60 + 0,40 = 2,90\).

## Entscheidung

**Docker mit Compose-Plugin.**

Der Abstand entsteht an den Stellen, die dieses Projekt schon festgelegt hat:
Supabase selbst gehostet und ein Wiederaufbau in wenigen Dateien auf **einer** VM.
Compose ist dafür der dokumentierte Weg, unabhängig davon, ob später das
Supabase-`setup.sh` oder ein eigenes IaC-Skript aus #5 den Stack startet.

**Podman gewinnt das Kriterium Isolation** (5 gegen 3). Podman ist **nativ
rootless**. Docker ist standardmäßig ein Root-Daemon; Rootless gibt es
([Dokumentation](https://docs.docker.com/engine/security/rootless/)), muss aber
**manuell aktiviert** werden. Das bleibt stehen und wird nicht schöngerechnet.

Ob das Supabase-`setup.sh` überhaupt zum Einsatz kommt, ist nicht Teil dieser
Entscheidung. Festgelegt ist nur die Runtime. In #36 bzw. #5 wird Docker Engine
und Compose-Plugin **zuerst** installiert. Ein späteres Hersteller-Skript, das
Docker voraussetzt, prüft, ob die Engine schon da ist, und überspringt die
eigene Installation. Der Mehraufwand ist minimal: einmal Engine aufsetzen,
danach installiert das Skript den Rest und nicht noch einmal Docker.

**Kubernetes verliert am Wiederaufbau und an den Hersteller-Wegen.** Es läuft auf einer VM, bringt aber eine Control Plane mit. #36 und #5 würden zum Cluster-Thema. Deshalb bleibt Kubernetes in der Tabelle und landet trotzdem hinten.

Die höchste Punktzahl allein ist keine Begründung. Docker gewinnt, weil der
bereits gewählte Supabase-Stack und der entschiedene Mailserver
(**docker-mailserver**) Compose erwarten und weil #5 sonst zwei Betriebswege
pflegen müsste.

## Konsequenzen

- [#36](https://github.com/Finn2103/maschinen-verwaltung/issues/36) setzt Docker
  Engine und Compose-Plugin auf Debian 13 **vor** Supabase und Mailserver auf.
- [#5](https://github.com/Finn2103/maschinen-verwaltung/issues/5) beschreibt den
  Wiederaufbau über Compose-Dateien und Install-Skript. Die Engine kommt aus dem
  Docker-Apt-Repository (`docker-ce`), nicht aus Debians Paket `docker.io`.
- [#42](https://github.com/Finn2103/maschinen-verwaltung/issues/42) prüft den
  Reverse Proxy gegen eine Compose-Umgebung.
- [docs/TECHSTACK.md](../TECHSTACK.md) nimmt „Container-Plattform“ aus „Noch offen“
  nach „Entschieden“.
- [#12](https://github.com/Finn2103/maschinen-verwaltung/issues/12) ist entschieden:
  **docker-mailserver**. Der Stack läuft als Compose-Projekt auf derselben Engine.
- Rootless ist bei Docker optional und muss in #36 bewusst an- oder ausgeschaltet
  werden. Default der Engine ist rootful.
- Ein späteres Hersteller-Skript darf die Engine nicht ein zweites Mal
  installieren; es läuft gegen die bereits vorhandene Installation.
