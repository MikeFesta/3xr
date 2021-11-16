# SPDX-License-Identifier: Apache-2.0
# NOTE: this is a temporary file for processing mesh
# materials for Crate & Barrel
# It probably will not be needed after these models are processed
import bpy
import os
from xrs import automate as xra

# global variables
argv = xra.get_command_line_arguments()
MODEL_NAME = xra.get_filename()
EXPORT_DIR = xra.get_dir()
TEXTURES_DIR = xra.get_dir() + "generated/"

xra.log_verbose("Preparing " + MODEL_NAME + " for CB Mesh glb export")

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
# This is specifically for final assets that share 1 material but have one or more separate
# meshes with transparency. We don't want to load both the diffuse jpg and png if any of the
# shared materials need the alpha channel from the png
png_diffuse = False
alpha_clip = False
transparent = False

for obj in xra.get_objects_in_collection("web"):
  # Remove the 2nd UV channel
  xra.single_uv_channel_for_object_named(obj.name)
  for material_slot in obj.material_slots:
    if (material_slot.material.name.endswith("_clear") or material_slot.material.name.endswith("_clip")):
      png_diffuse = True
      transparent = True
    if (material_slot.material.name.endswith("_clip")):
      alpha_clip = True
      transparent = True
      # Rename to _clear because we don't actually want clip for these
      #material_slot.material.name = material_slot.material.name[:-4] + "clear"

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
    xra.rebuild_material_from_textures(
      mat=material_slot.material,
      textures_dir=TEXTURES_DIR,
      use_orm=False,
      png_diffuse=True,
      alpha_clip=False,
      diffuse_name="_2k_diffuse",
      normal_name="_2k_normal",
      alpha_name="NOT-IN-USE",
      orm_name="NOT-IN-USE",
      ao_name="NOT-IN-USE",
      roughness_name="_1k_roughness",
      metallic_name="_1k_metallic",
      emissive_name="NOT-IN-USE",
      use_pngs=False,
      use_alpha=obj.name.endswith('_clip'),
      transparent_texture=obj.name.endswith('_clip')
    )

xra.log_debug('finished material prep')

for obj in xra.get_objects_in_collection("web"):
  xra.add_object_to_selection(obj)

# Export the regular USDZ, next we'll create one for iOS conversion
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

# Change blend mode from clip to blend for iOS compatibility
for mat in bpy.data.materials:
  if mat.blend_method == 'CLIP':
    mat.blend_method = 'BLEND'

# Break the transparent part into loose pieces to prevent triangle artifacts
for obj in xra.get_objects_in_collection("web"):
  # TODO: remove the 2nd AO channel
  if (obj.name.endswith("_clip") or obj.name.endswith("_clear")):
    xra.log_debug('separate by loose part')
    xra.select_object(obj)
    bpy.ops.mesh.separate(type='LOOSE')

# Select all objects for export
object_count = 0
for obj in xra.get_objects_in_collection("web"):
  xra.add_object_to_selection(obj)
  object_count = object_count + 1

xra.log_info("Total object count: " + str(object_count))

# Remove empty faces, edges, verticies
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.dissolve_degenerate()
bpy.ops.object.mode_set(mode='OBJECT')

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
  filepath=EXPORT_DIR + MODEL_NAME + "-without-ao.glb" # allows exporting a different glb for the usdz conversion
)

bpy.ops.file.make_paths_relative()
xra.save_as(xra.get_dir(), "mesh-glb")
