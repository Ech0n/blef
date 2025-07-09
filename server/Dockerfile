
FROM node:18-alpine AS builder

ARG CLIENT_URL
ENV FRONTEND_URL=$CLIENT_URL
ENV PORT=80

WORKDIR /app/server

COPY server/package.json package-lock.json* ./
RUN npm install

COPY server/tsconfig.json ./
COPY server/src ./src
COPY server/config.ts ./
COPY common /app/common
RUN npm run build

FROM node:18-alpine

ENV NODE_ENV=production

ARG CLIENT_URL
ENV FRONTEND_URL=$CLIENT_URL

WORKDIR /app
COPY --from=builder /app/server/dist ./dist
COPY server/package.json ./

RUN npm install --omit=dev

EXPOSE 80

CMD ["node", "dist/server/src/index.js"]
