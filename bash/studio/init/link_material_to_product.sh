#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Link materials to product
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
product_uid=$(xrs_get_required_argument "u" "$@")
if [ $? -ne 0 ]; then exit $?; fi
product_name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
material_uid=$(xrs_get_required_argument "i" "$@")
if [ $? -ne 0 ]; then exit $?; fi
material_name=$(xrs_get_required_argument "m" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Linking material ${material_name} with product ${product_name}"

if [ ! -f "${PRODUCTS_DIR}/${product_uid}/blender/${product_name}.blend" ]
then
  xrs_log_error "Assignment blend file not found"
  exit 1
fi
if [ ! -f "${MATERIALS_DIR}/${material_uid}/blender/${material_name}.blend" ]
then
  xrs_log_error "Material blend file not found"
  exit 1
fi
blender281_xrs --background --python-exit-code 1 -noaudio ${PRODUCTS_DIR}/${product_uid}/blender/${product_name}.blend --python "${BLENDER_3XR_DIR}/init/link_material_to_product.py -- ${MATERIALS_DIR}/${material_uid}/blender/${material_name}.blend"
exit_status=$?
if [ "${exit_status}" -ne 0 ]
then
  xrs_log_error "Blender exited with non-zero exit code: ${exit_status}"
  exit 1
fi
