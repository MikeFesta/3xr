#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
################################################################################
# Move generated textures into textures/.generated and make lower_case
################################################################################
source $(dirname $0)/../../xrs.sh
# The model name is passed as an argument -n name
source $(dirname $0)/../../name_flag.sh

xrs_log_info "Reorginazing Textures for ${name}"
working_dir="${MODEL_DIR}/${name}/textures"
if [ ! -d "${working_dir}" ]
then
  xrs_log_error "Unable to find textures directory"
  exit 1
fi

# Move files
mkdir -p "${working_dir}/.generated"
mv "${working_dir}"/*_1k_* "${working_dir}/.generated"
mv "${working_dir}"/*_2k_* "${working_dir}/.generated"
mv "${working_dir}"/*.jpg "${working_dir}/.generated"

# Rename files
cd "${working_dir}/.generated"

rename 's/_1k_AO/_1k_ao/' *
rename 's/_2k_AO/_2k_ao/' *
rename 's/_4k_AO/_4k_ao/' *

rename 's/_1k_D/_1k_d/' *
rename 's/_2k_D/_2k_d/' *
rename 's/_4k_D/_4k_d/' *

rename 's/_1k_M/_1k_m/' *
rename 's/_2k_M/_2k_m/' *
rename 's/_4k_M/_4k_m/' *

rename 's/_1k_N/_1k_n/' *
rename 's/_2k_N/_2k_n/' *
rename 's/_4k_N/_4k_n/' *

rename 's/_1k_ORM/_1k_orm/' *
rename 's/_2k_ORM/_2k_orm/' *
rename 's/_4k_ORM/_4k_orm/' *

rename 's/_1k_O/_1k_o/' *
rename 's/_2k_O/_2k_o/' *
rename 's/_4k_O/_4k_o/' *

rename 's/_1k_R/_1k_r/' *
rename 's/_2k_R/_2k_r/' *
rename 's/_4k_R/_4k_r/' *
