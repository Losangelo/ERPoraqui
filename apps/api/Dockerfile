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
COPY apps/api/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/api/v1/health',r=>{process.exit(r.statusCode===200?0:1)}).on('error',()=>process.exit(1))"

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npx", "tsx", "src/main.ts"]
