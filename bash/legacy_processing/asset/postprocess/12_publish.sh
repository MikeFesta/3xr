#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh

xrs_print_status_message "Publishing to 3xr.com ${name}"

# Confirm that the name is valid
if [ ! -d "${MODEL_DIR}/${name}" ];
then
  xrs_print_error_message "Folder ${MODEL_DIR}/${name} Not Found. Check name or run 0_unarchive.sh"
  exit 1
fi

# Create a new record on the server and get the ID
id=$(curl -s https://www.3xr.com/admin/assets/new/${name})

if [ ${id} -gt 0 ];
then
  xrs_print_status_message "Asset ID Returned is ${id}"
  uid=$(curl -s https://www.3xr.com/admin/assets/get_uid/${name})
  if [ ! -z "${uid}" ];
  then
    # This is being returned in quotes, so remove the quotes
    uid="${uid%\"}"
    uid="${uid#\"}"
    xrs_print_status_message "Asset UID Returned is ${uid}"
    xrs_print_status_message "Uploading final folder for ${name}"
    xrs_print_warning_message "gsutil cp -r \"${MODEL_DIR}/${name}/final/${name}*\" gs://cdn.3xr.com/models/${uid}/"
    gsutil cp -r "${MODEL_DIR}/${name}/final/${name}*" gs://cdn.3xr.com/models/${uid}/ 2>&1
    xrs_print_status_message "Done"
  else
    xrs_print_error_message "Unable to get asset uid from https://www.3xr.com/admin/assets/get_uid/${name}"
    exit 1
  fi
else
  xrs_print_error_message "Unable to get asset id from https://www.3xr.com/admin/assets/new/${name}"
  exit 1
fi
