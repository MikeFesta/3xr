# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" 3XR Studio Tools for Blender - run from a blender tool panel

package name: xrs
module name: studio

blender use: from xrs import studio as xrs
"""
import bpy
import bmesh
import math
import sys
import os
from mathutils import Vector

import xrs.collection

def get_largest_dimension(name):
  return xrs.collection.get_largest_dimension(name)

def remove_spaces_from_image_names():
  return xrs.collection.remove_spaces_from_image_name()

import xrs.filename

def get_parent_dir():
  return xrs.filename.get_parent_dir()

import xrs.material
def add_emission_node(matName, colorVal):
  return xrs.material.add_emission_node(matName, colorVal)

def apply_checkerboard():
  return xrs.material.apply_checkerboard()

def bake_all(obj):
  return xrs.material.bake_all(obj)

def bake_lighting():
  return xrs.material.bake_lighting()

def bake_selected_ao():
  return xrs.material.bake_selected_ao()

def bake_selected_diffuse():
  return xrs.material.bake_selected_diffuse()

def bake_selected_metallic():
  return xrs.material.bake_selected_metallic()

def bake_selected_normal():
  return xrs.material.bake_selected_normal()

def bake_selected_roughness():
  return xrs.material.bake_selected_roughness()

def check_node_link(matName, nodeName, inputType):
  return xrs.material.check_node_link(matName, nodeName, inputType)

def create_3XR_mat_node(name):
  return xrs.material.create_3XR_mat_node(name)

def denoise_img(imgName):
  return xrs.material.denoise_img(imgName)

def draw_normal(matName, imgSize):
  return xrs.material.draw_normal(matName, imgSize)

def end_draw_normal(matName, imgSize):
  return xrs.material.end_draw_normal(matName, imgSize)

def is_8_bit():
  return xrs.material.is_8_bit()

def is_image():
  return xrs.material.is_image()

def link_output_to_slot_named(mat, output, node, name):
  return xrs.material.link_output_to_slot_named(mat, output, node, name)

def make_material():
  return xrs.material.make_material()

def make_opaque():
  return xrs.material.make_opaque()

def new_image_texture(matName, imageTexName, colorArray):
  return xrs.material.new_image_texture(matName, imageTexName, colorArray)

def new_image_texture_float(matName, imageTexName, colorFloat):
  return xrs.material.new_image_texture_float(matName, imageTexName, colorFloat)

def uv_layout_export():
  return xrs.material.uv_layout_export()

import xrs.object
def auto_name():
  return xrs.object.auto_name()

def detect_transforms():
  return xrs.object.transforms_are_applied(bpy.context.active_object)

def get_polycount(obj):
  return xrs.object.get_polycount(obj)

def recalculate_normals():
  return xrs.object.recalculate_normals(bpy.context.active_object)

import xrs.product
def product_submit():
  return xrs.product.submit()

import xrs.render
def set_renderer_to_cycles():
  xrs.render.set_cycles()

def set_render_resolution(x, y):
  xrs.render.set_resolution(x, y)

def set_render_filepath_with_format(filepath, format):
  xrs.render.set_filepath_with_format(filepath, format)

def render_and_save():
  xrs.render.render_and_save()

import xrs.save
def save_all_images():
  xrs.save.save_all_images()

import xrs.sync
def sync_pull():
  return xrs.sync.pull()

def sync_push():
  return xrs.sync.push()

import xrs.tools
def get_unit_symbol():
  return xrs.tools.get_unit_symbol()

def make_dim_outline(obj):
  return xrs.tools.make_dim_outline(obj)

import xrs.update
def check_for_update():
  return xrs.update.check()

import xrs.validate
def check_master():
  return xrs.validate.collection_has_objects("master")

def check_web():
  return xrs.validate.collection_has_objects("web")

def materials_submission():
  return xrs.validate.materials_submission()

def validate_mat_scene():
  return xrs.validate.mat_scene()

def validate_scene():
  return xrs.validate.scene()

def validate_submission():
  return xrs.validate.submission()
