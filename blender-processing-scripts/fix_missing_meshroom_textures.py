# SPDX-License-Identifier: Apache-2.0
'''
Open the .blend file with the cameras, add mesh, images, organize file
Note: cameras and point cloud already in the file (using Blender 2.78c)
TODO: Rename the collections to be consistant with other .blend files (high_res, low_res)
'''
import bpy
import os
from xrs import tools as xrs

argv = xrs.get_command_line_arguments()

model_dir = argv[0]
model_name = argv[1]
obj_hash= argv[2]
working_dir = os.path.join(model_dir, model_name, "blender")
xrs.print_status("Relinking meshroom textures for "+model_name+" from directory "+working_dir)

# Relink meshroom textures from meshroom folder to textures folder
for i in bpy.data.images:
  if (i.filepath.find("meshroom") >= 0):
    # Keep the same filename (part after last /)
    i.filepath = "//../textures" + i.filepath[i.filepath.rfind("/"):]
    xrs.print_status("filepath changed to " + i.filepath)

xrs.save()
