#!/bin/sh
set -e

# Seed content if volume is empty
if [ ! -d "/app/content/pages" ] || [ ! "$(ls -A /app/content/pages)" ]; then
  echo "Seeding content volume..."
  mkdir -p /app/content
  cp -r /app/content_seed/. /app/content/
fi

# Seed public assets if volume is empty
if [ ! -d "/app/public/images" ] || [ ! "$(ls -A /app/public/images)" ]; then
  echo "Seeding images volume..."
  mkdir -p /app/public/images
  cp -r /app/public_seed/images/. /app/public/images/
fi

if [ ! -d "/app/public/audio" ] || [ ! "$(ls -A /app/public/audio)" ]; then
  echo "Seeding audio volume..."
  mkdir -p /app/public/audio
  cp -r /app/public_seed/audio/. /app/public/audio/
fi

# Ensure permissions are correct on volumes (handles root-owned bind mounts)
echo "Fixing permissions..."
chown -R nextjs:nodejs /app/content /app/public

# Drop privileges and run the command
echo "Starting application as nextjs..."
exec su-exec nextjs "$@"
