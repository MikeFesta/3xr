#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# Globals and functions related to 3XR (XR Studio)

uname="$(uname -s)"
case "${uname}" in
    Linux*)
        MACHINE_OS=Linux
        ASSETS_DIR="/x/assets"
        BASH_3XR_DIR="/3xr/code/bash"
        BLENDER_3XR_DIR="/3xr/code/blender"
        BLENDER_SAM_DIR="/3xr/users/sdelara/code/blender"
        BLENDER_THREE_XR_DIR="/3xr/code/blender/xrs"
        BULK_EXPORT_DIR="/x/export/bulk"
        COMPLETE_MODEL_DIR="/3xr/complete"
        INCOMING_3XR_DIR="/x/incoming"
        INCOMING_PRODUCTS_DIR="/3xr/incoming/JulyScans"
        MODEL_DIR="/3xr/studio/projects"
        OUTGOING_3XR_DIR="/x/outgoing"
        PARTS_DIR="/x/parts"
        PRODUCTS_DIR="/x/products"
        PROJECTS_DIR="/x/projects"
        PYTHON_DIR="/3xr/code/python/studio"
        BASE_MATERIALS_DIR="/x/base_materials"
        MATERIALS_DIR="/x/materials"
        RESOURCES_DIR="/3xr/studio/resources"
        SD_CARD=""
        TEMP_DIR="/3xr/temp"
        WEB_DIR="/3xr/code/web"
        X_BACKUP_DIR="/x/backup"
        X_PROJECTS_DIR="/x/projects"
        XRS_DIR="/3xr/code/blender/plugin"
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

xrs_print_error_message () {
  printf "\033[91m${1}\033[0m\n" >&2
}

xrs_print_status_message () {
  printf "\033[92m${1}\033[0m\n"
}

xrs_print_warning_message () {
  printf "\033[93m${1}\033[0m\n"
}

xrs_log_debug () {
  printf "\033[94m${1}\033[0m\n"
}

xrs_log_error () {
  printf "\033[91m${1}\033[0m\n" >&2
}

xrs_log_info () {
  printf "\033[92m${1}\033[0m\n"
}

xrs_log_silly () {
  printf "\033[95m${1}\033[0m\n"
}

xrs_log_verbose () {
  printf "\033[96m${1}\033[0m\n"
}

xrs_log_warn () {
  printf "\033[93m${1}\033[0m\n"
}

xrs_get_argument () {
  # Run this command with a single character string and "$@"
  # Need to set local for getopts to work inside a function
  local OPTIND
  # The first paramater to this function is the letter of the argument
  arg="${1}" #
  # After reading the first, shift the arguments by 1 to get to the file args $@
  shift "$((OPTIND+1))"
  # This outer loop is needed because * matches break the inner getops loop
  # https://stackoverflow.com/questions/34536116/how-to-ignore-invalid-arguments-with-getopts-and-continue-parsing
  while :
  do
    # The : at the start prevents other args from causing illegal option
    while getopts ":${arg}:" opt;
    do
      case "$opt" in
      ${arg})
        # Set the return value to the matching argument
        return_value=$OPTARG
        ;;
      *)
        # Skip over other arguments that may be used elsewhere
        ;;
      esac
    done
    # Advance the index past any * arguments
    ((OPTIND++))
    # keep running until all original arguments have been parsed
    [ $OPTIND -gt $# ] && break
  done
  # use printf to return a non-integer value
  printf "${return_value}"
}

xrs_get_optional_argument () {
  arg=$(xrs_get_argument "$1" "$@")
  printf "${arg}"
}

xrs_get_required_argument () {
  # Log an error if the argument is not provided
  # Note that this exit 1 will only exit the subshell when called in $()
  # to properly exit, use this line right after calling this function:
  # if [ $? -ne 0 ]; then exit $?; fi
  required_arg=$(xrs_get_argument "$1" "$@")
  if [ "${required_arg}" = "" ]
  then
    xrs_log_error "ERROR: Missing Argument -$1, run ./"$(basename "$0")" -$1 VALUE"
    exit 1
  else
    printf "${required_arg}"
  fi
}

# File types / sizes in reverse order of preference
xrs_file_sizes=("1k" "2k" "4k")
xrs_file_types=("jpg" "png")
xrs_material_names=("")
xrs_texture_types=("ao" "clearcoat" "clearcoat_roughness" "diffuse" "emissive" "metallic" "normal" "opacity" "orm" "roughness")

xrs_load_material_names () {
  for f in ${1}*.png
  do
    already_listed=false
    material_name=`echo "${f%_*_*.png}"`
    material_name=`echo "${material_name##*$1}"`
    for in_array in ${xrs_material_names[@]}
    do
      if [ "${in_array}" == "${material_name}" ];
      then
        already_listed=true
      fi
    done
    if [ "${already_listed}" == false ];
    then
      xrs_log_info "Detected material named ${material_name}"
      xrs_material_names[$i]=${material_name}
      i=$i+1
    fi
  done
}
