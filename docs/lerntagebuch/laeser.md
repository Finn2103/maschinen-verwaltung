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
