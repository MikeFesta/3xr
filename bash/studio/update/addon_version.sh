#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

# TODO: This build code could probably be moved into this file
xrs_log_info "Building Blender Addon"
cd ${XRS_DIR}
./build_addon.sh

# Load the version number, which is in __init__.py
addonVersion='0.'
blenderVersion='0.'
while IFS= read -r line
do
  if [[ $line == '  "blender": '* ]]
  then
    # Remove up to the first '  "blender": (' and after the last '),\n'
    blenderRaw=$(echo $line | cut -c13- | rev | cut -c3- | rev)
    # Parse the comma separated string into an array
    IFS=', ' read -r -a blenderArray <<< "$blenderRaw"
    # Join the arary with .'s
    blenderVersion=$(printf "%s." "${blenderArray[@]}")
  fi
  if [[ $line == '  "version": '* ]]
  then
    # Remove up to the first '  "version": (' and after the last '),\n'
    addonRaw=$(echo $line | cut -c13- | rev | cut -c3- | rev)
    # Parse the comma separated string into an array
    IFS=', ' read -r -a addonArray <<< "$addonRaw"
    # Join the arary with .'s
    addonVersion=$(printf "%s." "${addonArray[@]}")
  fi

done < 'xrs/__init__.py'

zipName="xrs.${addonVersion}zip"
if [ -f ${zipName} ]
then
  xrs_log_info "Uploading ${zipName}"
  # Upload to Google
  gsutil cp xrs.${addonVersion}zip gs://cdn.3xr.com/blender

  # Insert into database
  xrs_log_info "Inserting into DB ${addonVersion::-1} ${blenderVersion::-1}"
  # Post to www.3xr.com with IP authentication
  python3 ${PYTHON_DIR}/update/addon_version.py ${addonVersion::-1} ${blenderVersion::-1}
else
  xrs_log_error "File Not Found ${zipName}"
fi
