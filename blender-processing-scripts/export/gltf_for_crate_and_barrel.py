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

xra.log_verbose("Creating gltf " + PRODUCT_NAME + " in folder " + EXPORT_DIR)

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
  # glTF wants the mesh triangulated
  xra.triangulate_object(obj)
  xra.log_info('Finished Triangulation for ' + obj.name)

  # Prepare the materials (as-needed)
  for material_slot in obj.material_slots:
    xra.log_debug('Material Name: ' + material_slot.material.name)
    xra.update_material_to_crate_and_barrel(material_slot.material, TEXTURES_DIR)
    xra.log_debug('Finished processing ' + material_slot.material.name)

xra.log_debug('finished material prep')

# Select all objects for export
for obj in xra.get_objects_in_collection("web"):
  xra.add_object_to_selection(obj)

# Remove empty faces, edges, verticies
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.dissolve_degenerate()
bpy.ops.object.mode_set(mode='OBJECT')

# Support for lights if in a collection named lights
light_count = xra.get_total_light_count('lights')
if light_count > 0:
  xra.log_debug('Exporting lights using KHR_lights_punctual')
  # Select all lights
  for o in bpy.data.collections['lights'].all_objects:
    o.select_set(True)

# Export as .gltf
bpy.ops.export_scene.gltf(
  export_format="GLTF_SEPARATE",
  export_copyright="3XR Inc.",
#  export_draco_mesh_compression_enable=True, #<model-viewer> doesn't seem to have support yet
  export_selected=True,
  export_morph=False, # I don't remember what this is
  check_existing=False,
  will_save_settings=True,
  export_colors=False,
  export_lights=(light_count > 0),
  export_skins=False,
  export_animations=False,
  filepath=EXPORT_DIR + PRODUCT_NAME + ".gltf"
)

#bpy.ops.file.make_paths_relative()
#xra.save_as(xra.get_dir(), "cb_testing")
