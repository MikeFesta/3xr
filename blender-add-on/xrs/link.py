# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Link objects from other blender files
"""
import bpy
import xrs.log

def collection(filename, collection_name, link = True):
  """ Link a collection with the given name """
  if collection_name in bpy.data.collections:
    xrs.log.warn(collection_name + " already in the scene")
  else:
    bpy.ops.wm.append(
      filepath=filename,
      directory=filename + "/Collection/",
      filename=collection_name,
      link=link
    )
    # Needs to be linked to the view layer (might not be needed anymore)
    if collection_name not in bpy.context.scene.collection.children:
      bpy.context.scene.collection.children.link(bpy.data.collections[collection_name])

def material(filename, material_name, link = True):
  """ Link a collection with the given name """
  if material_name in bpy.data.materials:
    xrs.log.warn(material_name + " already in the scene")
  else:
    bpy.ops.wm.append(
      filepath=filename,
      directory=filename + "/Material/",
      filename=material_name,
      link=link
    )

def object(filename, object_name):
  """ Link an object with the given name """
  if object_name in bpy.data.objects:
    xrs.log.warn(object_name + " already in the scene")
  else:
    bpy.ops.wm.link(
      filepath=filename,
      directory=filename + "/Object/",
      filename=object_name
    )
