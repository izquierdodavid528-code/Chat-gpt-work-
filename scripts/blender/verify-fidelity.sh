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

REF_MD5="$(ffmpeg -v error -i "$REF" -f framemd5 - | tail -n 1 | awk -F\', \' \'{print $NF}\')"
ACTUAL_MD5="$(ffmpeg -v error -i "$ACTUAL" -f framemd5 - | tail -n 1 | awk -F\', \' \'{print $NF}\')"

WIDTH="$(identify -format "%w" "$REF")"
HEIGHT="$(identify -format "%h" "$REF")"
TOTAL_PIXELS=$((WIDTH * HEIGHT))

{
  echo "frame=$FRAME"
  echo "reference_framemd5=$REF_MD5"
  echo "parallel_framemd5=$ACTUAL_MD5"
  echo "dimensions=${WIDTH}x${HEIGHT}"
} >> "$REPORT"

if [ "$REF_MD5" = "$ACTUAL_MD5" ]; then
  {
    echo "mode=exact"
    echo "changed_pixels=0"
    echo "changed_fraction=0"
    echo "rmse_normalized=0"
    echo "result=PASS"
    echo
  } >> "$REPORT"
  exit 0
fi

RMSE_RAW="$(compare -metric RMSE "$REF" "$ACTUAL" null: 2>&1 || true)"
AE_RAW="$(compare -metric AE "$REF" "$ACTUAL" null: 2>&1 || true)"
RMSE_NORM="$(printf "%s" "$RMSE_RAW" | sed -n "s/.*(\\([^)]*\\)).*/\\1/p")"
CHANGED_PIXELS="$(printf "%s" "$AE_RAW" | tr -cd "0-9")"

if [ -z "$RMSE_NORM" ] || [ -z "$CHANGED_PIXELS" ]; then
  echo "Unable to parse fidelity metrics." >&2
  echo "RMSE_RAW=$RMSE_RAW" >&2
  echo "AE_RAW=$AE_RAW" >&2
  exit 3
fi

CHANGED_FRACTION="$(python3 - "$CHANGED_PIXELS" "$TOTAL_PIXELS" <<\'PY\'
import sys
changed = int(sys.argv[1])
total = int(sys.argv[2])
print(changed / total)
PY
)"

PSNR_LINE="$(ffmpeg -v info -i "$REF" -i "$ACTUAL" -lavfi psnr -f null - 2>&1 | grep -E "PSNR.*average:" | tail -n 1 || true)"
SSIM_LINE="$(ffmpeg -v info -i "$REF" -i "$ACTUAL" -lavfi ssim -f null - 2>&1 | grep -E "SSIM.*All:" | tail -n 1 || true)"

# Strict tolerance measured from the same immutable Eevee master across hosted runners.
# Exact matches pass immediately. Non-exact matches must stay below both limits.
PASS="$(python3 - "$RMSE_NORM" "$CHANGED_FRACTION" <<\'PY\'
import sys
rmse = float(sys.argv[1])
fraction = float(sys.argv[2])
print("1" if rmse <= 2e-5 and fraction <= 1e-4 else "0")
PY
)"

{
  echo "mode=strict-tolerance"
  echo "changed_pixels=$CHANGED_PIXELS"
  echo "changed_fraction=$CHANGED_FRACTION"
  echo "rmse_normalized=$RMSE_NORM"
  echo "psnr=$PSNR_LINE"
  echo "ssim=$SSIM_LINE"
} >> "$REPORT"

if [ "$PASS" = "1" ]; then
  {
    echo "result=PASS"
    echo
  } >> "$REPORT"
  exit 0
fi

{
  echo "result=FAIL"
  echo
} >> "$REPORT"
exit 1
