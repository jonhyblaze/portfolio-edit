# scripts — Cloudflare R2 upload

Uploads the large project videos (the full clips behind `projects/[slug]`) to a
Cloudflare R2 bucket, so they stay **out of git** while streaming from R2's
free-egress CDN. Hero/showcase loops stay in `public/` and git; only the big
project fulls go here.

Uses **rclone** — it does multipart, resumable uploads, so multi-GB files are safe.

## One-time setup

### 1. Create the bucket

Cloudflare dashboard → **R2** → *Create bucket* (e.g. `portfolio-videos`).
For clean, cacheable public URLs, attach a **custom domain** to the bucket
(bucket → Settings → *Public access* → *Connect Domain*, e.g.
`videos.yourdomain.com`). That domain is your `R2_PUBLIC_BASE`.

### 2. Get an R2 API token

Dashboard → R2 → *Manage R2 API Tokens* → create a token with
**Object Read & Write**. Note the **Access Key ID**, **Secret Access Key**, and
your **Account ID** (the S3 endpoint is `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`).

### 3. Configure rclone

```bash
brew install rclone
rclone config
```

Answer the prompts:
- `n` (new remote) → name it **`r2`**
- Storage → **Amazon S3** → Provider → **Cloudflare R2**
- `access_key_id` / `secret_access_key` → from step 2
- `region` → `auto`
- `endpoint` → `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
- accept defaults for the rest

Verify: `rclone listremotes` should show `r2:`.

### 4. Point the script at your bucket

Create `scripts/.env` (git-ignored — see below):

```bash
R2_REMOTE=r2
R2_BUCKET=portfolio-videos
R2_PUBLIC_BASE=https://videos.yourdomain.com
```

## Usage

```bash
cd scripts
./r2-upload.sh <local-file-or-folder> [remote-path]
```

```bash
# single file → exact key, prints its public URL
./r2-upload.sh ../public/showcase/papr-full.mp4 projects/papr/full.mp4
#   → https://videos.yourdomain.com/projects/papr/full.mp4

# a whole folder → synced under the prefix
./r2-upload.sh ./exports/leopolis projects/leopolis
```

Then reference the URL from your project page:

```tsx
<video src="https://videos.yourdomain.com/projects/papr/full.mp4"
       controls playsInline preload="metadata" />
```

## Recommended workflow for a new project video

1. **Compress the master** with the ffmpeg toolbox (higher quality than the hero
   loops — keep audio, lower CRF):
   ```bash
   cd ../ffmpeg
   ./compress-file.sh ~/exports/papr-master.mov 20     # → papr-master.min.mp4
   ```
   A ~10 GB master typically lands at ~1–2 GB here, plays instantly, and often
   keeps you inside R2's 10 GB free tier.
2. **Upload** the compressed file:
   ```bash
   cd ../scripts
   ./r2-upload.sh ~/exports/papr-master.min.mp4 projects/papr/full.mp4
   ```
3. **Reference** the printed public URL from `projects/[slug]`.

## Renaming videos

A rename has to happen in **three places** to stay consistent: on R2, on your
local disk, and in the code that references the URL.

```bash
# 1. On R2 — server-side move, instant, no re-download/re-upload
rclone moveto r2:buck/loops/old.mp4 r2:buck/loops/new.mp4

# 2. Local copy (kept on disk for dev / as the re-upload source)
mv public/showcase/old.mp4 public/showcase/new.mp4

# 3. Code — update the key in data/showcase.ts
#    src: video("loops/old.mp4")  →  src: video("loops/new.mp4")
```

Batch rename (example: strip a `-showcase` suffix off every file in `loops/`):

```bash
# on R2
for old in $(rclone lsf r2:buck/loops/ --include "*-showcase.mp4"); do
  rclone moveto "r2:buck/loops/$old" "r2:buck/loops/${old/-showcase.mp4/.mp4}"
done
# locally
cd public/showcase && for f in *-showcase.mp4; do mv "$f" "${f/-showcase.mp4/.mp4}"; done
# then fix data/showcase.ts (e.g. with perl):
#   perl -0pi -e 's{loops/([^"]+?)-showcase\.mp4}{loops/$1.mp4}g' data/showcase.ts
```

Verify: `rclone lsf r2:buck/loops/`.

## Re-uploading a re-edited video (same filename)

After you re-cut a clip or pick a better compression rate, keep the **same
filename/key** so no code changes are needed — just overwrite the object:

```bash
# 1. Re-encode (see ../ffmpeg). --inplace keeps the name; or pick a new CRF:
cd ../ffmpeg
./compress-file.sh ~/edits/papr-v2.mov 22 --mute --inplace   # → papr-v2.mp4
mv ~/edits/papr-v2.mp4 ../public/showcase/papr.mp4           # match the existing key

# 2. Overwrite the R2 object (copyto replaces the destination in place)
cd ../scripts
rclone copyto ../public/showcase/papr.mp4 r2:buck/loops/papr.mp4 --progress
#   (or: ./r2-upload.sh ../public/showcase/papr.mp4 loops/papr.mp4)
```

`rclone` re-uploads only when the file actually changed (it compares size/hash),
so re-running is safe and cheap.

**Cache note:** the `r2.dev` URL is barely cached, so a new version usually shows
up right away — but your **browser** caches the video aggressively. Hard-reload
(⌘⇧R) to see the update. If you later put a **custom domain / Cloudflare CDN** in
front of the bucket, purge that file from the cache (or bump a `?v=2` query param
on the `src`) after re-uploading, or viewers keep getting the old cut.

## Notes

- **Never commit `scripts/.env`** — it isn't secret-bearing itself (rclone holds
  the keys in its own config), but keep bucket details out of git anyway. Add it
  to `.gitignore`.
- **Cost:** storage is $0.015/GB-month beyond the 10 GB free tier; **egress is
  always free**. See the main discussion for the breakdown.
- **rclone remote name** defaults to `r2`; override with `R2_REMOTE` if you named
  it something else.
