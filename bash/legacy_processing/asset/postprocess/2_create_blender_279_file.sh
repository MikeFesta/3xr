#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Create a blender 2.79 file because 2.80 still has some issues (baking, gltf) #
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh

xrs_print_status_message "2) Creating 2.79 blend file for ${name}"
blender279 --background --python-exit-code 1 -noaudio "${RESOURCES_DIR}/blender/new_model_template_279.blend" --python "${BLENDER_3XR_DIR}/create_blender_279_file.py" -- ${MODEL_DIR} ${name}

# Check that the file was created
if [ ! -f ${MODEL_DIR}/${name}/blender/279_${name}.blend ];
then
  xrs_print_error_message "279_${name}.blend NOT FOUND"
else
  xrs_print_status_message "279_${name}.blend created"
fi
