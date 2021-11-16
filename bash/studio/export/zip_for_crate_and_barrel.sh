#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Export a .zip of the product based on Crate & Barrel's specifications        #
################################################################################
source $(dirname $0)/../../xrs.sh

asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
blend_name=$(xrs_get_required_argument "b" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
sku=$(xrs_get_required_argument "s" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Exporting Crate & Barrel (.zip) for ${asset_uid}, submission number ${submission_number}"

final_dir="${ASSETS_DIR}/${asset_uid}/final/"
source_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"
textures_dir="${source_dir}generated/"
product_name="${sku}_${name}"

# Delete directories if they already exist, then re-create
cb_dir="${source_dir}${product_name}/"
if [ -d "${cb_dir}" ]
then
  # Allows this to be re-run, otherwis there could be file permission issues
  rm -rf "${cb_dir}"
fi
mkdir "${cb_dir}"


################################################################################
# GLB                                                                          #
#   Copy and rename the .glb                                                   #
################################################################################
cb_glb_dir="${cb_dir}glb/"
[ -d "${cb_glb_dir}" ] || mkdir "${cb_glb_dir}"
source_glb="${source_dir}${blend_name}.glb"
if [ -f ${source_glb} ]
then
  cp "$source_glb" "${cb_glb_dir}${product_name}.glb"
  xrs_log_info "GLB copied"
else
  xrs_log_error "GLB not found at ${source_glb}"
fi


################################################################################
# USDZ                                                                         #
#   Copy and rename the .usdz                                                  #
################################################################################
cb_usdz_dir="${cb_dir}usdz/"
[ -d "${cb_usdz_dir}" ] || mkdir "${cb_usdz_dir}"
source_usdz="${source_dir}${blend_name}.usdz"
if [ -f ${source_usdz} ]
then
  cp "$source_usdz" "${cb_usdz_dir}${product_name}.usdz"
  xrs_log_info "USDZ copied"
else
  xrs_log_error "USDZ not found at ${source_usdz}"
fi


################################################################################
# GLTF                                                                         #
#   Rename the textures (uses ORM)                                             #
#   Link the textures with the new names in blender                            #
#   Export the .gltf format from blender                                       #
################################################################################
cb_gltf_dir="${cb_dir}gltf/"
[ -d "${cb_gltf_dir}" ] || mkdir "${cb_gltf_dir}"

# ORM file is required, so make sure it has been generated
# Note that too many files may end up getting created because of material detection in the submission folder
# Also note that this only makes 4k textures
${BASH_3XR_DIR}/studio/textures/generate_orm.sh \
  -a "${asset_uid}" \
  -c "${submission_number}"
# Rename 2k diffuse / 1k other files based on the crate and barrel specs
xrs_load_material_names "${textures_dir}"
for material_name in "${xrs_material_names[@]}"
do
  cp "${textures_dir}${material_name}_2k_diffuse.png" "${cb_gltf_dir}${material_name}_diffuse.png" 2>/dev/null
  cp "${textures_dir}${material_name}_1k_normal.png" "${cb_gltf_dir}${material_name}_normal.png" 2>/dev/null
  # ORM may only be at 4k, if so, resize to 1k
  if [ ! -f "${textures_dir}${material_name}_1k_orm.png" ]
  then
    xrs_log_info "Resizing ORM"
    convert "${textures_dir}${material_name}_4k_orm.png" \
    -scale 25% \
    "${textures_dir}${material_name}_1k_orm.png"
  fi
  cp "${textures_dir}${material_name}_1k_orm.png" "${cb_gltf_dir}${material_name}_occlusionRoughnessMetallic.png" 2>/dev/null
done

/3xr/programs/Blender290/blender290 \
  --background \
  --python-exit-code 1 \
  -noaudio "${source_dir}${blend_name}.blend" \
  --python "${BLENDER_3XR_DIR}/export/gltf_for_crate_and_barrel.py" \
  -- "${cb_gltf_dir}" "${product_name}"

exit_status=$?
if [ "${exit_status}" -ne 0 ]
then
  xrs_log_error "Unable to generate GLTF - Blender exited with non-zero exit code: ${exit_status}"
else
  xrs_log_info "GLTF created"
fi


################################################################################
# SourceFiles                                                                  #
#   Rename the blender file with the packed textures                           #
#   Export a .fbx and textures to the Crate & Barrel spec                      #
################################################################################
cb_sourcefiles_dir="${cb_dir}SourceFiles/"
[ -d "${cb_sourcefiles_dir}" ] || mkdir "${cb_sourcefiles_dir}"

# Keeping the blender file out to save space
#cp "${source_dir}${blend_name}.blend" "${cb_sourcefiles_dir}${product_name}.blend"
# Copy and rename the 4k textures based on the crate and barrel specs
xrs_load_material_names "${textures_dir}"
for material_name in "${xrs_material_names[@]}"
do
  if [ -f "${source_dir}${material_name}_4k_diffuse.png" ]
  then
    cp "${source_dir}${material_name}_4k_diffuse.png" "${cb_sourcefiles_dir}${material_name}_diffuse.png"
    convert "${cb_sourcefiles_dir}${material_name}_diffuse.png" -background white -flatten "${cb_sourcefiles_dir}${material_name}_diffuse.jpg"
  fi
  if [ -f "${source_dir}${material_name}_4k_normal.png" ]
  then
    cp "${source_dir}${material_name}_4k_normal.png" "${cb_sourcefiles_dir}${material_name}_normal.png"
    convert "${cb_sourcefiles_dir}${material_name}_normal.png" -background white -flatten "${cb_sourcefiles_dir}${material_name}_normal.jpg"
  fi
  if [ -f "${source_dir}${material_name}_4k_opacity.png" ]
  then
    cp "${source_dir}${material_name}_4k_opacity.png" "${cb_sourcefiles_dir}${material_name}_alpha.png"
    convert "${cb_sourcefiles_dir}${material_name}_alpha.png" -background white -flatten "${cb_sourcefiles_dir}${material_name}_alpha.jpg"
  fi
  if [ -f "${source_dir}${material_name}_4k_metallic.png" ]
  then
    cp "${source_dir}${material_name}_4k_metallic.png" "${cb_sourcefiles_dir}${material_name}_metalness.png"
    convert "${cb_sourcefiles_dir}${material_name}_metalness.png" -background white -flatten "${cb_sourcefiles_dir}${material_name}_metalness.jpg"
  fi
  if [ -f "${source_dir}${material_name}_4k_roughness.png" ]
  then
    cp "${source_dir}${material_name}_4k_roughness.png" "${cb_sourcefiles_dir}${material_name}_roughness.png"
    convert "${cb_sourcefiles_dir}${material_name}_roughness.png" -background white -flatten "${cb_sourcefiles_dir}${material_name}_roughness.jpg"
  fi
  if [ -f "${source_dir}${material_name}_4k_ao.png" ]
  then
    cp "${source_dir}${material_name}_4k_ao.png" "${cb_sourcefiles_dir}${material_name}_occlusion.png"
    convert "${cb_sourcefiles_dir}${material_name}_occlusion.png" -background white -flatten "${cb_sourcefiles_dir}${material_name}_occlusion.jpg"
  fi
  # TODO: could create new .png files from .values, but not going to bother unless it is requested
done

# Export an FBX
/3xr/programs/Blender290/blender290 \
  --background \
  --python-exit-code 1 \
  -noaudio "${source_dir}${blend_name}.blend" \
  --python "${BLENDER_3XR_DIR}/export/fbx_for_crate_and_barrel.py" \
  -- "${cb_sourcefiles_dir}" "${product_name}"

exit_status=$?
if [ "${exit_status}" -ne 0 ]
then
  xrs_log_error "Unable to generate FBX - Blender exited with non-zero exit code: ${exit_status}"
else
  xrs_log_info "FBX created"
fi


################################################################################
# ZIP                                                                          #
#   Bundle the files into a zip                                                #
#   Upload to cdn                                                              #
################################################################################
cd "${source_dir}"
zip -r --exclude=*@eaDir* "${product_name}.zip" "${product_name}/"

# Move to final directory and upload to cdn
mv "${product_name}.zip" "${final_dir}"
${BASH_3XR_DIR}/studio/publish/asset.sh -u ${asset_uid}
