#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
filename=$(xrs_get_required_argument "f" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
phi=$(xrs_get_required_argument "p" "$@")
if [ $? -ne 0 ]; then exit $?; fi
radius=$(xrs_get_required_argument "r" "$@")
if [ $? -ne 0 ]; then exit $?; fi
theta=$(xrs_get_required_argument "t" "$@")
if [ $? -ne 0 ]; then exit $?; fi
line_draw_on=$(xrs_get_required_argument "l" "$@")
if [ $? -ne 0 ]; then exit $?; fi
xrs_log_info "Rendering Image from angle ${theta}, ${phi}, ${radius} for asset_uid ${asset_uid} - ${name} to ${filename}"

/3xr/programs/Blender281_xrs/blender281_xrs \
  --background \
  --python-exit-code 1 \
  -noaudio \
  ${RESOURCES_DIR}/blender/photo_studio_template.blend \
  --python \
  "${BLENDER_3XR_DIR}/render/image_from_angle.py" \
  -- ${ASSETS_DIR}/${asset_uid}/final/ \
  ${name} \
  ${filename} \
  ${theta} \
  ${phi} \
  ${radius} \
  ${line_draw_on} 1> /dev/null
if [ $? -ne 0 ]; then
  xrs_log_error "Blender failed to render image from angle"
  exit 1;
fi

xrs_log_info "Done"

# Upload the file to the cdn
${BASH_3XR_DIR}/studio/publish/asset.sh -u ${asset_uid}
