# SPDX-License-Identifier: Apache-2.0
'''
Blender 2.90
xrs plugin required
Assign the product uid and name to the scene settings
'''
import bpy
from xrs import automate as xra

argv = xra.get_command_line_arguments()
name = xra.get_filename();
working_dir = xra.get_dir();

product_uid = argv[0]
xra.log_info("Setting product name to " + str(name))
xra.log_info("Setting product uid to " + str(product_uid))

xra.set_product_name(name)
xra.set_product_uid(product_uid)

xra.save();
