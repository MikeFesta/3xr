#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Fix the opacity for a given usdz file
# This should only be needed for legacy assets built with the xcode script
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh

# Ensure that the folder exists
if [ ! -d "${MODEL_DIR}/${name}" ];
then
  xrs_print_error_message "Folder ${MODEL_DIR}/${name} Not Found. Check name or run 0_unarchive.sh"
  exit 1
fi

# Need to set the USD path for the tool to work
export PATH=$PATH:/usr/local/USD
export PYTHONPATH=$PYTHONPATH:/usr/local/USD/lib/python
FINAL_DIR="${MODEL_DIR}/${name}/final/"

commands=()
commands+="/3xr/code/usdpython/usdzconvert/fixOpacity"
commands+=" ${FINAL_DIR}${name}.usdz"

xrs_print_status_message "${commands[@]}"
${commands[@]}
ls -lh ${FINAL_DIR}*.usdz
