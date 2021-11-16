# SPDX-License-Identifier: Apache-2.0
import bpy
from xrs import studio as xrs
from bpy.types import Operator, Macro

def ShowMessageBox(message = "", title = "Message Box", icon = 'INFO'):
  def draw(self, context):
    self.layout.label(text=message)
  bpy.context.window_manager.popup_menu(draw, title = title, icon = icon)

class WM_OT_bakePop(bpy.types.Operator):
  """ Popup Box for Baking Options """
  bl_label = "Baking Options"
  bl_idname = "wm.bakepop"

  res_number: bpy.props.IntProperty(name="Resolution", default=4096)
  number: bpy.props.FloatProperty(name="Ray Distance", default=0.01)

  def execute(self, context):
    bpy.data.scenes['Scene'].render.bake.cage_extrusion = self.number
    bpy.data.scenes['Scene'].render.resolution_x = self.res_number
    bpy.data.scenes['Scene'].render.resolution_y = self.res_number
    return {"FINISHED"}

  def invoke(self, context, event):
    return context.window_manager.invoke_props_dialog(self)

class WM_OT_imgPop(bpy.types.Operator):
  """ Popup Box for Image Denoiser """
  bl_label = "Image Denoiser"
  bl_idname = "wm.imgpop"

  img: bpy.props.StringProperty(name="Image Name", default="Image Name Here")

  def execute(self, context):
    try:
      xrs.denoise_img(self.img)
    except KeyError:
      ShowMessageBox("A Valid Image Name Must Be Used", "WARNING", 'ERROR')
      self.report({'WARNING'}, "A Valid Image Name Must Be Used")
      return {"FINISHED"}

    ShowMessageBox("Image Successfully in Denoiser.", "Valid", 'CHECKMARK')
    self.report({'INFO'}, "Image in Denoiser. Check your Viewer Node in your Image Editor for Results.")
    return {"FINISHED"}

  def invoke(self, context, event):
    return context.window_manager.invoke_props_dialog(self)

class xrsAutoName(bpy.types.Operator):
  bl_idname = "xrs.auto_name"
  bl_label = "Web Collection Auto-Name"
  bl_description = "Automatically name your web collection in Blender"

  def execute(self, context):

    if len(bpy.data.collections['web'].all_objects) == 0:
      ShowMessageBox("Web collection must have at least one object", "ERROR", 'ERROR')
      self.report({'WARNING'}, "Web collection must have at least one object")
      return {'FINISHED'}
    else:
      print("Web collection has at least one object")

    try:
      bpy.data.collections['web'].objects[0].material_slots[0].name == ""
    except IndexError:
      ShowMessageBox("Web collection must have a material on the model", "ERROR", 'ERROR')
      self.report({'WARNING'}, "Web collection must have a material on the model")
      return {'FINISHED'}

    xrs.auto_name()
    ShowMessageBox("Web collection has been automatically named", "Valid", 'CHECKMARK')
    self.report({'INFO'}, "Complete - Web collection has been automatically named")
    return {'FINISHED'}

# Functionality Reliant on Synchonous Baking and Saving
class xrsBakeAll(bpy.types.Macro):
  bl_idname = "xrs.bake_all"
  bl_label = "Bake All Maps"
  bl_description = "Create an AO, diffuse, roughness, metallic, and normal map for the selected object"

#  def execute(self, context):
    # Checks if an object is selected
#    if bpy.context.active_object.type != "MESH":
#      ShowMessageBox("An object mesh needs to be selected", "ERROR", 'ERROR')
#      self.report({'WARNING'}, "An object mesh needs to be selected")
#      return {'FINISHED'}
#    else:
#      print("An Object Is Selected")

#    Function to Bake All
#    ShowMessageBox("Save Out Your Image Texture When Progress Is Done", "Valid", 'ERROR')
    #ShowMessageBox("Ambient Occlusion Texture Saved", "Valid", 'CHECKMARK')
    #self.report({'INFO'}, "Complete - Ambient Occlusion Texture Saved to Textures Folder")
#    return {'FINISHED'}

# Used for Testing Macro Classes
class xrsBakeAO(bpy.types.Operator):
  bl_idname = "xrs.bake_ao"
  bl_label = "Bake AO"
  bl_description = "Macro Bake AO"

  def execute(self, context):
    xrs.bake_selected_ao()

class xrsBakeLighting(bpy.types.Operator):
  bl_idname = "xrs.bake_lighting"
  bl_label = "Bake Lighting"
  bl_description = "Bake lighting to selected object"

  def execute(self, context):
    # Checks if an object is selected
    if bpy.context.active_object.type != "MESH":
      ShowMessageBox("An object mesh needs to be selected", "ERROR", 'ERROR')
      self.report({'WARNING'}, "An object mesh needs to be selected")
      return {'FINISHED'}
    else:
      print("An Object Is Selected")

    xrs.bake_lighting()
    ShowMessageBox("Save Out Your Image Texture When Progress Is Done", "Valid", 'ERROR')
    return {'FINISHED'}

# Used for Testing Macro Classes
class xrsSaveAO(bpy.types.Operator):
  bl_idname = "xrs.save_ao"
  bl_label = "Bake AO"
  bl_description = "Macro Bake AO"

  def execute(self, context):
    aoName = bpy.context.active_object.name + "_4k_ao"
    bpy.data.images[aoName].save_render(filepath=bpy.context.scene.render.filepath)
    return {'FINISHED'}

class xrsBakeSelectedAO(bpy.types.Operator):
  bl_idname = "xrs.bake_selected_ao"
  bl_label = "Bake Ambient Occlusion"
  bl_description = "Create an Ambient Occlusion Map for the selected object"

  def execute(self, context):
    # Checks if an object is selected
    if bpy.context.active_object.type != "MESH":
      ShowMessageBox("An object mesh needs to be selected", "ERROR", 'ERROR')
      self.report({'WARNING'}, "An object mesh needs to be selected")
      return {'FINISHED'}
    else:
      print("An Object Is Selected")

    xrs.bake_selected_ao()

    ShowMessageBox("Save Out Your Image Texture When Progress Is Done", "Valid", 'ERROR')
    #ShowMessageBox("Ambient Occlusion Texture Saved", "Valid", 'CHECKMARK')
    #self.report({'INFO'}, "Complete - Ambient Occlusion Texture Saved to Textures Folder")
    return {'FINISHED'}

class xrsBakeSelectedDiffuse(bpy.types.Operator):
  bl_idname = "xrs.bake_selected_diffuse"
  bl_label = "Bake Diffuse"
  bl_description = "Create a Diffuse Map for the selected object"

  def execute(self, context):
    # Checks if an object is selected
    if bpy.context.active_object.type != "MESH":
      ShowMessageBox("An object mesh needs to be selected", "ERROR", 'ERROR')
      self.report({'WARNING'}, "An object mesh needs to be selected")
      return {'FINISHED'}
    else:
      print("An Object Is Selected")

    xrs.bake_selected_diffuse()
    ShowMessageBox("Save Out Your Image Texture When Progress Is Done", "Valid", 'ERROR')
    #ShowMessageBox("Diffuse Texture Saved", "Valid", 'CHECKMARK')
    #self.report({'INFO'}, "Complete - Diffuse Texture Saved to Textures Folder")
    return {'FINISHED'}

class xrsBakeSelectedMetallic(bpy.types.Operator):
  bl_idname = "xrs.bake_selected_metallic"
  bl_label = "Bake Metallic"
  bl_description = "Create a Metallic Map for the selected object"

  def execute(self, context):
    # Checks if an object is selected
    if bpy.context.active_object.type != "MESH":
      ShowMessageBox("An object mesh needs to be selected", "ERROR", 'ERROR')
      self.report({'WARNING'}, "An object mesh needs to be selected")
      return {'FINISHED'}
    else:
      print("An Object Is Selected")

    if xrs.bake_selected_metallic() == False:
      ShowMessageBox("Metallic values nred to be either 1 or 0.", "ERROR", 'ERROR')
      self.report({'WARNING'}, "Metallic values need to be either 1 or 0.")
      return {'FINISHED'}
    else:
      ShowMessageBox("Save Out Your Image Texture When Progress Is Done", "Valid", 'ERROR')
      #ShowMessageBox("Metallic Texture Saved", "Valid", 'CHECKMARK')
      #self.report({'INFO'}, "Complete - Metallic Texture Saved to Textures Folder")
      return {'FINISHED'}

class xrsBakeSelectedNormal(bpy.types.Operator):
  bl_idname = "xrs.bake_selected_normal"
  bl_label = "Bake Normal"
  bl_description = "Create a Normal Map for the active object from selected"

  def execute(self, context):
    # Checks if an object is selected
    if bpy.context.active_object.type != "MESH":
      ShowMessageBox("An object mesh needs to be selected", "ERROR", 'ERROR')
      self.report({'WARNING'}, "An object mesh needs to be selected")
      return {'FINISHED'}
    else:
      print("An Object Is Selected")

    xrs.bake_selected_normal()
    ShowMessageBox("Save Out Your Image Texture When Progress Is Done", "Valid", 'ERROR')
    #ShowMessageBox("Roughness Texture Saved", "Valid", 'CHECKMARK')
    #self.report({'INFO'}, "Complete - Roughness Texture Saved to Textures Folder")
    return {'FINISHED'}

class xrsBakeSelectedRoughness(bpy.types.Operator):
  bl_idname = "xrs.bake_selected_roughness"
  bl_label = "Bake Roughness"
  bl_description = "Create a Roughness Map for the active object"

  def execute(self, context):
    # Checks if an object is selected
    if bpy.context.active_object.type != "MESH":
      ShowMessageBox("An object mesh needs to be selected", "ERROR", 'ERROR')
      self.report({'WARNING'}, "An object mesh needs to be selected")
      return {'FINISHED'}
    else:
      print("An Object Is Selected")

    xrs.bake_selected_roughness()

    ShowMessageBox("Save Out Your Image Texture When Progress Is Done", "Valid", 'ERROR')
    #ShowMessageBox("Roughness Texture Saved", "Valid", 'CHECKMARK')
    #self.report({'INFO'}, "Complete - Roughness Texture Saved to Textures Folder")
    return {'FINISHED'}

class xrsCreate3XRMatNode(bpy.types.Operator):
  bl_idname = "xrs.create_3xr_mat_node"
  bl_label = "Create 3XR Procedural Material Node"
  bl_description = "Create a standard 3XR procedural material node in a given 3XR material file"

  def execute(self, context):

    try:
      name = bpy.context.scene.xr_studio.product_name
      xrs.create_3XR_mat_node(name)
      ShowMessageBox("3XR Procedural Material Group Node Created", "Valid", 'CHECKMARK')
      self.report({'INFO'}, "3XR Material Group Node Created")
    except:
      ShowMessageBox("3XR Procedural Material Not Found", "ERROR", 'ERROR')
      self.report({'WARNING'}, "3XR Procedural Material Not Found. Do not use if there is no 3XR Procedural Material in file.")

    return {'FINISHED'}

class xrsDrawNormalStart(bpy.types.Operator):
  bl_idname = "xrs.draw_normal_start"
  bl_label = "Draw Normal Start"
  bl_description = "Start Drawing Your Normal Map of the Active Object"

  def execute(self, context):

    # Checks if an object is selected
    if bpy.context.active_object.type != "MESH":
      ShowMessageBox("An object mesh needs to be selected", "ERROR", 'ERROR')
      self.report({'WARNING'}, "An object mesh needs to be selected")
      return {'FINISHED'}
    else:
      print("An Object Is Selected")

    xrs.draw_normal(bpy.context.active_object.active_material.name, 4096)

    ShowMessageBox("You Are Set Up to Start Drawing", "Valid", 'CHECKMARK')
    self.report({'INFO'}, "Normal Map Drawing Started")
    return {'FINISHED'}

class xrsDrawNormalEnd(bpy.types.Operator):
  bl_idname = "xrs.draw_normal_end"
  bl_label = "Draw Normal End"
  bl_description = "End Drawing Your Normal Map of the Active Object"

  def execute(self, context):

    # Checks if an object is selected
    if bpy.context.active_object.type != "MESH":
      ShowMessageBox("An object mesh needs to be selected", "ERROR", 'ERROR')
      self.report({'WARNING'}, "An object mesh needs to be selected")
      return {'FINISHED'}

    xrs.end_draw_normal(bpy.context.active_object.active_material.name, 4096)

    ShowMessageBox("You Are Set Up to Start Drawing", "Valid", 'CHECKMARK')
    self.report({'INFO'}, "Normal Map Drawing Started")
    return {'FINISHED'}

class xrsRecalculateNormals(bpy.types.Operator):
  bl_idname = "xrs.recalculate_normals"
  bl_label = "Recalculate Normals"
  bl_description = "Make all normals of the selected object face outward"

  def execute(self, context):
    # Checks if an object is selected
    if bpy.context.active_object.type != "MESH":
      ShowMessageBox("An object mesh needs to be selected", "ERROR", 'ERROR')
      self.report({'WARNING'}, "An object mesh needs to be selected")
      return {'FINISHED'}

    xrs.recalculate_normals()
    return {'FINISHED'}

class xrsSyncPullOperator(bpy.types.Operator):
  bl_idname = "xrs.sync_pull"
  bl_label = "Pull"
  bl_description = "Pull the latest data from 3xr.studio"
  def execute(self, context):
    return xrs.sync_pull()

class xrsSyncPushOperator(bpy.types.Operator):
  bl_idname = "xrs.sync_push"
  bl_label = "Push"
  bl_description = "Push your changes to 3xr.studio"
  def execute(self, context):
    return xrs.sync_push()

class xrsSubmitProductOperator(bpy.types.Operator):
  bl_idname = "xrs.product_submit"
  bl_label = "Submit to 3xr.com"
  bl_description = "Submit your work to 3xr.studio for processing"
  def execute(self, context):
    # Save all images (they may not be saved if baked recently)
    xrs.save_all_images()

    if xrs.is_image() == False:
      ShowMessageBox("All web textures must be baked out and saved as images to the textures folder", "ERROR", 'ERROR')
      self.report({'WARNING'}, "All web textures must be baked out and saved as images to the textures folder")
      return {'FINISHED'}
    else:
      print("Web collection has no generated images attached")

    if xrs.is_8_bit() == False:
      ShowMessageBox("Web collection can only have 8 bit textures", "ERROR", 'ERROR')
      self.report({'WARNING'}, "Web collection can only have 8 bit textures")
      return {'FINISHED'}
    else:
      print("Web collection has 8 bit textures")

    if (xrs.validate_scene() == False):
      ShowMessageBox("Error Validating Scene - See Report", "ERROR", 'ERROR')
      self.report({'WARNING'}, "Error Validating Scene, see details in Validation Report")
      return {'FINISHED'}

    error_message = xrs.product_submit()
    if error_message:
      ShowMessageBox(error_message, "ERROR", 'ERROR')
      self.report({'ERROR'}, error_message)
    else:
      ShowMessageBox("Check status on 3xr.studio", "Submitted", 'CHECKMARK')
      self.report({'INFO'}, "Submitted to 3xr.com")
    return {'FINISHED'}

class xrsUpdateCheckOperator(bpy.types.Operator):
  bl_idname = "xrs.check_for_update"
  bl_label = "Check for Add-on Update"
  bl_description = "Confirm that you are using the latest version of the addon"
  def execute(self, context):
    message = xrs.check_for_update()
    ShowMessageBox(message, "Update Check", 'FILE_REFRESH')
    self.report({'INFO'}, message)
    return {'FINISHED'}

class xrsUVCheck(bpy.types.Operator):
  bl_idname = "xrs.apply_checkerboard"
  bl_label = "Check UV Layout"
  bl_description = "Check your UV layout through this texture"
  def execute(self, context):
    xrs.apply_checkerboard()
    ShowMessageBox("UV Checker Attached", "Attached", 'CHECKMARK')
    self.report({'INFO'}, "UV Checker Attached")
    return {'FINISHED'}

class xrsUVLayoutExport(bpy.types.Operator):
  bl_idname = "xrs.uv_layout_export"
  bl_label = "Export Web UV Layout"
  bl_description = "Export the web collection UV layout"
  def execute(self, context):
    xrs.uv_layout_export()
    ShowMessageBox("Web UV Layout Exported", "Exported", 'CHECKMARK')
    self.report({'INFO'}, "Web UV Layout Exported")
    return {'FINISHED'}

class xrsValidatorMatOperator(bpy.types.Operator):
  bl_idname = "xrs.validate_mat_scene"
  bl_label = "Check Material Scene"
  bl_description = "Ensure this material file matches 3XR Material Standards for submission"
  def execute(self, context):
    if (xrs.validate_mat_scene()):
      ShowMessageBox("Ready to Submit to 3xr.com", "Valid", 'CHECKMARK')
      self.report({'INFO'}, "Valid - Ready to Submit to 3xr.com")
    else:
      ShowMessageBox("Error Validating Material Scene - See Report", "ERROR", 'ERROR')
      self.report({'WARNING'}, "Error Validating Scene, see details in Validation Report")
    return {'FINISHED'}

class xrsValidatorOperator(bpy.types.Operator):
  bl_idname = "xrs.validate_scene"
  bl_label = "Check Scene"
  bl_description = "Ensure this file matches 3XR Standards for submission"
  def execute(self, context):
    if (xrs.validate_scene()):
      ShowMessageBox("Ready to Submit to 3xr.com", "Valid", 'CHECKMARK')
      self.report({'INFO'}, "Valid - Ready to Submit to 3xr.com")
    else:
      ShowMessageBox("Error Validating Scene - See Report", "ERROR", 'ERROR')
      self.report({'WARNING'}, "Error Validating Scene, see details in Validation Report")
    return {'FINISHED'}

classes = (
  WM_OT_bakePop,
  WM_OT_imgPop,
  xrsAutoName,
  xrsBakeAll,
  xrsBakeAO,
  xrsBakeLighting,
  xrsBakeSelectedDiffuse,
  xrsBakeSelectedNormal,
  xrsBakeSelectedRoughness,
  xrsBakeSelectedAO,
  xrsBakeSelectedMetallic,
  xrsCreate3XRMatNode,
  xrsDrawNormalStart,
  xrsDrawNormalEnd,
  xrsRecalculateNormals,
  xrsSaveAO,
  xrsSubmitProductOperator,
  xrsSyncPullOperator,
  xrsSyncPushOperator,
  xrsUpdateCheckOperator,
  xrsUVCheck,
  xrsUVLayoutExport,
  xrsValidatorMatOperator,
  xrsValidatorOperator,
)

def register():
  for c in classes:
    bpy.utils.register_class(c)

def unregister():
  for c in classes:
    bpy.utils.unregister_class(c)

if __name__ == "__main__":
    register()
