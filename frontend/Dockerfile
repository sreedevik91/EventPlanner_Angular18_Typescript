
# Step 1: Build the Angular app
# FROM node:18 AS build-stage
# FROM node:18-slim AS build-stage
FROM node:18 AS build-stage
WORKDIR /app/frontend
# COPY package*.json ./
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build --prod  

# Step 2: Serve with Nginx
FROM nginx:alpine AS production-stage
COPY --from=build-stage /app/frontend/dist /usr/share/nginx/html
# COPY --from=build-stage /app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
