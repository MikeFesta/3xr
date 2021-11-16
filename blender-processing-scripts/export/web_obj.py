# SPDX-License-Identifier: Apache-2.0
import bpy
import os
from xrs import automate as xra

# Set variables
model_name = xra.get_filename()

xra.show_all()
xra.set_object_mode()
xra.select_collection_named("web")

# Export as an obj into the generated folder (generated/{model_name}.obj)
file_name = xra.get_dir() + 'generated/' + model_name + ".obj"
bpy.ops.export_scene.obj(filepath=file_name, check_existing=False, global_scale=1, use_selection=True)
xra.log_info(model_name + ".obj exported")
