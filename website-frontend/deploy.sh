#!/bin/bash
# SPDX-License-Identifier: Apache-2.0

# Get the current commit hash
hash=`git rev-parse HEAD`

# Build the production js files
./node_modules/.bin/vue-cli-service build --mode production --dest ../3xr_frontend_prod/dist --target app --modern

# TODO: confirm that the build passed

# Commit the production files
cd ../3xr_frontend_prod
git add .
git commit -m "${hash}"
git push origin master
