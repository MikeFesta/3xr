#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# Re-import the agisoft fbx file as the Original model
# The model name is passed as an argument -n model_name
source $(dirname $0)/globals.sh

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
    printf "Reimporting original model ($model_name) from Agisoft fbx\n"
    file="$MODEL_DIR/$model_name/intermediate/$model_name.blend"
    blender $file --python "$BLENDER_3XR_DIR/reimport_scan.py"
fi
