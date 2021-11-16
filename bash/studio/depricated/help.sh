#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Print help info from usdzconverter
################################################################################

# Need to set the USD path for the tool to work
export PATH=$PATH:/usr/local/USD
export PYTHONPATH=$PYTHONPATH:/usr/local/USD/lib/python

commands=()
commands+="/3xr/code/usdpython/usdzconvert/usdzconvert"
commands+=' -h'

xrs_print_status_message "${commands[@]}"
${commands[@]}
