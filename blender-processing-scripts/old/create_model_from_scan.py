# SPDX-License-Identifier: Apache-2.0
import bpy
import os
from xrs import tools as xrs

argv = xrs.get_command_line_arguments()

model_dir = argv[0]
model_name = argv[1]
model_height = argv[2]
working_dir = os.path.join(model_dir, model_name, "intermediate")
print("Creating "+model_name+" from directory "+working_dir+" with height "+model_height+" (mm)")

# Clear the Scene
xrs.delete_all_objects()

# Import the fbx
bpy.ops.import_scene.fbx(filepath=os.path.join(working_dir, model_name + ".fbx"))

# Rename the object and mesh data from "Model" to "Original"
original = bpy.data.objects[0] # It is the only object, since we deleted everything else
original.name = "Original"
original.data.name = "Original"

# Add a reference cube for the height
bpy.ops.mesh.primitive_cube_add()
cube = bpy.data.objects["Cube"]
cube_size = int(model_height)/2000 # Divide in half, scale by 1,000 because the units are mm
cube.scale = (cube_size,cube_size,cube_size)
cube.location.z = cube_size

# Rename the imported diffuse texture from "texture0" to "Original_Diffuse"
# Only importing 1 image (from Agisoft) - selecting -1 just in case default scene has some other images
original_diffuse = bpy.data.images[-1]
original_diffuse.name = "Original_Diffuse"

# Unlink the imported material and re-create it as "Original_Mat" with an emission node
original_mat = bpy.data.materials.new(name="Original_Mat")
original.material_slots[0].material = original_mat
original_mat.use_nodes = True

# Setup the nodes for emmision (remove diffuse, add emit)
nodes = original_mat.node_tree.nodes
if "Diffuse BSDF" in nodes:
    # Default in 2.79
    nodes.remove(nodes["Diffuse BSDF"])
if "Principled BSDF" in nodes:
    # Default in 2.80
    nodes.remove(nodes["Principled BSDF"])
out = nodes["Material Output"]
out.location = (600, 0)
emit = nodes.new("ShaderNodeEmission")
emit.location = (300, 0)
texture = nodes.new("ShaderNodeTexImage")
texture.location = (0, 0)
texture.image = original_diffuse
links = original_mat.node_tree.links
links.new(texture.outputs[0], emit.inputs[0])
links.new(emit.outputs[0], out.inputs[0])

# Place the object at the center
xrs.place_at_center_bottom(original)

# Save the .blend
bpy.ops.wm.save_mainfile(filepath=os.path.join(working_dir, model_name + ".blend"))
xrs.quit()

### MANUAL ROTATION ###
# It wolud be nice to automate this, but needs cameras ...
# TODO: export camera positions from agisoft
# Seperate cameras into rings - they should be close to being co-planner
# Find the rotation of the camera rings plane and rotate the object by this value
# -- Would still need the Front Rotation ...

### MANUAL - Fix overlapping trianges ###

### Save and run the next script: bake_model_from_scan ###

# Note: Don't lose the relative Agisoft location, rotation, scale after moving
# Manual Steps (to automate)
# Rotate the object so that the bottom is flat on the x-y axis
# Scale the object to the given height
# ---
# Copy the object
# 1. Reposition
# 2. Scale (approx 20cm tall)
### ! - Should fix overlapping triangles here
# 3. Duplicate
# 4. Rename
# 5. Create new material (FishShoppe_Mat)
# 6. Apply modifier remesh (mode=smooth, d=7, scale=.99)
# 7. Apply modifier decimate (ratio = 0.2)
# 8. UV Unwrap
# 9. New 4k Image Texture (FishShoppe_4k_Diffuse)
# 10. Assign texture to FishShoppe_Mat
# 11. Bake selected to active Emit channel (Cage, ext 0.01)
# 12. Save as FishShoppe_4k_Diffuse.jpg
# 13. Create a new 4k image (FishShoppe_4k_Normal)
# 14. Bake selected to active Normal (Cage, 0.01) - note base has a hole
# 15. Save as FishShoppe_4k_Normal.jpg
# 16. Create a new 4k image (FishShoppe_4k_AO)
# 17. Bake selected to active AO (Cage, 0.01) - note base has a hole
# 18. Save as FishShoppe_4k_AO.jpg
# 19. Export model as obj (selected only) scale = 100.0
# GLTF Setup (roughness needed)
