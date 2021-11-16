#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Resize 4k (or 2k) textures down to 2k and 1k for the generated directory     #
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Resizing Textures for asset_uid ${asset_uid}, submission number ${submission_number}"

png_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"
source_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/generated/"

xrs_load_material_names "${png_dir}"
for material_name in "${xrs_material_names[@]}"
do
  for texture_name in "${xrs_texture_types[@]}"
  do
    found=false
    for ext in "${xrs_file_types[@]}"
    do
      full_size="${source_dir}${material_name}_4k_${texture_name}.${ext}"
      half_size="${source_dir}${material_name}_2k_${texture_name}.${ext}"
      quarter_size="${source_dir}${material_name}_1k_${texture_name}.${ext}"
      if [ -f "${full_size}" ];
      then
        found=true
        xrs_log_info "Resize ${material_name}_4k_${texture_name} (${ext})"
        # Note: ImageMagik automatically changes the colorspace to grayscale if all channels are the same
        # A bug in model-viewer 1.2.1 breaks transparency with grayscale diffuse pngs
        # In addition, grayscale seems to be linear instead of sRGB, which we want to avoid for diffuse
        if [[ "${ext}" == "png" ]] && [[ "${texture_name}" == "diffuse" ]]
        then
          xrs_log_debug "forcing RBGA png"
          convert "${full_size}" -scale 50% -define png:color-type=6 "${half_size}"
          convert "${full_size}" -scale 25% -define png:color-type=6 "${quarter_size}"
        else
          convert "${full_size}" -scale 50% "${half_size}"
          convert "${full_size}" -scale 25% "${quarter_size}"
        fi
      elif [ -f "${half_size}" ];
      then
        found=true
        xrs_log_info "Resize ${material_name}_2k_${texture_name} (${ext})"
        convert "${half_size}" -scale 50% "${quarter_size}"
      fi
    done
    if [ $found = false ];
    then
      xrs_log_warn "SKIP - ${material_name} ${texture_name} 4k or 2k not found"
    fi
  done
done
