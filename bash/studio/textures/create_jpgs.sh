#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Convert pngs to jpgs because they are smaller and look almost as good        #
# Exclude the normal map because jpeg artifacts are causing issues             #
################################################################################
source $(dirname $0)/../../xrs.sh

asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Creating jpgs for asset_uid ${asset_uid}, submission number ${submission_number}"

source_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"
destination_dir="${source_dir}generated/"
mkdir "${destination_dir}" 2>/dev/null

xrs_load_material_names "${source_dir}"
for material_name in "${xrs_material_names[@]}"
do
  for texture_name in "${xrs_texture_types[@]}"
  do
    if [ "${texture_name}" = "normal" ];
    then
      # keep normal as a png
      cp "${source_dir}${material_name}_4k_normal.png" "${destination_dir}${material_name}_4k_normal.png"
    else
      for size in "${xrs_file_sizes[@]}"
      do
        png="${source_dir}${material_name}_${size}_${texture_name}.png"
        jpg="${destination_dir}${material_name}_${size}_${texture_name}.jpg"
        if [ -f "${png}" ];
        then
          xrs_log_info "Creating ${jpg}"
          convert "${png}" -background white -flatten "${jpg}"
        fi
      done
    fi
  done
done
