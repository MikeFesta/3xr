#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Convert all tif reference images to jpgs so they will be visable on the web  #
# This should happen when customers upload files to product_reference_images   #
################################################################################
source $(dirname $0)/../../xrs.sh

product_uid=$(xrs_get_required_argument "p" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Converting reference tif images to jpgs for product_uid ${product_uid}"

source_dir="${PRODUCTS_DIR}/${product_uid}/reference/images/"

cd "${source_dir}"
for file in *.tif
do
  xrs_log_debug "${file}"
  jpg="${file%.tif}.jpg"
  convert "${file}" -flatten "${jpg}"
done

xrs_log_info "Done"

exit
