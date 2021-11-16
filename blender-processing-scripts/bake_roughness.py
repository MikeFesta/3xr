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
  # If being run from the 279_ file, remove that from the name (should not be the case)
  if model_name[0:4] == "279_":
    model_name = model_name[4::]
  WORKING_DIR = xrs.get_working_dir()
  EXPORT_DIR = parent_dir + "textures/"
  if (model_name + "_high_res" in bpy.data.objects):
    high_res = bpy.data.objects[model_name + "_high_res"]
  else:
    high_res = None
  low_res = bpy.data.objects[model_name + "_low_res"]
  single_value = True

  if (high_res == None):
    xrs.print_status("No high res mesh - extracting roughness value")
  elif (len(high_res.material_slots) == 1):
    xrs.print_status("Single Material Assigned to High Res - extracting roughness value")
    single_value = True
  else:
    # If there are multiple materials, check to see if they have different roughness values
    value = xrs.get_material_roughness(high_res.material_slots[0].material)
    for slot in high_res.material_slots:
      other_value = xrs.get_material_roughness(slot.material)
      xrs.print_status(slot.material.name + " roughness = " + str(other_value))
      if (value != other_value):
        single_value = False

  if (single_value):
    # If there is only a single value, extract the value from low res
    for slot in low_res.material_slots:
      other_value = xrs.get_material_roughness(slot.material)
      value = xrs.get_material_roughness(slot.material)
      xrs.print_status("Roughness Value: " + str(value))
      with open(EXPORT_DIR + slot.material.name[0:-4] + "_Roughness.value", "w") as file:
        file.write("%i" % value)
  else:
    # If there are more than one materials, bake to a texture, high res to low res
    xrs.print_status("Baking multi-material roughness to texture")
    for slot in high_res.material_slots:
      # Set emit color to roughness value
      mat = slot.material
      roughness = xrs.get_material_roughness(mat) / 100
      emit = mat.node_tree.nodes.new(type="ShaderNodeEmission")
      emit.inputs[0].default_value = ((roughness, roughness, roughness, 1))

      nodes = mat.node_tree.nodes
      out_node = None
      for n in nodes:
        if (n.type == 'OUTPUT_MATERIAL'):
          out_node = n
      if out_node is None:
        # Create the output node if none exists
        out_node = nodes.new("ShaderNodeOutputMaterial")

      mat.node_tree.links.new(emit.outputs[0],out_node.inputs[0])

    for material_slot in low_res.material_slots:
      material_name = material_slot.material.name[0:-4] # Remove _Mat
      # Create and assign a new material
      bake_mat = bpy.data.materials.new(name=material_name + "Roughness_Bake_Mat")
      material_slot.material = bake_mat
      bake_mat.use_nodes = True
      texture_node = bake_mat.node_tree.nodes.new("ShaderNodeTexImage")

      # Create a new 4k texture image
      bpy.ops.image.new(name=material_name + "_4k_Roughness", color=(1,1,1,1)) # This way lets you set a color
      img = bpy.data.images[material_name + "_4k_Roughness"]
      #img.use_alpha = False # Changed in 2.8
      img.generated_width = 4096
      img.generated_height = 4096
      img.filepath = EXPORT_DIR + material_name + "_4k_Roughness.png"
      img.file_format = "PNG"
      texture_node.image = img

    # Now bake the emit channel from high res to low res
    xrs.set_renderer_to_cycles()

    bpy.context.scene.render.tile_x = 1024
    bpy.context.scene.render.tile_y = 1024
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
      name = material_slot.material.name[0:-18]
      img = bpy.data.images[name + "_4k_Roughness"]
      value_filepath = os.path.join(EXPORT_DIR, name + "_Roughness.value")
      if (os.path.exists(img.filepath) == False and os.path.exists(value_filepath) == False):
        xrs.print_status(name + " Roughness does not exist - saving image")
        img.save()

except Exception as error_message:
  xrs.print_error(str(error_message))
  sys.exit(1)
