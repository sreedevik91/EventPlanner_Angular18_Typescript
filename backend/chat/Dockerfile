
FROM node:18

# Install system build tools (Debian)
RUN apt-get update && apt-get install -y python3 make g++

USER root

# Navigate to the service directory
WORKDIR /app/backend/chat

# Copy package files for the user service
COPY backend/chat/package.json backend/chat/package-lock.json ./

# Install dependencies
RUN npm ci --force
# Ensure global TypeScript
RUN npm install -g typescript 

# Verify TypeScript installation and set execute permissions
RUN ls -la node_modules/.bin/tsc && chmod +x node_modules/.bin/tsc

# Update PATH to include local node_modules/.bin
ENV PATH="/app/backend/chat/node_modules/.bin:/usr/local/lib/node_modules/.bin:$PATH"

# Copy service-specific files (proto, redis, and source code)
# Shared across services
COPY proto /app/proto                 

COPY backend/chat/ .                  

# Build the service (outputs to /app/backend/user/dist)
RUN npm run build

# Create symbolic link from dist/proto to root proto directory

RUN ln -s /app/proto ./dist/proto 

# Expose ports
EXPOSE 3005

# Start the service
CMD ["node", "dist/backend/chat/index.js"]

