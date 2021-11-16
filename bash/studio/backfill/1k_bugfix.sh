#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# On 1/21 discovered an issue with assets processed since 11/10                #
# This script fixes models impacted by that bug                                #
# The Problem:                                                                 #
# - export/glb_for_submission.sh check for file over 10mb always returned true #
# The Result:                                                                  #
# - All glb (and usdz) files were reprocessed with 1k diffuse textures         #
# - Each of those submissions has a file named glb_test.glb, which is a good   #
#   check to know if a model is in 1k                                          #
# - 219 assets impacted. asset_submission.id range: 2779 to 3338               #
# This Fix:                                                                    #
# - Check the folder for a glb_test.glb file to confirm reprocessing is needed #
# - Run process/product_submission_no_renders.sh                               #
# - Run publish/asset_submission.sh                                            #
# - Run transfer/asset_for_project.sh                                          #
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
blend_name=$(xrs_get_required_argument "b" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
project_uid=$(xrs_get_required_argument "p" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_id=$(xrs_get_required_argument "s" "$@")
if [ $? -ne 0 ]; then exit $?; fi
xrs_log_info "Fixing 1k texture for: asset_uid ${asset_uid}, submission id ${submission_id}"

source_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"

################################################################################
# 0. Check if this submission was impacted by the bug, skip if not             #
################################################################################
if [ ! -f ${source_dir}glb_test.glb ]
then
  xrs_log_warn "This submission was not impacted by the bug"
  exit 1
fi


################################################################################
# 1. Reprocess the files                                                       #
################################################################################
${BASH_3XR_DIR}/studio/process/product_submission_no_renders.sh \
  -a ${asset_uid} \
  -c ${submission_number} \
  -n ${blend_name} \
  -s ${submission_id}


################################################################################
# 2. Publish                                                                   #
################################################################################
${BASH_3XR_DIR}/studio/publish/asset_submission.sh \
  -c ${submission_number} \
  -n ${blend_name} \
  -u ${asset_uid}


################################################################################
# 3. Copy to projects for delivery                                             #
################################################################################
${BASH_3XR_DIR}/studio/transfer/asset_for_project.sh \
  -a ${asset_uid} \
  -b ${blend_name} \
  -n "${name}" \
  -p ${project_uid}

xrs_log_info "Done"
