# SPDX-License-Identifier: Apache-2.0
'''
Open the .blend file with the cameras, add mesh, images, organize file
Note: cameras and point cloud already in the file (using Blender 2.78c)
TODO: Rename the collections to be consistant with other .blend files (high_res, low_res)
'''
import bpy
import os
import time
from xrs import tools as xrs

argv = xrs.get_command_line_arguments()

model_dir = argv[0]
model_name = argv[1]
obj_hash= argv[2]
#TODO: Import dimensions and create a reference cube
working_dir = os.path.join(model_dir, model_name, "blender")
xrs.set_object_mode()
xrs.print_status("Init "+model_name+" from directory "+working_dir)
mesh_file = os.path.join(model_dir, model_name, "meshroom", "MeshroomCache", "Texturing", obj_hash, "texturedMesh.obj")

# Render Settings
bpy.data.scenes[0].render.engine = 'CYCLES'
bpy.data.scenes[0].render.resolution_x = 1200
bpy.data.scenes[0].render.resolution_y = 900

# Import the textured mesh
#{project_directory}/meshroom/MeshroomCache/Texturing/{hash}/texturedMesh.obj
if "Original" not in bpy.data.objects:
    xrs.print_status("Importing Mesh from "+mesh_file)
    bpy.ops.import_scene.obj(filepath=mesh_file)
    xrs.print_status("Done importing mesh")

# Relink meshroom textures from meshroom folder to textures folder
for i in bpy.data.images:
  if (i.filepath.find("meshroom") >= 0):
    # Keep the same filename (part after last /)
    i.filepath = "//../textures" + i.filepath[i.filepath.rfind("/"):]

# Rename mesh, image, material
if "texturedMesh" in bpy.data.objects:
    original_mesh = bpy.data.objects["texturedMesh"]
    original_mesh.name = "Original"
    original_mesh.data.name = "Original"
else:
    original_mesh = bpy.data.objects["Original"]

if "texture_0.png" in bpy.data.images:
    # Note: some models have more than one of these textures
    original_texture = bpy.data.images["texture_0.png"]
    original_texture.name = "Original_4k_Diffuse"
else:
    original_texture = bpy.data.images["Original_4k_Diffuse"]

if "TextureAtlas_0" in bpy.data.materials:
    original_mat = bpy.data.materials["TextureAtlas_0"]
    original_mat.name = "Original_Mat"
else:
    original_mat = bpy.data.materials["TextureAtlas_0"]

# Copy the original mesh into a new object
if model_name not in bpy.data.objects:
    xrs.select_object(original_mesh)
    bpy.ops.object.duplicate()
    final_mesh = bpy.context.active_object
    final_mesh.name = model_name
    final_mesh.data.name = model_name
    final_mat = bpy.data.materials.new(name=model_name+"_Mat")
    final_mesh.material_slots[0].material = final_mat

# Organize Collections
# Rename current collection to Cameras
if "Cameras" not in bpy.data.collections:
    camera_collection = bpy.data.collections[0]
    camera_collection.name = "Cameras"
else:
    camera_collection = bpy.data.collections["Cameras"]

# Create new collections
if "Final Mesh" not in bpy.data.collections:
    final_mesh_collection = bpy.data.collections.new("Final Mesh")
    bpy.context.scene.collection.children.link(final_mesh_collection)

if model_name not in final_mesh_collection:
    final_mesh_collection.objects.link(final_mesh)

#if "Camera Row 3" not in bpy.data.collections:
#    camera_row_3 = bpy.data.collections.new("Camera Row 3")
if "Point Cloud" not in bpy.data.collections:
    point_cloud_collection = bpy.data.collections.new("Point Cloud")
    bpy.context.scene.collection.children.link(bpy.data.collections["Point Cloud"])
else:
    point_cloud_collection = bpy.data.collections["Point Cloud"]
if "Original Mesh" not in bpy.data.collections:
    original_mesh_collection = bpy.data.collections.new("Original Mesh")
    bpy.context.scene.collection.children.link(bpy.data.collections["Original Mesh"])
else:
    original_mesh_collection = bpy.data.collections["Original Mesh"]

if "Original" not in original_mesh_collection.objects:
    original_mesh_collection.objects.link(original_mesh)
    #TODO: unlink from Scene Collection
    #bpy.context.scene.collection.children.unlink(original_mesh)

if "mvgPointCloud" in bpy.data.objects:
    point_cloud = bpy.data.objects["mvgPointCloud"]
    point_cloud.name = "PointCloud"
else:
    point_cloud = bpy.data.objects["PointCloud"]

if "PointCloud" not in point_cloud_collection.objects:
    point_cloud_collection.objects.link(point_cloud)

if "PointCloud" in camera_collection.objects:
    camera_collection.objects.unlink(point_cloud)

# Unlink from the master collection
bpy.context.scene.collection.objects.unlink(original_mesh)
bpy.context.scene.collection.objects.unlink(final_mesh)

# Load photos
cams = xrs.get_all_cameras()
for c in cams:
    if c.name+'.jpg' not in bpy.data.images:
        img = bpy.data.images.load(filepath='/3xr/assets/studio/projects/'+model_name+'/photos/'+c.name+'.jpg')
        xrs.print_status(img.name+' loaded')
        img.name = c.name

# Link the background images
for c in cams:
    c.data.clip_start = 0.01
    c.data.show_background_images = True
    img = bpy.data.images[c.name]
    if len(c.data.background_images) == 0:
        bg = c.data.background_images.new()
        bg.image = img

# Unlink the imported material and re-create it as "Original_Mat" with an emission node
#original_mat = bpy.data.materials.new(name="Original_Mat")
#original.material_slots[0].material = original_mat
#original_mat.use_nodes = True

# Place the object at the center
#xrs.place_at_center_bottom(original)
#TODO: use the camera rings to rotate and center the object
# Note: keep a dummy object with the original rotation/position
# Seperate cameras into rings - they should be close to being co-planner
# Remove outliers (need to be in a ring, etc..)
# Create a new mesh with verts at each camera position
# - make an ngon face
# - get the normal vector for this ring (repeat 3x)
# - average the vectors and rotate everything so they are up.
# - rings should have the smallest radius on top
# Find the rotation of the camera rings plane and rotate the object by this value
# -- Move up on z until the bottom most vert in the scan mesh
# -- Will still need the Front Rotation ...
# -- Also need the artist to set the proper z position, due to noise --

# Add a reference cube for the height (and other dims, eventually)
#bpy.ops.mesh.primitive_cube_add()
#cube = bpy.data.objects["Cube"]
#cube_size = int(model_height)/2000 # Divide in half, scale by 1,000 because the units are mm
#cube.scale = (cube_size,cube_size,cube_size)
#cube.location.z = cube_size

# Save the .blend
#bpy.ops.wm.save_mainfile(filepath=os.path.join(working_dir, model_name + ".blend"))
#xrs.quit()

### MANUAL WORK
# - Scale the object to fit the bounding box
# - Move on the z axis to remove junk on the bottom
# - Fix overlapping trianges (can some of this be automated?

### Save and run the next script: bake_model_from_scan ###

# Notes from fish shoppe model process
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
