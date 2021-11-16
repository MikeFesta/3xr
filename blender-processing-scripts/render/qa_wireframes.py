# SPDX-License-Identifier: Apache-2.0
import bpy
import math
import os
import time
from xrs import automate as xra

# NOTE: this was copied from master_images.py, which used to do both 6 sided renders as well as QA wireframes

xra.log_info('Rendering QA Wireframe Images')
arguments = xra.get_command_line_arguments()
working_dir = arguments[0]
asset_name = arguments[1]
submission_id = arguments[2]
asset_blend = working_dir + asset_name + '.blend'

xra.log_info('Linking asset from ' + asset_blend)
xra.append_collection(asset_blend, "master")
if ("master" not in bpy.data.collections):
  # Exit if the collection couldn't be loaded
  xra.quit_with_error("Unable to load master collection")

# Relink the textures to the current directory
# TODO: Textures need to be packed on submission for this to work
# xra.relink_textures(working_dir)

# Render Engine Setup (Note: Eevee not supported headless)
#https://devtalk.blender.org/t/blender-2-8-unable-to-open-a-display-by-the-rendering-on-the-background-eevee/1436/24
xra.log_info('Setting Render Engine to Cycles')
xra.set_renderer_to_cycles(64) #TODO: experiment with this number
xra.set_render_resolution(2048, 2048)
xra.log_info('Rendering device: ' + bpy.context.scene.cycles.device)
bpy.context.scene.render.film_transparent = True

# Don't render the backdrop
if "Backdrop" in bpy.data.objects:
  bpy.data.objects["Backdrop"].cycles.is_holdout = True
  # TODO: do we want to include shadows? probably not
  #bpy.data.objects["Backdrop"].cycles.is_shadow_catcher = True

class shot:
  def __init__(self, name, x, z):
    self.name = name
    self.x = x
    self.z = z

# TODO: if the height of the product is less than X, angle the shot (ie rugs)

renders = []
shots = []
shots.append(shot("-top-2k", 0, -math.pi/2))
shots.append(shot("-right-2k", math.pi/2, 0))
shots.append(shot("-back-2k", math.pi, 0))
shots.append(shot("-left-2k", -math.pi/2, 0))
shots.append(shot("-front-2k", 0, 0))
shots.append(shot("-2k", -math.pi/6, -math.pi/8))

# Camera
bpy.ops.object.camera_add()
bpy.context.scene.camera = bpy.context.active_object
bpy.context.scene.camera.data.clip_start = 0.001

# Join all objects in the master collection into a single object
# this is for camera scaling purposes
xra.join_collection_objects_into_one("master")

# Make sure that it is not hidden from the render (TODO: add to validation)
bpy.data.collections["master"].objects[0].hide_render = False

#Change Material to Wireframe
xra.change_to_wireframe(bpy.data.collections["master"].objects[0])

#Render Angles for Wireframe
for shot in shots:
  # Rotate the object and angle the camera (vertically only)
  xra.rotate_object_and_angle_camera(
    bpy.context.scene.camera,
    bpy.data.collections["master"].objects[0],
    shot.x,
    shot.z
  )

  # Render Wireframe Image
  xra.log_info('Starting Wireframe Render')
  timer = time.time()
  bpy.ops.render.render()

  # Image Save Location
  xra.log_info('Setting Image Save Location')
  bpy.context.scene.render.filepath = working_dir + asset_name + shot.name + "_wireframe.png"
  bpy.context.scene.render.image_settings.file_format = "PNG"
  # TODO: ensure transparency
  xra.log_info(bpy.context.scene.render.filepath)

  # Save Image
  bpy.data.images["Render Result"].save_render(filepath=bpy.context.scene.render.filepath)
  xra.log_info(shot.name + " Render Time: " + str(time.time() - timer) + " seconds")
  renders.append(asset_name + shot.name + "_wireframe.png")

  # Reset Object Rotation
  bpy.data.collections["master"].objects[0].rotation_euler = (0,0,0)

if xra.record_asset_submission_renders(submission_id, renders) == False:
  xra.log_error("Unable to record renders on 3xr.com")
