#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# The model name is passed as an argument -n name
source $(dirname $0)/xrs.sh
source $(dirname $0)/name_flag.sh

xrs_print_status_message "Fixing Meshroom Texture Location for ${name} with model in ${MODEL_DIR}"

# Get the name of the directory with the textured mesh - meshroom creates a hash
hash=$(ls -t -I "@*" ${MODEL_DIR}/${name}/meshroom/MeshroomCache/Texturing/ | grep -m 1 "")

# Copy the texture file(s) from the meshroom folder to the textures folder
cp ${MODEL_DIR}/${name}/meshroom/MeshroomCache/Texturing/${hash}/*.png ${MODEL_DIR}/${name}/textures/

# After the .blend file is created, open it with Blender 2.80 to finish init
blender $MODEL_DIR/$name/blender/${name}.blend --background --python-exit-code 1 -noaudio --python "${BLENDER_3XR_DIR}/fix_missing_meshroom_textures.py" -- $MODEL_DIR $name $hash
