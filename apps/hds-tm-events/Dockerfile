FROM node:22-alpine AS build
WORKDIR /app

RUN npm i -g bun@1

COPY package.json .
COPY bun.lock .
RUN bun install --frozen-lockfile

COPY ./*.json .
COPY ./src ./src/
RUN bun run build

FROM nginx:stable-alpine-slim

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/app/browser /usr/share/nginx/html/
