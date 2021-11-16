#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Export a .glb file for use on the web / android
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh

xrs_log_info "Exporting GLTF (.glb) for ${name}"
if [ ! -d ${MODEL_DIR}/${name} ]
then
  xrs_log_error "Asset Directory not found"
  exit 1
fi

# Create the final directory if it does not exist
mkdir -p "${MODEL_DIR}/${name}/final"

blender --python-exit-code 1 -noaudio "${MODEL_DIR}/${name}/blender/${name}.blend" --python "${BLENDER_3XR_DIR}/export/glb.py"

exit_status=$?
if [ "${exit_status}" -ne 0 ]
then
  xrs_log_error "Blender exited with non-zero exit code: ${exit_status}"
  exit 1
fi

glb_files=$(ls -lh "${MODEL_DIR}/${name}/final/"*glb)
xrs_log_info "${glb_files[@]}"
