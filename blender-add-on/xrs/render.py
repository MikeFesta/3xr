# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Render related functions
"""
import bpy
import threading
import xrs.collection
import xrs.material

def add_render_camera():
  """ Adds one render camera that can have base settings in one place """
  bpy.ops.object.camera_add()
  renderCam = bpy.data.cameras['Camera']
  renderCam.clip_start = 0.0254

def disable_direct_indirect_for_bake():
  """ Turn off direct and indirect lighting in bake settings """
  bpy.context.scene.render.bake.use_pass_direct = False
  bpy.context.scene.render.bake.use_pass_indirect = False

def render_and_save():
  """ Render the image from the active camera and save it """
  bpy.ops.render.render(write_still=True)

result = None

def back_calc(function):
  function()
  global result
  result==42

def render_and_save():
  """ Render the image from the active camera and save it """
  bpy.ops.render.render(write_still=True)

def set_cpu():
  """ Use the CPU for rendering """
  bpy.context.scene.cycles.device = 'CPU'

def set_cycles(samples = 128):
  """ Set the render engine to use cycles """
  bpy.context.scene.render.engine = "CYCLES"
  bpy.context.scene.cycles.samples = samples

def set_eevee():
  """ Set the render engine to use cycles """
  bpy.context.scene.render.engine = "BLENDER_EEVEE"

def set_gpu():
  """ Use the GPU for rendering """
  bpy.context.scene.cycles.device = 'GPU'

def set_resolution(x=4096,y=4096):
  """ Set the resolution of the image to render """
  bpy.context.scene.render.resolution_percentage = 100
  bpy.context.scene.render.resolution_x = x
  bpy.context.scene.render.resolution_y = y
  if x <= 512:
    bpy.context.scene.render.tile_x = x
  elif x <= 1024:
    bpy.context.scene.render.tile_x = x / 2
  elif x <= 2048:
    bpy.context.scene.render.tile_x = x / 4
  else:
    bpy.context.scene.render.tile_x = x / 8

  if y <= 512:
    bpy.context.scene.render.tile_y = y
  elif y <= 1024:
    bpy.context.scene.render.tile_y = y / 2
  elif y <= 2048:
    bpy.context.scene.render.tile_y = y / 4
  else:
    bpy.context.scene.render.tile_y = y / 8

def set_filepath_with_format(path, format):
  """ Set the path of the file to be saved on render in the given format """
  bpy.context.scene.render.filepath = path
  bpy.context.scene.render.image_settings.file_format = format

def set_bake_render(resolution = 4096):
  """ Set for the optimal baking settings by default """
  set_cycles()
  bpy.context.scene.display_settings.display_device = 'sRGB'
  set_resolution(resolution, resolution)

def shadow_render(planeName):
  """ Sets up AO shadow for renders """
  longest_dim = xrs.collection.get_largest_dimension("master")
  bpy.ops.mesh.primitive_plane_add(size=longest_dim*2, location=(0,0,-0.0001))
  bpy.data.objects['Plane'].name = planeName
  bpy.data.meshes['Plane'].name = planeName
  planeObj = bpy.data.objects[planeName]
  xrs.material.make_material()
  planeMat = bpy.data.materials[planeName]
  planeMat.blend_method = "BLEND"
  xrs.material.new_image_texture(planeMat.name, "ao_plane", size=1024)
  bpy.data.worlds['World'].light_settings.use_ambient_occlusion = True
  distAO = bpy.data.worlds['World'].light_settings.distance
  shortDim = xrs.collection.get_shortest_dimension("master")
  distAO = 0.23*shortDim
  if distAO > 6:
    distAO = 6
  bpy.data.scenes['Scene'].cycles.samples = 1024
  bpy.context.scene.cycles.bake_type = 'AO'
  planeObj.select_set(True)
  planeMat.node_tree.nodes['ao_plane'].select = True
  bpy.ops.object.bake(type="AO", save_mode='INTERNAL')
  aoPlane =  planeMat.node_tree.nodes['ao_plane']
  transparentBSDF = planeMat.node_tree.nodes.new("ShaderNodeBsdfTransparent")
  matOutput =  planeMat.node_tree.nodes['Material Output']
  xrs.material.link_output_to_slot_named(planeMat, aoPlane.outputs[0], transparentBSDF, "Color")
  xrs.material.link_output_to_slot_named(planeMat, transparentBSDF.outputs[0], matOutput, "Surface")
