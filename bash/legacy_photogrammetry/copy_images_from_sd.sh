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
    ls ${SD_CARD}/*.CR2
    mv ${SD_CARD}/*.CR2 "${MODEL_DIR}/$name/raw_photos/"
fi
