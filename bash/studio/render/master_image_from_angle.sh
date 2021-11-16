#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

# Depricated - was used to process submission renders
# Needs rename

# Get arguments
asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
phi=$(xrs_get_required_argument "p" "$@")
if [ $? -ne 0 ]; then exit $?; fi
radius=$(xrs_get_required_argument "r" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_id=$(xrs_get_required_argument "s" "$@")
if [ $? -ne 0 ]; then exit $?; fi
theta=$(xrs_get_required_argument "t" "$@")
if [ $? -ne 0 ]; then exit $?; fi
xrs_log_info "Rendering Master Image from angle ${theta}, ${phi}, ${radius} for asset_uid ${asset_uid}, submissibn number ${submission_number}"

# Render Master Images
/3xr/programs/Blender281_xrs/blender281_xrs \
  --background \
  --python-exit-code 1 \
  -noaudio \
  ${RESOURCES_DIR}/blender/photo_studio_template.blend \
  --python \
  "${BLENDER_3XR_DIR}/render/master_image_from_angle.py" \
  -- ${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/ \
  ${name} \
  ${submission_id} \
  ${theta} \
  ${phi} \
  ${radius}
if [ $? -ne 0 ]; then
  xrs_log_error "Blender failed to render master images"
  exit 1;
fi
