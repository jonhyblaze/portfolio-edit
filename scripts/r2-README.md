## 1. Upload the loops

Simplest — one command copies just the .mp4 files into buck/loops/, with a live progress bar:

rclone copy public/showcase/ r2:buck/loops/ --include "*.mp4" --progress

The --include "*.mp4" keeps the poster JPGs out — those stay in git. It uploads all 7 clips (~128 MB total), skipping any that already match.

(Alternative, if you'd rather use the wrapper script per-file: cd scripts && for f in ../public/showcase/*.mp4; do ./r2-upload.sh "$f" "loops/$(basename "$f")"; done)

## 2. Verify they landed

rclone ls r2:buck/loops

You should see all 7, something like:

 22108216 212-showcase.mp4
 11421386 blb-showcase.mp4
 18809826 hum-showcase.mp4
 14247040 icehole-showcase.mp4
 25410047 leopolis-showcase.mp4
 32385802 papr-showcase.mp4
  5578935 pavo-indus-showcase.mp4

(Sizes in bytes — papr ~32 MB is the biggest.)

## What's next (after upload)

1. Enable public access on the bucket → Cloudflare dashboard → buck → Settings → Public access → Allow Access. That gives you a https://pub-<hash>.r2.dev origin.
2. Tell me that URL — I'll set NEXT_PUBLIC_MEDIA_BASE (.env.local + a note for Vercel) and R2_PUBLIC_BASE in scripts/.env.
3. npm run dev → confirm reels play from R2.
4. Then the git re-init + push.
