FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY server/package.json ./server/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter server run build
RUN pnpm --filter server --prod deploy pruned

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/pruned .
COPY --from=builder /app/server/dist ./dist

EXPOSE 8080

CMD ["node", "dist/index.js"]