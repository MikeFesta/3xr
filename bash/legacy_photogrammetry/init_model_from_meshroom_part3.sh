#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# The model name is passed as an argument -n name
source $(dirname $0)/globals.sh
name=""

while getopts "n:" opt;
do
    case "$opt" in
    n)
        name=$OPTARG
        ;;
    esac
done

if [ "$name" = "" ]
then
    printf "ERROR: Model Name Required, run ./"$(basename "$0")" -n Model_Name\n"
else
    printf "Centering scan object based on cameras for $name\n"
    # Blender 2.80
    blender $MODEL_DIR/$name/blender/${name}.blend --python "${BLENDER_3XR_DIR}/center_scan_from_cameras.py"
fi
