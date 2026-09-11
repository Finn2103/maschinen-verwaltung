# Definition of Done

> **Entwurf.** Im Sprint-1-Planning gemeinsam beschließen, danach gilt sie
> unverändert für alle Items — Änderungen nur in der Retrospektive.

Ein Item ist fertig, wenn:

1. **Alle Akzeptanzkriterien** des Issues erfüllt und im Issue abgehakt sind.
2. Der Code auf einem Branch nach Namenskonvention liegt und über einen **PR**
   gemerged wurde — mit **Review durch mindestens eine weitere Person**.
3. Es **läuft auf unserer Strato-Umgebung**, nicht nur lokal.
4. **Schemaänderungen** liegen als explizites, versioniertes SQL-DDL vor.
5. **Infrastruktur** liegt als Code im Repo — die Umgebung ließe sich damit neu aufbauen.
6. **Keine Secrets** im Repo.
7. **Dokumentation** ist nachgezogen, wo sie betroffen ist (UML, ADR, README).
8. Bei UI: **Lade-, Leer- und Fehlerzustand** vorhanden, Bedienung per Tastatur
   möglich, Kontraste ausreichend (ISO 9241).
9. Das Board-Item steht auf **Done** und ist dem richtigen Sprint-Milestone zugeordnet.

## Was nicht als "fertig" gilt

- "Läuft bei mir lokal"
- "Nur noch das Testen fehlt"
- Änderungen direkt auf dem Server, ohne Entsprechung im Repo
