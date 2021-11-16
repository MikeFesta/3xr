#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_required_argument "i" "$@")
if [ $? -ne 0 ]; then exit $?; fi
old_name=$(xrs_get_required_argument "o" "$@")
if [ $? -ne 0 ]; then exit $?; fi
new_name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Renaming asset ${asset_uid} from ${old_name} to ${new_name}"

### TODO: also need to rename the product blend file and regen .zip ###

base_dir="${ASSETS_DIR}/${asset_uid}/submissions"

if [ ! -d ${base_dir} ]
then
  xrs_log_error "Directory Not Found: ${base_dir}"
  exit 1
fi

cd ${base_dir}

for submission_number in */; do
  cd ${submission_number}
  xrs_log_debug "Updating Submission ${submission_number}"
  # Rename generated files so they don't need to be regenerated
  if [ -d generated ]
  then
    cd generated
    rename -v 's/^'"${old_name}"'(.+)/'"${new_name}"'$1/s' "${old_name}"*
    cd ..
  fi

  # Remove glb_test and master_images because they will be regenerated
  rm -f glb_test.blend* # the blend and blend1
  rm -f master_images.blend* # the blend and blend1

  # Remove the 3d exports - they will be regenerated
  rm -fr "${old_name}/"
  rm -f "${old_name}".zip
  rm -f "${old_name}".glb
  rm -f "${old_name}".usdz

  # Rename the files
  rename -v 's/^'"${old_name}"'(.+)/'"${new_name}"'$1/s' "${old_name}"*

  # Rename object and references in the blend file (after renaming)
  /3xr/programs/Blender290/blender290 \
    --background \
    --python-exit-code 1 \
    -noaudio "${base_dir}/${submission_number}/${new_name}.blend" \
    --python "${BLENDER_3XR_DIR}/rename/asset.py" \
    -- "${old_name}"

  exit_status=$?
  if [ "${exit_status}" -ne 0 ]
  then
    xrs_log_warn "Blender exited with non-zero exit code: ${exit_status}"
  fi

  # Needed to save as renamed.blend due to file lock
  mv "${new_name}.blend" original.blend
  mv renamed.blend "${new_name}.blend"


  # TODO: re-run the export script

  # Return to submissions folder
  cd ..

done

# TODO: final asset directory
# TODO: Database - change asset.name, product.blend_name, asset_submission_textures
