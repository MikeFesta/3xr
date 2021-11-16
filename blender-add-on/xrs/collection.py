# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Collection related functions """
import bpy
import xrs.filename
import xrs.log
import xrs.mode
import xrs.object
import xrs.select

def collection_has_objects(name):
  """ True if the given Collection exists and contains objects """
  if name not in bpy.data.collections:
    return False
  if len(bpy.data.collections[name].objects) == 0:
    return False
  return True

def get_dimensions(name):
  """ Returns the max dimensions of all objects in the collection """
  x_min = 0
  x_max = 0
  y_min = 0
  y_max = 0
  z_min = 0
  z_max = 0
  first_object = True
  if (has_collection_named(name) == False):
    return (0,0,0)
  for obj in bpy.data.collections[name].objects:
    if (first_object):
      x_min, x_max, \
      y_min, y_max, \
      z_min, z_max = xrs.object.get_min_max_global_limits(obj)
      first_object = False
    else:
      x_neg, x_pos, \
      y_neg, y_pos, \
      z_neg, z_pos = xrs.object.get_min_max_global_limits(obj)
      if (x_neg < x_min):
        x_min = x_neg
      if (x_pos > x_max):
        x_max = x_pos
      if (y_neg < y_min):
        y_min = y_neg
      if (y_pos > y_max):
        y_max = y_pos
      if (z_neg < z_min):
        z_min = z_neg
      if (z_pos > z_max):
        z_max = z_pos
  return ((x_max - x_min), (y_max - y_min), (z_max - z_min))

def get_objects(name):
  """ Returns all objects from the given collection """
  if has_collection_named(name) == False:
    xrs.log.error("No collection named '" + name + "'")
    return []
  return bpy.data.collections[name].all_objects

def has_collection_named(name):
  """ Check if the file has a collection with the given name """
  return (name in bpy.data.collections)

def join_objects_into_one(name):
  """ Join all of the objects in the collection into a single object (any) """
  if has_collection_named(name) == False:
    xrs.log.error("No collection named '" + name + "'")
    return False
  if len(bpy.data.collections[name].all_objects) > 1:
    # Ensure that it is not in edit mode
    xrs.mode.set_object()
    bpy.context.view_layer.objects.active = bpy.data.collections[name].all_objects[0]
    xrs.select.collection_named(name)
    bpy.ops.object.join()
    return True
  return False

def remove_spaces_from_image_names():
  """ Goes through the web collection images and takes out spaces """
  for img in bpy.data.images:
    if str(img.name).startswith(xrs.filename.get_filename()) == True:
      new_img = "_".join(img.name.split())
      img.name = new_img

def get_largest_dimension(name):
  """ Returns the largest dimension of all objects in the collection """
  x, y, z, = get_dimensions(name)
  if x > y and x > z:
    return x
  if y > z and y > x:
    return y
  if z > y and z > x:
    return z
  if x == y or x == z:
    return x
  if y == z:
    return y

def get_shortest_dimension(name):
  """ Returns the shortest dimension of all objects in the collection """
  x, y, z, = get_dimensions(name)
  if x < y and x < z:
    return x
  if y < z and y < x:
    return y
  if z < y and z < x:
    return z
  if x == y or x == z:
    return x
  if y == z:
    return y

def link_object_by_name(object_name, collection_name):
  """ Make a link to a collection - allows for it to be on multiple layers """
  bpy.data.collections[collection_name].objects.link(bpy.data.objects[object_name])
