# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Filepath related functions
"""
import bpy
import os

def get_dir():
  """ Get current directory from where the current blend file is """
  return os.path.join(os.path.dirname(bpy.data.filepath), "")

def get_filename():
  """ Parse out the filename from the file and remove .blend extension """
  name = bpy.path.basename(bpy.data.filepath)
  return name.replace(".blend", "")

def get_parent_dir():
  """ Go up one directory from where the current blend file is """
  return os.path.join(os.path.dirname(os.path.dirname(bpy.data.filepath)), "")

def get_resources_dir():
  """ Get resources for Linux, automate.py """
  return os.path.join("/", "3xr", "studio", "resources", "")

def get_sibling_dir(name):
  """ Go up one directory and go into the given name """
  return os.path.join(os.path.dirname(os.path.dirname(bpy.data.filepath)), name, "")
