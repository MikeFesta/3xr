# SPDX-License-Identifier: Apache-2.0
import bpy
import os
from xrs import tools as xrs

# Set variables
model_name = xrs.get_filename_no_ext()
model = bpy.data.objects["Original"]

xrs.reset_location_rotation_scale(model)

# Ensure it is the only object selected
xrs.select_object(model)

# Export as an fbx ({model_name}_ForAgisoft.fbx)
file_name = xrs.get_working_dir() + model_name + "_ForAgisoft.fbx"
bpy.ops.export_scene.fbx(filepath=file_name, check_existing=False, use_selection=True)

xrs.quit()
