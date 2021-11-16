# SPDX-License-Identifier: Apache-2.0
import bpy
import os
from xrs import tools as xrs

# Set variables
arguments = xrs.get_command_line_arguments()
model_name = arguments[0]
# NOTE: This is probably being run from the 279_ file, so remove that from the name
if model_name[0:4] == "279_":
  model_name = model_name[4::]
BLENDER_DIR = arguments[1]
WORKING_DIR = xrs.get_working_dir()
EXPORT_DIR = WORKING_DIR+"../final/"
TEXTURE_DIR = WORKING_DIR+"../textures/"

xrs.set_object_mode()
xrs.set_renderer_to_cycles()

# Link from the source .blend file to get the low poly model
# No longer needed, 279 file already has the low_res object
#bpy.ops.wm.append(
#    filepath=WORKING_DIR+model_name+".blend/Object/"+model_name+"_low_res",
#    directory=WORKING_DIR+model_name+".blend/Object",
#    filename=model_name, files=[{"name":model_name}]
#)
low_poly = bpy.data.objects[model_name+"_low_res"]
xrs.select_object(low_poly)

for material_slot in low_poly.material_slots:
  material_name = material_slot.material.name[0:-4] # Remove _Mat

  gltf_mat = bpy.data.materials.new(name=material_name+"_gltf")
  material_slot.material = gltf_mat
  gltf_mat.use_nodes = True
  nodes = gltf_mat.node_tree.nodes
  links = gltf_mat.node_tree.links

  # Delete Diffuse BSDF - 2.79 uses Diffuse BSDF as the default name (2.80 is Principled BSDF)
  if "Diffuse BSDF" in nodes:
      nodes.remove(nodes["Diffuse BSDF"])
  out = nodes["Material Output"]
  out.location = (800, 600)

  # Add GLTF Node
  gltf_node = nodes.new("ShaderNodeGroup")
  gltf_node.node_tree = bpy.data.node_groups["glTF Metallic Roughness"]
  gltf_node.location = (600,600)
  links.new(gltf_node.outputs[0], out.inputs[0])

  # Add Texture slots for materials that exist
  diffuse_path = TEXTURE_DIR+material_name+"_2k_Diffuse.png"
  if (os.path.isfile(diffuse_path)):
      diffuse_image = bpy.data.images.load(diffuse_path, check_existing=True)
      diffuse_node = nodes.new("ShaderNodeTexImage")
      diffuse_node.location = (0, 800)
      diffuse_node.width = 300
      diffuse_node.image = diffuse_image
      links.new(diffuse_node.outputs[0], gltf_node.inputs[0])

  orm_path = TEXTURE_DIR+material_name+"_2k_ORM.png"
  if (os.path.isfile(orm_path)):
      orm_image = bpy.data.images.load(orm_path, check_existing=True)
      orm_node = nodes.new("ShaderNodeTexImage")
      orm_node.color_space = 'NONE'
      orm_node.location = (0, 500)
      orm_node.width = 300
      orm_node.image = orm_image
      links.new(orm_node.outputs[0], gltf_node.inputs[2])
      links.new(orm_node.outputs[0], gltf_node.inputs[7])
  else:
      # TODO: Handle Objects with Multiple Materials
      # If no texture, get roughness / metallic from the imported material
      original_mat = bpy.data.materials[material_name + "_Mat"]
      if (original_mat == ""):
          print("ERROR - Original material not found")
      else:
          if ("Principled BSDF" not in original_mat.node_tree.nodes):
              print("ERROR - Principled BSDF node not found in original material")
          else:
              metallic_input = original_mat.node_tree.nodes["Principled BSDF"].inputs[4]
              if (metallic_input.name != "Metallic"):
                  print("ERROR - The 5th node is not the metallic value")
              else:
                  gltf_node.inputs[3].default_value = metallic_input.default_value
              roughness_input = original_mat.node_tree.nodes["Principled BSDF"].inputs[7]
              if (roughness_input.name != "Roughness"):
                  print("ERROR - The 8th node is not the roughness value")
              else:
                  gltf_node.inputs[4].default_value = roughness_input.default_value

  normal_path = TEXTURE_DIR+material_name+"_2k_Normal.png"
  if (os.path.isfile(normal_path)):
      normal_image = bpy.data.images.load(normal_path, check_existing=True)
      normal_node = nodes.new("ShaderNodeTexImage")
      normal_node.location = (0, 200)
      normal_node.width = 300
      normal_node.image = normal_image
      normal_node.color_space = 'NONE'
      links.new(normal_node.outputs[0], gltf_node.inputs[5])

  emissive_path = TEXTURE_DIR+material_name+"_2k_Emissive.png"
  if (os.path.isfile(emissive_path)):
      emissive_image = bpy.data.images.load(emissive_path, check_existing=True)
      emissive_node = nodes.new("ShaderNodeTexImage")
      emissive_node.location = (0, -100)
      emissive_node.width = 300
      emissive_node.image = emissive_image
      emissive_node.color_space = 'NONE'
      links.new(emissive_node.outputs[0], gltf_node.inputs[9])

# Export as .glb
xrs.select_object(low_poly)
bpy.ops.export_scene.glb(export_morph=False, export_layers=False, will_save_settings=True, export_current_frame=False, export_colors=False, export_selected=True, export_skins=False, export_animations=False, filepath=EXPORT_DIR+model_name+"_hq.glb")

## GLTF Setup (roughness needed)
##xrs.quit()
