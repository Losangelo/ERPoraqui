FROM node:20-slim

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/worker/package.json apps/worker/
COPY apps/worker/tsconfig.json apps/worker/

RUN yarn install --frozen-lockfile

COPY apps/worker/ apps/worker/

ENV NODE_ENV=production

WORKDIR /app/apps/worker

CMD ["npx", "tsx", "src/index.ts"]
