FROM node:20-alpine AS base

# DEPENDENCIES
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY server/package.json ./
RUN pnpm install --ignore-scripts

# BUILDER
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules node_modules
COPY server .

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm build

# RUNNER
FROM base AS runner

COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/dist dist

WORKDIR /dist

CMD [ "node", "index.js" ]

EXPOSE 7701
