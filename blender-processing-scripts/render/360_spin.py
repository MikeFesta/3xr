# SPDX-License-Identifier: Apache-2.0
import bpy
import math
import os
import time
from xrs import automate as xra

xra.log_info('Rendering Asset 360 Spin')
arguments = xra.get_command_line_arguments()
working_dir = arguments[0]
asset_uid = arguments[1]
asset_name = arguments[2]
phi = float(arguments[3])
orbitY = arguments[4]
asset_blend = working_dir + asset_name + '.blend'

# Save a copy for testing purposes. Can be removed in the future.
# TODO: Remove this when it is not needed anymore
xra.save_as(working_dir, '360_spin')

xra.log_info('Linking asset from ' + asset_blend + ' with camera rotation ' + str(orbitY))
xra.append_collection(asset_blend, "master")
if ("master" not in bpy.data.collections):
  # Exit if the collection couldn't be loaded
  xra.quit_with_error("Unable to load master collection")

xra.log_info('Setting Render Engine to Cycles')
xra.set_renderer_to_cycles(64) #TODO: experiment with this number
xra.set_render_resolution(2048, 2048)
xra.log_info('Rendering Device: ' + bpy.context.scene.cycles.device)
bpy.context.scene.render.film_transparent = True

# Don't render the backdrop
xra.log_info('Hide the backdrop')
if "Backdrop" in bpy.data.objects:
  bpy.data.objects["Backdrop"].cycles.is_holdout = True
  # when camera is under, backface culling is used instead of holdout
  if (phi > math.pi):
    bpy.data.objects["Floor"].cycles.is_holdout = False
    bpy.data.objects["Floor"].cycles.is_shadow_catcher = True

  else:
    bpy.data.objects["Floor"].cycles.is_holdout = False

# Set up the camera once, then rotate the object once per frame

xra.log_info('adding camera')
bpy.ops.object.camera_add()
xra.log_info('camera created')
bpy.context.scene.camera = bpy.context.active_object
xra.log_info('camera active')
bpy.context.scene.camera.data.clip_start = 0.001
# Join all objects in the master collection into a single object
# this is for camera scaling purposes
xra.join_collection_objects_into_one("master")
xra.rotate_object_and_angle_camera(
  bpy.context.scene.camera,
  bpy.data.collections["master"].objects[0],
  0,
  phi,
)

xra.log_info('camera rotated')

class shotClass:
  def __init__(self, name, x, z):
    self.name = name
    self.x = x
    self.z = z

xra.log_info('starting loop')

for i in range(24):
  theta = i * math.pi/12 # 24 images, 15 degrees apart
  orbitX = str(i * 15)
  shot = shotClass(("-2k-" + orbitY.zfill(3) + "-" + str(orbitX).zfill(3)), theta, phi)

  # Rotate object for next shot
  xra.log_info('Rotating object')
  bpy.data.collections["master"].objects[0].rotation_euler.z = shot.x

  # Make sure that it is not hidden from the render (TODO: add to validation)
  bpy.data.collections["master"].objects[0].hide_render = False

  # Render Image
  xra.log_info('Starting Render')
  timer = time.time()
  bpy.ops.render.render()

  # Image Save Location
  xra.log_info('Setting Image Save Location')
  bpy.context.scene.render.filepath = working_dir + '360/' + orbitY + '/' + asset_name + shot.name + ".png"
  bpy.context.scene.render.image_settings.file_format = "PNG"
  xra.log_info(bpy.context.scene.render.filepath)

  # Save Image
  bpy.data.images["Render Result"].save_render(filepath=bpy.context.scene.render.filepath)
  xra.log_info(shot.name + " Render Time: " + str(time.time() - timer) + " seconds")

# Recording will happen in the bash script 360_spin.sh
#if xra.record_asset_has360(asset_uid) == False:
#  xra.log_error("Unable to record has360 on 3xr.com")

# Save again with all of the changes
# TODO: remove this when no longer needed
xra.save_as(working_dir, '360_spin')
