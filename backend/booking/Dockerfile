FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy proto files for gRPC
COPY proto ./proto

# Copy Redis client configuration
COPY redis ./redis  

# Copy entire source code
COPY . .

# Build the service
RUN npm run build

# Expose the service port
EXPOSE 3004

# Start the service
CMD ["node", "dist/index.js"]
