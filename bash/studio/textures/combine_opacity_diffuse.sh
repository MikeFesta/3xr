#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Combine an opacity.png grayscale image with a diffuse on the alpha channel   #
# Note (6/16/21) Going to stop calling this because it seems to be causing     #
# problems with new submissions keeping the previously extracted opacity map   #
# Note (6/30/21) - Need to find a better way to handle opacity, but for now    #
# this should at least fix the bug.                                            #
# 1. Extract Opacity from diffuse.png (only overwrite _opacity if non-blank)   #
# 2. Re-combine opacity back into diffuse.png in this file                     #
# Warning -this will still break if a submission had opacity and then it was   #
# intentionally removed from the diffuse file                                  #
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Combining Opacity with Diffuse for materials in ${asset_uid}, submission number ${submission_number}"

source_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"
xrs_load_material_names "${source_dir}"
for material_name in "${xrs_material_names[@]}"
do
  opacity_file="${source_dir}${material_name}_4k_opacity.png"
  diffuse_file="${source_dir}${material_name}_4k_diffuse.png"
  diffuse_file_temp="${source_dir}/${material_name}_4k_diffuse-with-opacity.png"
  diffuse_file_generated="${source_dir}/generated/${material_name}_4k_diffuse.png"

  if [ ! -f "${opacity_file}" ]
  then
    xrs_log_info "No 4k Opacity found for ${material_name}"
  else
    xrs_log_info "Combinning 4k Opacity with Diffuse for ${material_name}"
    convert "${diffuse_file}" \( "${opacity_file}" -colorspace gray \) -alpha off -compose copy_opacity -composite "${diffuse_file_temp}"
    mv -f "${diffuse_file_temp}" "${diffuse_file}"
    # Copy into generated for later processing. (this may be redundant)
    cp "${diffuse_file}" "${diffuse_file_generated}"
  fi
done
