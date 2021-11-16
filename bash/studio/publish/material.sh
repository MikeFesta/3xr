#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Push material final directory to the website
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
uid=$(xrs_get_required_argument "u" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Publishing material ${name} to ${uid}"

if [ ! -d "${MATERIALS_DIR}/${uid}/final/" ]
then
  xrs_log_error "Material final directory not found"
  exit 1
fi

gsutil cp -r "${MATERIALS_DIR}/${uid}/final/${name}*" gs://cdn.3xr.com/materials/${uid}/ 2>&1
xrs_log_info "Published"
