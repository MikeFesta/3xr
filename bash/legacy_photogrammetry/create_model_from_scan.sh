#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# The model name is passed as an argument -n name
source $(dirname $0)/globals.sh
name=""
height_in_mm=100

while getopts "n:h:" opt;
do
    case "$opt" in
    n)
        name=$OPTARG
        ;;
    h)
        height_in_mm=$OPTARG
    esac
done

if [ "$name" = "" ]
then
    printf "ERROR: Model Name Required, run ./"$(basename "$0")" -n Model_Name -h {height in mm}\n"
else
    if [ "$height_in_mm" = "" ]
    then
        printf "ERROR: Model Height Required, run ./"$(basename "$0")" -n Model_Name -h {height in mm}\n"
    else
        printf "Creating model from scan for ${name} with model in ${MODEL_DIR} with height ${height_in_mm}\n"
        blender --background --python "${BLENDER_3XR_DIR}/create_model_from_scan.py" -- $MODEL_DIR $name $height_in_mm
    fi
fi
