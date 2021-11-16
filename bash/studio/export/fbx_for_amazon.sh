#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Export a .fbx file for use on Amazon, based their spec sheet v 1.0           #
################################################################################
source $(dirname $0)/../../xrs.sh

asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi
asin=$(xrs_get_required_argument "i" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Exporting Amazon File (.fbx) for ${asset_uid}, submission number ${submission_number}"

source_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"
textures_dir="${source_dir}generated/"
amazon_dir="${source_dir}${asin}/"
mkdir ${amazon_dir}

# Rename 4k files based on the amazon naming conventions
${BASH_3XR_DIR}/studio/textures/rename_for_amazon.sh \
  -a ${asset_uid} \
  -c ${submission_number} \
  -i ${asin}

/3xr/programs/Blender290/blender290 \
  --background \
  --python-exit-code 1 \
  -noaudio "${source_dir}${name}.blend" \
  --python "${BLENDER_3XR_DIR}/export/fbx_for_amazon.py" \
  -- "${textures_dir}" "${amazon_dir}" "${asin}"

exit_status=$?
if [ "${exit_status}" -ne 0 ]
then
  xrs_log_error "Blender exited with non-zero exit code: ${exit_status}"
  exit 1
fi

# Bundle the files into a zip
cd ${source_dir}
zip -r --exclude=*.blend* --exclude=*@eaDir* ${asin}.zip ${asin}/
