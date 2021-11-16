#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# The model name is passed as an argument -n name
source $(dirname $0)/xrs.sh
source $(dirname $0)/name_flag.sh

xrs_print_status_message "Adding 6 Photos"

# Blender 2.80
blender --background --python-exit-code 1 -noaudio $MODEL_DIR/$name/blender/${name}.blend --python "${BLENDER_3XR_DIR}/add_photos_six_sides.py"
