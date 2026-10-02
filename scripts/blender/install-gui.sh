#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing lightweight desktop + noVNC stack for Blender"
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y   xvfb   openbox   x11vnc   novnc   websockify   dbus-x11   xterm

echo
echo "==> Installed components"
command -v Xvfb
command -v openbox
command -v x11vnc
command -v websockify

echo
echo "SUCCESS: Blender GUI dependencies installed."
