#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SLUG="${1:-}"

if [ -z "$SLUG" ]; then
  echo "Usage: $0 <project-slug> [drive-folder-name]"
  exit 1
fi

if ! [[ "$SLUG" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
  echo "ERROR: slug must use lowercase letters, numbers and hyphens only."
  exit 1
fi

DRIVE_DIR="${2:-$SLUG}"
SRC="$ROOT/projects/_template-remotion"
DST="$ROOT/projects/$SLUG"

if [ -e "$DST" ]; then
  echo "ERROR: project already exists: $DST"
  exit 1
fi

cp -R "$SRC" "$DST"
rm -rf "$DST/node_modules" "$DST/out" "$DST/public"

node - "$DST/package.json" "$SLUG" <<'NODE'
const fs = require("fs");
const [file, slug] = process.argv.slice(2);
const p = JSON.parse(fs.readFileSync(file, "utf8"));
p.name = slug;
p.scripts.render = p.scripts.render.replace("out/render.mp4", `out/${slug}.mp4`);
fs.writeFileSync(file, JSON.stringify(p, null, 2) + "\n");
NODE

node - "$DST/project.config.json" "$SLUG" "$DRIVE_DIR" <<'NODE'
const fs = require("fs");
const [file, slug, driveDir] = process.argv.slice(2);
const cfg = JSON.parse(fs.readFileSync(file, "utf8"));
cfg.slug = slug;
cfg.driveProjectDir = driveDir;
cfg.outputFile = `out/${slug}.mp4`;
fs.writeFileSync(file, JSON.stringify(cfg, null, 2) + "\n");
NODE

mkdir -p "$DST/public" "$DST/out"

(cd "$DST" && npm ci --no-audit --no-fund)

echo
echo "Created: projects/$SLUG"
echo "Drive folder: Remotion Projects/$DRIVE_DIR"
echo "Next:"
echo "  npm run studio -- $SLUG"
