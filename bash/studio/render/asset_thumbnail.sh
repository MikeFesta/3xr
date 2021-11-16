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
xrs_log_info "Rendering Asset Thumbnail: asset_uid ${asset_uid}, submission number ${submission_number}"

# Render Thumbnail
/3xr/programs/Blender281_xrs/blender281_xrs \
  --background \
  --python-exit-code 1 \
  -noaudio \
  ${RESOURCES_DIR}/blender/photo_studio_template.blend \
  --python \
  "${BLENDER_3XR_DIR}/render/asset_thumbnail.py" \
  -- ${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/ ${name}
if [ $? -ne 0 ]; then
  xrs_log_error "Blender failed to render asset thumbnail"
  exit 1;
fi
