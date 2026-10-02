#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

echo "==> ChatGPT Work bootstrap"

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js is missing."
  exit 1
fi

echo "Node: $(node --version)"
echo "npm:  $(npm --version)"

# Keep Remotion projects deterministic.
for project in "$ROOT"/projects/*; do
  [ -d "$project" ] || continue
  [ -f "$project/package.json" ] || continue

  echo
  echo "==> Preparing $(basename "$project")"
  if [ -f "$project/package-lock.json" ]; then
    (cd "$project" && npm ci --no-audit --no-fund)
  else
    (cd "$project" && npm install --no-audit --no-fund)
  fi
done

# Install the same rclone version used by GitHub Actions.
if ! command -v rclone >/dev/null 2>&1 || ! rclone version | head -n 1 | grep -Fq "rclone v1.75.1"; then
  echo
  echo "==> Installing rclone 1.75.1"
  TMP_RCLONE="$(mktemp -d)"
  (
    cd "$TMP_RCLONE"
    curl -fsSLO "https://downloads.rclone.org/v1.75.1/rclone-v1.75.1-linux-amd64.zip"
    unzip -q rclone-v1.75.1-linux-amd64.zip
    sudo install -m 0755 rclone-v1.75.1-linux-amd64/rclone /usr/local/bin/rclone
  )
  rm -rf "$TMP_RCLONE"
fi

# Optional: define RCLONE_CONFIG_B64 as a Codespaces secret to make Drive ready automatically.
if [ -n "${RCLONE_CONFIG_B64:-}" ]; then
  mkdir -p "$HOME/.config/rclone"
  printf '%s' "$RCLONE_CONFIG_B64" | base64 --decode > "$HOME/.config/rclone/rclone.conf"
  chmod 600 "$HOME/.config/rclone/rclone.conf"
  echo "==> Restored rclone config from Codespaces secret"
fi

# Install Blender + browser GUI layer only when missing.
if ! command -v blender >/dev/null 2>&1; then
  echo
  echo "==> Installing Blender"
  bash "$ROOT/scripts/blender/install.sh"
fi

if ! command -v websockify >/dev/null 2>&1 || ! command -v x11vnc >/dev/null 2>&1; then
  echo
  echo "==> Installing Blender browser GUI dependencies"
  bash "$ROOT/scripts/blender/install-gui.sh"
fi

mkdir -p "$ROOT/out" "$ROOT/.workspace"

echo
echo "==> Workspace ready"
echo "Remotion Studio: use npm run studio -- <project-slug>"
echo "Blender GUI:     npm run blender:start"
echo "New project:     npm run project:new -- <project-slug>"
