# SPDX-License-Identifier: Apache-2.0
'''
Blender 2.80
Adding a cube (if it doesn't exist) to an existing .blend file
'''
import bpy
from xrs import automate as xra

argv = xra.get_command_line_arguments()
name = xra.get_filename();
working_dir = xra.get_dir();

unit_type = argv[0]
width = float(argv[1])
depth = float(argv[2])
height = float(argv[3])
xra.log_info("Add Dimensions Cube to " + name + " in directory " + working_dir)
xra.log_info("Dimensions are " + str(width) + "m x " + str(depth) + "m x " + str(height) + "m in units " + str(unit_type))

# Change the units of the file
xra.set_unit_type(unit_type)
size = xra.get_size_for_unit(unit_type)

# Add the cube if it doesn't exist, otherwise select it
if "dimensions_cube" in bpy.data.objects:
  xra.delete_object_with_name("dimensions_cube")

bpy.ops.mesh.primitive_cube_add(size=size,location=(0,0,height*size/2))
dimensions_cube = bpy.context.active_object;
dimensions_cube.name = "dimensions_cube"
dimensions_cube.data.name = "dimensions_cube"
dimensions_cube.scale = (width, depth, height);
bpy.ops.object.transform_apply()

# Organize Collections
if "reference" in bpy.data.collections:
  collection = bpy.data.collections["reference"]
else:
  collection = bpy.data.collections.new("reference")
  bpy.context.scene.collection.children.link(collection)
  bpy.context.view_layer.active_layer_collection = bpy.context.view_layer.layer_collection.children[-1]

if "dimensions_cube" in bpy.context.scene.collection.objects:
  bpy.context.scene.collection.objects.unlink(dimensions_cube)

if "DimensionsCube" not in collection:
  collection.objects.link(dimensions_cube)

xra.save();
