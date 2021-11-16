#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Export a .fbx file for general use                                           #
################################################################################
source $(dirname $0)/../../xrs.sh

asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Exporting FBX (.fbx) for ${asset_uid}, submission number ${submission_number}"

source_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"
textures_dir="${source_dir}generated/"
fbx_dir="${source_dir}${name}_fbx/"
mkdir ${fbx_dir}

/3xr/programs/Blender290/blender290 \
  --background \
  --python-exit-code 1 \
  -noaudio "${source_dir}${name}.blend" \
  --python "${BLENDER_3XR_DIR}/export/fbx_for_submission.py" \
  -- "${textures_dir}" "${fbx_dir}" "${name}"

exit_status=$?
if [ "${exit_status}" -ne 0 ]
then
  xrs_log_error "Blender exited with non-zero exit code: ${exit_status}"
  exit 1
fi

# Bundle the files into a zip
cd ${source_dir}
zip -r --exclude=*.blend* --exclude=*@eaDir* ${name}_fbx.zip ${name}_fbx/
