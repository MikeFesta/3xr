#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Convert pngs to jpgs because they are smaller and look almost as good        #
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh
source $(dirname $0)/../../material_names.sh

xrs_print_status_message "Creating JPGs for ${name}"
WORKING_DIR="${MODEL_DIR}/${name}/textures/"
textures=("AO" "Clearcoat" "ClearcoatRoughness" "Diffuse" "Emissive" "Metallic" "Normal" "Opacity" "Roughness")
file_types=("jpg" "png")
file_sizes=("1k" "2k" "4k")

for material_name in "${material_names[@]}"
do
  for texture_name in "${textures[@]}"
  do
    xrs_print_status_message "Converting ${texture_name}"
    for size in "${file_sizes[@]}"
    do
      png="${WORKING_DIR}${material_name}_${size}_${texture_name}.png"
      jpg="${WORKING_DIR}${material_name}_${size}_${texture_name}.jpg"
      if [ -f "${png}" ] && [ ! -f "${jpg}" ];
      then
        convert "${png}" -background white -flatten "${jpg}"
      elif [ -f "${jpg}" ];
      then
        xrs_print_warning_message "${jpg} already exists - skipping. To replace, manually delete and run again"
      fi
    done
  done
done
