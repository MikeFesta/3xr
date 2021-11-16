#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Bake Normal map from the high_res to the low_res model                       #
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh

xrs_print_status_message "Baking Normal map for ${name}"

blender279 --background --python-exit-code 1 -noaudio "${MODEL_DIR}/${name}/blender/279_${name}.blend" --python "${BLENDER_3XR_DIR}/bake_normal.py"
