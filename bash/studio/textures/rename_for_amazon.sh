#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Rename the 4k material textures per the Amazon standard                      #
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi
asin=$(xrs_get_required_argument "i" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Renaming Textures to Amazon standard for asset_uid ${asset_uid}, submission number ${submission_number}"

png_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"
amazon_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/${asin}/"

xrs_load_material_names "${png_dir}"
for material_name in "${xrs_material_names[@]}"
do
  # TODO: Confirm that the word texture can be replaces with the material name, which is needed for multi-material
  cp ${png_dir}${material_name}_4k_diffuse.png ${amazon_dir}${material_name}_diff.png 2>/dev/null
  cp ${png_dir}${material_name}_4k_metallic.png ${amazon_dir}${material_name}_metal.png 2>/dev/null
  cp ${png_dir}${material_name}_4k_roughness.png ${amazon_dir}${material_name}_rough.png 2>/dev/null
  cp ${png_dir}${material_name}_4k_normal.png ${amazon_dir}${material_name}_normal.png 2>/dev/null
  cp ${png_dir}${material_name}_4k_ao.png ${amazon_dir}${material_name}_ai.png 2>/dev/null
  cp ${png_dir}${material_name}_4k_emissive.png ${amazon_dir}${material_name}_emissive.png 2>/dev/null

# if [ -f "${full_size}" ];
# then
#     then
# else
#   xrs_log_warn "SKIP - ${material_name} ${texture_name} 4k or 2k not found"
# fi
done
