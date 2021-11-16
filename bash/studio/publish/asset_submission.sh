#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Push asset files to cdn.3xr.com
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
asset_uid=$(xrs_get_required_argument "u" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_print_status_message "Publishing ${name} to cdn.3xr.com"
final_dir="${ASSETS_DIR}/${asset_uid}/final/"
submission_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}"
# Confirm that the directory exists
if [ ! -d "${submission_dir}" ];
then
  xrs_print_error_message "Folder ${submission_dir} Not Found."
  exit 1
fi

# Copy assets to the final directory
mkdir -p "${final_dir}"

# Renders (2k pngs)
# Note: this order impacts the order displayed on the final asset page
cp "${submission_dir}/${name}-2k.png" "${final_dir}" 2>/dev/null
cp "${submission_dir}/${name}-front-2k.png" "${final_dir}" 2>/dev/null
cp "${submission_dir}/${name}-left-2k.png" "${final_dir}" 2>/dev/null
cp "${submission_dir}/${name}-right-2k.png" "${final_dir}" 2>/dev/null
cp "${submission_dir}/${name}-back-2k.png" "${final_dir}" 2>/dev/null
cp "${submission_dir}/${name}-top-2k.png" "${final_dir}" 2>/dev/null
zip "${name}-orthographic.zip" "${submission_dir}/${name}-2k.png"
zip "${name}-orthographic.zip" "${submission_dir}/${name}-front-2k.png"
zip "${name}-orthographic.zip" "${submission_dir}/${name}-left-2k.png"
zip "${name}-orthographic.zip" "${submission_dir}/${name}-right-2k.png"
zip "${name}-orthographic.zip" "${submission_dir}/${name}-back-2k.png"
zip "${name}-orthographic.zip" "${submission_dir}/${name}-top-2k.png"
mv "${name}-orthographic.zip" "${final_dir}" 2>/dev/null

# 3D Files
# TODO: Ensure the .blend has external textures packed in
cp "${submission_dir}/${name}.glb" "${final_dir}" 2>/dev/null
cp "${submission_dir}/${name}.usdz" "${final_dir}" 2>/dev/null
cp "${submission_dir}/${name}.blend" "${final_dir}" 2>/dev/null
cp "${submission_dir}/*.zip" "${final_dir}" 2>/dev/null

xrs_print_status_message "Files copied for ${name} to final dir"

# Generate the QR code for the asset
${BASH_3XR_DIR}/studio/generate/qr_for_asset.sh \
  -a ${asset_uid} \
  -n ${name}

# Create a Thumbnail
${BASH_3XR_DIR}/studio/generate/thumbnail_for_asset.sh \
  -a ${asset_uid} \
  -n ${name}

# Call another script to upload to cdn.3xr.com
${BASH_3XR_DIR}/studio/publish/asset.sh -u ${asset_uid}
