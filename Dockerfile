FROM node:12.21.0-alpine3.10

WORKDIR /app
COPY package.json /app
RUN yarn install
RUN yarn global add @nestjs/cli
RUN yarn build

COPY dist/ /app/

CMD node main.js

EXPOSE 3000
