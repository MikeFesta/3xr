#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Resize the screenshot preview image
# 1st Choice, a mac screenshot
# 2nd Choice, blender 900x900 png render
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh

xrs_print_status_message "Resizing preview image for ${name}"
WORKING_DIR="${MODEL_DIR}/${name}/final/"
preview_300="${WORKING_DIR}${name}-300.jpg"

# 1. Mac Screenshot "Screen Shot *"
found=false
mac_screenshot=$(ls -t ${WORKING_DIR} | grep -m 1 "Screen")
if [ "${mac_screenshot}" != "" ];
then
  xrs_print_status_message "Using Mac Screenshot"
  xrs_print_status_message "${mac_screenshot}"
  convert "${WORKING_DIR}${mac_screenshot}" -trim -background \#323232 -resize 280x280 -gravity center -virtual-pixel edge -extent 300x300 "${preview_300}"
  rm "${WORKING_DIR}${mac_screenshot}"
else
  xrs_print_warning_message "No Mac Screenshot"
  blender_render_900="${WORKING_DIR}${name}-900.png"
  if [ -f "${blender_render_900}" ];
  then
    xrs_print_status_message "Using Blender Render"
    convert "${blender_render_900}" -background \#323232 -flatten -scale 50% "${preview_300}"
  else
    xrs_print_warning_message "No Blender Render Found"
  fi
fi
