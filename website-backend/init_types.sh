#!/usr/bin/env bash
# SPDX-License-Identifier: Apache-2.0
cd ./3xr_types && npm i && sudo chown -R $USER node_modules/ && sudo npm link && cd ../ && sudo npm link 3xr_types