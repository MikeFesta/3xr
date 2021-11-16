# SPDX-License-Identifier: Apache-2.0
import bpy
import os
from xrs import automate as xra

argv = xra.get_command_line_arguments()
xra.log_debug(str(len(argv)))
xra.log_debug(argv[0])
# global variables
MODEL_NAME = xra.get_filename()
TEXTURES_DIR = argv[0]
AMAZON_DIR = argv[1]
ASIN = argv[2]

xra.log_verbose("Preparing " + MODEL_NAME + " for Amazon fbx export with ASIN: " + ASIN)

# file settings
xra.set_object_mode()
xra.set_unit_type('Centimeters')

# validation
if (xra.validate_scene_for_glb() == False):
  # Needs to have a collection named "web" that is not empty
  xra.quit_with_error("Blender file not valid for exporting an Amazon fbx")

# TODO: Wall / Ceiling Alignment - need object attribute passed in (future phase, not needed for Nespresso Machines)

# prepare each object in the "web" collection
for obj in xra.get_objects_in_collection("web"):
  xra.log_info(obj.name)
  # glTF wants the mesh triangulated
  xra.triangulate_object(obj)

  #TODO: Resize the mesh to 20k triangles with decimation

  # Prepare the materials (as-needed)
  for material_slot in obj.material_slots:
    xra.log_debug(material_slot.material.name)
    #TODO: Link 4k materials with amazon names
    xra.build_material_for_amazon(material_slot.material, TEXTURES_DIR, AMAZON_DIR)

# Select all objects for export
for obj in xra.get_objects_in_collection("web"):
  xra.add_object_to_selection(obj)

# Save with relative filepaths
bpy.ops.file.make_paths_relative()
xra.save_as(AMAZON_DIR, ASIN)

# Export as .fbx
bpy.ops.export_scene.fbx(
  filepath=AMAZON_DIR + ASIN + ".fbx",
  use_selection=True,
  axis_forward='Z',
  axis_up='Y'
)

# TODO: Confirm
# +Y is up
# front is +Z
# scale is correct
# textures are sRGB
# ai non-linkage is OK
