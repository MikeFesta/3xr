#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# The model name is passed as an argument -n name
source $(dirname $0)/xrs.sh
source $(dirname $0)/name_flag.sh

printf "PART2: Creating model from meshroom for ${name} with model in ${MODEL_DIR}\n"

# Get the name of the directory with the textured mesh - meshroom creates a hash
hash=$(ls -t -I "@*" ${MODEL_DIR}/${name}/meshroom/MeshroomCache/Texturing/ | grep -m 1 "")

# Copy the texture file(s) from the meshroom folder to the textures folder
cp ${MODEL_DIR}/${name}/meshroom/MeshroomCache/Texturing/${hash}/*.png ${MODEL_DIR}/${name}/textures/

# After the .blend file is created, open it with Blender 2.80 to finish init
blender $MODEL_DIR/$name/blender/${name}.blend --python "${BLENDER_3XR_DIR}/init_model_from_meshroom.py" -- $MODEL_DIR $name $hash
