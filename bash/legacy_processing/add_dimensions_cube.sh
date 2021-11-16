#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# The model name is passed as an argument -n name
source $(dirname $0)/xrs.sh
name=""
convert_from_inches=false

while getopts "n:w:h:d:i:" opt;
do
    case "$opt" in
    n)
        name=$OPTARG
        ;;
    h)
        height_in_mm=$OPTARG
        ;;
    w)
        width_in_mm=$OPTARG
        ;;
    d)
        depth_in_mm=$OPTARG
        ;;
    i)
        convert_from_inches=true
        ;;
    esac
done

if [ "$name" = "" ] || [ "$height_in_mm" = "" ] || [ "$width_in_mm" = "" ] || [ "$depth_in_mm" = "" ]
then
    xrs_print_error_message "Parameters Missing, run ./"$(basename "$0")" -n Model_Name -h {height} -w {width} -d {depth}"
else
    if [ $convert_from_inches = true ]
    then
        printf "Converting from inches\n"
        width_in_mm=$(echo "(((${width_in_mm} * 254) / 10))" | bc)
        depth_in_mm=$(echo "(((${depth_in_mm} * 254) / 10))" | bc)
        height_in_mm=$(echo "(((${height_in_mm} * 254) / 10))" | bc)
    fi

    xrs_print_status_message "Adding Cube with Dims: $width_in_mm $depth_in_mm $height_in_mm"
    # Blender 2.80
    blender --background --python-exit-code 1 -noaudio $MODEL_DIR/$name/blender/${name}.blend --python "${BLENDER_3XR_DIR}/add_dimensions_cube.py" -- $width_in_mm $depth_in_mm $height_in_mm
fi
