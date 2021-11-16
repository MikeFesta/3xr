# SPDX-License-Identifier: Apache-2.0
import bpy
import math
import os
import time
from xrs import automate as xra

xra.log_info('Rendering Asset Image from angle')
arguments = xra.get_command_line_arguments()
working_dir = arguments[0]
asset_name = arguments[1]
filename = arguments[2]
theta = float(arguments[3])
phi = float(arguments[4])
radius = float(arguments[5])
line_draw_on = arguments[6] == "true"
xra.log_debug("Line Draw is " + str(line_draw_on))
asset_blend = working_dir + asset_name + '.blend'

xra.log_info('Linking asset from ' + asset_blend + ' with camera rotation ' + str(theta) + ', ' + str(phi) + ', ' + str(radius))
xra.append_collection(asset_blend, "master")
if ("master" not in bpy.data.collections):
  # Exit if the collection couldn't be loaded
  xra.quit_with_error("Unable to load master collection")

xra.log_info('Setting Render Engine to Cycles')
xra.set_renderer_to_cycles(64) #TODO: experiment with this number
xra.set_render_resolution(2048, 2048)
xra.log_info('Rendering device: ' + bpy.context.scene.cycles.device)
bpy.context.scene.render.film_transparent = True

# Don't render the backdrop
if "Backdrop" in bpy.data.objects:
  bpy.data.objects["Backdrop"].cycles.is_holdout = True
  # when camera is under, backface culling is used instead of holdout
  if (phi > math.pi):
    bpy.data.objects["Floor"].cycles.is_holdout = True
  else:
    bpy.data.objects["Floor"].cycles.is_holdout = False

# Camera
bpy.ops.object.camera_add()
bpy.context.scene.camera = bpy.context.active_object

# Join all objects in the master collection into a single object
# this is for camera scaling purposes
xra.join_collection_objects_into_one("master")

# Make sure that it is not hidden from the render (TODO: add to validation)
bpy.data.collections["master"].objects[0].hide_render = False

# Rotate the object and angle the camera (vertically only)
xra.rotate_object_and_angle_camera(
  bpy.context.scene.camera,
  bpy.data.collections["master"].objects[0],
  theta,
  phi
)

# Render Image
xra.log_info('Starting Render')
timer = time.time()
bpy.ops.render.render()

# Image Save Location
xra.log_info('Setting Image Save Location')
# TODO: pass the filename from rabbit
bpy.context.scene.render.filepath = working_dir + filename
bpy.context.scene.render.image_settings.file_format = "PNG"
xra.log_info(bpy.context.scene.render.filepath)

# Save Image
bpy.data.images["Render Result"].save_render(filepath=bpy.context.scene.render.filepath)
xra.log_info(filename + " Render Time: " + str(time.time() - timer) + " seconds")

# Render Line Drawings
if line_draw_on:
  xra.log_info("Setting Up Line Drawing Mode for Render")
  xra.create_line_draw()
  bpy.ops.render.render()

# Image Render Line Drawings Save Location
  xra.log_info('Setting Image Save Location for Line Drawing')
# TODO: pass the filename from rabbit
  bpy.context.scene.render.filepath = working_dir + filename[:-4] + "_line_drawing" + ".png"
  xra.log_info(bpy.context.scene.render.filepath)

# Save Render Line Drawings Image
  bpy.data.images["Render Result"].save_render(filepath=bpy.context.scene.render.filepath)
  xra.log_info(filename[:-4] + "_line_drawing" + ".png |" + " Render Time: " + str(time.time() - timer) + " seconds")
