#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Create a usdz file
# This now uses the python build tools instead of xcode (required a mac)
# Pre-requirements:
#  * An obj exported at 1m = 1m in the exports folder
#  * Textures and/or Metallic/Roughness values in the textures folder
# Note About AO and single UV channel support
# - USDZ does not currently support more than one AO channel
# - IF a model needs to overlap UVs, it may have a 2nd UV channel for the AO map
# - In that case, we'll need to process the USDZ without the AO map
# - For now, just look for a glb with the -without-ao.glb ending
################################################################################
source $(dirname $0)/../../xrs.sh

asset_uid=$(xrs_get_required_argument "a" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
submission_number=$(xrs_get_required_argument "c" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_print_status_message "Creating USDZ from glb for ${name}"

source_dir="${ASSETS_DIR}/${asset_uid}/submissions/${submission_number}/"

# Need to set the USD path for the tool to work
export PATH=$PATH:/3xr/code/USD
export PYTHONPATH=$PYTHONPATH:/3xr/code/python/lib
xrs_print_status_message "Python Path: ${PYTHONPATH}"

#/3xr/code/usdpython/usdzconvert/usdzconvert -h

# If a glb named -without-ao exists, use that because the standard glb has
# an ao map on the 2nd channel, which is not supported by usdz on iOS
glb_source_file="${source_dir}${name}.glb"
if [ -f "${source_dir}${name}-without-ao.glb" ]
then
  xrs_log_warn "Creating USDZ without an AO map due to lack of 2 channel UV support"
  glb_source_file="${source_dir}${name}-without-ao.glb"
fi

commands=()
commands+="/3xr/code/usdpython/usdzconvert/usdzconvert"
commands+=" ${glb_source_file} "
commands+=" ${source_dir}${name}.usdz"
commands+=" -v" # verbose for development, can be removed later
commands+=" -url https://www.3xr.com/asset/view/${asset_uid}"
commands+=" -copyright \"3XR_Inc.\""
commands+=' -metersPerUnit 1.0'
commands+=' -iOS12' # Probably need this for a while for older devices
xrs_print_status_message "${commands[@]}"

cd ${sourc_dir}

${commands[@]}
ls -lh ${source_dir}*.usdz
