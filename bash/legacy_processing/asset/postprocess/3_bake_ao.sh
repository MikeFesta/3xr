#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Bake Ambient Occlusion for the low_res model (from high-res, if available)   #
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh

xrs_print_status_message "Baking AO for ${name}"

WORKING_DIR="${MODEL_DIR}/${name}/textures/"
mkdir -p "${WORKING_DIR}"
if [ -f "${WORKING_DIR}/${name}_4k_AO.png" ];
then
  xrs_print_warning_message "${name}_4k_AO.png already exists - skipping"
else
  blender279 --background --python-exit-code 1 -noaudio "${MODEL_DIR}/${name}/blender/279_${name}.blend" --python "${BLENDER_3XR_DIR}/bake_ao.py" -- ambient_occlusion
fi
