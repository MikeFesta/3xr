# SPDX-License-Identifier: Apache-2.0
bl_info = {
  "name": "3XR Studio",
  "blender": (2, 81, 0),
  "category": "System",
  "author": "Mike Festa",
  "version": (21, 1, 14),
  "description": "Tools for building XR ready models for 3xr.com",
}

import bpy
import traceback
import xrs.handlers
import xrs.operators
import xrs.panels
import xrs.properties

def register():
  try:
    xrs.handlers.register()
    xrs.properties.register()
    xrs.operators.register()
    xrs.panels.register()
  except:
    traceback.print_exc()
  print("Registered {}".format(bl_info["name"]))

def unregister():
  try:
    xrs.handlers.unregister()
    xrs.properties.unregister()
    xrs.operators.unregister()
    xrs.panels.unregister()
  except:
    traceback.print_exc()
  print("Unregistered {}".format(bl_info["name"]))
