# This image has no known vulnerabilities
# https://hub.docker.com/layers/library/node/22.15.0-alpine/images/sha256-5ef237d055ac3c076f47eda1310f2214eb23c30a53aecdc20c35fd17780fa4ee
FROM node:22.15.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "dev" ]