import { Rule } from "../types";

export const rule: Rule = {
	id: "docker-containerization",
	slug: "docker-containerization",
	title: "Docker Containerization Best Practices",
  tags: ["docker", "containers", "devops", "deployment", "infrastructure"],
  languages: ["dockerfile", "yaml"],
  description: "Comprehensive guide for building efficient, secure, and production-ready Docker containers",
  content: `# Docker Containerization Best Practices

## 1. Dockerfile Optimization

### Multi-Stage Builds for Smaller Images
\`\`\`dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nextjs

EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### Layer Caching Optimization
\`\`\`dockerfile
# ❌ Bad: Changes in source code invalidate all layers
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# ✅ Good: Dependencies cached separately from source
FROM node:18-alpine
WORKDIR /app

# Copy dependency files first (changes less frequently)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code last (changes frequently)
COPY . .
RUN npm run build
\`\`\`

### Security Hardening
\`\`\`dockerfile
FROM node:18-alpine

# Update packages and remove cache
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

# Set ownership and permissions
COPY --chown=appuser:appgroup package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --chown=appuser:appgroup . .

# Remove write permissions
RUN chmod -R 555 /app

# Switch to non-root user
USER appuser

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
\`\`\`

## 2. Image Size Optimization

### Alpine Linux Base Images
\`\`\`dockerfile
# Size comparison:
# node:18 (Ubuntu-based) ~900MB
# node:18-slim ~200MB
# node:18-alpine ~170MB

FROM node:18-alpine AS base

# Install only necessary packages
RUN apk add --no-cache \
    curl \
    && rm -rf /var/cache/apk/*
\`\`\`

### .dockerignore Configuration
\`\`\`dockerignore
# Exclude development files
node_modules
npm-debug.log*
.git
.gitignore
README.md
.env
.env.local
.env.development
.env.test
.nyc_output
coverage
.vscode
.idea

# Exclude build artifacts
dist
build
.next
.nuxt

# Exclude test files
**/*.test.js
**/*.spec.js
test/
tests/
__tests__/

# Exclude documentation
docs/
*.md
!README.md

# OS generated files
.DS_Store
Thumbs.db
\`\`\`

### Distroless Images for Production
\`\`\`dockerfile
# For Node.js applications
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Use distroless for final image
FROM gcr.io/distroless/nodejs18-debian11
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["index.js"]
\`\`\`

## 3. Docker Compose for Development

### Complete Development Environment
\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
      target: development
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules  # Anonymous volume for node_modules
      - app-cache:/app/.next  # Named volume for Next.js cache
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@db:5432/appdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d appdb"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    networks:
      - app-network

volumes:
  postgres-data:
  redis-data:
  app-cache:

networks:
  app-network:
    driver: bridge
\`\`\`

### Development Dockerfile
\`\`\`dockerfile
# Dockerfile.dev
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Development stage
FROM base AS development
ENV NODE_ENV=development
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production build stage
FROM base AS builder
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM base AS production
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
COPY --from=builder --chown=nextjs:nodejs /app/dist ./
USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 4. Health Checks and Monitoring

### Application Health Check
\`\`\`dockerfile
# Add health check to Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
\`\`\`

### Health Check Endpoint
\`\`\`javascript
// health.js
const express = require('express');
const router = express.Router();

router.get('/health', async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  };

  try {
    // Check database connection
    await checkDatabase();

    // Check external services
    await checkRedis();

    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = error.message;
    res.status(503).json(healthCheck);
  }
});

router.get('/ready', async (req, res) => {
  // Readiness probe - check if app is ready to serve traffic
  try {
    await Promise.all([
      checkDatabase(),
      checkRedis(),
      checkExternalAPIs()
    ]);

    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
});

module.exports = router;
\`\`\`

## 5. Environment Configuration

### Environment Variables Management
\`\`\`bash
# .env.example
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
API_KEY=your-api-key

# Docker environment file
# .env.docker
NODE_ENV=development
DATABASE_URL=postgresql://user:password@db:5432/appdb
REDIS_URL=redis://redis:6379
\`\`\`

### Runtime Configuration
\`\`\`dockerfile
# Use ARG for build-time variables
ARG NODE_ENV=production
ARG BUILD_VERSION

# Use ENV for runtime variables
ENV NODE_ENV=$NODE_ENV
ENV BUILD_VERSION=$BUILD_VERSION

# Don't include secrets in ENV
# Use docker secrets or external secret management
\`\`\`

## 6. Logging and Debugging

### Structured Logging Configuration
\`\`\`javascript
// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'api',
    version: process.env.BUILD_VERSION,
    environment: process.env.NODE_ENV
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

module.exports = logger;
\`\`\`

### Debug Container Setup
\`\`\`dockerfile
# Dockerfile.debug
FROM node:18-alpine
WORKDIR /app

# Install debugging tools
RUN apk add --no-cache \
    curl \
    htop \
    strace \
    tcpdump

# Install nodemon for development
RUN npm install -g nodemon

COPY package*.json ./
RUN npm install

COPY . .

# Expose debug port
EXPOSE 3000 9229

CMD ["nodemon", "--inspect=0.0.0.0:9229", "index.js"]
\`\`\`

## 7. Security Best Practices

### Secret Management
\`\`\`yaml
# docker-compose.yml with secrets
version: '3.8'

services:
  app:
    image: myapp:latest
    secrets:
      - db_password
      - api_key
    environment:
      - DB_PASSWORD_FILE=/run/secrets/db_password
      - API_KEY_FILE=/run/secrets/api_key

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    external: true
\`\`\`

### Network Security
\`\`\`yaml
# Secure network configuration
version: '3.8'

services:
  app:
    networks:
      - frontend
      - backend

  db:
    networks:
      - backend  # Only accessible from backend

  nginx:
    networks:
      - frontend
    ports:
      - "80:80"
      - "443:443"

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No external access
\`\`\`

## 8. Production Deployment

### Production Docker Compose
\`\`\`yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    image: myapp:\\\${VERSION:-latest}
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    volumes:
      - app-logs:/app/logs
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - app-network

volumes:
  app-logs:

networks:
  app-network:
    external: true
\`\`\`

### CI/CD Pipeline Integration
\`\`\`bash
#!/bin/bash
# build-and-deploy.sh

set -e

# Build and tag image
docker build -t myapp:\${VERSION} .
docker tag myapp:\${VERSION} myapp:latest

# Run security scan
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image myapp:\${VERSION}

# Push to registry
docker push myapp:\${VERSION}
docker push myapp:latest

# Deploy to production
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d --remove-orphans

# Health check
sleep 30
curl -f http://localhost/health || exit 1
\`\`\`

## 9. Performance Optimization

### Resource Limits
\`\`\`yaml
# docker-compose.yml with resource limits
version: '3.8'

services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
    ulimits:
      nofile:
        soft: 1024
        hard: 2048
\`\`\`

### Caching Strategies
\`\`\`dockerfile
# Cache npm dependencies globally
FROM node:18-alpine
RUN npm config set cache /tmp/npm-cache
VOLUME ["/tmp/npm-cache"]

# Use BuildKit cache mounts
# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production
\`\`\`

## 10. Monitoring and Observability

### Container Metrics
\`\`\`yaml
# Add monitoring stack
version: '3.8'

services:
  app:
    # ... app configuration
    labels:
      - "prometheus.io/scrape=true"
      - "prometheus.io/port=3000"
      - "prometheus.io/path=/metrics"

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
\`\`\`

## Checklist for Docker Containerization

- [ ] Use multi-stage builds to minimize image size
- [ ] Implement proper layer caching strategies
- [ ] Create non-root user for security
- [ ] Configure .dockerignore for build optimization
- [ ] Add health checks and readiness probes
- [ ] Set up structured logging
- [ ] Implement secret management
- [ ] Configure resource limits and ulimits
- [ ] Use Alpine or distroless base images
- [ ] Set up development docker-compose
- [ ] Configure production deployment
- [ ] Implement container security scanning
- [ ] Add monitoring and observability
- [ ] Document container architecture`
};