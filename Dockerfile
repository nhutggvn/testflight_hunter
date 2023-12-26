FROM node:18.18.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "./testflight_watcher.js" ]