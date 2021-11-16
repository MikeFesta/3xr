# SPDX-License-Identifier: Apache-2.0
import bpy
import math
import os
import time
from xrs import automate as xra

xra.log_info('Rendering Asset Orthographic Images')
arguments = xra.get_command_line_arguments()
working_dir = arguments[0]
asset_name = arguments[1]
submission_id = arguments[2]
asset_blend = working_dir + asset_name + '.blend'

# Save a copy for testing purposes. Can be removed in the future.
# TODO: Remove this when it is not needed anymore
xra.save_as(working_dir, 'render_test')

xra.log_info('Linking asset from ' + asset_blend)
# TODO: this should use the master collection instead of web
xra.append_collection(asset_blend, "web")
if ("web" not in bpy.data.collections):
  # Exit if the collection couldn't be loaded
  xra.quit_with_error("Unable to load web collection")

# Relink the textures to the current directory
xra.relink_textures(working_dir)

# TODO: The backdrop will be remade, make the normal size 2x bigger, so 2 * can be dropped here
#scale = 1 * max(bpy.data.collections["web"].objects[0].dimensions)

# Render Engine Setup (Note: Eevee not supported headless)
#https://devtalk.blender.org/t/blender-2-8-unable-to-open-a-display-by-the-rendering-on-the-background-eevee/1436/24
xra.log_info('Setting Render Engine to Cycles')
xra.set_renderer_to_cycles(64) #TODO: experiment with this number
xra.set_render_resolution(2048, 2048)
xra.log_info('Rendering device: ' + bpy.context.scene.cycles.device)

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

# Background should be visible for these renders
bpy.data.objects['Backdrop'].cycles.is_holdout = False
bpy.data.objects['Floor'].cycles.is_holdout = False

# Lighting Setup
#xra.set_hdr_lighting("lebombo_1k", 0.25)
#xra.set_light_strength(bpy.data.objects["Point"], scale * 30)
#xra.set_light_strength(bpy.data.objects["Area"], scale * 30)

# Scale the Backdrop and light strength
#xra.scale_object_uniform(bpy.data.objects['Backdrop'], scale)

# Join all objects in the web collection into a single object
xra.join_collection_objects_into_one("web")

# Make sure that it is not hidden from the render (TODO: add to validation)
bpy.data.collections["web"].objects[0].hide_render = False

for shot in shots:
  # Rotate the object and angle the camera (vertically only)
  xra.rotate_object_and_angle_camera(
    bpy.context.scene.camera,
    bpy.data.collections["web"].objects[0],
    shot.x,
    shot.z
  )

  # Move the light
#  xra.place_light_above_camera(bpy.data.objects["Point"], bpy.context.scene.camera, scale)

  # Rotate the backdrop (if specified)
#  if shot.rotate_backdrop:
#    bpy.data.objects['Backdrop'].rotation_euler = (0, 0, shot.x)

  # Render Image
  xra.log_info('Starting Render')
  timer = time.time()
  bpy.ops.render.render()

  # Image Save Location
  xra.log_info('Setting Image Save Location')
  bpy.context.scene.render.filepath = working_dir + asset_name + shot.name + ".jpg"
  bpy.context.scene.render.image_settings.file_format = "JPEG"
  xra.log_info(bpy.context.scene.render.filepath)

  # Save Image
  bpy.data.images["Render Result"].save_render(filepath=bpy.context.scene.render.filepath)
  xra.log_info(shot.name + " Render Time: " + str(time.time() - timer) + " seconds")
  renders.append(asset_name + shot.name + ".jpg")

  # Reset Object Rotation
  bpy.data.collections["web"].objects[0].rotation_euler = (0,0,0)

if xra.record_asset_submission_renders(submission_id, renders) == False:
  xra.log_error("Unable to record renders on 3xr.com")

# Save again with all of the changes
# TODO: remove this when no longer needed
xra.save_as(working_dir, 'render_test')
