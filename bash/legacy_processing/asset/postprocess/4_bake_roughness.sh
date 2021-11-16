#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# For multi-material high res, bake a texture, otherwise save the value
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh

xrs_print_status_message "Baking Roughness map for ${name}"

WORKING_DIR="${MODEL_DIR}/${name}/textures/"
mkdir -p "${WORKING_DIR}"
if [ -f "${WORKING_DIR}/${name}_4k_Roughness.png" ];
then
  xrs_print_warning_message "${name}_4k_Roughness.png already exists - skipping"
else
  blender --background --python-exit-code 1 -noaudio "${MODEL_DIR}/${name}/blender/${name}.blend" --python "${BLENDER_3XR_DIR}/bake_roughness.py"
fi
