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
