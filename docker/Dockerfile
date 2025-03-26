# Frontend Build Stage
FROM node:20 AS builder

WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire project
COPY . .

# Build the Next.js app
RUN npm run build

# Final Stage: Use a lightweight image for production
FROM node:20
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built Next.js files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy the package files and node_modules from the builder stage if needed
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

# Add an entrypoint script
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

# Start using the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]

# Add a health check to the Dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl --silent --fail http://localhost:3000 || exit 1