# SPDX-License-Identifier: Apache-2.0
'''
This file assumes that the photos directory has 6 jpg or png images named:
It also requires the DimensionsCube be in the file.
front_image
back_image
right_image
left_image
top_image
bottom_image
'''
import bpy
import os
import math
from xrs import tools as xrs

model_name = xrs.get_filename_no_ext()
photos_dir = xrs.get_parent_dir() + "photos"
xrs.print_status("Adding 6 photos to " + model_name)

photo_names = [
  'front_image',
  'back_image',
  'right_image',
  'left_image',
  'top_image',
  'bottom_image',
]

if 'DimensionsCube' not in bpy.data.objects:
  xrs.print_error("DimensionsCube not found in scene")
  xrs.quit()

dim_cube = bpy.data.objects['DimensionsCube']

# Reference Collection needs to exist, add Cameras collection and make it active
# Note: Couldn't find an easy way to make the collection active as a subgroup of Reference
cameras_collection = bpy.data.collections.new("Cameras")
bpy.context.scene.collection.children.link(cameras_collection)
bpy.context.view_layer.active_layer_collection = bpy.context.view_layer.layer_collection.children[-1]

for name_with_ext in os.listdir(photos_dir):
  name = os.path.splitext(name_with_ext)[0]
  if name in photo_names:
    if name_with_ext not in bpy.data.images:
      xrs.print_status("Loading photo named " + name_with_ext)
      img = bpy.data.images.load(filepath="//../photos/" + name_with_ext)
      img.name = name
      # Background Images in 2.8 only work on Cameras
      if (name == photo_names[0]):
        # Front
        camera_loc = ((dim_cube.location.x, dim_cube.location.y-1.0, dim_cube.location.z))
        camera_rot = ((math.pi/2, 0, 0))
      elif (name == photo_names[1]):
        # Back
        camera_loc = ((dim_cube.location.x, dim_cube.location.y+1.0, dim_cube.location.z))
        camera_rot = ((math.pi/2, 0, math.pi))
      elif (name == photo_names[2]):
        # Right
        camera_loc = ((dim_cube.location.x+1.0, dim_cube.location.y, dim_cube.location.z))
        camera_rot = ((math.pi/2, 0, math.pi/2))
      elif (name == photo_names[3]):
        # Left
        camera_loc = ((dim_cube.location.x-1.0, dim_cube.location.y, dim_cube.location.z))
        camera_rot = ((math.pi/2, 0, -math.pi/2))
      elif (name == photo_names[4]):
        # Top
        camera_loc = ((dim_cube.location.x, dim_cube.location.y, dim_cube.location.z+1.0))
        camera_rot = ((0, 0, 0))
      elif (name == photo_names[5]):
        # Bottom
        camera_loc = ((dim_cube.location.x, dim_cube.location.y, dim_cube.location.z-1.0))
        camera_rot = ((math.pi, 0, 0))

      bpy.ops.object.camera_add(location = camera_loc, rotation = camera_rot)
      cam = bpy.context.active_object
      cam.name = name
      cam.data.show_background_images = True
      bg = cam.data.background_images.new()
      bg.image = img
      bg.show_on_foreground = True
      bg.frame_method = 'CROP'

# Collection Organization
# Move to inside reference (can't do sooner or it won't be active)
reference_collection = bpy.data.collections["Reference"]
reference_collection.children.link(cameras_collection)
bpy.context.scene.collection.children.unlink(cameras_collection)

xrs.save()
xrs.print_status("Done")
