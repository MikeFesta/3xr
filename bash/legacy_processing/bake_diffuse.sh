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

# Bake Diffuse (high to low)
${POST_PROCESS_LOCATION}/4_bake_diffuse.sh -n ${name}
