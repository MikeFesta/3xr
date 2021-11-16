#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Have Blender render a thumbnail for a given asset
# TODO: Assignments are Depricated
################################################################################
source $(dirname $0)/../../xrs.sh
source $(dirname $0)/../../name_flag.sh

# TODO: USE THE NEW FORMAT xrs_log, remove name_flag, etc.

xrs_print_status_message "Rendering Thumbnail for ${name}"

# Blender 2.80
# TODO: Save the photo studio file so that tweaks can be made. Load that file first, if it exists
#blender --background --python-exit-code 1 -noaudio ${MODEL_DIR}/${name}/blender/${name}.blend --python "${BLENDER_3XR_DIR}/render_thumbnail.py"
#blender --python-exit-code 1 -noaudio ${MODEL_DIR}/${name}/blender/${name}.blend --python "${BLENDER_3XR_DIR}/render_thumbnail.py"
if [ ! -f "${MODEL_DIR}/${name}/blender/${name}_photo_studio.blend" ]
then
  xrs_print_status_message "photo studio file created from template"
  cp ${RESOURCES_DIR}/blender/photo_studio_template.blend ${MODEL_DIR}/${name}/blender/${name}_photo_studio.blend
fi
blender --background --python-exit-code 1 -noaudio ${MODEL_DIR}/${name}/blender/${name}_photo_studio.blend --python "${BLENDER_3XR_DIR}/render_thumbnail.py"
exit_status=$?
if [ "${exit_status}" -ne 0 ]
then
  xrs_print_error_message "Blender exited with non-zero exit code: ${exit_status}"
fi
