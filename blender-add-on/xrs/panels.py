# SPDX-License-Identifier: Apache-2.0
import bpy
from xrs import studio as xrs

class StudioPanel(bpy.types.Panel):
  """ Creates a Panel in the scene context of the properties editor """
  bl_label = "3XR Studio"
  bl_idname = "WORLD_PT_3XR"
  bl_space_type = 'PROPERTIES'
  bl_region_type = 'WINDOW'
  bl_context = "world"

  def draw(self, context):
    layout = self.layout
    scene = context.scene

    # Data Sync Functions
    row = layout.row(align=True)
    row.alignment='LEFT'
    row.label(text="Product ID: " + bpy.context.scene.xr_studio.product_uid)
    row = layout.row(align=True)
    row.alignment='LEFT'
    row.label(text="Product Name: " + bpy.context.scene.xr_studio.product_name)
    row = layout.row(align=True)
    row.operator("xrs.check_for_update", icon="FILE_REFRESH")

    layout.label(text="Submission")

    row = layout.row(align=True)
    row.operator("xrs.auto_name", icon="FILE_TEXT")

    col = layout.column(align=True)
    col.scale_y = 1.6
    col.operator("xrs.validate_scene", icon="FAKE_USER_ON")
    col.operator("xrs.product_submit", icon="EXPORT")

    # General Functions
    layout.label(text="Modeling")
    row = layout.row(align=True)
    row.operator("object.transform_apply", text="Apply Transforms", icon="MOD_SOLIDIFY")

    row = layout.row(align=True)
    row.operator("mesh.select_non_manifold", text="Find Non-Manifold", icon="LIBRARY_DATA_BROKEN")
    #row.operator("xrs.recalculate_normals", text="Recalculate Normals", icon="FULLSCREEN_ENTER")

    # Material Creation Functions
    layout.label(text="Material Creation")
    col = layout.column(align=True)
    col.scale_y = 1.5
    #col.operator("xrs.validate_mat_scene", text="Check Material Scene", icon="SHADING_RENDERED")
    #col.operator("xrs.create_3xr_mat_node", text="Create 3XR Procedural Material Node", icon="ALIGN_TOP")
    col.operator("xrs.apply_checkerboard", text="UV Checker", icon="VIEW_ORTHO")

    # Export Functions
    layout.label(text="Export")
    col = layout.column(align=True)
    col.scale_y = 1.1
    col.operator("xrs.uv_layout_export", icon="OUTLINER_DATA_LATTICE")
    #col.operator("wm.imgpop", icon="OUTLINER_OB_LIGHTPROBE")

    # Other Functionalities
    #layout.label(text="Normal Map Drawing")
    row = layout.row(align=True)
    #row.operator("xrs.draw_normal_start", icon="REC")
    #row.operator("xrs.draw_normal_end", icon="PANEL_CLOSE")

    # Bake Functions
    layout.label(text="Baking Textures")
    col = layout.column(align=True)
    col.scale_y = 1.1
    col.operator("wm.bakepop", icon="DRIVER_DISTANCE")
    #col.operator("xrs.bake_all", icon="HANDLETYPE_AUTO_CLAMP_VEC")

    col = layout.column(align=True)
    col.operator("xrs.bake_selected_ao", icon="BRUSH_CREASE")
    col.operator("xrs.bake_selected_diffuse", icon="COLORSET_03_VEC")
    col.operator("xrs.bake_selected_roughness", icon="COLORSET_13_VEC")
    col.operator("xrs.bake_selected_metallic", icon="COLORSET_10_VEC")
    col.operator("xrs.bake_selected_normal", icon="COLORSET_06_VEC")

    col = layout.column(align=True)
    col.operator("xrs.bake_lighting", icon="LIGHT_DATA")

def register():
  bpy.utils.register_class(StudioPanel)

def unregister():
  bpy.utils.unregister_class(StudioPanel)
  #bpy.utils.unregister_class(bpy.types.WORLD_PT_3XR)

if __name__ == "__main__":
    register()
