#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
phi=$(xrs_get_required_argument "p" "$@")
if [ $? -ne 0 ]; then exit $?; fi
radius=$(xrs_get_required_argument "r" "$@") #Not in use
if [ $? -ne 0 ]; then exit $?; fi
orbit_y=$(python -c "import math; print str(math.trunc(math.degrees(${phi})))")

xrs_log_info "Rendering 360 spin from angle ${orbit_y} for asset_uid ${asset_uid}"

# Render 360 Spin
/3xr/programs/Blender282a/blender282a \
  --background \
  --python-exit-code 1 \
  -noaudio \
  ${RESOURCES_DIR}/blender/photo_studio_template.blend \
  --python \
  "${BLENDER_3XR_DIR}/render/360_spin.py" \
  -- ${ASSETS_DIR}/${asset_uid}/final/ \
  ${asset_uid} \
  ${name} \
  ${phi} \
  ${orbit_y} \
  1> /dev/null
if [ $? -ne 0 ]; then
  xrs_log_error "Blender failed to render 360 Spin"
  exit 1;
fi

# Create JPGs on a white background in 3 sizes (2k, 1k, 512)
cd "${ASSETS_DIR}/${asset_uid}/final/360/${orbit_y}"
pwd
for png in *.png
do
  basename=$(basename "${png}" .png)
  orbit_x=${basename:(-3)}
  half_size="${name}-1k-${orbit_y}-${orbit_x}"
  quarter_size="${name}-512-${orbit_y}-${orbit_x}"
  # Need to pull out the 2k from the image for the other size
  convert "${png}" -background white -flatten "${basename}.jpg"
  convert "${basename}.jpg" -scale 50% "${half_size}.jpg"
  convert "${basename}.jpg" -scale 25% "${quarter_size}.jpg"
  zip "${name}-2k-spinset-${orbit_y}.zip" "${basename}.jpg"
  #zip "${name}-1k-spinset-${orbit_y}.zip" "${half_size}.jpg"
  #zip "${name}-512-spinset-${orbit_y}.zip" "${quarter_size}.jpg"
done

# Upload the JPGs and zip to google cloud
# Note: this is similar to publish/asset.sh and could be combined / broken into its own file
> upload.data
function add_to_array {
  size=($(stat -c%s "$1"))
  hash=($(sha256sum "$1" | awk '{ print $1 }'))
  echo '{"name":"'"$1"'", "size": '"${size}"', "hash":"'"${hash}"'"}' >> "upload.data"
}

function join_by { local IFS="$1"; shift; echo "$*"; }

extensions=("jpg" "zip")
# Loop through all of the file extensions and add to the array
for (( i = 0; i < ${#extensions[@]}; ++i ))
do
  # Sort by last modified
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
  "files": ['"${files}"'],
  "typeId": 7
}'
# TypeID 7 is FILE_TYPE.SPIN_360

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
files_to_upload=( $(jq -r '.[]' <<< "${verify_file_uploads}") )

for f in "${files_to_upload[@]}"
do
  xrs_print_status_message "Uploading ${f}"
  gsutil cp "${f}" gs://cdn.3xr.com/models/${asset_uid}/spins/ 2>/dev/null
done

rm upload.data

# Upload the Zip to google cloud
#TODO: do this on the server endpoint, but need to pass the 360 spin intent from here

# Record the spinset on the server
post_data='{
  "angle":"'"${orbit_y}"'",
  "imageCount":"24",
  "resolution":"2048",
  "uid":"'"${asset_uid}"'"
}'
record_spin_set=$(curl \
  -H "Accept: application/json" \
  -H "Content-Type:application/json" \
  -X POST --data "${post_data}" "https://www.3xr.com/a/asset/record_spin_set" \
  2>/dev/null
)
