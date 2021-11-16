# SPDX-License-Identifier: Apache-2.0
import bpy
import math
import os
import time
from xrs import tools as xrs

def link_object(filename, object_name):
  """ Link an object with the given name """
  if object_name in bpy.data.objects:
    xrs.print_warning(object_name + " already in the scene")
  else:
    xrs.print_status("Linking " + object_name)
    bpy.ops.wm.link(
      filepath=filename,
      directory=filename + "/Object/",
      filename=object_name
    )

def move_lamp_above_camera(lamp, camera, z_multiplier):
  lamp.location.x = camera.location.x
  lamp.location.y = camera.location.y
  lamp.location.z = camera.location.z * z_multiplier

def point_camera_at_object_from_angle(camera, model, angle_orbit, angle_up):
  # Position the camera at the center, 1m away from the target
  camera.location.x = model.location.x
  camera.location.y = model.location.y - 1
  camera.location.z = model.dimensions.z/2
  camera.rotation_euler = ((math.pi/2, 0, 0))
  # Rotate the camera around the object
  if 'camera_pivot' not in bpy.data.objects:
    bpy.data.objects.new('camera_pivot', None)
  cp = bpy.data.objects['camera_pivot']
  cp.location = model.location
  cp.location.z = model.dimensions.z/2
  camera.parent = cp
  cp.rotation_euler = ((angle_up, 0, angle_orbit))
  # Set the focal length to 70mm, view target, crop by setting back to 50mm
  camera.data.lens = 70
  xrs.select_object(model)
  bpy.ops.view3d.camera_to_view_selected()
  camera.data.lens = 50

def set_render_resolution(x,y):
  bpy.context.scene.render.resolution_x = x
  bpy.context.scene.render.resolution_y = y
  bpy.context.scene.render.resolution_percentage = 100

def set_hdri_lighting(image_path, strength):
  bpy.context.scene.world.use_nodes = True
  ev = bpy.context.scene.world.node_tree.nodes.new(type="ShaderNodeTexEnvironment")
  background_hdri = bpy.data.images.load(filepath=image_path)
  ev.image = background_hdri
  bpy.context.scene.world.node_tree.nodes["Background"].inputs[1].default_value = strength
  bpy.context.scene.world.node_tree.links.new(ev.outputs[0],bpy.context.scene.world.node_tree.nodes["Background"].inputs[0])

def get_resources_dir():
  return "/3xr/studio/resources/"

# Set variables
#arguments = xrs.get_command_line_arguments()
model_name = xrs.get_filename_no_ext()
# this file is called {model_name}_photo_studio, so remove the last part
model_name = "_".join(model_name.split("_")[:-2])

# Import (link only) the mesh data from the main file, which should be next to this one.
# TODO: Turn on camera import to allow artist custom camera placement (?)
#for object_name in [model_name + "_low_res", "Camera"]:
link_object(xrs.get_working_dir() + model_name + ".blend", model_name + "_low_res")

# Exit if the low_res mesh couldn't be loaded
if (model_name + "_low_res" not in bpy.data.objects):
  xrs.quit_with_error("Unable to load low_res mesh")

model = bpy.data.objects[model_name + "_low_res"]

# Scale the Backdrop
# TODO: Scale Backdrop (and light strength?)

# Render Engine Setup
xrs.set_renderer_to_cycles()
bpy.context.scene.cycles.samples = 1000
set_render_resolution(900,900)

# Image Save Location
bpy.context.scene.render.filepath = xrs.get_working_dir() + "../final/" + model_name + "-900.jpg"
bpy.context.scene.render.image_settings.file_format = "JPEG"

# HDRI Lighting Setup
set_hdri_lighting(get_resources_dir() + "hdri/hdrihaven/studio_small_03_4k.hdr", 0.25)

# Camera Setup
cameras = xrs.get_all_cameras()
if len(cameras) >= 1:
  # Use the imported camera without moving it
  bpy.context.scene.camera = cameras[0]
else:
  # No camera in scene, create a new one and position it
  bpy.ops.object.camera_add()
  bpy.context.scene.camera = bpy.context.active_object
  point_camera_at_object_from_angle(
    bpy.context.scene.camera,
    model,
    -math.pi/6,
    -math.pi/8
  )

# Set Light Position
# TODO: should this be a sun instead?
move_lamp_above_camera(bpy.data.objects["Point"], bpy.context.scene.camera, 4)

# Render Image
timer = time.time()
bpy.ops.render.render()

# Save Image
bpy.data.images["Render Result"].save_render(filepath=bpy.context.scene.render.filepath)
xrs.print_status("Render Thumbnail Time: " + str(time.time() - timer) + " seconds")
