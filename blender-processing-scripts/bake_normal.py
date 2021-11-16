# SPDX-License-Identifier: Apache-2.0
import bpy
import os
import time
from mathutils import Vector
from xrs import tools as xrs

# Set variables
model_name = xrs.get_filename_no_ext()
# If being run from the 279_ file, remove that from the name
if model_name[0:4] == "279_":
  model_name = model_name[4::]
WORKING_DIR = xrs.get_working_dir()
EXPORT_DIR = WORKING_DIR + "../textures/"
xrs.set_object_mode()

# Only bake if the high res mesh is present
if (model_name + "_high_res") not in bpy.data.objects:
  xrs.print_warning("No high res mesh, skipping normal bake")
else:
  low_res_obj = bpy.data.objects[model_name + "_low_res"]
  high_res_obj = bpy.data.objects[model_name + "_high_res"]
  if (len(high_res_obj.data.vertices) / len(low_res_obj.data.vertices) < 1.5):
    # Only bake ao on the high res if it is at least 50% more vertices
    xrs.print_warning("High res mesh not detailed enough to bother baking normal")
  else:
    xrs.select_object(low_res_obj)
    if xrs.is_blender_28():
      high_res_obj.select_set(True)
    else:
      high_res_obj.select = True

    # Cycles rendered needs to be selected
    xrs.set_renderer_to_cycles()
    bpy.context.scene.render.bake.use_selected_to_active = True
    bpy.context.scene.render.bake.use_cage = True
    bpy.context.scene.render.bake.cage_extrusion = 0.1

    # Log the time
    timer = time.time()

    xrs.print_status("Baking Normal")

    # Create and assign a new material
    bake_mat = bpy.data.materials.new(name="Normal_Bake_Mat")
    low_res_obj.material_slots[0].material = bake_mat
    bake_mat.use_nodes = True
    texture_node = bake_mat.node_tree.nodes.new("ShaderNodeTexImage")

    # Create a new 4k texture image
    bpy.ops.image.new(name=model_name + "_4k_Normal", color=(1,1,1,1)) # This way lets you set a color
    img = bpy.data.images[model_name + "_4k_Normal"]
    img.use_alpha = False
    img.generated_width = 4096
    img.generated_height = 4096
    img.filepath = EXPORT_DIR + model_name + "_4k_Normal.png"
    img.file_format = "PNG"
    texture_node.image = img

    # Prepare for Bake
    bpy.context.scene.cycles.bake_type = "NORMAL"
    xrs.disable_all_from_render()
    low_res_obj.hide_render = False
    high_res_obj.hide_render = False
    bpy.ops.object.bake(type="NORMAL")
    img.save()

    xrs.print_status("Normal Bake Time: "+str(time.time()-timer)+" seconds")
