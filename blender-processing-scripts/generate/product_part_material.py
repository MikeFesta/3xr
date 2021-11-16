# SPDX-License-Identifier: Apache-2.0
'''
Blender 2.90
Combine a part with a material(s) and submit it for the product
User: 3XR System
API Key: REDACTED
'''
import bpy
import os
from xrs import automate as xra

working_dir = xra.get_dir();
product_name = xra.get_filename()
argv = xra.get_command_line_arguments()
part_uid = argv[0]
part_name = argv[1]
part_filename = argv[2]
materials_dir = argv[3]
material_slots = argv[4].split(',')
material_uids = argv[5].split(',')
material_names = argv[6].split(',')
material_transparencies = argv[7].split(',')

xra.log_info("Combining Part (" + part_name + ") + Materials for Product (" + product_name + ")")

###############
# VALIDATIONS #
###############
# Check that there are same number of materials as slots
slot_count = len(material_slots)
xra.log_info("Slot count: " + str(slot_count))
if (len(material_uids) != slot_count or len(material_names) != slot_count):
  xra.log_error("Material parameters must have the same number of arguments")
  exit(1)

# Validate that the product name in the file matches
if (product_name != bpy.context.scene.xr_studio.product_name):
  xra.log_error("Filename does not match product name: " + bpy.context.scene.xr_studio.product_name)
  exit(1)

###############
# IMPORT PART #
###############
if "web" in bpy.data.collections:
  xra.log_warn('Deleting existing web collection')
  bpy.data.collections.remove(bpy.data.collections['web'])
#
xra.log_info("Importing Part " + part_name + " (" + part_uid + ")")
xra.append_collection(part_filename, "web")

# Check that the Part was imported correctly
collection = bpy.data.collections["web"]
if len(collection.objects) == 0:
  xra.log_error('No objects in the web collection')
  exit(1)

# Rename the part to match the product
xra.auto_name()
product = bpy.data.objects[product_name]

# TODO: need a way to rename _clear and _clip meshes

for obj in collection.objects:
  xra.log_debug(obj.name)

####################
# IMPORT MATERIALS #
####################
#for mat in bpy.data.materials:
#  xra.log_debug("Part Material: " + mat.name)
#
#for i in range(slot_count):
#  material_name = material_names[i]
#  xra.log_info("Importing Material " + material_name + " (" + material_uids[i] + ")")
#  material_filename = os.path.join(materials_dir, material_uids[i], 'blender', material_name + '.blend')
#  xra.append_material(material_filename, material_name)
#
#  # Update material to use the UV channel named 3xr_library
#  xra.log_debug("Updating UV map")
#  xra.material_uv_set_3xr_library(bpy.data.materials[material_name].node_tree.nodes[material_name].node_tree)

  # Assign the material to the part slot
#  slot_number = 0
#  slot_counter = 0
#  for slot in product.material_slots:
#    if slot.name == material_slots[i]:
#      slot_number = slot_counter
#    slot_counter = slot_counter + 1
#  xra.log_debug("Assigning Material to part slot number " + str(slot_number))
#  xra.assign_material_to_object(material_name, product_name, slot_number)

####################
# RE-LINK TEXTURES #
####################
# ao, diffuse, metallic, normal, roughness
xra.update_material_to_4k(
  bpy.data.materials[product_name],
  xra.get_sibling_dir('textures'),
  True
)
xra.log_info('Textures linked');
#################
# BAKE TEXTURES #
#################
#xra.log_info("Baking Textures")
#resolution = 4096
#xra.set_renderer_to_cycles()
#xra.use_gpu_for_render()

# Select the part
#xra.select_object(bpy.data.objects[product_name])

# BSDF: (Normal, Roughness, AO)

# Emit:
# -Diffuse  (if input empty, set emit to default_value)
# -Metallic (if input empty, set emit to value of input (1:fff or 0:000)
# -Opacity  (if input empty, set emit to fff)
#bake_texture_name = product.name + '_4k_diffuse.png'
#xra.log_debug(bake_texture_name)
#
#for slot in product.material_slots:
#  mat = slot.material
#  nt = mat.node_tree
#  nodes = nt.nodes
#  bake_target_node_found = False
#  for node in nodes:
#    if node.type == 'TEX_IMAGE':
#      if node.image:
#        if node.image.name == bake_texture_name:
#          xra.log_info('texture found for ' + slot.name)
#        else:
#          xra.log_debug('No Match for ' + node.image.name)

#   if there is an image_texture node with the bake target:
#     select it
#   else:
#     add an image texture node and select the image to bake (should already be linked to the file)

#   ensure clear_image is unchecked so part material areas are preserved
#   if emit: (diffuse, metallic, opacity)
#     create emission node
#     link emission to output
#     link input slot to emission
#     bake via emit
#   else if normal:
#     bake via normal
#   else if roughness:
#     bake via roughness
#   else if ao:
#     bake via ao
#   save image
#   if emit:
#     restore BSDF connections

bpy.ops.file.make_paths_relative()

xra.log_info('Paths Relative');
#xra.save_as(xra.get_dir(), "material_part_test") # this name will break submission
#exit(0)

# Bake the textures
#xra.bake_diffuse(resolution)
#if is_transparent:
#  xra.bake_opacity(resolution)
#xra.bake_metallic(resolution)
#xra.bake_normal(resolution)  # Future improvement - combine Normal Maps from the part
#xra.bake_roughness(resolution)

##########
# SUBMIT #
##########
# Need to rebuild the materials to pass validation checks ... will bypass checks for now

# Cleanup
# Remove the 2nd UV channel
#xra.single_uv_channel_for_object_named(product_name)
# Link all web objects to master (for validation and render)
for o in bpy.data.collections["web"].objects:
  xra.link_object_to_collection(o.name, "master")

# Link all of the 4k materials
obj = bpy.data.objects[product_name]
textures_dir = xra.get_sibling_dir('textures')
# TODO: use the material transparent blend mode parameter
transparent = True # Not sure if this is needed for transparent materials

xra.log_info('Updating material slots')
for material_slot in obj.material_slots:
  xra.log_debug(material_slot.material.name)
  #xra.update_material_to_4k(material_slot.material, textures_dir, is_transparent)
xra.log_info('renaming to clip')

# For transparent to process properly, the material name needs to end with _clear or _clip
#if is_transparent:
#  mat = bpy.data.materials[obj.name]
#  if mat:
#    xra.log_info(mat.name)
#    #mat.name = mat.name + "_clear"
#    mat.name = mat.name + "_clip"

# Change the user api token to 3XR

xra.log_info('Updating API Token');
bpy.context.preferences.addons['xrs'].preferences.api_token = "0$GYLbGOq7UqwDL9YFOQ/v3O1IHicxtrd9AcVMPAeovaYDOKkw/aBrC"
submit_message = xra.submit_product()
xra.log_debug(submit_message)

xra.log_info("Finished generating product.")

# Saving for testing / verification
xra.save_as(xra.get_dir(), "material_part_test") # this name is breaking submission
