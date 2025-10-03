#!/usr/bin/env bash
set -euo pipefail

REMOTE="integration.rclone.org:"
DIR="dist"

npm ci
npm run build

rclone sync "$DIR" "$REMOTE" --progress --delete-after
