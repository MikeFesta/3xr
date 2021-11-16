#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

# Read the name in from a flag
while getopts "i:n:" opt;
do
  case "$opt" in
  i)
    id=$OPTARG
    ;;
  n)
    name=$OPTARG
    ;;
  esac
done
if [ "${name}" = "" ]
then
  printf "ERROR: Model Name Required, run ./"$(basename "$0")" -n Model_Name\n"
  exit 1
fi
if [ "${id}" = "" ]
then
  printf "ERROR: Model ID Required, run ./"$(basename "$0")" -i Model_ID\n"
  exit 1
fi
shortname=${name:0:8}

mkdir -p ${X_PROJECTS_DIR}/${id}_${shortname}
cp -r ${MODEL_DIR}/${name}/* ${X_PROJECTS_DIR}/${id}_${shortname}
exit $?
