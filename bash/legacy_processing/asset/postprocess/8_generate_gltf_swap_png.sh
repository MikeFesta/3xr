#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Resize textures from 4k to 2k and 1k resolutions                             #
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh

xrs_print_status_message "Exporting GLTF (.glb) for ${name}\n"
mkdir -p "${MODEL_DIR}/${name}/final"

blender279 --python-exit-code 1 -noaudio "${MODEL_DIR}/${name}/blender/279_${name}.blend" --addons io_scene_gltf2 --python "${BLENDER_3XR_DIR}/gltf_export.py" -- "${name}" "${BLENDER_3XR_DIR}"

ls -lh "${MODEL_DIR}/${name}/final/"*glb
