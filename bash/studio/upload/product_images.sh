#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh
# Upload product images - folder names end with the product uid

dir=$(xrs_get_required_argument "d" "$@")
if [ $? -ne 0 ]; then exit $?; fi

cd "$dir"

for d in */
do
  uid_with_slash="${d##*_}"
  uid="${uid_with_slash%/}"
  if [ -z $uid ]; then xrs_log_error "No UID found"; exit 1; fi
  if [ ! ${#uid} -eq 12 ]; then xrs_log_error "Invalid UID ${uid}"; exit 1; fi
  xrs_log_debug "Uploading Images for ${uid}"
  cd "${d}images"
  for i in *
  do
    xrs_log_info "${i}"
    path=`pwd`
    python3 ${PYTHON_DIR}/upload/product_image.py ${uid} "${path}/$i"
  done
  cd ../../
done
xrs_log_info "Done"
