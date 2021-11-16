#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Create an opacity.png grayscale image from diffuse alpha (if it exists)      #
# Having this in it's own file will help for QA visibility                     #
# TODO: Package the opacity file back into diffuse alpha channel               #
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Extracting Opacity from Diffuse Alpha channel ${asset_uid}, submission number ${submission_number}"

source_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"
destination_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/generated/"
declare -a orm

xrs_load_material_names "${source_dir}"
for material_name in "${xrs_material_names[@]}"
do
  opacity_file="${source_dir}${material_name}_4k_opacity.png"
  opacity_file_temp="${source_dir}${material_name}_4k_opacity-temp.png"
  diffuse_file="${source_dir}${material_name}_4k_diffuse.png"
  diffuse_file_generated="${source_dir}/generated/${material_name}_4k_diffuse.png"
  xrs_log_debug "Checking file: ${opacity_file}"
  if [ -f "${opacity_file}" ]
  then
    xrs_log_info "Opacity File Already Exists: ${opacity_file}. DOING NOTHING FOR NOW."
    #rm -f "${opacity_file}"
    #mv "${opacity_file}" "${opacity_file}-original.png"

  fi
  # Check for diffuse.png
  #if [ -f "${diffuse_file}" ]
  #then
  #  # Copy the Diffuse PNG, if it is not already there, into generated/ because it will be needed for .glb/.usdz creation
  #  if [ ! -f "${diffuse_file_generated}" ]
  #  then
  #    cp "${diffuse_file}" "${diffuse_file_generated}"
  #  fi
  #else
  #  xrs_log_warning "Diffuse texture ${diffuse_file} not found, ${opacity_file} will not be applied to model"
  #fi

  # Check for alpha.value file (created when no input linked in the blend material)
  xrs_log_debug "Checking for alpha.value"
  alpha_value="${source_dir}${material_name}_alpha.value"
  if [ -f "${alpha_value}" ]
  then
    xrs_log_info "Opacity Value Exits: ${alpha_value}"
    if [ -f "${diffuse_file}" ]
    then
      # Copy the Diffuse PNG into generated/ because it will be needed for .glb/.usdz creation
      if [ ! -f "${diffuse_file_generated}" ]
      then
        cp "${diffuse_file}" "${diffuse_file_generated}"
      fi
    fi
  else
    # Check for diffuse.png
    if [ -f "${diffuse_file}" ]
    then
      xrs_log_info "Diffuse Found: alpha extracted to ${opacity_file_temp}"
      # Use imagemagik to extract the alpha
      convert "${diffuse_file}" -alpha extract "${opacity_file_temp}"
      # Copy the Diffuse PNG into generated/ because it will be needed for .glb/.usdz creation

      # Only keep this file if it not not all white
      all_white=$(convert "${opacity_file_temp}" -format "%[fx:mean==1?1:0]\n" info:)
      if [ $all_white -eq 1 ]
      then
        xrs_log_info "Not extracting opacity from diffuse because it was all white"
        rm "${opacity_file_temp}"
      else
        mv "${opacity_file_temp}" "${opacity_file}"
      fi
      if [ -f "${diffuse_file_generated}" ]
      then
        rm -f "${diffuse_file_generated}"
      fi
      cp "${diffuse_file}" "${diffuse_file_generated}"
    else
      xrs_log_error "Diffuse texture ${diffuse_file} not found, cannot extract alpha"
    fi
  fi
done
