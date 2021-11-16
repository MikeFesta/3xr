#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# Unzip a file that was submitted with product information
# reference images and other data
# Project uid and filename required

source $(dirname $0)/../../xrs.sh

zip_name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
project_uid=$(xrs_get_required_argument "u" "$@")
if [ $? -ne 0 ]; then exit $?; fi

# TODO: May want to flag or auto-retry failed uploads because they happen sometimes

parent_dir="${PROJECTS_DIR}/${project_uid}/"
zip_dir="${parent_dir}uploads/"
log_file="${zip_dir}/${zip_name%.*}.log"
exec >>"${log_file}" 2>&1
xrs_print_status_message "Zip file ${zip_name} at ${zip_dir}"

if [ -d ${zip_dir} ];
then
  xrs_print_status_message "Directory Found"
else
  xrs_print_error_message "Directory Not Found"
  exit 1
fi

if [ -f "${zip_dir}${zip_name}" ];
then
  xrs_print_status_message "File Found"
else
  xrs_print_error_message "File Not Found"
  exit 1
fi

# Extract the files
7z x -spe "${zip_dir}${zip_name}" -aoa -o"${zip_dir}"

# DELETE the __MACOSX folder if it exists
if [ -d "${zip_dir}__MACOSX/" ];
then
  xrs_print_status_message "Deleting MAX OSX Folder"
  rm -r "${zip_dir}__MACOSX/"
fi

# Note: it may be better to re-write this to move the files and send an array of
# filenames to the server for recordings. Currently it uploads each file one at a time
# Run the image and extra file upload scripts
directory_count=`find "${zip_dir}" -maxdepth 1 -mindepth 1 -type d | wc -l`
if [ "${directory_count}" != 1 ]
then
  xrs_print_error_message "Expected one directory, found ${directory_count}"
  # move those directories out of here to prevent subsequent uploads from failing
  parent_directory_count=`find "${parent_dir}" -maxdepth 1 -mindepth 1 -type d | wc -l`
  failed_dir="${parent_dir}failed_upload_${parent_directory_count}"
  mkdir "${failed_dir}"
  cd "${zip_dir}"
  mv */ "${failed_dir}"
  # TODO: need to inform the user of this error
  exit 1
fi
extracted_folder=`find "${zip_dir}" -maxdepth 1 -mindepth 1 -type d`
xrs_print_status_message "Attempting to upload images from ${extracted_folder}"
${BASH_3XR_DIR}/studio/upload/product_images.sh -d "${extracted_folder}"

# Upload "other" files
xrs_print_status_message "Attempting to upload other files from ${extracted_folder}"
${BASH_3XR_DIR}/studio/upload/product_additional_files.sh -d "${extracted_folder}"

# Delete the folder
rm -r "${extracted_folder}"

xrs_print_status_message "Files uploaded for ${project_uid}"
