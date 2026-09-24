# Maschinenverleih

Webanwendung für einen Maschinenverleih mit kundenindividueller Abrechnung,
Predictive Maintenance und Online-Shop.

Projektarbeit Bildungsgang ITO, Oberstufe. Auftakt 02./03.09.2026,
**Abgabe Freitag 11.12.2026, 8. Stunde**.

# Gruppe 11
 
5 Personen, eine Anwendungsentwicklung, vier Systemintegration.

| Rolle | Person | GitHub |
| --- | --- | --- |
| Scrum Master, Anwendungsentwicklung | Finn Jendras | [@Finn2103](https://github.com/Finn2103) |
| Systemintegration | Alexa Börsch | [@WinOnWave](https://github.com/WinOnWave) |
| Systemintegration | Nico Laeser | [@nicolaeser](https://github.com/nicolaeser) |
| Systemintegration | Laurin Schmitz | [@24it5schmitz](https://github.com/24it5schmitz) |
| Systemintegration | Justin Kelm | [@Justin24it5](https://github.com/Justin24it5) |

Die Anwendungsentwicklung ist einfach besetzt. Ein Teil dieser Arbeit wird an die
Systemintegration abgegeben,  die Aufteilung macht das Team im ersten Sprint Planning
am **Donnerstag, 17.09.2026, 



# Dokumentation

| Datei / Ordner | Inhalt |
| --- | --- |
| **[docs/TECHSTACK.md](docs/TECHSTACK.md)** | **Der entschiedene Technologie-Stack auf einen Blick** — und was noch offen ist |
| [docs/vorgaben](docs/vorgaben) | Aufgabenstellung, Projektregeln, Lerntagebuch-Vorlage — die Originale der Lehrkräfte |
| [docs/lerntagebuch](docs/lerntagebuch) | Logbuch je Person: Tätigkeit, Problem, Lösung, Lessons Learned |
| [docs/datenmodell](docs/datenmodell) | ERD (Chen), relationales Modell, SQL-DDL |
| [docs/uml](docs/uml) | Use-Case-, Klassen-, Sequenz-, Komponentendiagramme |
| [docs/adr](docs/adr) | Architekturentscheidungen, Nutzwertanalysen |
| [docs/scrum](docs/scrum) | Definition of Done, Entscheidungslog, Backlog-Neufassung, Reviews und Retrospektiven |
| [docs/ki](docs/ki) | **KI-Nutzung** — Ablage und Nachweis. Prompt Engineering wird laut Projektregeln bewertet |


## Vorgehen

Scrum nach Lehrbuch. Lehrkräfte = Product Owner, wir = Entwicklungsteam.
Sprints à 2–3 Wochen, Review und Retrospektive in Präsenz.

- **Board:** [Maschinenverwaltung-IHK](https://github.com/users/Finn2103/projects/32)
- Konventionen für Board, Issues und Branches: [CONTRIBUTING.md](CONTRIBUTING.md)


 



# Ausgangssituation

Der Inhaber eines Maschinenparks verleiht Maschinen und rechnet bisher alles in
Excel ab. Eine maßgeschneiderte Anwendung soll das übernehmen. Wir arbeiten als
IT-Consultingunternehmen für ihn; die Lehrkräfte sind Product Owner.

## Fachlicher Umfang

| Bereich | Inhalt |
| --- | --- |
| Verleih | Webportal: Maschinen suchen, auswählen, reservieren, buchen |
| Verwaltung | Kundendaten, Maschinenkatalog, Bestellhistorie, Lieferstatus, Garantien |
| Abrechnung | Umsatzsteuer, Rechnungsstellung, Zahlungsabwicklung, Audit-Logs,  steuerrelevant nach **UStG** und **GoBD** |
| Predictive Maintenance | Aus Maschinendaten Wartungszeitpunkte ablesen und e,r chnen |
| Shop | Online-Shop für Verbrauchsmaterial, verknüpft mit Kunden- und Maschinenverwaltung |
| Marketing | Marketingkonzept für Verleih und Shop |
| Altdaten | Excel-Bestand über eine **selbst programmierte** Schnittstelle übernehmen; Maschinendaten werden neu erfasst |

# Architektur

Eigene VM bei Strato (Linux), Infrastructure as Code.

- **Zugang** — Reverse Proxy (apache2, nginx oder Traefik) + Let's Encrypt, HTTPS

- **API-Schicht** — API Gateway Kong vor den Supabase APIs
  (`/auth` GoTrue · `/pg` pg-meta · `/rest` PostgREST · `/storage` · `/graphql` pg_graphql · `/functions` Edge · `/realtime`), Supabase Studio
- **Datenhaltung** — PostgreSQL, S3-kompatibler Object Storage (z. B. MinIO)
- **Backend Services** — Mailserver (mailcow, docker-mailserver oder stalwart)
- **Container-Plattform** — docker, podman oder kubernetes
- **Client** — Angular, C#/C++ oder Flutter

# Verbindliche Spielregeln

- **Objektorientierter Ansatz ist Pflicht** (Hinblick Abschlussprüfung)
- **Client-Server-Architektur und Datenbank-API sind Pflicht**
- Software, die die **Datenbank implizit erzeugt, ist nicht zulässig**,  das Schema wird explizit als SQL-DDL geschrieben und versioniert
- **Infrastructure as Code**: Die Umgebung muss sich zerstören und schnell wieder aufbauen lassen
- Absicherung nach **IT-Grundschutz**
- UI barrierefrei nach **ISO 9241**
- Dokumentation über **UML**
- Code nur in Git, Board in GitHub


