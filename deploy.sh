#!/usr/bin/env bash
set -euo pipefail

REMOTE="integration.rclone.org:"
DIR="dist"

npm ci
npm run build

# Upload the content-hashed assets first so a new index.html never
# references an asset which isn't on the server yet. The server caches
# /assets/* as immutable so a 404 there could be cached for a long time.
rclone copy "$DIR/assets" "${REMOTE}assets" --progress

# Now sync everything else (index.html) and remove old assets
rclone sync "$DIR" "$REMOTE" --progress --delete-after
