
# Stage 1: Build environment
# FROM node:18-alpine AS builder

# Use Debian-based image
# FROM node:18-slim AS builder  
FROM node:18 AS builder 

# Install system build tools (Debian)
RUN apt-get update && apt-get install -y python3 make g++

# Set working directory inside container
WORKDIR /app/apiGateway

# 1. Copy package files first for optimal layer caching
# COPY package*.json ./
COPY apiGateway/package.json apiGateway/package-lock.json ./

# 2. Install production dependencies (including grpc/proto-loader)
# RUN npm ci --production
# RUN npm ci --omit=dev
RUN npm ci 
# RUN npm ci --force

# Verify TypeScript installation and set execute permissions
RUN ls -la node_modules/.bin/tsc && chmod +x node_modules/.bin/tsc

# 3. Copy proto files from root directory
# COPY ../proto ./proto
COPY proto /app/proto

# 4. Copy Redis client configuration
COPY redis /app/redis

# Create symbolic links inside the service directory
# RUN ln -s /app/proto ./proto && \
#     ln -s /app/redis ./redis

# 5. Copy source code
COPY apiGateway/ .

# 6. Build TypeScript to JavaScript
RUN npm run build

# Create a symbolic link:
# /app/apiGateway/dist/proto → /app/proto
RUN ln -s /app/proto ./dist/proto  && \
    ln -s /app/redis ./dist/redis

# Build using the absolute path to tsc
# RUN ./node_modules/.bin/tsc -p tsconfig.json

# Stage 2: Production environment
# FROM node:18-alpine
# FROM node:18-slim
FROM node:18

# Set working directory
WORKDIR /app/apiGateway

# 7. Copy built files from builder
COPY --from=builder /app/apiGateway/dist ./dist
COPY --from=builder /app/apiGateway/node_modules ./node_modules

# 8. Copy proto/redis to ROOT directory (not under apiGateway)
COPY --from=builder /app/proto /app/proto
COPY --from=builder /app/redis /app/redis

# 9. Expose ports (API and gRPC)
EXPOSE 4000 

# 10. Start the application
# CMD ["node", "dist/index.js"]
CMD ["node", "dist/apiGateway/index.js"]

