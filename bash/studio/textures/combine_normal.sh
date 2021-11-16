#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Combine two normal maps to make a new one using blender nodes                #
# https://blendswap.com/blend/13735                                            #
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
base_texture=$(xrs_get_required_argument "b" "$@")
if [ $? -ne 0 ]; then exit $?; fi
detail_texture=$(xrs_get_required_argument "d" "$@")
if [ $? -ne 0 ]; then exit $?; fi
output_dir=$(xrs_get_required_argument "o" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Combining normal maps ${base_texture} with ${detail_texture}"

if [ ! -f "${base_texture}" ]
then
  xrs_log_error "File not found - ${base_texture}"
  exit 1
fi

if [ ! -f "${detail_texture}" ]
then
  xrs_log_error "File not found - ${detail_texture}"
  exit 1
fi

# copy the blend file for now to save and finish manually

/3xr/programs/Blender290/blender290 \
  --background \
  --python-exit-code 1 \
  -noaudio \
  "${RESOURCES_DIR}/blender/combine_normalmaps.blend" \
  --python \
  "${BLENDER_3XR_DIR}/textures/combine_normals.py" \
  -- \
  "${base_texture}" \
  "${detail_texture}" \
  "${output_dir}"

xrs_log_info "Done - Saved to ${output_dir}"

exit 0
