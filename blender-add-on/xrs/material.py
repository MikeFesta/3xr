# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Code used to update legacy files for naming / organization
Material Names
old: {asset_name}_Mat
new: {texture_name}
"""
import bpy
import os
from pathlib import Path
import xrs.log
import xrs.convert
import xrs.collection
import xrs.filename
import xrs.object
import xrs.render
import xrs.select
import time

def add_emission_node(matName, colorVal):
  """ Adds emission node to a given material """
  if "Emission" not in bpy.data.materials[matName].node_tree.nodes:
    bpy.data.materials[matName].node_tree.nodes.new("ShaderNodeEmission")
    bpy.data.materials[matName].node_tree.nodes["Emission"].inputs["Color"].default_value = (colorVal, colorVal, colorVal, 1)

def apply_checkerboard():
  """ Applies Blender checkerboard to check UV layout of selected object """
  obj = bpy.context.active_object
  mat = bpy.data.materials.get("uv_checker")
  if mat == None:
    mat = bpy.data.materials.new(name="uv_checker")
    mat.use_nodes = True
    xrs.material.new_image_texture("uv_checker", "uv_checker", resolution = bpy.data.scenes['Scene'].render.resolution_x)
    bpy.data.images["uv_checker"].source = 'GENERATED'
    bpy.data.images["uv_checker"].generated_type = 'COLOR_GRID'
    img_out = mat.node_tree.nodes['uv_checker'].outputs[0]
    main_bsdf = mat.node_tree.nodes['Principled BSDF']
    xrs.material.link_output_to_slot_named(mat, img_out, main_bsdf, 'Base Color')
  if obj.data.materials:
    obj.data.materials[0] = mat
  else:
    obj.data.materials.append(mat)

def assign_to_object(material_name, object_name, slot_index = 0):
  """ Assign the selected material to the given material slot """
  mat = bpy.data.materials[material_name]
  obj = bpy.data.objects[object_name]
  if (len(obj.material_slots) <= slot_index):
    obj.data.materials.append(mat)
  else:
    obj.material_slots[slot_index].material = mat

def bake_all(obj):
  """ Goes through and bakes out ao, diffuse, roughness, metallic, and normal maps for a selected object """
  xrs.material.bake_selected_ao()
  xrs.log.info("AO map baked. Beginning baking diffuse map now.")
  xrs.material.bake_selected_diffuse()
  xrs.log.info("Diffuse map baked. Beginning baking roughness map now.")
  xrs.material.bake_selected_roughness()
  xrs.log.info("Roughness map baked. Beginning baking metallic map now.")
  xrs.material.bake_selected_metallic()
  xrs.log.info("Metallic map baked. Beginning baking normal map now.")
  xrs.material.bake_selected_normal()
  xrs.log.info("All maps for " + obj + " have been baked.")

def bake_ao(collection):
  """ Bakes the AO of all the objects in a collection """
  xrs.collection.join_objects_into_one(collection)
  bpy.ops.object.transform_apply()
  aoName = bpy.context.active_object.name + "_4k_ao.png"
  obj = bpy.context.active_object
  xrs.render.set_bake_render(bpy.data.scenes['Scene'].render.resolution_x)
  xrs.material.make_material()
  path = xrs.filename.get_sibling_dir("textures") + xrs.filename.get_filename() + "_4k_ao.png"
  bpy.data.scenes['Scene'].render.filepath = path
  bpy.context.active_object.location = [100, 100, 100]
  bpy.ops.object.bake(type="AO",filepath=path, save_mode='EXTERNAL')
  bpy.data.images[1].save_render(filepath=bpy.context.scene.render.filepath)
  bpy.context.active_object.location = [0, 0, 0]

# For Testing With Macros
def bake_ao():
  working_dir = xrs.filename.get_parent_dir()
  bpy.ops.object.bake(type="AO",filepath=working_dir + "textures", save_mode='EXTERNAL')
  return {'FINISHED'}

def bake_lighting():
  """ Bakes the lighting setup onto an object """
  xrs.render.set_bake_render(bpy.data.scenes['Scene'].render.resolution_x)
  matName = bpy.context.active_object.active_material.name
  imageTexName = xrs.filename.get_filename() + "_2k_diffuse"
  new_image_texture(matName,imageTexName,color_array=(0, 0, 0, 0), resolution = bpy.data.scenes['Scene'].render.resolution_x)
  bpy.context.scene.cycles.bake_type = 'COMBINED'
  bpy.context.active_object.select_set(True)
  working_dir = xrs.filename.get_parent_dir()
  bpy.ops.object.bake("INVOKE_DEFAULT",type="DIFFUSE",filepath=working_dir + "textures", save_mode='EXTERNAL')

def bake_selected_ao():
  """ Bakes the seleted AO on an object """
  xrs.render.set_bake_render(bpy.data.scenes['Scene'].render.resolution_x)
  aoName = bpy.context.active_object.name + "_4k_ao"
  make_material()
  activeMaterialName = bpy.context.active_object.active_material.name
  bpy.data.objects["dimensions_cube"].hide_render = True
  bpy.data.collections["reference"].hide_render = True
  bpy.data.objects["front"].hide_render = True
  nodes = bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes
#  bsdf = get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED")
  currentColor = 0
  working_dir = xrs.filename.get_parent_dir()
  bpy.data.scenes['Scene'].render.filepath = working_dir + "textures/" + aoName + ".png"
  print("File path set")
  if len(bpy.context.selected_objects) == 1:
    bpy.data.objects[bpy.context.active_object.name].location[0] = 20
    for allObj in bpy.data.objects:
      if allObj != bpy.context.active_object:
        allObj.hide_render = True
    for eachObject in bpy.data.collections['web'].all_objects:
      eachObject.select_set(True)
    print("Baking ambient occlusion data now.")
    new_image_texture_float(activeMaterialName, aoName, resolution = bpy.data.scenes['Scene'].render.resolution_x)
#    if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
#      bsdf = bpy.data.materials[activeMaterialName].node_tree.nodes[bsdf.name]
#      imgTex = bpy.data.materials[activeMaterialName].node_tree.nodes[aoName].outputs[0]
#      link_output_to_slot_named(bpy.data.materials[activeMaterialName], imgTex, bsdf, "Base Color")
    bpy.context.scene.render.bake.use_selected_to_active = False
    bpy.ops.object.bake("INVOKE_DEFAULT", type="AO",filepath=working_dir + "textures", save_mode='EXTERNAL')
    print("Ambient Occlusion Bake Done.")
    #bpy.data.images[aoName].save_render(filepath=bpy.context.scene.render.filepath)
    print(aoName + " has been saved.")
    bpy.data.objects[bpy.context.active_object.name].location[0] = 0
    return {'FINISHED'}
  else:
    print("There is more than 1 object selected.")
    for allObj in bpy.data.objects:
      allObj.hide_render = False
    bpy.context.scene.render.bake.use_selected_to_active = True
    for eachObject in bpy.data.collections['master'].all_objects:
      eachObject.select_set(True)
    for eachObject in bpy.data.collections['web'].all_objects:
      eachObject.select_set(True)
    print("Baking ambient occlusion data now.")
    new_image_texture_float(activeMaterialName, aoName, resolution = bpy.data.scenes['Scene'].render.resolution_x)
#    if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
#      bsdf = bpy.data.materials[activeMaterialName].node_tree.nodes[bsdf.name]
#      imgTex = bpy.data.materials[activeMaterialName].node_tree.nodes[aoName].outputs[0]
#      link_output_to_slot_named(bpy.data.materials[activeMaterialName], imgTex, bsdf, "Base Color")
    bpy.ops.object.bake("INVOKE_DEFAULT",type="AO",filepath=working_dir + "textures", save_mode='EXTERNAL')
    print("Ambient Occlusion Bake Done.")
    #bpy.data.images[aoName].save_render(filepath=bpy.context.scene.render.filepath)
    print(aoName + " has been saved.")
  return {'FINISHED'}

def bake_selected_diffuse():
  xrs.render.set_bake_render(bpy.data.scenes['Scene'].render.resolution_x)
  xrs.render.disable_direct_indirect_for_bake()
  diffuseName = bpy.context.active_object.name + "_4k_diffuse"
  make_material()
  activeMaterialName = bpy.context.active_object.active_material.name
  nodes = bpy.data.materials[activeMaterialName].node_tree.nodes
#  bsdf = get_one_node_of_type(nodes, "BSDF_PRINCIPLED")
#  if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
#    currentColor = bpy.data.materials[activeMaterialName].node_tree.nodes[bsdf.name].inputs[0].default_value
  working_dir = xrs.filename.get_parent_dir()
  bpy.data.scenes['Scene'].render.filepath = working_dir + "textures/" + diffuseName + ".png"
  print("File path set")

#  for anyMat in bpy.data.materials:
#    print(anyMat.name)
#    if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
#      if anyMat.node_tree.nodes[bsdf.name].inputs[4].default_value == 1.0:
#        print(anyMat)
#        anyMat.tag = True
#        anyMat.node_tree.nodes[bsdf.name].inputs[4].default_value = 0

  if len(bpy.context.selected_objects) == 1:
    for allObj in bpy.data.objects:
      allObj.hide_render = False
    bpy.context.scene.render.bake.use_selected_to_active = False
    print("There is 1 object selected.")
    new_image_texture(activeMaterialName, diffuseName, resolution = bpy.data.scenes['Scene'].render.resolution_x)
#    if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
#      if check_node_link(activeMaterialName, bsdf.name, "Base Color") == False:
#        new_image_texture(activeMaterialName, diffuseName, currentColor)
#        bpy.data.materials[activeMaterialName].node_tree.nodes[diffuseName].location = (-500, 200)
#        bsdf = bpy.data.materials[activeMaterialName].node_tree.nodes[bsdf.name]
#        imgTex = bpy.data.materials[activeMaterialName].node_tree.nodes[diffuseName].outputs[0]
#        link_output_to_slot_named(bpy.data.materials[activeMaterialName], imgTex, bsdf, "Base Color")
        #bpy.data.images[diffuseName].save_render(filepath=bpy.context.scene.render.filepath)
        #print(diffuseName + " has been saved.")
    print("Baking diffuse data now.")
#    if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
#      new_image_texture(activeMaterialName, diffuseName, currentColor)
#    else:
#      new_image_texture(activeMaterialName, diffuseName, (0, 0, 0, 0))
    bpy.ops.object.bake("INVOKE_DEFAULT",type="DIFFUSE",filepath=working_dir + "textures", save_mode='EXTERNAL')
    print("Diffuse Bake Done.")
    #bpy.data.images[diffuseName].save_render(filepath=bpy.context.scene.render.filepath)
    print(diffuseName + " has been saved.")

#    for anyMat in bpy.data.materials:
#      if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
#        if anyMat.tag == True:
#          anyMat.node_tree.nodes[bsdf.name].inputs[4].default_value = 1
#        anyMat.tag == False

  else:
    print("There is more than 1 object selected.")
    for allObj in bpy.data.objects:
      allObj.hide_render = False
    bpy.context.scene.render.bake.use_selected_to_active = True
    for eachObject in bpy.data.collections['master'].all_objects:
      eachObject.select_set(True)
    for eachObject in bpy.data.collections['web'].all_objects:
      eachObject.select_set(True)
    print("Baking diffuse data now.")
    new_image_texture(activeMaterialName, diffuseName, resolution = bpy.data.scenes['Scene'].render.resolution_x)
#    if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
#      new_image_texture(activeMaterialName, diffuseName, currentColor)
#    else:
#      new_image_texture(activeMaterialName, diffuseName, (0, 0, 0, 0))
    bpy.ops.object.bake("INVOKE_DEFAULT",type="DIFFUSE",filepath=working_dir + "textures", save_mode='EXTERNAL')
    print("Diffuse Bake Done.")
    #bpy.data.images[diffuseName].save_render(filepath=bpy.context.scene.render.filepath)
    print(diffuseName + " has been saved.")

#  for anyMat in bpy.data.materials:
#    if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
#      if anyMat.tag == True:
#        anyMat.node_tree.nodes[bsdf.name].inputs[4].default_value = 1
#      anyMat.tag == False

  return {'FINISHED'}

# Full Functionality Dependent on Synchonous Baking
def bake_selected_metallic():
  """ Bakes metallic map, needs materials with BSDF to work """
  xrs.render.set_bake_render(bpy.data.scenes['Scene'].render.resolution_x)
  metallicName = bpy.context.active_object.name + "_4k_metallic"
  make_material()
  activeMaterialName = bpy.context.active_object.active_material.name
  nodes = bpy.data.materials[activeMaterialName].node_tree.nodes
  if check_if_bsdf() == False:
    return {'FINISHED'}
  bsdf = get_one_node_of_type(nodes, "BSDF_PRINCIPLED")
  if bsdf == None:
    print("Function not grabbing node correctly.")
    return
  outputNode = get_one_node_of_type(nodes, "OUTPUT_MATERIAL")
#  if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
  currentColor = bpy.data.materials[activeMaterialName].node_tree.nodes[bsdf.name].inputs[4].default_value
  bsdfMatName = bpy.data.materials[activeMaterialName].node_tree.nodes[bsdf.name]
  matOut = bpy.data.materials[activeMaterialName].node_tree.nodes[outputNode.name]
  working_dir = xrs.filename.get_parent_dir()
  bpy.data.scenes['Scene'].render.filepath = working_dir + "textures/" + metallicName + ".png"
  print("File path set")
#  if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
  if currentColor == 0.0 or currentColor == 1.0:
    print("Metallic values are either 1 or 0.")
  else:
    print("Metallic values need to be either 1 or 0.")
    return False
  if len(bpy.context.selected_objects) == 1:
    for allObj in bpy.data.objects:
      allObj.hide_render = False
    bpy.context.scene.render.bake.use_selected_to_active = False
    print("There is 1 object selected.")
#    new_image_texture(activeMaterialName, metallicName, (0, 0, 0, 1))
#    if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
    if check_node_link(activeMaterialName, bsdf.name, "Metallic") == False:
      print("Metallic Node is False")
      if currentColor == 0.0:
          #if metallicName in bpy.data.images:
            #bpy.data.images[metallicName].remove
            #print("Duplicate image removed.")
          #else:
            #print("No duplicate images.")
        print("Color is 0.0 and making a new image texture now.")
        new_image_texture(activeMaterialName, metallicName, (0, 0, 0, 1), bpy.data.scenes['Scene'].render.resolution_x)
        imgTex = bpy.data.materials[activeMaterialName].node_tree.nodes[metallicName].outputs[0]
        link_output_to_slot_named(bpy.data.materials[activeMaterialName].node_tree.nodes[metallicName].outputs, imgTex, bsdfMatName, "Metallic")
      else:
          #if metallicName in bpy.data.images:
            #bpy.data.images[metallicName].remove
            #print("Duplicate image removed.")
          #else:
            #print("No duplicate images.")
        print("Color is 1.0 and making a new image texture now.")
        new_image_texture(activeMaterialName, metallicName, (1, 1, 1, 1), bpy.data.scenes['Scene'].render.resolution_x)
        imgTex = bpy.data.materials[activeMaterialName].node_tree.nodes[metallicName].outputs[0]
        link_output_to_slot_named(bpy.data.materials[activeMaterialName].node_tree.nodes[metallicName].outputs, imgTex, bsdfMatName, "Metallic")
        #bpy.data.images[metallicName].save_render(filepath=bpy.context.scene.render.filepath)
        return {'FINISHED'}
    else:
      print("There is a metallic connection to " + bpy.context.active_object.name +".")
      bpy.ops.object.bake("INVOKE_DEFAULT",type="EMIT",filepath=working_dir + "textures", save_mode='EXTERNAL')
      #bpy.data.images[metallicName].save_render(filepath=bpy.context.scene.render.filepath)
    return {'FINISHED'}
  else:
    print("There is more than 1 object selected.")
    for allObj in bpy.data.objects:
      allObj.hide_render = False
    bpy.context.scene.render.bake.use_selected_to_active = True
    for anyMat in bpy.data.materials:
      bsdf = get_one_node_of_type(anyMat.node_tree.nodes, "BSDF_PRINCIPLED")
      outputNode = get_one_node_of_type(anyMat.node_tree.nodes, "OUTPUT_MATERIAL")
#      if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
      if anyMat.node_tree.nodes[bsdf.name].inputs[4].default_value == 1.0:
        print("Metallic Found For " + anyMat.name)
        add_emission_node(anyMat.name, 1)
        emTex = anyMat.node_tree.nodes["Emission"].outputs[0]
        link_output_to_slot_named(anyMat, emTex, outputNode, "Surface")
        print("Metallic Linked For " + anyMat.name)
      else:
        print("Not metallic Found For " + anyMat.name)
        add_emission_node(anyMat.name, 0)
        emTex = anyMat.node_tree.nodes["Emission"].outputs[0]
        link_output_to_slot_named(anyMat, emTex, outputNode, "Surface")
        print("Not metallic Linked For " + anyMat.name)

    for eachObject in bpy.data.collections['web'].all_objects:
      eachObject.select_set(True)
    for eachObject in bpy.data.collections['master'].all_objects:
      eachObject.select_set(True)

    new_image_texture(activeMaterialName, metallicName, (1, 1, 1, 1), bpy.data.scenes['Scene'].render.resolution_x)
    print("Baking metallic data now.")
    bpy.ops.object.bake("INVOKE_DEFAULT",type="EMIT",filepath=working_dir + "textures", save_mode='EXTERNAL')
    print("Metallic Bake Done.")
    #bpy.data.images[metallicName].save_render(filepath=bpy.context.scene.render.filepath)

  # temporary fix until threading is figured out
  return {'FINISHED'}

#    for anyMat in bpy.data.materials:
#      bsdf = get_one_node_of_type(anyMat.node_tree.nodes, "BSDF_PRINCIPLED")
#      outputNode = get_one_node_of_type(anyMat.node_tree.nodes, "OUTPUT_MATERIAL")
#      bsdfMatName = anyMat.node_tree.nodes[bsdf.name]
#      link_output_to_slot_named(anyMat, bsdfMatName.outputs[0], outputNode, "Surface")
#      try:
#        anyMat.node_tree.nodes["Emission"]
#        outputNode = get_one_node_of_type(anyMat.node_tree.nodes, "OUTPUT_MATERIAL")
#        bsdfMatName = anyMat.node_tree.nodes[bsdf.name]
#        link_output_to_slot_named(anyMat, bsdfMatName.outputs[0], outputNode, "Surface")
#      except:
#        print("There's no emission node to unlink")
#      #bpy.data.images[metallicName].save_render(filepath=bpy.context.scene.render.filepath)
#      print(metallicName + " has been saved.")
#  return {'FINISHED'}

def bake_selected_normal():
  xrs.render.set_bake_render(bpy.data.scenes['Scene'].render.resolution_x)
  xrs.render.disable_direct_indirect_for_bake()
  regNormColor = (0.389, 0.441, 0.80, 1)
  normalName = bpy.context.active_object.name + "_4k_normal"
  xrs.material.make_material()
  activeMaterialName = bpy.context.active_object.active_material.name
  nodes = bpy.data.materials[activeMaterialName].node_tree.nodes
#  bsdf = get_one_node_of_type(nodes, "BSDF_PRINCIPLED")
#  if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
#    currentColor = bpy.data.materials[activeMaterialName].node_tree.nodes[bsdf.name].inputs[19].default_value
  working_dir = xrs.filename.get_parent_dir()
  bpy.data.scenes['Scene'].render.filepath = working_dir + "textures/" + normalName + ".png"
  print("File path set")
  if len(bpy.context.selected_objects) == 1:
    for allObj in bpy.data.objects:
      allObj.hide_render = False
    bpy.context.scene.render.bake.use_selected_to_active = False
    print("There is 1 object selected.")
#    if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
#      if check_node_link(activeMaterialName, bsdf.name, "Normal") == False:
#        new_image_texture(activeMaterialName, normalName, regNormColor)
        #bpy.data.materials[activeMaterialName].node_tree.nodes["Image Texture"].location = (-500, 200)
#        bsdf = bpy.data.materials[activeMaterialName].node_tree.nodes[bsdf.name]
#        imgTex = bpy.data.materials[activeMaterialName].node_tree.nodes[normalName].outputs[0]
#        link_output_to_slot_named(bpy.data.materials[activeMaterialName], imgTex, bsdf, "Normal")
        #bpy.data.images[normalName].save_render(filepath=bpy.context.scene.render.filepath)
#        print(normalName + " has been saved.")
#    else:
    print("There is a normal connection to " + bpy.context.active_object.name +".")
    print("Baking normal data now.")
    # new_image_texture(activeMaterialName, normalName, regNormColor)
    new_image_texture(activeMaterialName, normalName, resolution = bpy.data.scenes['Scene'].render.resolution_x)
    bpy.ops.object.bake("INVOKE_DEFAULT",type="NORMAL",filepath=working_dir + "textures", save_mode='EXTERNAL')
    print("Normal Bake Done.")
      #bpy.data.images[normalName].save_render(filepath=bpy.context.scene.render.filepath)
    print(normalName + " has been saved.")
    return {'FINISHED'}
  else:
    print("There is more than 1 object selected.")
    for allObj in bpy.data.objects:
      allObj.hide_render = False
    bpy.context.scene.render.bake.use_selected_to_active = True
    for eachObject in bpy.data.collections['web'].all_objects:
      eachObject.select_set(True)
    for eachObject in bpy.data.collections['master'].all_objects:
      eachObject.select_set(True)
    print("Baking normal data now.")
    new_image_texture(activeMaterialName, normalName, regNormColor, resolution = bpy.data.scenes['Scene'].render.resolution_x)
    bpy.ops.object.bake("INVOKE_DEFAULT",type="NORMAL",filepath=working_dir + "textures", save_mode='EXTERNAL')
    print("Normal Bake Done.")
    #bpy.data.images[normalName].save_render(filepath=bpy.context.scene.render.filepath)
    print(normalName + " has been saved.")
  return {'FINISHED'}

def bake_selected_opacity():
  """ Create a new image texture and bake opacity to it """
  # Note, copied from bake_selected_diffuse and could use some additional refactoring
  xrs.render.set_bake_render(bpy.data.scenes['Scene'].render.resolution_x)
  xrs.render.disable_direct_indirect_for_bake()
  textureName = bpy.context.active_object.name + "_4k_opacity"
  make_material() # ensures that the object has a material name based on the product
  activeMaterialName = bpy.context.active_object.active_material.name
  node_tree = bpy.data.materials[activeMaterialName].node_tree
  nodes = node_tree.nodes

  # Swap to an emit output and link in to the material alpha
  output_node = xrs.material.get_one_node_of_type(nodes, "OUTPUT_MATERIAL")
  bsdf_node = xrs.material.get_one_node_of_type(nodes, "BSDF_PRINCIPLED")
  emit_node = nodes.new("ShaderNodeEmission")
  node_tree.links.new(emit_node.outputs[0], output_node.inputs[0])
  alpha_output = None
  # find the input link for the BSDF alpha
  for link in node_tree.links:
    if link.to_node == bsdf_node and link.to_socket.name == 'Alpha':
      alpha_output = link.from_socket
  if alpha_output:
    node_tree.links.new(alpha_output, emit_node.inputs[0])

  working_dir = xrs.filename.get_parent_dir()

  bpy.data.scenes['Scene'].render.filepath = working_dir + "textures/" + textureName + ".png"

  if len(bpy.context.selected_objects) == 1:
    for allObj in bpy.data.objects:
      allObj.hide_render = False
    bpy.context.scene.render.bake.use_selected_to_active = False
    new_image_texture(activeMaterialName, textureName, resolution = bpy.data.scenes['Scene'].render.resolution_x)
    bpy.ops.object.bake("INVOKE_DEFAULT",type="EMIT",filepath=working_dir + "textures", save_mode='EXTERNAL')
  else:
    xrs.log.info("Baking selected to active.")
    for allObj in bpy.data.objects:
      allObj.hide_render = False
    bpy.context.scene.render.bake.use_selected_to_active = True
    for eachObject in bpy.data.collections['master'].all_objects:
      eachObject.select_set(True)
    for eachObject in bpy.data.collections['web'].all_objects:
      eachObject.select_set(True)
    new_image_texture(activeMaterialName, textureName, resolution = bpy.data.scenes['Scene'].render.resolution_x)
    bpy.ops.object.bake("INVOKE_DEFAULT",type="EMIT",filepath=working_dir + "textures", save_mode='EXTERNAL')

  # restore the nodes (remove emit, relink nodes)
  node_tree.nodes.remove(emit_node)
  node_tree.links.new(bsdf_node.outputs[0], output_node.inputs[0])

  xrs.log.info(textureName + " has been generated.")
  return {'FINISHED'}

def bake_selected_roughness():
  xrs.render.set_bake_render(bpy.data.scenes['Scene'].render.resolution_x)
  roughnessName = bpy.context.active_object.name + "_4k_roughness"
  xrs.material.make_material()
  activeMaterialName = bpy.context.active_object.active_material.name
  nodes = bpy.data.materials[activeMaterialName].node_tree.nodes
  bsdf = xrs.material.get_one_node_of_type(nodes, "BSDF_PRINCIPLED")
#  if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
#    currentColor = bpy.data.materials[activeMaterialName].node_tree.nodes[bsdf.name].inputs[7].default_value
  working_dir = xrs.filename.get_parent_dir()
  bpy.data.scenes['Scene'].render.filepath = working_dir + "textures/" + roughnessName + ".png"
  print("File path set")
  if len(bpy.context.selected_objects) == 1:
    for allObj in bpy.data.objects:
      allObj.hide_render = False
    bpy.context.scene.render.bake.use_selected_to_active = False
    print("There is 1 object selected.")
    xrs.material.new_image_texture_float(activeMaterialName, roughnessName, resolution = bpy.data.scenes['Scene'].render.resolution_x)
    #xrs.material.link_output_to_slot_named(bpy.data.materials[activeMaterialName], nodes[roughnessName].outputs[0], bsdf, "Roughness")
    #nodes[roughnessName].location = (-330, 80)
#    if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
#      if check_node_link(activeMaterialName, bsdf.name, "Roughness") == False:
#        new_image_texture_float(activeMaterialName, roughnessName, currentColor)
#        bpy.data.materials[activeMaterialName].node_tree.nodes[roughnessName].location = (-500, -300)
#        bsdf = bpy.data.materials[activeMaterialName].node_tree.nodes[bsdf.name]
#        imgTex = bpy.data.materials[activeMaterialName].node_tree.nodes[roughnessName].outputs[0]
#        link_output_to_slot_named(bpy.data.materials[activeMaterialName], imgTex, bsdf, "Roughness")
        #bpy.data.images[roughnessName].save_render(filepath=bpy.context.scene.render.filepath)
#        print(roughnessName + " has been saved.")
#    else:
#      print("There is a roughness connection to " + bpy.context.active_object.name +".")
#      print("Baking roughness data now.")
#      if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
#        new_image_texture_float(activeMaterialName, diffuseName, currentColor)
#      else:
#        new_image_texture_float(activeMaterialName, diffuseName, 0)
    bpy.ops.object.bake("INVOKE_DEFAULT",type="ROUGHNESS",filepath=working_dir + "textures", width=4096, height=4096, save_mode='EXTERNAL')
    print("Roughness Bake Done.")
      #bpy.data.images[roughnessName].save_render(filepath=bpy.context.scene.render.filepath)
    print(roughnessName + " has been saved.")
    return {'FINISHED'}
  else:
    print("There is more than 1 object selected.")
    for allObj in bpy.data.objects:
      allObj.hide_render = False
    bpy.context.scene.render.bake.use_selected_to_active = True
    for eachObject in bpy.data.collections['master'].all_objects:
      eachObject.select_set(True)
    for eachObject in bpy.data.collections['web'].all_objects:
      eachObject.select_set(True)
    print("Baking roughness data now.")
    new_image_texture_float(activeMaterialName, roughnessName, resolution = bpy.data.scenes['Scene'].render.resolution_x)
#    if get_one_node_of_type(bpy.data.materials[bpy.context.active_object.active_material.name].node_tree.nodes, "BSDF_PRINCIPLED") != None:
#      new_image_texture_float(activeMaterialName, roughnessName, currentColor)
#    else:
#      new_image_texture_float(activeMaterialName, roughnessName, 0)
    bpy.ops.object.bake("INVOKE_DEFAULT",type="ROUGHNESS",filepath=working_dir + "textures", width=4096, height=4096, save_mode='EXTERNAL')
    print("Roughness Bake Done.")
    #bpy.data.images[roughnessName].save_render(filepath=bpy.context.scene.render.filepath)
    print(roughnessName + " has been saved.")
  return {'FINISHED'}

def check_if_bsdf():
  for allMat in bpy.data.materials:
    if get_one_node_of_type(allMat.node_tree.nodes, "BSDF_PRINCIPLED") == None:
      return False
  return True

def clean_material_slots(obj):
  for slot in obj.material_slots:
    if slot.material == None:
      xrs.object.select(obj)
      bpy.ops.object.material_slot_remove_unused()

def check_node_link(matName, nodeName, inputType):
    return(bpy.data.materials[matName].node_tree.nodes[nodeName].inputs[inputType].is_linked)

def create_3XR_mat_node(name):
  """ Create a 3XR procedural material group node in the given material shader node tree """
  # Create material group node in material
  bpy.context.scene.use_nodes = True
  mat = bpy.data.materials[name]
  mat_group = mat.node_tree.nodes.new("ShaderNodeGroup")
  mat_group.location = (1300,300)
  mat_group.name = bpy.context.scene.xr_studio.product_name
  mat_group.label = bpy.context.scene.xr_studio.product_name

  # Create general group node with attributes
  mat_nodes = bpy.data.node_groups.new(name, 'ShaderNodeTree')

  mat_nodes.inputs.new("NodeSocketColor", "Overall Color")
  mat_nodes.inputs.new("NodeSocketFloat", "Texture Scale")
  mat_nodes.inputs.new("NodeSocketFloat", "Roughness")
  mat_nodes.inputs.new("NodeSocketFloat", "Metallic")
  mat_nodes.inputs.new("NodeSocketFloat", "Normal")

  mat_nodes.outputs.new("NodeSocketColor", "Color")
  mat_nodes.outputs.new("NodeSocketFloat", "Roughness")
  mat_nodes.outputs.new("NodeSocketFloat", "Metallic")
  mat_nodes.outputs.new("NodeSocketVector", "Normal")

  # Link the attributes to the designated group node in procedural material
  mat_group.node_tree = bpy.data.node_groups[mat_nodes.name]

def draw_normal(matName, imgSize):
  """ Set up workspace to begin drawing normals on model """
  mat=bpy.data.materials[str(matName)]
  bpy.ops.paint.texture_paint_toggle()
  bpy.ops.paint.add_texture_paint_slot(
    type='BUMP',
    name=xrs.filename.get_filename()+"_4k_bump",
    width=imgSize,
    height=imgSize)
  bump = mat.node_tree.nodes['Bump']
  mainBSDF = mat.node_tree.nodes['Principled BSDF']
  xrs.material.link_output_to_slot_named(mat, bump.outputs[0], mainBSDF, 'Normal')

def denoise_img(imgName):
  """ Denoises image based off of image name """
  # Make Image Node & Attach Image
  bpy.context.scene.use_nodes = True
  node_tree = bpy.data.scenes['Scene'].node_tree
  node = node_tree.nodes.new("CompositorNodeImage")
  node.select = True
  node_tree.nodes.active = node
  node.image = bpy.data.images[imgName]
  node.name = imgName
  node.location = (-1000, 350)

  # Add Denoise Node
  denoise_node = node_tree.nodes.new("CompositorNodeDenoise")
  denoise_node.location = (-750, 350)

  #Add Viewer Node
  viewer_node = node_tree.nodes.new("CompositorNodeViewer")
  viewer_node.location = (-500, 350)

  #Link All Nodes, Select Viewer Node First to Load Faster
  xrs.material.link_output_to_slot_named(bpy.data.scenes['Scene'], node.outputs[0], denoise_node, 'Image')
  viewer_node.select = True
  xrs.material.link_output_to_slot_named(bpy.data.scenes['Scene'], denoise_node.outputs[0], viewer_node, 'Image')

  xrs.log.info("Image in Denoiser. Check your Viewer Node in your Image Editor for Results.")

def end_draw_normal(matName, imgSize):
  """ Take what was drawn on the model and bake that to an attached Normal Map """
  mat=bpy.data.materials[str(matName)]
  activeName=bpy.context.active_object.name
  xrs.material.new_image_texture(str(matName), activeName+"_4k_normal", (0, 0, 0, 0), imgSize)
  bpy.data.scenes['Scene'].render.bake.use_selected_to_active = False
  bpy.ops.object.bake(type="NORMAL",filepath=xrs.filename.get_parent_dir() + "textures")


  norm = bpy.data.materials[str(matName)].node_tree.nodes.new(type="ShaderNodeNormalMap")
  norm.name = "3XRNormal"
  normal = mat.node_tree.nodes['3XRNormal']
  mainBSDF = mat.node_tree.nodes['Principled BSDF']
  normTex = mat.node_tree.nodes[activeName+"_4k_normal"]

  xrs.material.link_output_to_slot_named(mat, normTex.outputs[0], normal, 'Color')
  xrs.material.link_output_to_slot_named(mat, normal.outputs[0], mainBSDF, 'Normal')

def get_bsdf_link_count(material, name):
  """ Find the first bsdf node and get the number of links for the input with the given name """
  bsdf = get_one_node_of_type(material.node_tree.nodes, "BSDF_PRINCIPLED")
  if bsdf:
    return get_node_link_count_named(bsdf, name)
  return 0

def get_bsdf_value(material, name):
  """ Find the first bsdf node and get the value of the given name """
  bsdf = get_one_node_of_type(material.node_tree.nodes, "BSDF_PRINCIPLED")
  if bsdf:
    return get_node_default_value_named(bsdf, name)
  return 0

def get_node_default_value_named(node, name):
  """ Find the matching input based on name and return the value """
  for input in node.inputs:
    if input.name == name:
      return input.default_value
  xrs.log.warn(name + " node not found in " + node.name)
  return 0

def get_node_link_count_named(node, name):
  """ Find the matching input based on name and return the number of links """
  for input in node.inputs:
    if input.name == name:
      return len(input.links)
  xrs.log.warn(name + " node not found in " + node.name)
  return 0

def get_first_from_node_link_named(node, name):
  """ Get the input node for the given name on the given node """
  for input in node.inputs:
    if input.name == name:
      return input.links[0].from_node
  xrs.log.warn(name + " node not found in " + node.name)
  return None

def get_one_node_of_type(nodes, type):
  """ Search the material node tree for the first node matching the type """
  for node in nodes:
    if node.type == type:
      return node
  xrs.log.debug("Can not find " + str(type) + " in " + node.name)
  return None

def is_8_bit():
  """ Checks if any image in the web collection is an 8 bit texture """
  for img in bpy.data.images:
    if img.depth > 32:
      split = img.name.split("_4k_")
      if split[0] == xrs.filename.get_filename():
        print(img.name + " needs to be an 8 bit texture.")
        return False
      else:
        return True

def is_image():
  for img in bpy.data.images:
    if str(img.name).startswith(xrs.filename.get_filename()) == True:
      if img.source != 'FILE':
        return False

def link_output_to_slot_named(mat, output, node, name):
  valid = True
  try:
    for input in node.inputs:
      if input.name == name:
        mat.node_tree.links.new(output, input)
  except:
    xrs.log.warn("Link to nodes was unable to be made")
    valid = False
  return valid

def make_material_for_mesh(mesh):
  """ Add a material to the mesh with the same name as the mesh, if it doesn't exist and assign to first slot """
  mesh_has_target_material = False
  for mat in mesh.materials:
    if mat.name == mesh.name:
      mesh_has_target_material = True
  if mesh_has_target_material:
    xrs.log.warn('The mesh already has a material named ' + mesh.name)
  else:
    # Mesh does not have a material with its name
    if mesh.name not in bpy.data.materials:
      # material does not exist, create it
      xrs.log.info('Creating a new material named ' + mesh.name)
      mat = bpy.data.materials.new(name=mesh.name)
      mat.use_nodes=True
    if len(mesh.materials) == 0:
      mesh.materials.append(bpy.data.materials[mesh.name])
    else:
      # Assign it to the first slot
      mesh.materials[0] = bpy.data.materials[mesh.name]

def make_material():
  """ Add a material with the name of the mesh for all meshes """
  # TODO: this should be renamed to be clear it impacts all meshes
  for mesh in bpy.data.meshes:
    make_material_for_mesh(mesh)
  # TODO: remove commented code once the new function has been tested
  # if len(mesh.materials) == 0:
  #   if mesh.name in bpy.data.materials:
  #     mat = bpy.data.materials[mesh.name]
  #   else:
  #     mat = bpy.data.materials.new(name=mesh.name)
  #     mat.use_nodes=True
  #   mesh.materials.append(mat)
  # else:
  #   i = 0
  #   for m in mesh.materials:
  #     if m == None:
  #       if mesh.name in bpy.data.materials:
  #         mat = bpy.data.materials[mesh.name]
  #       else:
  #         mat = bpy.data.materials.new(name=mesh.name)
  #         mat.use_nodes=True
  #       mesh.materials[i] = mat
  #     i = i+1
  # NOTE: It looks like there may be a bug here in that all empty material slots will be assigned and if there are no empty slots, nothing will be assigned

def make_opaque():
  """ Forces all material blend modes to be opaque for Blender file """
  for mat in bpy.data.materials:
    mat.blend_method = 'OPAQUE'
    mat.use_backface_culling = True

def new_image_texture(material_name, image_texture_name, color_array = (0, 0, 0, 0), resolution = 4096):
  # TODO: this can be combined with the _float version using a named variable
  if image_texture_name not in bpy.data.materials[material_name].node_tree.nodes:
    node_tree = bpy.data.materials[str(material_name)].node_tree
    node = node_tree.nodes.new("ShaderNodeTexImage")
    node.select = True
    node_tree.nodes.active = node
    bpy.ops.image.new(
        name = image_texture_name,
        width = resolution,
        height = resolution,
        color = (color_array),
        alpha = True
    )
    node.image = bpy.data.images[image_texture_name]
    node.name = image_texture_name
  else:
    bpy.data.materials[material_name].node_tree.nodes[image_texture_name].select = True

def new_image_texture_float(material_name, image_texture_name, color_float = 0.0, resolution = 4096):
  if image_texture_name not in bpy.data.materials[material_name].node_tree.nodes:
    node_tree = bpy.data.materials[str(material_name)].node_tree
    node = node_tree.nodes.new("ShaderNodeTexImage")
    node.select = True
    node_tree.nodes.active = node
    bpy.ops.image.new(
        name = image_texture_name,
        width = resolution,
        height = resolution,
        color = (color_float, color_float, color_float, 1),
        alpha = True
    )
    node.image = bpy.data.images[image_texture_name]
    node.name = image_texture_name
  else:
    bpy.data.materials[material_name].node_tree.nodes[image_texture_name].select = True

def procedural_nodes_link_check():
  """ Checks if the procedural material nodes are linked corrctly """
  valid = True

  # Check for valid product name in .blend file
  try:
    name = bpy.context.scene.xr_studio.product_name
  except:
    xrs.log.error("Unable to find the product name in the .blend file")
    valid = False

  nodes = bpy.data.materials[name].node_tree.nodes

  # Check that BSDF and Material Output are linked
  if xrs.material.link_output_to_slot_named(bpy.data.materials[name],
                                            nodes['Principled BSDF'].outputs[0],
                                            nodes['Material Output'],
                                            "Surface"):
    xrs.validation_report.write_ok("BSDF and Material Output are connected")
  else:
    xrs.validation_report.write_error("BSDF and Material Output are not connected")
    valid = False

  # Check if group node and BSDF are linked
  if xrs.material.link_output_to_slot_named(bpy.data.materials[name],
                                            nodes[name].outputs[0],
                                            nodes['Principled BSDF'],
                                            "Base Color"):
    xrs.validation_report.write_ok("Custom Group node and BSDF and are connected")
  else:
    xrs.validation_report.write_error("Custom Group node and BSDF are not connected")
    valid = False

  # TODO: Add checks for Roughness, Metallic, and Normal outputs on the custom gropu node

  return valid

def procedural_nodes_name_check():
  """ Checks if the procedural material nodes are named correctly """
  valid = True

  # Check for valid product name in .blend file
  try:
    name = bpy.context.scene.xr_studio.product_name
  except:
    xrs.log.error("Unable to find the product name in the .blend file")

  # Check if the name of the material matches the material name from the website
  try:
    bpy.data.materials[name]
    xrs.validation_report.write_ok("The " + name + " material was found in the .blend file")
  except:
    xrs.validation_report.write_error("The " + name + " material was not found in the .blend file. Make sure this material is named correctly.")
    valid = False
    return valid

  # Check if the custom group node name matches the material name from the website
  nodes = bpy.data.materials[name].node_tree.nodes
  try:
    nodes[name]
    xrs.validation_report.write_ok("The " + name + " node was found in the .blend file")
  except:
    xrs.validation_report.write_error("The " + name + " node was not found in the .blend file. Make sure this custom group node name is named correctly.")
    valid = False
    return valid

  # Check if node group name matches the material name from the website
  try:
    bpy.data.node_groups[name]
  except:
    xrs.validation_report.write_error("The " + name + " node group was not found in the .blend file. Make sure this is named correctly inside the custom group node.")
    valid = False
    return valid

  # Check if the custom group node has the correct minimum inputs
  if nodes[name].inputs[0].name != "Overall Color":
    xrs.validation_report.write_error("The " + name + " node should have 'Overall Color' as its 1st input name")
    valid = False
  if nodes[name].inputs[0].type != "RGBA":
    xrs.validation_report.write_error("The " + name + " node should have 'Overall Color' as a 'RGBA' input type")
    valid = False
  if nodes[name].inputs[1].name != "Texture Scale":
    xrs.validation_report.write_error("The " + name + " node should have 'Texture Scale' as its 2nd input name")
    valid = False
  if nodes[name].inputs[1].type != "VALUE":
    xrs.validation_report.write_error("The " + name + " node should have 'Texture Scale' as a 'VALUE' input type")
    valid = False
  if nodes[name].inputs[2].name != "Roughness":
    xrs.validation_report.write_error("The " + name + " node should have 'Roughness' as its 3rd input name")
    valid = False
  if nodes[name].inputs[2].type != "VALUE":
    xrs.validation_report.write_error("The " + name + " node should have 'Roughness' as a 'VALUE' input type")
    valid = False
  if nodes[name].inputs[3].name != "Metallic":
    xrs.validation_report.write_error("The " + name + " node should have 'Metallic' as its 4th input name")
    valid = False
  if nodes[name].inputs[3].type != "VALUE":
    xrs.validation_report.write_error("The " + name + " node should have 'Metallic' as a 'VALUE' input type")
    valid = False
  if nodes[name].inputs[4].name != "Normal":
    xrs.validation_report.write_error("The " + name + " node should have 'Normal' as its 5th input name")
    valid = False
  if nodes[name].inputs[4].type != "VALUE":
    xrs.validation_report.write_error("The " + name + " node should have 'Normal' as a 'VALUE' input type")
    valid = False

  # Check if the custom group node has the correct minimum outputs
  if nodes[name].outputs[0].name != "Color":
    xrs.validation_report.write_error("The " + name + " node should have 'Color' as its 1st output name")
    valid = False
  if nodes[name].outputs[0].type != "RGBA":
    xrs.validation_report.write_error("The " + name + " node should have 'Color' as a 'RGBA' output type")
    valid = False
  if nodes[name].outputs[1].name != "Roughness":
    xrs.validation_report.write_error("The " + name + " node should have 'Roughness' as its 2nd output name")
    valid = False
  if nodes[name].outputs[1].type != "VALUE":
    xrs.validation_report.write_error("The " + name + " node should have 'Roughness' as a 'VALUE' output type")
    valid = False
  if nodes[name].outputs[2].name != "Metallic":
    xrs.validation_report.write_error("The " + name + " node should have 'Metallic' as its 3rd output name")
  if nodes[name].outputs[2].type != "VALUE":
    xrs.validation_report.write_error("The " + name + " node should have 'Metallic' as a 'VALUE' output type")
    valid = False
  if nodes[name].outputs[3].name != "Normal":
    xrs.validation_report.write_error("The " + name + " node should have 'Normal' as its 4th output name")
    valid = False
  if nodes[name].outputs[3].type != "VECTOR":
    xrs.validation_report.write_error("The " + name + " node should have 'Normal' as a 'VECTOR' output type")
    valid = False

  return valid

def build_for_amazon(mat, textures_dir, amazon_dir):
  """ Create a clean Principled BSDF material node with 4k textures (TODO: where does the ai file link go? """
  xrs.log.info("Rebuilding Material named " + mat.name + " for Amazon")
  # TODO: refactor and combine this with rebuild_from_textures
  mat.use_nodes = True

  # Default Values
  alpha_value = 1.0 # opaque
  # TODO: allow some color values here too (diffuse_value)
  metallic_value = 0.0 # non-metal
  roughness_value = 0.9 # very rough

  # User set values in place of the defaults, if available
  bsdf = get_one_node_of_type(mat.node_tree.nodes, "BSDF_PRINCIPLED")
  if bsdf:
    alpha_value = get_node_default_value_named(bsdf, "Alpha")
    metallic_value = get_node_default_value_named(bsdf, "Metallic")
    roughness_value = get_node_default_value_named(bsdf, "Roughness")
    xrs.log.verbose("Principled BSDF has alpha: " + str(alpha_value) + ", metallic: " + str(metallic_value) +", roughness: " + str(roughness_value))

  # value used above all, if available
  if (os.path.isfile(textures_dir + mat.name + "_alpha.value")):
    alpha_value = float(Path(textures_dir + mat.name + "_alpha.value").read_text()) / 100
    xrs.log.verbose("Alpha loaded from file " + str(alpha_value))
  if (os.path.isfile(textures_dir + mat.name + "_metallic.value")):
    metallic_value = float(Path(textures_dir + mat.name + "_metallic.value").read_text()) / 100
    xrs.log.verbose("Metallic loaded from file " + str(metallic_value))
  if (os.path.isfile(textures_dir + mat.name + "_roughness.value")):
    roughness_value = float(Path(textures_dir + mat.name + "_roughness.value").read_text()) / 100
    xrs.log.verbose("Roughness loaded from file " + str(roughness_value))

  # Remove all nodes (except output and P. BSDF) to get a clean start
  nodes = mat.node_tree.nodes
  for node in nodes:
    if node.type != "OUTPUT_MATERIAL" and node.type != "BSDF_PRINCIPLED":
      # Remove node
      xrs.log.verbose("Removing material node named " + node.name)
      mat.node_tree.nodes.remove(node)

  # Add shader and output nodes, if missing
  output_node = get_one_node_of_type(mat.node_tree.nodes, "OUTPUT_MATERIAL")
  if output_node == None:
    output_node = nodes.new("ShaderNodeOutputMaterial")

  bsdf_node = get_one_node_of_type(mat.node_tree.nodes, "BSDF_PRINCIPLED")
  if bsdf_node == None:
    bsdf_node = nodes.new("ShaderNodeBsdfPrincipled")
    new_node.name = "Principled BSDF"

  # Reposition and Link Nodes
  x_start = 0
  y_start = 0
  output_node.location = (x_start + 900, y_start + 625)
  bsdf_node.location = (x_start + 600, y_start + 600)
  mat.node_tree.links.new(
    bsdf_node.outputs[0],
    output_node.inputs[0]
  )

  # Set Values
  set_node_default_value_named(bsdf_node, "Alpha", alpha_value)
  set_node_default_value_named(bsdf_node, "Metallic", metallic_value)
  set_node_default_value_named(bsdf_node, "Roughness", roughness_value)

  # Enable Transparency
  # TODO: restructure this code, merge with other texture rebuilding
  transparent_texture = False
  if (mat.name.endswith('_clear')):
    xrs.log.verbose(mat.name + " is transparent")
    transparent_texture = True
  if (transparent_texture or alpha_value < 1.0):
    xrs.log.verbose("Applying BLEND Method for transparency")
    mat.blend_method = 'BLEND'
    mat.show_transparent_back = True
    mat.use_backface_culling = True # Helps remove artifacts
  else:
    xrs.log.verbose("Applying OPAQUE Method")
    mat.blend_method = 'OPAQUE'
    mat.use_backface_culling = True # Needed to address Android bug

  # Add Image Texture Nodes based on files available
  diffuse_path = amazon_dir + mat.name + "_diff.png"

  if (os.path.isfile(diffuse_path)):
    diffuse_image = bpy.data.images.load(diffuse_path, check_existing=True)
    diffuse_node = nodes.new("ShaderNodeTexImage")
    diffuse_node.name = "Diffuse Texture"
    diffuse_node.location = (x_start + 0, y_start + 800)
    diffuse_node.width = 400
    diffuse_node.image = diffuse_image
    link_output_to_slot_named(mat, diffuse_node.outputs[0], bsdf_node, "Base Color")
    if (transparent_texture):
      link_output_to_slot_named(mat, diffuse_node.outputs[1], bsdf_node, "Alpha")
  else:
    xrs.log.warn("Diffuse png not found at " + diffuse_path);

  # Amazon spec does not say how to link the ambient oculusion (ai) file, so skip it

  metal_path = amazon_dir + mat.name + "_metal.png"
  if (os.path.isfile(metal_path)):
    metal_image = bpy.data.images.load(metal_path, check_existing=True)
    metal_node = nodes.new("ShaderNodeTexImage")
    metal_node.location = (x_start + 0, y_start + 500)
    metal_node.width = 400
    metal_node.image = metal_image
    metal_node.image.colorspace_settings.name = 'Non-Color'
    link_output_to_slot_named(mat, metal_node.outputs[0], bsdf_node, "Metallic")
  else:
    xrs.log.warn("metal png not found at " + metal_path);

  rough_path = amazon_dir + mat.name + "_rough.png"
  if (os.path.isfile(rough_path)):
    rough_image = bpy.data.images.load(rough_path, check_existing=True)
    rough_node = nodes.new("ShaderNodeTexImage")
    rough_node.location = (x_start + 0, y_start + 200)
    rough_node.width = 400
    rough_node.image = rough_image
    rough_node.image.colorspace_settings.name = 'Non-Color'
    link_output_to_slot_named(mat, rough_node.outputs[0], bsdf_node, "Roughness")
  else:
    xrs.log.warn("rough png not found at " + rough_path);

  normal_path = amazon_dir + mat.name + "_normal.png"
  if (os.path.isfile(normal_path)):
    normal_image = bpy.data.images.load(normal_path, check_existing=True)
    normal_node = nodes.new("ShaderNodeTexImage")
    normal_node.location = (x_start + 0, y_start + -100)
    normal_node.width = 400
    normal_node.image = normal_image
    normal_node.image.colorspace_settings.name = 'Non-Color'
    link_output_to_slot_named(mat, normal_node.outputs[0], bsdf_node, "Normal")
  else:
    xrs.log.warn("Normal png not found at " + normal_path);

  # emission
  emissive_path = amazon_dir + mat.name + "_emissive.png"
  if (os.path.isfile(emissive_path)):
    emissive_image = bpy.data.images.load(emissive_path, check_existing=True)
    emissive_node = nodes.new("ShaderNodeTexImage")
    emissive_node.location = (x_start + 0, y_start + -500)
    emissive_node.width = 400
    emissive_node.image = emissive_image
    link_output_to_slot_named(mat, emissive_node.outputs[0], bsdf_node, "Emission")
  else:
    xrs.log.warn("Emissive png not found at " + emissive_path);

def rebuild_from_textures(
    mat,
    textures_dir,
    use_orm = True,
    png_diffuse = False,
    alpha_clip = False,
    diffuse_name = "_2k_diffuse",
    normal_name = "_1k_normal",
    alpha_name = '_2k_opacity',
    orm_name = "_1k_orm",
    ao_name = '_1k_ao',
    roughness_name = '_1k_roughness',
    metallic_name = '_1k_metallic',
    emissive_name = '_1k_emissive',
    use_pngs = False,
    use_alpha = False,
    transparent_texture = False
  ):
  """ Create a clean Principled BSDF material node with individual channels """
  xrs.log.info("Rebuilding Material named " + mat.name + " in " + textures_dir)
  mat.use_nodes = True

  # Look for a suffix of _clear or _clip in the material name to set transparency
  texture_name = mat.name
  if (texture_name.endswith("_clear")):
    texture_name = texture_name[:-6]
    transparent_texture = True
    png_diffuse = True
  if (texture_name.endswith("_clip")):
    texture_name = texture_name[:-5]
    transparent_texture = True
    png_diffuse = True
    alpha_clip = True

  # Default Values
  alpha_value = 1.0 # opaque
  # TODO: allow some color values here too (diffuse_value)
  metallic_value = 0.0 # non-metal
  roughness_value = 0.9 # very rough

  # User set values in place of the defaults, if available
  bsdf = get_one_node_of_type(mat.node_tree.nodes, "BSDF_PRINCIPLED")
  if bsdf:
    alpha_value = get_node_default_value_named(bsdf, "Alpha")
    metallic_value = get_node_default_value_named(bsdf, "Metallic")
    roughness_value = get_node_default_value_named(bsdf, "Roughness")
    xrs.log.verbose("Principled BSDF has alpha: " + str(alpha_value) + ", metallic: " + str(metallic_value) +", roughness: " + str(roughness_value))

  # value used above all, if available
  if (os.path.isfile(textures_dir + texture_name + "_alpha.value")):
    alpha_value = float(Path(textures_dir + texture_name + "_alpha.value").read_text()) / 100
    xrs.log.verbose("Alpha loaded from file " + str(alpha_value))
  if (os.path.isfile(textures_dir + texture_name + "_metallic.value")):
    metallic_value = float(Path(textures_dir + texture_name + "_metallic.value").read_text()) / 100
    xrs.log.verbose("Metallic loaded from file " + str(metallic_value))
  if (os.path.isfile(textures_dir + texture_name + "_roughness.value")):
    roughness_value = float(Path(textures_dir + texture_name + "_roughness.value").read_text()) / 100
    xrs.log.verbose("Roughness loaded from file " + str(roughness_value))

  # Remove all nodes (except output and P. BSDF) to get a clean start
  nodes = mat.node_tree.nodes
  for node in nodes:
    if node.type != "OUTPUT_MATERIAL" and node.type != "BSDF_PRINCIPLED":
      # Remove node
      xrs.log.verbose("Removing material node named " + node.name)
      mat.node_tree.nodes.remove(node)

  # Add shader and output nodes, if missing
  output_node = get_one_node_of_type(mat.node_tree.nodes, "OUTPUT_MATERIAL")
  if output_node == None:
    output_node = nodes.new("ShaderNodeOutputMaterial")

  bsdf_node = get_one_node_of_type(mat.node_tree.nodes, "BSDF_PRINCIPLED")
  if bsdf_node == None:
    bsdf_node = nodes.new("ShaderNodeBsdfPrincipled")
    new_node.name = "Principled BSDF"

  # Reposition and Link Nodes
  x_start = 0
  y_start = 0
  output_node.location = (x_start + 900, y_start + 625)
  bsdf_node.location = (x_start + 600, y_start + 600)
  mat.node_tree.links.new(
    bsdf_node.outputs[0],
    output_node.inputs[0]
  )

  # Set Values
  set_node_default_value_named(bsdf_node, "Alpha", alpha_value)
  set_node_default_value_named(bsdf_node, "Metallic", metallic_value)
  set_node_default_value_named(bsdf_node, "Roughness", roughness_value)

  # Enable Transparency
  if (transparent_texture or alpha_value < 1.0):
    xrs.log.verbose(texture_name + " is transparent")
    xrs.log.verbose("Applying BLEND Method for transparency")
    mat.blend_method = 'BLEND'
    mat.show_transparent_back = True
    mat.use_backface_culling = True # Helps remove artifacts
    if alpha_clip == True:
      xrs.log.verbose("Applying CLIP Method")
      mat.blend_method = 'CLIP'
      mat.blend_method = 'CLIP'
      mat.alpha_threshold = 0.9
  else:
    xrs.log.verbose("Applying OPAQUE Method - no transparent texture or < 1 alpha")
    mat.blend_method = 'OPAQUE'
    mat.use_backface_culling = True # Helps remove artifacts

  # Add Image Texture Nodes based on files available
  # Diffuse (png needed when using transparency)
  if (png_diffuse):
    diffuse_path = textures_dir + texture_name + diffuse_name + ".png"
  else:
    diffuse_path = textures_dir + texture_name + diffuse_name + ".jpg"

  if (os.path.isfile(diffuse_path)):
    diffuse_image = bpy.data.images.load(diffuse_path, check_existing=True)
    diffuse_node = nodes.new("ShaderNodeTexImage")
    diffuse_node.name = "Diffuse Texture"
    diffuse_node.location = (x_start + 0, y_start + 1000)
    diffuse_node.width = 400
    diffuse_node.image = diffuse_image
    link_output_to_slot_named(mat, diffuse_node.outputs[0], bsdf_node, "Base Color")
    if (transparent_texture):
      link_output_to_slot_named(mat, diffuse_node.outputs[1], bsdf_node, "Alpha")
  else:
    xrs.log.warn("Diffuse Image Texture not found at " + diffuse_path);

  # IF use_alpha, there is a separate alpha texture that should be linked
  if (use_alpha):
    if use_pngs:
      alpha_path = textures_dir + texture_name + alpha_name + ".png"
    else:
      alpha_path = textures_dir + texture_name + alpha_name + ".jpg"
    if (os.path.isfile(alpha_path)):
      alpha_image = bpy.data.images.load(alpha_path, check_existing=True)
      alpha_node = nodes.new("ShaderNodeTexImage")
      alpha_node.name = "Alpha Texture"
      alpha_node.location = (x_start + 0, y_start + 100)
      alpha_node.width = 400
      alpha_node.image = alpha_image
      link_output_to_slot_named(mat, alpha_node.outputs[0], bsdf_node, "Alpha")
    else:
      xrs.log.warn("Alpha Image Texture not found at " + alpha_path);

  # For AO, we need to create a custom group (glTF Settings)
  if "glTF Settings" not in bpy.data.node_groups:
    group = bpy.data.node_groups.new(type="ShaderNodeTree", name="glTF Settings")
    group.inputs.new("NodeSocketColor", "Occlusion")
  gltf_settings_node = nodes.new("ShaderNodeGroup")
  gltf_settings_node.node_tree = bpy.data.node_groups["glTF Settings"]
  gltf_settings_node.location = (x_start + 600, y_start + 700)

  if (use_orm):
    orm_path = textures_dir + texture_name + orm_name + ".png"
    if (os.path.isfile(orm_path)):
      orm_image = bpy.data.images.load(orm_path, check_existing=True)
      orm_node = nodes.new("ShaderNodeTexImage")
      orm_node.location = (x_start + 0, y_start + 700)
      orm_node.width = 400
      orm_node.image = orm_image
      orm_node.image.colorspace_settings.name = 'Non-Color'
      rgb_split = nodes.new("ShaderNodeSeparateRGB")
      rgb_split.location = (x_start + 420, y_start + 400)
      link_output_to_slot_named(mat, orm_node.outputs[0], rgb_split, "Image")
      link_output_to_slot_named(mat, rgb_split.outputs[0], gltf_settings_node, "Occlusion")
      link_output_to_slot_named(mat, rgb_split.outputs[1], bsdf_node, "Roughness")
      link_output_to_slot_named(mat, rgb_split.outputs[2], bsdf_node, "Metallic")
    else:
      xrs.log.warn("ORM Image Texture not found at " + orm_path);
  else:
    if use_pngs:
      ao_path = textures_dir + texture_name + ao_name + ".png"
    else:
      ao_path = textures_dir + texture_name + ao_name + ".jpg"
    if (os.path.isfile(ao_path)):
      ao_image = bpy.data.images.load(ao_path, check_existing=True)
      ao_node = nodes.new("ShaderNodeTexImage")
      ao_node.location = (x_start + 0, y_start + 1300)
      ao_node.width = 400
      ao_node.image = ao_image
      ao_node.image.colorspace_settings.name = 'Non-Color'
      link_output_to_slot_named(mat, ao_node.outputs[0], gltf_settings_node, "Occlusion")
    else:
      xrs.log.warn("AO Image Texture not found at " + ao_path);

    if use_pngs:
      metallic_path = textures_dir + texture_name + metallic_name + ".png"
    else:
      metallic_path = textures_dir + texture_name + metallic_name + ".jpg"
    if (os.path.isfile(metallic_path)):
      metallic_image = bpy.data.images.load(metallic_path, check_existing=True)
      metallic_node = nodes.new("ShaderNodeTexImage")
      metallic_node.location = (x_start + 0, y_start + 700)
      metallic_node.width = 400
      metallic_node.image = metallic_image
      metallic_node.image.colorspace_settings.name = 'Non-Color'
      link_output_to_slot_named(mat, metallic_node.outputs[0], bsdf_node, "Metallic")
    else:
      xrs.log.warn("Metallic Image Texture not found at " + metallic_path);

    if use_pngs:
      roughness_path = textures_dir + texture_name + roughness_name + ".png"
    else:
      roughness_path = textures_dir + texture_name + roughness_name + ".jpg"
    if (os.path.isfile(roughness_path)):
      roughness_image = bpy.data.images.load(roughness_path, check_existing=True)
      roughness_node = nodes.new("ShaderNodeTexImage")
      roughness_node.location = (x_start + 0, y_start + 400)
      roughness_node.width = 400
      roughness_node.image = roughness_image
      roughness_node.image.colorspace_settings.name = 'Non-Color'
      link_output_to_slot_named(mat, roughness_node.outputs[0], bsdf_node, "Roughness")
    else:
      xrs.log.warn("Roughness Image Texture not found at " + roughness_path);


  normal_path = textures_dir + texture_name + normal_name + ".png" # use png to avoid artifacts
  if (os.path.isfile(normal_path) is False):
    normal_path = textures_dir + texture_name + normal_name + ".jpg" # fallback to use jpg if png is not available
  if (os.path.isfile(normal_path)):
    normal_image = bpy.data.images.load(normal_path, check_existing=True)
    normal_node = nodes.new("ShaderNodeTexImage")
    normal_node.location = (x_start + 0, y_start + -200)
    normal_node.width = 400
    normal_node.image = normal_image
    normal_node.image.colorspace_settings.name = 'Non-Color'
    normal_map = nodes.new("ShaderNodeNormalMap")
    normal_map.location = (x_start + 420, y_start + -100)
    link_output_to_slot_named(mat, normal_node.outputs[0], normal_map, "Color")
    link_output_to_slot_named(mat, normal_map.outputs[0], bsdf_node, "Normal")
  else:
    xrs.log.warn("Normal Image Texture not found at " + normal_path);

  # emission
  if use_pngs:
    metallic_path = textures_dir + texture_name + metallic_name + ".png"
    emissive_path = textures_dir + texture_name + emissive_name + ".png"
  else:
    metallic_path = textures_dir + texture_name + metallic_name + ".jpg"
    emissive_path = textures_dir + texture_name + emissive_name + ".jpg"
  if (os.path.isfile(emissive_path)):
    emissive_image = bpy.data.images.load(emissive_path, check_existing=True)
    emissive_node = nodes.new("ShaderNodeTexImage")
    emissive_node.location = (x_start + 0, y_start + -400)
    emissive_node.width = 400
    emissive_node.image = emissive_image
    link_output_to_slot_named(mat, emissive_node.outputs[0], bsdf_node, "Emission")
    xrs.log.info("Emissive Image Texture set with " + emissive_path);
  else:
    xrs.log.warn("Emissive Image Texture not found at " + emissive_path);

  # TODO: other maps
  # clearcoat
  # clearcoat_roughness
  # sheen
  # anistropic

def relink_textures(textures_dir):
  """ Restore the image references to look in the given directory """
  xrs.log.debug('relinking textures to ' + textures_dir)
  for i in bpy.data.images:
    xrs.log.debug(i.filepath)
    original_filename = os.path.basename(i.filepath)
    xrs.log.debug(original_filename)
    i.filepath = textures_dir + original_filename
    xrs.log.debug(i.filepath)

def set_bsdf_default(mat, slot_name, value):
  """ Set a default value of a slot on the BSDF node """
  if mat.use_nodes == False:
    xrs.log.error(mat.name + " is not using nodes, unable to set bsdf ")
  else:
    if "Principled BSDF" not in mat.node_tree.nodes:
      xrs.log.error(mat.name + " is missing the Principled BSDF node, unable to set bsdf ")
    else:
      bsdf = mat.node_tree.nodes["Principled BSDF"]
      set_node_default_value_named(bsdf, slot_name, value)

def set_material_default_color_hex(mat, color):
  r, g, b = xrs.convert.hexToRGB(color)
  set_bsdf_default(mat, "Base Color", (r, g, b, 1))

def set_node_default_value_named(node, name, value):
  """ Find the matching input based on name and set the value """
  found = False
  for input in node.inputs:
    if input.name == name:
      input.default_value = value
      found = True
  if found == False:
    xrs.log.warn(name + " node not found in " + node.name)

def single_uv_channel_for_object_named(object_name):
  """ Remove all but a single UV channel from the mesh on the object """
  uv_layers = bpy.data.objects[object_name].data.uv_layers
  while (len(uv_layers) > 1):
    # remove the last one until there is only one left
    uv_layers.remove(uv_layers[len(uv_layers)-1])

def swap_with_1k_textures(mat, textures_dir, png_diffuse = False):
  """ Swap 2k diffuse textures in a file's materials """
  xrs.log.info("Swapping 2k textures with 1k textures in " + mat.name + " in " + textures_dir)
  mat.use_nodes = True
  transparent_texture = False

  # Look for a suffix of _clear in the material name to set transparency
  texture_name = mat.name
  if (texture_name.endswith("_clear")):
    texture_name = texture_name[:-6]
    transparent_texture = True
    png_diffuse = True

  # Remove all 2k diffuse nodes to get a clean diffuse start
  nodes = mat.node_tree.nodes
  for node in nodes:
    if node.name == "Diffuse Texture":
      # Remove node
      xrs.log.verbose("Removing diffuse material node named " + node.name)
      mat.node_tree.nodes.remove(node)

  bsdf_node = get_one_node_of_type(mat.node_tree.nodes, "BSDF_PRINCIPLED")

  # Reposition and Link Nodes
  x_start = 0
  y_start = 0

  # Add Image Texture Nodes based on files available
  diffuse_path = textures_dir + texture_name + "_1k_diffuse.jpg"
  # Diffuse (png needed when using transparency)
  if (png_diffuse):
    diffuse_path = textures_dir + texture_name + "_1k_diffuse.png"

  if (os.path.isfile(diffuse_path)):
    diffuse_image = bpy.data.images.load(diffuse_path, check_existing=True)
    diffuse_node = nodes.new("ShaderNodeTexImage")
    diffuse_node.name = "Diffuse Texture"
    diffuse_node.location = (x_start + 0, y_start + 800)
    diffuse_node.width = 400
    diffuse_node.image = diffuse_image
    link_output_to_slot_named(mat, diffuse_node.outputs[0], bsdf_node, "Base Color")
    if (transparent_texture):
      link_output_to_slot_named(mat, diffuse_node.outputs[1], bsdf_node, "Alpha")
  else:
    xrs.log.warn("Diffuse 1k image not found at " + diffuse_path);

def swap_shared_image_textures(mat, textures_dir):
  """ Swap shared texture set images with non shared image textures """ # Used to solve loading errors in simple viewers
  path = xrs.filename.get_dir()
  for mat in bpy.data.materials:
    name = mat.name
    if name.endswith("_clear"):
      for node in mat.node_tree.nodes:
        if node.type == 'TEX_IMAGE':
          xrs.log.info("Found duplicate image texture in " + mat.name + " in " + textures_dir)
          old_name = node.image.name
          node.image.copy()

          # Catch errors from unrelated image files in the web collection
          try:
            node.image = bpy.data.images[old_name + ".001"]
          except KeyError:
            xrs.log.info("Image File: " + node.image.name + " does not have a copied file.")

          node.image.save_render(path+node.image.name + ".png")

          # Catch errors from unrelated image files in the web collection
          try:
            bpy.data.images[old_name + ".001"].filepath = path+node.image.name + ".png"
          except KeyError:
            xrs.log.info("Image File: " + node.image.name + " does not have a copied file and was not saved.")

def update_legacy_names():
  """ Remove _Mat from the name, if present """
  for mat in bpy.data.materials:
    if mat.name[-4:] == "_Mat":
      xrs.log.warn("Updating Material Name " + mat.name)
      mat.name = mat.name[0:-4]

def update_material_to_crate_and_barrel(mat, textures_dir, use_orm = True):
  """ Rebuild material linking textures with the crate and barrel spec """
  xrs.log.verbose(mat.name + " being update for Crate and Barrel")
  rebuild_from_textures(
    mat,
    textures_dir,
    use_orm = use_orm,
    png_diffuse = True,
    diffuse_name = "_diffuse",
    normal_name = "_normal",
    orm_name = "_occlusionRoughnessMetallic",
    alpha_name = '_alpha',
    ao_name = '_occlusion',
    roughness_name = '_roughness',
    metallic_name = '_metalness',
    use_pngs = True,
    use_alpha = True
  )

def update_material_to_version_1(mat, textures_dir, png_diffuse = False):
  if "3xr_version" not in mat:
    # Only update the material if there is no version info
    # Legacy, uses the ORM file
    rebuild_from_textures(mat, textures_dir, True, png_diffuse)
    mat["3xr_version"] = 1.0
  else:
    xrs.log.verbose(mat.name + " already has a 3xr_version, skipping update")

def update_material_to_version_2(mat, textures_dir, png_diffuse = False, alpha_clip = False):
  # TODO: add a new variable for transparent because we may want png without that
  if png_diffuse:
    xrs.log.verbose(mat.name + " using png diffuse")
  if "3xr_version" not in mat or mat["3xr_version"] < 2.0:
    xrs.log.verbose(mat.name + " updating material from textures")
    rebuild_from_textures(
      mat,
      textures_dir,
      False,
      #alpha_name = '_4k_opacity',
      png_diffuse,
      alpha_clip)
    mat["3xr_version"] = 2.0
  else:
    xrs.log.verbose(mat.name + " is already 3xr_version 2, skipping update")

def update_material_to_4k(mat, textures_dir, transparent = False):
  """ Build the material from the textures in the provided directory """
  rebuild_from_textures(
    mat,
    textures_dir,
    use_orm = False,
    png_diffuse = True,
    diffuse_name = "_4k_diffuse",
    normal_name = "_4k_normal",
    alpha_name = '_4k_opacity',
    orm_name = "_4k_orm",
    ao_name = '_4k_ao',
    roughness_name = '_4k_roughness',
    metallic_name = '_4k_metallic',
    emissive_name = '_4k_emissive',
    use_pngs = True,
    use_alpha = transparent)

def uv_set_3xr_library(node_tree):
  """ Swap TEX_COORD for UVMAP with 3xr_library selected """
  uv_node = node_tree.nodes.new("ShaderNodeUVMap")
  uv_node.uv_map = '3xr_library'

  input_sockets_to_relink = []
  for node in node_tree.nodes:
    if node.type == 'TEX_COORD':
      # Find all of the links from this UV channel
      for link in node_tree.links:
        if link.from_node == node:
          if link.from_socket.name == 'UV':
            input_sockets_to_relink.append(link.to_socket)

  for socket in input_sockets_to_relink:
    node_tree.links.new(uv_node.outputs['UV'], socket)

def uv_layout_export():
  """ Exports web collection models 2D UV Layout as PNG """
  tex_filepath = xrs.filename.get_sibling_dir("textures")
  model_name = xrs.filename.get_filename()
  bpy.ops.object.mode_set(mode = "EDIT")
  for eachObject in bpy.data.collections['web'].all_objects:
    eachObject.select_set(True)
  bpy.context.view_layer.objects.active = bpy.data.collections['web'].objects[0]
  uv_timer = time.time()
  bpy.ops.uv.select_all(True)
  bpy.ops.uv.export_layout(filepath=tex_filepath + model_name + "_4k_UVs.png", export_all=True, size=(4096, 4096), opacity=.7)
  xrs.log.info("UV export time "+str(time.time()-uv_timer)+" seconds")
