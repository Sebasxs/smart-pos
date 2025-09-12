FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN if [ -z "$VITE_API_URL" ]; then echo "ERROR: VITE_API_URL no está definida"; exit 1; fi

COPY package.json pnpm-lock.yaml* package-lock.json* ./
RUN pnpm i -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]