
FROM node:18

# Install system build tools (Debian)
RUN apt-get update && apt-get install -y python3 make g++

# Navigate to the service directory
WORKDIR /app/backend/wallet

# Copy package files for the user service
COPY backend/wallet/package.json backend/wallet/package-lock.json ./

# Install dependencies
RUN npm ci --force

# Verify TypeScript installation and set execute permissions
RUN ls -la node_modules/.bin/tsc && chmod +x node_modules/.bin/tsc

# Copy service-specific files (proto, redis, and source code)
# Shared across services
COPY proto /app/proto                 
# Copy user-service code              
COPY backend/wallet/ .                  

# Build the service (outputs to /app/backend/user/dist)
RUN npm run build

# Create symbolic link from dist/proto to root proto directory

RUN ln -s /app/proto ./dist/proto 

# Expose ports
EXPOSE 3006 50054

# Start the service
CMD ["node", "dist/backend/wallet/index.js"]
