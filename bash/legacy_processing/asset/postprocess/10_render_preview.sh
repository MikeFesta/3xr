#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Render the preview image (300x300) in blender                                #
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh

mkdir -p "${MODEL_DIR}/${name}/final"
environment="photo_studio"

xrs_print_status_message "Rendering preview image for model (${name}) with environment  ${environment}"
blender --background --python-exit-code 1 -noaudio ${MODEL_DIR}/${name}/blender/${name}.blend --python ${BLENDER_3XR_DIR}/render_preview.py -- ${environment}
