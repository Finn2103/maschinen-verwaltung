# Lerntagebuch: Nico Laeser

## 2026-09-11 · Freitag: Projektstart

**Tätigkeit**

- Entscheidungsrunde zur Linux-Distribution mit Alexa, Justin und Laurin. Ich habe
  erwähnt, dass ich auf der Arbeit positive Erfahrungen mit Debian habe und schon
  immer hatte. Ergebnis: Debian 13. Festgehalten später in ADR 0001, nachgetragen am 13.10. von Laurin.
- Ausschlaggebend war, dass eine Person im Team Erfahrung mit Debian-Servern hat und
  bei dringenden Problemen ansprechbar ist. Das bin ich. Laurin, Alexa und Justin
  hatten keine Linux-Server-Erfahrung.

**Problem**

- Die Nutzwertanalyse sieht Ubuntu 26.04 vorn. Am 11.09. standen dort 630 gegen
  540. Die korrigierte Tabelle vom 25.09. steht bei 625 gegen 545. Entschieden
  wurde Debian, und die Abweichung musste begründet werden.

**Lösung**

- Die Begründung steht in ADR 0001, mit dem Hinweis, was sie nicht behauptet:
  Debian gewinnt kein einziges Kriterium der Tabelle.

**Lessons Learned**

- Die Distribution haben wir nicht nach der höchsten Punktzahl gewählt. Ubuntu lag
  in der Analyse vorn. Debian kam, weil im Team jemand den Server kennt.

---

## 2026-09-17 · Donnerstag: Sprint-1-Planning

**Tätigkeit**

- Im Planning zugewiesen bekommen: #3 (Predictive Maintenance), #5 (Infrastructure as
  Code, zusammen mit Justin), #9 (Auftrag mit Audit-Trail) und #10 (Datenbanksystem,
  mit vier anderen).
- #9 habe ich gelesen und überlegt, aber nichts umgesetzt oder festgehalten.

**Problem**

- #5 und #10 waren mehreren Personen zugewiesen. Die Projektregeln verlangen genau
  eine Person je Userstory.
- #9 und #3 gehören nicht zu meiner Fachrichtung Systemintegration.

**Lösung**

- #10 wurde am 18.09. auf eine Person gestellt, #5 am 24.09. bei Justin belassen,
  #3 habe ich am 24.09. abgegeben.

**Lessons Learned**

- Ein Ticket mit mehreren Zuweisungen muss früh geklärt werden. Es kostet sonst
  später Zeit, wenn sich niemand allein zuständig fühlt.

---

## 2026-09-18 · Freitag

Erster Tag mit dem Server und der Arbeit in GitHub. Der Schwerpunkt war das **Einfinden
in die GitHub-Umgebung**.

**Tätigkeit**

- **In die GitHub-Umgebung eingefunden:** Board, Issues und ihre Zuweisungen, Aufbau
  der Tickets, wie wir im Team damit arbeiten.
- #10 (Datenbanksystem festlegen) war am 17.09. fünf Personen zugewiesen, mir auch.
  Am Morgen des 18.09. wurde es auf eine Person gestellt, ich bin nicht mehr dabei.
- Der Server lief ab diesem Tag. Eingerichtet hat ihn Laurin.
- Weitere Tätigkeiten habe ich an dem Tag nicht festgehalten.

**Problem**

- **Einfinden in GitHub und in die Teamabläufe:** welche Tickets sind meine, wer ist
  wofür zuständig, wie hängen die Aufgaben der anderen mit meinen zusammen.
- Ein Ticket hatte mehrere Zuweisungen (#10). Die Projektregeln verlangen genau eine
  Person je Userstory.

**Lösung**

- Die Zuweisung von #10 war nach der Änderung eindeutig: eine Person je Userstory.
- Die Arbeitsweise im Team Schritt für Schritt kennengelernt. Festgelegt wurde sie am
  24.09. und 25.09.: Tickets neu sortiert, Git-Regel (Feature-Branch von `staging`).

**Lessons Learned**

- Wer in ein neues Werkzeug und in ein neues Team einsteigt, braucht zuerst die
  Arbeitsweise (Board, Zuweisung, Branches). Danach kommen die Ergebnisse.
- Die Projektregeln verlangen genau eine Person je Userstory. Bei mir betraf das #10
  (am 18.09. geklärt) und #5 (am 24.09. geklärt).

---

## 2026-09-24 · Donnerstag

Erster Recherchetag. Für die Quellen und die Prompts war dieser Tag da, Commits
gibt es von mir dazu nicht. Was daraus wurde, ist auf GitHub sichtbar.

**Tätigkeit**

- Recherche: Quellen und Links gesucht und gesammelt, zu Container-Plattform,
  Reverse Proxy und Monitoring.
- Ergebnisse der Recherche zur Container-Plattform (#35), so festgehalten im Prompt
  vom 01.10.: Docker hat eine Dokumentation für Rootless. Das Compose-Plugin ist
  Standard und wird für das automatische Deployment in #5 wichtig. Kubernetes bringt
  auf einem einzelnen Host nur Overhead. Supabase empfiehlt selbst Docker. Docker
  kennt Logging-Modi mit Retention und Treiber je Container, das hilft bei
  revisionssicheren Zugriffslogs. Die Wartung ist einfach: `apt update` und
  `apt upgrade`.
- Prompts für die Nutzwertanalysen vorbereitet. Die genutzten Prompts liegen als
  Kommentar unter #35, #36 und #42 (01.10.) und unter #14 (09.10.).
- In die GitHub-Umgebung eingefunden: Board, Issues, Zuweisungen, Branches und
  Pull Requests.
- Meine Tickets neu sortiert, am Morgen: #5 (Infrastructure as Code) und #3
  (Predictive Maintenance) abgegeben. #14 (Monitoring) übernommen. #35
  (Container-Software) und #36 (Docker aufsetzen) angelegt.
- Beide Tickets #35 und #36 waren an dem Tag noch ohne Text.

**Problem**

- Sich in GitHub einzufinden und zu verstehen, wie wir uns als Team managen: wer
  arbeitet wo, wie läuft das Board, wer ist wofür zugewiesen.
- Meine Aufgaben bauten zum Teil auf den Punkten der anderen auf. #36 braucht #35,
  #5 braucht #36, und #14 braucht Datenbank (#11) und Mailserver (#13), die bei
  anderen liegen. Das musste erst geklärt werden, bevor ich anfangen konnte.
- #5 war seit dem 17.09. mir und Justin zugewiesen. Die Projektregeln verlangen
  genau eine Person je Userstory.
- Drei Tickets, und keines davon hatte Ziel, Umfang und Kriterien.

**Lösung**

- Zuweisungen am Morgen geklärt: #5 bleibt bei Justin, ich gebe #3 ab und nehme
  #14. #35 und #36 habe ich angelegt.
- Die Recherche mit Quellen und Links gesammelt und die Prompts vorbereitet. Die
  Analysen habe ich nicht an dem Tag geschrieben, sie stehen seit dem 01.10. (#35, #42)
  und 09.10. (#14) im Repository.

**Lessons Learned**

- Wer sich in ein neues Werkzeug und ein neues Team einfindet, braucht zuerst die
  Arbeitsweise: Board, Zuweisung, Branches. Ergebnisse kommen danach.
- Was andere blockiert, kommt zuerst. Aufgaben, die auf Ergebnissen anderer
  aufbauen, kläre ich früh. Sonst arbeite ich auf Annahmen. Am 01.10. war „#12 ist
  entschieden“ so eine Annahme.
- Ein Ticket ohne Text ist auf dem Board sichtbar und trotzdem keine Aufgabe.

---

## 2026-09-25 · Freitag

Zweiter Recherchetag. Letzter Schultag von Sprint 1. Abgegeben habe ich an dem Tag
noch nichts, das Review von Sprint 1 war für den 01.10. geplant und hat nicht
stattgefunden.

**Tätigkeit**

- Recherche fortgesetzt: Quellen und Links gesammelt, Prompts für die Analysen
  vorbereitet. Die Ergebnisse stehen ab dem 01.10. in ADR 0002 und ADR 0003.
- #42 bekommen: Reverse Proxy kriteriengeleitet auswählen. Finn hat es mir um 10:28 Uhr
  zugewiesen.
- Ergebnisse der Recherche zum Reverse Proxy (#42), so festgehalten im Prompt vom
  01.10.: Für den Normalfall reicht bei Caddy eine knappe Caddyfile. TLS macht Caddy
  selbst, nginx und apache2 brauchen Certbot per Cron oder Timer, und wenn der Lauf
  ausfällt, merkt der Proxy es nicht. Traefik liest Routen über Container-Labels und
  braucht dafür den Docker-Socket. Caddy hat eine Admin-API, ob wir sie nutzen,
  entscheidet #5. Öffentlich bleiben nur Port 80 und 443 (Bezug zu #4).
- Im Team gilt ab diesem Tag die Git-Arbeitsweise: Feature-Branch von `staging`, Pull
  Request zurück nach `staging` (Finn hat sie in `CONTRIBUTING.md` eingetragen).
- Am Sonntag, 27.09., unter #14 den ersten Kandidaten notiert: Uptime Kuma.

**Problem**

- Weiter das Einfinden: wie wir mit Git arbeiten, wurde erst an diesem Tag festgelegt.
- Mein Ticket #42 hängt an der Container-Entscheidung #35. Einen Proxy kann ich erst
  gegen eine festgelegte Plattform vergleichen.
- Uptime Kuma war ein Name unter dem Issue, keine Prüfung. Ob es den Speicherplatz
  misst, wusste ich an dem Tag noch nicht.

**Lösung**

- Quellen und Prompts lagen bereit. Am 01.10. waren #35 und #42 in je einem PR
  fertig (#54 und #58).
- Die Git-Regel brauchte ich schon am 01.10., als ein Merge die Korrekturen vom 25.09.
  verloren hätte.
- Uptime Kuma ist in der Analyse vom 09.10. der Kandidat, der Ressourcen nicht misst.

**Lessons Learned**

- Eine Aufgabe, die an einer anderen hängt, vergleiche ich erst, wenn die Grundlage
  entschieden ist. Erst #35, dann #42 gegen diese Plattform. Traefik hängt am
  Docker-Socket, die anderen drei nicht.
- Ein Name unter dem Issue ist ein Merkzettel. Die Entscheidung ist die Tabelle.

---

## 2026-10-01 · Donnerstag

Erster Tag von Sprint 2. Review von Sprint 1 hat nicht stattgefunden.

**Tätigkeit**

- ADR 0002: Container-Plattform, Docker mit Compose-Plugin. PR #54, Issue #35 geschlossen.
- ADR 0003: Reverse Proxy, Caddy. PR #58, Issue #42 geschlossen.
- Die Ergebnisse der Recherche vom 24./25.09. in Markdown überführt. Quelle in beiden
  ADRs: „Recherche, Überführung in Markdown am 01.10.2026“.
- TECHSTACK bei beiden Zeilen auf „Entschieden“ gesetzt.
- Issue-Texte für #35 und #36 ergänzt. Vorher waren die Issues leer.
- Unter #35, #36 und #42 die genutzten Prompts als Kommentar abgelegt.
- Unter #4 vorgeschlagen, alle Dienste auf `127.0.0.1` zu binden und nur Caddy
  öffentlich zu lassen. Unter #5 vermerkt, dass Docker mit Compose gewählt ist.

**Problem**

- In der ersten Fassung von ADR 0002 stand „#12 ist entschieden: docker-mailserver“.
  Die Entscheidung war im Team mündlich mitgeteilt, aber noch nicht hochgeladen. Im
  Repository war #12 deshalb noch offen, und die Entscheidung lag bei Justin.
- In der README hatte ich die Referenzarchitektur geändert: Caddy ergänzt, die
  Container-Liste verkürzt. Die README ist das Zitat der Aufgabenstellung. Die
  Entscheidung gehört in den ADR und in TECHSTACK.
- Beim Mergen von `staging` wären die Korrekturen vom 25.09. an den Debian-Zahlen
  verloren gegangen (Debian 545 gegen 625, Abweichung in ADR 0001 bleibt begründet).

**Lösung**

- Die Mailserver-Zeile bleibt in der Tabelle, gekennzeichnet als voraussichtlich.
  Gegenprobe ohne sie: Docker 3,85, Podman 3,30, Kubernetes 2,60. Docker bleibt vorn.
  #12 darf docker-mailserver nicht damit begründen, dass ADR 0002 ihn schon voraussetzt.
- README zurückgesetzt. Caddy steht als vierter Kandidat in ADR 0003, mit den
  Kriterien, die er nicht gewinnt.
- Merge so aufgelöst, dass die Korrekturen vom 25.09. bleiben.

**Lessons Learned**

- Docker gewinnt, weil der schon gewählte Supabase-Stack Compose erwartet und weil
  #5 sonst zwei Betriebswege pflegen müsste. Podman ist bei Isolation besser
  (5 gegen 3), weil es von Haus aus rootless läuft. Das bleibt in der Tabelle.
- Kubernetes bleibt in der Tabelle und landet hinten, weil eine Control Plane auf
  einer VM aus #36 und #5 ein Cluster-Thema machen würde.
- Caddy gewinnt, weil TLS und die Konfiguration eine Datei bleiben. Traefik ist bei
  Compose besser, braucht dafür den Docker-Socket. Wer den Socket hat, kann Container
  starten und stoppen. nginx hat die kleinere Angriffsfläche und braucht zusätzlich
  Certbot.
- Die Aufgabenstellung nennt apache2, nginx oder Traefik. Das ist die Orientierung.
  Caddy steht deshalb nicht in der README, sondern in ADR 0003 und in TECHSTACK.
- Eine Begründung, die sich auf eine Entscheidung stützt, die noch nicht gefallen ist,
  trägt im Review nicht. Was nur mündlich entschieden ist, zählt im Repository erst,
  wenn es dort steht.
- Bei generierten Issue-Texten prüfe ich die Kriterien gegen die Nachbar-Issues und
  nicht nur gegen die Struktur. Bei #36 passten zwei Kriterien nicht zum Umfang.

---

## 2026-10-02 · Freitag

**Tätigkeit**

- Installationsanleitung für Docker mit Compose auf Debian 13, `infra/docker/README.md`,
  PR #60, Issue #36
- Log-Treiber `local` mit Rotation, Neustart `unless-stopped`
- Kurzanleitung: Dienst starten, stoppen, aktualisieren
- Beispiel-Caddyfile, antwortet mit 200 „Hello world“
- In TECHSTACK keine feste Versionsnummer, sondern die aktuelle stabile Version aus
  dem Docker-Apt-Repository
- Auf meinem **eigenen Proxmox** eine **Test-VM für IaC** bereitgestellt, um meine
  Schritte aus den ADRs und der Docker-Anleitung selbst zu testen und zu verifizieren
- Hinweise für die Zuständigen hinterlegt: Anleitung und Caddyfile unter #5, Frage
  „Docker Rootless oder normal“ unter #4
- Auf der Test-VM ausgeführt: Docker installieren, Neustart-Test, Log-Rotation.
  Nicht getestet: Beispiel-Caddyfile, Rootless, Lauf über das Playbook.

**Problem**

- Zwei Kriterien in #36 kann #36 selbst nicht erfüllen: „auf der VM installiert,
  startet nach dem Reboot“ und „kein manuelles Nachziehen“. Beides ist die Arbeit
  aus #5. Die KI hatte sie trotzdem in #36 geschrieben.
- Rootless oder normal ist noch nicht entschieden. Das liegt bei #4.
- Die Namen für Images, Netze und Volumes stehen schon in der Supabase-Compose-Datei.
  Eine zweite Konvention daneben wäre eine zweite Quelle.
- Auf der Produktiv-VM mit dem Playbook sollte nicht ausprobiert werden. Dort testet
  auch Justin, und ein Zurücksetzen ist dort nicht mit einem Klick möglich.

**Lösung**

- Die zwei Kriterien sind abgehakt mit einer Notiz unter #36: die Schritte stehen in
  der Anleitung, ausgeführt werden sie vom Playbook in #5.
- Rootless steht als Schritt 6 in der Anleitung. Schritte 1 bis 5 sind die normale
  Installation. Welche Variante gilt, entscheidet #4.
- Eigene Dienste benennen wir nach dem Schema, das Compose und Supabase schon
  vorgeben. Alle Dienste außer Caddy binden nur auf `127.0.0.1`.
- Eigene Test-VM auf meinem Proxmox: die Schritte aus der Anleitung dort ausprobieren,
  und mit einem Klick auf einen sauberen Stand zurücksetzen. Installation, Neustart-Test
  und Log-Rotation liefen ohne Änderung an der Anleitung durch.

**Lessons Learned**

- `unless-stopped` und nicht `always`: ein Container, den wir selbst stoppen, bleibt
  nach einem Reboot aus. Supabase macht das genauso.
- Der Standard-Log-Treiber von Docker rotiert nicht. `local` mit `max-size` und
  `max-file` schon. Sonst füllt das Log die Platte, und genau davor warnt später
  das Monitoring.
- Ein Kriterium, das ein Nachbar-Issue erfüllen muss, hake ich nicht ab, ohne die
  Grenze dazuzuschreiben.
- Eine Anleitung, die ich selbst ausgeführt habe, trägt weiter als eine, die ich nur
  geschrieben habe. Dafür braucht man eine Umgebung, die man gefahrlos zurücksetzen kann.

---

## 2026-10-08 · Donnerstag

Schultag. Sprint 1 wurde an diesem Tag von Finn geschlossen.

**Tätigkeit**

- An #14 (Monitoring) gearbeitet. Die Nutzwertanalyse stand am 09.10. im PR.
- Meine Docker-Anleitung (PR #60, seit 02.10. offen) wurde von Finn nach `staging`
  gemergt, 11:30 Uhr
- #36 geschlossen, 12:19 Uhr, mit einer Notiz: Justin meldet per WhatsApp, dass Ansible
  Docker auf der Testmaschine installiert
- Finn hat zwei Kriterien in #4 ergänzt, die aus meiner Docker-Anleitung kommen

**Problem**

- #36 hängt an #5: ob die Anleitung auf einer Maschine automatisch läuft, konnte ich
  nicht selbst belegen. Der Beleg kam von Justin, am 08.10., sechs Tage nach meiner
  Anleitung.

**Lösung**

- Justins Meldung als Notiz unter #36 festgehalten, mit Quelle (WhatsApp), und erst
  danach geschlossen.

**Lessons Learned**

- Was ein anderer belegt, schreibe ich mit Quelle ans Ticket und nenne es nicht
  meinen eigenen Test.

---

## 2026-10-09 · Freitag

Letzter Schultag von Sprint 2.

**Tätigkeit**

- Nutzwertanalyse für das Monitoring geschrieben, ADR 0012 im Status Entwurf, PR #76
- Verglichen: Prometheus mit Grafana, Netdata, Uptime Kuma, eigenes Skript
- Je einen Hinweis-Kommentar in #4, #5, #11, #12 und #13 hinterlegt: was das Monitoring
  von dem jeweiligen Ticket braucht und wann es gebaut wird
- In #14 zwei Haken ergänzt (Nutzwertanalyse, Planung der Umsetzung) und den Stand
  beschrieben: Analyse fertig, Umsetzung wartet auf #11, #13 und #5
- Acht Aussagen aus den Docs einzeln geprüft, jede mit Link und Datum: Docker-Logs
  werden standardmäßig blockierend geschrieben. journald hält selbst Platz frei
  (`SystemKeepFree`). Selbst gehostetes Supabase hat keine eigenen Metriken, aber
  Container mit Health-URLs. Der Healthcheck von docker-mailserver prüft nur Prozesse.
  Prometheus gibt es als Debian-Paket. Die Netdata-Oberfläche ist nicht vollständig Open
  Source. Uptime Kuma hat keine Konfigurationsdatei.
- Prompt-Log angelegt, zuerst nur die Prompts im Wortlaut (PR #77)

**Problem**

- Uptime Kuma war meine erste Idee. Es misst keine Ressourcen, also auch nicht, ob
  die Platte voll ist. Eine Konfigurationsdatei hat es nicht.
- Der Healthcheck von docker-mailserver prüft nur, ob die Prozesse laufen. SMTP und
  IMAP prüft er nicht.
- Das Monitoring hängt an Datenbank, Mailserver und Playbook. Alle drei liegen bei
  anderen und sind noch nicht gebaut.

**Lösung**

- Bewertet wird jede Lösung so, wie sie direkt auf dem Server läuft, nicht im Container.
  Eine volle Platte und ein Docker-Ausfall muss das Monitoring überstehen.
- Das Skript prüft SMTP und IMAP selbst. Wo ein Container eine Health-URL hat, fragt
  es die zusätzlich ab.
- Acht Aussagen aus den Docs sind im ADR mit Link und Datum vom 09.10.2026 belegt.
  Das Skript selbst ist nur beschrieben, ohne Code.
- Die Abhängigkeiten stehen dort, wo die anderen arbeiten: als Kommentar am jeweiligen
  Ticket, mit Namen der Zuständigen.

**Lessons Learned**

- „Der Dienst läuft“ und „man kann ihn benutzen“ sind zwei Prüfungen. Ein Healthcheck,
  der nur Prozesse zählt, reicht für einen Mailserver nicht.
- Zabbix und Gatus habe ich kurz genannt und nicht in die Tabelle genommen. Sie
  ändern die Entscheidung nicht.
- Wer von den Ergebnissen anderer abhängt, schreibt ihnen das ans Ticket und nicht in
  den eigenen ADR.

---

## 2026-10-15 · Donnerstag

Review von Sprint 2 in Präsenz, danach Planning für Sprint 3.

**Tätigkeit**

- Vor dem Review die Vorstellung vorbereitet, Folien gebaut und gemergt (PR #90,
  [`1510-Laeser-Review.html`](1510-Laeser-Review.html)): Tickets fertig und offen,
  Entscheidungen, Gelerntes, Probleme, KI-Nutzung offengelegt, Vorhaben für den nächsten
  Sprint. Die Folien habe ich mit Grok gebaut (Co-Autor im Commit), die Inhalte stammen
  aus dem Lerntagebuch und den Issues.
- Lerntagebuch hochgeladen (PR #91).
- Vorgestellt: fertig sind #35 (Docker, ADR 0002), #42 (Caddy, ADR 0003) und #36
  (Docker-Anleitung, auf meiner Test-VM ausgeführt). Nicht fertig: #14 Monitoring —
  Werkzeug entschieden (eigenes Skript, ADR 0012 vom 13.10.), aber nicht gebaut und
  nicht getestet. #9 gelesen und recherchiert, nichts umgesetzt.
- Überlegt, welche Issues ich als Nächstes bearbeite: #14, weil die Analyse fertig ist
  und nur noch die Umsetzung fehlt. #9 danach, es ist mit XL das größere.

**Problem**

- Zeigbares war wenig: zu #14 stand nur die Entscheidung im ADR, kein Code. Was zeigt man
  im Review, wenn das Ergebnis eine Entscheidung ist?
- Beide offenen Tickets hängen an Arbeit der anderen: #9 an den Reservierungen aus #1,
  #14 an #11 (Datenbank) und #13 (Mailserver).

**Lösung**

- Vorgestellt, was da war: drei abgeschlossene Entscheidungen mit ADR, eine Anleitung, die
  ich selbst ausgeführt hatte, und #14 als offenes Ticket mit geplantem nächsten Schritt.
- Nächste Arbeit festgelegt: #14. Erst das Skript nach ADR 0012 bauen, #9 danach.

**Lessons Learned**

- Ein Review zeigt den Stand, nicht nur fertige Funktionen. Die Entscheidung mit
  Begründung war zeigbar, der fehlende Code ehrlich benannt.
- Was als Nächstes drankommt, hängt daran, was schon liegt: die Analyse für #14 war
  fertig, also war die Umsetzung der nächste Schritt. Die Planung dafür habe ich am
  16.10. gemacht.

---

## 2026-10-16 · Freitag

Zweiter Schultag von Sprint 3. ADR 0012 war am 13.10. entschieden: eigenes Skript statt
Prometheus, Netdata oder Uptime Kuma. Bevor Code entsteht, wollte ich wissen, aus welchen
Bausteinen das Skript überhaupt besteht und was jeder Baustein liefert.

**Tätigkeit**

- Das Skript aus ADR 0012 in Bausteine zerlegt: Container über den Docker-Socket, Dienste
  über `systemctl`, Ressourcen aus `/proc` und `df`, Meldungen per Webhook mit `curl`.
- Die Bausteine einzeln auf meiner Proxmox-Test-VM (vom 02.10.) ausprobiert:
  - `curl --unix-socket /var/run/docker.sock 'http://localhost/containers/json?all=1'`:
    welche Felder die Docker-API liefert, zum Beispiel `State`, `Status`, `RestartCount`
    und die Pfade.
  - `systemctl is-active` für Dienste und die Prioritäten von `journalctl -p warning` und
    `-p crit` fürs Journal.
  - `df` mit Inodes und `/proc/meminfo` für RAM und CPU.
  - eine Testmeldung an einen Discord-Webhook geschickt, um das Format hinzubekommen
    (Embed, Zeichenzahl, Längen-Grenzen von Discord).
- Notiert, welche Zustände Docker kennt: `created`, `running`, `paused`, `restarting`,
  `exited`, `dead`, `removing`. Die Zuordnung zu Fehler oder normal habe ich offen
  gelassen.
- Aus den Notizen die Prompts vorbereitet, die am 05.11. liefen. Code an diesem Tag
  noch keinen.

**Problem**

- Auf dem echten Server war nichts zu überwachen: #11 (Datenbank) und #13 (Mailserver)
  standen noch aus, deployt wird über #5. Ein Test dort ging nicht.
- Die Zustandsliste von Docker war länger als ich im Kopf hatte. Welche Zustände ein
  Fehler sind und welche normal, war auf den ersten Blick nicht zu entscheiden.
- Der Docker-Socket war nur als root lesbar.

**Lösung**

- Kleine Tests statt ganzem Skript: für die Container reicht ein Docker mit ein paar
  losen Containern, Supabase braucht es dafür nicht. Jeden Baustein einzeln geprüft und
  das Ergebnis in die Notizen gesetzt.
- Die Zustände notiert, aber nicht bewertet. Die Zuordnung kam am 05. und 06.11. in
  zwei Schritten (Fall 6 und Fall 10 in der Prompt-Liste).
- Zum Socket: das passt zu ADR 0012, das Monitoring läuft direkt auf dem Server und nicht
  im Container. Ob Docker rootless läuft, entscheidet #4. Notiert: der Socket muss
  konfigurierbar bleiben.

**Lessons Learned**

- Die Docker-API liefert am Socket alles als JSON und ohne Passwort. Wer sie lesen darf,
  hat die volle Kontrolle über Docker. Die Frage aus #4 (rootless) ist damit wichtiger,
  als ich dachte.
- Bevor ich Zustände bewerte, brauche ich die vollständige Liste. Was ich nicht kenne,
  kann ich nicht einordnen: `paused` und `dead` hätte ich übersehen.
- Bausteine einzeln zu testen war schneller, als das ganze Skript zu bauen und dann zu
  suchen, was nicht geht. Der Fehler lag so immer in genau einem Baustein.

---

## Herbstferien · 17. bis 31.10.2026

Ferien in NRW, kein Projektunterricht. Am Projekt gearbeitet habe ich nicht.

---

## 2026-11-05 · Donnerstag

Erster Schultag nach den Herbstferien (17. bis 31.10. in NRW), Sprint 4. Erster Tag mit
Code für #14: die Prompts aus den Notizen vom 16.10. liefen an diesem Tag. Vom Tag gibt es
keinen Commit: dazwischen hing niemand von dem Stand ab, committet habe ich
üblicherweise abends, wenn der Tag rum ist.

**Tätigkeit**

- Mit Claude die erste Version des Skripts gebaut (Fall 5 in der Prompt-Liste): Bash für
  Debian 13, Docker über den Socket, Dienste über `systemctl`, Ressourcen aus dem System,
  Prüfung alle paar Sekunden, Meldung per Webhook, Konfiguration oben im Skript.
- Die Webhooks als Liste erweitert (Fall 5): je Eintrag der Typ `discord` oder `json`,
  damit es mehrere Empfänger geben kann.
- Beim Gegenlesen aufgefallen: Das Skript hat Container übersehen und Zustände ignoriert.
  Korrekturprompt losgeschickt (Fall 6). Danach kamen alle Container aus
  `/containers/json?all=1`, auch gestoppte und nie gestartete.
- Pfade und Kennzahlen in jede Meldung verlangt (Fall 7): jede Prüfung bekam ein Feld
  `details`. Und das Skript soll im RAM laufen, Laufzeitdaten nur in `/run/monitor`
  (tmpfs), nichts auf die Platte.
- Testinstanz und Befehle angefragt (Fall 8): eine Test-VM, um beide Fälle aus #14
  einmal auszulösen, `monitor status` für den Zustand per Shell und ein eigenes Skript für
  die Einrichtung per IaC.

**Problem**

- Die erste Version hatte Fehler, die erst beim eigenen Gegenlesen auffielen: Container
  wurden nicht alle erkannt, Zustände ignoriert. Der Korrekturprompt (Fall 6) war zu
  allgemein, er nannte keinen einzigen Zustand.
- „Alle paar Sekunden“ passt nicht zum systemd-Timer aus ADR 0012. Eine Prüfung pro
  Minute ist für einen Ausfall zu langsam, und der Spam-Schutz müsste seinen Zustand bei
  jedem Lauf neu aufbauen.
- Den echten Server gab es noch nicht. Testen ging nur in einer eigenen VM.
- Beim Konfigurieren: `set` und `webhook-add` zerstörten mehrzeilige Werte in der
  `monitor.conf` ([Befunde](../../monitoring/befunde.md)), behoben am Folgetag.

**Lösung**

- KI-erzeugten Code selbst gelesen, Zeile für Zeile, statt ihn nur laufen zu lassen. Den
  Fehler mit den Container-Zuständen habe ich im Gegenlesen gefunden und mit einem
  Korrekturprompt behoben (Fall 6). Die vollständige Zuordnung aller Zustände folgte am
  06.11. (Fall 10).
- Zur Taktzeit: erst so gelassen wie im Prompt („alle paar Sekunden“). Die Abweichung
  vom Timer steht als solche in ADR 0012: systemd-Dienst statt Timer, Prüfung alle
  10 Sekunden.
- Die Prompts im Wortlaut in die Notizen gesetzt. Sie stehen jetzt in
  `docs/ki/prompts/Nico-Laeser.md`, Fälle 5 bis 8, mit Ergebnis und Bewertung.

**Lessons Learned**

- Der Prompt bestimmt das Ergebnis: „erkennt die Container nicht richtig“ ohne Zustandsliste
  war zu allgemein, die Korrektur half nur zum Teil. Erst der Prompt mit der aufgezählten
  Liste (Fall 10, am 06.11.) brachte das vollständige Ergebnis.
- Erzeugten Code lese ich selbst. Die Fehler vom 05.11. fielen beim Lesen auf. Eine VM
  allein prüft nichts, sie führt nur aus.
- Nicht jeder Stand muss sofort ins Repository. Solange niemand davon abhängt, reicht der
  Stand in der VM; der Commit ist Feinschliff für abends.

---

## 2026-11-06 · Freitag

Zweiter Schultag nach den Ferien (7:55 bis 12:55), danach zuhause weiter. Die Tests liefen
am Nachmittag von 15:30 bis 15:42.

**Tätigkeit**

- Das Skript ausgebaut (Fälle 9 bis 13 in der Prompt-Liste): Prüfmodule `system`, `docker`,
  `services`, `endpoints` mit einem einheitlichen Meldungsformat, feste Schemata
  (`monitor.status/v1`, `monitor.event/v1`, `monitor.report/v1`) und Exit-Codes, damit auch
  andere Software es nutzen kann (Fall 9).
- Zweite Korrektur der Container-Zustände, diesmal mit der vollständigen Liste im Prompt
  (Fall 10): `created`, `running`, `paused`, `restarting`, `exited`, `healthy`,
  `unhealthy`, `starting`. Eine Tabelle im Skript ordnet jetzt jeden Docker-Zustand einer
  Stufe zu, auch `dead`, `removing` und den OOM-Killer.
- Schwellwerte für CPU, RAM, Platte und Inodes, bei CPU und RAM die drei größten Prozesse;
  im regelmäßigen Bericht Load 1/5/15 und Uptime (Fall 11).
- Erster vollständiger Testlauf in der VMPal-VM: 68 von 68 bestanden (Fall 12). Im Test
  gesehen, nicht beim Lesen: die Prüfungen liefen nacheinander — jetzt parallel, jede
  Prüfung mit einer der vier Stufen INFO bis CRITICAL, der Spam-Schutz mit Bestätigung
  über zwei Durchläufe und höchstens zwei Meldungen je Prüfung im Zeitfenster.
- Schnittstellen aus einer Liste, mit Methode und erwartetem Statuscode (Fall 13), für
  die VIES-Prüfung der USt-IdNr. aus #7.
- Nachmittags den Stand gegen ADR 0012 abgeglichen (Fall 14): Lücke gefunden, SMTP und
  IMAP fehlten. Neu der Prüfungstyp `tcp` (erste Zeile, SMTP „220“, IMAP „* OK“).
- Aufgeräumt (Fall 15): aus rund 20 Dateien vom Vortag wurden drei — `monitor`,
  `monitor.conf`, `SKILL.md`. Das separate `monitor-setup` ist in `monitor` aufgegangen.
- Die Testläufe fanden drei Fehler im erzeugten Code (Fall 16, [befunde](../../monitoring/befunde.md)):
  die Entwarnung wurde vom Spam-Schutz zurückgehalten, das Testskript zählte unterdrückte
  Wechsel falsch, RAM voll löste wegen Swap nur WARNING aus.
- Dokumentation von TXT nach Markdown (Fall 17) und das Skript ohne Passwörter umgebaut
  (Fall 18): Die Ports liest `monitor` selbst aus der Docker-API und prüft sie ohne
  Anmeldung, PostgreSQL über den Handshake, SMTP und IMAP über ihre Begrüßung. Am Ende
  die 22 Tests, je eine Datei mit Befehlen, Original-Ausgabe, Server-Log und den
  angekommenen Meldungen: **128 von 128 Prüfungen bestanden**, dazu ein Neustart der VM von
  Hand.

**Problem**

- Die Entwarnung kam nach einem gemeldeten Problem an, wurde aber vom Spam-Schutz bis zu
  10 Minuten zurückgehalten. In einem Lauf stand sie sogar als „bestanden“, weil der Test
  nur prüfte, ob sie ankommt — nicht wann.
- Das Testskript meldete 408 unterdrückte Wechsel. Die Zahl sah plausibel aus und war
  falsch: es las das ganze Journal, auch den alten Dienst vom Vortag.
- RAM voll blieb bei 92,7 % hängen (WARNING), weil der Kernel mit Swap auslagerte.
- Die Container der Test-VM waren über `127.0.0.1` nicht erreichbar.

**Lösung**

- Die Entwarnung geht nach einem gemeldeten Problem jetzt immer raus, und der Test prüft
  auch, wann sie ankommt.
- Die Journal-Abfragen filtern seitdem den Dienst: richtig waren 3, nicht 408.
- Der RAM-Test schaltet Swap für diesen Schritt ab.
- Das Netz-Problem war die VM, nicht das Skript: systemd-networkd hatte die
  `veth`-Schnittstellen der Container übernommen. Ausnahme für `docker0`, `veth*`,
  `br-*`, danach waren die Container erreichbar.

**Lessons Learned**

- Drei Fehler im KI-erzeugten Code fielen erst im Test auf, nicht beim Gegenlesen. Ein
  Test muss prüfen, was gefordert ist: „Entwarnung kommt“ ist schwächer als „Entwarnung
  kommt rechtzeitig“.
- Eine Zahl, die plausibel aussieht, ist kein Beleg. 408 unterdrückte Wechsel — richtig
  waren 3, nachvollziehbar erst mit dem Befehl, der sie erzeugt.
- Docker und der Port sind zwei Prüfungen: Test 11 zeigt Postfix aus, Docker meldet den
  Mailserver trotzdem als „running, healthy“. Der Healthcheck von docker-mailserver zählt
  nur Prozesse.
