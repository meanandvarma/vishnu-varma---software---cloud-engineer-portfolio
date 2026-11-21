# Multi-stage build for Vishnu Varma Engineering Portfolio
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Build frontend SPA & bundle backend server
RUN npx vite build
RUN npx esbuild server.ts --platform=node --packages=external --format=esm --outfile=server.js

# Production runner image
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy compiled bundles and static assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
