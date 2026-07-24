#!/usr/bin/env bash
#
# compress-file.sh — web-compress a single video with ffmpeg.
#
# Usage:
#   ./compress-file.sh <path-to-video> [crf] [--mute] [--inplace]
#
# Args:
#   <path-to-video>  File to compress (mp4/mov/m4v/webm/mkv).
#   [crf]            Quality level, same scale as ffmpeg's -crf. Default: 24.
#                    Lower = better quality + bigger file. See README for a table.
#   --mute           Strip the audio track (good for autoplay background reels).
#   --inplace        Overwrite the source file instead of writing "<name>.min.mp4".
#
# Examples:
#   ./compress-file.sh ../public/showcase/papr-showcase.mp4
#   ./compress-file.sh clip.mov 20
#   ./compress-file.sh reel.mp4 24 --mute --inplace
#
set -euo pipefail

# ---- parse args --------------------------------------------------------------
CRF=24
MUTE=0
INPLACE=0
INPUT=""

for arg in "$@"; do
  case "$arg" in
    --mute)    MUTE=1 ;;
    --inplace) INPLACE=1 ;;
    ''|*[!0-9]*)
      if [[ -z "$INPUT" ]]; then INPUT="$arg"; else
        echo "error: unexpected argument '$arg'" >&2; exit 2
      fi ;;
    *)         CRF="$arg" ;;   # all-digits → treat as CRF
  esac
done

if [[ -z "$INPUT" ]]; then
  echo "usage: $0 <path-to-video> [crf] [--mute] [--inplace]" >&2
  exit 2
fi

command -v ffmpeg >/dev/null || { echo "error: ffmpeg not found (brew install ffmpeg)" >&2; exit 1; }
[[ -f "$INPUT" ]] || { echo "error: no such file: $INPUT" >&2; exit 1; }

# ---- encode settings ---------------------------------------------------------
if [[ "$MUTE" -eq 1 ]]; then AUDIO=(-an); else AUDIO=(-c:a aac -b:a 128k); fi

encode() {  # encode <in> <out>
  ffmpeg -y -i "$1" \
    -c:v libx264 -crf "$CRF" -preset slow \
    -maxrate 5M -bufsize 10M \
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
echo "✔ $INPUT  ($before) → $out  ($after)  [crf=$CRF, mute=$MUTE]"
