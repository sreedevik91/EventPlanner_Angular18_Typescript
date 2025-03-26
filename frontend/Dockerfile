
# Step 1: Build the Angular app

FROM node:18 AS build-stage
WORKDIR /app/frontend
# COPY package*.json ./
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
# RUN npm run build --prod 

# Ensure production build 
RUN npm run build -- --configuration production  

# Step 2: Serve with Nginx
FROM nginx:alpine AS production-stage

# Fix permissions for Nginx (runs as user "nginx")
RUN chown -R nginx:nginx /usr/share/nginx/html
COPY --from=build-stage --chown=nginx:nginx /app/frontend/dist/browser /usr/share/nginx/html

# COPY --from=build-stage /app/frontend/dist/browser /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
