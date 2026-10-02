#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SLUG="${1:-}"

if [ -z "$SLUG" ]; then
  echo "Usage: $0 <project-slug>"
  exit 1
fi

PROJECT="$ROOT/projects/$SLUG"
CONFIG="$PROJECT/project.config.json"

if [ ! -f "$CONFIG" ]; then
  echo "ERROR: missing project config: $CONFIG"
  exit 1
fi

SCRIPT="$(node -e 'const c=require(process.argv[1]); console.log(c.sceneScript || "scene.py")' "$CONFIG")"

mkdir -p "$PROJECT/out"
export LIBGL_ALWAYS_SOFTWARE=1
export MESA_LOADER_DRIVER_OVERRIDE=llvmpipe
export BLENDER_PROJECT_SLUG="$SLUG"
export BLENDER_PROGRESS_FILE="$PROJECT/out/render-progress.json"

printf '{\n  "project": "%s",\n  "status": "starting",\n  "percent": 0,\n  "updated_at": null\n}\n' "$SLUG" > "$BLENDER_PROGRESS_FILE"

exec blender -b --python "$ROOT/scripts/blender/render-with-progress.py" -- "$PROJECT/$SCRIPT"
