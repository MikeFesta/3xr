# SPDX-License-Identifier: Apache-2.0
import bpy
import os
from xrs import tools as xrs

name = os.path.join(model_dir, model_name, "blender")
xrs.print_status("Creating 2.80 blend file for " + model_name + " in directory " + working_dir)
# Clear the Scene
xrs.delete_all_objects()

# Create high res and low res objs and collections
sizes = ["low", "high"]

for size in sizes:
  # Create a collection named "high_res"
  filename = os.path.join(project_dir, "exports", model_name + "_" + size + "_res.obj")
  if (os.path.isfile(filename)):
    bpy.ops.import_scene.obj(filepath=filename)
  else:
    xrs.print_warning("Warning: File not found for " + filename)

# By default, the object names are {obj_name}.{mesh_name} - remove the mesh name part
for obj in bpy.data.objects:
  if "high_res" in obj.name:
    obj.name = obj.name.split("high_res")[0] + "high_res"
  if "low_res" in obj.name:
    obj.name = obj.name.split("low_res")[0] + "low_res"

# Re-link the images
for img in bpy.data.images:
  img_filepath = os.path.join(project_dir, "textures", img.name)
  if (os.path.exists(img_filepath)):
    img.filepath = img_filepath

# Save the .blend
bpy.ops.wm.save_mainfile(filepath=os.path.join(working_dir, "279_" + model_name + ".blend"))
