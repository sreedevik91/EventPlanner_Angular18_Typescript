
# Stage 1: Build environment
 
FROM node:18 AS builder 

# Install system build tools (Debian)
RUN apt-get update && apt-get install -y python3 make g++

# Set working directory inside container
WORKDIR /app/apiGateway

# Copy package files first for optimal layer caching

COPY apiGateway/package.json apiGateway/package-lock.json ./

# Install production dependencies (including grpc/proto-loader)

RUN npm ci 

# Verify TypeScript installation and set execute permissions
RUN ls -la node_modules/.bin/tsc && chmod +x node_modules/.bin/tsc

# Copy proto files from root directory

COPY proto /app/proto

# Copy source code
COPY apiGateway/ .

# Build TypeScript to JavaScript
RUN npm run build

# Create a symbolic link:
# /app/apiGateway/dist/proto → /app/proto

RUN ln -s /app/proto ./dist/proto 

# Stage 2: Production environment

FROM node:18

# Set working directory
WORKDIR /app/apiGateway

# Copy built files from builder
COPY --from=builder /app/apiGateway/dist ./dist
COPY --from=builder /app/apiGateway/node_modules ./node_modules

# Copy proto/redis to ROOT directory (not under apiGateway)
COPY --from=builder /app/proto /app/proto

# Expose ports (API and gRPC)
EXPOSE 4000 

# Start the application
CMD ["node", "dist/apiGateway/index.js"]

