# Use the official Bun image
FROM oven/bun:1.1.30-alpine

WORKDIR /app

# Copy package files (for any potential future dependencies)
COPY package.json bun.lock* ./

# Copy application files
COPY index.js ./

# Since we're using a minimal backend without complex dependencies,
# we don't need to install node_modules for now

# Ensure proper permissions
RUN chmod +x index.js 2>/dev/null || true

EXPOSE 3030

ENV PORT 3030
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production

CMD ["bun", "index.js"]