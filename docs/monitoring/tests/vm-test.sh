#!/usr/bin/env bash
# shellcheck disable=SC1111
# Nur für den Testlauf (#14), nicht Teil der Abgabe. Aufruf als root: vm-test.sh PFAD/ZU/monitor [ERGEBNISORDNER]
set -uo pipefail

MONITOR_SRC=$(readlink -f "${1:?Pfad zu monitor fehlt}")
ERG=${2:-/root/monitor-test/tests}
WORK=/root/monitor-test
HOOKS=$WORK/webhooks
INDEX=$HOOKS/index.tsv
HOOK=http://127.0.0.1:9000
T0=$(date '+%Y-%m-%d %H:%M:%S')
PROMPT="root@$(hostname):~#"

(( EUID == 0 )) || { echo "bitte als root"; exit 1; }
rm -rf "$ERG" "$HOOKS" "$WORK/.uebersicht.tsv"; mkdir -p "$ERG" "$HOOKS" "$WORK"

PASS=0 FAIL=0
CUR="" CUR_ID="" SEC_T0="" SECTION_MARK=0 SEC_PASS=0 SEC_FAIL=0 RUN_COUNT=0
CHECKS_BUF="" NOTES_BUF=""

section() {
  finish_section
  CUR_ID=$1 CUR=$ERG/$1.md
  SEC_T0=$(date '+%Y-%m-%d %H:%M:%S')
  SECTION_MARK=$(last_seq)
  SEC_PASS=0 SEC_FAIL=0 RUN_COUNT=0 CHECKS_BUF="" NOTES_BUF=""
  {
    printf '# %s\n\n' "$2"
    printf '> Getestet am %s auf einer VMPal-VM (Debian 13) auf meinem MacBook.\n\n' "$(date '+%d.%m.%Y um %H:%M:%S')"
    printf '**Anforderung:** %s\n\n' "$3"
    printf '**Ablauf:** %s\n\n' "$4"
  } >"$CUR"
  printf '\n=== %s: %s\n' "$1" "$2"
}

md() { printf '%s\n\n' "$*" >>"$CUR"; }

show() {
  local cmd=$1 out=$2 rc=$3
  if (( RUN_COUNT == 0 )); then printf '## Befehle und Ausgaben\n\n' >>"$CUR"; fi
  RUN_COUNT=$((RUN_COUNT + 1))
  {
    printf '```console\n%s %s\n' "$PROMPT" "$cmd"
    [[ -n $out ]] && printf '%s\n' "$out"
    printf '```\n'
    if (( rc != 0 )); then
      case $cmd in
        "monitor status"*|"monitor check"*|*" monitor check") printf '_Exit-Code %s (monitor status und check: 1 WARNING, 2 ERROR, 3 CRITICAL, 4 kein Zustand oder Fehler)_\n' "$rc" ;;
        *) printf '_Exit-Code %s_\n' "$rc" ;;
      esac
    fi
    printf '\n'
  } >>"$CUR"
}

quote_args() {
  local a out=""
  for a in "$@"; do
    if [[ $a =~ ^[A-Za-z0-9_@%+=:,./-]+$ ]]; then out+="$a "; else out+="'${a//\'/\'\\\'\'}' "; fi
  done
  printf '%s' "${out% }"
}

run() { local out rc; out=$("$@" 2>&1); rc=$?; show "$(quote_args "$@")" "$out" "$rc"; }
sh_run() { local out rc; out=$(bash -c "$1" 2>&1); rc=$?; show "$1" "$out" "$rc"; }
note() { NOTES_BUF+="- $*"$'\n'; echo "  $*"; }

check() {
  local desc=$1; shift
  if "$@" >/dev/null 2>&1; then
    PASS=$((PASS + 1)) SEC_PASS=$((SEC_PASS + 1))
    CHECKS_BUF+="- bestanden: $desc"$'\n'; printf 'BESTANDEN  %s\n' "$desc"
  else
    FAIL=$((FAIL + 1)) SEC_FAIL=$((SEC_FAIL + 1))
    CHECKS_BUF+="- **FEHLER: $desc**"$'\n'; printf 'FEHLER     %s\n' "$desc"
  fi
}

cap() {
  local n=$1 t l
  t=$(cat); l=$(wc -l <<<"$t")
  if (( l > n )); then head -n "$n" <<<"$t"; printf '… %d Zeilen gekürzt …\n' $((l - n)); else printf '%s\n' "$t"; fi
}

journal_excerpt() {
  local log n
  log=$(journalctl -u monitor --since "$SEC_T0" -o short-iso --no-pager 2>&1)
  n=$(wc -l <<<"$log")
  printf '%s journalctl -u monitor --since "%s" -o short-iso\n' "$PROMPT" "$SEC_T0"
  if (( n > 120 )); then
    head -n 60 <<<"$log"; printf '… %d Zeilen ausgelassen …\n' $((n - 120)); tail -n 60 <<<"$log"
  else
    printf '%s\n' "$log"
  fi
}

hooks_section() {
  local f
  printf '## Angekommene Meldungen\n\n'
  if ! awk -F'\t' -v m="$SECTION_MARK" '($1 + 0) > m { found = 1 } END { exit !found }' "$INDEX"; then
    printf 'In diesem Schritt kam keine Meldung.\n\n'; return
  fi
  printf '| Nr. | Zeit | Webhook | Art | Stufe | Inhalt | Discord-Grenzen |\n| --- | --- | --- | --- | --- | --- | --- |\n'
  awk -F'\t' -v m="$SECTION_MARK" '($1 + 0) > m { gsub(/\|/, "·", $6); printf "| %s | %s | %s | %s | %s | %s | %s |\n", $1, $2, $3, $4, $5, $6, $7 }' "$INDEX"
  printf '\n'
  f=$(hooks_since "$SECTION_MARK" json '.type == "change"' | head -n1)
  if [[ -n $f ]]; then
    printf '### JSON-Meldung Nr. %s im Original\n\n```json\n' "$(basename "$f" | cut -d- -f1)"; cap 90 <"$f"; printf '```\n\n'
  fi
  f=$(hooks_since "$SECTION_MARK" discord '.' | head -n1)
  if [[ -n $f ]]; then
    printf '### Discord-Meldung Nr. %s im Original\n\n```json\n' "$(basename "$f" | cut -d- -f1)"; cap 90 <"$f"; printf '```\n\n'
  fi
}

finish_section() {
  [[ -n $CUR ]] || return 0
  {
    (( RUN_COUNT )) || printf '_Keine Befehle: geprüft wurde der Zustand des laufenden Dienstes._\n\n'
    printf '## Prüfungen\n\n%s\n' "$CHECKS_BUF"
    [[ -n $NOTES_BUF ]] && printf '## Beobachtungen\n\n%s\n' "$NOTES_BUF"
    printf '## Server-Log\n\n```console\n'
    journal_excerpt
    printf '```\n\n'
    hooks_section
  } >>"$CUR"
  printf '%s\t%s\t%s\t%s\n' "$CUR_ID" "$SEC_PASS" "$SEC_FAIL" "$(head -n1 "$CUR" | sed 's/^# //')" >>"$WORK/.uebersicht.tsv"
  CUR=""
}

last_seq() { tail -n 1 "$INDEX" 2>/dev/null | cut -f1 | sed 's/^0*//;s/^$/0/'; }

hooks_since() {
  local n=$1 path=$2 filter=$3 f num
  for f in "$HOOKS"/*-"$path".json; do
    [[ -e $f ]] || continue
    num=$(basename "$f"); num=$((10#${num%%-*}))
    (( num > n )) || continue
    jq -e "$filter" "$f" >/dev/null 2>&1 && echo "$f"
  done
}

has_hook() { [[ -n $(hooks_since "$1" "$2" "$3") ]]; }

wait_until() {
  local max=$1 t0 t; shift
  t0=$(date +%s)
  while :; do
    t=$(( $(date +%s) - t0 ))
    if "$@" >/dev/null 2>&1; then echo "$t"; return 0; fi
    (( t >= max )) && { echo "$max"; return 1; }
    sleep 1
  done
}

level_of()  { jq -r --arg id "$1" '.checks[] | select(.id == $id) | .level' /run/monitor/status.json; }
status_of() { jq -r --arg id "$1" '.checks[] | select(.id == $id) | .status' /run/monitor/status.json; }
is_level()  { [[ $(level_of "$1") == "$2" ]]; }
is_status() { [[ $(status_of "$1") =~ ^($2)$ ]]; }

event_json() {
  printf '.type == "change" and any(.events[]; .id == "%s" and .level == "%s")' "$1" "$2"
}
event_discord() {
  printf 'any(.embeds[]; .title | contains("%s")) and any(.embeds[]; .title | contains("%s"))' "$1" "$2"
}
not_suppressed() {
  ! journalctl -u monitor --since "$SEC_T0" -o cat | grep -q "$1: Wechsel zu INFO unterdrückt"
}

cat >"$WORK/empfaenger.py" <<'PY'
import json, sys, threading, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
OUT = Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
INDEX = OUT / "index.tsv"; INDEX.touch()
lock = threading.Lock(); state = {"seq": 0, "up": True, "seen": set()}

def discord_check(doc):
    embeds = doc.get("embeds", []); chars = 0
    for e in embeds:
        chars += len(e.get("title", "")) + len(e.get("description", "")) + len(e.get("footer", {}).get("text", ""))
        for f in e.get("fields", []):
            chars += len(f.get("name", "")) + len(f.get("value", ""))
            if not f.get("value"): return "FEHLER: leeres Feld"
    if len(embeds) > 10: return "FEHLER: mehr als 10 Embeds"
    if chars > 6000: return f"FEHLER: {chars} Zeichen"
    return f"ok ({len(embeds)} Embeds, {chars} Zeichen)"

def summarize(path, doc):
    if path == "discord":
        kind = "report" if any(f.get("name") == "Load" for e in doc.get("embeds", []) for f in e.get("fields", [])) else "change"
        return kind, "-", " | ".join(e.get("title", "") for e in doc.get("embeds", [])), discord_check(doc)
    kind = doc.get("type", "?")
    ids = (" | ".join(f"{e['id']} {e.get('previous_level')}->{e['level']}" for e in doc.get("events", []))
           if kind == "change" else f"Probleme: {len(doc.get('problems', []))}")
    return kind, doc.get("level", "?"), ids, "-"

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def reply(self, code, body=b""):
        try:
            self.send_response(code); self.send_header("Content-Length", str(len(body))); self.end_headers()
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass
    def do_GET(self):
        if self.path == "/health": self.reply(200, b"ok")
        elif self.path == "/slow": time.sleep(4); self.reply(200, b"langsam, aber ok")
        elif self.path == "/dienst":
            self.reply(200, b"ok") if state["up"] else self.reply(503, b'{"error":"Wartung, Dienst nicht verfuegbar"}')
        else: self.reply(404)
    def do_POST(self):
        body = self.rfile.read(int(self.headers.get("Content-Length", 0))); p = self.path.strip("/")
        if p == "api": return self.reply(201, b'{"created":true}')
        if p == "admin/dienst-down": state["up"] = False; return self.reply(200)
        if p == "admin/dienst-up": state["up"] = True; return self.reply(200)
        if p not in ("discord", "json", "flaky"): return self.reply(404)
        if p == "flaky":
            with lock:
                first = hash(body) not in state["seen"]; state["seen"].add(hash(body))
            if first: return self.reply(503, b"bitte spaeter")
        try: doc = json.loads(body)
        except ValueError: return self.reply(400, b"kein JSON")
        with lock:
            state["seq"] += 1; seq = state["seq"]
            (OUT / f"{seq:04d}-{p}.json").write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            kind, level, ids, chk = summarize(p, doc)
            with INDEX.open("a", encoding="utf-8") as f:
                f.write(f"{seq:04d}\t{time.strftime('%H:%M:%S')}\t{p}\t{kind}\t{level}\t{ids}\t{chk}\n")
        self.reply(204)

ThreadingHTTPServer(("127.0.0.1", 9000), H).serve_forever()
PY

echo "Testumgebung aufbauen"
if [[ ! -e /etc/systemd/network/10-docker-unmanaged.network ]]; then
  printf '[Match]\nName=veth* docker0 br-*\n\n[Link]\nUnmanaged=yes\n' >/etc/systemd/network/10-docker-unmanaged.network
  networkctl reload
  systemctl restart docker
fi
systemctl start docker.socket docker
swapon -a
pkill -f 'empfaenger.py' 2>/dev/null; sleep 0.5
python3 "$WORK/empfaenger.py" "$HOOKS" &
EMPFAENGER=$!
trap 'kill $EMPFAENGER 2>/dev/null; swapon -a 2>/dev/null' EXIT
sleep 1

systemctl disable --now monitor.service >/dev/null 2>&1
rm -rf /opt/monitor /usr/local/sbin/monitor-setup /usr/local/bin/monitor /etc/monitor \
  /etc/systemd/system/monitor.service /run/monitor
systemctl daemon-reload

umount /srv/daten 2>/dev/null; rm -f "$WORK/testplatte.img"
truncate -s 1G "$WORK/testplatte.img"
mkfs.ext4 -q -F "$WORK/testplatte.img"
mkdir -p /srv/daten && mount -o loop "$WORK/testplatte.img" /srv/daten
mkdir -p /srv/daten/uploads /srv/daten/backups

cat >/etc/systemd/system/demo-dienst.service <<'EOF'
[Unit]
Description=Test-Dienst für den Monitoring-Test
[Service]
ExecStart=/bin/sleep infinity
EOF
systemctl daemon-reload; systemctl restart demo-dienst

docker rm -f db mailserver web-unhealthy web-starting job-ok job-fehler pausiert angelegt \
  crashloop oom flapper >/dev/null 2>&1
docker volume rm monitor-test-db >/dev/null 2>&1
L=(--label projekt=monitor-test)
TESTPW=$(openssl rand -hex 16)

docker run -d --name db "${L[@]}" --restart unless-stopped -e POSTGRES_PASSWORD="$TESTPW" \
  -p 127.0.0.1:5432:5432 -v monitor-test-db:/var/lib/postgresql/data \
  --health-cmd 'pg_isready -U postgres' --health-interval 3s --health-retries 3 \
  postgres:17-alpine >/dev/null

mkdir -p "$WORK/dms/config"
printf 'test@example.test|{SHA512-CRYPT}%s\n' "$(openssl passwd -6 "$TESTPW")" >"$WORK/dms/config/postfix-accounts.cf"
docker run -d --name mailserver "${L[@]}" --restart unless-stopped --hostname mail.example.test \
  -p 127.0.0.1:25:25 -p 127.0.0.1:143:143 -p 127.0.0.1:587:587 \
  -e ENABLE_AMAVIS=0 -e ENABLE_CLAMAV=0 -e ENABLE_SPAMASSASSIN=0 -e ENABLE_FAIL2BAN=0 \
  -e ENABLE_POSTGREY=0 -e ENABLE_OPENDKIM=0 -e ENABLE_OPENDMARC=0 -e ENABLE_POLICYD_SPF=0 \
  -e PERMIT_DOCKER=none -e LOG_LEVEL=warn \
  -v "$WORK/dms/config:/tmp/docker-mailserver" \
  mailserver/docker-mailserver:latest >/dev/null

docker run -d --name web-unhealthy "${L[@]}" --restart unless-stopped \
  --health-cmd 'exit 1' --health-interval 2s --health-retries 1 alpine:3.22 sleep infinity >/dev/null
docker run -d --name web-starting "${L[@]}" \
  --health-cmd 'true' --health-interval 1h --health-start-period 1h alpine:3.22 sleep infinity >/dev/null
docker run -d --name job-ok "${L[@]}" alpine:3.22 true >/dev/null
docker run -d --name job-fehler "${L[@]}" alpine:3.22 sh -c 'exit 3' >/dev/null
docker run -d --name pausiert "${L[@]}" alpine:3.22 sleep infinity >/dev/null && docker pause pausiert >/dev/null
docker create --name angelegt "${L[@]}" alpine:3.22 sleep infinity >/dev/null
docker run -d --name crashloop "${L[@]}" --restart always alpine:3.22 sh -c 'sleep 3; exit 1' >/dev/null
docker run -d --name oom "${L[@]}" -m 32m --memory-swap 32m alpine:3.22 tail /dev/zero >/dev/null
docker run -d --name flapper "${L[@]}" --restart unless-stopped \
  --health-cmd 'test $(( $(date +%s) / 12 % 2 )) -eq 0' --health-interval 2s --health-retries 1 \
  alpine:3.22 sleep infinity >/dev/null

echo "  warte, bis Datenbank und Mailserver bereit sind ..."
wait_until 120 bash -c '[[ $(docker inspect -f "{{.State.Health.Status}}" db) == healthy ]]' >/dev/null
t_mail=$(wait_until 240 bash -c '[[ $(docker inspect -f "{{.State.Health.Status}}" mailserver) == healthy ]] && timeout 3 bash -c "exec 3<>/dev/tcp/127.0.0.1/25; head -1 <&3" | grep -q ^220')
echo "  Mailserver nach $t_mail s bereit"

cat >"$WORK/test.conf" <<EOF
INTERVAL=5
CONFIRM_CYCLES=2
NOTIFY_WINDOW=120
NOTIFY_MAX=2
REPORT_INTERVAL=60
REPORT_ON_START=1
DISK_PATHS="/ /srv/daten"
CRITICAL_CONTAINERS="db mailserver"
SERVICES="docker cron demo-dienst"
CRITICAL_SERVICES="docker"
ENDPOINTS='[
  {"name":"test-health","method":"GET","url":"$HOOK/health","expect":200},
  {"name":"test-api","method":"POST","url":"$HOOK/api","body":"{\"probe\":true}","headers":{"Content-Type":"application/json"},"expect":[200,201]},
  {"name":"test-dienst","method":"GET","url":"$HOOK/dienst","expect":200,"level":"ERROR"},
  {"name":"test-langsam","method":"GET","url":"$HOOK/slow","expect":200,"timeout":8,"slow_ms":10000},
  {"name":"vies-status","method":"GET","url":"https://ec.europa.eu/taxation_customs/vies/rest-api/check-status","expect":200,"timeout":10,"level":"WARNING"},
  {"name":"vies-ustid","method":"POST","url":"https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-test-service","headers":{"Content-Type":"application/json"},"body":"{\"countryCode\":\"DE\",\"vatNumber\":\"100\"}","expect":200,"timeout":10,"level":"WARNING"}
]'
WEBHOOKS='[
  {"name":"discord-test","type":"discord","url":"$HOOK/discord","events":["change","report"],"min_level":"WARNING"},
  {"name":"json-test","type":"json","url":"$HOOK/json","events":["change","report"],"min_level":"INFO"},
  {"name":"wiederhol-test","type":"json","url":"$HOOK/flaky","events":["change"],"min_level":"CRITICAL"}
]'
EOF

section 01-installation "01 · Installation und Einrichtung als Code" \
  "AK 4 aus #14 (Konfiguration als Code im Repository). Prompts: „separates Konfiguration Script … per IaC“, „Webhook und config Options ganz oben im Skript“, Vorgabe „ein Skript und eine Config“." \
  "monitor install legt das Skript nach /usr/local/bin, die Konfiguration nach /etc/monitor/monitor.conf, erzeugt die systemd-Unit und startet den Dienst. Zweimal hintereinander, danach Werte mit monitor set und webhook-add ändern."
run "$MONITOR_SRC" install --config "$WORK/test.conf"
run "$MONITOR_SRC" install --config "$WORK/test.conf"
note "Die Installation lief zweimal hintereinander ohne Fehler (idempotent)."
run monitor set LOG_LEVEL=INFO
run monitor webhook-add extra json "$HOOK/json" change CRITICAL
check "webhook-add auf mehrzeiliger Konfiguration: Datei bleibt gültiges Bash" bash -n /etc/monitor/monitor.conf
check "webhook-add: jetzt 4 Webhooks" bash -c "source /etc/monitor/monitor.conf; jq -e 'length == 4' <<<\"\$WEBHOOKS\""
run monitor webhook-remove extra
check "webhook-remove: wieder 3 Webhooks" bash -c "source /etc/monitor/monitor.conf; jq -e 'length == 3' <<<\"\$WEBHOOKS\""
run monitor validate
run monitor show
sh_run "ls -la /usr/local/bin/monitor /etc/monitor/monitor.conf"
run systemctl cat monitor
run systemctl status monitor --no-pager
check "Eine einzige Programmdatei: /usr/local/bin/monitor ist eine normale Datei" test -f /usr/local/bin/monitor -a ! -L /usr/local/bin/monitor
check "monitor.service ist aktiv" systemctl is-active --quiet monitor
check "monitor validate meldet keine Fehler" monitor validate
check "Konfiguration hat Rechte 0600 und gehört root" test "$(stat -c '%U %a' /etc/monitor/monitor.conf)" = "root 600"
check "Erster Zustand liegt nach höchstens 30 s in /run/monitor/status.json" wait_until 30 test -s /run/monitor/status.json

section 02-uebersicht "02 · Übersicht: Verfügbarkeit, Auslastung und Fehler beider Dienste" \
  "AK 1 aus #14. Prompts: „Monitor Status command“, „Docker Socket … Ressourcen vom System“, „Pfade und Statistiken in den Status Meldungen“, „Festplatte und RAM und CPU Auslastung“." \
  "Nach 25 s Laufzeit zeigt monitor status alle Prüfungen: Datenbank und Mailserver als Container und über ihre Ports, dazu System, Platten, Dienste und Schnittstellen."
sleep 25
run monitor status
run monitor status --problems
sh_run 'monitor status --json | jq ".checks[] | select(.id == \"container/db\" or .id == \"port/mailserver:25\")"'
check "db: läuft, healthy, INFO" is_level container/db INFO
check "mailserver (docker-mailserver): healthy, INFO" is_level container/mailserver INFO
check "Übersicht zeigt CPU und RAM von db und mailserver" bash -c \
  "monitor status | grep -E 'container/db .*CPU .*RAM' && monitor status | grep -E 'container/mailserver .*CPU .*RAM'"
check "Datenbank-Port 5432: PostgreSQL nimmt Verbindungen an" is_status port/db:5432 pg-ready
check "Mailserver-Port 25: SMTP meldet 220" is_status port/mailserver:25 smtp-ok
check "Mailserver-Port 143: IMAP meldet * OK" is_status port/mailserver:143 imap-ok
check "Mailserver-Port 587: SMTP meldet 220" is_status port/mailserver:587 smtp-ok
check "CPU, RAM, Load und Uptime werden erfasst" jq -e '.system | .cpu_percent and .mem_percent and .load5 and .uptime' /run/monitor/status.json
check "Platten / und /srv/daten werden erfasst" jq -e '[.checks[] | select(.kind == "disk") | .name] | index("/") and index("/srv/daten")' /run/monitor/status.json
check "Dienste docker, cron, demo-dienst: INFO" jq -e '[.checks[] | select(.kind == "service" and .level == "INFO")] | length == 3' /run/monitor/status.json
check "test-api: POST mit erwartetem 201" is_status endpoint/test-api http-201
check "VIES-Testdienst (POST) antwortet 200" is_status endpoint/vies-ustid http-200
check "Meldungen enthalten Pfade (Mounts, Log-Datei)" \
  jq -e '.checks[] | select(.id == "container/db") | .details | .mounts and .log_path' /run/monitor/status.json

section 03-container-zustaende "03 · Alle Container-Zustände" \
  "Prompts: „Das Skript ignoriert teilweise die States der Container“ und „Created, running, paused, restarting, exited und healthy, unhealthy starting wird nicht berücksichtigt“." \
  "Elf echte Container in verschiedenen Zuständen. Zustände, die sich nicht gezielt herstellen lassen (dead, removing, OOMKilled), werden mit nachgestellten Antworten der Docker-API gegen genau das jq-Programm aus /usr/local/bin/monitor geprüft."
run docker ps -a --format 'table {{.Names}}\t{{.Status}}'
sh_run "monitor status | grep -E 'STUFE|container/'"
check "web-unhealthy: unhealthy, ERROR"             is_status container/web-unhealthy unhealthy
check "web-starting: Healthcheck starting, WARNING" is_status container/web-starting starting
check "job-ok: exited 0 als Job, INFO"              is_level container/job-ok INFO
check "job-fehler: exited 3, ERROR"                 is_level container/job-fehler ERROR
check "pausiert: paused, WARNING"                   is_status container/pausiert paused
check "angelegt: created, WARNING"                  is_status container/angelegt created
check "crashloop: restarting oder Neustart-Schleife, ERROR" is_status container/crashloop 'restarting|restart-loop'
if [[ $(docker inspect -f '{{.State.OOMKilled}}' oom) == true ]]; then
  check "oom: Docker meldet OOMKilled, Monitoring CRITICAL" is_level container/oom CRITICAL
else
  note "oom: Docker meldet hier OOMKilled=false, nur Exit-Code 137. Erwartet wird dann ERROR mit Hinweis auf SIGKILL/OOM."
  check "oom: Exit-Code 137 als ERROR mit Hinweis auf SIGKILL/OOM" \
    jq -e '.checks[] | select(.id == "container/oom") | .level == "ERROR" and (.message | contains("137"))' /run/monitor/status.json
fi
sed -n "/^read -r -d '' JQ_DOCKER <<'JQ'/,/^JQ\$/p" /usr/local/bin/monitor | sed '1d;$d' >"$WORK/docker.jq"
zuordnung() {
  jq -nc --arg st "$1" --arg h "$2" --argjson code "$3" --argjson oom "$4" --arg pol "$5" --argjson rc "$6" \
    '{Id:"0123456789abcdef", Name:"/test", RestartCount:$rc, LogPath:"/var/lib/docker/containers/x/x-json.log",
      Config:{Image:"alpine", Labels:{}}, HostConfig:{RestartPolicy:{Name:$pol}}, Mounts:[],
      State:({Status:$st, ExitCode:$code, OOMKilled:$oom, StartedAt:"2020-01-01T00:00:00Z", FinishedAt:"2020-01-01T00:01:00Z"}
             + (if $h != "none" then {Health:{Status:$h, FailingStreak:3, Log:[{Output:"Testausgabe"}]}} else {} end))}' \
  | jq -c -n --slurpfile i /dev/stdin --slurpfile s /dev/null --argjson now "$(date +%s)" --argjson window 120 \
      --argjson critical '[]' --arg ignore '' -f "$WORK/docker.jq" | jq -r '"\(.level) \(.status)"'
}
tabelle="| Zustand | Healthcheck | Exit-Code | OOMKilled | Restart-Policy | erwartet | Ergebnis |"$'\n'"| --- | --- | --- | --- | --- | --- | --- |"
while read -r st h code oom pol rc want; do
  got=$(zuordnung "$st" "$h" "$code" "$oom" "$pol" "$rc")
  tabelle+=$'\n'"| $st | $h | $code | $oom | $pol | $want | $got |"
  check "Zuordnung $st/$h/exit $code/oom $oom/$pol ergibt $want" test "$got" = "$want"
done <<'TABELLE'
running none 0 false no 0 INFO running
running healthy 0 false no 0 INFO healthy
running starting 0 false no 0 WARNING starting
running unhealthy 0 false no 0 ERROR unhealthy
restarting none 1 false always 5 ERROR restarting
paused none 0 false no 0 WARNING paused
created none 0 false no 0 WARNING created
exited none 0 false no 0 INFO exited
exited none 0 false unless-stopped 0 ERROR exited
exited none 3 false no 0 ERROR exited
exited none 137 true no 0 CRITICAL oom-killed
dead none 0 false no 0 CRITICAL dead
removing none 0 false no 0 WARNING removing
TABELLE
md "## Zuordnung aller Zustände (nachgestellte Docker-Antworten)"
md "$tabelle"

section 04-ohne-passwoerter "04 · Ohne Passwörter: Ports werden automatisch erkannt" \
  "Prompt vom 06.11.: „möglichst keinerlei Passwörter an das Monitoring Skript geben … so dass er das unabhängig hin kriegt“. Dazu ADR 0012: Datenbank prüfen, docker-mailserver über SMTP und IMAP." \
  "Die Konfiguration enthält keine Zugangsdaten und keine Ports. monitor liest die veröffentlichten Ports der Container aus der Docker-API und prüft jeden mit dem passenden Protokoll: PostgreSQL-Handshake ohne Anmeldung (wie pg_isready), SMTP- und IMAP-Begrüßung. Zusätzlich die Prüfungstypen postgres, smtp, imap und tcp aus einer Konfiguration, einmal mit monitor check. Im Log der Datenbank darf keine fehlgeschlagene Anmeldung stehen."
sh_run "grep -inE 'passw|pgpass|apikey|secret|token' /etc/monitor/monitor.conf || echo 'keine Zugangsdaten in /etc/monitor/monitor.conf'"
check "Konfiguration enthält keine Zugangsdaten" bash -c "! grep -qiE 'passw|pgpass|apikey|secret|token' /etc/monitor/monitor.conf"
sh_run "monitor status | grep -E 'STUFE|port/'"
run cat /run/monitor/ports.tsv
check "Ports von db und mailserver automatisch gefunden (5432, 25, 143, 587)" bash -c \
  "for p in db:5432 mailserver:25 mailserver:143 mailserver:587; do grep -q \"\\\"port/\$p\\\"\" /run/monitor/status.json || exit 1; done"
check "PostgreSQL ohne Passwort geprüft: Server fordert Anmeldung an" \
  jq -e '.checks[] | select(.id == "port/db:5432") | .status == "pg-ready" and .details.reply == "R"' /run/monitor/status.json
cat >"$WORK/typen.conf" <<'EOF'
CHECKS="endpoints"
ENDPOINTS='[
  {"name":"db-handshake","type":"postgres","host":"127.0.0.1","port":5432,"level":"CRITICAL"},
  {"name":"smtp-submission","type":"smtp","port":587},
  {"name":"imap","type":"imap","port":143},
  {"name":"smtp-banner","type":"tcp","port":25,"banner":"^220","send":"QUIT\r\n"},
  {"name":"geschlossen","type":"tcp","port":5433,"level":"WARNING"}
]'
EOF
chmod 600 "$WORK/typen.conf"
run cat "$WORK/typen.conf"
sh_run "MONITOR_CONF=$WORK/typen.conf monitor check"
MONITOR_CONF=$WORK/typen.conf monitor check --json >"$WORK/typen.json" 2>/dev/null
check "Typ postgres: db-handshake INFO" jq -e '.checks[] | select(.id == "endpoint/db-handshake") | .level == "INFO" and .status == "pg-ready"' "$WORK/typen.json"
check "Typ smtp: Port 587 INFO" jq -e '.checks[] | select(.id == "endpoint/smtp-submission") | .level == "INFO"' "$WORK/typen.json"
check "Typ imap: Port 143 INFO" jq -e '.checks[] | select(.id == "endpoint/imap") | .level == "INFO"' "$WORK/typen.json"
check "Typ tcp mit Banner: Port 25 INFO" jq -e '.checks[] | select(.id == "endpoint/smtp-banner") | .level == "INFO"' "$WORK/typen.json"
check "Geschlossener Port 5433 wird erkannt (WARNING, Connection refused)" \
  jq -e '.checks[] | select(.id == "endpoint/geschlossen") | .level == "WARNING" and .status == "unreachable"' "$WORK/typen.json"
sh_run "docker logs db 2>&1 | tail -n 12"
check "Datenbank-Log: keine fehlgeschlagene Anmeldung durch das Monitoring" bash -c \
  "! docker logs db 2>&1 | grep -qiE 'authentication failed|no pg_hba.conf entry|role .* does not exist'"
note "Einziges Geheimnis bleibt die Webhook-Adresse (Ziel der Meldungen). Für Datenbank und Mailserver braucht monitor keine Zugangsdaten."

section 05-datenbank-aus "05 · Fall 1a: Datenbank nicht erreichbar" \
  "AK 2 und 3 aus #14: „Bei nicht erreichbarem Dienst … wird eine Benachrichtigung ausgelöst“, „künstlich herbeigeführt und die Benachrichtigung ist angekommen“." \
  "Der Container db wird gestoppt. Erwartet: CRITICAL für den Container und für den Port 5432 an Discord und JSON, nach dem Start eine Entwarnung."
M=$(last_seq)
run docker stop db
s=$(wait_until 60 has_hook "$M" json "$(event_json container/db CRITICAL)")
check "JSON-Webhook: container/db CRITICAL angekommen" has_hook "$M" json "$(event_json container/db CRITICAL)"
check "JSON-Webhook: port/db:5432 CRITICAL angekommen" wait_until 20 has_hook "$M" json "$(event_json port/db:5432 CRITICAL)"
check "Discord-Webhook: Meldung zu container/db angekommen" has_hook "$M" discord "$(event_discord CRITICAL container/db)"
check "Port-Meldung nennt Connection refused und den gestoppten Container" has_hook "$M" json \
  'any(.events[]; .id == "port/db:5432" and (.message | contains("Connection refused")) and .details.container_state == "exited")'
note "Erkannt und gemeldet nach $s s (Intervall 5 s, Bestätigung über 2 Durchläufe)."
run monitor status --problems
M2=$(last_seq)
run docker start db
s=$(wait_until 90 has_hook "$M2" json "$(event_json container/db INFO)")
check "Entwarnung: container/db wieder INFO" has_hook "$M2" json "$(event_json container/db INFO)"
check "Entwarnung: port/db:5432 wieder INFO" wait_until 30 has_hook "$M2" json "$(event_json port/db:5432 INFO)"
note "Entwarnung nach $s s."

section 06-mailserver-aus "06 · Fall 1b: Mailserver nicht erreichbar" \
  "AK 2 und 3 aus #14. ADR 0012: docker-mailserver über SMTP und IMAP prüfen." \
  "Der Container mailserver (docker-mailserver) wird gestoppt. Erwartet: CRITICAL für den Container und die Ports 25, 143 und 587, nach dem Start eine Entwarnung, die nicht vom Spam-Schutz zurückgehalten wird."
M=$(last_seq)
run docker stop mailserver
s=$(wait_until 60 has_hook "$M" json "$(event_json container/mailserver CRITICAL)")
check "JSON-Webhook: container/mailserver CRITICAL angekommen" has_hook "$M" json "$(event_json container/mailserver CRITICAL)"
check "JSON-Webhook: port/mailserver:25 (SMTP) CRITICAL angekommen" wait_until 20 has_hook "$M" json "$(event_json port/mailserver:25 CRITICAL)"
check "JSON-Webhook: port/mailserver:143 (IMAP) CRITICAL angekommen" wait_until 20 has_hook "$M" json "$(event_json port/mailserver:143 CRITICAL)"
check "JSON-Webhook: port/mailserver:587 (SMTP) CRITICAL angekommen" wait_until 20 has_hook "$M" json "$(event_json port/mailserver:587 CRITICAL)"
check "Discord-Webhook: Meldung zum Mailserver angekommen" has_hook "$M" discord "$(event_discord CRITICAL mailserver)"
note "Erkannt und gemeldet nach $s s."
run monitor status --problems
M2=$(last_seq)
run docker start mailserver
s=$(wait_until 240 has_hook "$M2" json "$(event_json port/mailserver:25 INFO)")
check "Entwarnung: port/mailserver:25 wieder INFO" has_hook "$M2" json "$(event_json port/mailserver:25 INFO)"
check "Entwarnung: port/mailserver:143 wieder INFO" wait_until 60 has_hook "$M2" json "$(event_json port/mailserver:143 INFO)"
s2=$(wait_until 120 has_hook "$M2" json "$(event_json container/mailserver INFO)")
check "Entwarnung: container/mailserver wieder INFO" has_hook "$M2" json "$(event_json container/mailserver INFO)"
check "Entwarnung wurde nicht vom Spam-Schutz zurückgehalten" not_suppressed container/mailserver
note "SMTP wieder erreichbar nach $s s, Container wieder healthy und Entwarnung angekommen nach $s2 s."

section 07-systemd-dienst-aus "07 · Fall 1c: systemd-Dienst ausgefallen" \
  "Prompt: „Das Monitoring von Docker Containern und theoretisch auch System Services soll möglich sein“." \
  "Der Test-Dienst demo-dienst wird gestoppt. Erwartet: ERROR, nach dem Start Entwarnung."
M=$(last_seq)
run systemctl stop demo-dienst
s=$(wait_until 60 has_hook "$M" json "$(event_json service/demo-dienst ERROR)")
check "service/demo-dienst ERROR gemeldet" has_hook "$M" json "$(event_json service/demo-dienst ERROR)"
note "Gemeldet nach $s s."
M2=$(last_seq)
run systemctl start demo-dienst
check "Entwarnung service/demo-dienst" wait_until 60 has_hook "$M2" json "$(event_json service/demo-dienst INFO)"

section 08-api-falsch "08 · Fall 1d: Schnittstelle antwortet falsch" \
  "Prompt: „optionale API Punkte Monitoren … mit GET, POST, etc aus einer Liste … einen Statuscode erwarten … VIES“." \
  "Die Test-API /dienst antwortet mit 503 statt 200. Erwartet: ERROR mit Statuscode und Antworttext in der Meldung."
M=$(last_seq)
run curl -s -X POST "$HOOK/admin/dienst-down"
run curl -s -i "$HOOK/dienst"
check "endpoint/test-dienst ERROR gemeldet" wait_until 60 has_hook "$M" json "$(event_json endpoint/test-dienst ERROR)"
check "Meldung enthält http_code 503 und die Antwort der API" has_hook "$M" json \
  'any(.events[]; .id == "endpoint/test-dienst" and .details.http_code == 503 and (.details.response | contains("Wartung")))'
M2=$(last_seq)
run curl -s -X POST "$HOOK/admin/dienst-up"
check "Entwarnung endpoint/test-dienst" wait_until 60 has_hook "$M2" json "$(event_json endpoint/test-dienst INFO)"

section 09-platte-voll "09 · Fall 2a: Speicher voll (Platte)" \
  "AK 2 und 3 aus #14: „bei vollem Speicher wird eine Benachrichtigung ausgelöst“. ADR 0012: Das Monitoring muss bei voller Platte selbst weiterarbeiten." \
  "Die Testplatte /srv/daten (1 GB) wird bis zum letzten Block gefüllt. Erwartet: CRITICAL mit den größten Ordnern, das Monitoring prüft weiter, nach dem Aufräumen Entwarnung."
M=$(last_seq)
run df -h /srv/daten
fallocate -l 300M /srv/daten/backups/sicherung-alt.tar
fallocate -l "$(( $(df -B1 --output=avail /srv/daten | tail -1) ))" /srv/daten/uploads/grosse-datei.bin 2>/dev/null
dd if=/dev/zero of=/srv/daten/uploads/rest.bin bs=4k status=none 2>/dev/null
run df -h /srv/daten
run touch /srv/daten/uploads/noch-eine-datei
s=$(wait_until 60 has_hook "$M" json "$(event_json disk//srv/daten CRITICAL)")
check "disk//srv/daten CRITICAL gemeldet" has_hook "$M" json "$(event_json disk//srv/daten CRITICAL)"
check "Discord-Meldung zur vollen Platte angekommen" has_hook "$M" discord "$(event_discord CRITICAL /srv/daten)"
check "Meldung nennt die größten Ordner (uploads, backups)" has_hook "$M" json \
  'any(.events[]; .id == "disk//srv/daten" and ([.details.largest_dirs[]?.path] | index("/srv/daten/uploads") != null and index("/srv/daten/backups") != null))'
note "Gemeldet nach $s s."
sleep 12
sh_run "monitor status | grep -E 'Monitor auf|disk/'"
check "Monitoring arbeitet weiter, während die Platte voll ist (Zustand jünger als 15 s)" \
  bash -c 'test $(( $(date +%s) - $(jq .epoch /run/monitor/status.json) )) -lt 15'
M2=$(last_seq)
run rm -f /srv/daten/uploads/grosse-datei.bin /srv/daten/uploads/rest.bin /srv/daten/backups/sicherung-alt.tar /srv/daten/uploads/noch-eine-datei
check "Entwarnung disk//srv/daten" wait_until 60 has_hook "$M2" json "$(event_json disk//srv/daten INFO)"

section 10-ram-voll "10 · Fall 2b: Speicher voll (Arbeitsspeicher)" \
  "AK 2 und 3 aus #14: „bei vollem Speicher wird eine Benachrichtigung ausgelöst“." \
  "Ein Testprozess (python3) belegt den Arbeitsspeicher bis rund 97 % und hält ihn. Swap ist dafür abgeschaltet, sonst lagert der Kernel aus und der RAM läuft nie ganz voll. Erwartet: ERROR oder CRITICAL mit python3 als größtem Prozess, nach dem Beenden Entwarnung."
read -r -d '' RAM_PY <<'RAMPY'
import sys, time, signal
signal.signal(signal.SIGTERM, lambda *a: sys.exit(0))
mi = {l.split(":")[0]: int(l.split()[1]) * 1024 for l in open("/proc/meminfo")}
want = int(mi["MemAvailable"] - mi["MemTotal"] * (1 - float(sys.argv[1])))
step, blocks = 16 * 1024 * 1024, []
while len(blocks) * step < want:
    b = bytearray(step)
    b[::4096] = b"\x01" * len(range(0, step, 4096))
    blocks.append(b)
while True:
    for b in blocks:
        b[::4096] = b"\x02" * len(range(0, step, 4096))
    time.sleep(1)
RAMPY
M=$(last_seq)
run swapon --show
swapoff -a
run free -m
python3 -c "$RAM_PY" 0.97 &
RAMPID=$!
mem_alarm='.type == "change" and any(.events[]; .id == "system/memory" and (.level == "ERROR" or .level == "CRITICAL"))'
s=$(wait_until 90 has_hook "$M" json "$mem_alarm")
run free -m
sh_run "monitor status | grep -E 'Monitor auf|CPU|system/memory'"
check "system/memory ERROR oder CRITICAL gemeldet" has_hook "$M" json "$mem_alarm"
check "Discord-Meldung zum Arbeitsspeicher angekommen" has_hook "$M" discord 'any(.embeds[]; .title | contains("system/memory"))'
check "Meldung nennt python3 als größten Prozess" has_hook "$M" json \
  'any(.events[]; .id == "system/memory" and (.details.top_processes | startswith("python3")))'
note "Gemeldet nach $s s, gemeldete Stufe: $(jq -r '[.events[] | select(.id == "system/memory") | .level] | first' "$(hooks_since "$M" json "$mem_alarm" | head -n1)" 2>/dev/null)."
check "Monitoring arbeitet weiter, während der RAM voll ist (Zustand jünger als 20 s)" \
  bash -c 'test $(( $(date +%s) - $(jq .epoch /run/monitor/status.json) )) -lt 20'
M2=$(last_seq)
kill "$RAMPID"; wait "$RAMPID" 2>/dev/null
swapon -a
run free -m
check "Entwarnung system/memory" wait_until 90 has_hook "$M2" json "$(event_json system/memory INFO)"

section 11-postfix-aus "11 · Fall 1e: Dienst im laufenden Container ausgefallen (Postfix)" \
  "AK 2 aus #14. ADR 0012: Der Healthcheck von docker-mailserver prüft nur Prozesse, SMTP muss das Monitoring selbst prüfen." \
  "Im laufenden Container mailserver wird nur Postfix gestoppt (supervisorctl). Der Container läuft weiter. Erwartet: CRITICAL für die SMTP-Ports 25 und 587, IMAP (Dovecot) bleibt INFO, nach dem Start Entwarnung."
M=$(last_seq)
run docker exec mailserver supervisorctl stop postfix
s=$(wait_until 60 has_hook "$M" json "$(event_json port/mailserver:25 CRITICAL)")
check "port/mailserver:25 CRITICAL, während der Container läuft" has_hook "$M" json \
  'any(.events[]; .id == "port/mailserver:25" and .level == "CRITICAL" and .details.container_state == "running")'
check "port/mailserver:587 CRITICAL" wait_until 20 has_hook "$M" json "$(event_json port/mailserver:587 CRITICAL)"
check "IMAP (Dovecot) bleibt erreichbar" is_level port/mailserver:143 INFO
run docker ps --filter name=mailserver --format 'table {{.Names}}\t{{.Status}}'
run monitor status --problems
note "Gemeldet nach $s s. Docker meldet den Container dabei als: $(docker inspect -f '{{.State.Status}}, Healthcheck {{.State.Health.Status}}' mailserver)."
M2=$(last_seq)
run docker exec mailserver supervisorctl start postfix
check "Entwarnung port/mailserver:25" wait_until 60 has_hook "$M2" json "$(event_json port/mailserver:25 INFO)"

section 12-docker-aus "12 · Docker fällt aus" \
  "ADR 0012, Fall „Docker fällt aus“: Das Monitoring läuft außerhalb von Docker und muss das melden." \
  "Docker wird gestoppt. Erwartet: CRITICAL für die Docker-API und den Dienst. Die Ports aus dem letzten Durchlauf werden weiter geprüft, die Datenbank meldet sich als nicht erreichbar. Der Wiederhol-Webhook lehnt die erste Zustellung ab."
M=$(last_seq)
run systemctl stop docker.socket docker
check "docker/daemon CRITICAL gemeldet" wait_until 60 has_hook "$M" json "$(event_json docker/daemon CRITICAL)"
check "service/docker CRITICAL gemeldet" wait_until 30 has_hook "$M" json "$(event_json service/docker CRITICAL)"
check "port/db:5432 ohne Docker weiter geprüft und CRITICAL" wait_until 30 has_hook "$M" json \
  'any(.events[]; .id == "port/db:5432" and .level == "CRITICAL" and .details.container_state == "docker-down")'
check "Wiederhol-Webhook: Zustellung nach Ablehnung im 2. Versuch" \
  wait_until 30 bash -c "journalctl -u monitor --since '$SEC_T0' -o cat | grep -q 'an wiederhol-test zugestellt (HTTP 204, Versuch 2)'"
run monitor status --problems
M2=$(last_seq)
run systemctl start docker
check "Entwarnung docker/daemon" wait_until 90 has_hook "$M2" json "$(event_json docker/daemon INFO)"
check "Entwarnung port/db:5432" wait_until 90 has_hook "$M2" json "$(event_json port/db:5432 INFO)"
docker unpause pausiert >/dev/null 2>&1; docker pause pausiert >/dev/null 2>&1

section 13-spam-schutz "13 · Spam-Schutz bei Neustarts und Flattern" \
  "Prompt: „Doppelte Benachrichtigungen und Spam soll bei Restarts / Loops verhindert werden.“" \
  "flapper wechselt alle 12 s zwischen healthy und unhealthy, crashloop startet alle paar Sekunden neu. Ohne Schutz gäbe es in 100 s etwa 8 Meldungen. Regel im Test: höchstens 2 Meldungen je Prüfung in 120 s."
M=$(last_seq)
T13=$(date '+%Y-%m-%d %H:%M:%S')
sleep 100
n_flap=$(hooks_since "$M" json '.type == "change" and any(.events[]; .id == "container/flapper")' | wc -l)
n_crash=$(hooks_since "$M" json '.type == "change" and any(.events[]; .id == "container/crashloop")' | wc -l)
restarts=$(docker inspect -f '{{.RestartCount}}' crashloop)
sh_run "journalctl -u monitor --since '$T13' -o cat | grep 'unterdrückt'"
note "In 100 s: $n_flap Meldungen zu flapper, $n_crash zu crashloop (crashloop hat jetzt $restarts Neustarts)."
check "flapper: höchstens 3 Meldungen in 100 s (ohne Schutz etwa 8)" test "$n_flap" -le 3
check "crashloop: höchstens 1 Meldung trotz $restarts Neustarts" test "$n_crash" -le 1
check "Spam-Schutz hat Wechsel unterdrückt und protokolliert" bash -c "journalctl -u monitor --since '$T13' -o cat | grep -q 'unterdrückt'"

section 14-parallel "14 · Parallele Prüfung" \
  "Prompt: „dass die Sachen teilweise nicht parallel laufen. Wir müssen parallel arbeiten.“" \
  "Alle Module und Schnittstellen laufen gleichzeitig. test-langsam braucht allein 4 s, die CPU-Messung 1 s, dazu VIES über das Internet, die Port-Prüfungen und die Docker-Statistik. Nacheinander müsste ein Durchlauf mindestens so lange dauern wie die Summe dieser Zeiten."
jq '{cycle_ms,
     einzelzeiten_ms: ([.checks[] | select(.kind == "endpoint" or .kind == "port") | {(.id): .details.time_ms}] | add + {"system/cpu (Messung)": 1000}),
     summe_einzelzeiten_ms: ([.checks[] | select(.kind == "endpoint" or .kind == "port") | .details.time_ms] | add + 1000)}' \
  /run/monitor/status.json >"$WORK/dauer.json"
run cat "$WORK/dauer.json"
sh_run 'time monitor check >/dev/null'
note "Ein Durchlauf dauerte $(jq .cycle_ms "$WORK/dauer.json") ms, die Einzelzeiten ergeben zusammen $(jq .summe_einzelzeiten_ms "$WORK/dauer.json") ms."
check "Durchlauf ist kürzer als die Summe der Einzelzeiten (also parallel)" jq -e '.cycle_ms < .summe_einzelzeiten_ms' "$WORK/dauer.json"
check "Durchlauf ist kürzer als 4 s Endpoint + 1 s CPU-Messung + 3 s" jq -e '.cycle_ms < 8000' "$WORK/dauer.json"

section 15-bericht "15 · Regelmäßiger Bericht an Discord und JSON" \
  "Prompts: „Discord für eine Discord Webhook oder einfach nur Json Webhook“, „In der Regelmäßigen Webhook wäre noch die Load Average und Uptime gut“." \
  "Alle 60 s (im Test) geht ein Bericht mit CPU, RAM, Platten, Load Average und Uptime an die Webhooks. Unten der letzte Bericht im Original, einmal als JSON, einmal im Discord-Format."
r_json=$(hooks_since 0 json '.type == "report"' | tail -n 1)
r_disc=$(hooks_since 0 discord 'any(.embeds[].fields[]?; .name == "Load")' | tail -n 1)
check "Mindestens 2 Berichte an den JSON-Webhook" test "$(hooks_since 0 json '.type == "report"' | wc -l)" -ge 2
check "Bericht enthält Load Average und Uptime" jq -e '.system | .load1 != null and .load5 != null and .uptime != null' "$r_json"
check "Bericht enthält CPU, RAM und Platten" jq -e '.system | .cpu_percent != null and .mem_percent != null and (.disks | length) >= 2' "$r_json"
check "Discord-Bericht hat die Felder Load und Uptime" jq -e '[.embeds[0].fields[].name] | index("Load") and index("Uptime")' "$r_disc"
check "Alle Discord-Nachrichten halten die Grenzen ein (10 Embeds, 6000 Zeichen)" \
  bash -c "! awk -F'\t' '\$3 == \"discord\" && \$7 !~ /^ok/' '$INDEX' | grep -q ."
md "## Letzter Bericht als JSON (Original)"
md "$(printf '```json\n%s\n```' "$(cap 80 <"$r_json")")"
md "## Letzter Bericht im Discord-Format (Original)"
md "$(printf '```json\n%s\n```' "$(cat "$r_disc")")"

section 16-nur-ram "16 · Kein Schreiben auf die Platte" \
  "Prompt: „Das Skript muss im RAM laufen damit der Speicherplatz nicht belegt wird und nicht irgendwo die Daten hinschreiben“." \
  "Der Dienst sieht das ganze Dateisystem schreibgeschützt (ProtectSystem=strict). Beschreibbar ist nur /run/monitor, und das liegt im RAM."
PID=$(systemctl show -p MainPID --value monitor)
run systemctl show monitor -p ProtectSystem -p ProtectHome -p RuntimeDirectory -p MemoryMax -p Nice
run findmnt -T /run/monitor
run ls -la /run/monitor
sh_run "grep -E ' / / | /run/monitor ' /proc/$PID/mountinfo"
sh_run "nsenter -t $PID -m touch /var/lib/monitor-schreibtest"
check "Wurzeldateisystem ist für den Dienst schreibgeschützt" grep -qE ' / / ro[, ]' "/proc/$PID/mountinfo"
check "/run/monitor liegt auf tmpfs (RAM)" test "$(findmnt -n -o FSTYPE -T /run/monitor)" = tmpfs
check "Schreibversuch aus dem Dienst-Kontext nach /var/lib scheitert" bash -c \
  "! nsenter -t $PID -m touch /var/lib/monitor-schreibtest 2>/dev/null"

section 17-andere-software "17 · Nutzung durch andere Software" \
  "Prompts: „Skript Modularer Bauen und standardisieren was die Fehlermeldungen und Report Meldungen angeht“, „dass dieses Skript zukünftig auch von anderer Software genutzt werden kann“." \
  "Andere Programme lesen den Zustand als JSON (monitor status --json oder /run/monitor/status.json), werten Exit-Codes aus oder empfangen den JSON-Webhook mit festem Schema."
sh_run 'monitor status --json | jq "{schema, host, level, counts, system}"'
sh_run 'monitor status >/dev/null; echo "Exit-Code: $?"'
sh_run 'monitor check --json | jq -r ".checks[] | [.level, .id] | @tsv" | head -n 12'
run monitor test-webhook json-test
check "status.json hat schema monitor.status/v1" jq -e '.schema == "monitor.status/v1"' /run/monitor/status.json
check "JSON-Webhook hat schema monitor.event/v1" bash -c "jq -e '.schema == \"monitor.event/v1\"' $(hooks_since 0 json '.type == "change"' | head -n 1)"
check "Bericht hat schema monitor.report/v1" jq -e '.schema == "monitor.report/v1"' "$r_json"
check "Exit-Code von monitor status entspricht der Gesamtstufe" bash -c \
  'monitor status >/dev/null; rc=$?; lvl=$(jq -r .level /run/monitor/status.json); case $lvl in INFO) e=0;; WARNING) e=1;; ERROR) e=2;; CRITICAL) e=3;; esac; test $rc -eq $e'

section 18-prioritaeten "18 · Stufen INFO, WARNING, ERROR, CRITICAL im Journal" \
  "Prompt: „Unterschiedliche Prioritäten während auch nice: INFO, WARNING, ERROR und CRTICIAL“." \
  "Das Monitoring schreibt Änderungen und Zustellungen mit passender Priorität ins Journal. journalctl -p filtert danach."
sh_run "journalctl -u monitor --since '$T0' -o short-iso -p crit --no-pager"
sh_run "journalctl -u monitor --since '$T0' -o short-iso -p warning --no-pager | tail -n 15"
check "Journal enthält CRITICAL-Einträge mit Priorität crit" bash -c "journalctl -u monitor --since '$T0' -o cat -p crit | grep -q CRITICAL"
check "INFO-Einträge stehen nicht im Filter ab warning" bash -c "! journalctl -u monitor --since '$T0' -o cat -p warning | grep -q '\[INFO\]'"

section 19-ressourcen "19 · Ressourcenbedarf und Angriffsfläche" \
  "ADR 0012, Kriterien „Ressourcenbedarf“ und „Angriffsfläche“: Das Skript bekam dort je 5 Punkte als Ziel, belegt erst durch den Test." \
  "Über 60 s werden CPU-Zeit und Arbeitsspeicher des Dienstes aus systemd gemessen, im Test mit einer Prüfung alle 5 s. Danach wird geprüft, ob monitor einen Port öffnet oder als Container läuft."
c0=$(systemctl show monitor -p CPUUsageNSec --value); n0=$(date +%s%N)
sleep 60
c1=$(systemctl show monitor -p CPUUsageNSec --value); n1=$(date +%s%N)
cpu=$(awk -v c="$((c1 - c0))" -v t="$((n1 - n0))" 'BEGIN { printf "%.1f", c * 100 / t }')
mem_now=$(( $(systemctl show monitor -p MemoryCurrent --value) / 1048576 ))
mem_peak=$(( $(systemctl show monitor -p MemoryPeak --value) / 1048576 ))
run systemctl show monitor -p MemoryCurrent -p MemoryPeak -p MemoryMax -p TasksCurrent -p CPUUsageNSec -p Nice
sh_run "ss -ltnup | grep -i monitor || echo 'monitor lauscht auf keinem Port'"
sh_run "docker ps --format '{{.Names}}' | grep -i monitor || echo 'kein Container für das Monitoring'"
sh_run "du -sh /run/monitor && ls -la /run/monitor"
note "CPU im Mittel über 60 s: $cpu % eines Kerns (Prüfung alle 5 s, auf dem Server alle 10 s)."
note "Arbeitsspeicher jetzt $mem_now MB, Spitze seit dem Start $mem_peak MB, Grenze der Unit 256 MB."
check "Arbeitsspeicher-Spitze unter der Grenze der Unit (256 MB)" test "$mem_peak" -lt 256
check "CPU im Mittel unter 20 % eines Kerns" awk -v c="$cpu" 'BEGIN { exit !(c < 20) }'
check "monitor öffnet keinen Port" bash -c "! ss -ltnup | grep -qi monitor"
check "kein Container und keine Weboberfläche für das Monitoring" bash -c "! docker ps --format '{{.Names}}' | grep -qi monitor"

section 20-fehlbedienung "20 · Fehlbedienung und Absturz" \
  "Prompt: „standardisieren was die Fehlermeldungen … angeht“. ADR 0012: Das Monitoring läuft allein auf dem Server und muss Fehler selbst sichtbar machen." \
  "Unsichere Rechte an der Konfiguration, kaputtes JSON, eine unbekannte Option, ein Absturz des Dienstes (kill -9) und monitor status bei gestopptem Dienst."
cp /etc/monitor/monitor.conf "$WORK/unsicher.conf"; chmod 666 "$WORK/unsicher.conf"
sh_run "ls -l $WORK/unsicher.conf; MONITOR_CONF=$WORK/unsicher.conf monitor check"
check "Konfiguration für alle beschreibbar: monitor startet nicht (Exit-Code 4)" bash -c \
  "MONITOR_CONF=$WORK/unsicher.conf monitor check >/dev/null 2>&1; test \$? -eq 4"
printf '%s\n' 'CHECKS="endpoints"' "ENDPOINTS='[{\"name\":\"kaputt\",'" >"$WORK/kaputt.conf"; chmod 600 "$WORK/kaputt.conf"
run cat "$WORK/kaputt.conf"
sh_run "MONITOR_CONF=$WORK/kaputt.conf monitor validate"
check "validate erkennt kaputtes JSON" bash -c "! MONITOR_CONF=$WORK/kaputt.conf monitor validate"
sh_run "MONITOR_CONF=$WORK/kaputt.conf monitor check --json | jq '.checks[] | select(.id == \"monitor/endpoints\")'"
check "Kaputtes JSON wird als ERROR gemeldet, nicht verschluckt" bash -c \
  "MONITOR_CONF=$WORK/kaputt.conf monitor check --json | jq -e '.checks[] | select(.id == \"monitor/endpoints\") | .level == \"ERROR\"'"
run monitor set GIBTSNICHT=1
check "Unbekannte Option wird abgelehnt" bash -c "! monitor set GIBTSNICHT=1"
old=$(systemctl show -p MainPID --value monitor)
run kill -9 "$old"
check "systemd startet monitor nach kill -9 neu" wait_until 20 bash -c \
  "pid=\$(systemctl show -p MainPID --value monitor); [[ \$pid != 0 && \$pid != $old ]] && systemctl is-active --quiet monitor"
check "Nach dem Neustart wieder ein aktueller Zustand" wait_until 30 test -s /run/monitor/status.json
sh_run "journalctl -u monitor --since '$SEC_T0' -o short-iso | grep -E 'Main process exited|Scheduled restart|Started|gestartet'"
note "Nach einem Neustart kennt monitor die alten Meldungen nicht mehr (Spam-Schutz im RAM). Offene Probleme werden deshalb einmal neu gemeldet."
run systemctl stop monitor
sh_run "monitor status"
check "monitor status bei gestopptem Dienst: Exit-Code 4 mit Hinweis" bash -c "monitor status >/dev/null 2>&1; test \$? -eq 4"
run systemctl start monitor
check "Dienst läuft wieder mit aktuellem Zustand" wait_until 30 test -s /run/monitor/status.json

section 21-neue-container "21 · Neue Container werden automatisch überwacht" \
  "Prompts: „erkennt noch nicht die container alle automatisch richtig“ und vom 06.11.: „so dass er das unabhängig hin kriegt“." \
  "Ein neuer Webdienst wird mit Port 8000 auf allen Adressen gestartet, ohne die Konfiguration zu ändern. Dann stirbt nur der Webserver im Container, der Container läuft weiter. Ein zweiter Container mit dem Label monitor.ignore=true darf nicht auftauchen."
WEB_LOOP='while [ ! -e /tmp/stop ]; do printf "HTTP/1.0 200 OK\r\nContent-Length: 2\r\n\r\nok" | nc -l -p 80 >/dev/null; done; sleep infinity'
run docker run -d --name web8000 "${L[@]}" --restart unless-stopped -p 8000:80 alpine:3.22 sh -c "$WEB_LOOP"
run docker run -d --name ignoriert "${L[@]}" --label monitor.ignore=true -p 127.0.0.1:8081:80 alpine:3.22 sh -c "$WEB_LOOP"
check "Neuer Port 8000 nach höchstens 30 s automatisch geprüft (HTTP)" wait_until 30 is_status port/web8000:8000 http-up
sh_run "monitor status | grep -E 'STUFE|web8000|ignoriert'"
check "Container web8000 erscheint ohne Konfiguration" is_level container/web8000 INFO
check "Container mit monitor.ignore=true und sein Port werden nicht überwacht" bash -c \
  "! jq -e '.checks[] | select(.id | test(\"ignoriert\"))' /run/monitor/status.json"
M=$(last_seq)
run docker exec web8000 sh -c 'touch /tmp/stop; pkill nc'
check "Webserver tot, Container läuft: port/web8000:8000 ERROR gemeldet" wait_until 60 has_hook "$M" json \
  'any(.events[]; .id == "port/web8000:8000" and .level == "ERROR" and .details.container_state == "running")'
check "Container selbst bleibt INFO" is_level container/web8000 INFO
M2=$(last_seq)
run docker exec -d web8000 sh -c "rm -f /tmp/stop; $WEB_LOOP"
check "Entwarnung port/web8000:8000" wait_until 60 has_hook "$M2" json "$(event_json port/web8000:8000 INFO)"
docker rm -f web8000 ignoriert >/dev/null 2>&1

finish_section

{
  echo "# Tests Monitoring (#14)"
  echo
  echo "> Getestet am $(date '+%d.%m.%Y') auf einer VMPal-VM auf meinem MacBook."
  echo
  echo "| | |"
  echo "| --- | --- |"
  echo "| Testlauf | $(date -d "$T0" '+%d.%m.%Y %H:%M') bis $(date '+%H:%M') |"
  echo "| System | $(. /etc/os-release; echo "$PRETTY_NAME"), $(uname -m), $(nproc) Kerne, $(free -m | awk '/Mem:/ {print $2}') MB RAM |"
  echo "| Docker | $(docker version --format '{{.Server.Version}}' 2>/dev/null) |"
  echo "| Datenbank | \`$(docker inspect -f '{{.Config.Image}}' db)\` (PostgreSQL, wie in Supabase) |"
  echo "| Mailserver | \`$(docker inspect -f '{{.Config.Image}}' mailserver)\` $(docker inspect -f '{{index .Config.Labels "org.opencontainers.image.version"}}' mailserver) (docker-mailserver, ADR 0005) |"
  echo "| Monitoring | $(monitor version), eine Datei \`/usr/local/bin/monitor\` ($(wc -l </usr/local/bin/monitor) Zeilen), ohne Zugangsdaten |"
  echo "| Meldungen | $(wc -l <"$INDEX") beim Test-Empfänger angekommen (statt Discord ein lokaler Empfänger, der die Grenzen von Discord prüft) |"
  echo "| Ergebnis | **$PASS bestanden, $FAIL fehlgeschlagen** |"
  echo
  echo "Jeder Test hat eine eigene Datei mit der Anforderung, den Befehlen mit Original-Ausgabe, dem"
  echo "Server-Log (\`journalctl -u monitor\`) und den angekommenen Meldungen im Original."
  echo
  echo "| Test | bestanden | fehlgeschlagen |"
  echo "| --- | --- | --- |"
  awk -F'\t' '{ printf "| [%s](%s.md) | %s | %s |\n", $4, $1, $2, $3 }' "$WORK/.uebersicht.tsv"
} >"$ERG/README.md"

echo
echo "Fertig: $PASS bestanden, $FAIL fehlgeschlagen. Ergebnisse: $ERG"
(( FAIL == 0 ))
