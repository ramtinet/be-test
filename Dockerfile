# Install base image
FROM node:16.13.2 AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN rm -f .npmrc package-lock.json

# Build stuff
FROM dependencies AS build

WORKDIR /app

COPY tsconfig.json tsconfig.base.json ./
COPY config ./config
COPY src ./src
COPY packages ./packages

RUN npm run build

#Remove App files
RUN rm tsconfig.base.json tsconfig.json && rm -rf src test coverage

#Remove packages files
WORKDIR /app/packages/redis 
RUN rm tsconfig.tsbuildinfo tsconfig.json && rm -rf src

FROM node:16.13.2-alpine3.14

WORKDIR /app

COPY --from=build /app /app

CMD ["node", "-r", "source-map-support/register", "./dist/index.js"]