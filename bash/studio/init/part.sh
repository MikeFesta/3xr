#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_optional_argument "a" "$@")
asset_name=$(xrs_get_optional_argument "b" "$@")
submission_number=$(xrs_get_optional_argument "c" "$@")
part_name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
part_uid=$(xrs_get_required_argument "u" "$@")
if [ $? -ne 0 ]; then exit $?; fi

part_dir="${PARTS_DIR}/${part_uid}"
mkdir -p "${part_dir}/blender"
mkdir -p "${part_dir}/textures"
mkdir -p "${part_dir}/logs"
part_blend_file="${part_dir}/blender/${part_name}.blend"
#original_part_blend_file="${part_dir}/blender/original_${part_name}.blend" #TODO: remove this

if [ "${asset_uid}" != "" ]
then
  xrs_log_info "Creating part uid ${part_uid} with blend name ${part_name} from asset submission "

  # Copy the blend file from the asset submission directory into the new part directory
  asset_submission_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}"
  asset_blend_file="${asset_submission_dir}/${asset_name}.blend"
  xrs_log_debug "Copying from ${asset_blend_file} to ${part_blend_file}"
  cp "${asset_blend_file}" "${part_blend_file}"

  # Copy and rename textures
  texture_names=( "ao" "diffuse" "metallic" "normal" "opacity" "roughness" )
  for texture in "${texture_names[@]}"
  do
    asset_texture="${asset_submission_dir}/${asset_name}_4k_${texture}.png"
    if [ -f "${asset_texture}" ]
    then
      part_texture="${part_dir}/textures/${part_name}_4k_${texture}.png"
      xrs_log_info "Copying texture ${asset_texture}"
      cp "${asset_texture}" "${part_texture}"
    else
      xrs_log_warn "${asset_texture} not found"
    fi
  done

  # Rename the internal part and remove packed images
  /3xr/programs/Blender290/blender290 \
    --background \
    --python-exit-code 1 \
    -noaudio \
    ${part_blend_file} \
    --python \
    "${BLENDER_3XR_DIR}/init/part.py" \
    -- \
    ${part_uid} \
    true \
    true \
    2>&1 | tee -a ${part_dir}/logs/init.log

else
  xrs_log_info "Creating from scratch - part uid ${part_uid} with blend name ${part_name}"
  xrs_log_debug "TODO"
  touch "${part_dir}/blender/TODO-Part-Blender-File.blend"
fi
