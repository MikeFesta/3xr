#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi

name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi


xrs_log_info "Creating QR Code for Asset ${name} ${asset_uid}"
path="${ASSETS_DIR}/${asset_uid}/final/"

# Legacy assets might not have a folder in assets, so create it
mkdir -p ${path}
#qr-${name}"
xrs_log_info "Saving to ${path}"

# Create the basic QR code for https://qr.3xr.com/{uid}
python3 ${PYTHON_DIR}/generate/qr_for_asset.py ${asset_uid} ${path} ${name}

# python code creates 4 files (png/svg), (black/blue)
# ${path}/qr-${name}.png # black squares
# ${path}/qr-${name}.svg # black squares
# ${path}/qr_${name}.png # blue squares
# ${path}/qr_${name}.svg # blue squares

# Output should be 6 files
# 1. PNG, black and white, 369x369
original_png="${path}qr_${name}.png"

# 2. SVG, black and white, vector
original_svg="${path}qr_${name}.svg"

# 3. JPG, black and white, 369x369
original_jpg="${path}qr_${name}.jpg"
convert ${original_png} ${original_jpg}

# 4. SVG, blue squares, 3xr background, 600x600
branded_png="${path}qr-${name}.png"
convert ${branded_png} -transparent white ${branded_png}
# Overlay the qr on the background cube
composite -geometry +48+140 ${branded_png} ${RESOURCES_DIR}/qr/qr-cube.png ${branded_png}

# 5. qr-${name}.svg  // vector, blue squares, 3XR Branding
branded_svg="${path}qr-${name}.svg"
# Skipping the logo background for now, as we don't have this resource is a vector format (it was rendeded in blender)
# This file still exists with blue squares

# 6. qr-${name}.jpg  // 600x600, blue squares, 3XR Branding
branded_jpg="${path}qr-${name}.jpg"
convert -background white -flatten ${branded_png} ${branded_jpg}

# Create a zip of these assets
zip_src="${path}qr-${name}.zip"
zip -j "${zip_src}" "${original_png}"
zip -j "${zip_src}" "${original_svg}"
zip -j "${zip_src}" "${original_jpg}"
zip -j "${zip_src}" "${branded_png}"
zip -j "${zip_src}" "${branded_svg}"
zip -j "${zip_src}" "${branded_jpg}"

# Upload the files by running the publish asset script, which will upload any untracked files, including these
${BASH_3XR_DIR}/studio/publish/asset.sh -u ${asset_uid}
