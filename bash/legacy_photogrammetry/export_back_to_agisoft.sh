#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# This allows the new (clean) model in blender to be exported as fbx for
# Agisoft in the original location, rotation, and scale
#
# The model name is passed as an argument -n model_name
source $(dirname $0)/globals.sh
height_in_mm=""

while getopts "n:" opt;
do
    case "$opt" in
    n)
        model_name=$OPTARG
        ;;
    esac
done

if [ "$model_name" = "" ]
then
    printf "ERROR: Model Name Required, run ./"$(basename "$0")" -n Model_Name\n"
else
    printf "Exporting low poly model ($model_name) in Agisoft world space\n"
    file="$MODEL_DIR/$model_name/intermediate/$model_name.blend"
    blender $file --python "$BLENDER_3XR_DIR/export_back_to_agisoft.py"
fi
