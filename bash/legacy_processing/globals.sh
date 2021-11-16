#!/bin/bash
# SPDX-License-Identifier: Apache-2.0

uname="$(uname -s)"
case "${uname}" in
    Linux*)
        MACHINE_OS=Linux
        BASH_3XR_DIR="/3xr/code/bash"
        BLENDER_3XR_DIR="/3xr/code/blender"
        BLENDER_THREE_XR_DIR="/3xr/code/blender/xrs"
        INCOMING_3XR_DIR="/3xr/to_sort/network_drive/incoming_3xr"
        INCOMING_PRODUCTS_DIR="/3xr/incoming/JulyScans"
        MODEL_DIR="/3xr/studio/projects"
        COMPLETE_MODEL_DIR="/3xr/complete"
        OUTGOING_3XR_DIR="/3xr/to_sort/network_drive/outgoing_3xr"
        RESOURCES_DIR="/3xr/studio/resources"
        SD_CARD=""
        TEMP_DIR="/3xr/temp"
        WEB_DIR="/3xr/code/web"
      ;;
    Darwin*)
        MACHINE_OS=Mac
        BASH_3XR_DIR="/Volumes/assets/code/bash"
        BLENDER_3XR_DIR="/Volumes/assets/code/blender"
        BLENDER_THREE_XR_DIR="/Applications/blender.app/Contents/Resources/2.80/scripts/addons/xrs"
        INCOMING_3XR_DIR="/Volumes/assets/to_sort/network_drive/incoming_3xr"
        INCOMING_PRODUCTS_DIR="/Volumes/assets/incoming"
        MODEL_DIR="/Volumes/assets/studio/projects"
        COMPLETE_MODEL_DIR="/Volumes/assets/complete"
        OUTGOING_3XR_DIR="/Volumes/assets/to_sort/network_drive/outgoing_3xr"
        RESOURCES_DIR="/Volumes/assets/studio/resources"
        SD_CARD=""
        TEMP_DIR="/3xr/temp"
        WEB_DIR="/Volumes/assets/code/web/3xr_node"
      ;;
    MINGW*)
        MACHINE_OS=windows
        BASH_3XR_DIR="/e/3xr/code/bash"
        BLENDER_3XR_DIR="/e/3xr/code/blender"
        BLENDER_THREE_XR_DIR="/c/Program Files/Blender Foundation/blender-2.80.0/2.80/scripts/addons/three_xr"
        INCOMING_3XR_DIR="/x/incoming_3xr"
        INCOMING_PRODUCTS_DIR="/x/incoming_products"
        MODEL_DIR="/x/models"
        COMPLETE_MODEL_DIR="/x/complete"
        OUTGOING_3XR_DIR="/x/outgoing_3xr"
        RESOURCES_DIR="/x/resources"
        SD_CARD="/i/DCIM/100EOS5D"
        TEMP_DIR="/e/3xr/temp"
        WEB_DIR="/e/3xr/code/web/3xr_node"
      ;;
    *)
        MACHINE_OS="UNKNOWN:${uname}"
esac

print_status_message () {
  printf "\033[92m${1}\033[0m\n"
}
