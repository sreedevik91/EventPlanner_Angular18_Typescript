FROM node:alpine

WORKDIR /usr/src/app/user

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 3001

CMD ["npm" , "start"]