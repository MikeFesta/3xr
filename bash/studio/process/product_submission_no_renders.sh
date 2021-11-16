#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# TODO: Break these out into seperate rabbit messages                          #
# Process a new product submission                                             #
# 1. Move the files to the assets/ directory                                   #
# 2. Validate the file and save the dimensions in the database                 #
# 3. Render thumbnail images                                                   #
# 4. Generate Textures                                                         #
# 4a. Values Files                                                             #
# 4b. Opacity Texture                                                          #
# 4c. Generate ORM.png                                                         #
# 4d. Create jpgs                                                              #
# 4e. Resize Textures                                                          #
# 5. Export Submission Models                                                  #
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi
#folder=$(xrs_get_required_argument "f" "$@")
#if [ $? -ne 0 ]; then exit $?; fi
asin=$(xrs_get_optional_argument "i" "$@")
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
#product_uid=$(xrs_get_required_argument "p" "$@")
#if [ $? -ne 0 ]; then exit $?; fi
submission_id=$(xrs_get_required_argument "s" "$@")
if [ $? -ne 0 ]; then exit $?; fi
xrs_log_info "Processing product submission: asset_uid ${asset_uid}, number ${submission_id}, asin ${asin}"

################################################################################
# 1. Move the files to the assets/ directory                                   #
################################################################################
working_dir=${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/
mkdir -p "${working_dir}generated"

# Note: We should delete the timestamped directory eventually
#mv ${INCOMING_3XR_DIR}/product_submissions/${product_uid}/${folder}/* ${working_dir} 2>/dev/null

################################################################################
# 2. Validate the file and save the dimensions in the database                 #
################################################################################
#python3 ${PYTHON_DIR}/update/submission_status.py ${submission_id} 3
# Validation sets the product dimensions in the database

/3xr/programs/Blender281_xrs/blender281_xrs \
  --background \
  --python-exit-code 1 \
  -noaudio \
  ${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/${name}.blend \
  --python \
  "${BLENDER_3XR_DIR}/process/save_submission_dimensions.py" \
  -- ${submission_id}

if [ $? -ne 0 ];
then
  #python3 ${PYTHON_DIR}/update/submission_status.py ${submission_id} 4
  exit 1;
fi

################################################################################
# 3. Render images                                                             #
################################################################################
#python3 ${PYTHON_DIR}/update/submission_status.py ${submission_id} 5

#${BASH_3XR_DIR}/studio/render/master_images.sh \
#  -a ${asset_uid} \
#  -c ${submission_number} \
#  -n ${name} \
#  -s ${submission_id}
#
#if [ $? -ne 0 ];
#then
#  python3 ${PYTHON_DIR}/update/submission_status.py ${submission_id} 6
#  exit 1;
#fi

################################################################################
# 4. Generate Textures                                                         #
# 4a. Values Files                                                             #
# 4b. Opacity Textures                                                         #
# 4c. Generate ORM.png (no longer in use)                                      #
# 4d. Create jpgs                                                              #
# 4e. Resize Textures                                                          #
################################################################################
#python3 ${PYTHON_DIR}/update/submission_status.py ${submission_id} 7

${BASH_3XR_DIR}/studio/process/create_values_files.sh -a ${asset_uid} -c ${submission_number} -n ${name} -s ${submission_id}
${BASH_3XR_DIR}/studio/textures/extract_opacity.sh -a ${asset_uid} -c ${submission_number}
#${BASH_3XR_DIR}/studio/textures/generate_orm.sh -a ${asset_uid} -c ${submission_number} -s ${submission_id}
${BASH_3XR_DIR}/studio/textures/create_jpgs.sh -a ${asset_uid} -c ${submission_number} -s ${submission_id}
${BASH_3XR_DIR}/studio/textures/resize.sh -a ${asset_uid} -c ${submission_number} -s ${submission_id}

if [ $? -ne 0 ];
then
  #python3 ${PYTHON_DIR}/update/submission_status.py ${submission_id} 8
  exit 1;
fi

################################################################################
# 5. Export Submission Models                                                  #
################################################################################
#python3 ${PYTHON_DIR}/update/submission_status.py ${submission_id} 9

# .value files are used by the blender code to create the glb
cp ${working_dir}/*.value ${working_dir}/generated 2>/dev/null
${BASH_3XR_DIR}/studio/export/glb_for_submission.sh \
  -a ${asset_uid} \
  -n ${name} \
  -c ${submission_number}

if [ $? -ne 0 ];
then
  #python3 ${PYTHON_DIR}/update/submission_status.py ${submission_id} 10
  exit 1;
fi

################################################################################
# 6. Create USDZ                                                               #
################################################################################
#python3 ${PYTHON_DIR}/update/submission_status.py ${submission_id} 11

${BASH_3XR_DIR}/studio/export/usdz_from_glb.sh \
  -a ${asset_uid} \
  -n ${name} \
  -c ${submission_number}

if [ $? -ne 0 ];
then
  #python3 ${PYTHON_DIR}/update/submission_status.py ${submission_id} 12
  exit 1;
fi

# Submission Complete
#python3 ${PYTHON_DIR}/update/submission_status.py ${submission_id} 17

################################################################################
# 7. Create Amazon FBX (if asin is present)                                    #
################################################################################
if [ -z "${asin}" ] || [ "${asin}" = "null" ]
then
  xrs_log_info "Exporting Amazon FBX with blend name ${name}"
  ${BASH_3XR_DIR}/studio/export/fbx_for_amazon.sh \
    -a ${asset_uid} \
    -n ${name} \
    -c ${submission_number} \
    -i ${name}
else
  xrs_log_info "Exporting Amazon FBX with asin ${asin}"
  ${BASH_3XR_DIR}/studio/export/fbx_for_amazon.sh \
    -a ${asset_uid} \
    -n ${name} \
    -c ${submission_number} \
    -i ${asin}
fi

################################################################################
# 8. Create General FBX for all models                                         #
################################################################################
xrs_log_info "Exporting FBX (.fbx) for ${asset_uid}, submission number ${submission_number}"

source_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"
textures_dir="${source_dir}generated/"
fbx_dir="${source_dir}${name}_fbx/"
mkdir ${fbx_dir}

/3xr/programs/Blender290/blender290 \
  --background \
  --python-exit-code 1 \
  -noaudio "${source_dir}${name}.blend" \
  --python "${BLENDER_3XR_DIR}/export/fbx_for_submission.py" \
  -- "${textures_dir}" "${fbx_dir}" "${name}"

exit_status=$?
if [ "${exit_status}" -ne 0 ]
then
  xrs_log_error "Blender exited with non-zero exit code: ${exit_status}"
  exit 1
fi

# Bundle the files into a zip
cd ${source_dir}
zip -r --exclude=*.blend* --exclude=*@eaDir* ${name}_fbx.zip ${name}_fbx/
