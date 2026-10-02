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

if [ ! -f "$PROJECT/package.json" ]; then
  echo "ERROR: project not found: projects/$SLUG"
  exit 1
fi

if [ -f "$PROJECT/package-lock.json" ]; then
  (cd "$PROJECT" && npm ci --no-audit --no-fund)
else
  (cd "$PROJECT" && npm install --no-audit --no-fund)
fi

PORT=3000
if [ -f "$CONFIG" ]; then
  PORT="$(node -e 'const c=require(process.argv[1]); console.log(c.studioPort || 3000)' "$CONFIG")"
fi

echo "==> Starting Remotion Studio for $SLUG on port $PORT"
cd "$PROJECT"
exec npx remotion studio src/index.ts --port="$PORT"
