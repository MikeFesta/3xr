#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Have Blender render a material preview
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
uid=$(xrs_get_required_argument "u" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
resolution=$(xrs_get_required_argument "r" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Rendering material thumbnail uid ${uid} with blend name ${name} at ${resolution}x${resolution}"

if [ ! -f "${MATERIALS_DIR}/${uid}/blender/${name}.blend" ]
then
  xrs_log_error "Material blend file not found"
  exit 1
fi

echo $PATH

/3xr/programs/Blender281_xrs/blender281_xrs --background --python-exit-code 1 -noaudio ${MATERIALS_DIR}/${uid}/blender/${name}.blend --python "${BLENDER_3XR_DIR}/render/material.py" -- ${resolution}
exit_status=$?
if [ "${exit_status}" -ne 0 ]
then
  xrs_log_error "Blender exited with non-zero exit code: ${exit_status}"
  exit 1
fi

${BASH_3XR_DIR}/studio/publish/material.sh -u ${uid} -n ${name}
