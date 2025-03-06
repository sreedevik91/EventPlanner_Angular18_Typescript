FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
# COPY package*.json ./
# COPY package.json package-lock.json ./
COPY backend/eventServices/package.json backend/eventServices/package-lock.json ./

# RUN npm ci --production
RUN npm ci --omit=dev

# Copy proto files for gRPC
COPY proto ./proto

# Copy Redis client configuration
COPY redis ./redis  

# Copy entire source code
COPY . .

# Build the service
RUN npm run build

# Expose the service port
EXPOSE 3002 50052

# Start the service
CMD ["node", "dist/index.js"]
