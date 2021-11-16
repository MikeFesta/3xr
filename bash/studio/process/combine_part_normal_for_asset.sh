#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Combine the normal map from the part with the asset submission               #
# Get the normal map from the part and combine it with the current normal map  #
# for the asset submission that was baked from the materials                   #
# This is being written for Freeflow spa model processing on 6/3/21            #
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi
asset_name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
part_name=$(xrs_get_required_argument "p" "$@")
if [ $? -ne 0 ]; then exit $?; fi
part_uid=$(xrs_get_required_argument "u" "$@")
if [ $? -ne 0 ]; then exit $?; fi
xrs_log_info "Combining part (${part_name}) normal with asset ${asset_name}"

################################################################################
# 1. Build the file names                                                      #
################################################################################
asset_submission_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"
asset_normal="${asset_submission_dir}${asset_name}_4k_normal.png"
part_normal="${PARTS_DIR}/${part_uid}/textures/${part_name}_4k_normal.png"

################################################################################
# 2. Run the combine script                                                    #
################################################################################
${BASH_3XR_DIR}/studio/textures/combine_normal.sh \
  -b ${part_normal} \
  -d ${asset_normal} \
  -o ${asset_submission_dir}
