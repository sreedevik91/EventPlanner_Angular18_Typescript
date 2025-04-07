
# Step 1: Build the Angular app

FROM node:18 AS build-stage
 # Install build tools
RUN apt-get update && apt-get install -y python3 make g++ 
WORKDIR /app/frontend
# COPY package*.json ./
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
RUN npm install -g typescript @angular/cli@18.2.2

ENV PATH="/app/frontend/node_modules/.bin:/usr/local/lib/node_modules/.bin:$PATH"

COPY frontend/ .
# RUN npm run build --prod 
##################################
# # Ensure production build 
# RUN npm run build -- --configuration production  

# # Verify build output (debugging)
# RUN ls -la /app/frontend/dist/
#######################
# RUN ng build -- --configuration production --verbose || { \
#   echo "Build failed, dumping logs:"; \
#   cat /app/frontend/dist/out-tsc/log.txt 2>/dev/null || echo "No build log found"; \
#   exit 1; \
# }
# RUN ls -la dist/browser || { echo "Build output directory is empty"; exit 1; }
########################
RUN ng build --configuration production --verbose || { \
  echo "Build failed, dumping logs:"; \
  find /app/frontend -name "*.log"-o -name "*.error" -exec cat {} \; 2>/dev/null || echo "No build logs found"; \
  exit 1; \
}
RUN ls -la dist/browser || { echo "Build output directory is empty"; exit 1; }

# Step 2: Serve with Nginx
FROM nginx:alpine AS production-stage

# Fix permissions for Nginx (runs as user "nginx")
# RUN chown -R nginx:nginx /usr/share/nginx/html
COPY --from=build-stage --chown=nginx:nginx /app/frontend/dist/browser /usr/share/nginx/html

# COPY --from=build-stage /app/frontend/dist/browser /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/nginx.conf

# COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
