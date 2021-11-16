# SPDX-License-Identifier: Apache-2.0
import bpy
import os
import time
from mathutils import Vector
from xrs import tools as xrs

# Set variables
arguments = xrs.get_command_line_arguments()
model_name = xrs.get_filename_no_ext()
WORKING_DIR = xrs.get_working_dir()
EXPORT_DIR = WORKING_DIR + "../final/"
RESOURCES_DIR = "/3xr/studio/resources/"
low_res = bpy.data.objects[model_name + "_low_res"]

# Record the render time
timer = time.time()

# Cycles rendered needs to be selected
xrs.set_renderer_to_cycles()
render = bpy.context.scene.render
render.film_transparent = True

# Use an existing camera R01_C01 (Snap36 naming convention), if it is found, otherwise take the first one
cameras = xrs.get_all_cameras()
render_camera = cameras[0]
for camera in cameras:
  if camera.name[-7::] == "R01_C01":
    render_camera = camera
bpy.context.scene.camera = camera

# Show only the low_res model
xrs.show_single_object_for_render(bpy.data.objects[model_name+'_low_res'])

# Set the image resolution to 300x300 px (or perhaps higher with resize after)
render.resolution_x = 300
render.resolution_y = 300
render.resolution_percentage = 200
bpy.context.scene.cycles.samples = 1000

# Set the image save location
bpy.context.scene.render.filepath = EXPORT_DIR + model_name + "-900.png"
bpy.context.scene.render.image_settings.file_format = "PNG"

# Background image and lighting
world = bpy.context.scene.world
world.use_nodes = True
ev = world.node_tree.nodes.new(type='ShaderNodeTexEnvironment')
background_hdri = bpy.data.images.load(filepath=RESOURCES_DIR + "hdri/hdrihaven/studio_small_03_4k.hdr")
ev.image = background_hdri
world.node_tree.links.new(ev.outputs[0],world.node_tree.nodes["Background"].inputs[0])
# -- Eventually, the photo studio should be able to set these via a web tool

# Render the image
bpy.ops.render.render()

# Save the image
bpy.data.images['Render Result'].save_render(filepath=bpy.context.scene.render.filepath)

xrs.print_status("Render Preview Time: " + str(time.time() - timer) + " seconds")
