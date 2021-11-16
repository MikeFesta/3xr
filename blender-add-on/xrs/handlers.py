# SPDX-License-Identifier: Apache-2.0
import bpy
from bpy.app.handlers import persistent
from xrs import studio as xrs
import xrs.log
import xrs.update

@persistent
def load_handler(dummy):
  # Check for an update, but only if the file has a product_uid
  if (bpy.context.scene.xr_studio.product_uid):
    xrs.log.debug(xrs.update.check())

#https://docs.blender.org/api/current/bpy.app.handlers.html

def register():
  bpy.app.handlers.load_post.append(load_handler)

def unregister():
  bpy.app.handlers.load_post.remove(load_handler)
