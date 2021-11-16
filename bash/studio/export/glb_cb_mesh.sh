#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# This is a special script for Crate & Barrel Dune Collection products with
# Navy and Taupe mesh material. Some of these settings should be rolled back
# into the standard glb export script, but for now just working off this copy
# The mesh materials have pre-made textures optimized for 4k and 2k use
# The mesh holes repeat pattern was made in photoshop to be pixel perfect at 2k
# There is a 3x3 pixel repeat with a 1px hole
#
# These are the special things this script does, which is being applied to existing
# submissions which already have a glb_test.blend file
# 1. Copy the 4k to the submissions folder
# 2. Regenerate textures to update the generated folder
# 3. Copy the optimized 2k Diffuse, 2k Normal, 2k Opacity into the generated folder
#     (note: these were resized in photoshop to keep sharp pixels,
#      which doesn't happen by default with image magic resizing)
#     todo: this could happen automatically for materials with 2k / 1k specific files
# 4. Blender:
#     a. Separate the _clip object by loose parts to prevent z-sorting errors
#     b. Link the 2k textures, unlink AO (can't be used by iOS for these)
#     c. Set blend mode to BLEND (looks better than clip for these)
#     d. Remove the 2nd UV channel, since iOS doesn't support it and AO is removed
#     e. Export the glb
# 5. Create usdz from glb
# 6. Create crate and barrel zip from submission
# 7. Update database submission status (SQL), external step
################################################################################
source $(dirname $0)/../../xrs.sh

asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi
material_name=$(xrs_get_required_argument "m" "$@")
if [ $? -ne 0 ]; then exit $?; fi
material_uid=$(xrs_get_required_argument "u" "$@")
if [ $? -ne 0 ]; then exit $?; fi
product_name=$(xrs_get_required_argument "p" "$@")
if [ $? -ne 0 ]; then exit $?; fi
sku=$(xrs_get_required_argument "s" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Reprocessing mesh glb/usdz for C&B - ${asset_uid}, submission number ${submission_number}"

source_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"

# 1. Copy the updated 4k materials
# Just dealing with Taupe / Navy mesh for this process
for file_type in diffuse normal opacity
do
  xrs_log_debug "copying 4k ${file_type}"
  # Remove the file first to avoid permissions issues
  rm -f "${source_dir}/${name}_4k_${file_type}.png"
  cp "${MATERIALS_DIR}/${material_uid}/textures/${material_name}_4k_${file_type}.png" "${source_dir}/${name}_4k_${file_type}.png"
done

# 2. Regenerate Textures
${BASH_3XR_DIR}/studio/textures/create_jpgs.sh -a ${asset_uid} -c ${submission_number}
${BASH_3XR_DIR}/studio/textures/resize.sh -a ${asset_uid} -c ${submission_number}

# 3. Copy 2k files directly into generate
for file_type in diffuse normal opacity
do
  xrs_log_debug "copying 2k ${file_type}"
  cp "${MATERIALS_DIR}/${material_uid}/textures/${material_name}_2k_${file_type}.png" "${source_dir}/generated/${name}_2k_${file_type}.png"
done

# 4. glb
/3xr/programs/Blender290/blender290 \
  --background \
  --python-exit-code 1 \
  -noaudio "${source_dir}${name}.blend" \
  --python "${BLENDER_3XR_DIR}/export/glb_cb_mesh.py" \
  -- true

exit_status=$?
if [ "${exit_status}" -ne 0 ]
then
  xrs_log_error "Blender exited with non-zero exit code: ${exit_status}"
  exit 1
fi

# 5. usdz
${BASH_3XR_DIR}/studio/export/usdz_from_glb.sh \
  -a ${asset_uid} \
  -n ${name} \
  -c ${submission_number}

# 6. Crate and Barrel zip (just for testing, this will get created once approved in client QA)
#${BASH_3XR_DIR}/studio/export/zip_for_crate_and_barrel.sh \
#  -a "${asset_uid}" \
#  -b "${name}" \
#  -c "${submission_number}" \
#  -n "${product_name}" \
#  -s "${sku}"

#glb_files=$(ls -lh "${source_dir}"*glb)
#xrs_log_info "${glb_files[@]}"
xrs_log_info "Done"
