#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# Create an array of material names from the textures directory
# Depends on xrs.sh and name_flag.sh being included in the calling script
material_names=("")
i=0
for t in ${MODEL_DIR}/${name}/textures/*.png
do
  already_listed=false
  mat_name=`echo "${t%_*_*.png}"`
  mat_name=`echo "${mat_name##*textures/}"`
  for in_array in ${material_names[@]}
  do
    if [ "${in_array}" == "${mat_name}" ];
    then
      already_listed=true
    fi
  done
  if [ "${already_listed}" == false ];
  then
    printf "adding ${mat_name}\n"
    material_names[$i]=${mat_name}
    i=$i+1
  fi
  printf "loop ${t}\n"
done
