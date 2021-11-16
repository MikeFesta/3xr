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

# Cycles renderer needs to be selected
xrs.set_renderer_to_cycles()
bpy.context.scene.render.bake.use_selected_to_active = False
bpy.context.scene.render.bake.use_cage = False
bpy.context.scene.cycles.samples = 1024 # High Sample Count for great looking AO bakes (slow)
bpy.context.scene.render.tile_x = 1024 # Fastest with CPU bake (ThreadRipper 1950)
bpy.context.scene.render.tile_y = 1024 # Fastest with CPU bake (ThreadRipper 1950)

# Log the time
timer = time.time()

# Create a box to darken the bottom for contact shadows
# Disabled for now, Google RFP shoud have no bottom shadow for 3D viewer
#bpy.ops.mesh.primitive_cube_add()
#cube = bpy.context.active_object
#cube.location = ((0,0,-2))
#cube.scale.x = 10
#cube.scale.y = 10

bake_high_to_low = False

if (model_name + "_high_res") in bpy.data.objects:
  high_res = bpy.data.objects[model_name + "_high_res"]
  low_res = bpy.data.objects[model_name + "_low_res"]
  if (len(high_res.material_slots) > 1):
    xrs.print_warning("High res mesh has multiple materials, baking AO from low_res")
    bake_high_to_low = False
    # TODO: support multi-material high to low res bake
    # Note, this may not be possible with multi roughness/metallic materials, so just bake low_res
  elif (len(high_res.data.vertices) / len(low_res.data.vertices) > 1.5):
    # Only bake ao on the high res if it is at least 50% more vertices
    bake_high_to_low = True
  else:
    xrs.print_warning("High res mesh not detailed enough to bake AO to high_res first")

if (bake_high_to_low):
  # If there is a high res object, bake to itself first
  obj = bpy.data.objects[model_name + "_high_res"]
else:
  # Low Res mesh only
  obj = bpy.data.objects[model_name + "_low_res"]

xrs.select_object(obj)

for material_slot in obj.material_slots:
  material_bake_timer = time.time()
  material_name = material_slot.material.name[0:-4] # Remove _Mat
  # Create and assign a new material
  bake_mat = bpy.data.materials.new(name=material_name+"_AO_Bake_Mat")
  material_slot.material = bake_mat
  bake_mat.use_nodes = True
  texture_node = bake_mat.node_tree.nodes.new("ShaderNodeTexImage")

  # Create a new 4k texture image
  bpy.ops.image.new(name=material_name + "_4k_AO", color=(1,1,1,1)) # This way lets you set a color
  img = bpy.data.images[material_name + "_4k_AO"]
  img.use_alpha = False
  img.generated_width = 4096
  img.generated_height = 4096
  img.filepath = EXPORT_DIR + material_name + "_4k_AO.png"
  img.file_format = "PNG"
  texture_node.image = img

  # Prepare for Bake
  bpy.context.scene.cycles.bake_type = "AO"
  xrs.disable_all_from_render()
  obj.hide_render = False
  #cube.hide_render = False
  bpy.ops.object.bake(type="AO")
  img.save()

  xrs.print_status(material_name + " Bake Time: " + str(time.time() - material_bake_timer) + " seconds")

# Transfer the high res to low res (Emit channel bake)
if (bake_high_to_low):
  low_res_obj = bpy.data.objects[model_name + "_low_res"]

  # Rename to high res so we can use the old name for a new image
  bake_mat.name = "HighRes_Mat"
  img.name = "HighRes"

  # Link the previous (high res) bake to an emit node
  emit_node = bake_mat.node_tree.nodes.new(type="ShaderNodeEmission")
  nodes = bake_mat.node_tree.nodes
  out_node = None
  for n in nodes:
    if (n.type == 'OUTPUT_MATERIAL'):
      out_node = n
  if out_node is None:
    # Create the output node if none exists
    out_node = nodes.new("ShaderNodeOutputMaterial")

  bake_mat.node_tree.links.new(emit_node.outputs[0], out_node.inputs[0])
  bake_mat.node_tree.links.new(texture_node.outputs[0], emit_node.inputs[0])

  # Create a new material and image for the low_res model
  low_res_bake_mat = bpy.data.materials.new(name="AO_Bake_Mat")
  low_res_bake_mat.use_nodes = True
  low_res_texture_node = low_res_bake_mat.node_tree.nodes.new("ShaderNodeTexImage")
  low_res_obj.material_slots[0].material = low_res_bake_mat
  bpy.ops.image.new(name = model_name + "_4k_AO", color=(1,1,1,1)) # This way lets you set a color
  low_res_img = bpy.data.images[model_name + "_4k_AO"]
  low_res_img.use_alpha = False
  low_res_img.generated_width = 4096
  low_res_img.generated_height = 4096
  low_res_img.filepath = EXPORT_DIR + model_name + "_4k_AO.png"
  low_res_img.file_format = "PNG"
  low_res_texture_node.image = low_res_img

  # Now bake the emit channel from high res to low res
  bpy.context.scene.render.bake.use_selected_to_active = True
  #bpy.context.scene.render.bake.use_cage = True
  xrs.select_object(low_res_obj)
  if xrs.is_blender_28():
    obj.select_set(True)
  else:
    obj.select = True
  low_res_obj.hide_render=False
  bpy.context.scene.cycles.bake_type = "EMIT"
  bpy.ops.object.bake(type="EMIT")
  xrs.print_status("High res to low res AO, saving image")
  low_res_img.save()

xrs.print_status("AO Bake Time: " + str(time.time() - timer) + " seconds")
