#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Push asset files to cdn.3xr.com
# Called from publish/asset_submission.sh
# Note that this script expects all files to be in the final directory
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_required_argument "u" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_print_status_message "Publishing ${asset_uid} to cdn.3xr.com"
final_dir="${ASSETS_DIR}/${asset_uid}/final/"

# Confirm that the directory exists and go to it
if [ ! -d "${final_dir}" ];
then
  xrs_print_error_message "Folder ${ASSETS_DIR}/${asset_uid}/final/ Not Found."
  exit 1
fi

cd "${final_dir}"

# Upload files by extension and set their categories
extensions=("png" "jpg" "glb" "svg" "usdz" "zip")

# write to disk because find | pipe subshells kill variables
# http://mywiki.wooledge.org/BashFAQ/024
> upload.data

function add_to_array {
  size=($(stat -c%s "$1"))
  hash=($(sha256sum "$1" | awk '{ print $1 }'))
  echo '{"name":"'"$1"'", "size": '"${size}"', "hash":"'"${hash}"'"}' >> "upload.data"
}

function join_by { local IFS="$1"; shift; echo "$*"; }

# Loop through all of the file extensions and add to the array
for (( i = 0; i < ${#extensions[@]}; ++i ))
do
  # Sort by last modified so the -2k.png is the last image added, make it the first displayed
  find -maxdepth 1 -type f -print0 | xargs -0 ls -t | cut -c3- | grep ".*\.${extensions[i]}$" | while read filename
  do
    [ -f "${filename}" ] || break # guard against no matches
    xrs_log_debug "${filename}"
    add_to_array "${filename}"
  done
done

readarray -t filedata < upload.data
files=$(join_by , "${filedata[@]}")
post_data='{
  "uid":"'"${asset_uid}"'",
  "files": ['"${files}"']
}'

# Pass the list of files to the server to check which files should be uploaded
verify_file_uploads=$(curl \
  -H "Accept: application/json" \
  -H "Content-Type:application/json" \
  -X POST --data "${post_data}" "https://www.3xr.com/a/asset/verify_file_uploads" \
  2>/dev/null
)

# Basic error check, server will return "Error getting asset by uid" if it fails
if [ "${verify_file_uploads:0:5}" = "Error" ]
then
  xrs_log_error "Server returned: ${verify_file_uploads}"
  exit 1
fi
# Convert JSON into a string separated with new lines
files_to_upload_string=`jq -r '.[]' <<< "${verify_file_uploads}"`
# Create an array split by newlines instead of spaces
IFS=$'\n' files_to_upload=( ${files_to_upload_string} )

for f in "${files_to_upload[@]}"
do
  xrs_print_status_message "Uploading ${f}"
  gsutil cp "${ASSETS_DIR}/${asset_uid}/final/${f}" gs://cdn.3xr.com/models/${asset_uid}/ 2>/dev/null
done

# Set the asset publish status
# Note: this could be done with curl instead of python
python3 ${PYTHON_DIR}/update/asset_published.py ${asset_uid}

xrs_print_status_message "Done"
