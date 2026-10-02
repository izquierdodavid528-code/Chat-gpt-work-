#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BLEND_FILE="${1:-}"
RUN_DIR="$ROOT/.blender-gui"
LOG_DIR="$RUN_DIR/logs"
mkdir -p "$LOG_DIR"

export DISPLAY=:1
export LIBGL_ALWAYS_SOFTWARE=1
export MESA_LOADER_DRIVER_OVERRIDE=llvmpipe

stop_if_running() {
  local pidfile="$1"
  if [ -f "$pidfile" ]; then
    local pid
    pid="$(cat "$pidfile" || true)"
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
      kill "$pid" || true
      sleep 1
    fi
    rm -f "$pidfile"
  fi
}

stop_if_running "$RUN_DIR/blender.pid"
stop_if_running "$RUN_DIR/websockify.pid"
stop_if_running "$RUN_DIR/x11vnc.pid"
stop_if_running "$RUN_DIR/openbox.pid"
stop_if_running "$RUN_DIR/xvfb.pid"

echo "==> Starting Xvfb on DISPLAY=:1"
Xvfb :1 -screen 0 1600x900x24 -ac +extension GLX +render -noreset   >"$LOG_DIR/xvfb.log" 2>&1 &
echo $! > "$RUN_DIR/xvfb.pid"
sleep 2

echo "==> Starting Openbox"
DISPLAY=:1 dbus-launch --exit-with-session openbox-session   >"$LOG_DIR/openbox.log" 2>&1 &
echo $! > "$RUN_DIR/openbox.pid"
sleep 2

echo "==> Starting x11vnc on localhost:5901"
x11vnc -display :1 -forever -shared -nopw -rfbport 5901 -listen 127.0.0.1   >"$LOG_DIR/x11vnc.log" 2>&1 &
echo $! > "$RUN_DIR/x11vnc.pid"
sleep 2

NOVNC_WEB="/usr/share/novnc"
if [ ! -d "$NOVNC_WEB" ]; then
  echo "ERROR: noVNC web directory not found at $NOVNC_WEB"
  exit 1
fi

echo "==> Starting noVNC/websockify on port 6080"
websockify --web="$NOVNC_WEB" 6080 localhost:5901   >"$LOG_DIR/websockify.log" 2>&1 &
echo $! > "$RUN_DIR/websockify.pid"
sleep 2

echo "==> Starting Blender GUI with software rendering"
if [ -n "$BLEND_FILE" ]; then
  DISPLAY=:1 LIBGL_ALWAYS_SOFTWARE=1 MESA_LOADER_DRIVER_OVERRIDE=llvmpipe blender "$BLEND_FILE" >"$LOG_DIR/blender.log" 2>&1 &
else
  DISPLAY=:1 LIBGL_ALWAYS_SOFTWARE=1 MESA_LOADER_DRIVER_OVERRIDE=llvmpipe blender >"$LOG_DIR/blender.log" 2>&1 &
fi
echo $! > "$RUN_DIR/blender.pid"

echo
echo "SUCCESS: Blender GUI stack started."
echo "Open forwarded port 6080 in Codespaces."
echo "If the page asks for a VNC path, use: vnc.html"
echo
echo "Logs: $LOG_DIR"
