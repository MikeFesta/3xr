# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Deals with unit conversions """

import bpy

def set_type(unit_name):
  """ Set the unit type for the scene """
  if (unit_name == 'Inches'):
    bpy.context.scene.unit_settings.system = 'IMPERIAL'
    bpy.context.scene.unit_settings.length_unit = 'INCHES'
  elif (unit_name == 'Centimeters'):
    bpy.context.scene.unit_settings.system = 'METRIC'
    bpy.context.scene.unit_settings.length_unit = 'CENTIMETERS'
  else:
    bpy.context.scene.unit_settings.system = 'METRIC'
    bpy.context.scene.unit_settings.length_unit = 'METERS'

def get_size_for_unit(unit_name):
  """ Return the scale multiplier in blender units (m) """
  if (unit_name == 'Inches'):
    return 0.0254
  elif (unit_name == 'Centimeters'):
    return 0.01
  else:
    return 1
