FROM node:14-alpine3.10

ENV NODE_VERSION 14.9.0

# Add package.json before rest of repo for caching
ADD package.json /app/

WORKDIR /app

RUN npm install --silent

ADD . /app

# start app
CMD ["npm", "start"]
