# ──────────────────────────────────────────────────────────────────────────────
# Stage 1: deps — install only production dependencies
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy lockfile + manifests first to maximise layer cache
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install ALL deps (dev included) so Prisma client can be generated
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2: builder — compile Next.js
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Bring in node_modules + generated Prisma client from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js app (standalone output)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ──────────────────────────────────────────────────────────────────────────────
# Stage 3: runner — lean production image
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone Next.js build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma schema + generated client (needed at runtime)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Entrypoint script that runs migrations then starts the server
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
