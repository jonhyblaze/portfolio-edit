# ffmpeg — video compression toolbox

Small wrapper scripts for web-compressing the portfolio's showcase videos so they
stay under GitHub's file-size limits (50 MB warning / 100 MB hard block) and load
fast from the CDN. On the initial `public/showcase/` batch this cut **489 MB → 128 MB**
with no visible quality loss.

## Requirements

```bash
brew install ffmpeg      # macOS
```

## Scripts

| Script               | Scope                                | Destructive?                            |
| -------------------- | ------------------------------------ | --------------------------------------- |
| `compress-folder.sh` | Every video in a `public/` subfolder | **Yes** — overwrites in place           |
| `compress-file.sh`   | A single video                       | No by default (writes `<name>.min.mp4`) |

Both are executable (`chmod +x` already applied). If git dropped the bit after a
clone, restore it with `chmod +x ffmpeg/*.sh`.

### compress-folder.sh

```
./compress-folder.sh <folder-under-public> [crf] [--mute|--keep-audio] [--maxrate=N|--no-cap]
```

- **`<folder-under-public>`** — path relative to `public/`. `"/showcase"`,
  `"showcase"`, and `"public/videos"` all resolve to the same place.
- **`[crf]`** — quality, ffmpeg's `-crf` scale. Default `24`. Lower = better/bigger.
- **`--mute`** _(default)_ — strip audio. **`--keep-audio`** re-encodes to AAC 192k.
- **`--maxrate=N`** — VBV ceiling, e.g. `12M`, `800K`. Default `5M`. **`--no-cap`**
  removes it. Same caveat as the single-file script: the ceiling overrides CRF, so
  low CRF values do nothing until you raise or drop the cap.

Overwrites each source file **in place**, so commit or back up first if you want a
safety net — the encode isn't reversible. Non-mp4 inputs (`.mov`, `.webm`, …) are
converted to `.mp4` and the original is removed.

```bash
cd ffmpeg
./compress-folder.sh /showcase              # crf 24, muted (what the portfolio uses)
./compress-folder.sh /videos 28             # smaller files, slightly softer
./compress-folder.sh /videos 22 --keep-audio
./compress-folder.sh /hero 14 --no-cap      # CRF actually bites
```

### compress-file.sh

```
./compress-file.sh <path-to-video> [crf] [--mute] [--inplace] [--maxrate=N|--no-cap]
```

Writes `<name>.min.mp4` next to the source by default (non-destructive). Add
`--inplace` to overwrite the original instead.

- **`--maxrate=N`** — raise or lower the VBV ceiling, e.g. `12M`, `800K`. Default `5M`.
- **`--no-cap`** — drop the ceiling entirely, so CRF alone decides the bitrate.

```bash
cd ffmpeg
./compress-file.sh ../public/showcase/papr-showcase.mp4        # → papr-showcase.min.mp4
./compress-file.sh clip.mov 20                                 # higher quality
./compress-file.sh reel.mp4 24 --mute --inplace
./compress-file.sh hero.mp4 12 --no-cap                        # CRF actually bites
```

> **The bitrate ceiling overrides CRF.** At the default `-maxrate 5M`, any CRF below
> roughly 26 asks for more bitrate than the cap allows, so it clamps to ~5 Mbps and
> every low CRF yields a near-identical file — lowering CRF looks like it does
> nothing. On a 1440×1080 source, crf 12 and crf 20 both landed on 3.99 MB capped;
> uncapped they were 35.8 MB and 9.9 MB. Use `--maxrate=12M` or `--no-cap` when you
> want the quality knob to have an effect.

## Choosing a CRF

Constant Rate Factor targets a _quality_ level and lets bitrate float — the right
knob for "make it small but still look good."

|    CRF | Use for                          | Feel                                  |
| -----: | -------------------------------- | ------------------------------------- |
|  18–20 | hero clips, fine gradients, text | visually lossless, larger             |
| **24** | **showcase reels (default)**     | **no visible loss at normal viewing** |
|  26–28 | background loops, long clips     | noticeably smaller, minor softening   |
|    30+ | thumbnails / previews            | visible artifacts                     |

Rule of thumb: **±6 CRF ≈ half / double the file size** — but only while the encode
stays under the `-maxrate` ceiling. Once it hits the cap, CRF stops mattering (see
the note under `compress-file.sh`).

## What the recipe does

Both scripts run the same encode:

```bash
ffmpeg -y -i INPUT \
  -c:v libx264 -crf 24 -preset slow \   # x264, quality-based, good compression effort
  -maxrate 5M -bufsize 10M \            # ceiling so busy scenes can't balloon (1080p-tuned)
  -movflags +faststart \               # moov atom up front → playback starts before full download
  -pix_fmt yuv420p \                   # widest browser/device compatibility
  -an \                                # strip audio (or: -c:a aac -b:a 192k to keep it)
  OUTPUT
```

Notes:

- `-maxrate 5M` is tuned for 1080p. For 4K sources, or any time you drop CRF below
  ~26, raise it (`--maxrate=12M`) or remove it (`--no-cap`) — otherwise the cap
  over-compresses motion and silently overrides the CRF you asked for.
- `libx264`/mp4 is chosen for universal `<video>` playback. H.265/AV1 compress
  better but aren't safe everywhere without fallbacks.

## Reference: the folder script

<details>
<summary><code>compress-folder.sh</code></summary>

```bash
#!/usr/bin/env bash
# compress-folder.sh — web-compress every video in a /public subfolder, in place.
#   ./compress-folder.sh <folder-under-public> [crf] [--mute|--keep-audio] [--maxrate=N|--no-cap]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
PUBLIC="$ROOT/public"

CRF=24; MUTE=1; MAXRATE=5M; REL=""
for arg in "$@"; do
  case "$arg" in
    --mute)       MUTE=1 ;;
    --keep-audio) MUTE=0 ;;
    --no-cap)     MAXRATE="" ;;
    --maxrate=*)  MAXRATE="${arg#*=}" ;;
    ''|*[!0-9]*)  if [[ -z "$REL" ]]; then REL="$arg"; else
                    echo "error: unexpected argument '$arg'" >&2; exit 2; fi ;;
    *)            CRF="$arg" ;;
  esac
done
[[ -z "$REL" ]] && { echo "usage: $0 <folder-under-public> [crf] [--mute|--keep-audio] [--maxrate=N|--no-cap]" >&2; exit 2; }
command -v ffmpeg >/dev/null || { echo "error: ffmpeg not found (brew install ffmpeg)" >&2; exit 1; }

REL="${REL#/}"; REL="${REL#public/}"; DIR="$PUBLIC/$REL"
[[ -d "$DIR" ]] || { echo "error: no such folder: $DIR" >&2; exit 1; }

AUDIO_BITRATE=192k
if [[ "$MUTE" -eq 1 ]]; then AUDIO=(-an); AUDIO_LABEL=stripped
else AUDIO=(-c:a aac -b:a "$AUDIO_BITRATE"); AUDIO_LABEL="aac-$AUDIO_BITRATE"; fi
if [[ -n "$MAXRATE" ]]; then
  [[ "$MAXRATE" =~ ^[0-9]+[MK]$ ]] || { echo "error: --maxrate expects an integer plus M or K (e.g. 12M, 800K), got '$MAXRATE'" >&2; exit 2; }
  VBV=(-maxrate "$MAXRATE" -bufsize "$(( ${MAXRATE%[MK]} * 2 ))${MAXRATE#${MAXRATE%?}}")
else
  VBV=()
fi
echo "Folder : $DIR"
echo "CRF    : $CRF        maxrate: ${MAXRATE:-none}        audio: $AUDIO_LABEL"; echo

shopt -s nullglob nocaseglob
count=0; before_total=0; after_total=0
for f in "$DIR"/*.{mp4,mov,m4v,webm,mkv}; do
  before_b=$(wc -c < "$f"); tmp="$DIR/.$(basename "$f").tmp.mp4"
  if ffmpeg -y -i "$f" -c:v libx264 -crf "$CRF" -preset slow \
       ${VBV[@]+"${VBV[@]}"} -movflags +faststart -pix_fmt yuv420p \
       "${AUDIO[@]}" "$tmp" >/dev/null 2>&1; then
    dest="${f%.*}.mp4"; mv -f "$tmp" "$dest"; [[ "$dest" != "$f" ]] && rm -f "$f"
    after_b=$(wc -c < "$dest")
    before_total=$((before_total + before_b)); after_total=$((after_total + after_b)); count=$((count + 1))
    printf "  ✔ %-30s %5sMB → %5sMB\n" "$(basename "$dest")" "$((before_b/1048576))" "$((after_b/1048576))"
  else
    rm -f "$tmp"; printf "  ✗ %-30s (ffmpeg failed, left untouched)\n" "$(basename "$f")" >&2
  fi
done
echo
if [[ "$count" -eq 0 ]]; then echo "No videos found in $DIR"
else printf "Done: %d file(s), %sMB → %sMB\n" "$count" "$((before_total/1048576))" "$((after_total/1048576))"; fi
```

</details>

## Reference: the single-file script

<details>
<summary><code>compress-file.sh</code></summary>

```bash
#!/usr/bin/env bash
# compress-file.sh — web-compress a single video with ffmpeg.
#   ./compress-file.sh <path-to-video> [crf] [--mute] [--inplace] [--maxrate=N|--no-cap]
set -euo pipefail

CRF=24; MUTE=0; INPLACE=0; MAXRATE=5M; INPUT=""
for arg in "$@"; do
  case "$arg" in
    --mute)      MUTE=1 ;;
    --inplace)   INPLACE=1 ;;
    --no-cap)    MAXRATE="" ;;
    --maxrate=*) MAXRATE="${arg#*=}" ;;
    ''|*[!0-9]*) if [[ -z "$INPUT" ]]; then INPUT="$arg"; else
                   echo "error: unexpected argument '$arg'" >&2; exit 2; fi ;;
    *)           CRF="$arg" ;;
  esac
done
[[ -z "$INPUT" ]] && { echo "usage: $0 <path-to-video> [crf] [--mute] [--inplace] [--maxrate=N|--no-cap]" >&2; exit 2; }
command -v ffmpeg >/dev/null || { echo "error: ffmpeg not found (brew install ffmpeg)" >&2; exit 1; }
[[ -f "$INPUT" ]] || { echo "error: no such file: $INPUT" >&2; exit 1; }

if [[ "$MUTE" -eq 1 ]]; then AUDIO=(-an); else AUDIO=(-c:a aac -b:a 192k); fi
if [[ -n "$MAXRATE" ]]; then
  [[ "$MAXRATE" =~ ^[0-9]+[MK]$ ]] || { echo "error: --maxrate expects an integer plus M or K (e.g. 12M, 800K), got '$MAXRATE'" >&2; exit 2; }
  VBV=(-maxrate "$MAXRATE" -bufsize "$(( ${MAXRATE%[MK]} * 2 ))${MAXRATE#${MAXRATE%?}}")
else
  VBV=()
fi
encode() { ffmpeg -y -i "$1" -c:v libx264 -crf "$CRF" -preset slow \
  ${VBV[@]+"${VBV[@]}"} -movflags +faststart -pix_fmt yuv420p "${AUDIO[@]}" "$2"; }

before=$(du -h "$INPUT" | cut -f1)
if [[ "$INPLACE" -eq 1 ]]; then
  tmp="$(dirname "$INPUT")/.$(basename "$INPUT").tmp.mp4"; encode "$INPUT" "$tmp"; mv -f "$tmp" "$INPUT"; out="$INPUT"
else
  out="${INPUT%.*}.min.mp4"; encode "$INPUT" "$out"
fi
after=$(du -h "$out" | cut -f1)
echo "✔ $INPUT  ($before) → $out  ($after)  [crf=$CRF, maxrate=${MAXRATE:-none}, mute=$MUTE]"
```

</details>
