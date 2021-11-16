# SPDX-License-Identifier: Apache-2.0
'''
Blender 2.81
Save the alpha, metallic, and roughness values for all low_res collection materials
'''
import bpy
from xrs import automate as xra

working_dir = xra.get_dir();

xra.log_info("Saving Values for low_res materials")

# Collections
if "web" not in bpy.data.collections:
  xra.log_error('Web Collection Not Found')
  exit(1)

collection = bpy.data.collections["web"]
if len(collection.objects) == 0:
  xra.log_error('No objects in the web collection')
  exit(1)

for obj in collection.objects:
  for slot in obj.material_slots:
    # Alpha (only when no inputs are linked)
    if (xra.get_material_alpha_link_count(slot.material) == 0):
      alpha = 100 * xra.get_material_alpha_value(slot.material)
      alpha = xra.round_to_fives(alpha)
      # Only save if not 1.0 (100)
      if alpha < 100:
        with open(working_dir + slot.material.name + "_alpha.value", "w") as file:
          file.write("%i" % alpha)

    # Metallic
    metallic = 100 * xra.get_material_metallic_value(slot.material)
    metallic = xra.round_to_fives(metallic)
    with open(working_dir + slot.material.name + "_metallic.value", "w") as file:
      file.write("%i" % metallic)

    # Roughness
    roughness = 100 * xra.get_material_roughness_value(slot.material)
    roughness = xra.round_to_fives(roughness)
    with open(working_dir + slot.material.name + "_roughness.value", "w") as file:
      file.write("%i" % roughness)
