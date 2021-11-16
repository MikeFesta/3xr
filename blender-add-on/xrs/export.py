# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Export related functions
"""
import bpy
import os
import xrs.filename
import xrs.log
import xrs.select

def glb():
  """ Export a glb (glTF binary) file with all objects in the web collection """
  xrs.select.collection_named('web')
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
    filepath=xrs.filename.get_sibling_dir('final') + xrs.filename.get_filename() + ".glb"
  )

def export_glb(path):
  """ Exports GLB file to a given filepath """
  bpy.ops.export_scene.gltf(
  export_format="GLB",
  export_copyright="3XR Inc.",
#  export_draco_mesh_compression_enable=True, #<model-viewer> doesn't seem to have support yet
  export_selected=True,
  export_morph=False,
  check_existing=False,
  will_save_settings=True,
  export_colors=False,
  export_skins=False,
  export_animations=False,
  filepath=path
)

def export_images(path):
  """ Export images that are being used in the Blender file to a string path """
  for img in bpy.data.images:
    if img.name != "Render Result":
      try:
        img.pack()
        img.filepath = path
        if img.name.endswith(".jpg"):
          bpy.context.scene.render.image_settings.file_format = 'JPEG'
        if img.name.endswith(".png"):
          bpy.context.scene.render.image_settings.file_format = 'PNG'
        img.save_render(filepath=path+img.name)
      except:
        xrs.log.debug("Could not save " + img.name)
