#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# DEPRICATED - USDZs are now generated from the .glb instead of an obj
# Create a usdz file
# This now uses the python build tools instead of xcode (required a mac)
# Pre-requirements:
#  * An obj exported at 1m = 1m in the exports folder
#  * Textures and/or Metallic/Roughness values in the textures folder
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

uid="test" # TODO pass the uid as an argument

xrs_print_status_message "Creating USDZ for ${name}"
mkdir -p "${MODEL_DIR}/${name}/final"
# Defaulting to 2k diffuse, 1k everything else

WORKING_DIR="${MODEL_DIR}/${name}/"
EXPORTS_DIR="${MODEL_DIR}/${name}/exports/"
FINAL_DIR="${MODEL_DIR}/${name}/final/"
TEXTURES_DIR="${MODEL_DIR}/${name}/textures/"

# Need to set the USD path for the tool to work
export PATH=$PATH:/3xr/code/USD
export PYTHONPATH=$PYTHONPATH:/3xr/code/python/lib
xrs_print_status_message "Python Path: ${PYTHONPATH}"

commands=()
commands+="/3xr/code/usdpython/usdzconvert/usdzconvert"
commands+=" ${EXPORTS_DIR}${name}_low_res.obj"
commands+=" ${FINAL_DIR}${name}.usdz"
commands+=" -v" # verbose for development, can be removed later
commands+=" -url https://www.3xr.com/asset/view/${uid}"
commands+=" -copyright \"3XR_Inc.\""
commands+=' -metersPerUnit 1.0'
commands+=' -iOS12' # Probably need this for a while for older devices

for material_name in "${material_names[@]}"
do
  commands+=" -m /${name}/Materials/${material_name}_Mat"

  if [ -f "${TEXTURES_DIR}${material_name}_2k_Diffuse.jpg" ];
  then
    if [ -f "${TEXTURES_DIR}${material_name}_2k_Opacity.jpg" ];
    then
      # iOS12 Compatibility Hack - When opacity is used, it must have the same texture for diffuse and opacity
      commands+=" -diffuseColor ${TEXTURES_DIR}${material_name}_2k_Diffuse.png"
    else
      commands+=" -diffuseColor ${TEXTURES_DIR}${material_name}_2k_Diffuse.jpg"
    fi
  else
    xrs_print_warning_message "${TEXTURES_DIR}${material_name}_2k_Diffuse.jpg"
  fi

  if [ -f "${TEXTURES_DIR}${material_name}_1k_Normal.jpg" ];
  then
    commands+=" -normal ${TEXTURES_DIR}${material_name}_1k_Normal.jpg"
  fi

  if [ -f "${TEXTURES_DIR}${material_name}_1k_Emissive.jpg" ];
  then
    commands+=" -emissiveColor ${TEXTURES_DIR}${material_name}_1k_Emissive.jpg"
  fi

  if [ -f "${TEXTURES_DIR}${material_name}_1k_Metallic.jpg" ];
  then
    commands+=" -metallic ${TEXTURES_DIR}${material_name}_1k_Metallic.jpg"
  else
    value_file="${TEXTURES_DIR}${material_name}_Metallic.value"
    if [ -f "${value_file}" ]
    then
      numeric_value=$(cat ${value_file})
      xrs_print_status_message "Metallic = ${numeric_value}"
      if [ "$numeric_value" -eq 0 ]
      then
        commands+=" -metallic 0.0"
      else
        if [ "$numeric_value" -lt 100 ]
        then
          xrs_print_warning_message "${material_name}_${texture}.value should be either 0 or 100 (found ${numeric_value}). Using value 100"
        fi
        commands+=" -metallic 1.0"
      fi
    fi
  fi

  if [ -f "${TEXTURES_DIR}${material_name}_1k_Roughness.jpg" ];
  then
    commands+=" -roughness ${TEXTURES_DIR}${material_name}_1k_Roughness.jpg"
  else
    value_file="${TEXTURES_DIR}${material_name}_Roughness.value"
    if [ -f "${value_file}" ]
    then
      numeric_value=$(cat ${value_file})
      xrs_print_status_message "Roughness = ${numeric_value}"
      if [ "$numeric_value" -eq 0 ]
      then
        commands+=" -roughness 0.0"
      else
        if [ "$numeric_value" -eq 100 ]
        then
          commands+=" -roughness 1.0"
        else
          float_value=$( bc <<< "scale=2; $numeric_value / 100" )
          xrs_print_warning_message "Roughness Float = ${float_value}"
          commands+=" -roughness 0${float_value}"
        fi
      fi
    fi
  fi

  if [ -f "${TEXTURES_DIR}${material_name}_1k_AO.jpg" ];
  then
    commands+=" -occlusion ${TEXTURES_DIR}${material_name}_1k_AO.jpg"
  fi

  if [ -f "${TEXTURES_DIR}${material_name}_2k_Opacity.jpg" ];
  then
    # iOS12 Compatibility Hack - must match diffuse, so png is required
    commands+=" -opacity a ${TEXTURES_DIR}${material_name}_2k_Diffuse.png"
    #commands+=" -opacity 0.5" NOTE: This doesn't work for some reason
  fi

  if [ -f "${TEXTURES_DIR}${material_name}_1k_Clearcoat.jpg" ];
  then
    commands+=" -clearcoat ${TEXTURES_DIR}${material_name}_1k_Clearcoat.jpg"
  fi

  if [ -f "${TEXTURES_DIR}${material_name}_1k_ClearcoatRoughness.jpg" ];
  then
    commands+=" -clearcoatRoughness ${TEXTURES_DIR}${material_name}_1k_ClearcoatRoughness.jpg"
  fi

done

xrs_print_status_message "${commands[@]}"
${commands[@]}
ls -lh ${FINAL_DIR}*.usdz
