#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-4.5.14}"
CACHE_ROOT="${BLENDER_CACHE_ROOT:-$HOME/.cache/chatgpt-work/blender}"
INSTALL_DIR="$CACHE_ROOT/$VERSION"
BIN="$INSTALL_DIR/blender"

case "$VERSION" in
  4.5.*) SERIES="Blender4.5" ;;
  4.4.*) SERIES="Blender4.4" ;;
  4.3.*) SERIES="Blender4.3" ;;
  4.2.*) SERIES="Blender4.2" ;;
  *) echo "ERROR: unsupported Blender series for pinned installer: $VERSION"; exit 2 ;;
esac

echo "==> Ensuring Blender $VERSION"

sudo apt-get update -qq
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
  ca-certificates curl xz-utils \
  libegl1 libgl1 libopengl0 libx11-6 libxi6 libxrender1 libxfixes3 \
  libxxf86vm1 libxkbcommon0 >/dev/null

if [ ! -x "$BIN" ]; then
  mkdir -p "$CACHE_ROOT"
  TMP="$(mktemp -d)"
  trap 'rm -rf "$TMP"' EXIT
  ARCHIVE="$TMP/blender.tar.xz"
  FILENAME="blender-$VERSION-linux-x64.tar.xz"

  URLS=(
    "https://download.blender.org/release/$SERIES/$FILENAME"
    "https://ftp.nluug.nl/pub/graphics/blender/release/$SERIES/$FILENAME"
  )

  OK=0
  for URL in "${URLS[@]}"; do
    echo "==> Downloading $URL"
    if curl -fL --retry 4 --retry-delay 2 --connect-timeout 30 --max-time 900 \
      -A "Mozilla/5.0" "$URL" -o "$ARCHIVE"; then
      BYTES="$(stat -c %s "$ARCHIVE" 2>/dev/null || echo 0)"
      if [ "$BYTES" -gt 100000000 ]; then
        OK=1
        break
      fi
    fi
    rm -f "$ARCHIVE"
  done

  if [ "$OK" -ne 1 ]; then
    echo "ERROR: could not download Blender $VERSION"
    exit 3
  fi

  tar -xf "$ARCHIVE" -C "$TMP"
  EXTRACTED="$TMP/blender-$VERSION-linux-x64"
  test -x "$EXTRACTED/blender"

  rm -rf "$INSTALL_DIR"
  mkdir -p "$(dirname "$INSTALL_DIR")"
  mv "$EXTRACTED" "$INSTALL_DIR"
fi

sudo ln -sf "$BIN" /usr/local/bin/blender

ACTUAL_VERSION="$(blender --version | head -n 1 | awk '{print $2}')"
if [ "$ACTUAL_VERSION" != "$VERSION" ]; then
  echo "ERROR: expected Blender $VERSION but installed $ACTUAL_VERSION"
  exit 4
fi

echo "==> Blender binary: $BIN"
blender --version | head -n 3
