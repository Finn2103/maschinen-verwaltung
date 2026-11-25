# Lerntagebuch: Laurin Schmitz

Rolle: Systemintegrator · Gruppe 11 · Maschinenverleih

Format nach der Vorlage der Lehrkräfte: **Datum · Tätigkeit · Problem · Lösung · Lessons
Learned.** 

---

## Sprint 1

---

### 2026-09-24 · Donnerstag

---

**Tätigkeit**

- Recherche zu IT-Grundschutz

**Probleme**

- Welche Richtlinien müssen in unserem Fall umgesetzt werden?
- Habe ich alles gefunden, was ich umsetzen muss?
- Habe ich alles richtig verstanden?

**Lösung**

- Meine Notizen von Claude prüfen lassen:
    - Eine Anforderung fehlte in meinen Notizen.
    - Einige Punkte hatte ich nicht ganz verstanden und habe sie mir erklären lassen.

**Lessons Learned**

- Ich habe gelernt, was IT-Grundschutz umfasst und was in unserem Fall umzusetzen ist.

---

### 2026-09-25 · Freitag

---

**Tätigkeit**

- Die mit Claude überarbeiteten Notizen anhand des IT-Grundschutz-Kompendiums gegenprüfen.
- Recherche, wie die IT-Grundschutz-Richtlinien auf einem Debian-13-Server umzusetzen sind.
- Den ersten Benutzer auf dem Server anlegen.
- Teambesprechung

**Probleme**

- Was genau macht Befehl X / welcher Befehl macht, was ich brauche?

**Lösung**

- Mir von Claude und durch Internetrecherche erklären lassen, was Befehle bewirken und welche ich benötige

**Lessons Learned**

- Auffrischung der Linux-Kommandozeile
- Benutzer auf Linux anlegen

---

### 2026-10-01 · Donnerstag

---

**Tätigkeit**

- Restliche Benutzer anlegen
- Berechtigungen für die Benutzer passend einrichten.
- SSH gemäß dem erforderlichen Standard härten.
- Teambesprechung

**Lessons Learned**

- Berechtigungen unter Linux vergeben
- Maßnahmen zur SSH-Härtung unter Linux

---

### 2026-10-02 · Freitag

---

**Tätigkeit**

- Automatische Sicherheitsupdates einrichten
- Server-Schutzbedarfsanalyse verfassen
- Maßnahmen den IT-Grundschutz-Bausteinen zuordnen

**Lessons Learned**

- Auffrischung zum Thema Schutzbedarfsanalyse

---

### 2026-10-08 · Donnerstag

---

**Tätigkeit**

- IaC-Vorgehen abklären
- Die Funktionsweise von Ansible ansehen
- Server-Dokumentation beginnen

**Probleme**

- Ich habe nicht mitgeschrieben, was ich auf dem Server gemacht habe.

**Lösung**

- Die durchgeführten Schritte rekonstruieren und dokumentieren.

**Lessons Learned**

- Künftig die durchgeführten Schritte direkt mitschreiben.

---

### 2026-10-09 · Freitag

---

**Tätigkeit**

- Die Entscheidung für Debian gegenüber Ubuntu nachvollziehen und festhalten.
- Authentifizierungsverfahren provisorisch festlegen, damit andere Issues weiterbearbeitet werden können (noch nicht schriftlich festgehalten).
- Versuch, Dateien auf GitHub hochzuladen

**Probleme**

- GitHub war in der kurzen Zeit nicht zu bewältigen; die Zeit reichte nicht mehr.

**Lösung**

- Am nächsten Termin mehr Zeit für GitHub einplanen.

---

## Sprint 2

---

### 2026-10-30 · Freitag

---

**Tätigkeit**

- IaC in Ansible umsetzen
- Alles nochmal mit Claude und anhand der Dokumentation nachprüfen.

**Probleme**

- Welcher Aufbau wird für Ansible benötigt?
- Die angepassten Config-Dateien liegen nur auf dem Server vor.
- Ansible arbeitet zum Umsetzen der Einstellungen mit YAML, ich habe aber noch nie etwas mit YAML gemacht.

**Lösung**

- Aufbau von Claude modellieren lassen und von dort aus weiterarbeiten
- Configs vom Server heraussuchen und kopieren
- YAML:
    - Erst selbst versucht zu schreiben
    - Grundgerüst mit den richtigen Funktionen von Claude erstellen lassen
    - Daten eingefügt, wo nötig erweitert und die Syntax geprüft
    - Alles abschließend von Claude Korrektur lesen lassen

**Lessons Learned**

- Aufbau eines Ansible-Projekts
- Grundlegende YAML-Syntax

---

### 2026-11-06 · Freitag

---

**Tätigkeit**

- Benutzerkonten für die Lehrkräfte einrichten.

---

### 2026-11-12 · Donnerstag

---

**Tätigkeit**

- Versucht, GitHub zum Laufen zu bringen
- Da GitHub nicht funktioniert hat, versucht, ob es mit Git geht

**Probleme**

- Bei Aktionen auf GitHub passiert entweder nichts, oder es wird Erfolg gemeldet, aber in Wirklichkeit passiert nichts. Nach einiger Zeit Troubleshooting aufgegeben.
- Git eingerichtet und versucht, es mit dem GitHub-Repo zu verknüpfen. Da URL auch nicht funktionierte, versucht, das Problem mit einer SSH-Verbindung zu umgehen. Auch das aufgegeben.

**Ursache (Vermutung)**

- Beim Verbinden mit dem GitHub-Repo gibt Git wenigstens eine Fehlermeldung aus. Das Problem liegt also netzwerkseitig:
  ```
  error: RPC failed; curl 56 Recv failure: Connection was reset
  send-pack: unexpected disconnect while reading sideband packet
  fatal: the remote end hung up unexpectedly
  ```

**Lessons Learned**

- Git einrichten, speziell auf einem Netzlaufwerk

---

### 2026-11-13 · Freitag

---

**Tätigkeit**

- Git und GitHub auf meinem privaten Rechner eingerichtet und mit den grundlegenden Funktionen und Commands vertraut gemacht

**Lessons Learned**

- Funktionsweise von Git und GitHub
- Git-Basics

---

### 2026-11-16 · Montag

---

**Tätigkeit**

- Info: GitHub wurde für mich netzwerkseitig freigeschaltet
- Git und GitHub auf meinem Rechner eingerichtet

---

### 2026-11-17 · Dienstag

---

**Tätigkeit**

- Das Repo analysieren: Welche Konventionen gelten und wo gehören meine vorhandenen Dateien hin?

**Probleme**

- Die bereits vorhandenen Dateien folgen nicht den Konventionen.

**Lösung**

- Dateien an die Konventionen anpassen und anschließend ins Repo pushen.

---

### 2026-11-23 · Montag

---

**Tätigkeit**

- Dateien überarbeiten und an die Konventionen des Repos anpassen (Struktur, Benennung, Ablageort).

---

### 2026-11-24 · Dienstag

---

**Tätigkeit**

- Dateien überarbeiten und an die Konventionen des Repos anpassen (Struktur, Benennung, Ablageort).

---

### 2026-11-25 · Mittwoch

---

**Tätigkeit**

- Lerntagebuch von .docx in .md überführen, ergänzen und überarbeiten.

---

### 20##-##-## · ##########

---

**Tätigkeit**

- 

**Probleme**

- 

**Ursache (Vermutung)**

- 

**Lösung**

- 

**Lessons Learned**

- 

---