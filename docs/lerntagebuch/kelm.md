# Lerntagebuch: Justin Kelm

Rolle: Systemintegrator · Gruppe 11 · Maschinenverleih

Format nach der Vorlage der Lehrkräfte: **Datum · Tätigkeit · Problem · Lösung · Lessons Learned.** Ein Abschnitt pro Schultag, neueste Einträge oben.

Hinweise zum Ausfüllen stehen in [`README.md`](README.md), besonders der Punkt, dass für die Abgabe zusätzlich eine Word-Fassung im Loop-Arbeitsbereich verlangt ist.

---

## 2026-11-26 · Donnerstag: Review

**Tätigkeit**
- Review

**Problem**
- 

**Lösung**
- 

**Lessons Learned**
- 

## 2026-11-20 · Freitag:

**Tätigkeit**
- Live-Server mit Ansible eingerichtet
- HTTPS für bbk-it-11.de und www.bbk-it-11.de geprüft
- Eigene BBK-IT-Startseite veröffentlicht
- Vollständigen Wiederherstellungstest auf dem Testserver durchgeführt
- Live-Playbook erneut ausgeführt und GitHub-Branch aktualisiert

**Problem**
- Test- und Live-Konfiguration mussten sauber getrennt bleiben
- Beim vollständigen Reset durfte nur der Testserver verändert werden

**Lösung**
- Testserver vollständig zurückgesetzt und mit Ansible neu aufgebaut
- Container und HTTP-Antwort geprüft
- Konfiguration im Feature-Branch gesichert

**Lessons Learned**
- Der Testserver konnte in 1 Minute und 6,88 Sekunden vollständig wiederhergestellt werden.
- Der erneute Live-Durchlauf dauerte 35,80 Sekunden.
- Ich habe gelernt, wie wichtig getrennte Inventories, Tests und eine saubere Versionsverwaltung sind.

## 2026-11-19 · Donnerstag:

**Tätigkeit**
- Sicherheitsupdates und Ansible-Konfiguration auf dem Testserver kontrolliert
- Vorbereitung des Wechsels auf den Live-Server

**Problem**
- Protokolle und Paketquellen waren nicht sofort leicht zu überprüfen

**Lösung**
- Konfiguration und Status der automatischen Sicherheitsupdates kontrolliert

**Lessons Learned**
- Vor dem Einsatz auf dem Live-Server sollte die Konfiguration auf dem Testserver nachvollziehbar funktionieren.

## 2026-11-13 · Freitag:

**Tätigkeit**
- Live-Server-Einrichtung weiter vorbereitet und getestet
- Ansible-Dateien für Test- und Live-Server getrennt

**Problem**
- Es bestand die Gefahr, versehentlich Testdateien auf dem Live-Server zu verwenden

**Lösung**
- Eigene Variablen für Compose-Datei, Caddyfile und Website-Datei verwendet

**Lessons Learned**
- Eine klare Trennung der Umgebungen ist wichtig, damit Änderungen kontrolliert und sicher ausgerollt werden.

## 2026-11-12 · Donnerstag:

**Tätigkeit**
- Live-Konfiguration mit Docker Compose und Caddy vorbereitet
- Domain- und Reverse-Proxy-Konfiguration kontrolliert

**Problem**
- HTTPS hängt unter anderem von korrekter DNS-Auflösung und erreichbaren Ports ab

**Lösung**
- DNS-Einträge und Caddy-Konfiguration überprüft

**Lessons Learned**
- Für HTTPS müssen Domain, DNS, Firewall und Reverse Proxy zusammenpassen.

## 2026-11-06 · Freitag:

**Tätigkeit**
- Benutzer- und Serverzugänge sowie Berechtigungen überprüft
- Vorbereitung des Wechsels vom Testserver auf den Live-Server

**Problem**
- SSH-Verbindung und sudo-Rechte mussten zuverlässig funktionieren

**Lösung**
- Verbindung mit dem vorgesehenen Benutzer getestet und Inventories geprüft

**Lessons Learned**
- Bei Ansible müssen Inventory, SSH-Benutzer und Rechte eindeutig sein.
- Zugangsdaten und private Schlüssel dürfen nicht ins Repository.

## 2026-11-05 · Donnerstag:

**Tätigkeit**
- Konfiguration für den späteren Live-Einsatz vorbereitet
- Trennung zwischen Testserver- und Live-Konfiguration betrachtet

**Problem**
- Test- und Live-Server benötigen unterschiedliche Inventories und Dateipfade

**Lösung**
- Eigenes Inventory und separates Playbook für den Live-Server vorgesehen

**Lessons Learned**
- Getrennte Konfigurationen verhindern, dass Änderungen für den Testserver versehentlich die Live-Umgebung betreffen.

## 2026-10-16 · Freitag:

**Tätigkeit**
- Docker- und Compose-Konfiguration überprüft
- Start und Status der Container kontrolliert

**Problem**
- Es musste sichergestellt werden, dass die Container nach erneuter Ausführung korrekt weiterlaufen

**Lösung**
- Containerstatus und Compose-Konfiguration mit Befehlen auf dem Server geprüft

**Lessons Learned**
- Ich habe den Unterschied zwischen einer erfolgreichen Playbook-Ausführung und einer tatsächlich funktionierenden Anwendung besser verstanden.

## 2026-10-15 · Donnerstag:

**Tätigkeit**
- Sicherheitsupdates und automatische Paketaktualisierung eingerichtet
- Playbook auf dem Testserver getestet
- Ansible-Konfiguration weiter getestet und überarbeitet
- Zusammenspiel der Rollen kontrolliert

**Problem**
- Die Konfiguration der erlaubten Paketquellen war nicht sofort eindeutig
- Änderungen an einer Rolle konnten Auswirkungen auf das gesamte Playbook haben

**Lösung**
- Einstellungen für automatische Updates geprüft und angepasst
- Playbook schrittweise ausgeführt und Fehlermeldungen einzeln untersucht

**Lessons Learned**
- Sicherheitsupdates müssen gezielt konfiguriert werden. Außerdem sollte ich nach Änderungen immer einen Testlauf durchführen.
- Bei der Fehlersuche ist es sinnvoll, Änderungen einzeln zu testen und die Ausgabe von Ansible genau zu lesen.

## 2026-10-09 · Freitag:

**Tätigkeit**
- Ansible-Projektstruktur weiter geordnet
- Aufgaben in Rollen aufgeteilt und Playbook-Aufbau überprüft
- Grundlegende Systemkonfiguration ergänzt
- Installation benötigter Debian-Pakete automatisiert

**Problem**
- Es war zunächst schwierig zu entscheiden, welche Aufgaben in welche Rolle gehören
- Einige Pakete und Abhängigkeiten waren mir noch nicht vertraut

**Lösung**
- Aufgaben nach Systemgrundlage, Sicherheit, Container-Laufzeit und Anwendung getrennt
- Paketliste geprüft und Aufgaben mit Ansible-Modulen umgesetzt

**Lessons Learned**
- Rollen machen ein Playbook übersichtlicher und erleichtern spätere Änderungen.
- Ich habe gelernt, dass Ansible nicht nur Docker installieren kann, sondern auch die Grundkonfiguration eines Servers übernimmt.

## 2026-10-08 · Donnerstag:

**Tätigkeit**
- Umgebung auf dem Testserver zurückgesetzt und erneut eingerichtet
- Wiederherstellung und benötigte Zeit dokumentiert
- Konfiguration im Repository abgelegt

**Problem**
- Beim ersten Durchlauf war nicht jeder Schritt sofort reproduzierbar
- Die Ablage der Dateien in GitHub war zunächst ungewohnt

**Lösung**
- Playbook erneut ausgeführt und Ergebnis kontrolliert
- Änderungen versioniert und im Repository gesichert

**Lessons Learned**
- Ein Wiederherstellungstest zeigt, ob die Automatisierung tatsächlich funktioniert.
- Git hilft dabei, Änderungen nachvollziehbar zu sichern.

## 2026-10-02 · Freitag:

**Tätigkeit**
- Ansible-Playbook für die Container-Laufzeit vorbereitet
- Docker und Docker Compose installiert
- Caddy als Reverse Proxy und Nginx als Platzhalter eingerichtet

**Problem**
- Zu Beginn war unklar, wie Caddy und Nginx miteinander kommunizieren sollen
- Die Konfiguration musste auf die Verzeichnisstruktur des Projekts abgestimmt werden

**Lösung**
- Docker Compose bündelt die Container-Konfiguration
- Caddy kann Anfragen an den Nginx-Container weiterleiten

**Lessons Learned**
- Ich habe verstanden, wie Container, Ports und Reverse Proxy zusammenspielen.
- Eine klare Verzeichnisstruktur erleichtert die Automatisierung.

## 2026-10-01 · Donnerstag:

**Tätigkeit**
- Vorbereitung und Recherche für die nächste User Story (Infrastruktur automatisiert bereitstellen; Infrastructure as a Code)
- Dokumentation

**Problem**
- Ich weiß noch nicht, wie ich die Automatisierung umsetzen soll
- Was brauche ich alles dafür?

**Lösung**
- Internetrecherche und Erfahrungen von Kollegen einbeziehen
- Ansible auf Linux-Oberfläche installiert
- SSH-Verbindung zum Testserver hergestellt
- Terminalverbindung mit Visual Studio Code verknüpft

**Lessons Learned**
- Ich werde Ansible versuchen.
- Ich musste noch so einiges auf meinem Laptop installieren und einrichten, damit ich loslegen kann.

## 2026-09-25 · Freitag: Projektstart

**Tätigkeit**
- Mailserver-Nutzwertanalyse erstellt
- Dokumentation und Begründung geschrieben

**Problem**
- Ich weiß nicht, wie ich meine Dokumentationen in GitHub hochladen soll

**Lösung**
- Austesten und im Team nachfragen

**Lessons Learned**
- Für den docker-mailserver entschieden.

## 2026-09-24 · Donnerstag: Sprintplanung

**Tätigkeit**
- Wir haben unsere ausgewählten User Stories vorgetragen und erklärt, wie wir damit starten würden bzw. was zu tun ist

**Problem**
- Wir haben anstatt die T-Shirt-Größen zu verwenden, richtige Stundenanzahlen eingeteilt
- Ich habe mir zu viele User Stories vorgenommen bis zum ersten Review

**Lösung**
- Alle User Stories mit T-Shirt-Größen angepasst
- Die User Story „Mailserver produktiv bereitstellen“ nach hinten geschoben

**Lessons Learned**
- Ich weiß nun, welche User Stories ich angehen kann.

## 2026-09-17 und 18 · Donnerstag und Freitag:

**Tätigkeit**
- User Stories und Tasks (30 Std.) für die Sprintplanung eingeteilt

**Problem**
- Wir wussten nicht, wie ernst wir die geschätzten Stundenangaben interpretieren sollen
- Wir wussten nicht, welche User Stories wir wem richtig zuteilen sollten

**Lösung**
- Der Anwendungsentwickler übernimmt logischerweise die AE-Aufgaben
- Jeder hat sich User Stories vorgenommen, wovon er kaum Ahnung hat

**Lessons Learned**
- Die Planung und Einteilung ist nicht so leicht, wie anfangs gedacht.
