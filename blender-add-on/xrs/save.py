# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Functions for getting command line arguments
"""
import bpy
import os
import xrs.filename

def save():
  """ Save the file with the current name """
  bpy.ops.wm.save_mainfile(
    filepath=os.path.join(
      xrs.filename.get_dir(),
      xrs.filename.get_filename() + ".blend"
    )
  )

def save_as(dir, name):
  """ Save the file with the given name """
  bpy.ops.wm.save_mainfile(
    filepath=os.path.join(
      dir,
      name + ".blend"
    ),
    relative_remap = True
  )

def save_all_images():
  for allImg in bpy.data.images:
    if allImg.is_dirty and allImg.name != "Render Result":
      working_dir = xrs.filename.get_parent_dir()
      bpy.data.scenes['Scene'].render.filepath = os.path.join(working_dir, "textures", str(allImg.name) + ".png")
      allImg.save_render(bpy.data.scenes['Scene'].render.filepath)
  bpy.ops.file.pack_all()
