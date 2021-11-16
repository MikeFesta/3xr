#!/usr/bin/env sh
# SPDX-License-Identifier: Apache-2.0

# Load local develompent environment for debugging
ENV_DEVELOPMENT_LOCAL=`head -1 .env.development.local`
VUE_APP_BACKEND_URL="${ENV_DEVELOPMENT_LOCAL#*=}"
echo "Building for Staging: ${VUE_APP_BACKEND_URL}"

# Build the development js files
./node_modules/.bin/vue-cli-service build --mode development --dest dist/ --target app --modern

