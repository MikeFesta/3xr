# SPDX-License-Identifier: Apache-2.0
import bpy
import os
import time
from mathutils import Vector
from xrs import tools as xrs

# Set variables
arguments = xrs.get_command_line_arguments()
print(arguments)
model_name = xrs.get_filename_no_ext()
# NOTE: This is probably being run from the 279_ file, so remove that from the name
if model_name[0:4] == "279_":
  model_name = model_name[4::]
WORKING_DIR = xrs.get_working_dir()
EXPORT_DIR = WORKING_DIR + "../textures/"

high_res = bpy.data.objects[model_name + "_high_res"]
high_res_mat = bpy.data.materials[model_name + "_high_res_Mat"]
high_res_texture = high_res_mat.node_tree.nodes["Image Texture"]
low_poly = bpy.data.objects[model_name + "_low_res"]
low_poly_mat = bpy.data.materials[model_name+"_Mat"]
nodes = low_poly_mat.node_tree.nodes
texture = low_poly_mat.node_tree.nodes["Image Texture"]

# Cycles rendered needs to be selected
xrs.set_renderer_to_cycles()

### Picking up after low_poly_from scan and manual fixes
timer = time.time()

xrs.select_object(low_poly)

# Bake Options for all formats
bpy.context.scene.render.bake.use_selected_to_active = True
bpy.context.scene.render.bake.use_cage = True
bpy.context.scene.render.bake.cage_extrusion = 0.1 # TODO: base this on height and/or scale
# Note: May want to create a cage object to prevent intersections

# Bake UV Map to external png to help with photoshop edits (if needed)
if ("uv" in arguments):
  uv_timer = time.time()
  bpy.ops.uv.export_layout(filepath=WORKING_DIR + model_name + "_4k_UVs.png", size=(4096,4096))
  print("UV export time "+str(time.time()-uv_timer)+" seconds")

# Note: we don't want this selected until after the UV export is complete
if (xrs.is_blender_28()):
  high_res.select_set(True)
else:
  high_res.select = True

# Diffuse Bake (selected to active, Emit channel, Cage, ext 0.01)
if ("diffuse" in arguments):
  diffuse_timer = time.time()
   # Original Diffuse Image
  if "Original_Diffuse" in bpy.data.images:
      high_res_diffuse = bpy.data.images["Original_Diffuse"]
  else:
      high_res_diffuse = bpy.data.images.load(filepath=WORKING_DIR+model_name+".jpg")
      high_res_diffuse.name = "Original_Diffuse"
  high_res_texture.image = high_res_diffuse

  # Bake Diffuse Image
  #TODO: This file is a work in progress - copy Emissive once it is working and create nodes for each of the textures being baked
  diffuse_bake = bpy.data.images.new(name=model_name+"_Diffuse",width=4096,height=4096)
  diffuse_bake.filepath = EXPORT_DIR + model_name + "_4k_Diffuse.jpg"
  print("Changing file format from " + diffuse_bake.file_format) # Blender bug ? - need to call file_format before assigning it or it won't change
  diffuse_bake.file_format = "JPEG"
  print("Setting File output to " + diffuse_bake.file_format)

  texture.image = diffuse_bake
  bpy.context.scene.cycles.bake_type = "EMIT"
  bpy.ops.object.bake(type="EMIT")
  diffuse_bake.save()
  print("Diffuse Bake Time: "+str(time.time()-diffuse_timer)+" seconds")

# Emissive Bake (selected to active, Emit channel, Cage, ext 0.01)
if ("emissive" in arguments):
    emissive_timer = time.time()
    # Original Emissive Image
    if "Original_Emissive" in bpy.data.images:
        high_res_emissive = bpy.data.images("Original_Emissive")
    else:
        high_res_emissive = bpy.data.images.load(filepath=WORKING_DIR+"Original_Emissive.jpg")
        high_res_emissive.name = "Original_Emissive"
    high_res_texture.image = high_res_emissive

    # Bake Emissive Image
    if model_name+"_Emissive" in bpy.data.images:
        emissive_bake = bpy.data.images(model_name+"_Emissive")
    else:
        emissive_bake = bpy.data.images.new(name=model_name+"_Emissive",width=4096,height=4096)
        emissive_bake.filepath = EXPORT_DIR + model_name + "_4k_Emissive.jpg"
        print("Changing file format from " + emissive_bake.file_format) # Blender bug ? - need to call file_format before assigning it or it won't change
        emissive_bake.file_format = "JPEG"
        print("Setting File output to " + emissive_bake.file_format)

    if "Emissive" in nodes:
        emissive_node = nodes["Emissive"]
    else:
        emissive_node = nodes.new("ShaderNodeTexImage")
        emissive_node.name = "Emissive"
        emissive_node.location = (0, -450)
        emissive_node.width = 300
    emissive_node.image = emissive_bake
    nodes.active = emissive_node
    bpy.context.scene.cycles.bake_type = "EMIT"
    bpy.ops.object.bake(type="EMIT")
    emissive_bake.save()
    print("Emissive Bake Time: "+str(time.time()-emissive_timer)+" seconds")

# Normal Bake
if ("normal" in arguments):
    print("Baking Normal")
    normal_timer = time.time()
    # Check if the image exists already and only create it if needed
    #normal_bake = bpy.data.images.new(name=model_name+"_Normal",width=4096,height=4096)
    normal_bake = bpy.data.images.new(name=model_name+"_Normal",width=1024,height=1024)
    #normal_bake.filepath = EXPORT_DIR + model_name + "_4k_Normal.jpg"
    normal_bake.filepath = EXPORT_DIR + model_name + "_1k_Normal.jpg"
    print("Changing file format from " + normal_bake.file_format)
    # Blender 2.79 bug ? - need to call file_format before assigning it or it won't change
    normal_bake.file_format = "JPEG"
    print("Setting File output to " + normal_bake.file_format)
    texture.image = normal_bake
    bpy.context.scene.cycles.bake_type = "NORMAL"
    bpy.ops.object.bake(type="NORMAL")
    normal_bake.save()
    print("Normal Bake Time: "+str(time.time()-normal_timer)+" seconds")

# AO Bake
if ("ambient_occlusion" in arguments):
    print("Baking AO")
    ao_timer = time.time()
    if (xrs.is_blender_28()):
        # Bake AO to self, then bake via emit (like diffuse) because of a bug in 2.8
        xrs.select_object(high_res)
        bpy.context.scene.render.bake.use_selected_to_active = False
        bpy.context.scene.render.bake.use_cage = False
        # Check if the image exists already and only create it if needed
        bpy.ops.image.new(name="Original_AO", color=(1,1,1,1)) # This way lets you set a color
        high_res_ao = bpy.data.images["Original_AO"]
        high_res_ao.use_alpha=False
        high_res_ao.generated_width=4096
        high_res_ao.generated_height=4096
        high_res_texture.image = high_res_ao
        bpy.context.scene.cycles.bake_type = "AO"
        xrs.disable_all_from_render()
        high_res.hide_render=False
        bpy.ops.object.bake(type="AO")

        # Now bake the emit channel to the AO map from Original_AO
        bpy.context.scene.render.bake.use_selected_to_active = True
        bpy.context.scene.render.bake.use_cage = True
        xrs.select_object(low_poly)
        high_res.select_set(True)
        low_poly.hide_render=False
        ao_bake = bpy.data.images.new(name=model_name+"_AO",width=4096,height=4096)
        ao_bake.filepath = EXPORT_DIR + model_name + "_4k_AO.jpg"
        print("Changing file format from " + ao_bake.file_format) # Blender bug ?
        ao_bake.file_format = "JPEG"
        print("Setting File output to " + ao_bake.file_format)
        texture.image = ao_bake
        bpy.context.scene.cycles.bake_type = "EMIT"
        bpy.ops.object.bake(type="EMIT")
    else:
        bpy.ops.image.new(name=model_name+"_AO", color=(1,1,1,1)) # White Background
        ao_bake = bpy.data.images[model_name+"_AO"]
        ao_bake.generated_width=1024#4096
        ao_bake.generated_height=1024#4096
        ao_bake.filepath = EXPORT_DIR + os.sep + model_name + "_1k_AO.jpg"
        print("Changing file format from " + ao_bake.file_format) # Blender bug ?
        ao_bake.file_format = "JPEG"
        print("Setting File output to " + ao_bake.file_format)
        texture.image = ao_bake
        bpy.context.scene.cycles.bake_type = "AO"
        bpy.ops.object.bake(type="AO")
    ao_bake.save()
    print("AO Bake Time: "+str(time.time()-ao_timer)+" seconds")

# Export model as OBJ (scale = 100)
if ("object" in arguments):
    obj_timer = time.time()
    xrs.select_object(low_poly)
    bpy.ops.export_scene.obj(filepath=EXPORT_DIR + model_name + ".obj", check_existing=False, global_scale=100, use_selection=True)
    print("OBJ export time "+str(time.time()-obj_timer)+" seconds")

print("Total Run Time: "+str(time.time()-timer)+" seconds")
