#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BLENDER_VERSION="${BLENDER_VERSION:-4.5.14}"

echo "==> Installing pinned Blender $BLENDER_VERSION"
bash "$ROOT/scripts/blender/install-pinned.sh" "$BLENDER_VERSION"

echo
echo "==> Installing headless / GUI compatibility dependencies"
sudo apt-get update -qq
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
  libgl1 libegl1 libopengl0 libglx-mesa0 libgl1-mesa-dri libgles2 \
  mesa-utils xvfb >/dev/null

echo
echo "==> Blender version"
blender --version | head -n 3
