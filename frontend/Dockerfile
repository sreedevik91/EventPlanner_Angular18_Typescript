FROM node:alpine AS build

WORKDIR /app
# WORKDIR /usr/src/app/frontend

COPY package*.json .

RUN npm ci

RUN npm install -g @angular/cli

COPY . .

RUN npm run build --configuration=production

FROM nginx:latest

COPY --from=build /app/dist/frontend /usr/share/nginx/html  
# (if WORKDIR is /app)
# COPY --from=build /usr/src/app/frontend/dist/frontend/browser /usr/share/nginx/html

EXPOSE 4200

CMD ["nginx","-g","daemon off;"]