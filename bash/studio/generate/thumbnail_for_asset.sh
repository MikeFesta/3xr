#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi

name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Creating Thumbnail for Asset ${name} ${asset_uid}"

# Note: 1920x1920 is required for Nestle Microsoft teams hub
# TODO: Save this file type seperately to keep it out of the image tray

src="${ASSETS_DIR}/${asset_uid}/final/${name}-front-2k.png"
thumbnail="${ASSETS_DIR}/${asset_uid}/final/${name}-thumbnail-1920.jpg"
convert -size 2048x2048 xc:white "${thumbnail}"
composite "${src}" "${thumbnail}" "${thumbnail}"
composite "${RESOURCES_DIR}/thumbnail/2k-overlay.png" "${thumbnail}" "${thumbnail}"
convert "${thumbnail}" -crop 1920x1920+64+64 "${thumbnail}"
#TODO: add other file sizes (2k, 1k, 512)
