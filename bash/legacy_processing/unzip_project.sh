#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# TODO: Remove this file, it has been moved to studio/transfer/
# Unzip a file that was submitted
# Model name is required

source $(dirname $0)/xrs.sh

# Read the name in from a flag
while getopts "i:n:" opt;
do
  case "$opt" in
  i)
    id=$OPTARG
    ;;
  n)
    name=$OPTARG
    ;;
  esac
done
if [ "${name}" = "" ]
then
  printf "ERROR: Model Name Required, run ./"$(basename "$0")" -n Model_Name\n"
  exit 1
fi
if [ "${id}" = "" ]
then
  printf "ERROR: Model ID Required, run ./"$(basename "$0")" -i Model_ID\n"
  exit 1
fi
shortname=${name:0:8}

7z x ${INCOMING_3XR_DIR}/zips/${name}.zip -aoa -o${X_PROJECTS_DIR}/${id}_${shortname}
if [ -d ${X_PROJECTS_DIR}/${id}_${shortname}/${name}/ ];
then
  printf "Nested folder found, fixing\n"
  mv ${X_PROJECTS_DIR}/${id}_${shortname}/${name}/* ${X_PROJECTS_DIR}/${id}_${shortname}/
  rmdir ${X_PROJECTS_DIR}/${id}_${shortname}/${name}
fi
cp -r ${X_PROJECTS_DIR}/${id}_${shortname}/* ${MODEL_DIR}/${name}
printf "${name}.zip Extacted\n"
