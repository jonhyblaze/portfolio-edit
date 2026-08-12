#!/usr/bin/env bash
#
# compress-folder.sh — web-compress every video in a /public subfolder, in place.
#
# Usage:
#   ./compress-folder.sh <folder-under-public> [crf] [--mute|--keep-audio] [--maxrate=N|--no-cap]
#
# Args:
#   <folder-under-public>  Path relative to the project's public/ dir.
#                          Accepts "/showcase", "showcase", or "public/videos".
#   [crf]                  Quality level (ffmpeg -crf scale). Default: 24.
#                          Lower = better quality + bigger file.
#   --mute                 Strip audio (default for this portfolio's silent reels).
#   --keep-audio           Re-encode audio to AAC 192k instead of stripping it.
#   --maxrate=N            VBV bitrate ceiling, e.g. 12M or 800K. Default: 5M (1080p-tuned).
#   --no-cap               Drop the ceiling entirely — pure CRF, bitrate floats free.
#
# Note: the ceiling wins over CRF. At the default 5M, every CRF below ~26 hits the
# cap and produces the same ~5 Mbps file, so lowering CRF alone looks like a no-op.
# Raise it (--maxrate=12M) or remove it (--no-cap) when you want low CRF to bite.
#
# Behavior:
#   - Overwrites each video IN PLACE (originals are replaced). Commit or back up
#     first if you want a safety net — the encode is not reversible.
#   - Processes: mp4, mov, m4v, webm, mkv.
#
# Examples:
#   ./compress-folder.sh /showcase
#   ./compress-folder.sh videos 28 --keep-audio
#   ./compress-folder.sh /showcase 14 --no-cap
#
set -euo pipefail

# ---- locate project public/ (script lives in <root>/ffmpeg/) -----------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
PUBLIC="$ROOT/public"

# ---- parse args --------------------------------------------------------------
CRF=24
MUTE=1            # default: silent, matches the showcase reels
MAXRATE=5M
REL=""

for arg in "$@"; do
  case "$arg" in
    --mute)       MUTE=1 ;;
    --keep-audio) MUTE=0 ;;
    --no-cap)     MAXRATE="" ;;
    --maxrate=*)  MAXRATE="${arg#*=}" ;;
    ''|*[!0-9]*)
      if [[ -z "$REL" ]]; then REL="$arg"; else
        echo "error: unexpected argument '$arg'" >&2; exit 2
      fi ;;
    *)            CRF="$arg" ;;   # all-digits → CRF
  esac
done

if [[ -z "$REL" ]]; then
  echo "usage: $0 <folder-under-public> [crf] [--mute|--keep-audio] [--maxrate=N|--no-cap]" >&2
  exit 2
fi

command -v ffmpeg >/dev/null || { echo "error: ffmpeg not found (brew install ffmpeg)" >&2; exit 1; }

# normalize: strip leading slash and an optional leading "public/"
REL="${REL#/}"; REL="${REL#public/}"
DIR="$PUBLIC/$REL"
[[ -d "$DIR" ]] || { echo "error: no such folder: $DIR" >&2; exit 1; }

# ---- encode settings ---------------------------------------------------------
# AUDIO_BITRATE feeds both the encode and the label below, so they can't drift.
AUDIO_BITRATE=192k
if [[ "$MUTE" -eq 1 ]]; then
  AUDIO=(-an); AUDIO_LABEL=stripped
else
  AUDIO=(-c:a aac -b:a "$AUDIO_BITRATE"); AUDIO_LABEL="aac-$AUDIO_BITRATE"
fi

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

echo "Folder : $DIR"
echo "CRF    : $CRF        maxrate: ${MAXRATE:-none}        audio: $AUDIO_LABEL"
echo

# ---- run ---------------------------------------------------------------------
shopt -s nullglob nocaseglob
count=0
before_total=0 after_total=0

for f in "$DIR"/*.{mp4,mov,m4v,webm,mkv}; do
  before_b=$(wc -c < "$f")
  tmp="$DIR/.$(basename "$f").tmp.mp4"

  if ffmpeg -y -i "$f" \
       -c:v libx264 -crf "$CRF" -preset slow \
       ${VBV[@]+"${VBV[@]}"} \
       -movflags +faststart -pix_fmt yuv420p \
       "${AUDIO[@]}" \
       "$tmp" >/dev/null 2>&1; then
    # normalize non-mp4 sources to .mp4 output
    dest="${f%.*}.mp4"
    mv -f "$tmp" "$dest"
    [[ "$dest" != "$f" ]] && rm -f "$f"
    after_b=$(wc -c < "$dest")
    before_total=$((before_total + before_b)); after_total=$((after_total + after_b))
    count=$((count + 1))
    printf "  ✔ %-30s %5sMB → %5sMB\n" "$(basename "$dest")" \
      "$((before_b/1048576))" "$((after_b/1048576))"
  else
    rm -f "$tmp"
    printf "  ✗ %-30s (ffmpeg failed, left untouched)\n" "$(basename "$f")" >&2
  fi
done

echo
if [[ "$count" -eq 0 ]]; then
  echo "No videos found in $DIR"
else
  printf "Done: %d file(s), %sMB → %sMB\n" "$count" \
    "$((before_total/1048576))" "$((after_total/1048576))"
fi
