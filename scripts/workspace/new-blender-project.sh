#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SLUG="${1:-}"
DRIVE_DIR="${2:-$SLUG}"

if [ -z "$SLUG" ]; then
  echo "Usage: $0 <project-slug> [drive-folder-name]"
  exit 1
fi

if ! [[ "$SLUG" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
  echo "ERROR: slug must use lowercase letters, numbers and hyphens only."
  exit 1
fi

SRC="$ROOT/projects/_template-blender"
DST="$ROOT/projects/$SLUG"

if [ -e "$DST" ]; then
  echo "ERROR: project already exists: $DST"
  exit 1
fi

cp -R "$SRC" "$DST"
mkdir -p "$DST/out"

node - "$DST/project.config.json" "$SLUG" "$DRIVE_DIR" <<'NODE'
const fs = require("fs");
const [file, slug, driveDir] = process.argv.slice(2);
const cfg = JSON.parse(fs.readFileSync(file, "utf8"));
cfg.slug = slug;
cfg.driveProjectDir = driveDir;
fs.writeFileSync(file, JSON.stringify(cfg, null, 2) + "\n");
NODE

echo "Created Blender project: projects/$SLUG"
echo "Open: npm run blender:open -- $SLUG"
echo "Render: npm run blender:render -- $SLUG"
