#!/bin/sh
set -e

echo "=== Running database migrations ==="
if [ ! -d prisma/migrations ] || [ -z "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "No migrations found in image - applying schema directly (db push)..."
  npx prisma db push --skip-generate 2>&1
else
  echo "Migrations found - applying..."
  npx prisma migrate deploy 2>&1 || {
    echo "WARN: migrate deploy failed, running initial setup..."
    npx prisma db push --skip-generate 2>&1
    echo "=== Marking baseline migration as applied ==="
    npx prisma migrate resolve --applied 000001_init 2>&1 || true
  }
fi

echo "=== Starting API ==="
exec "$@"
