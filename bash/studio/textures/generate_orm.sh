#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Create an Occulsion Roughness Metallic png file from Textures or Values      #
# This is currently only used by the crate and barrel export script            #
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Generating ORM files for ${asset_uid}, submission number ${submission_number}"

source_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"
destination_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/generated/"
textures=("ao" "roughness" "metallic")
declare -a orm

# finding that too many materials get detected from source_dir
#xrs_load_material_names "${source_dir}"
# destination directory (generated) should already have files when this is called
xrs_load_material_names "${destination_dir}"
for material_name in "${xrs_material_names[@]}"
do
  i=0 # 0: Red=AO, 1: Green=Roughness, 2: Blue=Metallic
  for texture in "${textures[@]}"
  do
    # AO
    # Uses the highest res png available, if none, use the highest res jpg
    orm[$i]=""
    for ext in "${xrs_file_types[@]}"
    do
      for size in "${xrs_file_sizes[@]}"
      do
        check_file="${source_dir}${material_name}_${size}_${texture}.${ext}"
        if [ -f "${check_file}" ]
        then
          # Ordered by preference (jpg, png) (1k, 2k, 4k) for overwritting
          orm[$i]=${check_file}
        fi
      done
    done

    if [ "${orm[$i]}" = "" ]
    then
      # If any of the files are missing, try to use a .value file instead
      value_file="${source_dir}${material_name}_${texture}.value"
      if [ -f "${value_file}" ]
      then
        numeric_value=$(cat ${value_file})
        if [ $(($numeric_value % 5)) != 0 ]
        then
          xrs_log_warn "${material_name}_${texture}.value should be a multiple of 5 (found ${numeric_value})"
          numeric_value=$((($numeric_value / 5) * 5))
        fi
        xrs_log_warn "No ${texture} texture found. Using numeric value ${numeric_value}"
        orm[$i]="${RESOURCES_DIR}/colors/Value_${numeric_value}.png"
      else
        if [ $i == 0 ];
        then
          xrs_log_warn "No ${material_name} AO texture or value, using default AO = 1.0"
          orm[$i]="${RESOURCES_DIR}/colors/Value_100.png"
        elif [ $i == 1 ];
        then
          xrs_log_warn "No ${material_name} Roughness texture or value, using default Roughness = 0.9"
          orm[$i]="${RESOURCES_DIR}/colors/Value_90.png"
        elif [ $i == 2 ];
        then
          xrs_log_warn "No ${material_name} Metallic texture or value, using default Metallic = 0.0"
          orm[$i]="${RESOURCES_DIR}/colors/Value_0.png"
        else
          xrs_log_error "There should only be 3 ORM material channels. ${i}"
        fi
      fi
    fi
    i=$((i+1))
  done

  # Only continue if all maps are assigned
  if [ "${orm[0]}" != "" ] && [ "${orm[1]}" != "" ] && [ "${orm[2]}" != "" ];
  then
    xrs_log_debug "Red Channel: ${orm[0]}"
    xrs_log_debug "Green Channel: ${orm[1]}"
    xrs_log_debug "Blue Channel: ${orm[2]}"
    convert \( "${orm[0]}" -resize 4096x4096 \) \( "${orm[1]}" -resize 4096x4096 \) \( "${orm[2]}" -resize 4096x4096 \) -combine "${destination_dir}${material_name}_4k_orm.png"
  else
    xrs_log_error "Unable to create ORM for ${material_name} because textures are missing"
  fi
done
