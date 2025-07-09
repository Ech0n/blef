FROM node:20-alpine AS builder

WORKDIR /app/client

ARG API_URL
ENV VITE_API_URL=$API_URL

COPY client/package*.json ./
COPY client/vite.config.* ./
COPY client/tsconfig*.json ./
COPY client/svelte.config.* ./
COPY client/src ./src
COPY client/public ./public
COPY client/index.html ./
COPY common /app/common

RUN npm install

RUN npm run build

FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/public /usr/share/nginx/html

COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]