#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Export a .glb file for use on the zappar platform                            #
################################################################################
source $(dirname $0)/../../xrs.sh

asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Exporting GLTF (.glb) for ${asset_uid}, submission number ${submission_number}"

source_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"
textures_dir="${source_dir}generated/"

# Create ORM textures for Zappar to lessen the amount of textures & resize for use
${BASH_3XR_DIR}/studio/textures/generate_orm.sh -a ${asset_uid} -c ${submission_number}
${BASH_3XR_DIR}/studio/textures/resize.sh -a ${asset_uid} -c ${submission_number}

# Create a GLB with an ORM texture
/3xr/programs/Blender290/blender290 \
  --background \
  --python-exit-code 1 \
  -noaudio "${source_dir}${name}.blend" \
  --python "${BLENDER_3XR_DIR}/export/glb_for_submission_orm.py" \
  -- "${textures_dir}"

exit_status=$?
if [ "${exit_status}" -ne 0 ]
then
  xrs_log_error "Blender exited with non-zero exit code: ${exit_status}"
  exit 1
fi

glb_files=$(ls -lh "${source_dir}"*glb)
xrs_log_info "${glb_files[@]}"

size=$(stat -c%s "${source_dir}${name}.glb")

if [ "${size}" > 10000000 ]
then
  xrs_log_info "Exporting Zappar GLTF (.glb) for ${asset_uid}, submission number ${submission_number}"
  /3xr/programs/Blender290/blender290 \
  --background \
  --python-exit-code 1 \
  -noaudio "${source_dir}glb_test.blend" \
  --python "${BLENDER_3XR_DIR}/export/glb_for_zappar.py" \
  -- "${textures_dir}"
fi

glb_files=$(ls -lh "${source_dir}"*glb)
xrs_log_info "${glb_files[@]}"
