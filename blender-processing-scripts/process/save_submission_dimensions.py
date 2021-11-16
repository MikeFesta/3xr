# SPDX-License-Identifier: Apache-2.0
'''
Blender 2.81
Setting the dimensions of the web collection to asset_submission in the database
'''
import bpy
from xrs import automate as xra

argv = xra.get_command_line_arguments()
name = xra.get_filename();
working_dir = xra.get_dir();

submission_id = int(argv[0])
xra.log_info("Getting Dimensions of Submission " + str(submission_id))

# Get the units of the file
xra.log_info(bpy.context.scene.unit_settings.length_unit)
unit_type_id = 1 # Meters
if (bpy.context.scene.unit_settings.length_unit == 'INCHES'):
  unit_type_id = 2

# Collections
if "web" not in bpy.data.collections:
  xra.log_error('Web Collection Not Found')
  exit(1)

collection = bpy.data.collections["web"]
if len(collection.objects) == 0:
  xra.log_error('No objects in the web collection')
  exit(1)
elif len(collection.objects) > 1:
  # Multi-objects, merge their meshes and measure that object
  xra.join_collection_objects_into_one("web");

o = collection.objects[0]
x = o.dimensions.x
y = o.dimensions.y
z = o.dimensions.z
if unit_type_id == 2:
  # Convert meters to inches
  x = x * 39.3701
  y = y * 39.3701
  z = z * 39.3701
xra.log_info(str(round(x,3)) + ', ' + str(round(y,3)) + ', ' + str(round(z,3)))

# Submit to 3xr.com
triangle_count = xra.get_total_tricount('web')
xra.log_info('Triangle Count: ' + str(triangle_count))
light_count = xra.get_total_light_count('lights')
xra.log_info('Light Count: ' + str(light_count))
xra.set_submission_dimensions(submission_id, unit_type_id, x, y, z, triangle_count, light_count);
