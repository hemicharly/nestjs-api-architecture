# Builder application
FROM public.ecr.aws/docker/library/node:22.12.0-slim as builder

WORKDIR /usr

COPY app/package.json app/yarn.lock ./
RUN yarn install

COPY app .
RUN yarn build


# Deploy application
FROM public.ecr.aws/docker/library/node:22.12.0-slim as app
ENV TZ "America/Fortaleza"
ENV NODE_ENV "production"

RUN apt-get update && apt-get install -y procps &&\
    apt-get clean && rm -rf /var/cache/apt/lists && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN chown node:node /app

USER node

COPY --chown=node:node --from=builder /usr/yarn.lock /app/yarn.lock
COPY --chown=node:node --from=builder /usr/package.json /app/package.json
RUN yarn install --production

COPY --chown=node:node --from=builder /usr/dist /app/dist

EXPOSE 3000

CMD ["node", "dist/main"]