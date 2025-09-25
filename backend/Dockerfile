# Use the official Bun image
FROM oven/bun:1.1.30-alpine

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy application files
COPY . .

# Ensure proper permissions
RUN chmod +x index.js 2>/dev/null || true

EXPOSE 3030

ENV PORT 3030
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production

CMD ["bun", "index.js"]