#! /bin/bash
# SPDX-License-Identifier: Apache-2.0
###############################################################################
### POST PROCESSING
###############################################################################
source $(dirname $0)/xrs.sh
source $(dirname $0)/name_flag.sh
POST_PROCESS_LOCATION="/3xr/code/bash/asset/postprocess/"

# Ensure that the folder exists
if [ ! -d "${MODEL_DIR}/${name}" ];
then
  xrs_print_error_message "Folder ${MODEL_DIR}/${name} Not Found. Check name or run 0_unarchive.sh"
  exit 1
fi

# Validate the .blend file to make sure it has the correct objects, materials
${POST_PROCESS_LOCATION}/0_validate.sh -n ${name}
if [ $? -ne 0 ];
then
  xrs_print_error_message "${MODEL_DIR}/${name}/blender/${name}.blend not valid, exiting"
  exit 1
fi

# Update Project Report File - eventually post to the server
## Cameras Aligned (pre-processing)
## Cameras Auto-Fixed ie) how many still at 0,0,0
## Triangle Count
## Material Slot Values (metallic, roughness)
## Textures Linked

# Export high res + low res mesh as .obj
${POST_PROCESS_LOCATION}/1_export_obj.sh -n ${name}
if [ $? -ne 0 ];
then
  xrs_print_error_message "Unable to create obj, exiting"
  exit 1
fi

# Create 2.79 .blend file /279_{name}.blend from template
# - Import .obj files
${POST_PROCESS_LOCATION}/2_create_blender_279_file.sh -n ${name}
if [ $? -ne 0 ];
then
  xrs_print_error_message "Unable to create Blender 2.79 file, exiting"
  exit 1
fi

# Bake AO (low res model) - only if the _AO image is not in textures
# - Create a Ground Plane for AO
${POST_PROCESS_LOCATION}/3_bake_ao.sh -n ${name}
if [ $? -ne 0 ];
then
  xrs_print_error_message "Unable to bake AO, exiting"
  exit 1
fi

# Bake Diffuse (high to low)
${POST_PROCESS_LOCATION}/4_bake_diffuse.sh -n ${name}

# Bake Normals (high to low) - only if the _Normal image is not in textures
${POST_PROCESS_LOCATION}/4_bake_normal.sh -n ${name}

# Bake Metallic (high to low)
${POST_PROCESS_LOCATION}/4_bake_metallic.sh -n ${name}

# Bake Roughness (high to low)
${POST_PROCESS_LOCATION}/4_bake_roughness.sh -n ${name}

# Create ORM texture for the gltf to use
${POST_PROCESS_LOCATION}/5_generate_orm.sh -n ${name}

# Convert any .pngs to .jpg
${POST_PROCESS_LOCATION}/6_create_jpgs.sh -n ${name}

# Resize images (4k, 2k, 1k) with IMAGE MAGIK
# - Run after AO / Normal bake
# - Also convert .png to .jpg
# - Don't replace existing files - require a manual delete
${POST_PROCESS_LOCATION}/7_resize_textures.sh -n ${name}

# Create gltf material based on material settings and images available
# Export .glb file
${POST_PROCESS_LOCATION}/8_generate_gltf.sh -n ${name}

# Create the USDZ model (** NEEDS TO RUN ON MAC **)
# TODO: Put in in a job queue on the OSX server
# -- or see if this can be done with a web socket
# Export .obj (100x scale)
# ${POST_PROCESS_LOCATION}/9_generate_usdz.sh -n ${name}

## CONTINUED IN PART 2 ##

# Render Preview Image
# ${POST_PROCESS_LOCATION}/10_render_preview.sh -n ${name}

# Upload files to the website
# ${POST_PROCESS_LOCATION}/11_publish.sh -n ${name}

# Move to complete
# ${POST_PROCESS_LOCATION}/12_complete.sh -n ${name}
