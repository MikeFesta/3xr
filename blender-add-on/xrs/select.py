# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Selection functions
"""

import bpy

def collection_named(name):
  """ Select all objects in the given collection """
  none()
  c = bpy.data.collections[name]
  for o in c.objects:
    o.select_set(True)

def none():
  """ Deselect all objects """
  #bpy.ops.object.select_all(action='DESELECT') #poll() failed, context is incorrect
  for o in bpy.context.view_layer.objects:
    o.select_set(False)

def single_object(obj):
  """ Select only the given object """
  none()
  obj.select_set(True)
  bpy.context.view_layer.objects.active = obj

def single_object_by_name(name):
  single_object(bpy.data.objects[name])
