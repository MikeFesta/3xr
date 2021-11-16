#! /bin/bash
# SPDX-License-Identifier: Apache-2.0
###############################################################################
### POST PROCESSING
###############################################################################
source $(dirname $0)/xrs.sh
source $(dirname $0)/name_flag.sh
POST_PROCESS_LOCATION="/3xr/code/bash/asset/postprocess/"

# Ensure that the folder exists
if [ ! -d "${MODEL_DIR}/${name}" ];
then
  xrs_print_error_message "Folder ${MODEL_DIR}/${name} Not Found. Check name or run 0_unarchive.sh"
  exit 1
fi

## CONTINUING FROM PART1, AFTER .usdz file has been created

# Render Preview Image
#${POST_PROCESS_LOCATION}/10_render_preview.sh -n ${name}

# Resize screenshot
${POST_PROCESS_LOCATION}/11_resize_preview.sh -n ${name}

# Upload files to the website
${POST_PROCESS_LOCATION}/12_publish.sh -n ${name}

# Move to complete
${POST_PROCESS_LOCATION}/13_complete.sh -n ${name}
