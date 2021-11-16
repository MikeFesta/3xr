# SPDX-License-Identifier: Apache-2.0
import bpy
import os
import time
import sys
from mathutils import Vector
from xrs import tools as xrs

try:
  # Set variables
  model_name = xrs.get_filename_no_ext()
  parent_dir = xrs.get_parent_dir()
  xrs.set_object_mode()
  # If being run from the 279_ file, remove that from the name (should not be the case)
  if model_name[0:4] == "279_":
    model_name = model_name[4::]
  WORKING_DIR = xrs.get_working_dir()
  EXPORT_DIR = parent_dir + "textures/"
  if (model_name + "_high_res" in bpy.data.objects):
    high_res = bpy.data.objects[model_name + "_high_res"]
  else:
    raise Exception(model_name + " does not have a high res file")
  low_res = bpy.data.objects[model_name + "_low_res"]

  xrs.print_status("Baking diffuse for " + model_name)
  for slot in high_res.material_slots:
    # Set emit color to diffuse value
    mat = slot.material
    diffuse = xrs.get_material_diffuse(mat)
    emit = mat.node_tree.nodes.new(type="ShaderNodeEmission")
    emit.inputs[0].default_value = diffuse

    nodes = mat.node_tree.nodes
    out_node = None
    for n in nodes:
      if (n.type == 'OUTPUT_MATERIAL'):
        out_node = n
    if out_node is None:
      # Create the output node if none exists
      out_node = nodes.new("ShaderNodeOutputMaterial")

    mat.node_tree.links.new(emit.outputs[0],out_node.inputs[0])
    # If there was a texture linked, link it to emit
    for link in mat.node_tree.links:
      if link.to_node.name == "Principled BSDF" and link.to_socket.name == "Base Color":
        xrs.print_status("Linking base color texture")
        mat.node_tree.links.new(link.from_socket, emit.inputs[0])

  for material_slot in low_res.material_slots:
    material_name = material_slot.material.name[0:-4] # Remove _Mat
    # Create and assign a new material
    bake_mat = bpy.data.materials.new(name=material_name + "Diffuse_Bake_Mat")
    material_slot.material = bake_mat
    bake_mat.use_nodes = True
    texture_node = bake_mat.node_tree.nodes.new("ShaderNodeTexImage")

    # Create a new 4k texture image
    img_name = material_name + "_4k_Diffuse"
    if img_name in bpy.data.images:
      img = bpy.data.images[material_name + "_4k_Diffuse"]
      img.source = "GENERATED"
    else:
      bpy.ops.image.new(name=img_name, color=(1,1,1,1)) # This way lets you set a color
      img = bpy.data.images[material_name + "_4k_Diffuse"]
    img.generated_width = 4096
    img.generated_height = 4096
    img.filepath = EXPORT_DIR + material_name + "_4k_Diffuse.png"
    img.file_format = "PNG"
    texture_node.image = img

  # Now bake the emit channel from high res to low res
  xrs.set_renderer_to_cycles()
  bpy.context.scene.render.tile_x = 1024 # Fastest with CPU bake (ThreadRipper 1950)
  bpy.context.scene.render.tile_y = 1024 # Fastest with CPU bake (ThreadRipper 1950)
  bpy.context.scene.render.bake.use_selected_to_active = True

  xrs.show_all()
  xrs.disable_all_from_render()
  xrs.select_object(low_res)
  if xrs.is_blender_28():
    high_res.select_set(True)
  else:
    high_res.select = True
  low_res.hide_render=False
  high_res.hide_render=False

  bpy.context.scene.cycles.bake_type = "EMIT"
  bpy.context.scene.render.bake.cage_extrusion = 0.001
  bpy.ops.object.bake(type="EMIT")
  for material_slot in low_res.material_slots:
    name = material_slot.material.name[0:-16]
    img = bpy.data.images[name + "_4k_Diffuse"]
    if (os.path.exists(img.filepath) == False):
      xrs.print_status("Diffuse does not exist, saving image")
      #TODO: don't waste time processing if this is the case (check earlier), but it's on a per-mat basis, so
      # perhaps delete materials on low res that already have images/values (ie. water jug)
      img.save()

except Exception as error_message:
  xrs.print_error(str(error_message))
  sys.exit(1)
