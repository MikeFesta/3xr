# SPDX-License-Identifier: Apache-2.0
import bpy
from xrs import studio as xrs
import xrs.log

class xrsPreferences(bpy.types.AddonPreferences):
  bl_idname = 'xrs'

  api_token: bpy.props.StringProperty(default="", maxlen=70)

  def draw(self, context):
    layout = self.layout
    layout.label(text="XR Studio Settings")
    layout.prop(self, "api_token")

class xrsProperties(bpy.types.PropertyGroup):
  product_name: bpy.props.StringProperty(default="", maxlen=64)
  product_uid: bpy.props.StringProperty(default="", maxlen=12)

classes = (
  xrsPreferences,
  xrsProperties,
)

def register():
  for c in classes:
    bpy.utils.register_class(c)
  # Also have to name and link to the Scene
  bpy.types.Scene.xr_studio = bpy.props.PointerProperty(type=xrsProperties)

def unregister():
  for c in classes:
    bpy.utils.unregister_class(c)
  # Also have to delet from the Scene
  del(bpy.types.Scene.xr_studio)

if __name__ == "__main__":
    register()
