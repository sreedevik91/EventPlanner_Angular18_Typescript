FROM node:18-alpine

WORKDIR /app

# Copy shared protos
COPY ../proto/ ./proto/shared/

# Copy service-specific protos
COPY ../services/booking/proto/ ./proto/apiGateway/

# Install dependencies
COPY package*.json ./
RUN npm ci --production

# Build TypeScript
COPY . .
RUN npm run build

# Expose ports
# API Gateway port
EXPOSE 4000 
# gRPC port
EXPOSE 50051 

CMD ["npm", "start"]