#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Export a .glb file with 4K textures                                          #
################################################################################
source $(dirname $0)/../../xrs.sh

asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Exporting 4K glb for ${asset_uid}, submission number ${submission_number}"

source_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"
textures_dir="${source_dir}generated/"

/3xr/programs/Blender290/blender290 \
  --background \
  --python-exit-code 1 \
  -noaudio "${source_dir}${name}.blend" \
  --python "${BLENDER_3XR_DIR}/export/glb_4k.py" \
  -- true

exit_status=$?
if [ "${exit_status}" -ne 0 ]
then
  xrs_log_error "Blender exited with non-zero exit code: ${exit_status}"
  exit 1
fi

glb_files=$(ls -lh "${source_dir}"*glb)
xrs_log_info "${glb_files[@]}"
