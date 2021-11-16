# SPDX-License-Identifier: Apache-2.0
'''
Create a new .blend file from the output of meshroom
Note: due to an .abc import bug in Blender 2.79 and 2.80, 2.78c is needed

1. Delete everything in the scene
2. Import cameras from meshroom
{project_directory}/meshroom/MeshroomCache/Texturing/{hash}/.obj
3. Save and close
'''
import bpy
import os
import time
from xrs import tools as xrs

argv = xrs.get_command_line_arguments()

model_dir = argv[0]
model_name = argv[1]
meshroom_hash = argv[2]

camera_dir = os.path.join(model_dir, model_name, "meshroom", "MeshroomCache", "StructureFromMotion", meshroom_hash)
working_dir = os.path.join(model_dir, model_name, "blender")
xrs.print_status("Importing cameras for " + model_name + " from directory " + camera_dir)

# Clear the Scene
xrs.set_object_mode()
xrs.delete_all_objects()

# Import the abc
# {project_directory}/meshroom/MeshroomCache/StructureFromMotion/{hash}/cloud_and_poses.abc
bpy.ops.wm.alembic_import(filepath=os.path.join(camera_dir, "cloud_and_poses.abc"))
# Not supported in 2.78: as_background_job=False)

# Need to wait for the import to finish. There should be 72 cameras + point cloud
import_timeout = 10.0
while(len(bpy.data.objects)<72 and import_timeout > 0):
  time.sleep(0.25)
  import_timeout -= 0.25

xrs.print_status("Import Finished: # of objects:" + str(len(bpy.data.objects)))

# Rename the cameras
cams = xrs.get_all_cameras()
for c in cams:
  # naming structure is camxform_##_##_{image_name}_##
  c.name = "_".join(c.name.split("_",3)[-1].split("_")[:-1])
  c.data.name = c.name

xrs.print_status("Cameras Renamed")

# Save and Close to move on to init_model_from_meshroom.py
# TODO: The collection was not added to the scene, need to do that manually
bpy.ops.wm.save_mainfile(filepath=os.path.join(working_dir, model_name + ".blend"), compress=True)
xrs.print_status("Saving " + model_dir + model_name + ".blend")
