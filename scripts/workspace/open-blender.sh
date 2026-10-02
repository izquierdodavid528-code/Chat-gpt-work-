#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SLUG="${1:-}"

if [ -z "$SLUG" ]; then
  exec bash "$ROOT/scripts/blender/start-gui.sh"
fi

PROJECT="$ROOT/projects/$SLUG"
CONFIG="$PROJECT/project.config.json"
if [ ! -f "$CONFIG" ]; then
  echo "ERROR: missing project config: $CONFIG"
  exit 1
fi

BLEND_REL="$(node -e 'const c=require(process.argv[1]); console.log(c.blendFile || "out/scene.blend")' "$CONFIG")"
BLEND="$PROJECT/$BLEND_REL"

if [ ! -f "$BLEND" ]; then
  echo "No .blend file yet. Generating one headlessly first..."
  bash "$ROOT/scripts/workspace/render-blender.sh" "$SLUG"
fi

exec bash "$ROOT/scripts/blender/start-gui.sh" "$BLEND"
