#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

# Get arguments
part_name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
part_uid=$(xrs_get_required_argument "u" "$@")
if [ $? -ne 0 ]; then exit $?; fi

part_dir="${PARTS_DIR}/${part_uid}"
part_blend_file="${part_dir}/blender/${part_name}.blend"

# Rename the internal part and remove packed images
/3xr/programs/Blender290/blender290 \
  --background \
  --python-exit-code 1 \
  -noaudio \
  ${part_blend_file} \
  --python \
  "${BLENDER_3XR_DIR}/init/part.py" \
  -- \
  ${part_uid} \
  true \
  true \
  2>&1 | tee -a ${part_dir}/logs/init.log
