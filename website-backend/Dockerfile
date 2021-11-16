# SPDX-License-Identifier: Apache-2.0
FROM node:10-alpine

ENV HOME=/home/node

COPY package.json package-lock.json $HOME/3xr/
RUN chown -R node:node $HOME/*
COPY 3xr_types $HOME/3xr_types
RUN cd $HOME/3xr_types && npm i && npm link && cd ../

WORKDIR $HOME/3xr

RUN npm ci && npm link 3xr_types

USER node

COPY . $HOME/3xr

RUN mkdir $HOME/logs

CMD ["node","app.js"]
