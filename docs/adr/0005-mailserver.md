# Begründung der Gewichtungen

## Wartungsaufwand 25%
Mailserver soll zuverlässig betrieben werden können, ohne hohen administrativen Aufwand

## Ressourcenbedarf 15%
Mailserver läuft auf einem Server und teilt sich Ressourcen mit anderen Diensten.  
Daher ist geringer CPU-, RAM- und Speicherbedarf sinnvoll.

## Funktionsumfang 25%
Für Buchungsbestätigungen und Rechnungsversand müssen wichtige Mailfunktionen vorhanden sein.  
Dazu gehören beispielsweise DKIM, SPF, Webmail und Schnittstellen bzw. Integrationsmöglichkeiten.

## Docker-Kompatibilität 20%
Vorhandene Architektur basiert auf Containern.  
Deswegen muss Mailserver gut mit Dockern funktionieren und leicht in bestehende Umgebung integrieren lassen.

## Reverse-Proxy-Integration 10%
Mailserver soll sich gut in Reverse-Proxy-Struktur integrieren lassen.

## Dokumentation & Teamfreundlichkeit 5%
Verständliche Dokumentation erleichtert Einrichtung und Wartung.  
Entscheidungen werden womöglich im Team getroffen, wobei eine gute Verständlichkeit hilfreich ist.   

# Begründung der einzelnen Bewertungen

## 1. Wartungsaufwand - 25%

### Mailcow: 8/10
Mailcow bietet eine umfangreiche Verwaltungsoberfläche und erleichtert dadurch viele Wartungsaufgaben.  
Durch den hohen Funktionsumfang kann es aber komplexer werden und somit einen höheren administrativen Aufwand bedeuten.

### docker-mailserver: 9/10
docker-mailserver ist auf einen containerisierten Betrieb ausgelegt und lässt sich dadurch gut in eine bestehende Docker-Umgebung integrieren.  
Die überschaubare Struktur erleichtert Wartung und Aktualisierung.

### Stalwart: 7/10
Stalwart bietet eine moderne Mailserver-Lösung mit vielen Funktionen.  
Da die Lösung für das Team möglicherweise weniger bekannt ist, kann die Einarbeitung zunächst mehr Zeit benötigen.

## 2. Ressourcenbedarf - 15%

### Mailcow: 6/10
Mailcow benötigt aufgrund seiner umfangreichen Komponenten vergleichsweise viele Systemressourcen.

### docker-mailserver: 9/10
Durch die Konzentration auf die notwendigen Mailserver-Funktionen ist der Ressourcenbedarf vergleichsweise gering.  
Dadurch eignet sich die Lösung gut für einen Server, auf dem zusätzlich weitere Container betrieben werden.

### Stalwart: 8/10
Stalwart benötigt vergleichsweise wenig Ressourcen und kann deshalb auch auf einem Server eingesetzt werden, auf dem zusätzlich weitere Dienste betrieben werden.

## 3. Funktionsumfang - 25%

### Mailcow: 10/10
Mailcow bietet einen umfangreichen Funktionsumfang und unterstützt unter anderem wichtige Sicherheits- und Authentifizierungsmechanismen wie DKIM und SPF sowie Webmail und weitere Verwaltungsfunktionen.

### docker-mailserver: 8/10
docker-mailserver bietet die für den Mailbetrieb wichtigen Funktionen und Sicherheitsmechanismen.  
Im Vergleich zu Mailcow stehen jedoch weniger zusätzliche Verwaltungs- und Komfortfunktionen zur Verfügung.

### Stalwart: 9/10
Bietet einen modernen und umfangreichen Funktionsumfang.

## 4. Docker-Kompatibilität - 20%

### Mailcow: 10/10
Mailcow basiert auf Docker und passt deshalb sehr gut zu einer bestehenden Container-Architektur.   
Die Integration in eine Docker-basierte Serverumgebung ist dadurch grundsätzlich sehr gut möglich.

### docker-mailserver: 10/10
docker-mailserver ist speziell auf den Betrieb als Docker-Container ausgelegt.  
Dadurch passt die Lösung sehr gut zur bestehenden Container-Infrastruktur und kann entsprechend einfach in diese integriert werden.

### Stalwart: 8/10
Stalwart kann in einer Docker-Umgebung eingesetzt werden und ist grundsätzlich mit einer Container-Architektur kompatibel.   
Im Vergleich zu den beiden stärker auf Docker ausgerichteten Lösungen wird die Integration etwas niedriger bewertet.

## 5. Reverse-Proxy-Integration - 10%

### Mailcow: 9/10
Mailcow lässt sich in eine bestehende Reverse-Proxy-Umgebung integrieren.   
Aufgrund der verschiedenen Webdienste und benötigten Weiterleitungen kann die Konfiguration jedoch etwas komplexer sein.

### docker-mailserver: 9/10
docker-mailserver kann gut mit einem vorhandenen Reverse Proxy kombiniert werden.   
Die notwendigen Weiterleitungen und Konfigurationen müssen allerdings korrekt eingerichtet werden, damit die verschiedenen Maildienste funktionieren.

### Stalwart: 8/10
Stalwart kann ebenfalls hinter einem Reverse Proxy betrieben werden.   
Die Integration ist grundsätzlich möglich, wird in dieser Bewertung jedoch etwas niedriger angesetzt, da die Konfiguration je nach bestehender Infrastruktur zusätzlichen Anpassungsaufwand verursachen kann.

## 6. Dokumentation & Teamfreundlichkeit - 5%

### Mailcow: 9/10
Mailcow verfügt über eine umfangreiche Dokumentation und eine übersichtliche Verwaltungsoberfläche.   
Dadurch können sich mehrere Teammitglieder vergleichsweise schnell in die Lösung einarbeiten.

### docker-mailserver: 8/10
docker-mailserver verfügt über eine gute Dokumentation und eine klare, containerorientierte Struktur.   
Für Personen mit Docker-Erfahrung ist die Verwaltung verständlich, allerdings ist etwas technisches Verständnis für die Konfiguration erforderlich.

### Stalwart: 7/10
Stalwart verfügt ebenfalls über Dokumentation und eine moderne Verwaltung.   
Da die Lösung im Vergleich zu Mailcow möglicherweise weniger bekannt ist, kann die Einarbeitung für das Team etwas mehr Zeit benötigen.

## Fazit
Auf Grundlage der festgelegten Gewichtungen und Bewertungen erreicht docker-mailserver den höchsten Nutzwert. Besonders positiv fallen der geringe Ressourcenbedarf, die Docker-Kompatibilität und der vergleichsweise geringe Wartungsaufwand auf.



