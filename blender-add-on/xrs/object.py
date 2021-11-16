# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Object related functions
"""
import bpy
import xrs.filename
import xrs.mode
import xrs.select

def add_to_selection(obj):
  """ Set the object to selected """
  # Note: this only works with Blender 2.80+
  obj.select_set(True)

def auto_name():
  """ Automatically renames model in the web collection """

  if len(bpy.data.collections['web'].objects) == 1:
    web_object = bpy.data.collections['web'].objects[0]
    if web_object.name != xrs.filename.get_filename():
      web_object.name = xrs.filename.get_filename()
    if web_object.data.name != xrs.filename.get_filename():
      web_object.data.name = xrs.filename.get_filename()
    if web_object.data.materials[0].name != xrs.filename.get_filename():
      web_object.data.materials[0].name = xrs.filename.get_filename()

  if len(bpy.data.collections['web'].objects) == 2:
    web_collection = bpy.data.collections['web']
    obj0 = web_collection.objects[0]
    obj1 = web_collection.objects[1]
    alpha_linked = obj0.material_slots[0].material.node_tree.nodes['Principled BSDF'].inputs[18].is_linked

    # TODO: this code should be re-written and blend_method should be the primary way to set alpha
    if (obj0.name.endswith('_clear') or obj0.name.endswith('_clip')):
      web_object = obj1
      web_clear = obj0
    elif (obj1.name.endswith('_clear') or obj1.name.endswith('_clip')):
      web_object = obj0
      web_clear = obj1
    elif (obj0.data.materials[0].blend_method == 'BLEND' or obj0.data.materials[0].blend_method == 'CLIP'):
      web_object = obj1
      web_clear = obj0
    elif (obj1.data.materials[0].blend_method == 'BLEND' or obj1.data.materials[0].blend_method == 'CLIP'):
      web_object = obj0
      web_clear = obj1
    elif alpha_linked == True:
      # As a fallback, see if the first object has it's alpha linked and make it _clear
      web_object = obj1
      web_clear = obj0
    else:
      web_object = obj0
      web_clear = obj1

    transparent_postfix = "_clear"
    if (web_clear.name.endswith("_clip") or web_clear.data.materials[0].blend_method == 'CLIP'):
      transparent_postfix = "_clip"

    if web_object.name != xrs.filename.get_filename():
      web_object.name = xrs.filename.get_filename()
    if web_object.data.name != xrs.filename.get_filename():
      web_object.data.name = xrs.filename.get_filename()
    if web_object.data.materials[0].name != xrs.filename.get_filename():
      web_object.data.materials[0].name = xrs.filename.get_filename()
    if web_clear != xrs.filename.get_filename() + transparent_postfix:
      web_clear.name = xrs.filename.get_filename() + transparent_postfix
    if web_clear.data.name != xrs.filename.get_filename() + transparent_postfix:
      web_clear.data.name = xrs.filename.get_filename() + transparent_postfix
    if web_clear.data.materials[0].name != xrs.filename.get_filename() + transparent_postfix:
      web_clear.data.materials[0].name = xrs.filename.get_filename() + transparent_postfix

def delete_all_objects():
  """ Delete all objects in the scene """
  bpy.ops.object.select_all(action='SELECT')
  bpy.ops.object.delete()

def delete_object_with_name(name):
  """ Delete the object with the given name """
  xrs.select.single_object(bpy.data.objects[name])
  bpy.ops.object.delete()

def get_min_max_global_limits(obj):
  """ Return the min and max limits of the object for the given axis """
  if (transforms_are_applied(obj)):
    if (obj.type == 'MESH'):
      x_min = obj.data.vertices[0].co.x
      x_max = obj.data.vertices[0].co.x
      y_min = obj.data.vertices[0].co.y
      y_max = obj.data.vertices[0].co.y
      z_min = obj.data.vertices[0].co.z
      z_max = obj.data.vertices[0].co.z
      for v in obj.data.vertices:
        if (v.co.x < x_min):
          x_min = v.co.x
        if (v.co.x > x_max):
          x_max = v.co.x
        if (v.co.y < y_min):
          y_min = v.co.y
        if (v.co.y > y_max):
          y_max = v.co.y
        if (v.co.z < z_min):
          z_min = v.co.z
        if (v.co.z > z_max):
          z_max = v.co.z
      return (x_min, x_max, y_min, y_max, z_min, z_max)
  return (0,0,0,0,0,0)

def get_polycount(obj):
  """ Gets the polycount of the given object """
  return len(obj.data.polygons)

def get_triangle_count(obj):
  """ Gets the triangle of the given object """
  return sum(len(p.vertices) - 2 for p in obj.data.polygons)

def non_manifold_vertex_count(obj):
  """ Returns the number of non-manifold vertices """
  xrs.select.single_object(obj)
  bpy.ops.object.mode_set(mode='EDIT')
  bpy.ops.mesh.select_mode(type='EDGE')
  bpy.ops.mesh.select_all(action='DESELECT')
  bpy.ops.mesh.select_non_manifold(use_verts=False)
  obj.update_from_editmode()
  return (len([v for v in obj.data.vertices if v.select]))

def scale_uniform(obj, scale):
  obj.scale = (scale, scale, scale)

def recalculate_normals(obj):
  """ Recalculate the normals for the given object """
  initial_mode = bpy.context.mode
  xrs.select.single_object(obj)
  bpy.ops.object.mode_set(mode = 'EDIT')
  bpy.ops.mesh.normals_make_consistent(inside=False)
  bpy.ops.object.mode_set(mode = initial_mode)

def select(obj):
  """ Select only the given object and make it the active object """
  # TODO: just call this directly
  return xrs.select.single_object(obj)

def transforms_are_applied(obj):
  """ Check that the object is at 0,0,0 and has scale 1,1,1 """
  if (
    obj.location.x != 0 or
    obj.location.y != 0 or
    obj.location.z != 0
  ):
    return False
  if (
    obj.rotation_euler.x != 0 or
    obj.rotation_euler.y != 0 or
    obj.rotation_euler.z != 0
  ):
    return False
  if (
    obj.scale.x != 1 or
    obj.scale.y != 1 or
    obj.scale.z != 1
  ):
    return False
  return True

def triangulate(obj):
  """ Triangulates a mesh, removing quads and n-gons """
  xrs.select.single_object(obj)
  xrs.mode.set_edit()
  bpy.ops.mesh.select_all(action="SELECT")
  bpy.ops.mesh.quads_convert_to_tris()
  xrs.mode.set_object()
