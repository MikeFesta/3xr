#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# The model name is passed as an argument -n name
source $(dirname $0)/xrs.sh
source $(dirname $0)/name_flag.sh

xrs_print_status_message "Creating model from meshroom for ${name} with model in ${MODEL_DIR}"

# Create the blender folder if it does not exist
mkdir -p ${MODEL_DIR}/${name}/blender

# 1. Import cameras from meshroom
# Get the name of the directory with the camera data - meshroom creates a hash
sfm_hash=$(ls -t -I "@*" ${MODEL_DIR}/${name}/meshroom/MeshroomCache/StructureFromMotion/ | grep -m 1 "")
xrs_print_status_message "Extracting cameras from ${sfm_hash}"
# Using Blender 2.78 for .abc camera import because it is broken in 2.79/2.80
blender278 --python-exit-code 1 -noaudio --python "${BLENDER_3XR_DIR}/init_model_with_meshroom_cameras.py" -- ${MODEL_DIR} ${name} ${sfm_hash}
#blender278 --background --python-exit-code 1 -noaudio --python "${BLENDER_3XR_DIR}/init_model_with_meshroom_cameras.py" -- ${MODEL_DIR} ${name} ${sfm_hash}

# 2. Import Mesh
# Get the name of the directory with the textured mesh - meshroom creates a hash
texture_hash=$(ls -t -I "@*" ${MODEL_DIR}/${name}/meshroom/MeshroomCache/Texturing/ | grep -m 1 "")
xrs_print_status_message "Importing mesh from ${sfm_hash}"
# After the .blend file is created, open it with Blender 2.80 to finish init
#blender ${MODEL_DIR}/${name}/blender/${name}.blend --background --python-exit-code 1 -noaudio --python "${BLENDER_3XR_DIR}/init_model_from_meshroom.py" -- ${MODEL_DIR} ${name} ${texture_hash}

# 3. Rotate mesh based on camera rings
#blender ${MODEL_DIR}/${name}/blender/${name}.blend --background --python-exit-code 1 -noaudio --python "${BLENDER_3XR_DIR}/center_scan_from_cameras.py"
