# Use the official Bun image
FROM oven/bun:1.1.30-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production=false

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# No build step needed for this application

# Production image, copy all the files and run bun
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy application files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock* ./bun.lock*
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/index.js ./index.js
COPY --from=builder /app/src ./src

# Ensure all node_modules are readable
RUN chmod -R +r /app/node_modules

# Run as root to avoid permission issues in container
# USER bun

EXPOSE 3030

ENV PORT 3030
ENV HOSTNAME "0.0.0.0"

CMD ["bun", "index.js"]