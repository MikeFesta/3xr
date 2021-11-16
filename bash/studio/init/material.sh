#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

# Get arguments
material_uid=$(xrs_get_required_argument "u" "$@")
if [ $? -ne 0 ]; then exit $?; fi
name=$(xrs_get_required_argument "n" "$@")
if [ $? -ne 0 ]; then exit $?; fi
diffuse=$(xrs_get_required_argument "d" "$@")
if [ $? -ne 0 ]; then exit $?; fi
metallic=$(xrs_get_required_argument "m" "$@")
if [ $? -ne 0 ]; then exit $?; fi
roughness=$(xrs_get_required_argument "r" "$@")
if [ $? -ne 0 ]; then exit $?; fi

xrs_log_info "Creating material uid ${material_uid} with blend name ${name}"

material_dir=${MATERIALS_DIR}/${material_uid}

mkdir -p ${material_dir}
mkdir -p ${material_dir}/blender
mkdir -p ${material_dir}/final
mkdir -p ${material_dir}/.generated
mkdir -p ${material_dir}/.library
logs_dir=${material_dir}/logs
mkdir -p ${logs_dir}
mkdir -p ${material_dir}/reference
mkdir -p ${material_dir}/textures

# Copy from the template
cp "${MATERIALS_DIR}/template/blender/material_studio_template.blend" \
   "${MATERIALS_DIR}/${material_uid}/blender/${name}.blend" || true
#cp --no-clobber "${RESOURCES_DIR}/materials/new_material_template.blend" "${MATERIALS_DIR}/${material_uid}/blender/${name}.blend" || true

# Rename and set basic values
/3xr/programs/Blender290/blender290 \
  --background \
  --python-exit-code 1 \
  -noaudio \
  ${MATERIALS_DIR}/${material_uid}/blender/${name}.blend \
  --python \
  "${BLENDER_3XR_DIR}/init/material.py" \
  -- \
  ${material_uid} \
  ${diffuse} \
  ${metallic} \
  ${roughness} \
  2>&1 | tee -a ${logs_dir}/init.log
