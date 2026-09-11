# Maschinenverleih

Webanwendung für einen Maschinenverleih mit kundenindividueller Abrechnung,
Predictive Maintenance und Online-Shop.

Projektarbeit Bildungsgang ITO, Oberstufe. Auftakt 02./03.09.2026,
**Abgabe Freitag 11.12.2026, 8. Stunde**.

## Ausgangssituation

Der Inhaber eines Maschinenparks verleiht Maschinen und rechnet bisher alles in
Excel ab. Eine maßgeschneiderte Anwendung soll das übernehmen. Wir arbeiten als
IT-Consultingunternehmen für ihn; die Lehrkräfte sind Product Owner.

## Fachlicher Umfang

| Bereich | Inhalt |
| --- | --- |
| Verleih | Webportal: Maschinen suchen, auswählen, reservieren, buchen |
| Verwaltung | Kundendaten, Maschinenkatalog, Bestellhistorie, Lieferstatus, Garantien |
| Abrechnung | Umsatzsteuer, Rechnungsstellung, Zahlungsabwicklung, Audit-Logs — steuerrelevant nach **UStG** und **GoBD** |
| Predictive Maintenance | Aus Maschinendaten Wartungszeitpunkte ablesen und errechnen |
| Shop | Online-Shop für Verbrauchsmaterial, verknüpft mit Kunden- und Maschinenverwaltung |
| Marketing | Marketingkonzept für Verleih und Shop |
| Altdaten | Excel-Bestand über eine **selbst programmierte** Schnittstelle übernehmen; Maschinendaten werden neu erfasst |

## Geforderte Architektur

Eigene VM bei Strato (Linux), Infrastructure as Code.

- **Zugang** — Reverse Proxy (apache2, nginx oder Traefik) + Let's Encrypt, HTTPS
- **Anmeldung** — Authelia, JWT
- **API-Schicht** — API Gateway Kong vor den Supabase APIs
  (`/auth` GoTrue · `/pg` pg-meta · `/rest` PostgREST · `/storage` · `/graphql` pg_graphql · `/functions` Edge · `/realtime`), Supabase Studio
- **Datenhaltung** — PostgreSQL, S3-kompatibler Object Storage (z. B. MinIO)
- **Backend Services** — Mailserver (mailcow, docker-mailserver oder stalwart)
- **Container-Plattform** — docker, podman oder kubernetes
- **Client** — Angular, C#/C++ oder Flutter

## Verbindliche Spielregeln

- **Objektorientierter Ansatz ist Pflicht** (Hinblick Abschlussprüfung)
- **Client-Server-Architektur und Datenbank-API sind Pflicht**
- Software, die die **Datenbank implizit erzeugt, ist nicht zulässig** — das Schema wird explizit als SQL-DDL geschrieben und versioniert
- **Infrastructure as Code**: Die Umgebung muss sich zerstören und schnell wieder aufbauen lassen
- Absicherung nach **IT-Grundschutz**
- UI barrierefrei nach **ISO 9241**
- Dokumentation über **UML**
- Code nur in Git, Board in GitHub

## Vorgehen

Scrum nach Lehrbuch. Lehrkräfte = Product Owner, wir = Entwicklungsteam.
Sprints à 2–3 Wochen, Review und Retrospektive in Präsenz.

- **Board:** [Maschinenverwaltung-IHK](https://github.com/users/Finn2103/projects/32)
- Konventionen für Board, Issues und Branches: [CONTRIBUTING.md](CONTRIBUTING.md)

## Team

| Rolle | Person |
| --- | --- |
| Scrum Master, Anwendungsentwicklung | Finn2103 |
| Systemintegration | _tbd_ |
| Systemintegration | _tbd_ |
| Systemintegration | _tbd_ |

## Dokumentation

| Ordner | Inhalt |
| --- | --- |
| [docs/datenmodell](docs/datenmodell) | ERD (Chen), relationales Modell, SQL-DDL |
| [docs/uml](docs/uml) | Use-Case-, Klassen-, Sequenz-, Komponentendiagramme |
| [docs/adr](docs/adr) | Architekturentscheidungen, Nutzwertanalysen |
| [docs/scrum](docs/scrum) | Definition of Done, Backlog-Neufassung, PO-Klärung, Kickoff-Übersicht, Reviews und Retrospektiven |
