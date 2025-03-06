FROM node:18-alpine

WORKDIR /app

# Install required system dependencies for bcrypt
RUN apk add --no-cache python3 make g++ 

# Copy package.json and install dependencies
# COPY package*.json ./
# COPY package.json package-lock.json ./
COPY backend/user/package.json backend/user/package-lock.json ./

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
EXPOSE 3001 50051

# Start the service
CMD ["node", "dist/index.js"]
