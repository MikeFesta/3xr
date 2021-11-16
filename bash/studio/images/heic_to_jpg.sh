#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Convert images from Apple's .heic compressed format to jpeg                  #
# This is initially being used for photogrammetry from iPhone 12 scanning      #
# NOTE: This requires Imagemagik with libheif                                  #
################################################################################
source $(dirname $0)/../../xrs.sh

source_dir=$(xrs_get_required_argument "d" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Converting heic to jpg for folder ${source_dir}"

cd "${source_dir}"
for file in *.heic
do
  xrs_log_debug "${file}"
  jpg="${file%.heic}.jpg"
  convert "${file}" -flatten "${jpg}"
done

xrs_log_info "Done"

exit
