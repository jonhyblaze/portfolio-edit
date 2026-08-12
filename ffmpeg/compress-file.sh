#!/usr/bin/env bash
#
# compress-file.sh — web-compress a single video with ffmpeg.
#
# Usage:
#   ./compress-file.sh <path-to-video> [crf] [--mute] [--inplace] [--maxrate=N|--no-cap]
#
# Args:
#   <path-to-video>  File to compress (mp4/mov/m4v/webm/mkv).
#   [crf]            Quality level, same scale as ffmpeg's -crf. Default: 24.
#                    Lower = better quality + bigger file. See README for a table.
#   --mute           Strip the audio track (good for autoplay background reels).
#   --inplace        Overwrite the source file instead of writing "<name>.min.mp4".
#   --maxrate=N      VBV bitrate ceiling, e.g. 12M or 800K. Default: 5M (1080p-tuned).
#   --no-cap         Drop the ceiling entirely — pure CRF, bitrate floats free.
#
# Note: the ceiling wins over CRF. At the default 5M, every CRF below ~26 hits the
# cap and produces the same ~5 Mbps file, so lowering CRF alone looks like a no-op.
# Raise it (--maxrate=12M) or remove it (--no-cap) when you want low CRF to bite.
#
# Examples:
#   ./compress-file.sh ../public/showcase/papr-showcase.mp4
#   ./compress-file.sh clip.mov 20
#   ./compress-file.sh reel.mp4 24 --mute --inplace
#   ./compress-file.sh hero.mp4 12 --no-cap        # genuinely high quality
#
set -euo pipefail

# ---- parse args --------------------------------------------------------------
CRF=24
MUTE=0
INPLACE=0
MAXRATE=5M
INPUT=""

for arg in "$@"; do
  case "$arg" in
    --mute)      MUTE=1 ;;
    --inplace)   INPLACE=1 ;;
    --no-cap)    MAXRATE="" ;;
    --maxrate=*) MAXRATE="${arg#*=}" ;;
    ''|*[!0-9]*)
      if [[ -z "$INPUT" ]]; then INPUT="$arg"; else
        echo "error: unexpected argument '$arg'" >&2; exit 2
      fi ;;
    *)           CRF="$arg" ;;   # all-digits → treat as CRF
  esac
done

if [[ -z "$INPUT" ]]; then
  echo "usage: $0 <path-to-video> [crf] [--mute] [--inplace] [--maxrate=N|--no-cap]" >&2
  exit 2
fi

command -v ffmpeg >/dev/null || { echo "error: ffmpeg not found (brew install ffmpeg)" >&2; exit 1; }
[[ -f "$INPUT" ]] || { echo "error: no such file: $INPUT" >&2; exit 1; }

# ---- encode settings ---------------------------------------------------------
if [[ "$MUTE" -eq 1 ]]; then AUDIO=(-an); else AUDIO=(-c:a aac -b:a 192k); fi

# VBV ceiling, bufsize = 2× maxrate. Empty MAXRATE (--no-cap) → no ceiling at all.
if [[ -n "$MAXRATE" ]]; then
  [[ "$MAXRATE" =~ ^[0-9]+[MK]$ ]] || {
    echo "error: --maxrate expects an integer plus M or K (e.g. 12M, 800K), got '$MAXRATE'" >&2
    exit 2
  }
  VBV=(-maxrate "$MAXRATE" -bufsize "$(( ${MAXRATE%[MK]} * 2 ))${MAXRATE#${MAXRATE%?}}")
else
  VBV=()
fi

encode() {  # encode <in> <out>
  ffmpeg -y -i "$1" \
    -c:v libx264 -crf "$CRF" -preset slow \
    ${VBV[@]+"${VBV[@]}"} \
    -movflags +faststart -pix_fmt yuv420p \
    "${AUDIO[@]}" \
    "$2"
}

# ---- run ---------------------------------------------------------------------
before=$(du -h "$INPUT" | cut -f1)

if [[ "$INPLACE" -eq 1 ]]; then
  tmp="$(dirname "$INPUT")/.$(basename "$INPUT").tmp.mp4"
  encode "$INPUT" "$tmp"
  mv -f "$tmp" "$INPUT"
  out="$INPUT"
else
  out="${INPUT%.*}.min.mp4"
  encode "$INPUT" "$out"
fi

after=$(du -h "$out" | cut -f1)
echo "✔ $INPUT  ($before) → $out  ($after)  [crf=$CRF, maxrate=${MAXRATE:-none}, mute=$MUTE]"
