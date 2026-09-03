# Stage 1: Build Frontend
FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:22-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/ ./

# Stage 3: Production Image
FROM node:22-alpine
WORKDIR /app

# Set non-root user (Alpine node image provides 'node' user)
# Copy with ownership
COPY --from=server-build --chown=node:node /app/server ./server
COPY --from=client-build --chown=node:node /app/client/dist ./client/dist

# Secure variables
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080
USER node
WORKDIR /app/server

CMD ["node", "src/server.js"]
