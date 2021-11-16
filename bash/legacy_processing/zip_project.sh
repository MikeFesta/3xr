#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# Create a .zip file for the given model
# Model name is required
# Create a random password and store it in the database
# Split off the first 10k of the file to be served with the password
# or remove random bytes from the final .7z output to be re-added later.
# also store the hash in the database

source $(dirname $0)/xrs.sh
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
    # TODO: check that the model directory exists
    7z a ${TEMP_DIR}/${model_name}.zip ${MODEL_DIR}/${model_name}/photos/ ${MODEL_DIR}/${model_name}/blender/ ${MODEL_DIR}/${model_name}/textures/ -xr!*.blend1 -xr!@*
    mv ${TEMP_DIR}/${model_name}.zip ${OUTGOING_3XR_DIR}/
    #sudo chown ntwkusr:ntwkusr ${OUTGOING_3XR_DIR}/${model_name}.3xr
    printf "${model_name}.3xr moved to ${OUTGOING_3XR_DIR}\n"
fi
