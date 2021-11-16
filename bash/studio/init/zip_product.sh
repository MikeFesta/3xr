#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

###############################################################################
# This file creates a template folder structure of all products in a project  #
# It is used by the client to add images or reference data to bulk upload     #
###############################################################################

# Get arguments
product_uid=$(xrs_get_required_argument "i" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Zipping product uid ${product_uid}"

product_dir=${PRODUCTS_DIR}/${product_uid}
logs_dir=${product_dir}/logs

# Create a zip with the correct folder structure and the blend file
cd ${PRODUCTS_DIR}/${product_uid}

# Remove the old zip (if it exists) to get a fresh start
if [ -f ${product_uid}.zip ]
then
  rm ${product_uid}.zip \
  2>&1 | tee -a ${logs_dir}/remove_zip.log
fi

# Create the .zip for artists to download
zip ${product_uid}.zip blender/${name}.blend \
2>&1 | tee -a ${logs_dir}/zip.log

zip -r --exclude=*@eaDir* ${product_uid}.zip .library/ \
2>&1 | tee -a ${logs_dir}/zip.log

zip -r --exclude=*@eaDir* --exclude=*.tif ${product_uid}.zip reference/ \
2>&1 | tee -a ${logs_dir}/zip.log

zip ${product_uid}.zip textures/ \
2>&1 | tee -a ${logs_dir}/zip.log
