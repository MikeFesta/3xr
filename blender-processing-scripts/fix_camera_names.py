# SPDX-License-Identifier: Apache-2.0
import bpy
from xrs import tools as xrs

# Some meshroom cameras are being formatted as
# camxform_***_***_ModelName_R0#_C##_*** and should be renamed
# They should be named ModelName_R0#_C## to match the photo filename
# Note: the used to have an S01 in the name too ( ModelName_S01_R0#_C##)
