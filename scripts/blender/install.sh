#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing Blender from Ubuntu repositories"
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y blender

echo
echo "==> Blender version"
blender --version | head -n 3
