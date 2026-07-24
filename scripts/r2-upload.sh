#!/usr/bin/env bash
#
# r2-upload.sh — upload project videos to Cloudflare R2 via rclone.
#
# Handles large files (multipart, resumable) — good for the 500MB–2GB
# compressed project fulls that live off-git. See scripts/README.md for
# one-time setup (rclone remote + env vars).
#
# Usage:
#   ./r2-upload.sh <local-file-or-folder> [remote-path]
#
# Args:
#   <local-file-or-folder>  What to upload. A file uploads as one object;
#                           a folder syncs its contents.
#   [remote-path]           Destination key/prefix inside the bucket.
#                           Default: basename of the local path.
#
# Config (env vars — set in your shell or scripts/.env, see README):
#   R2_REMOTE       rclone remote name for R2          (default: r2)
#   R2_BUCKET       target bucket                       (required)
#   R2_PUBLIC_BASE  public base URL for printed links   (optional, e.g.
#                   https://videos.yourdomain.com)
#
# Examples:
#   ./r2-upload.sh ../public/showcase/papr-full.mp4 projects/papr/full.mp4
#   ./r2-upload.sh ./exports/leopolis projects/leopolis
#
set -euo pipefail

# ---- load scripts/.env if present -------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[[ -f "$SCRIPT_DIR/.env" ]] && { set -a; . "$SCRIPT_DIR/.env"; set +a; }

R2_REMOTE="${R2_REMOTE:-r2}"
R2_BUCKET="${R2_BUCKET:-}"
R2_PUBLIC_BASE="${R2_PUBLIC_BASE:-}"

# ---- validate ----------------------------------------------------------------
command -v rclone >/dev/null || {
  echo "error: rclone not found. Install it and configure an R2 remote:" >&2
  echo "  brew install rclone && rclone config   (see scripts/README.md)" >&2
  exit 1
}
[[ -n "$R2_BUCKET" ]] || { echo "error: R2_BUCKET is not set (see scripts/README.md)" >&2; exit 2; }

SRC="${1:-}"
[[ -n "$SRC" ]] || { echo "usage: $0 <local-file-or-folder> [remote-path]" >&2; exit 2; }
[[ -e "$SRC" ]] || { echo "error: no such path: $SRC" >&2; exit 1; }

DEST="${2:-$(basename "$SRC")}"
DEST="${DEST#/}"   # no leading slash in the key

# confirm the remote exists
rclone listremotes 2>/dev/null | grep -qx "${R2_REMOTE}:" || {
  echo "error: rclone remote '${R2_REMOTE}:' not found. Run 'rclone config'." >&2
  echo "       existing remotes: $(rclone listremotes 2>/dev/null | tr '\n' ' ')" >&2
  exit 1
}

TARGET="${R2_REMOTE}:${R2_BUCKET}/${DEST}"
echo "Uploading: $SRC"
echo "       to: $TARGET"
echo

# ---- upload ------------------------------------------------------------------
# copyto for a single file (exact key), copy for a folder (into the prefix).
if [[ -f "$SRC" ]]; then
  rclone copyto "$SRC" "$TARGET" --progress --s3-chunk-size 64M
else
  rclone copy "$SRC" "$TARGET" --progress --s3-chunk-size 64M
fi

echo
echo "✔ Upload complete."
if [[ -n "$R2_PUBLIC_BASE" && -f "$SRC" ]]; then
  echo "  Public URL: ${R2_PUBLIC_BASE%/}/${DEST}"
elif [[ -z "$R2_PUBLIC_BASE" ]]; then
  echo "  (set R2_PUBLIC_BASE to print the public URL — needs a custom domain on the bucket)"
fi
