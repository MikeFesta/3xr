# SPDX-License-Identifier: Apache-2.0
import bpy
import os
from xrs import automate as xra

# global variables
MODEL_NAME = xra.get_filename()
EXPORT_DIR = xra.get_dir()
TEXTURES_DIR = xra.get_dir() + "generated/"

xra.log_verbose("Preparing " + MODEL_NAME + " for lower glb export")

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

xra.log_debug('starting lower material prep')

# prepare each object in the "web" collection
for obj in xra.get_objects_in_collection("web"):
  xra.log_info('Object Name: ' + obj.name)
  # glTF wants the mesh triangulated
  xra.triangulate_object(obj)

  xra.log_info('Finished Triangulation for ' + obj.name)

# Prepare the materials to lower file size and make single user file to solve loading errors
  for material_slot in obj.material_slots:
    #xra.swap_with_1k_textures(material_slot.material, TEXTURES_DIR, png_diffuse)
    xra.swap_shared_image_textures(material_slot.material, TEXTURES_DIR)
    xra.log_info('Swap 1k finished')
    xra.save_as(xra.get_dir(), "glb_zappar")

xra.log_info('Prepped Materials from material_slot')

# Split mesh to solve overflow errors
xra.split_web_mesh()
bpy.ops.object.select_all(action='DESELECT')
xra.rejoin_web_mesh()
xra.log_debug('Mesh Split')

# Select all objects for export
for obj in xra.get_objects_in_collection("web"):
  xra.add_object_to_selection(obj)

# Export as .glb
xra.export_glb(EXPORT_DIR + MODEL_NAME + "_zappar.glb")

# NOTE: Emission not yet working
bpy.ops.file.make_paths_relative()
xra.save_as(xra.get_dir(), "glb_zappar")
