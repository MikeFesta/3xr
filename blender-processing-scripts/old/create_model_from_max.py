# SPDX-License-Identifier: Apache-2.0
import bpy
import os
from xrs import tools as xrs

argv = xrs.get_command_line_arguments()

model_dir = argv[0]
model_name = argv[1]
working_dir = os.path.join(model_dir, model_name, "intermediate")
print("Creating "+model_name+" in directory "+working_dir)

# Clear the Scene
xrs.delete_all_objects()

# Import the fbx
#bpy.ops.import_scene.fbx(filepath=os.path.join(working_dir, "geometry", model_name + "_max.FBX"))

# Save the .blend
bpy.ops.wm.save_mainfile(filepath=os.path.join(working_dir, model_name + ".blend"))
xrs.quit()
