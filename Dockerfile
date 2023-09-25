FROM node:18-alpine AS base

# BUILD SERVER
FROM base as build-app

WORKDIR /app/server

COPY ["server/package.json", "server/yarn.lock", "./"]

RUN yarn install

COPY server .

RUN yarn build

# SERVE APP
FROM base as serve-app

WORKDIR /app

COPY --from=build-app /app/server/node_modules server/node_modules
COPY --from=build-app /app/server/package.json server/package.json
COPY --from=build-app /app/server/dist server/dist

WORKDIR server/dist

CMD [ "node", "index.js" ]

EXPOSE 7701
