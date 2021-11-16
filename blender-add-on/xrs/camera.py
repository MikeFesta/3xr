# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Camera related functions
"""
import bpy
import math
import xrs.object

def point_at_object_from_angle(camera, obj, angle_orbit, angle_up):
  """ Position the camera at the center, 1m away from the target """
  camera.location.x = obj.location.x
  camera.location.y = obj.location.y - 1
  camera.location.z = obj.dimensions.z/2
  camera.rotation_euler = ((math.pi/2, 0, 0))
  # Rotate the camera around the object
  if 'camera_pivot' not in bpy.data.objects:
    bpy.data.objects.new('camera_pivot', None)
  cp = bpy.data.objects['camera_pivot']
  cp.location = obj.location
  cp.location.z = obj.dimensions.z/2
  camera.parent = cp
  cp.rotation_euler = ((angle_up, 0, angle_orbit))
  # Set the focal length to 70mm, view target, crop by setting back to 50mm
  camera.data.lens = 70
  xrs.object.select(obj)
  bpy.ops.view3d.camera_to_view_selected()
  camera.data.lens = 50

def rotate_object_and_angle_camera(camera, obj, angle_orbit, angle_up):
  """ Position the camera at the center, 1m away from the target """
  camera.location.x = obj.location.x
  camera.location.y = obj.location.y - 1
  camera.location.z = obj.dimensions.z/2
  camera.rotation_euler = ((math.pi/2, 0, 0))
  # Rotate the object
  obj.rotation_euler = ((0, 0, angle_orbit))
  # Rotate the camera around the object
  if 'camera_pivot' not in bpy.data.objects:
    bpy.data.objects.new('camera_pivot', None)
  cp = bpy.data.objects['camera_pivot']
  cp.location = obj.location
  cp.location.z = obj.dimensions.z/2
  camera.parent = cp
  cp.rotation_euler = ((angle_up, 0, 0))
  # Set the focal length to 70mm, view target, crop by setting back to 50mm
  camera.data.lens = 70
  xrs.object.select(obj)
  bpy.ops.view3d.camera_to_view_selected()
  camera.data.lens = 50

def rotate_object_and_angle_camera_fixed_radius(camera, obj, angle_orbit, angle_up, radius):
  """ Position the camera at the center, a given radius from the target """
  camera.location.x = obj.location.x
  camera.location.y = obj.location.y - radius
  camera.location.z = obj.dimensions.z/2
  camera.rotation_euler = ((math.pi/2, 0, 0))
  # Rotate the object
  obj.rotation_euler = ((0, 0, angle_orbit))
  # Rotate the camera around the object
  if 'camera_pivot' not in bpy.data.objects:
    bpy.data.objects.new('camera_pivot', None)
  cp = bpy.data.objects['camera_pivot']
  cp.location = obj.location
  cp.location.z = obj.dimensions.z/2
  camera.parent = cp
  cp.rotation_euler = ((angle_up, 0, 0))
  # Set the focal length to 50mm, not zooming to fit to keep the spin centered
  camera.data.lens = 50
  # TODO: Need to figure out the z height to center in frame
