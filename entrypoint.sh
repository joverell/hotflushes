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
  echo "Seeding public assets volume..."
  mkdir -p /app/public
  cp -r /app/public_seed/. /app/public/
fi

# Ensure permissions are correct before starting
# (Optional, but helps if volumes were created by root)
# chown -R nextjs:nodejs /app/content /app/public

exec "$@"
