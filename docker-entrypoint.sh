#!/bin/sh
# docker-entrypoint.sh
# Runs Prisma migrations then starts the Next.js server.

set -e

echo "🔄 Running Prisma database migrations..."
npx prisma migrate deploy

echo "🚀 Starting Futrix server on port ${PORT:-3000}..."
exec node server.js
