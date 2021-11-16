#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Resize textures from 4k to 2k and 1k resolutions                             #
################################################################################
source $(dirname $0)/xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/name_flag.sh

xrs_print_status_message "Resizing photos for ${name}"
WORKING_DIR="${MODEL_DIR}/${name}/photos/scan/*.jpg"

for file in ${WORKING_DIR}
do
  printf "${file}\n"
  convert "${file}" -scale 50% "${file}"
done
