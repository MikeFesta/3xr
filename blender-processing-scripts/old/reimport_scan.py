# SPDX-License-Identifier: Apache-2.0
import bpy
import os
from xrs import tools as xrs

model_name = xrs.get_filename_no_ext()
fbx_name = xrs.get_working_dir() + model_name + ".fbx"

# Rename the previous (modified) original scan
original_modified = bpy.data.objects["Original"]
original_modified.name = "Original_Modified"
original_modified.data.name = "Original_Modified"
original_modified.hide_viewport = True

# Import the fbx
bpy.ops.import_scene.fbx(filepath=fbx_name)

# Rename the object and mesh data from "Model" to "Original"
# TODO: check if it is the active object (bpy.context.object)
original = bpy.data.objects["Model"]
original.name = "Original"
original.data.name = "Original"

# Switch the imported material to "Original_Mat"
original_mat = bpy.data.materials["Original_Mat"]
original.material_slots[0].material = original_mat

# Place the object at the same location as the previous Original
xrs.copy_location_rotation_scale_from_to(original_modified,original)

# Save the .blend
bpy.ops.wm.save_mainfile(filepath=os.path.join(working_dir, model_name + ".blend"))
xrs.quit()
