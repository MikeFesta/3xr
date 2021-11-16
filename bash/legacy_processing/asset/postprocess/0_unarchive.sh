#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh

# Get the ID from the server
# TODO: Typos here would create a new asset - need to write a new endpoint for getting id from name
id=$(curl -s https://www.3xr.com/admin/assets/new/${name})
if [ $id -eq 0 ]
then
  xrs_print_error_message "Unable to get ID"
  exit 1
fi
xrs_print_status_message "Asset ID Returned is ${id}"
xrs_print_status_message "Moving folder from complete to ${id}_${name}"
mv "$COMPLETE_MODEL_DIR/${id}_${name}/" "${MODEL_DIR}/${name}/"
exit $?
