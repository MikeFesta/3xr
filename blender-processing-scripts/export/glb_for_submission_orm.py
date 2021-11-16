# SPDX-License-Identifier: Apache-2.0
import bpy
import os
from xrs import automate as xra

# global variables
MODEL_NAME = xra.get_filename()
EXPORT_DIR = xra.get_dir()
TEXTURES_DIR = xra.get_dir() + "generated/"

xra.log_verbose("Preparing " + MODEL_NAME + " for glb export")

# Update legacy file naming conventions
xra.update_legacy_material_names()

# file settings
xra.set_renderer_to_cycles()
xra.set_object_mode()

# validation
if (xra.validate_scene_for_glb() == False):
  # Needs to have a collection named "web" that is not empty
  xra.quit_with_error("Blender file not valid for exporting a glb")

# Check for transparency, if any material name ends with _clear, use png for diffuse
# This is specificalyl for final assets that share 1 material but have one or more separate
# meshes with transparency. We don't want to load both the diffuse jpg and png if any of the
# shared materials need the alpha channel from the png
png_diffuse = False
for obj in xra.get_objects_in_collection("web"):
  for material_slot in obj.material_slots:
    if (material_slot.material.name.endswith("_clear")):
      png_diffuse = True

xra.log_debug('starting material prep')

# prepare each object in the "web" collection
for obj in xra.get_objects_in_collection("web"):
  xra.log_info('Object Name: ' + obj.name)
  # glTF wants the mesh triangulated
  xra.triangulate_object(obj)
  xra.log_info('Finished Triangulation for ' + obj.name)

  # Prepare the materials (as-needed)
  for material_slot in obj.material_slots:
    xra.log_debug('Material Name: ' + material_slot.material.name)
    xra.update_material_to_version_1(material_slot.material, TEXTURES_DIR, png_diffuse)
    xra.log_debug('Finished processing ' + material_slot.material.name)
    xra.save_as(xra.get_dir(), "glb_test")

xra.log_debug('finished material prep')

# Select all objects for export
for obj in xra.get_objects_in_collection("web"):
  xra.add_object_to_selection(obj)

# Export as .glb
bpy.ops.export_scene.gltf(
  export_format="GLB",
  export_copyright="3XR Inc.",
#  export_draco_mesh_compression_enable=True, #<model-viewer> doesn't seem to have support yet
  export_selected=True,
  export_morph=False, # I don't remember what this is
  check_existing=False,
  will_save_settings=True,
  export_colors=False,
  export_skins=False,
  export_animations=False,
  filepath=EXPORT_DIR + MODEL_NAME + "_orm.glb"
)

# NOTE: Emission not yet working
bpy.ops.file.make_paths_relative()
xra.save_as(xra.get_dir(), "glb_test")
