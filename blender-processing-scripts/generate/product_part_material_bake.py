# SPDX-License-Identifier: Apache-2.0
'''
Blender 2.90
Combine a part with a material(s) and submit it for the product
User: 3XR System
API Key: REDACTED
'''
import bpy
import os
import time
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
xra.log_info("Renaming Product to " + product_name )
xra.auto_name()
product = bpy.data.objects[product_name]

for obj in collection.objects:
  xra.log_debug(obj.name)

####################
# IMPORT MATERIALS #
####################
for mat in bpy.data.materials:
  xra.log_debug("Part Material: " + mat.name)

# If any materials have a non OPAQUE blend method, the baked material should be transparent
is_transparent = False

for i in range(slot_count):
  material_name = material_names[i]
  xra.log_info("Importing Material " + material_name + " (" + material_uids[i] + ")")
  material_filename = os.path.join(materials_dir, material_uids[i], 'blender', material_name + '.blend')
  xra.append_material(material_filename, material_name)

  # Assign the material to the part slot
  slot_number = 0
  slot_counter = 0
  for slot in product.material_slots:
    if slot.name == material_slots[i]:
      slot_number = slot_counter
    slot_counter = slot_counter + 1
  xra.log_debug("Assigning Material to part slot number " + str(slot_number))
  xra.assign_material_to_object(material_name, product_name, slot_number)

  # Update material to use the UV channel named 3xr_library
  xra.log_debug("Updating UV map")
  #xra.save_as(xra.get_dir(), "material_part_test") # this name is breaking submission
  xra.material_uv_set_3xr_library(bpy.data.materials[material_name].node_tree.nodes[material_name].node_tree)
  xra.log_debug("UV map updated.")

  # Check for transparency via the blend method
  if bpy.data.materials[material_name].blend_method != 'OPAQUE':
    xra.log_debug(material_name + " is transparent. blend method = " + bpy.data.materials[material_name].blend_method)
    is_transparent = True

####################
# RE-LINK TEXTURES #
####################
# ao, diffuse, metallic, normal, roughness
xra.update_material_to_4k(
  bpy.data.materials[product_name],
  xra.get_sibling_dir('textures'),
  True
)

### FUNCITONS - MOVE TO XRA ###
def bake_texture(bake_texture_name, socket_name, bake_type):
  xra.log_info(bake_texture_name)
  if bake_texture_name not in bpy.data.images:
    xra.log_error("Texture not found: " + bake_texture_name)
    exit(1)

  bake_texture_image = bpy.data.images[bake_texture_name]
  # Update the filepath because it is pointing at the parts directory
  bake_texture_image.filepath = xra.get_sibling_dir('textures') + bake_texture_image.name

  for slot in product.material_slots:
    xra.log_debug('Checking Slot ' + slot.name)
    mat = slot.material
    nt = mat.node_tree
    nodes = nt.nodes
    bake_target_node_found = False

    # Find the Nodes to be used
    output_node = None
    bsdf_node = None
    emit_node = None
    for node in nodes:
      if node.type == "OUTPUT_MATERIAL":
        output_node = node
      if node.type == "BSDF_PRINCIPLED":
        bsdf_node = node
      if node.type == "EMISSION":
        emit_node = node
    if output_node == None or bsdf_node == None:
      xra.log_error("Material is missing nodes - OUTPUT or BSDF")
      exit(1)
    if bake_type == 'EMIT' and emit_node == None:
      emit_node = nodes.new(type='ShaderNodeEmission')

    # Link up the output node based on bake type
    if bake_type == 'EMIT':
      nt.links.new(output=emit_node.outputs[0],input=output_node.inputs[0])
      # copy the input from the BSDF node based on the slot name
      target_socket = None
      for link in nt.links:
        if link.to_node == bsdf_node and link.to_socket.name == socket_name:
          target_socket = link.from_socket
      if target_socket:
        nt.links.new(output=target_socket,input=emit_node.inputs[0])
      else:
        # match the default value
        default_value = None
        for input in bsdf_node.inputs:
          if input.name == socket_name:
            default_value = input.default_value
        emit_node.inputs[0].default_value = default_value
    else:
      # Link the BSDF node to the output
      nt.links.new(output=bsdf_node.outputs[0],input=output_node.inputs[0])

    # Make the target image active
    for node in nodes:
      if node.type == 'TEX_IMAGE':
        if node.image:
          if node.image.name == bake_texture_name:
            nodes.active = node
            bake_target_node_found = True
    if bake_target_node_found == False:
      xra.log_debug('Adding bake target to ' + slot.name)
      node = nodes.new(type='ShaderNodeTexImage')
      node.image = bake_texture_image
      nodes.active = node

  # Prepare to bake - set Clear checkbox if base material is not attached to any polygons
  base_material_in_use = False
  for poly in  product.data.polygons:
    if poly.material_index == 0:
      base_material_in_use = True
  bpy.context.scene.render.bake.use_clear = (base_material_in_use == False)
  bpy.context.scene.cycles.bake_type = bake_type

  # Bake and Save
  timer_start = time.perf_counter()
  bpy.ops.object.bake('INVOKE_DEFAULT', type=bake_type, filepath=bake_texture_image.filepath,  save_mode='EXTERNAL')
  print(f"{bake_type}  bake completed in {time.perf_counter() - timer_start:0.2f} seconds")
  timer_start = time.perf_counter()
  bake_texture_image.save()
  xra.log_info('Saved to Filepath = ' + bake_texture_image.filepath)
  print(f"{bake_texture_image.name} saved in {time.perf_counter() - timer_start:0.2f} seconds")

######################
# BAKE TEXTURES      #
# 1. Diffuse - EMIT  #
# 2. Metallic - EMIT #
# 3. Roughness       #
# 4. Normal          #
# 5. Opacity - TODO  #
######################
xra.log_info("Baking Textures")
xra.set_renderer_to_cycles()
xra.use_gpu_for_render()

# Select the part
xra.select_object(bpy.data.objects[product_name])

# BSDF: (Normal, Roughness, AO)

# Emit:
# -Diffuse  (if input empty, set emit to default_value)
# -Metallic (if input empty, set emit to value of input (1:fff or 0:000)
# -Opacity  (if input empty, set emit to fff)
bake_texture(
  bake_texture_name = product.name + '_4k_diffuse.png',
  socket_name = 'Base Color',
  bake_type = 'EMIT'
)
bake_texture(
  bake_texture_name = product.name + '_4k_metallic.png',
  socket_name = "Metallic",
  bake_type = 'EMIT'
)
if is_transparent:
  bake_texture(
    bake_texture_name = product.name + '_4k_opacity.png',
    socket_name = 'Alpha',
    bake_type = 'EMIT'
  )
bake_texture(
  bake_texture_name = product.name + '_4k_roughness.png',
  socket_name = "Roughness",
  bake_type = 'ROUGHNESS'
)
bake_texture(
  bake_texture_name = product.name + '_4k_normal.png',
  socket_name = "Normal",
  bake_type = 'NORMAL'
)

##########
# SUBMIT #
##########
xra.log_info("Preparing to Submit")
# Remove all but the base material slot
i = 0
for slot in product.material_slots:
  xra.log_info("Checking Material Slot " + slot.name)
  if slot.name != product.name:
    ## TODO: this is removing too all of the materials
    xra.log_info("Removing Material Slot " + slot.name)
    product.active_material_index = i
    bpy.ops.object.material_slot_remove({'object': product})
  i = i + 1

xra.log_info("Removing 2nd UV channel")
# Remove the 2nd UV channel (not needed with Bake material method, everything should be 1:1 allowing AO)
xra.single_uv_channel_for_object_named(product_name)
# Link the product to the master layer for validation + renders
xra.link_object_to_collection(product_name, "master")

# For transparent to process properly, the material name needs to end with _clear
if is_transparent:
  mat = bpy.data.materials[obj.name]
  mat.name = mat.name + "_clear"

# Link the 4k textures
xra.log_info("Linking Textures")
textures_dir = xra.get_sibling_dir('textures')
for material_slot in product.material_slots:
  xra.log_debug("Updating to 4k textures")
  # Note that there should only be one remaining slot
  xra.update_material_to_4k(material_slot.material, textures_dir, is_transparent)

# Pack all textures into the blend file
bpy.ops.file.pack_all()

# Change the user api token to 3XR
bpy.context.preferences.addons['xrs'].preferences.api_token = "REDACTED"
submit_message = xra.submit_product()
xra.log_debug(submit_message)

xra.log_info("Finished generating and submitting product: " + bpy.context.scene.xr_studio.product_name + ". https://www.3xr.com/product/review/" + bpy.context.scene.xr_studio.product_uid)

# Saving for testing / verification
#bpy.ops.file.make_paths_relative()
xra.save_as(xra.get_dir(), "material_part_test") # this name is breaking submission
