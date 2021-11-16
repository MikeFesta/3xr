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
import math
from xrs import tools as xrs

clockwise = False # We've been scanning clockwise on our rig, but Snap36 may be counter-clockwise, may want to make this a parameter

def get_row_name(camera_name):
  return 'R0' + camera_name.split('_R0')[1].split('_')[0]

def get_camera_number(camera_name):
  return int(camera_name.split('_C')[1])

model_name = xrs.get_filename_no_ext()
#creating a new view layer is not currently working with update_scene
#initial_view_layer = bpy.context.window.view_layer
xrs.show_all()
xrs.set_object_mode()
# TODO: Bug Fix Needed
# The only objects being un-parented properly are on the selected layer when the script is run
# this is related to xrs.update_scene() and the data not being applied to those objects
# before they get unlinked
# Manual testing showed that the action of switching collections on the object browser
# locks in the changes needed, but not just interacting with the 3D scene
# TODO: only render_layer objects are being updated properly when unlinking
exclude_from_parenting = ["MeshroomCenter", "DimensionsCube"]

# Create an empty with the original position/rotation from meshroom$
if "MeshroomCenter" not in bpy.data.objects:
  meshroom_center = bpy.data.objects.new("MeshroomCenter", None)
  bpy.context.scene.collection.objects.link(meshroom_center)
else:
  meshroom_center = bpy.data.objects["MeshroomCenter"]

if "Meshroom Data" not in bpy.data.collections:
  meshroom_data_collection = bpy.data.collections.new("Meshroom Data")
  bpy.context.scene.collection.children.link(meshroom_data_collection)
else:
  meshroom_data_collection = bpy.data.collections["Meshroom Data"]

if "MeshroomCenter" not in meshroom_data_collection:
  meshroom_data_collection.objects.link(meshroom_center)
  bpy.context.scene.collection.objects.unlink(meshroom_center)

# Get Cameras - assume that only meshroom cameras are here
cameras = xrs.get_all_cameras()
unaligned_cameras = []
rows = {}
row_normals = []
average_rows_normal = mathutils.Vector((0,0,0))

# Identify un-aligned cameras
for camera in cameras:
  if (camera.location.x == 0 and camera.location.y == 0 and camera.location.z == 0):
    unaligned_cameras.append(camera)
xrs.print_status(str(len(unaligned_cameras)) + " cameras not aligned")

for camera in cameras:
  # Find the row based on the name (assumes meshroom camera, snap36 image name with _R0#_C#)
  row_name = get_row_name(camera.name)

    # Bucket cameras into rows
  if row_name not in rows:
    xrs.print_status("Creating array for row " + row_name)
    rows[row_name] = {}

  if camera not in unaligned_cameras:
    xrs.print_status("Adding camera " + camera.name + " to row " + row_name)
    rows[row_name][camera.name] = camera

for row_name in rows:
  camera_name_prefix = "_".join(list(rows[row_name].keys())[0].split("_")[:-1]) + "_C"
  xrs.print_status("Prefix: " + camera_name_prefix)

  # Create an empty mesh object
  if row_name not in bpy.data.objects:
    mesh = bpy.data.meshes.new(row_name + "_Mesh")
    obj = bpy.data.objects.new(row_name, mesh)
  else:
    obj = bpy.data.objects[row_name]

  if row_name not in meshroom_data_collection.objects:
    meshroom_data_collection.objects.link(obj)
  if row_name in bpy.context.scene.collection.objects:
    bpy.context.scene.collection.objects.unlink(obj)

  # Use a bmesh to store the vertices, edges, faces
  bm = bmesh.new()

  # Create vertices at each camera location
  vert_index_names = {}
  for camera_name in rows[row_name]:
    v = bm.verts.new(rows[row_name][camera_name].location)
    v.index = len(bm.verts)-1
    vert_index_names[camera_name] = v.index
    xrs.print_status("Adding vertex for camera " + camera_name);

  # Update vertex data
  bm.verts.ensure_lookup_table()

  # Create a face for all good cameras
  face_verts = []
  xrs.print_status("Number of cameras in row " + row_name + " = " + str(len(bm.verts)))
  if (clockwise):
    for index in range(0, len(bm.verts)-1, 1): # 0 .. 23
      face_verts.append(bm.verts[index])
  else:
    # If counter-clockwise, reverse the list order for the correct normal up direction
    for index in range(len(bm.verts)-1, -1, -1): # 23 .. 0
      face_verts.append(bm.verts[index])
  xrs.print_status("Creating face for good cameras");

  face = bm.faces.new(face_verts)
  face.normal_update()
  average_rows_normal += face.normal

  # Delete the edges (and the face) because they interfere with center calculation
  for edge in bm.edges:
      bm.edges.remove(edge)

  # Create an edge between each (correct) camera pair
  # TODO: Assuming 24 cameras, this should be made more generic
  for first_camera_number in range(12):
    first_camera_name = camera_name_prefix + str(first_camera_number+1).zfill(2)
    second_camera_name = camera_name_prefix + str(first_camera_number+13).zfill(2)
    if first_camera_name in vert_index_names and second_camera_name in vert_index_names:
      bm.edges.new([bm.verts[vert_index_names[first_camera_name]], bm.verts[vert_index_names[second_camera_name]]])
    else:
      xrs.print_warning("Cannot Link " + first_camera_name + " with " + second_camera_name + " because one is not aligned")

  # Assign the data to the mesh of the object
  bm.to_mesh(obj.data)
  bm.free()

# Average the normal vectors from each row
average_rows_normal /= len(rows)

# Globally rotate everything to match average camera normal vector
target_rotation = mathutils.Vector((0, 0, -1))
new_rotation = average_rows_normal.rotation_difference(target_rotation).to_matrix()

# Parent objects to meshroom_center
for obj in bpy.data.objects:
  if obj.name not in exclude_from_parenting:
    obj.parent = meshroom_center
    #TODO: Keep transform?
    #obj.matrix_parent_inverse = meshroom_center.matrix_world.copy().inverted()

# Perform the Rotation
meshroom_center.matrix_world = new_rotation.to_4x4()
xrs.update_scene()

# Unparent all objects
for obj in bpy.data.objects:
  if obj.parent:
    xrs.clear_parent_keep_transform(obj)

# Force a refresh to matrix_world values
xrs.update_scene()

# Get the average center location for each row (using the edges)
average_center = mathutils.Vector((0, 0, 0))
for row_name in rows:
  obj = bpy.data.objects[row_name]
  bm = bmesh.new()
  bm.from_mesh(obj.data)
  row_center = mathutils.Vector((0, 0, 0))
  #TODO: Need to limit to only the edges going through the center
  for edge in bm.edges:
    row_center += xrs.get_edge_center(edge)
  row_center /= len(bm.edges)
  bm.free()
  global_row_center = xrs.multiply_matrix(obj.matrix_world.copy(), row_center)
  average_center += global_row_center
average_center /= len(rows)

# Get lowest point on the mesh (low res, when available)
if model_name + "_low_res" in bpy.data.objects:
  object_to_zero = bpy.data.objects[model_name + "_low_res"]
else:
  object_to_zero = bpy.data.objects["Original"]
low_point = xrs.get_lowest_point_of_object(object_to_zero)

# Parent all objects to meshroom_center (except dimensions cube, if it exists)
for obj in bpy.data.objects:
  if obj.name not in exclude_from_parenting:
    obj.parent = meshroom_center
    obj.matrix_parent_inverse = meshroom_center.matrix_world.copy().inverted()

# Globally move to x = 0, y = 0
meshroom_center.location.x -= average_center.x
meshroom_center.location.y -= average_center.y
meshroom_center.location.z -= low_point.z

# Scale to fit the target height (low res)

# Force a refresh to matrix_world values
xrs.update_scene()

# Unparent all objects
for obj in bpy.data.objects:
  if obj.parent:
    xrs.clear_parent_keep_transform(obj)

# Rotate such that Camera C01 is the front

# Fix un-aligned cameras
def get_closest_aligned_camera(row_name, camera_number):
    """ Search forward and backwards for the nearest camera """
    # TODO: remove global unaligned_cameras dependancy
    # Going to skip this for now and just grab any aligned camera
    for c in cameras:
        if c not in unaligned_cameras:
            row = get_row_name(c.name)
            if row == row_name:
                return c

def fix_camera_alignment(camera):
    """ Find another aligned camera in the same row, copy, rotate """
    row_name = get_row_name(camera.name)
    camera_number = get_camera_number(camera.name)
    closest_camera = get_closest_aligned_camera(row_name, camera_number)
    camera.location = closest_camera.location
    camera.rotation_euler = closest_camera.rotation_euler
    closest_camera_number = get_camera_number(closest_camera.name)
    rotation_amount_degrees = (math.pi / 12) * (camera_number - closest_camera_number)
    empty_pivot = bpy.data.objects.new("EmptyPivot", None)
    camera.parent = empty_pivot
    empty_pivot.rotation_euler.z = rotation_amount_degrees
    xrs.update_scene()
    xrs.clear_parent_keep_transform(camera)
    bpy.data.objects.remove(empty_pivot)

for camera in unaligned_cameras:
    fix_camera_alignment(camera)

# Restore original view layer (not currently working with update_scene)
#bpy.context.window.view_layer = initial_view_layer

# Hide Camera Loop Geometry
#for row_name in rows:
#  bpy.data.objects[row_name].hide_viewport = True

#xrs.save();
