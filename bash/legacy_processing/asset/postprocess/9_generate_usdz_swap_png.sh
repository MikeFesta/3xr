#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Create the usdz file - needs to run from a mac                               #
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh
source $(dirname $0)/../../material_names.sh

# Ensure that the folder exists
if [ ! -d "${MODEL_DIR}/${name}" ];
then
  xrs_print_error_message "Folder ${MODEL_DIR}/${name} Not Found. Check name or run 0_unarchive.sh"
  exit 1
fi

xrs_print_status_message "Creating USDZ for ${name}"
mkdir -p "${MODEL_DIR}/${name}/final"
# Note: this only handles a single material named {name}_Mat
# Defaulting to 2k diffuse, 1k everything else

WORKING_DIR="${MODEL_DIR}/${name}/"
EXPORTS_DIR="${MODEL_DIR}/${name}/exports/"
FINAL_DIR="${MODEL_DIR}/${name}/final/"
TEXTURES_DIR="${MODEL_DIR}/${name}/textures/"
commands=()
commands+="xcrun"
commands+=" usdz_converter"
commands+=" ${EXPORTS_DIR}${name}_100x.obj"
commands+=" ${FINAL_DIR}${name}.usdz"
commands+=" -v -a -l"

for material_name in "${material_names[@]}"
do
  commands+=" -m /${name}_100x/Materials/${material_name}_Mat"

  if [ -f "${TEXTURES_DIR}${material_name}_2k_Diffuse.png" ];
  then
    commands+=" -color_map ${TEXTURES_DIR}${material_name}_2k_Diffuse.png"
  else
    xrs_print_warning_message "${TEXTURES_DIR}${material_name}_2k_Diffuse.png"
  fi

  if [ -f "${TEXTURES_DIR}${material_name}_1k_Metallic.jpg" ];
  then
    commands+=" -metallic_map ${TEXTURES_DIR}${material_name}_1k_Metallic.jpg"
  else
    value_file="${TEXTURES_DIR}${material_name}_Metallic.value"
    if [ -f "${value_file}" ]
    then
      numeric_value=$(cat ${value_file})
      if [ $(($numeric_value % 5)) != 0 ]
      then
        xrs_print_warning_message "${material_name}_${texture}.value should be a multiple of 5 (found ${numeric_value})"
        numeric_value=$((($numeric_value / 5) * 5))
      fi
      commands+=" -metallic_map ${RESOURCES_DIR}/colors/Value_${numeric_value}.png"
    fi
  fi

  if [ -f "${TEXTURES_DIR}${material_name}_1k_Roughness.jpg" ];
  then
    commands+=" -roughness_map ${TEXTURES_DIR}${material_name}_1k_Roughness.jpg"
  else
    value_file="${TEXTURES_DIR}${material_name}_Roughness.value"
    if [ -f "${value_file}" ]
    then
      numeric_value=$(cat ${value_file})
      if [ $(($numeric_value % 5)) != 0 ]
      then
         xrs_print_warning_message "${material_name}_${texture}.value should be a multiple of 5 (found ${numeric_value})"
         numeric_value=$((($numeric_value / 5) * 5))
      fi
      commands+=" -roughness_map ${RESOURCES_DIR}/colors/Value_${numeric_value}.png"
    fi
  fi

  if [ -f "${TEXTURES_DIR}${material_name}_1k_Normal.jpg" ];
  then
    commands+=" -normal_map ${TEXTURES_DIR}${material_name}_1k_Normal.jpg"
  fi

  if [ -f "${TEXTURES_DIR}${material_name}_1k_Emissive.jpg" ];
  then
    commands+=" -emissive_map ${TEXTURES_DIR}${material_name}_1k_Emissive.jpg"
  fi

  if [ -f "${TEXTURES_DIR}${material_name}_1k_AO.jpg" ];
  then
    commands+=" -ao_map ${TEXTURES_DIR}${material_name}_1k_AO.jpg"
  fi
done

xrs_print_status_message "${commands[@]}"
${commands[@]}
ls -lh ${FINAL_DIR}*.usdz
