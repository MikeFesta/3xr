#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Bake Normal map from the high_res to the low_res model                       #
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh
source $(dirname $0)/../../material_names.sh

xrs_print_status_message "Generating ORM image for ${name}"
WORKING_DIR="${MODEL_DIR}/${name}/textures/"
printf "${WORKING_DIR}\n"
textures=("AO" "Roughness" "Metallic")
# File types / sizes in reverse order of preference
file_types=("jpg" "png")
file_sizes=("1k" "2k" "4k")
declare -a orm

for material_name in "${material_names[@]}"
do
  i=0
  for texture in "${textures[@]}"
  do
    # AO
    # Uses the highest res png available, if none, use the highest res jpg
    orm[$i]=""
    for ext in "${file_types[@]}"
    do
      for size in "${file_sizes[@]}"
      do
        check_file="${WORKING_DIR}${material_name}_${size}_${texture}.${ext}"
        if [ -f "${check_file}" ]
        then
          orm[$i]=${check_file}
        fi
      done
    done

    if [ "${orm[$i]}" = "" ]
    then
      # TODO: Add a step to create this file - new step that also bakes metallic / roughness
      value_file="${WORKING_DIR}${material_name}_${texture}.value"
      if [ -f "${value_file}" ]
      then
        numeric_value=$(cat ${value_file})
        if [ $(($numeric_value % 5)) != 0 ]
        then
          xrs_print_warning_message "${material_name}_${texture}.value should be a multiple of 5 (found ${numeric_value})"
          numeric_value=$((($numeric_value / 5) * 5))
        fi
        xrs_print_warning_message "No ${texture} texture found. Using numeric value ${numeric_value}"
        orm[$i]="${RESOURCES_DIR}/colors/Value_${numeric_value}.png"
      else
        xrs_print_error_message "No Texture or ${value_file} file found."
      fi
    else
      xrs_print_status_message "${texture} texture found: ${orm[$i]}"
    fi
    i=$i+1
  done

  # Only continue if all maps are assigned
  if [ "${orm[0]}" != "" ] && [ "${orm[1]}" != "" ] && [ "${orm[2]}" != "" ];
  then
    xrs_print_status_message "Red Channel: ${orm[0]}"
    xrs_print_status_message "Green Channel: ${orm[1]}"
    xrs_print_status_message  "Blue Channel: ${orm[2]}"
    convert \( ${orm[0]} -resize 4096x4096 \) \( ${orm[1]} -resize 4096x4096 \) \( ${orm[2]} -resize 4096x4096 \) -combine "${WORKING_DIR}${material_name}_4k_ORM.png"
  fi
done
