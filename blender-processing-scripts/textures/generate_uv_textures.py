# SPDX-License-Identifier: Apache-2.0
import bpy
import math
import os
import time
from xrs import automate as xra

xra.log_info('Generating UV Image Texture')
arguments = xra.get_command_line_arguments()
working_dir = xra.get_dir()
asset_name = arguments[0]
submission_id = arguments[1]

xra.log_info('Generating UV textures for each material for ' + asset_name)

# Join all objects in the web collection into a single object
xra.join_collection_objects_into_one("web")
obj = bpy.data.collections["web"].objects[0];

# Render Engine Setup (might not be needed)
xra.set_renderer_to_cycles(64)
xra.set_render_resolution(1024, 1024)

# loop through materials
for slot in obj.material_slots:
  xra.log_info(slot.material.name);

  # copied from old/bake_materials
  # TODO: add this to xra
  uv_timer = time.time()
  uv_filepath = working_dir + slot.material.name + "_uv.png"
  bpy.ops.uv.export_layout(filepath=uv_filepath, size=(4096,4096))
  xra.log_info("UV export time "+str(time.time()-uv_timer)+" seconds")

  #if xra.record_asset_submission_renders(submission_id, renders) == False:
    #xra.log_error("Unable to record renders on 3xr.com")
