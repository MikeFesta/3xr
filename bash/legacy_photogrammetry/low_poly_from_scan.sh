#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# The is the next step after create_model_from_scan.sh (TODO: Combine them)
# The model name is passed as an argument -n model_name
source $(dirname $0)/globals.sh
model_name=""

while getopts "n:" opt;
do
    case "$opt" in
    n)
        model_name=$OPTARG
        ;;
    esac
done

if [ "${model_name}" = "" ]
then
    printf "ERROR: Model Name Required, run ./"$(basename "$0")" -n Model_Name\n"
else
    printf "Creating low poly model (${model_name}) from scan\n"
    file="$MODEL_DIR/${model_name}/intermediate/${model_name}.blend"
    blender $file --python "$BLENDER_3XR_DIR/low_poly_from_scan.py"
fi
