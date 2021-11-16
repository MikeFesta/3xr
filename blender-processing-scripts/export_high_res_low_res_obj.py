# SPDX-License-Identifier: Apache-2.0
import bpy
import os
from xrs import tools as xrs

# Set variables
model_name = xrs.get_filename_no_ext()

sizes = ["low","high"]

xrs.show_all()
xrs.set_object_mode()

for size in sizes:
  object_name = model_name + "_" + size + "_res"

  if object_name in bpy.data.objects:
    # Select the object
    xrs.select_object_by_name_no_context(object_name)

    # Export as an obj ({model_name}_{size}_res.obj)
    file_name = xrs.get_parent_dir() + "exports/" + object_name + ".obj"
    bpy.ops.export_scene.obj(filepath=file_name, check_existing=False, global_scale=1, use_selection=True)
    xrs.print_status(object_name + " exported")
  else:
    xrs.print_warning(object_name + " not found")
