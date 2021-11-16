#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
source $(dirname $0)/../../xrs.sh

# Get arguments
submission_id=$(xrs_get_required_argument "s" "$@")
if [ $? -ne 0 ]; then exit $?; fi
value=$(xrs_get_required_argument "v" "$@")
if [ $? -ne 0 ]; then exit $?; fi
xrs_log_info "Setting submission (id: ${submission_id}) status = ${value}"

# Post to www.3xr.com with IP authentication
python3 ${PYTHON_DIR}/update/submission_status.py ${submission_id} ${value}
