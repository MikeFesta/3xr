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
FBX_DIR = argv[1]

xra.log_verbose("Preparing " + MODEL_NAME + " for fbx export")

# file settings
xra.set_object_mode()
xra.set_unit_type('Centimeters')

# validation
if (xra.validate_scene_for_glb() == False):
  # Needs to have a collection named "web" that is not empty
  xra.quit_with_error("Blender file not valid for exporting an fbx")

# Check for transparency, if any material name ends with _clear, use png for diffuse
# This is specificalyl for final assets that share 1 material but have one or more separate
# meshes with transparency. We don't want to load both the diffuse jpg and png if any of the
# shared materials need the alpha channel from the png
png_diffuse = False
for obj in xra.get_objects_in_collection("web"):
  for material_slot in obj.material_slots:
    if (material_slot.material.name.endswith("_clear")):
      png_diffuse = True
    xra.log_info('png_diffuse = ' + str(png_diffuse))
    xra.log_info(str(xra.get_material_alpha_link_count(material_slot.material)))
    if xra.get_material_alpha_link_count(material_slot.material) != 0:
      png_diffuse = True
    xra.log_info('png_diffuse = ' + str(png_diffuse))

xra.log_debug('starting material prep')

# prepare each object in the "web" collection
for obj in xra.get_objects_in_collection("web"):
  xra.log_info(obj.name)
  # glTF wants the mesh triangulated
  xra.triangulate_object(obj)

  # Prepare the materials (as-needed)
  for material_slot in obj.material_slots:
    xra.log_debug('Material Name: ' + material_slot.material.name)
    xra.update_material_to_version_2(material_slot.material, TEXTURES_DIR, png_diffuse)
    xra.log_debug('Finished processing ' + material_slot.material.name)

# Select all objects for export
for obj in xra.get_objects_in_collection("web"):
  xra.add_object_to_selection(obj)

# Save with relative filepaths - paths made absolute to auto load textures on FBX import
xra.export_images(FBX_DIR)
for img in bpy.data.images:
  if img.name != "Render Result" and "Viewer Node":
    img.filepath = "//" + img.name
xra.save_as(FBX_DIR, MODEL_NAME)

# Export as .fbx
bpy.ops.export_scene.fbx(
  filepath=FBX_DIR + MODEL_NAME + ".fbx",
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
