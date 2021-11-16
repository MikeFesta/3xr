#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Export 3D models for a product submission                                    #
# 1. GLB                                                                       #
# 2. USDZ (requires .glb)                                                      #
# 3. FBX ZIP (Amazon specification)                                            #
# 4. General FBX ZIP                                                           #
# 5. Zappar GLB (Zappar specification)                                         #
# NOTE: Removed non-error status changes (9, 11, 17)                           #
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi
asin=$(xrs_get_optional_argument "i" "$@")
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_id=$(xrs_get_required_argument "s" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Exporting models for product submission: asset_uid ${asset_uid}, number ${submission_id}, asin ${asin}"

working_dir=${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/
logs_dir="${working_dir}/logs"
mkdir -p "${logs_dir}"

################################################################################
# 1. GLB                                                                       #
################################################################################
# .value files are used by the blender code to create the glb
cp ${working_dir}/*.value ${working_dir}/generated 2>/dev/null
${BASH_3XR_DIR}/studio/export/glb_for_submission.sh \
  -a ${asset_uid} \
  -n ${name} \
  -c ${submission_number} \
  2>&1 | tee -a ${logs_dir}/glb.log

if [ $? -ne 0 ];
then
  python3 ${PYTHON_DIR}/update/submission_status.py ${submission_id} 10
  exit 1;
fi

################################################################################
# 2. USDZ                                                                      #
################################################################################
${BASH_3XR_DIR}/studio/export/usdz_from_glb.sh \
  -a ${asset_uid} \
  -n ${name} \
  -c ${submission_number} \
  2>&1 | tee -a ${logs_dir}/usdz.log

if [ $? -ne 0 ];
then
  python3 ${PYTHON_DIR}/update/submission_status.py ${submission_id} 12
  exit 1;
fi

################################################################################
# 3. Amazon FBX                                                                #
################################################################################
if [ -z "${asin}" ] || [ "${asin}" = "null" ] || [ "${asin}" = "undefined" ]
then
  xrs_log_warn "No ASIN, using with blend name"
  asin="${name}"
fi
xrs_log_info "Exporting Amazon FBX with asin ${asin}"
${BASH_3XR_DIR}/studio/export/fbx_for_amazon.sh \
  -a ${asset_uid} \
  -n ${name} \
  -c ${submission_number} \
  -i ${asin} \
  2>&1 | tee -a ${logs_dir}/fbx_Amazon.log

################################################################################
# 4. General FBX                                                               #
################################################################################
xrs_log_info "Exporting Standard FBX & ZIP"
${BASH_3XR_DIR}/studio/export/fbx_for_submission.sh \
  -a ${asset_uid} \
  -n ${name} \
  -c ${submission_number} \
  2>&1 | tee -a ${logs_dir}/fbx.log

################################################################################
# 5. Zappar GLB                                                               #
################################################################################
xrs_log_info "Exporting Zappar GLB"
${BASH_3XR_DIR}/studio/export/glb_for_zappar.sh \
  -a ${asset_uid} \
  -n ${name} \
  -c ${submission_number} \
  2>&1 | tee -a ${logs_dir}/glb_zappar.log
