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

exec blender -b --python "$PROJECT/$SCRIPT"
