# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" HDR and Light related functions
"""
import bpy
import xrs.filename

def place_light_above_camera(light, camera, height = 1):
  """ Move a light to the camera position plus extra height """
  light.location.x = camera.location.x
  light.location.y = camera.location.y
  light.location.z = camera.location.z + height

def set_light_strength(light, strength = 10):
  """ Set how bright a light is """
  light.data.energy = strength

def set_hdr(image_name, strength = 1):
  """ Set an HDR from the resources directory """
  filepath = xrs.filename.get_resources_dir() + "/hdri/hdrihaven/" + image_name + ".hdr"
  bpy.context.scene.world.use_nodes = True
  ev = bpy.context.scene.world.node_tree.nodes.new(type="ShaderNodeTexEnvironment")
  background_hdri = bpy.data.images.load(filepath=filepath)
  ev.image = background_hdri
  bpy.context.scene.world.node_tree.nodes["Background"].inputs[1].default_value = strength
  bpy.context.scene.world.node_tree.links.new(ev.outputs[0],bpy.context.scene.world.node_tree.nodes["Background"].inputs[0])
