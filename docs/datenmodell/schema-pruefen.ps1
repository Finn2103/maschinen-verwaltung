<#
.SYNOPSIS
    Spielt schema.sql auf eine leere PostgreSQL-Datenbank und prüft die
    Zusicherungen mit schema-pruefen.sql (#45).

.DESCRIPTION
    Startet einen Wegwerf-Container ohne veröffentlichte Ports, legt darin
    eine leere Datenbank an, spielt schema.sql ein und lässt danach
    schema-pruefen.sql laufen. Zum Schluss wird der Container entfernt.

    Lädt nichts aus dem Netz (--pull=never): das Image muss lokal vorhanden
    sein. Nimmt Podman, sonst Docker.

    Eingespielt wird als Rolle "postgres". Im Supabase-Image ist sie wie im
    Betrieb kein Superuser, das Schema muss also ohne Sonderrechte laufen.

.PARAMETER Image
    PostgreSQL-Image. Standard ist das Supabase-Image aus ADR 0006. Jedes
    andere PostgreSQL-Image ab Version 14 geht auch, z. B. postgres:17.

.EXAMPLE
    & '.\docs\datenmodell\schema-pruefen.ps1'
#>
param(
    [string]$Image = 'public.ecr.aws/supabase/postgres:17.6.1.134'
)

$ErrorActionPreference = 'Stop'
$hier = $PSScriptRoot

$engine = if (Get-Command podman -ErrorAction SilentlyContinue) { 'podman' }
          elseif (Get-Command docker -ErrorAction SilentlyContinue) { 'docker' }
          else { throw 'Weder Podman noch Docker gefunden.' }

& $engine image inspect $Image *> $null
if ($LASTEXITCODE -ne 0) {
    throw "Image $Image ist lokal nicht vorhanden. Mit -Image ein vorhandenes PostgreSQL-Image angeben."
}

$name = "mv-schema-pruefen-$(Get-Random)"
& $engine run -d --rm --pull=never --name $name -e "POSTGRES_PASSWORD=$([guid]::NewGuid())" $Image | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Container ließ sich nicht starten.' }

function Psql([string]$datenbank, [string]$datei) {
    # Die Datei wird in den Container kopiert und dort per Umleitung
    # gelesen. So kommen Umlaute unverändert an, egal welche Kodierung die
    # PowerShell beim Weiterleiten benutzen würde.
    & $engine cp (Join-Path $hier $datei) "${name}:/tmp/$datei" | Out-Null
    & $engine exec $name sh -c "psql -U postgres -d $datenbank -v ON_ERROR_STOP=1 < /tmp/$datei"
    if ($LASTEXITCODE -ne 0) { throw "$datei ist mit Fehler abgebrochen (Exit-Code $LASTEXITCODE)." }
}

try {
    # Bereit ist der Server erst, wenn er über TCP antwortet. Während der
    # Ersteinrichtung läuft er nur über den Unix-Socket.
    $bereit = $false
    for ($i = 0; $i -lt 60 -and -not $bereit; $i++) {
        Start-Sleep -Seconds 2
        & $engine exec $name pg_isready -h 127.0.0.1 -U postgres -q
        $bereit = ($LASTEXITCODE -eq 0)
    }
    if (-not $bereit) { throw 'PostgreSQL war nach 120 Sekunden nicht bereit.' }

    & $engine exec $name psql -U postgres -q -c "CREATE DATABASE mv_leer TEMPLATE template0 ENCODING 'UTF8'"
    if ($LASTEXITCODE -ne 0) { throw 'Leere Datenbank ließ sich nicht anlegen.' }
    & $engine exec $name psql -U postgres -d mv_leer -tA -c "SELECT 'Leere Datenbank: ' || version() || ', Tabellen in public: ' || count(*) FROM information_schema.tables WHERE table_schema = 'public'"

    Write-Host "`n=== schema.sql einspielen" -ForegroundColor Cyan
    Psql 'mv_leer' 'schema.sql'

    Write-Host "`n=== schema-pruefen.sql" -ForegroundColor Cyan
    Psql 'mv_leer' 'schema-pruefen.sql'

    Write-Host "`nSchema fehlerfrei eingespielt, alle Prüfungen bestanden." -ForegroundColor Green
}
finally {
    & $engine stop $name *> $null
}
