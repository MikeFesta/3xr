# SPDX-License-Identifier: Apache-2.0
FROM node:10-alpine

ENV HOME=/home/node

RUN apk --no-cache add zip
RUN mkdir -p /home/www/3xr.com/app/models
RUN mkdir $HOME/3xr
RUN chown -R node:node $HOME/*
RUN addgroup -g 992 vboxsf
RUN addgroup node vboxsf

USER node
WORKDIR $HOME/3xr

COPY package.json npm-shrinkwrap.json $HOME/3xr/
RUN npm ci

USER root
RUN chown -R node:node $HOME/*
USER node

CMD ["node","app.js"]
