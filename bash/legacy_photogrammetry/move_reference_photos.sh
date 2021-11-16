#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# The model name is passed as an argument -n name
source $(dirname $0)/xrs.sh
source $(dirname $0)/name_flag.sh

incoming_dir="${INCOMING_3XR_DIR}/${name}"
photos_dir="${MODEL_DIR}/${name}/photos"

# It's possible that the folder hasn't been created yet, so make it just in case
mkdir -p $photos_dir
cp $incoming_dir/* $photos_dir
rm -r $incoming_dir
