#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Resize textures from 4k to 2k and 1k resolutions                             #
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh
source $(dirname $0)/../../material_names.sh

xrs_print_status_message "Resizing textures for ${name}"
WORKING_DIR="${MODEL_DIR}/${name}/textures/"
textures=("AO" "Clearcoat" "ClearcoatRoughness" "Diffuse" "Emissive" "Metallic" "Normal" "Opacity" "ORM" "Roughness")
# File types / sizes in reverse order of preference
file_types=("jpg" "png")
file_sizes=("1k" "2k" "4k")

for material_name in "${material_names[@]}"
do
  for texture_name in "${textures[@]}"
  do
    found=false
    for ext in "${file_types[@]}"
    do
      full_size="${WORKING_DIR}${material_name}_4k_${texture_name}.${ext}"
      half_size="${WORKING_DIR}${material_name}_2k_${texture_name}.${ext}"
      quarter_size="${WORKING_DIR}${material_name}_1k_${texture_name}.${ext}"
      if [ -f "${full_size}" ];
      then
        found=true
        xrs_print_status_message "Resize ${texture_name} (${ext})"
        if [ ! -f "${half_size}" ]
        then
          convert "${full_size}" -scale 50% "${half_size}"
        else
          xrs_print_warning_message "${half_size} exists, skipping"
        fi
        if [ ! -f "${quarter_size}" ]
        then
          convert "${full_size}" -scale 25% "${quarter_size}"
        else
          xrs_print_warning_message "${quarter_size} exists, skipping"
        fi
      elif [ -f "${half_size}" ];
      then
        found=true
        xrs_print_status_message "Resize ${texture_name} (${ext})"
        if [ ! -f "${quarter_size}" ]
        then
          convert "${half_size}" -scale 50% "${quarter_size}"
        else
          xrs_print_warning_message "${quarter_size} exists, skipping"
        fi
      fi
    done
    if [ $found = false ];
    then
      xrs_print_warning_message "SKIP - ${full_size} or 2k (not found)\n"
    fi
  done
done
