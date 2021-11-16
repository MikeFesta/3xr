# SPDX-License-Identifier: Apache-2.0
# NOTE: This file could become init_model_from_meshroom_part4 (run after cameras are upright and centered)
import bpy
import os
from mathutils import Vector
from xrs import tools as xrs

# Set variables
model_name = xrs.get_filename_no_ext()
original = bpy.data.objects['Original']

timer = time.time()

# NOTE: this assumes that the Original mesh was already centered and has the bottom aligned
# Flatten the bottom by moving all negative z vertices to 0
# TODO: Instead of Modifying the original, either make a copy or work with the _high_res
xrs.flatten_bottom_vertices(original,0)

# Duplicate and rename
low_poly = original.copy()
low_poly.name = model_name + "_low_res"
low_poly.data = original.data.copy()
if (xrs.is_blender_28):
    # 2.8+ syntax
    bpy.context.scene.collection.objects.link(low_poly)
else:
    # 2.79 syntax
    bpy.context.scene.objects.link(low_poly)
xrs.select_object(low_poly)

# Create new material
low_poly_mat = bpy.data.materials.new(name=model_name+"_Mat")
low_poly.material_slots[0].material = low_poly_mat
low_poly_mat.use_nodes = True

# Setup the nodes for principaled BSDF with a texture
nodes = low_poly_mat.node_tree.nodes
if ("Diffuse BSDF" in nodes):
    # Blender 2.79 default shader is Diffuse
    nodes.remove(nodes["Diffuse BSDF"])
if ("Principled BSDF" in nodes):
    shader = nodes["Principled BSDF"]
else:
    shader = nodes.new("ShaderNodeBsdfPrincipled")
shader.location = (300, 0)
out = nodes["Material Output"]
out.location = (600, 0)
texture = nodes.new("ShaderNodeTexImage")
texture.location = (0, 0)
links = low_poly_mat.node_tree.links
links.new(texture.outputs[0], shader.inputs[0])
links.new(shader.outputs[0], out.inputs[0])

# Apply modifier remesh (mode=smooth, d=7, scale=.99)
bpy.ops.object.modifier_add(type="REMESH")
remesh = low_poly.modifiers["Remesh"]
remesh.mode = "SMOOTH"
remesh.use_smooth_shade = True
remesh.scale = 0.99
remesh.octree_depth = 7
bpy.ops.object.modifier_apply(modifier="Remesh", apply_as="DATA")

# Apply modifier decimate (ratio = 0.2)
bpy.ops.object.modifier_add(type="DECIMATE")
decimate = low_poly.modifiers["Decimate"]
decimate.ratio = 0.2
bpy.ops.object.modifier_apply(modifier="Decimate", apply_as="DATA")

# Fix non-manifold edges (merge small edges)
xrs.fix_bad_faces(low_poly)

# THIS IS A GOOD SPOT TO DO A MANUAL CHECK BEFORE BAKING
# Possible Test: decimate with planar 3 degrees
# Possible Test: convert quads to tris

# UV Unwrap
bpy.ops.uv.smart_project()

# Manually  Save the file after review, next run bake_from_scan.py
#xrs.quit()
