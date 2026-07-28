#!/bin/sh

echo "Waiting for postgres to be ready..."
until nc -z db 5432; do
  sleep 1
done
echo "Postgres is ready!"

echo "Running Prisma DB push..."
npx prisma db push

echo "Starting Next.js..."
exec node server.js
