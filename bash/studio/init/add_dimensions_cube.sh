#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

# Get arguments
product_uid=$(xrs_get_required_argument "i" "$@")
if [ $? -ne 0 ]; then exit $?; fi
unit_type=$(xrs_get_required_argument "u" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
width=$(xrs_get_required_argument "w" "$@")
if [ $? -ne 0 ]; then exit $?; fi
depth=$(xrs_get_required_argument "h" "$@")
if [ $? -ne 0 ]; then exit $?; fi
height=$(xrs_get_required_argument "d" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Adding Cube with Dims: ${width} ${depth} ${height} in ${unit_type}"
logs_dir=${PRODUCTS_DIR}/${product_uid}/logs

/3xr/programs/Blender290/blender290 \
  --background \
  --python-exit-code 1 \
  -noaudio \
  ${PRODUCTS_DIR}/${product_uid}/blender/${name}.blend \
  --python \
  "${BLENDER_3XR_DIR}/init/add_dimensions_cube.py" \
  -- ${unit_type} ${width} ${depth} ${height} \
  2>&1 | tee -a ${logs_dir}/cube.log
