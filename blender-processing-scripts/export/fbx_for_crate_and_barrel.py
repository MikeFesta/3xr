# SPDX-License-Identifier: Apache-2.0
import bpy
import os
from xrs import automate as xra

### Note: this was copied from export/glb_for_submission_orm.py
# This exports a gltf file in the crate and barrel spec

# global variables
MODEL_NAME = xra.get_filename()
argv = xra.get_command_line_arguments()
EXPORT_DIR = argv[0]
TEXTURES_DIR = argv[0]
PRODUCT_NAME = argv[1]

xra.log_verbose("Creating FBX " + PRODUCT_NAME + " in folder " + EXPORT_DIR)
bpy.ops.file.make_paths_relative()

# Update legacy file naming conventions (TODO: is this still needed?)
xra.update_legacy_material_names()

# file settings
xra.set_renderer_to_cycles()
xra.set_object_mode()

# validation
if (xra.validate_scene_for_glb() == False):
  # Needs to have a collection named "web" that is not empty
  xra.quit_with_error("Blender file not valid for exporting a glb")

# Crate and Barrel spec uses .pngs
png_diffuse = True
xra.log_debug('starting material prep')

# prepare each object in the "web" collection
for obj in xra.get_objects_in_collection("web"):
  xra.log_info('Object Name: ' + obj.name)

  # Prepare the materials (as-needed)
  for material_slot in obj.material_slots:
    xra.log_debug('Material Name: ' + material_slot.material.name)
    xra.update_material_to_crate_and_barrel(material_slot.material, TEXTURES_DIR, False)
    xra.log_debug('Finished processing ' + material_slot.material.name)

xra.log_debug('finished material prep')

# Select all objects for export
for obj in xra.get_objects_in_collection("web"):
  xra.add_object_to_selection(obj)

# File paths need to be relative for the fbx to find them
bpy.ops.file.make_paths_relative()

# Note: Blender seems to have a bug in mapping the _alpha texture on export, it is setting diffuse and when importing the fbx back into blender it sets the color value of a new diffuse node to alpha

# Export as .fbx
bpy.ops.export_scene.fbx(
  filepath= EXPORT_DIR + PRODUCT_NAME + ".fbx",
  use_selection=True,
  axis_forward='Z',
  axis_up='Y'
)

#xra.save_as(xra.get_dir(), "cb_fbx_testing")
