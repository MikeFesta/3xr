#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Run automated checks against the blend file to ensure scripts will process   #
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh

xrs_print_status_message "Validating ${name}"
file="${MODEL_DIR}/${name}/blender/${name}.blend"
blender --background ${file} --python "${BLENDER_3XR_DIR}/validate.py" --python-exit-code 1 -noaudio
if [ $? -ne 0 ];
then
  xrs_print_error_message "Validation Failed"
  exit 1
else
  xrs_print_status_message "VALID"
  exit 0
fi
