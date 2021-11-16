#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh
# Upload files in the other folder
# This is very similar to product_images.sh, but looks in a
# different folder and uploads to a different endpoint

dir=$(xrs_get_required_argument "d" "$@")
if [ $? -ne 0 ]; then exit $?; fi

cd "${dir}"

for d in */
do
  uid_with_slash="${d##*_}"
  uid="${uid_with_slash%/}"
  if [ -z $uid ]; then xrs_log_error "No UID found"; exit 1; fi
  if [ ! ${#uid} -eq 12 ]; then xrs_log_error "Invalid UID ${uid}"; exit 1; fi
  xrs_log_debug "Uploading other files for ${uid}"
  cd "${d}other"
  for i in *
  do
    xrs_log_info "${i}"
    path=`pwd`
    python3 ${PYTHON_DIR}/upload/product_additional_file.py ${uid} "${path}/$i"
  done
  cd ../../
done
xrs_log_info "Done"
