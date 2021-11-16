#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Move the final files for the client into /x/projects                         #
# 1. Create Folder for project/product name (friendly)                         #
# 2. Copy .GLB and .USDZ                                                       #
# 3. Copy QR codes                                                             #
################################################################################
source $(dirname $0)/../../xrs.sh

# Get arguments
asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
blend_name=$(xrs_get_required_argument "b" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
project_uid=$(xrs_get_required_argument "p" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Coping final assets for: ${name} - asset_uid ${asset_uid}, to project ${project_uid}"

source_dir=${ASSETS_DIR}/${asset_uid}/final/
# note that directory names cannot have slashes, so change to a - instead
project_dir=${PROJECTS_DIR}/${project_uid}/${name////-}


################################################################################
# 1. Create the directory                                                      #
################################################################################
xrs_log_info "Creating directory: ${project_dir}"
mkdir -p "${project_dir}"


################################################################################
# 2. Copy the GLB and USDZ                                                     #
################################################################################
xrs_log_info "Copying: ${source_dir}${blend_name}.glb and .usdz"
cp "${source_dir}${blend_name}.glb" "${project_dir}"
cp "${source_dir}${blend_name}.usdz" "${project_dir}"

################################################################################
# 3. Copy the QR codes
################################################################################
xrs_log_info "Done"
exit 0

