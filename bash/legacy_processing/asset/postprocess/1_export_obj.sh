#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Export Low Res and High Res meshes as .obj files for import to Blender 2.79  #
# Also export the low res at 100x scale for use in .usdz creation              #
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh

xrs_print_status_message "1) Exporting .objs for ${name}"
# Create the exports directory if it does not exist
mkdir -p "${MODEL_DIR}/${name}/exports"
file="${MODEL_DIR}/${name}/blender/${name}.blend"
blender --background --python-exit-code 1 -noaudio ${file} --python "${BLENDER_3XR_DIR}/export_high_res_low_res_obj.py"
blender --background --python-exit-code 1 -noaudio ${file} --python "${BLENDER_3XR_DIR}/export_100x_obj.py"

# Confirm that the low_res obj was created
if [ ! -f ${MODEL_DIR}/${name}/exports/${name}_low_res.obj ];
then
  xrs_print_error_message "${MODEL_DIR}/${name}/exports/${name}_low_res.obj NOT FOUND"
  exit 1
fi
