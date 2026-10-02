#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing Blender + headless software-rendering dependencies"
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y   blender   libgl1   libegl1   libopengl0   libglx-mesa0   libgl1-mesa-dri   libgles2   mesa-utils   xvfb

echo
echo "==> Blender version"
blender --version | head -n 3 || true

echo
echo "==> Mesa / OpenGL packages installed"
dpkg -l | grep -E 'libgl1|libegl1|libopengl0|libglx-mesa0|libgl1-mesa-dri|libgles2' || true
