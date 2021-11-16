#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# Rename an Agisoft project and linked photos for the given model
# The model name is passed as an argument -n name
source $(dirname $0)/globals.sh
name=""

# Get the arguments (-n is required)
while getopts "n:" opt;
do
    case "$opt" in
    n)
        name=$OPTARG
    esac
done

if [ "$name" = "" ]
then
    printf "ERROR: Model Name Required, run ./"$(basename "$0")" -n Model_Name\n"
else
    if [ ! -d "$MODEL_DIR/$name/intermediate" ];
    then
        printf "ERROR: Directory does not exist: $MODEL_DIR/$name/intermediate\n"
    else
        # Agisoft has uses two files *.psx and *.files
        printf "Renaming Agisoft project in Directory $dir\n"

        # Check that file *.psx exists and rename it
        dir="$MODEL_DIR/$name/intermediate/*.psx"
        for filename in $dir
        do
            # Error handeling for no results
            [ -e "$filename" ] || continue
            # Keep the last 3 digit number 001.JPG
            printf "$filename >> ${name}.psx\n"
            mv $filename "$MODEL_DIR/$name/intermediate/${name}.psx"
        done

        # Check that *.files exists and rename it
        dir="$MODEL_DIR/$name/intermediate/*.files"
        for filename in $dir
        do
            # Error handeling for no results
            [ -e "$filename" ] || continue
            # Keep the last 3 digit number 001.JPG
            printf "$filename >> ${name}.files\n"
            mv $filename "$MODEL_DIR/$name/intermediate/${name}.files"
        done

        # TODO: Update references inside the .files directory
    fi
fi
