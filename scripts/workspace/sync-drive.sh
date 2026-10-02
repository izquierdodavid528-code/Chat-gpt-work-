#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SLUG="${1:-}"
MODE="${2:-pull}"

if [ -z "$SLUG" ]; then
  echo "Usage: $0 <project-slug> [pull|push-render]"
  exit 1
fi

if ! command -v rclone >/dev/null 2>&1; then
  echo "ERROR: rclone is not installed."
  exit 1
fi

PROJECT="$ROOT/projects/$SLUG"
CONFIG="$PROJECT/project.config.json"
if [ ! -f "$CONFIG" ]; then
  echo "ERROR: missing $CONFIG"
  exit 1
fi

DRIVE_DIR="$(node -e 'const c=require(process.argv[1]); console.log(c.driveProjectDir)' "$CONFIG")"
BASE="Remotion Projects"

case "$MODE" in
  pull)
    mkdir -p "$PROJECT/public"
    rclone copy "drive:$BASE/$DRIVE_DIR/assets" "$PROJECT/public" --create-empty-src-dirs --transfers 8 --checkers 16
    ;;
  push-render)
    mkdir -p "$PROJECT/out"
    rclone mkdir "drive:$BASE/$DRIVE_DIR/renders"
    rclone copy "$PROJECT/out" "drive:$BASE/$DRIVE_DIR/renders" --transfers 4 --checkers 8
    ;;
  *)
    echo "ERROR: mode must be pull or push-render"
    exit 1
    ;;
esac
