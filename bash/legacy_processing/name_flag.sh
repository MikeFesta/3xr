#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# Read the name in from a flag
# Assumes that xrs has already been included

while getopts "n:" opt;
do
  case "$opt" in
  n)
    name=$OPTARG
    ;;
  esac
done
if [ "${name}" = "" ]
then
  xrs_log_error "ERROR: Model Name Required, run ./"$(basename "$0")" -n Model_Name"
  exit 1
fi
