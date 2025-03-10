# FROM node:18-alpine

# WORKDIR /app

# # Copy package.json and install dependencies
# # COPY package*.json ./
# # COPY package.json package-lock.json ./
# COPY backend/eventServices/package.json backend/eventServices/package-lock.json ./

# # RUN npm ci --production
# RUN npm ci --omit=dev

# # Copy proto files for gRPC
# COPY proto ./proto

# # Copy Redis client configuration
# COPY redis ./redis  

# # Copy entire source code
# COPY . .

# # Build the service
# RUN npm run build

# # Expose the service port
# EXPOSE 3002 50052

# # Start the service
# CMD ["node", "dist/index.js"]



# FROM node:18-alpine
# FROM node:18-slim
FROM node:18

# Install system build tools (Debian)
RUN apt-get update && apt-get install -y python3 make g++

# Navigate to the service directory
WORKDIR /app/backend/eventServices

# Copy package files for the user service
COPY backend/eventServices/package.json backend/eventServices/package-lock.json ./

# Install dependencies
# RUN npm ci --omit=dev
# RUN npm ci 
RUN npm ci --force

# Verify TypeScript installation and set execute permissions
RUN ls -la node_modules/.bin/tsc && chmod +x node_modules/.bin/tsc

# Copy service-specific files (proto, redis, and source code)
# Shared across services
COPY proto /app/proto
# COPY redis /app/redis  
# Copy user-service code              
COPY backend/eventServices/ .                  

# Build the service (outputs to /app/backend/user/dist)
RUN npm run build

# Create symbolic link from dist/proto to root proto directory
# RUN ln -s /app/proto ./dist/proto  && \
#     ln -s /app/redis ./dist/redis

RUN ln -s /app/proto ./dist/proto

# Build using the absolute path to tsc
# RUN ./node_modules/.bin/tsc -p tsconfig.json

# Expose ports
EXPOSE 3002 50052

# Start the service
# CMD ["node", "dist/index.js"]
CMD ["node", "dist/backend/eventServices/index.js"]
