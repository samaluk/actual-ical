ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine as builder
WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

FROM node:${NODE_VERSION}-alpine as runner
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json .
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
CMD ["node", "dist/bin/server.js"]
