#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SLUG="${1:-}"
MODE="${2:-auto}"

if [ -z "$SLUG" ]; then
  echo "Usage: $0 <project-slug> [auto|sequential|parallel]"
  exit 1
fi

PROJECT="$ROOT/projects/$SLUG"
test -f "$PROJECT/project.config.json"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cd "$ROOT"
python3 scripts/blender/render-plan.py   "projects/$SLUG"   "$TMP/github-output.txt"   "$TMP/render-plan.json"   "$MODE"   ""

cat "$TMP/render-plan.json"
