FROM node:alpine
WORKDIR /usr/src/index
COPY package*.json .
RUN npm ci
COPY . .
EXPOSE 6000
RUN npm run build
CMD ["npm", "start"]
# CMD ["npm", "run",  "start:dev"]