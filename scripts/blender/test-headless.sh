#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPT="$ROOT/scripts/blender/test_scene.py"

if ! command -v blender >/dev/null 2>&1; then
  echo "Blender is not installed."
  echo "Run: bash scripts/blender/install.sh"
  exit 1
fi

echo "==> Blender"
blender --version | head -n 3

echo
echo "==> Running headless Blender test"
mkdir -p "$ROOT/out"
blender -b --python "$SCRIPT"

echo
echo "==> Generated files"
ls -lh "$ROOT/out/blender-test.png" "$ROOT/out/blender-test.blend"

echo
echo "SUCCESS: Blender headless works in this Codespace."
