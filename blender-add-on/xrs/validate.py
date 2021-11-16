# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Validation related functions """

import bpy
import os
import xrs.collection
import xrs.filename
import xrs.log
import xrs.material
import xrs.object
import xrs.tools
import xrs.validation_report

def active_object_is_a_mesh():
  """ Check if the active object has a mesh """
  return bpy.context.active_object.type == 'MESH'

def materials_submission():
  """ Cleans up materials and links image textures for submission """
  # Remove all unused material slots
  for obj in bpy.data.objects:
    xrs.material.clean_material_slots(obj)

  # Check that the image texture exists
  for obj in bpy.data.collections["web"].objects:
    for slot in obj.material_slots:
      mat = slot.material
      if mat.use_nodes == False:
        xrs.log.debug("Material that does not use nodes found: " + mat.name)
        return False
      for node in mat.node_tree.nodes:
        if node.type == 'TEX_IMAGE':
          if node.image == None:
            xrs.log.debug("No image linked to texture node: " + mat.name)
            return False
          node.image.source = 'FILE'
          node.image.filepath = os.path.join("//", node.image.name + ".png")
#          node.image.filepath = xrs.filename.get_sibling_dir("textures") + node.image.name + ".png"
#          if os.path.exists(node.image.filepath) == False:
#            xrs.log.debug("Filepath error: " + node.image.filepath)
#            return False
#          properName = node.image.name.split("_4k_")[0]
#          if mat.name != properName:
#            xrs.log.debug("Naming conventions not followed for: " + mat.name + ", Should be: " + properName)
#            return False

  # Image textures live in the textures directory
  return True

def check_and_report_normal_material(bsdf, mat):
  """ Checks that the normal material goes through a normal node """
  slot_name = "Normal"
  valid = True
  if (xrs.material.get_node_link_count_named(bsdf, slot_name) == 0):
    xrs.validation_report.write_ok(
      mat.name + " has no " + slot_name + " texture"
    )
  else:
    normal_map = xrs.material.get_first_from_node_link_named(
      bsdf,
      slot_name
    )
    if normal_map.type != 'NORMAL_MAP':
      xrs.validation_report.write_error(
        mat.name + " " + slot_name +
        " input should be an Normal Map node"
      )
      valid = False
    else:
      # check that there is an image texture with the right name
      valid = valid and check_and_report_material(normal_map, mat, "Color", "normal")
  return valid

def check_and_report_procedural_material():
  """ Checks if the created procedural material complies with current 3XR standards """
  valid = True

  # Check for valid product name in .blend file
  try:
    name = bpy.context.scene.xr_studio.product_name
  except:
    xrs.log.error("Unable to find the product name in the .blend file")

  # Check for naming conventions
  if xrs.material.procedural_nodes_name_check() == True:
    xrs.validation_report.write_ok("The procedural material nodes are named correctly")
    nodes = bpy.data.materials[name].node_tree.nodes

    # Check for number of nodes in the material (There should only be 3 on the top level of nodes.)
    if len(nodes) > 3:
      xrs.validation_report.write_error("There are too many nodes in the top layer of this material. There should only be 3.")
      valid = False
    else:
      xrs.validation_report.write_ok("There are a correct number of nodes in the top layer of this material")

    # Look for the group, BSDF, and Material Output nodes
    if xrs.material.get_one_node_of_type(nodes, 'BSDF_PRINCIPLED'):
      xrs.validation_report.write_ok("PRINCIPLED BSDF node found")
    else:
      xrs.validation_report.write_error("PRINCIPLED BSDF node not found")
      valid = False

    if xrs.material.get_one_node_of_type(nodes, 'OUTPUT_MATERIAL'):
      xrs.validation_report.write_ok("MATERIAL OUTPUT node found")
    else:
      xrs.validation_report.write_error("MATERIAL OUTPUT node not found")
      valid = False

    if xrs.material.get_one_node_of_type(nodes, 'GROUP'):
      xrs.validation_report.write_ok("CUSTOM GROUP node found")
    else:
      xrs.validation_report.write_error("CUSTOM GROUP node not found")
      valid = False

    # Check if the nodes are connected to each other correctly
    if xrs.material.procedural_nodes_link_check:
      xrs.validation_report.write_ok("The procedural material nodes are linked correctly")
    else:
      xrs.validation_report.write_error("The procedural material nodes are not linked correctly")
      valid = False
  else:
    valid = False
  return valid

def check_and_report_material(bsdf, mat, slot_name, texture_name):
  valid = True
  if (xrs.material.get_node_link_count_named(bsdf, slot_name) == 0):
    xrs.validation_report.write_ok(
      mat.name + " has no " + slot_name + " texture"
    )
  else:
    tex = xrs.material.get_first_from_node_link_named(
      bsdf,
      slot_name
    )
    # (ERR) input not an Image Texture
    if (tex.type != 'TEX_IMAGE'):
      valid = False
      xrs.validation_report.write_error(
        mat.name + " " + slot_name +
        " input needs to be an image texture, found " + tex.type
      )
    else:
      xrs.validation_report.write_ok(
        mat.name + " " + slot_name +
        " uses an image texture"
      )
      # (ERR) texture has no image
      if (tex.image == None):
        valid = False
        xrs.validation_report.write_error(
          mat.name + " " + slot_name +
          " texture needs an image"
        )
      else:
        img = tex.image
        # (ERR) texture source not a file
        if (img.source != 'FILE'):
          valid = False
          xrs.validation_report.write_error(
            mat.name + " " + slot_name +
            " texture image not a file"
          )
        else:
          # Note: os.path.basename does not work on Windows
          img_name = bpy.path.basename(img.filepath)
          # (WARN) filename mismatch
          if (img_name != mat.name + "_4k_" + texture_name + ".png"):
            xrs.validation_report.write_warning(
              "Texture name (" + img_name + ") should be " + mat.name +
              "_4k_" + texture_name + ".png (Ignore for a transparent material)"
            )
          else:
            xrs.validation_report.write_ok(
              img_name + " name is valid"
            )

          # (ERR) Not in the textures folder
          # Note: split for Windows compatibility
          paths = os.path.dirname(img.filepath).split('\\')
          directory = paths[0]
          folder = ""
          if (len(paths) > 1):
            folder = paths[1]
          if (directory == "//../textures"):
            # Mac / Linux
            xrs.validation_report.write_ok(
              img_name + " is in the textures folder"
            )
          elif (directory == "//.." and folder == "textures"):
            # Windows
            xrs.validation_report.write_ok(
              img_name + " is in the textures folder"
            )
          else:
            valid = False
            xrs.validation_report.write_error(
              img_name +
              " needs to be in the textures folder. Found " +
              directory
            )
  return valid

def mat_scene():
  """ Check that the scene is valid for procedural materrial creation and creates a report """
  xrs.validation_report.new_report()
  valid = True

  # Start by getting into object mode with nothing selected
  bpy.ops.object.mode_set(mode="OBJECT")
  bpy.ops.object.select_all(action='DESELECT')

  # Find all needed items / collections in the material .blend scene
  if (xrs.collection.collection_has_objects("3XR_lights") == False):
    xrs.validation_report.write_error("3XR lights collection not found")
    valid = False
  else:
    xrs.validation_report.write_ok("3XR lights collection found")

  if (xrs.collection.collection_has_objects("3XR_reference") == False):
    xrs.validation_report.write_error("3XR_reference collection not found")
    valid = False
  else:
    xrs.validation_report.write_ok("3XR_reference collection found")

  try:
    bpy.data.objects['3XR_material_ball']
    xrs.validation_report.write_ok("3XR_material_ball found")
  except:
    xrs.validation_report.write_error("3XR_material_ball not found")
    valid = False

  # Check number of materials & procedrual material setup
  if len(bpy.data.materials) > 2:
    xrs.validation_report.write_error("There are too many materials in the Blender file. Please remove excess materials")
    valid = False
  else:
    xrs.validation_report.write_ok("There are a correct number of materials in the Blender file")

  # Check for valid product name in .blend file
  try:
    name = bpy.context.scene.xr_studio.product_name
  except:
    xrs.log.error("Unable to find the product name in the .blend file")

  if check_and_report_procedural_material() == False:
    #xrs.validation_report.write_error("3XR procedural material "+ name + " is not valid")
    valid = False
  else:
    xrs.validation_report.write_ok("3XR procedural material is valid")

  # Show the report after it is complete
  xrs.validation_report.show_report()

  return valid

def scene():
  """ Check that the scene is valid for submission and creates a report """
  xrs.validation_report.new_report()
  valid = True

  # Start by getting into object mode with nothing selected
  bpy.ops.object.mode_set(mode="OBJECT")
  bpy.ops.object.select_all(action='DESELECT')

  if (xrs.collection.collection_has_objects("master") == False):
    xrs.validation_report.write_error("master collection not found or has no objects")
    valid = False
  else:
    xrs.validation_report.write_ok("master collection found")

  if (xrs.collection.collection_has_objects("web") == False):
    valid = False
    xrs.validation_report.write_error(
      "web collection not found or has no objects"
    )
  else:
    # Check all objects in the web collection
    web_objects = xrs.collection.get_objects("web")
    base_objects = xrs.collection.get_objects("master")
    transparent_object_count = 0
    total_triangles = 0

    xrs.validation_report.write_ok(
      "web collection found. object count: " + str(len(web_objects))
    )
    xrs.validation_report.write_hr()

    # TODO: Additional checks for master objects

    if ('dimensions_cube' not in bpy.data.objects):
      valid = False
      xrs.validation_report.write_error(
        "dimensions_cube not found"
      )
    else:
      dimensions_cube = bpy.data.objects['dimensions_cube']
      tolerance = 1.05
      web_dimensions = xrs.collection.get_dimensions("web")
      # (WARN) Width
      if (
        web_dimensions[0] > dimensions_cube.dimensions.x * tolerance
      ):
        xrs.validation_report.write_warning(
          "Model width is too big (" +
          str(web_dimensions[0]) + " > " +
          str(dimensions_cube.dimensions.x) + ")"
        )
      elif (
        web_dimensions[0] < dimensions_cube.dimensions.x / tolerance
      ):
        xrs.validation_report.write_warning(
          "Model width is too small (" +
          str(web_dimensions[0]) + " < " +
          str(dimensions_cube.dimensions.x) + ")"
        )
      else:
        xrs.validation_report.write_ok(
          "Model width is " + str(web_dimensions[0])
        )
      # (WARN) Depth
      if (
        web_dimensions[1] > dimensions_cube.dimensions.y * tolerance
      ):
        xrs.validation_report.write_warning(
          "Model depth is too big (" +
          str(web_dimensions[1]) + " > " +
          str(dimensions_cube.dimensions.y) + ")"
        )
      elif (
        web_dimensions[1] < dimensions_cube.dimensions.y / tolerance
      ):
        xrs.validation_report.write_warning(
          "Model depth is too small (" +
          str(web_dimensions[1]) + " < " +
          str(dimensions_cube.dimensions.y) + ")"
        )
      else:
        xrs.validation_report.write_ok(
          "Model depth is " + str(web_dimensions[1])
        )
      # (WARN) Height
      if (
        web_dimensions[2] > dimensions_cube.dimensions.z * tolerance
      ):
        xrs.validation_report.write_warning(
          "Model height is too big (" +
          str(web_dimensions[2]) + " > " +
          str(dimensions_cube.dimensions.z) + ")"
        )
      elif (
        web_dimensions[2] < dimensions_cube.dimensions.z / tolerance
      ):
        xrs.validation_report.write_warning(
          "Model height is too small (" +
          str(web_dimensions[2]) + " < " +
          str(dimensions_cube.dimensions.z) + ")"
        )
      else:
        xrs.validation_report.write_ok(
          "Model height is " + str(web_dimensions[2])
        )

    xrs.validation_report.write_hr()

    # Base Collection
    for obj in base_objects:
    # (ERR) Modifiers need to be applied
      if (len(obj.modifiers) > 0):
        valid = False
        xrs.validation_report.write_error(
          obj.name + " needs to have all modifiers applied"
        )
      else:
        xrs.validation_report.write_ok(
          obj.name + " has no modifiers"
        )

    # (ERR) Transforms Not Applied (loc!=0,0,0;rot!=0,0,0;scale!=1)
      if (xrs.object.transforms_are_applied(obj) == False):
        valid = False
        xrs.validation_report.write_error(
          obj.name + " needs to have transforms applied"
        )
      else:
        xrs.validation_report.write_ok(
          obj.name + " transforms are correct"
        )

    # Web Collection
    for obj in web_objects:
      # (ERR) Modifiers need to be applied
      if (len(obj.modifiers) > 0):
        valid = False
        xrs.validation_report.write_error(
          obj.name + " needs to have all modifiers applied"
        )
      else:
        xrs.validation_report.write_ok(
          obj.name + " has no modifiers"
        )

      # (ERR) Non-manifold geometry
      non_manifold_vertext_count = xrs.object.non_manifold_vertex_count(obj)
      if (non_manifold_vertext_count > 0):
        xrs.validation_report.write_warning(
          obj.name + " has non-manifold geometry (" + str(non_manifold_vertext_count) + " vertices)"
        )
      else:
        xrs.validation_report.write_ok(
          obj.name + " has no non-manifold geometry"
        )

      # (ERR) Triangle count over 100k
      triangle_count = xrs.object.get_triangle_count(obj)
      total_triangles = total_triangles + triangle_count
      if (triangle_count > 100000):
        valid = False
        xrs.validation_report.write_error(
          obj.name + " has " +
          str(triangle_count) +
          " triangles. The web collection model must be less than 100,000 triangles"
        )

      # (WARN) Triangle count over 60k
      if (triangle_count > 60000):
        xrs.validation_report.write_warning(
          obj.name + " has " +
          str(triangle_count) +
          " triangles. This web collection model should be optimized where possible"
        )
      else:
        xrs.validation_report.write_ok(
          obj.name + " has " + str(triangle_count) + " triangles"
        )

      # (ERR) Transforms Not Applied (loc!=0,0,0;rot!=0,0,0;scale!=1)
      if (xrs.object.transforms_are_applied(obj) == False):
        valid = False
        xrs.validation_report.write_error(
          obj.name + " needs to have transforms applied"
        )
      else:
        xrs.validation_report.write_ok(
          obj.name + " transforms are correct"
        )

      # (WARN) Object names match mesh names
      if (obj.name != obj.data.name):
        xrs.validation_report.write_warning(
          obj.name + " mesh is named " +
          obj.data.name +
          ". Names should match"
        )
      else:
        xrs.validation_report.write_ok(
          obj.name + " mesh name matches"
        )

      # Materials
      material_count = len(obj.material_slots)
      # (ERR) No material
      if (material_count == 0):
        valid = False
        xrs.validation_report.write_error(
          obj.name + " needs to have a material"
        )
      else:
        # (WARN) >1 Material per web object
        if (material_count > 1):
          xrs.validation_report.write_warning(
            obj.name + " has " +
            str(material_count) +
            " materials and should only have 1"
          )
        else:
          xrs.validation_report.write_ok(
            obj.name + " has 1 material"
          )

        #web collection should have ao
        if xrs.tools.check_ao() == False:
          xrs.validation_report.write_warning(
            obj.name +
            " does not have an AO map. Please make one for the web collection model and put in the textures folder"
          )
        else:
          xrs.validation_report.write_ok(
            obj.name + " has the needed AO map in the web collection"
          )

        # (ERR) Material names are correct
        for slot in obj.material_slots:
          mat = slot.material
          # (ERR) Empty Material Slot
          if (mat is None):
            valid = False
            xrs.validation_report.write_error(
              obj.name + " has an empty material slot, which must be removed"
            )
          else:
            # (WARN) Material name should be lower case
            if (mat.name.islower() == False):
              xrs.validation_report.write_warning(
                mat.name + " name should be lower case with _s"
              )
            else:
              xrs.validation_report.write_ok(
                mat.name + " name is valid"
              )
            # (ERR) Material uses nodes
            if (mat.use_nodes == False):
              valid = False
              xrs.validation_report.write_error(
                mat.name + " needs to use nodes"
              )
            else:
              xrs.validation_report.write_ok(
                mat.name + " uses nodes"
              )
              # (ERR) Material does not use a BSDF Shader
              bsdf = xrs.material.get_one_node_of_type(
                mat.node_tree.nodes,
                "BSDF_PRINCIPLED"
              )
              if (bsdf is None):
                valid = False
                xrs.validation_report.write_error(
                  mat.name + " needs to use a Principled BSDF shader"
                )
              else:
                xrs.validation_report.write_ok(
                  mat.name + " has a Principled BSDF shader"
                )
                # Base Color
                if (check_and_report_material(
                  bsdf, mat, "Base Color", "diffuse"
                ) == False):
                  valid = False

                # Metallic (TODO: enforce 0 or 1)
                if (check_and_report_material(
                  bsdf, mat, "Metallic", "metallic"
                ) == False):
                  valid = False

                # Roughness
                if (check_and_report_material(
                  bsdf, mat, "Roughness", "roughness"
                ) == False):
                  valid = False

                # Emission
                if (check_and_report_material(
                  bsdf, mat, "Emission", "emissive"
                ) == False):
                  valid = False

                # Alpha (TODO: get count)
                # Alpha is in the diffuse texture
                if (check_and_report_material(
                  bsdf, mat, "Alpha", "diffuse"
                ) == False):
                  valid = False

                # Normal
                if (check_and_report_normal_material(
                  bsdf, mat
                ) == False):
                  valid = False

      xrs.validation_report.write_hr()

    # (WARN) web object count should only be > 1 if some are transparent
    #TODO

    # (WARN) Total triangle count for web collection
    if (total_triangles > 65000):
      xrs.validation_report.write_warning(
        "web collection meshes have " +
        str(total_triangles) +
        " triangles. There should be less than 65,000 triangles where possible"
      )

  # Nice to have:
  # Preview Render
  # GLB export

  # Show the report after it is complete
  xrs.validation_report.show_report()

  return valid

def scene_for_glb():
  """ Check that everything in the scene is ready for glb creation """
  # Need to have a collection named "web" with objects linked to it
  if xrs.collection.has_collection_named("web") == False:
    xrs.log.error("No collection named 'web' found")
    return False
  web_collection_count = len(bpy.data.collections['web'].all_objects)
  xrs.log.verbose("'web' collection has " + str(web_collection_count) + " elements")
  if (web_collection_count == 0):
    xrs.log.error("'web' collection is empty")
    return False
  # Everything passed
  return True

def submission():
  """ Validate everything for submission """
  if (scene()):
    return ''
  else:
    return 'Scene is not valid - see Validation Report'
