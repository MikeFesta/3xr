#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# Unzip a file that was submitted
# Model name, id, and zip_name required

source $(dirname $0)/../../xrs.sh

# Read the name in from a flag
while getopts "i:n:z:" opt;
do
  case "$opt" in
  i)
    id=$OPTARG
    ;;
  n)
    name=$OPTARG
    ;;
  z)
    zip_name=$OPTARG
    ;;
  esac
done
if [ "${name}" = "" ]
then
  xrs_print_error_message "Model Name Required, run ./"$(basename "$0")" -n Model_Name"
  exit 1
fi
if [ "${id}" = "" ]
then
  xrs_print_error_message "Model ID Required, run ./"$(basename "$0")" -i Model_ID"
  exit 1
fi
if [ "${zip_name}" = "undefined" ]
then
  # This can happen when Unzip is called by an admin
  # In this case, just unzip the latest one
  xrs_print_warning_message "Zip folder not provided, attempting to unzip the newest"
  zip_path=$(ls -t ${INCOMING_3XR_DIR}/zips/${name}_* | grep -m 1 "")
  xrs_print_status_message "Zip file ${zip_name}"
else
  zip_path=${INCOMING_3XR_DIR}/zips/${zip_name}
fi
shortname=${name:0:8}

if [ -d ${X_PROJECTS_DIR}/${id}_${shortname}/ ];
then
  # Back up the existing folder - wasting disk space for now
  # Come up with a better backup strategy or way to clear this
  mkdir -p ${X_BACKUP_DIR}/${id}_${shortname}
  backup_count=$(ls -l ${X_BACKUP_DIR}/${id}_${shortname} | grep -c ^d)
  ((backup_count++))
  mv ${X_PROJECTS_DIR}/${id}_${shortname}/ ${X_BACKUP_DIR}/${id}_${shortname}/${backup_count}
fi

mkdir ${X_PROJECTS_DIR}/${id}_${shortname}

7z x -spe ${zip_path} -aoa -o${X_PROJECTS_DIR}/${id}_${shortname}

# DELETE the __MACOSX folder if it exists

if [ -d ${X_PROJECTS_DIR}/${id}_${shortname}/__MACOSX/ ];
then
  rm -r ${X_PROJECTS_DIR}/${id}_${shortname}/__MACOSX/
fi

# If there is only one folder, it is probably the nested folder problem
folder_count=$(ls -l ${X_PROJECTS_DIR}/${id}_${shortname} | grep -c ^d)
#if [ -d ${X_PROJECTS_DIR}/${id}_${shortname}/${name}/ ];
if [ $folder_count -eq 1 ]
then
  folder_name=$(ls -d ${X_PROJECTS_DIR}/${id}_${shortname}/*)
  xrs_print_warning_message "Nested folder ${folder_name} found, trying to fix"
  mv -u -v ${folder_name}/* ${X_PROJECTS_DIR}/${id}_${shortname}/
  rm -r ${folder_name}
fi
mkdir -p ${MODEL_DIR}/${name}
cp -r ${X_PROJECTS_DIR}/${id}_${shortname}/* ${MODEL_DIR}/${name}
xrs_print_status_message "${name}.zip Extacted\n"
