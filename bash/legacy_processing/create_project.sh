#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# The model name is passed as an argument -n name
# The model uid is passed as an  argument -u uid
source $(dirname $0)/xrs.sh
name=""

while getopts "n:u:h:w:d:" opt;
do
    case "$opt" in
    n)
        name=$OPTARG
        ;;
    u)
        uid=$OPTARG
        ;;
    h)
        # TODO: Confirm this can be sent as a float for added precision
        height_in_mm=$OPTARG
        ;;
    w)
        width_in_mm=$OPTARG
        ;;
    d)
        depth_in_mm=$OPTARG
        ;;
    esac
done

if [ "$name" = "" ]
then
    xrs_print_error_message "ERROR: Model Name Required, run ./"$(basename "$0")" -n Model_Name -u UID"
else
    if [ "$uid" = "" ]
    then
        xrs_print_error_message "ERROR: UID required,  run ./"$(basename "$0")" -n ${name} -u UID"
    else
        xrs_print_status_message "Creating model with name ${name} for assignment uid ${uid} with dimensions ${width_in_mm}, ${depth_in_mm}, ${height_in_mm}"
        project_dir=$MODEL_DIR/$name
        mkdir -p ${project_dir}
        mkdir -p ${project_dir}/blender
        mkdir -p ${project_dir}/photos
        mkdir -p ${project_dir}/textures
        echo ${uid} > ${project_dir}/.assignment_uid

        # Copy from the template (only if it does not exist)
        cp --no-clobber "${RESOURCES_DIR}/blender/new_model_template.blend" "${project_dir}/blender/${name}.blend" || true

        # Add the dimensions cube
        ${BASH_3XR_DIR}/add_dimensions_cube.sh -n ${name} -i true -w ${width_in_mm} -d ${depth_in_mm} -h ${height_in_mm}

        # This should be able to create the file
        #blender $MODEL_DIR/$name/blender/${name}.blend --python "${BLENDER_3XR_DIR}/add_dimensions_cube.py" -- $width_in_mm $depth_in_mm $height_in_mm
    fi
fi
