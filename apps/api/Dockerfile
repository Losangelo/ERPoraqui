FROM node:20-slim

RUN apt-get update -qq && apt-get install -y -qq openssl && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

WORKDIR /app

COPY package.json yarn.lock ./
COPY turbo.json tsconfig.json ./
COPY apps/api/package.json apps/api/
COPY apps/api/prisma apps/api/prisma/
COPY packages/ packages/

RUN yarn install --frozen-lockfile

RUN yarn --cwd apps/api prisma:generate

COPY apps/api/ apps/api/

ENV NODE_ENV=production

EXPOSE 3002

WORKDIR /app/apps/api
CMD ["npx", "tsx", "src/main.ts"]
