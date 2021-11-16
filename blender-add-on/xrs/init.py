# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Initialization and scene creation functions
"""

import bpy

def collections():
  """ Create collections named master and web, if they do not exist """
  collection_with_name("master")
  collection_with_name("web")

def collection_with_name(name):
  """ Create a collection with the given name if it does not yet exist """
  if name not in bpy.data.collections:
    collection = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(collection)
