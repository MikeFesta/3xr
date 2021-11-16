#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

# Get arguments
product_uid=$(xrs_get_required_argument "i" "$@")
if [ $? -ne 0 ]; then exit $?; fi
unit_type=$(xrs_get_required_argument "u" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
width=$(xrs_get_required_argument "w" "$@")
if [ $? -ne 0 ]; then exit $?; fi
depth=$(xrs_get_required_argument "h" "$@")
if [ $? -ne 0 ]; then exit $?; fi
height=$(xrs_get_required_argument "d" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Creating product uid ${product_uid} with dimensions ${width}, ${depth}, ${height} in units ${unit_type}"

product_dir=${PRODUCTS_DIR}/${product_uid}
logs_dir=${product_dir}/logs
mkdir -p ${product_dir}
mkdir -p ${product_dir}/blender
mkdir -p ${product_dir}/.generated
mkdir -p ${product_dir}/.library
logs_dir=${product_dir}/logs
mkdir -p ${logs_dir}
mkdir -p ${product_dir}/reference
mkdir -p ${product_dir}/textures

# Copy from the template
cp --no-clobber "${RESOURCES_DIR}/blender/new_product_template.blend" "${PRODUCTS_DIR}/${product_uid}/blender/${name}.blend" || true

# Save the product_uid to the scene in the .blend file
/3xr/programs/Blender290/blender290 \
  --background \
  --python-exit-code 1 \
  -noaudio \
  ${PRODUCTS_DIR}/${product_uid}/blender/${name}.blend \
  --python \
  "${BLENDER_3XR_DIR}/init/set_product_data.py" \
  -- ${product_uid} \
  2>&1 | tee -a ${logs_dir}/init_data.log

# Add the dimensions cube
${BASH_3XR_DIR}/studio/init/add_dimensions_cube.sh \
  -i ${product_uid} \
  -n ${name} \
  -u ${unit_type} \
  -w ${width} \
  -d ${depth} \
  -h ${height}

# Create a zip with the correct folder structure and the blend file
cd ${PRODUCTS_DIR}/${product_uid}

# Remove the old zip (if it exists) to get a fresh start
if [ -f ${product_uid}.zip ]
then
  rm ${product_uid}.zip \
  2>&1 | tee -a ${logs_dir}/remove_zip.log
fi

# Create the .zip for artists to download
zip ${product_uid}.zip blender/${name}.blend \
2>&1 | tee -a ${logs_dir}/zip.log

zip -r --exclude=*@eaDir* ${product_uid}.zip .library/ \
2>&1 | tee -a ${logs_dir}/zip.log

zip -r --exclude=*@eaDir* --exclude=*.tif ${product_uid}.zip reference/ \
2>&1 | tee -a ${logs_dir}/zip.log

zip ${product_uid}.zip textures/ \
2>&1 | tee -a ${logs_dir}/zip.log
