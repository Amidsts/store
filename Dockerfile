FROM node:alpine
WORKDIR /usr/src/index
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]