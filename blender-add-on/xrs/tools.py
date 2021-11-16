# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Tools built for 3XR Studio to speed up modeling

package name: xrs
module name: tools

blender use: from xrs import tools
"""
import bpy
import bmesh
import math
import sys
import os
from mathutils import Vector
#import xrs.internal
import xrs.collection
import xrs.filename
import xrs.log
from time import sleep

def check_ao():
  """ Check if the ao texture is in the textures folder """
  path = xrs.filename.get_sibling_dir("textures") + xrs.filename.get_filename() + "_4k_ao.png"
  path_valid = os.path.isfile(path)
  if path_valid == False:
    return False
  else:
    return True

def convert_dims(dims):
  """ Converts default dimensions(m) based off of the current Blender file setting """
  if bpy.context.scene.unit_settings.length_unit == "FEET":
    new_dims = [
    dims[0]*3.28084,
    dims[1]*3.28084,
    dims[2]*3.28084]
    round_dims = (round(new_dims[0], 2), round(new_dims[1], 2), round(new_dims[2], 2))
    return round_dims
  if bpy.context.scene.unit_settings.length_unit == "INCHES":
    new_dims = [
    dims[0]*39.3701,
    dims[1]*39.3701,
    dims[2]*39.3701]
    round_dims = (round(new_dims[0], 2), round(new_dims[1], 2), round(new_dims[2], 2))
    return round_dims
  if bpy.context.scene.unit_settings.length_unit == "METERS":
    return dims
  if bpy.context.scene.unit_settings.length_unit == "CENTIMETERS":
    new_dims = [
    dims[0]*100,
    dims[1]*100,
    dims[2]*100]
    round_dims = (round(new_dims[0], 2), round(new_dims[1], 2), round(new_dims[2], 2))
    return round_dims
  if bpy.context.scene.unit_settings.length_unit == "MILLIMETERS":
    new_dims = [
    dims[0]*1000,
    dims[1]*1000,
    dims[2]*1000]
    round_dims = (round(new_dims[0], 2), round(new_dims[1], 2), round(new_dims[2], 2))
    return round_dims
  if bpy.context.scene.unit_settings.length_unit == "KILOMETERS":
    new_dims = [
    dims[0]*0.001,
    dims[1]*0.001,
    dims[2]*0.001]
    round_dims = (round(new_dims[0], 2), round(new_dims[1], 2), round(new_dims[2], 2))
    return round_dims

def change_to_wireframe(obj):
  """ Change the selected object to only use wireframe material in Blender """
  if len(obj.material_slots) > 1:
    for slot in obj.material_slots:
      if slot.name != obj.material_slots[0].name:
        bpy.ops.object.material_slot_remove()
  if obj.material_slots[0].material:
    obj.material_slots[0].material = bpy.data.materials['Wireframe Material']
    new_dims = convert_dims(obj.dimensions)
    obj_average = (new_dims[0] + new_dims[1] + new_dims[2])/3
    bpy.data.materials['Wireframe Material'].node_tree.nodes['Group'].inputs['Line Size'].default_value = obj_average * 0.00003

def create_line_draw():
  """ Sets up blender file and materials to render for line drawings """
  bpy.data.scenes['Scene'].render.use_freestyle = True
  bpy.data.scenes['Scene'].render.line_thickness = 0.5

#TODO: Create a function that identifies the name of the node that is currently linked to a given node

  for mat in bpy.data.materials:
    if xrs.material.check_node_link(mat.name, "Principled BSDF", "Base Color") == True:
      new_node = mat.node_tree.nodes.new("ShaderNodeMixRGB")
      new_node.name = "Mix_Node_1"
      bsdf = mat.node_tree.nodes["Principled BSDF"]
      color_out = mat.node_tree.nodes["Mix_Node_1"].outputs[0]
      img_tex = xrs.material.get_one_node_of_type(mat.node_tree.nodes, "TEX_IMAGE").outputs[0]
      mix = mat.node_tree.nodes["Mix_Node_1"]
      xrs.material.link_output_to_slot_named(mat, color_out, bsdf, "Base Color")
      xrs.material.link_output_to_slot_named(mat, img_tex, mix, "Color1")
#      new_tex_node = mat.node_tree.nodes.new("ShaderNodeTexCoord")
#      new_tex_node.name = "Tex_Node_1"
#      tex_out = mat.node_tree.nodes["Tex_Node_1"].outputs[4]
#      xrs.material.link_output_to_slot_named(mat, tex_out, bsdf, "Normal")

#    if xrs.material.check_node_link(mat.name, "Principled BSDF", "Metallic") == True:
#      new_node = mat.node_tree.nodes.new("ShaderNodeMixRGB")
#      new_node.name = "Mix_Node_2"
#      color_out = mat.node_tree.nodes["Mix_Node_2"].outputs[0]
#      img_tex = mat.node_tree.nodes["Image Texture.001"].outputs[0]
#      mix = mat.node_tree.nodes["Mix_Node_2"]
#      xrs.material.link_output_to_slot_named(mat, color_out, bsdf, "Base Color")
#      xrs.material.link_output_to_slot_named(mat, img_tex, mix, "Color1")

#    if xrs.material.check_node_link(mat.name, "Principled BSDF", "Roughness") == True:
#      new_node = mat.node_tree.nodes.new("ShaderNodeMixRGB")
#      new_node.name = "Mix_Node_3"
#      color_out = mat.node_tree.nodes["Mix_Node_3"].outputs[0]
#      img_tex = mat.node_tree.nodes["Image Texture.002"].outputs[0]
#      mix = mat.node_tree.nodes["Mix_Node_3"]
#      xrs.material.link_output_to_slot_named(mat, color_out, bsdf, "Base Color")
#      xrs.material.link_output_to_slot_named(mat, img_tex, mix, "Color1")

def hold_until_done(function, percent, holdTime):
  result = 0
  print("Processing Data Now...")
  for i in range (1, times+1):
    result += process (i)
    sleep(holdTime)
    print("Function: " + function, "Percent: " + percent)
  if percent == 100:
    return True

def set_object_mode():
  print("TODO - set the mode to object")
  #bpy.ops.object.mode_set(mode = 'OBJECT')

def set_edit_mode():
  bpy.ops.object.mode_set(mode = "EDIT")

def triangulate(obj):
  select_object(obj)
  set_edit_mode()
  bpy.ops.mesh.select_all(action="SELECT")
  bpy.ops.mesh.quads_convert_to_tris()
  bpy.ops.object.mode_set(mode = "OBJECT")

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

def get_total_polycount(collection):
  """ Get total polycount for a collection """
  polyCount = []
  for obj in bpy.data.collections[collection].all_objects:
    count = len(bpy.data.objects[obj.name].data.polygons)
    polyCount.append(count)
  return sum(polyCount)

def get_total_tricount(collection):
  """ Get total tricount for a collection """
  triangle_count = []
  for obj in bpy.data.collections[collection].all_objects:
    bpy.data.objects[obj.name].data.calc_loop_triangles()
    count = len(bpy.data.objects[obj.name].data.loop_triangles)
    triangle_count.append(count)
  return sum(triangle_count)

def get_total_light_count(collection):
  """ Get total number of lights in a collection """
  if collection not in bpy.data.collections:
    return 0
  light_count = 0
  for obj in bpy.data.collections[collection].all_objects:
    if (obj.type == 'LIGHT'):
      light_count = light_count + 1
  return light_count

def get_unit_symbol():
  """ Gets the length symbol based off of the current Blender file setting """
  if bpy.context.scene.unit_settings.length_unit == "FEET":
    return "\'"
  if bpy.context.scene.unit_settings.length_unit == "INCHES":
    return "\""
  if bpy.context.scene.unit_settings.length_unit == "METERS":
    return "m"
  if bpy.context.scene.unit_settings.length_unit == "CENTIMETERS":
    return "cm"
  if bpy.context.scene.unit_settings.length_unit == "MILLIMETERS":
    return "mm"
  if bpy.context.scene.unit_settings.length_unit == "KILOMETERS":
    return "km"

def make_dim_outline(obj):
  """ Makes a dimensions outline for the web collection model """
  dims = xrs.collection.get_dimensions("web")
  round_dims = xrs.tools.convert_dims(dims)
  bpy.ops.mesh.primitive_cube_add()
  dim_grid = bpy.context.active_object
  dim_grid.name = "3XR_dim_grid"
  dim_grid.data.name = "3XR_dim_grid"
  dim_grid.dimensions = dims
  dim_grid.location = [0, 0, dims[2]/2]
  dim_grid.modifiers.new("wireframe","WIREFRAME")
  dim_grid.modifiers['wireframe'].thickness = 0.05
  bpy.ops.object.modifier_apply(apply_as='DATA', modifier="wireframe")
  xrs.material.make_material()
  xrs.material.new_image_texture("3XR_dim_grid",
  "3XR_dim_grid_4k_diffuse",
  colorArray=(0.111,0.575,1,1),
  size=4096)
  mat = bpy.data.materials['3XR_dim_grid']
  diff = mat.node_tree.nodes['3XR_dim_grid_4k_diffuse']
  bsdf = mat.node_tree.nodes['Principled BSDF']
  xrs.material.link_output_to_slot_named(mat, diff.outputs[0], bsdf, 'Color')

  xrs.tools.make_text(
  "width",
  mat,
  str(round_dims[0]),
  location=[0, dims[1]/2, dims[2]+0.02],
  align_y="BOTTOM")

  xrs.tools.make_text(
  "length",
  mat,
  str(round_dims[1]),
  location=[dims[0]/2+0.03, 0, 0],
  align_x="LEFT",
  align_y="BOTTOM")

  xrs.tools.make_text(
  "height",
  mat,
  str(round_dims[2]),
  location=[-dims[0]/2-0.03, -dims[1]/2, dims[2]/2],
  align_x="RIGHT",
  align_y="CENTER")

  xrs.tools.make_text(
  "width_back",
  mat,
  str(round_dims[0]),
  rotation=[math.pi/2, 0, math.pi],
  location=[0, dims[1]/2, dims[2]+0.03],
  align_y="BOTTOM")

  xrs.tools.make_text(
  "length_back",
  mat,
  str(round_dims[1]),
  rotation=[math.pi/2, 0, math.pi],
  location=[dims[0]/2+0.03, 0, 0],
  align_x="RIGHT",
  align_y="BOTTOM")

  xrs.tools.make_text(
  "height_back",
  mat,
  str(round_dims[2]),
  rotation=[math.pi/2, 0, math.pi],
  location=[-dims[0]/2-0.03, -dims[1]/2, dims[2]/2],
  align_x="LEFT",
  align_y="CENTER")

def make_text(name, mat, body="text", scale=[0.1,0.1,0.1], rotation=[math.pi/2,0,0], location=[0,0,0], align_x='CENTER', align_y='CENTER'):
  """ Makes a given text in a specified location in Blender """
  font_curve = bpy.data.curves.new(type="FONT",name=name)
  font_curve.body = body + xrs.tools.get_unit_symbol()
  font_obj = bpy.data.objects.new(name, font_curve)
  bpy.context.scene.collection.objects.link(font_obj)
  bpy.data.curves[name].materials.append(mat)
  bpy.data.objects[name].scale = scale
  bpy.data.objects[name].rotation_euler = rotation
  bpy.data.curves[name].align_x = align_x
  bpy.data.curves[name].align_y = align_y
  bpy.data.objects[name].location = location
#  bpy.ops.object.convert(target="MESH")

def print_error(message):
    """ Print a color coded error to the console """
    print("\033[91m" + "ERROR: " + message + "\033[0m")

def print_status(message):
    """ Print a color coded status message to the console """
    print("\033[92m" + message + "\033[0m")

def print_warning(message):
    """ Print a color coded warning to the console """
    print("\033[93m" + "Warning: " + message + "\033[0m")

#def test():
#    """ Code for quick tests """
#    xrs.internal.test()
#    print("Done with xrs.tools test")

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

def split_web_mesh():
  """ Split the web mesh of the web collection model to prevent overflow issues """
  for collection in bpy.data.collections:
    if collection.name == "web":
      xrs.log.info("Web Collection Valid")
      for object in collection.objects:
        print("Manipulating object: {}".format(object.name))

        object.select_set(True)
        # Place at correct location and scale to the setting size
        scale = object.scale

        thickness = list(object.dimensions)[2]
        location = [0 ,0, thickness/1000]
        object.location = location
        rotation = object.rotation_euler

        # Split the mesh
        if len(bpy.data.meshes[object.name].polygons) >= 30000:
          xrs.log.info("The low poly mesh " + object.name + " has over 30,000 polygons and will be split")
          if object.name.endswith("_clear"):
            pass
          else:
            xrs.log.info("Splitting Mesh")
            bpy.ops.mesh.separate(type='LOOSE')
            object.select_set(False)
            xrs.log.info("Mesh is Split and Deselected")

def rejoin_web_mesh(polys=10000): # Using 10000 as an arbitrary standard
  """ Rejoin the web mesh of the web collection model that was split to prevent overflow issues """
  joining_obj = []
  joining_poly_count = 0
  for collection in bpy.data.collections:
    if collection.name == "web":
      for object in collection.objects:
        print("Evaluating object for rejoining: {}".format(object.name))
        if object.name.endswith("_clear"):
          pass
        else:
          # Rejoin the mesh based on the desired number of polygons per object
          if len(bpy.data.meshes[object.name].polygons) <= polys:
            joining_obj.append(object)
            xrs.log.info(str(object) + " has joined list : " + str(joining_obj))
            joining_poly_count += len(bpy.data.meshes[object.name].polygons)
          xrs.log.info("Joining_count is at: " + str(joining_poly_count))
          if joining_poly_count > polys:
            xrs.log.info("Joining count is over 10000, it is at: " + str(joining_poly_count))
            for obj in joining_obj:
              xrs.log.info("Selecting for joining the low poly mesh: " + obj.name)
              if obj == joining_obj[0]:
                bpy.context.view_layer.objects.active = bpy.data.objects[joining_obj[0].name]
              bpy.data.objects[obj.name].select_set(True)
            bpy.ops.object.join()
            bpy.ops.object.select_all(action='DESELECT')
            joining_obj = []
            joining_poly_count = 0
            xrs.log.info("Joining is finished and the list/poly count will restart")

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

def get_working_dir():
    """ Parse out the working directory (with /)  from the filepath """
    return bpy.data.filepath.rsplit('/', 1)[0] + os.sep

def get_parent_dir():
    """ Parse out the parking directory (with /)  from the filepath """
    return bpy.data.filepath.rsplit('/', 1)[0].rsplit('/', 1)[0] + os.sep

def get_filename_no_ext():
    """ Parse out the filename from the file and remove .blend extension """
    return bpy.data.filepath.rsplit('/', 1)[-1].split('.')[0]

def set_renderer_to_cycles():
    bpy.context.scene.render.engine = 'CYCLES'

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

def select_object(obj):
    """ Select only the given object and make it the active object """
    bpy.ops.object.select_all(action='DESELECT')
# This doesn't work with disabled/hidden objects
#   for o in bpy.data.objects:
#       if (is_blender_28()):
#           o.select_set(False)
#       else:
#           o.select = False

    if (is_blender_28()):
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
    else:
        obj.select = True
        bpy.context.scene.objects.active = obj

def place_at_center_bottom(obj):
    """ TODO: this is not working as expected with scale !=1 """
    local_center = sum((Vector(b) for b in obj.bound_box), Vector())/8
    global_center = multiply_matrix(obj.matrix_world, local_center)
    Vector.negate(global_center)
    obj.location = global_center
    obj.location.z = -min(b[2] for b in obj.bound_box)

def delete_all_objects():
    """ Delete all objects in the scene """
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

def delete_object_with_name(name):
    select_object(bpy.data.objects[name])
    bpy.ops.object.delete()

def get_command_line_arguments():
    """ Get the arguments after the last -- """
    # blender --background --python {script} -- [arguments]
    # 1. Reverse the list
    # 2. Get the index of --,
    # 3. Subtract it from the length
    # 4. Return from that postion to the end
    return sys.argv[len(sys.argv) - sys.argv[::-1].index("--"):]

def get_last_command_line_argument():
    return sys.argv[-1]

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

def quit():
    """ Shortcut for exiting """
    bpy.ops.wm.quit_blender()

def quit_with_error(error_message):
    """ Print an error message and raise a system error """
    print_error(error_message)
    # TODO: This is causing a segfault on exit
    sys.exit(error_message)

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

def save():
    # Note: fix using xrs. to reference local functions
    model_name = get_filename_no_ext()
    bpy.ops.wm.save_mainfile(filepath=os.path.join(get_working_dir(), model_name + ".blend"))
