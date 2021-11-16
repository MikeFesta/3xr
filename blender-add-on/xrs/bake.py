# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Bake Textures """

import bpy
import os
import xrs.log
import xrs.material
import xrs.render
import xrs.validate

from pathlib import Path
import xrs.convert
import xrs.collection
import xrs.filename
import xrs.object
import xrs.select
import time

def diffuse(resolution = 4096):
  """ Bake diffuse via emit """
  return bake_via_emit(
    input_name = 'Base Color',
    texture_postfix = 'diffuse',
    resolution = resolution
  )

def metallic(resolution = 4096):
  """ Bake metallic via emit """
  return bake_via_emit(
    input_name = 'Metallic',
    texture_postfix = 'metallic',
    resolution = resolution
  )

def normal(resolution = 4096):
  """ Bake normal (does not work via emit) """
  # TODO: refactor this
  # Resolution is curretly limited to 1k, 2k or 4k (default)
  resolution_name = '4k'
  if resolution == 1024:
    resolution_name = '1k'
  elif resolution == 2048:
    resolution_name = '2k'
  else:
    resolution = 4096
  xrs.render.set_bake_render(resolution)
  xrs.render.disable_direct_indirect_for_bake()
  regNormColor = (0.389, 0.441, 0.80, 1)
  normalName = bpy.context.active_object.name + "_" + resolution_name + "_normal"
  xrs.material.make_material_for_mesh(bpy.context.active_object.data)
  activeMaterialName = bpy.context.active_object.active_material.name
  nodes = bpy.data.materials[activeMaterialName].node_tree.nodes
  working_dir = xrs.filename.get_parent_dir()
  if len(bpy.context.selected_objects) == 1:
    for allObj in bpy.data.objects:
      allObj.hide_render = False
    bpy.context.scene.render.bake.use_selected_to_active = False
    print("There is 1 object selected.")
    print("There is a normal connection to " + bpy.context.active_object.name +".")
    print("Baking normal data now.")
    xrs.material.new_image_texture(activeMaterialName, normalName, resolution = bpy.data.scenes['Scene'].render.resolution_x)
    bpy.data.images[normalName].filepath = working_dir + "textures/" + normalName + ".png"
    bpy.ops.object.bake("INVOKE_DEFAULT",type="NORMAL",filepath=working_dir + "textures", save_mode='EXTERNAL')
    print("Normal Bake Done.")
    bpy.data.images[normalName].save()
    print(normalName + " has been saved.")
    return {'FINISHED'}
  else:
    print("There is more than 1 object selected.")
    for allObj in bpy.data.objects:
      allObj.hide_render = False
    bpy.context.scene.render.bake.use_selected_to_active = True
    for eachObject in bpy.data.collections['web'].all_objects:
      eachObject.select_set(True)
    for eachObject in bpy.data.collections['master'].all_objects:
      eachObject.select_set(True)
    print("Baking normal data now.")
    new_image_texture(activeMaterialName, normalName, regNormColor, resolution = bpy.data.scenes['Scene'].render.resolution_x)
    bpy.data.images[normalName].filepath = working_dir + "textures/" + normalName + ".png"
    bpy.ops.object.bake("INVOKE_DEFAULT",type="NORMAL",filepath=working_dir + "textures", save_mode='EXTERNAL')
    bpy.data.images[normalName].save()

  return bake_via_emit(
    input_name = 'Normal',
    texture_postfix = 'normal',
    resolution = resolution
  )

def opacity(resolution = 4096):
  """ Bake opacity via emit """
  return bake_via_emit(
    input_name = 'Alpha',
    texture_postfix = 'opacity',
    resolution = resolution
  )

def roughness(resolution = 4096):
  """ Bake roughness via emit """
  return bake_via_emit(
    input_name = 'Roughness',
    texture_postfix = 'roughness',
    resolution = resolution
  )

def bake_via_emit(input_name, texture_postfix, resolution):
  """ Bake a given BSDF node input to a texture via an emit node to avoid issues with alpha and metallic channels. """
  if xrs.validate.active_object_is_a_mesh() == False:
    # There must be an active object with mesh data selected
    return False

  # Resolution is curretly limited to 1k, 2k or 4k (default)
  resolution_name = '4k'
  if resolution == 1024:
    resolution_name = '1k'
  elif resolution == 2048:
    resolution_name = '2k'
  else:
    resolution = 4096

  # Material Prep
  xrs.material.make_material_for_mesh(bpy.context.active_object.data)

  # Get Names
  material_name = bpy.context.active_object.active_material.name
  texture_name = material_name + "_" + resolution_name + "_" + texture_postfix
  xrs.log.info('Baking Texture: ' + texture_name + ' via Emit')

  # Create an Emission Node and link it up
  node_tree = bpy.data.materials[material_name].node_tree
  nodes = node_tree.nodes
  output_node = xrs.material.get_one_node_of_type(nodes, "OUTPUT_MATERIAL")
  bsdf_node = xrs.material.get_one_node_of_type(nodes, "BSDF_PRINCIPLED")
  emit_node = nodes.new("ShaderNodeEmission")
  # Link emit node to material output
  node_tree.links.new(emit_node.outputs[0], output_node.inputs[0])
  # Swap to an emit output and link in to the material base color
  incoming_socket = None
  # find the input link for the BSDF base color
  for link in node_tree.links:
    if link.to_node == bsdf_node and link.to_socket.name == input_name:
      incoming_socket = link.from_socket
  if incoming_socket:
    node_tree.links.new(incoming_socket, emit_node.inputs[0])

  # Create the texture node and set the filepath
  working_dir = xrs.filename.get_parent_dir()
  filepath = working_dir + "textures/" + texture_name + ".png"

  # TODO: only create this node if it does not exist, then remove it after the bake
  xrs.material.new_image_texture(material_name, texture_name, resolution = resolution)
  bpy.data.images[texture_name].filepath = filepath

  # Bake
  if len(bpy.context.selected_objects) == 1:
    xrs.log.info("Baking emit to self (single object)")
    for allObj in bpy.data.objects:
      allObj.hide_render = False
    bpy.context.scene.render.bake.use_selected_to_active = False
  else:
    # TODO: this may need additional work to avoid artifacts
    xrs.log.info("Baking emit selected to active (multiple objects)")
    for allObj in bpy.data.objects:
      allObj.hide_render = False
    bpy.context.scene.render.bake.use_selected_to_active = True
    for eachObject in bpy.data.collections['master'].all_objects:
      eachObject.select_set(True)
    for eachObject in bpy.data.collections['web'].all_objects:
      eachObject.select_set(True)

  xrs.render.set_bake_render(resolution)
  bpy.ops.object.bake("INVOKE_DEFAULT",type="EMIT",filepath=filepath, save_mode='EXTERNAL')

  xrs.log.debug("Done baking diffuse")
  # Save the file
  xrs.log.info("Saving to " + bpy.data.images[texture_name].filepath)
  bpy.data.images[texture_name].save()

  # restore the nodes (remove emit, relink output)
  # Note: this works for Automate (headless), but not as a button because bake is async
  node_tree.nodes.remove(emit_node)
  node_tree.links.new(bsdf_node.outputs[0], output_node.inputs[0])

  return True
