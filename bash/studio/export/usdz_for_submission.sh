#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Create a usdz file
# This now uses the python build tools instead of xcode (required a mac)
# 2k diffuse, 1k everything else
################################################################################
source $(dirname $0)/../../xrs.sh

asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Creating usdz for ${asset_uid}, submission number ${submission_number}"

source_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"
textures_dir="${source_dir}generated/"

# Create the .obj in the textures directory
/3xr/programs/Blender281_xrs/blender281_xrs \
  --background \
  --python-exit-code 1 \
  -noaudio "${source_dir}${name}.blend" \
  --python "${BLENDER_3XR_DIR}/export/web_obj.py" \

# Need to set the USD path for the tool to work
export PATH=$PATH:/3xr/code/USD
export PYTHONPATH=$PYTHONPATH:/3xr/code/python/lib
xrs_log_debug "Python Path: ${PYTHONPATH}"

commands=()
commands+="/3xr/code/usdpython/usdzconvert/usdzconvert"
commands+=" ${textures_dir}${name}.obj"
commands+=" ${source_dir}${name}.usdz"
#commands+=" -v" # verbose for development, can be removed later
commands+=" -url https://www.3xr.com/asset/view/${asset_uid}"
commands+=" -copyright \"3XR_Inc.\""
commands+=' -metersPerUnit 1.0'
commands+=' -iOS12' # Probably need this for a while for older devices

xrs_load_material_names "${source_dir}"
for material_name in "${xrs_material_names[@]}"
do
  commands+=" -m /${name}/Materials/${material_name}"

  if [ -f "${textures_dir}${material_name}_2k_diffuse.jpg" ];
  then
    if [ -f "${textures_dir}${material_name}_2k_opacity.jpg" ];
    then
      # iOS12 Compatibility Hack - When opacity is used, it must have the same texture for diffuse and opacity
      commands+=" -diffuseColor ${textures_dir}${material_name}_2k_diffuse.png"
    else
      commands+=" -diffuseColor ${textures_dir}${material_name}_2k_diffuse.jpg"
    fi
  else
    xrs_log_warn "${textures_dir}${material_name}_2k_diffuse.jpg not found"
  fi

  if [ -f "${textures_dir}${material_name}_1k_normal.jpg" ];
  then
    commands+=" -normal ${textures_dir}${material_name}_1k_normal.jpg"
  fi

  if [ -f "${textures_dir}${material_name}_1k_emissive.jpg" ];
  then
    commands+=" -emissiveColor ${textures_dir}${material_name}_1k_emissive.jpg"
  fi

  if [ -f "${textures_dir}${material_name}_1k_metallic.jpg" ];
  then
    commands+=" -metallic ${textures_dir}${material_name}_1k_metallic.jpg"
  else
    value_file="${textures_dir}${material_name}_metallic.value"
    if [ -f "${value_file}" ]
    then
      numeric_value=$(cat ${value_file})
      xrs_log_info "metallic = ${numeric_value}"
      if [ "$numeric_value" -eq 0 ]
      then
        commands+=" -metallic 0.0"
      else
        if [ "$numeric_value" -lt 100 ]
        then
          xrs_log_warn "${material_name}_${texture}.value should be either 0 or 100 (found ${numeric_value}). Using value 100"
        fi
        commands+=" -metallic 1.0"
      fi
    fi
  fi

  if [ -f "${textures_dir}${material_name}_1k_roughness.jpg" ];
  then
    commands+=" -roughness ${textures_dir}${material_name}_1k_roughness.jpg"
  else
    value_file="${textures_dir}${material_name}_roughness.value"
    if [ -f "${value_file}" ]
    then
      numeric_value=$(cat ${value_file})
      xrs_log_info "Roughness = ${numeric_value}"
      if [ "$numeric_value" -eq 0 ]
      then
        commands+=" -roughness 0.0"
      else
        if [ "$numeric_value" -eq 100 ]
        then
          commands+=" -roughness 1.0"
        else
          float_value=$( bc <<< "scale=2; $numeric_value / 100" )
          xrs_log_warn "Roughness Float = ${float_value}"
          commands+=" -roughness 0${float_value}"
        fi
      fi
    fi
  fi

  if [ -f "${textures_dir}${material_name}_1k_ao.jpg" ];
  then
    commands+=" -occlusion ${textures_dir}${material_name}_1k_ao.jpg"
  fi

  if [ -f "${textures_dir}${material_name}_2k_opacity.jpg" ];
  then
    # iOS12 Compatibility Hack - must match diffuse, so png is required
    commands+=" -opacity a ${textures_dir}${material_name}_2k_diffuse.png"
    #commands+=" -opacity 0.5" NOTE: This doesn't work for some reason
  fi

  if [ -f "${textures_dir}${material_name}_1k_clearcoat.jpg" ];
  then
    commands+=" -clearcoat ${textures_dir}${material_name}_1k_clearcoat.jpg"
  fi

  if [ -f "${textures_dir}${material_name}_1k_clearcoat_roughness.jpg" ];
  then
    commands+=" -clearcoatRoughness ${textures_dir}${material_name}_1k_clearcoat_roughness.jpg"
  fi

done

# Passing to /dev/null because usdz checker is throwing an error
${commands[@]} 2>/dev/null
ls -lh ${source_dir}*.usdz
