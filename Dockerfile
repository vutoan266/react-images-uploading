FROM node:14-alpine3.10

ENV NODE_VERSION 14.9.0

WORKDIR /app

# Add package.json before rest of repo for caching
COPY package.json /app/
COPY package-lock.json /app/

RUN npm ci

COPY . /app

EXPOSE 8080

# start app
CMD ["npm", "start"]
