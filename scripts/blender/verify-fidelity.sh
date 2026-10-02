#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 4 ]; then
  echo "Usage: $0 <reference.png> <actual.png> <frame-number> <report-file>"
  exit 2
fi

REF="$1"
ACTUAL="$2"
FRAME="$3"
REPORT="$4"

test -s "$REF"
test -s "$ACTUAL"
mkdir -p "$(dirname "$REPORT")"

read -r WIDTH HEIGHT <<EOF
$(identify -format "%w %h" "$REF")
EOF
TOTAL_PIXELS=$((WIDTH * HEIGHT))

AE_RAW="$(compare -metric AE "$REF" "$ACTUAL" null: 2>&1 || true)"
RMSE_RAW="$(compare -metric RMSE "$REF" "$ACTUAL" null: 2>&1 || true)"

PARSED="$(python3 - "$AE_RAW" "$RMSE_RAW" "$TOTAL_PIXELS" <<\'PY\'
import re, sys
ae_raw, rmse_raw, total = sys.argv[1], sys.argv[2], int(sys.argv[3])

m_ae = re.search(r"([0-9]+(?:\\.[0-9]+)?)", ae_raw)
if not m_ae:
    raise SystemExit("Could not parse AE: " + ae_raw)
changed = int(round(float(m_ae.group(1))))

m_rmse = re.search(r"\\(([-+0-9.eE]+)\\)", rmse_raw)
if m_rmse:
    rmse = float(m_rmse.group(1))
else:
    m_rmse = re.search(r"([-+0-9.eE]+)", rmse_raw)
    if not m_rmse:
        raise SystemExit("Could not parse RMSE: " + rmse_raw)
    rmse = float(m_rmse.group(1))

fraction = changed / total
mode = "exact" if changed == 0 and rmse == 0 else "strict-tolerance"
passed = (changed == 0 and rmse == 0) or (rmse <= 2e-5 and fraction <= 1e-4)

print(changed)
print(f"{fraction:.12g}")
print(f"{rmse:.12g}")
print(mode)
print("PASS" if passed else "FAIL")
PY
)"

CHANGED_PIXELS="$(printf "%s\\n" "$PARSED" | sed -n "1p")"
CHANGED_FRACTION="$(printf "%s\\n" "$PARSED" | sed -n "2p")"
RMSE_NORM="$(printf "%s\\n" "$PARSED" | sed -n "3p")"
MODE="$(printf "%s\\n" "$PARSED" | sed -n "4p")"
RESULT="$(printf "%s\\n" "$PARSED" | sed -n "5p")"

PSNR_LINE="$(ffmpeg -v info -i "$REF" -i "$ACTUAL" -lavfi psnr -f null - 2>&1 | grep -E "PSNR.*average:" | tail -n 1 || true)"
SSIM_LINE="$(ffmpeg -v info -i "$REF" -i "$ACTUAL" -lavfi ssim -f null - 2>&1 | grep -E "SSIM.*All:" | tail -n 1 || true)"

{
  echo "frame=$FRAME"
  echo "dimensions=${WIDTH}x${HEIGHT}"
  echo "mode=$MODE"
  echo "changed_pixels=$CHANGED_PIXELS"
  echo "changed_fraction=$CHANGED_FRACTION"
  echo "rmse_normalized=$RMSE_NORM"
  echo "psnr=$PSNR_LINE"
  echo "ssim=$SSIM_LINE"
  echo "result=$RESULT"
  echo
} >> "$REPORT"

test "$RESULT" = "PASS"
