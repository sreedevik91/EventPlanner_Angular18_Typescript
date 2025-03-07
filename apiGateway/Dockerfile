
# Stage 1: Build environment
FROM node:18-alpine AS builder

# Set working directory inside container
WORKDIR /app

# 1. Copy package files first for optimal layer caching
# COPY package*.json ./
COPY apiGateway/package.json apiGateway/package-lock.json ./

# 2. Install production dependencies (including grpc/proto-loader)
# RUN npm ci --production
RUN npm ci --omit=dev

# 3. Copy proto files from root directory
# COPY ../proto ./proto
COPY proto/ ./proto

# 4. Copy Redis client configuration
COPY redis ./redis  

# 5. Copy source code
COPY . .

# 6. Build TypeScript to JavaScript
RUN npm run build

# Stage 2: Production environment
FROM node:18-alpine

# Set working directory
WORKDIR /app

# 7. Copy built files from builder
COPY --from=builder /app/apiGateway/dist ./dist
COPY --from=builder /app/apiGateway/node_modules ./node_modules
COPY --from=builder /app/proto ./proto
COPY --from=builder /app/redis ./redis 

# 8. Expose ports (API and gRPC)
EXPOSE 4000 

# 9. Start the application
CMD ["node", "dist/index.js"]

