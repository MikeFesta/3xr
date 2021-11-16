# SPDX-License-Identifier: Apache-2.0
import bpy
import math
import os
import time
from xrs import automate as xra

xra.log_info('Rendering Asset Thumbnail')
arguments = xra.get_command_line_arguments()
working_dir = arguments[0]
asset_name = arguments[1]
asset_blend = working_dir + asset_name + '.blend'

xra.log_info('Linking asset from ' + asset_blend)
xra.link_collection(asset_blend, "web")
if ("web" not in bpy.data.collections):
  # Exit if the collection couldn't be loaded
  xra.quit_with_error("Unable to load web collection")

# Relink the textures to the current directory
xra.relink_textures(working_dir)

target_height = bpy.data.collections["web"].objects[0].dimensions.z

# Render Engine Setup (Note: Eevee not supported headless)
#https://devtalk.blender.org/t/blender-2-8-unable-to-open-a-display-by-the-rendering-on-the-background-eevee/1436/24
xra.log_info('Setting Render Engine to Cycles')
xra.set_renderer_to_cycles(64) #TODO: experiment with this number
xra.set_render_resolution(1024, 1024)

# Image Save Location
xra.log_info('Setting Image Save Location')
bpy.context.scene.render.filepath = working_dir + asset_name + "-1k.jpg"
bpy.context.scene.render.image_settings.file_format = "JPEG"
xra.log_info(bpy.context.scene.render.filepath)

# Camera
bpy.ops.object.camera_add()
bpy.context.scene.camera = bpy.context.active_object
xra.point_camera_at_object_from_angle(
  bpy.context.scene.camera,
  bpy.data.collections["web"].objects[0], #TODO: Multiple Objects
  -math.pi/6,
  -math.pi/8
)

# Lighting Setup
xra.set_hdr_lighting("bw_lebombo_1k", 0.25)
xra.place_light_above_camera(bpy.data.objects["Point"], bpy.context.scene.camera, target_height)
xra.set_light_strength(bpy.data.objects["Point"], target_height * 30)

# Scale the Backdrop and light strength
xra.scale_object_uniform(bpy.data.objects['Backdrop'], target_height)

# Render Image
xra.log_info('Starting Render')
timer = time.time()
bpy.ops.render.render()

# Save Image
bpy.data.images["Render Result"].save_render(filepath=bpy.context.scene.render.filepath)
xra.log_info("Render Thumbnail Time: " + str(time.time() - timer) + " seconds")
