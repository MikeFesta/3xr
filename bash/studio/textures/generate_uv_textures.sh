#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_id=$(xrs_get_required_argument "s" "$@")
if [ $? -ne 0 ]; then exit $?; fi
xrs_log_info "Generating Asset UV Image: asset_uid ${asset_uid}, submission number ${submission_number}"

# Render Thumbnail
/3xr/programs/Blender278/blender278 \
  --background \
  --python-exit-code 1 \
  -noaudio \
  ${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/${name}.blend \
  --python \
  "${BLENDER_3XR_DIR}/textures/generate_uv_textures.py" \
  -- ${name} \
  ${submission_id}
if [ $? -ne 0 ]; then
  xrs_log_error "Blender failed to generate uv textures"
  exit 1;
fi
