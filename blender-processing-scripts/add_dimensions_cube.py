# SPDX-License-Identifier: Apache-2.0
'''
Blender 2.80
Adding a cube (if it doesn't exist) to an existing .blend file
'''
import bpy
from xrs import tools as xrs

argv = xrs.get_command_line_arguments()
model_name = xrs.get_filename_no_ext();
working_dir = xrs.get_working_dir();

width_in_mm = int(argv[0])
depth_in_mm = int(argv[1])
height_in_mm = int(argv[2])
print("Add Dimensions Cube to "+model_name+" from directory "+working_dir)
print("Dimensions are "+str(width_in_mm)+"mm, "+str(depth_in_mm)+"mm, "+str(height_in_mm)+"mm, ")

# Add the cube if it doesn't exist, otherwise select it
if "DimensionsCube" in bpy.data.objects:
    xrs.delete_object_with_name("DimensionsCube")

bpy.ops.mesh.primitive_cube_add(size=1,location=(0,0,height_in_mm/2000))
dimensions_cube = bpy.context.active_object;
dimensions_cube.name = "DimensionsCube"
dimensions_cube.data.name = "DimensionsCube_Mesh"
dimensions_cube.scale = (width_in_mm/1000, depth_in_mm/1000, height_in_mm/1000);

# Organize Collections
if "Reference" in bpy.data.collections:
    collection = bpy.data.collections["Reference"]
else:
    collection = bpy.data.collections.new("Reference")
    bpy.context.scene.collection.children.link(collection)
    bpy.context.view_layer.active_layer_collection = bpy.context.view_layer.layer_collection.children[-1]

if "DimensionsCube" in bpy.context.scene.collection.objects:
    bpy.context.scene.collection.objects.unlink(dimensions_cube)

if "DimensionsCube" not in collection:
    collection.objects.link(dimensions_cube)

xrs.save();
