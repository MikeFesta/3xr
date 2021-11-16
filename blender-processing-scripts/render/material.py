# SPDX-License-Identifier: Apache-2.0
'''
Blender 2.81
Renaming material and setting basic values
'''
import bpy
from xrs import automate as xra

argv = xra.get_command_line_arguments()
name = xra.get_filename();
working_dir = xra.get_dir();

resolution = int(argv[0])
xra.log_info("Rendering Material " + name + " at " + str(resolution) + "x" + str(resolution))
xra.set_renderer_to_cycles()
xra.set_render_resolution(resolution,resolution)
xra.set_render_filepath_with_format(xra.get_sibling_dir("final") + name + "-" + str(resolution), "JPEG")
xra.log_info("Render Starting")
# bug fix - camera not being found by default
bpy.context.scene.camera = bpy.data.objects['Camera']
xra.render_and_save()
xra.log_info("Render Finished")
