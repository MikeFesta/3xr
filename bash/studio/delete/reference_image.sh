#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

# Get arguments
product_uid=$(xrs_get_required_argument "i" "$@")
if [ $? -ne 0 ]; then exit $?; fi
filename=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Deleting reference image for ${product_uid} filename: ${filename}"
file_to_delete="${PRODUCTS_DIR}/${product_uid}/reference/images/${filename}"
zip_file="${PRODUCTS_DIR}/${product_uid}/${product_uid}.zip"

if [ -f ${file_to_delete} ]
then
  xrs_log_debug "Deleting ${file_to_delete}"
  rm -f ${file_to_delete}
  if [ -f ${zip_file} ]
  then
    xrs_log_debug "Zip file found, removing image"
    zip -d ${zip_file} "reference/images/${filename}"
  fi
else
  xrs_log_error "File not found: ${file_to_delete}"
fi
