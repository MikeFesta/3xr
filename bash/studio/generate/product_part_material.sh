#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Automatically generate a product submission using a part + material          #
# Currently supports one part and multiple materials                           #
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments (just going alphabetically because it can only be 1 character)
product_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
product_name=$(xrs_get_required_argument "b" "$@")
if [ $? -ne 0 ]; then exit $?; fi
part_uid=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi
part_name=$(xrs_get_required_argument "d" "$@")
if [ $? -ne 0 ]; then exit $?; fi
material_slots=$(xrs_get_required_argument "e" "$@")
if [ $? -ne 0 ]; then exit $?; fi
material_uids=$(xrs_get_required_argument "f" "$@")
if [ $? -ne 0 ]; then exit $?; fi
material_names=$(xrs_get_required_argument "g" "$@")
if [ $? -ne 0 ]; then exit $?; fi
material_blend_modes=$(xrs_get_required_argument "h" "$@")
if [ $? -ne 0 ]; then exit $?; fi
#bake=$(xrs_get_optional_argument "i" "$@")
bake_mode=true

xrs_log_info "Auto-generating product ${product_name} (${product_uid}) \
submission with part ${part_name} (${part_uid}); \
slots: [${material_slots}]; \
materials: (${material_names}); \
mat_uids: (${material_uids}); \
bake mode: (${bake_mode}); \
transparencies: (${material_blend_modes});"

# Directories
product_dir="${PRODUCTS_DIR}/${product_uid}/"
part_dir="${PARTS_DIR}/${part_uid}/"

################################################################################
# 1. Copy the textures from the part and rename them to match the product name #
################################################################################
xrs_log_info "Copying part textures"
for texture in ${xrs_texture_types[@]}
do
  part_texture="${part_dir}textures/${part_name}_4k_${texture}.png"
  product_texture="${product_dir}textures/${product_name}_4k_${texture}.png"

  if [ -f "${part_texture}" ]
  then
    if [ -f "${product_texture}" ]
    then
      # Prevent locked files from blocking the copy
      rm -f "${product_texture}"
    fi
    xrs_log_debug "Copying Part ${texture}"
    cp "${part_texture}" "${product_texture}"
  fi
done

################################################################################
# 1a. Copy the textures from the materials if there are any.(when not baking   #
#     This is currently a bit of a hack for the Dune Collection, but           #
#     eventually these 2D baked material sheets could be mixed together for    #
#     products that don't bake but instead rely on pixel perfect 2D textures   #
################################################################################
if [ !${bake_mode} ]
then
  xrs_log_info "Copying material textures"
  IFS=',' read -r -a mat_uids <<< "${material_uids}"
  IFS=',' read -r -a mat_names <<< "${material_names}"
  i=0
  for uid in ${mat_uids[@]}
  do
    texture_dir="${MATERIALS_DIR}/${uid}/textures"
    for texture in ${xrs_texture_types[@]}
    do
      material_texture="${texture_dir}/${mat_names[$i]}_4k_${texture}.png"
      product_texture="${product_dir}textures/${product_name}_4k_${texture}.png"
      if [ -f "${material_texture}" ]
      then
        xrs_log_debug "Copying Material ${texture}"
        if [ -f "${product_texture}" ]
        then
          # Prevent locked files from blocking the copy
          rm -f "${product_texture}"
        fi
        cp "${material_texture}" "${product_texture}"
      fi
    done
    i=$((i+1))
  done
fi

################################################################################
# 2. Open the product blender file and import the components, run the script   #
################################################################################
product_filename="${product_dir}blender/${product_name}.blend"
part_filename="${part_dir}blender/${part_name}.blend"
bake=""
if [ ${bake_mode} == true ]
then
  bake="_bake"
fi

/3xr/programs/Blender290/blender290 \
  --background \
  --python-exit-code 1 \
  -noaudio \
  ${product_filename} \
  --python \
  "${BLENDER_3XR_DIR}/generate/product_part_material${bake}.py" \
  -- ${part_uid} ${part_name} ${part_filename} \
  ${MATERIALS_DIR} \
  ${material_slots} ${material_uids} ${material_names} ${material_blend_modes}

if [ $? -ne 0 ];
then
  xrs_log_error "Blender exited with an error"
  exit 1;
fi

# Restore the .blend1 file because the .blend was saved for submission and we want to restore to before start
mv "${product_filename}1" "${product_filename}"
