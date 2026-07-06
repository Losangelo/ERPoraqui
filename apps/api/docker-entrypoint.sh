#!/bin/sh
set -e

echo "=== Running Prisma schema sync ==="
npx prisma db push --skip-generate --accept-data-loss 2>&1 || echo "WARN: prisma db push failed, continuing anyway"

echo "=== Starting API ==="
exec "$@"
