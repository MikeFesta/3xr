# SPDX-License-Identifier: Apache-2.0
import bpy
import os
from xrs import automate as xra

# global variables
MODEL_NAME = xra.get_filename()
EXPORT_DIR = xra.get_sibling_dir("final")
TEXTURES_DIR = xra.get_sibling_dir("textures/.generated")

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

# prepare each object in the "web" collection
for obj in xra.get_objects_in_collection("web"):
  xra.log_info(obj.name)
  # glTF wants the mesh triangulated
  xra.triangulate_object(obj)

  # Prepare the materials (as-needed)
  for material_slot in obj.material_slots:
    xra.log_debug(material_slot.material.name)
    xra.update_material_to_version_2(material_slot.material, TEXTURES_DIR, False)

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
  filepath=EXPORT_DIR + MODEL_NAME + ".glb"
)
