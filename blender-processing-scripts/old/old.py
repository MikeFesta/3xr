# SPDX-License-Identifier: Apache-2.0
'''
Blender 2.80
For scans captured on a turntable, we can orientate the object up and center it
based on the camera rings, as well as fix the position of un-aligned cameras,
provided that there are enough aligned cameras.
'''
import bpy
import bmesh
import mathutils
from xrs import tools as xrs

print("Rotating and centering "+model_name+" by cameras from directory "+working_dir)

# Create an empty with the original position/rotation from meshroom$
if "MeshroomCenter" not in bpy.data.objects:
  meshroom_center = bpy.data.objects.new("MeshroomCenter", None)
  bpy.context.scene.collection.objects.link(meshroom_center)
else:
  meshroom_center = bpy.data.objects["MeshroomCenter"]
  # TODO: May want to put this in a Meshroom Collection with point-cloud

# Get Cameras - assume that only meshroom cameras are here
# TODO: May need to turn on the layer
cameras = xrs.get_all_cameras()
unaligned_cameras = []
rows = {}
row_normals = []
average_rows_normal = mathutils.Vector((0,0,0))

# Identify un-aligned cameras
for camera in cameras:
  if (camera.location.x == 0 and camera.location.y == 0 and camera.location.z == 0):
    unaligned_cameras.append(camera)

for camera in cameras:
  # Find the row based on the name (assumes meshroom camera)
  row_name = camera.name.split('_')[2]

    # Bucket cameras into rows
  if row_name not in rows:
    rows[row_name] = {}

  if camera not in unaligned_cameras:
    rows[row_name][camera.name] = camera

for row_name in rows:
    camera_name_prefix = "_".join(list(rows[row_name].keys())[0].split("_")[:-1]) + "_C"

    # Create an empty mesh object
    if row_name not in bpy.data.objects:
      mesh = bpy.data.meshes.new(row_name + "_Mesh")
      obj = bpy.data.objects.new(row_name, mesh)
      bpy.context.scene.collection.objects.link(obj)
    else:
      mesh = bpy.data.meshes[row_name + "_Mesh"]
      obj = bpy.data.objects[row_name]
      obj.rotation_euler = mathutils.Vector((0.0, 0.0, 0.0))

    # Use a bmesh to store the vertices
    bm = bmesh.new()

    # Create vertices at each camera location
    vert_index_names = {}
    for camera_name in rows[row_name]:
      v = bm.verts.new(rows[row_name][camera_name].location)
      v.index = len(bm.verts)-1
      vert_index_names[camera_name] = v.index

    bm.verts.ensure_lookup_table()

    # Create an edge between each (correct) camera pair
    # Assuming 24 cameras, this should be made more generic
    for first_camera_number in range(12):
      first_camera_name = camera_name_prefix + str(first_camera_number+1).zfill(2)
      second_camera_name = camera_name_prefix + str(first_camera_number+13).zfill(2)
      if first_camera_name in vert_index_names and second_camera_name in vert_index_names:
        bm.edges.new([bm.verts[vert_index_names[first_camera_name]], bm.verts[vert_index_names[second_camera_name]]])
      else:
        print("Warning: Cannot Link " + first_camera_name + " with " + second_camera_name + " because one is not aligned")

    # Create a face for all good cameras
    # Note, reverse the list order for the correct normal up direction
    face_verts = []
    for index in range(len(bm.verts)-1, -1, -1):
        face_verts.append(bm.verts[index])
    face = bm.faces.new(face_verts)
    face.normal_update()
    average_rows_normal += face.normal
    print(average_rows_normal)

    # Assign the data to the mesh
    bm.to_mesh(mesh)
    bm.free()

# Average the normal vectors from each row
average_rows_normal /= len(rows)

# Globally rotate everything to match average camera normal vector
target_rotation = mathutils.Vector((0, 0, 0))
new_rotation = average_rows_normal.rotation_difference(target_rotation).to_matrix()

excluded_objects = ["MeshroomCenter", "DimensionsCube"]
# Parent all objects to meshroom_center (except dimensions cube, if it exists)
for obj in bpy.data.objects:
    if obj.name not in excluded_objects:
        obj.parent = meshroom_center

meshroom_center.matrix_world = new_rotation.to_4x4()

# Unparent all objects
for obj in bpy.data.objects:
    if obj.name not in excluded_objects:
        desired_matrix = obj.matrix_world.copy()
        obj.parent = None
        obj.matrix_world = desired_matrix

# Get the average center location for each row (using the edges)

# Globally move to 0,0,0

# Rotate such that Camera C01 is the front

# Move bottom to lowest point on the mesh (low res, when available)

# Fix un-aligned cameras

#xrs.save();
