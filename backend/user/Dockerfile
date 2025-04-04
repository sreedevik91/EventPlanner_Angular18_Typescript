
FROM node:18-slim

# Install system build tools (Debian)
RUN apt-get update && apt-get install -y python3 make g++

USER root

# Navigate to the service directory
WORKDIR /app/backend/user

# Install build tools for bcrypt

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files for the user service
COPY backend/user/package.json backend/user/package-lock.json ./

# Install dependencies
 
RUN npm ci --force

# Verify TypeScript installation and set execute permissions
RUN ls -la node_modules/.bin/tsc && chmod +x node_modules/.bin/tsc

# Copy service-specific files (proto, redis, and source code)
# Shared across services
COPY proto /app/proto     

# Copy user-service code              
COPY backend/user/ .                  

# Build the service (outputs to /app/backend/user/dist)
RUN npm run build

# Create symbolic link from dist/proto to root proto directory

RUN ln -s /app/proto ./dist/proto

# Expose ports
EXPOSE 3001 50051

# Start the service
CMD ["node", "dist/backend/user/index.js"]
