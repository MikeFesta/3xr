# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Automation Tools for 3XR Studio - run from the command line

package name: xrs
module name: automate

blender use: from xrs import automate as xra
"""
import bpy
import bmesh
import math
import sys
import os
from mathutils import Vector

import xrs.bake
def bake_diffuse(resolution = 4096):
  return xrs.bake.diffuse(resolution)

def bake_metallic(resolution = 4096):
  return xrs.bake.metallic(resolution)

def bake_normal(resolution = 4096):
  return xrs.bake.normal(resolution)

def bake_opacity(resolution = 4096):
  return xrs.bake.opacity(resolution)

def bake_roughness(resolution = 4096):
  return xrs.bake.roughness(resolution)

import xrs.camera
def point_camera_at_object_from_angle(camera, object, angle_orbit, angle_up):
  xrs.camera.point_at_object_from_angle(camera, object, angle_orbit, angle_up)
def rotate_object_and_angle_camera(camera, object, angle_orbit, angle_up):
  xrs.camera.rotate_object_and_angle_camera(camera, object, angle_orbit, angle_up)
def rotate_object_and_angle_camera_fixed_radius(camera, object, angle_orbit, angle_up, radius):
  xrs.camera.rotate_object_and_angle_camera_fixed_radius(camera, object, angle_orbit, angle_up, radius)

import xrs.collection
def join_collection_objects_into_one(name):
  return xrs.collection.join_objects_into_one(name)
def get_objects_in_collection(name):
  return xrs.collection.get_objects(name)
def link_object_to_collection(object_name, collection_name):
  return xrs.collection.link_object_by_name(object_name, collection_name)

import xrs.command_line
def get_command_line_arguments():
  return xrs.command_line.get_arguments()

def get_last_command_line_argument():
  return xrs.command_line.get_last_argument()

import xrs.export
def export_glb(path):
  return xrs.export.export_glb(path)

def export_images(path):
  return xrs.export.export_images(path)

import xrs.filename
def get_dir():
  return xrs.filename.get_dir()

def get_filename():
  return xrs.filename.get_filename()

def get_parent_dir():
  return xrs.filename.get_parent_dir()

def get_resources_dir():
  return xrs.filename.get_resources_dir()

def get_sibling_dir(name):
  return xrs.filename.get_dir() + "../" + name + "/"

import xrs.lighting
def place_light_above_camera(light, camera, height = 1):
  return xrs.lighting.place_light_above_camera(light, camera, height)

def set_light_strength(light, strength = 10):
  return xrs.lighting.set_light_strength(light, strength)

def set_hdr_lighting(image_path, strength = 1):
  return xrs.lighting.set_hdr(image_path, strength)

import xrs.link
def append_collection(filename, collection_name):
  return xrs.link.collection(filename, collection_name, False)

def link_collection(filename, collection_name):
  return xrs.link.collection(filename, collection_name)

def append_material(filename, material_name):
  return xrs.link.material(filename, material_name, False)

def link_material(filename, material_name):
  return xrs.link.material(filename, material_name)

def link_object(filename, object_name):
  return xrs.link.object(filename, object_name)

import xrs.log
def log_debug(message):
  xrs.log.debug(message)

def log_error(message):
  xrs.log.error(message)

def log_info(message):
  xrs.log.info(message)

def log_silly(message):
  xrs.log.silly(message)

def log_verbose(message):
  xrs.log.verbose(message)

def log_warn(message):
  xrs.log.warn(message)

import xrs.material
def assign_material_to_object(material_name, object_name, slot_index = 0):
  return xrs.material.assign_to_object(material_name, object_name, slot_index)

def bake_selected_diffuse():
  return xrs.material.bake_selected_diffuse()

def bake_selected_metallic():
  return xrs.material.bake_selected_metallic()

def bake_selected_normal():
  return xrs.material.bake_selected_normal()

def bake_selected_opacity():
  return xrs.material.bake_selected_opacity()

def bake_selected_roughness():
  return xrs.material.bake_selected_roughness()

def build_material_for_amazon(mat, mat_dir, amazon_dir):
  return xrs.material.build_for_amazon(mat, mat_dir, amazon_dir)

def get_material_alpha_link_count(mat):
  return xrs.material.get_bsdf_link_count(mat, "Alpha")

def get_material_alpha_value(mat):
  return xrs.material.get_bsdf_value(mat, "Alpha")

def get_material_metallic_value(mat):
  return xrs.material.get_bsdf_value(mat, "Metallic")

def get_material_roughness_value(mat):
  return xrs.material.get_bsdf_value(mat, "Roughness")

def rebuild_material_from_textures(
    mat,
    textures_dir,
    use_orm = False,
    png_diffuse = True,
    alpha_clip = False,
    diffuse_name = "_4k_diffuse",
    normal_name = "_4k_normal",
    alpha_name = '_4k_opacity',
    orm_name = "_4k_orm",
    ao_name = '_4k_ao',
    roughness_name = '_4k_roughness',
    metallic_name = '_4k_metallic',
    emissive_name = '_4k_emissive',
    use_pngs = True,
    use_alpha = True,
    transparent_texture = False
  ):
    xrs.material.rebuild_from_textures(
      mat=mat,
      textures_dir=textures_dir,
      use_orm=use_orm,
      png_diffuse=png_diffuse,
      alpha_clip=alpha_clip,
      diffuse_name=diffuse_name,
      normal_name=normal_name,
      alpha_name=alpha_name,
      orm_name=orm_name,
      ao_name=ao_name,
      roughness_name=roughness_name,
      metallic_name=metallic_name,
      emissive_name=emissive_name,
      use_pngs=use_pngs,
      use_alpha=use_alpha,
      transparent_texture=transparent_texture)

def relink_textures(dir):
  xrs.material.relink_textures(dir)

def set_material_default_color(mat, red, green, blue):
  xrs.material.set_bsdf_default(mat, "Base Color", (red, green, blue, 1))

def set_material_default_color_hex(mat, color):
  xrs.material.set_material_default_color_hex(mat, color)

def set_material_default_metallic(mat, metallic):
  xrs.material.set_bsdf_default(mat, "Metallic", metallic)

def set_material_default_roughness(mat, roughness):
  xrs.material.set_bsdf_default(mat, "Roughness", roughness)

def single_uv_channel_for_object_named(object_name):
  xrs.material.single_uv_channel_for_object_named(object_name)

def swap_with_1k_textures(mat, textures_dir, png_diffuse = False):
  xrs.material.swap_with_1k_textures(mat, textures_dir, png_diffuse)

def swap_shared_image_textures(mat, textures_dir):
  xrs.material.swap_shared_image_textures(mat, textures_dir)

def update_legacy_material_names():
  xrs.material.update_legacy_names()

def update_material_to_crate_and_barrel(material, textures_dir, use_orm = True):
  xrs.material.update_material_to_crate_and_barrel(material, textures_dir, use_orm)

def update_material_to_version_1(material, textures_dir, png_diffuse):
  xrs.material.update_material_to_version_1(material, textures_dir, png_diffuse)

def update_material_to_version_2(material, textures_dir, png_diffuse, alpha_clip = False):
  xrs.material.update_material_to_version_2(material, textures_dir, png_diffuse, alpha_clip)

def update_material_to_4k(mat, textures_dir, transparent = False):
  xrs.material.update_material_to_4k(mat, textures_dir, transparent)

def material_uv_set_3xr_library(node_tree):
  xrs.material.uv_set_3xr_library(node_tree)

def uv_layout_export():
  xrs.material.uv_layout_export()

import xrs.math
def round_to_fives(value):
  return xrs.math.round_to_fives(value)

import xrs.mode
def set_edit_mode():
  xrs.mode.set_edit()

def set_object_mode():
  xrs.mode.set_object()

import xrs.object
def add_object_to_selection(obj):
  xrs.object.add_to_selection(obj)

def auto_name():
  return xrs.object.auto_name()

def delete_all_objects():
  """ Delete all objects in the scene """
  bpy.ops.object.select_all(action='SELECT')
  bpy.ops.object.delete()

def delete_object_with_name(name):
  bpy.data.objects.remove(bpy.data.objects[name])

def scale_object_uniform(obj, scale):
  xrs.object.scale_uniform(obj, scale)

def select_object(obj):
  xrs.object.select(obj)

def triangulate_object(obj):
  xrs.object.triangulate(obj)

import xrs.product
def set_product_name(name):
  xrs.product.set_name(name)

def set_product_uid(uid):
  xrs.product.set_uid(uid)

import xrs.render
def set_renderer_to_cycles(samples = 128):
  xrs.render.set_cycles(samples)

def set_renderer_to_eevee():
  xrs.render.set_eevee()

def set_render_resolution(x, y):
  xrs.render.set_resolution(x, y)

def set_render_filepath_with_format(filepath, format):
  xrs.render.set_filepath_with_format(filepath, format)

def render_and_save():
  xrs.render.render_and_save()

def use_gpu_for_render():
  xrs.render.set_gpu()

import xrs.save
def save():
  return xrs.save.save()

def save_as(dir, name):
  return xrs.save.save_as(dir, name)

import xrs.select
def select_collection_named(name):
  xrs.select.collection_named(name)

import xrs.tools

def change_to_wireframe(obj):
  xrs.tools.change_to_wireframe(obj)

def create_line_draw():
  xrs.tools.create_line_draw()

def get_total_polycount(collection):
  return xrs.tools.get_total_polycount(collection)

def get_total_tricount(collection):
  return xrs.tools.get_total_tricount(collection)

def get_total_light_count(collection):
  return xrs.tools.get_total_light_count('lights')

def rejoin_web_mesh(polys=10000):
  xrs.tools.rejoin_web_mesh()

def split_web_mesh():
  xrs.tools.split_web_mesh()

import xrs.units
def set_unit_type(unit_name):
  xrs.units.set_type(unit_name)

def get_size_for_unit(unit_name):
  return xrs.units.get_size_for_unit(unit_name)

import xrs.update
def record_asset_submission_render(submission_id, render):
  return xrs.update.record_asset_submission_render(submission_id, render)
def record_asset_submission_renders(submission_id, renders):
  return xrs.update.record_asset_submission_renders(submission_id, renders)
def record_asset_has360(asset_uid):
  return xrs.update.record_asset_has360(asset_uid)

import xrs.upload
def set_submission_dimensions(submission_id, unit_type_id, width, depth, height, web_tri_count, light_count):
  return xrs.upload.set_submission_dimensions(submission_id, unit_type_id, width, depth, height, web_tri_count, light_count)
def submit_product():
  return xrs.upload.submit_product(skip_uvs=True)

import xrs.quit
def quit_with_error(message):
  xrs.quit.quit_with_error(message)

def quit():
  xrs.quit.quit()

import xrs.validate
def validate_scene_for_glb():
  return xrs.validate.scene_for_glb()

### OLD FUNCTIONS BELOW ###
def get_material_diffuse(mat):
  if "Principled BSDF" not in mat.node_tree.nodes:
    raise Exception("Principled BSDF not in material " + mat.name)
  node = mat.node_tree.nodes["Principled BSDF"]
  diffuse = node.inputs[0]
  if (diffuse.name != "Base Color"):
    raise Exception("Base Color is no longer the 0th element of Principled BSDF")
  return diffuse.default_value

def get_material_metallic(mat):
  if "Principled BSDF" not in mat.node_tree.nodes:
    raise Exception("Principled BSDF not in material " + mat.name)
  node = mat.node_tree.nodes["Principled BSDF"]
  metallic = node.inputs[4]
  if (metallic.name != "Metallic"):
    raise Exception("Metallic is no longer the 5th element of Principled BSDF")
  return round(metallic.default_value * 100, 0)

def get_material_roughness(mat):
  if "Principled BSDF" not in mat.node_tree.nodes:
    raise Exception("Principled BSDF not in material " + mat.name)
  node = mat.node_tree.nodes["Principled BSDF"]
  roughness = node.inputs[7]
  if (roughness.name != "Roughness"):
    raise Exception("Roughness is no longer the 8th element of Principled BSDF")
  return round(roughness.default_value * 100, 0)

def print_error(message):
    """ Print a color coded error to the console """
    print("\033[91m" + "ERROR: " + message + "\033[0m")

def print_status(message):
    """ Print a color coded status message to the console """
    print("\033[92m" + message + "\033[0m")

def print_warning(message):
    """ Print a color coded warning to the console """
    print("\033[93m" + "Warning: " + message + "\033[0m")

def test():
    """ Code for quick tests """
    xrs.internal.test()
    print("Done with xrs.tools test")

def show_single_object_for_render(obj):
    """ Hiding all objects except the target from the render """
    for o in bpy.data.objects:
      if o.name == obj.name:
        o.hide_render = False
      else:
        o.hide_render = True

def clear_parent_keep_transform(obj):
    """ Remove parent without moving the object (same as Alt+P) """
    original_matrix = obj.matrix_world.copy()
    obj.parent = None
    obj.matrix_world = original_matrix

def update_scene():
    """ Update the scene (changed in 2.80) """
    if is_blender_28():
        bpy.context.scene.collection.objects.update()
        bpy.context.window.view_layer.update()
        #for view_layer in bpy.context.scene.view_layers:
            #print(view_layer.name)
            #view_layer.update()
    else:
        bpy.context.scene.update()

def get_edge_center(edge):
    """ Get the center of a BMesh edge """
    center = Vector((0, 0, 0))
    for vert in edge.verts:
        center += vert.co
    center /= len(edge.verts)
    return(center)

def get_lowest_point_of_object(obj):
    """ Return the coords of the lowest point, in world space """
    co = multiply_matrix(obj.matrix_world.copy(), obj.data.vertices[0].co)
    low_point = co
    for vert in obj.data.vertices:
        co = multiply_matrix(obj.matrix_world.copy(), vert.co)
        if (co.z < low_point.z):
          low_point = co
    return(low_point)

def get_hidden_objects_by_type(type):
    """There are 3 ways an object can be hidden - pass type as string"""
    hidden = []
    if type == "hide_viewport":
        for obj in bpy.data.objects:
            if obj.hide_viewport:
                hidden.append(obj)
    if type == "view_layer":
        for obj in bpy.data.objects:
            if obj.name not in bpy.context.view_layer.objects:
                hidden.append(obj)
    if type == "visible_get":
        for obj in bpy.data.objects:
            # Need to ensure it is in the view layer or there is an error
            if obj.name in bpy.context.view_layer.objects:
                if not obj.visible_get():
                    hidden.append(obj)
    return hidden

def show_all():
    """ Using a View Layer to show all objects """
    #if "ShowAll" not in bpy.context.scene.view_layers:
    #    show_all_layer = bpy.context.scene.view_layers.new("ShowAll")
    #else:
    #    show_all_layer = bpy.context.scene.view_layers["ShowAll"]

    #bpy.context.window.view_layer = show_all_layer
    # The above was being buggy with update_scene, skipping for now
    show_all_layer = bpy.context.window.view_layer

    # Show all collections
    for collection in show_all_layer.layer_collection.children:
        collection.exclude = False
        collection.hide_viewport = False

    for collection in bpy.data.collections:
        collection.hide_viewport = False
        collection.hide_select = False
        collection.hide_render = False

    # Show any remaining hidden at the object level
    for obj in get_hidden_objects_by_type("hide_viewport"):
        obj.hide_viewport = False

    for obj in bpy.data.objects:
        # This may help un-hide objects that were returning visible_get = False
        obj.hide_set(False)

    # TODO: This should have additional testing
    for obj in get_hidden_objects_by_type("view_layer"):
        print("Warning: " + obj.name + " is still hidden (view_layer) after xrs.show_all()")
    for obj in get_hidden_objects_by_type("visible_get"):
        print("Warning: " + obj.name + " is still hidden (visible_get) after xrs.show_all()")

def select_bottom_vertices(obj):
    bpy.ops.object.mode_set(mode = 'OBJECT')
    bpy.ops.object.mode_set(mode = 'EDIT')
    bpy.ops.mesh.select_mode(type='VERT')
    bpy.ops.mesh.select_all(action = 'DESELECT')
    mesh = bmesh.from_edit_mesh(obj.data)
    for v in mesh.verts:
        co = multiply_matrix(obj.matrix_world, v.co)
        if (co.z == 0):
            v.select = True
    bpy.ops.object.mode_set(mode = 'OBJECT')
    bpy.ops.object.mode_set(mode = 'EDIT')

def select_bottom_faces(obj):
    select_bottom_vertices(obj)
    bpy.ops.mesh.select_mode(type='FACE')

def flatten_bottom_vertices(obj, threshold):
    """ Move all vertices bellow the threshold to zero """
    for v in obj.data.vertices:
        co = multiply_matrix(obj.matrix_world, v.co)
        if (co.z <= threshold):
            new_co = Vector((co.x, co.y, 0))
            v.co = multiply_matrix(obj.matrix_world.inverted(), new_co)

def fix_bad_faces(obj):
    """ Remove non-manifold edges by merging vertices and beautify_fill faces """
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_mode(type='EDGE')
    bpy.ops.mesh.select_non_manifold(use_verts=False)
    # Exit Edit mode to update data
    bpy.ops.object.mode_set(mode='OBJECT')
    # Move vertices
    edges = [e for e in obj.data.edges if e.select]
    for e in edges:
        # Note - just moving to the first for now. may want to merge at center
        obj.data.vertices[e.vertices[0]].co = obj.data.vertices[e.vertices[1]].co
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.remove_doubles(threshold=0.00001)
    bpy.ops.mesh.beautify_fill() # This should remove overlapping triangles
    bpy.ops.object.mode_set(mode='OBJECT')

def disable_all_from_render():
    for o in bpy.data.objects:
        o.hide_render=True

def copy_location_rotation_scale_from_to(src, dest):
    """ Copy the location, rotation and scale """
    dest.rotation_euler = src.rotation_euler
    dest.scale = src.scale
    dest.location = src.location

def reset_location_rotation_scale(obj):
    """ Reset the location to 0,0,0; rotation to 0,0,0; scale to 1,1,1 """
    obj.rotation_euler = (0,0,0)
    obj.scale = (1,1,1)
    obj.location = (0,0,0)

def is_blender_28():
    return (bpy.app.version[0] >= 2 and bpy.app.version[1] >= 80)

def debug_commands(on):
    """ Outputs the actions clicked on by the user - helps to find commands """
    bpy.app.debug_wm = on

def multiply_matrix(a,b):
    """ Blender 2.8 changed the syntax from * to @ """
    # https://wiki.blender.org/wiki/Reference/Release_Notes/2.80/Python_API
    # This function can be removed once 2.79 support is removed
    if (is_blender_28()):
        return a @ b
    else:
        return a * b

def select_object_by_name_no_context(name):
    """ This is an attempt to deal with an incorrect context error """
    obj = bpy.data.objects[name]
    for o in bpy.context.view_layer.objects:
       if (is_blender_28()):
           o.select_set(False)
       else:
           o.select = False

    if (is_blender_28()):
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
    else:
        obj.select = True
        bpy.context.scene.objects.active = obj

def select_object_by_name(name):
    """ Select an object using its name """
    select_object(bpy.data.objects[name])

def place_at_center_bottom(obj):
    """ TODO: this is not working as expected with scale !=1 """
    local_center = sum((Vector(b) for b in obj.bound_box), Vector())/8
    global_center = multiply_matrix(obj.matrix_world, local_center)
    Vector.negate(global_center)
    obj.location = global_center
    obj.location.z = -min(b[2] for b in obj.bound_box)

def get_3d_area():
    """ Return the first area of type VIEW_3D """
    areas = [a for a in bpy.context.screen.areas if a.type == 'VIEW_3D']
    if len(areas) == 0:
        return None
    return areas[0]

def get_3d_space():
    area = get_3d_area()
    spaces = [s for s in area.spaces if s.type == 'VIEW_3D']
    if len(spaces) == 0:
        return None
    return spaces[0]

def get_all_cameras():
    """ Returns a list of all the cameras """
    return [o for o in bpy.data.objects if o.type == 'CAMERA']
    # Note: this should be the same as bpy.data.cameras

def set_camera_lenses(cameras, length_in_mm):
    """ Loops through all cameras and sets them to the given focal length """
    for c in cameras:
        c.data.lens = length_in_mm

def configure_agisoft_camera(cam):
    print(cam.name)

    # Load the Image (if not already loaded)
    if (cam.name+'.jpg' in bpy.data.images):
        print('Image '+cam.name+'.jpg already loaded')
    else:
        print('need to load the image')
        working_directory = os.path.dirname(bpy.data.filepath)
        photo_directory = os.path.join(os.path.dirname(working_directory),'source','photos')
        bpy.data.images.load(photo_directory+os.sep+cam.name+'.jpg')

    # Camera is mirrored / inverted - this fixes it
    select_object(cam)
    bpy.ops.transform.mirror(constraint_axis=(True, False, True), orient_type='LOCAL')
    # Note, should also create a dummy to track to which will fix the z-up issue, but that messes up the actual camera target ...
    # Image can be flipped vertically, or horizontally if camera is rotate 180 on the local z

    # Fix other camera settings
    cam.data.clip_start = 0.01
    cam.data.clip_end = 1000

    # Assign the background image (if not yet assigned)
    if (len(cam.data.background_images) == 0):
        cam.data.background_images.new()

    # Set and show the background image
    cam.data.show_background_images = True
    background = cam.data.background_images[0]
    background.image = bpy.data.images[cam.name+'.jpg']
    background.display_depth='FRONT'
    background.frame_method='CROP'
    background.use_flip_y=True # Temp fix for inverted camera
