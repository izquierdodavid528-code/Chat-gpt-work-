#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPT="$ROOT/scripts/blender/test_scene.py"

if ! command -v blender >/dev/null 2>&1; then
  echo "Blender is not installed."
  echo "Run: bash scripts/blender/install.sh"
  exit 1
fi

echo "==> Blender binary"
command -v blender

echo
echo "==> Missing linked libraries, if any"
ldd "$(command -v blender)" | grep "not found" || echo "No direct missing libraries reported by ldd."

echo
echo "==> Blender version"
LIBGL_ALWAYS_SOFTWARE=1 blender --version | head -n 3

echo
echo "==> Running headless Blender test with Mesa software rendering"
mkdir -p "$ROOT/out"
export LIBGL_ALWAYS_SOFTWARE=1
export MESA_LOADER_DRIVER_OVERRIDE=llvmpipe
blender -b --python "$SCRIPT"

echo
echo "==> Generated files"
ls -lh "$ROOT/out/blender-test.png" "$ROOT/out/blender-test.blend"

echo
echo "SUCCESS: Blender headless works in this Codespace."
