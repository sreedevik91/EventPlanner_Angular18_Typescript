
# Step 1: Build the Angular app
FROM node:18 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --prod  

# Step 2: Serve with Nginx
FROM nginx:alpine AS production-stage
COPY --from=build-stage /app/dist/frontend /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
