#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SLUG="${1:-}"
if [ -z "$SLUG" ]; then
  echo "Usage: $0 <project-slug>"
  exit 1
fi
exec bash "$ROOT/scripts/workspace/sync-drive.sh" "$SLUG" push-render
