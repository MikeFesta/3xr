# SPDX-License-Identifier: Apache-2.0
'''
Blender 2.81
Renaming material and setting basic values
'''
import bpy
from xrs import automate as xra

argv = xra.get_command_line_arguments()
name = xra.get_filename();
working_dir = xra.get_dir();

uid = argv[0]
diffuse_color = argv[1]
metallic = float(argv[2])
roughness = float(argv[3])
xra.log_info("Setting material name " + name + " in directory " + working_dir)
xra.log_info("Values are uid: " + uid + ". " + diffuse_color + ", " + str(metallic) + ", " + str(roughness))

# NOTE: will probably store these as material_ or remove product_ in the variable name
xra.set_product_name(name)
xra.set_product_uid(uid)

# Create the material, if it does not exist
if name not in bpy.data.materials:
  if "Material" in bpy.data.materials:
    xra.log_debug("Renaming Material");
    mat = bpy.data.materials["Material"]
    mat.name = name
  else:
    xra.log_debug("Creating Material");
    mat = bpy.data.materials.new(name=name)
  mat.use_nodes = True

  xra.set_material_default_color_hex(mat, diffuse_color)
  xra.set_material_default_metallic(mat, metallic)
  xra.set_material_default_roughness(mat, roughness)
xra.save();
