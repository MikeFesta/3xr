# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Change blender mode
"""
import bpy

def set_edit():
  """ Set to Edit Mode - Note may be buggy """
  try:
    bpy.ops.object.mode_set(mode = "EDIT")
  except:
    pass

def set_object():
  """ Set to Object Mode - Note may be buggy """
  try:
    bpy.ops.object.mode_set(mode = "OBJECT")
  except:
    pass
