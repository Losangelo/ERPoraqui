FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

WORKDIR /app

COPY package.json yarn.lock ./
COPY turbo.json tsconfig.json ./
COPY apps/web/package.json apps/web/
COPY packages/ packages/

RUN yarn install --frozen-lockfile

COPY apps/web/ apps/web/

ENV VITE_API_URL=/api/v1
RUN yarn --cwd apps/web tsc; yarn --cwd apps/web vite build

FROM nginx:stable-alpine AS runner

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
