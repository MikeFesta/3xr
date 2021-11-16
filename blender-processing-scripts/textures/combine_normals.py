# SPDX-License-Identifier: Apache-2.0
import bpy
import os
from xrs import automate as xra

xra.log_debug('Creating normalmap file');

args = xra.get_command_line_arguments()

base_filename = args[0]
detail_filename = args[1]
output_folder = args[2]
# Import each source image
# Link to the nodes
# Wait for the output to generate ??
# Save image
def render_post_handler(scene):
  """ Call back after Render is finished """
  xra.log_debug("Render Complete, saving image")
  bpy.data.images['Viewer Node'].file_format = 'PNG'
  bpy.data.images['Viewer Node'].save()

bpy.app.handlers.render_post.append(render_post_handler)

base_image = bpy.data.images.load(filepath=base_filename)
base_image.colorspace_settings.name = 'Non-Color'
base_image.pack()
detail_image = bpy.data.images.load(filepath=detail_filename)
detail_image.colorspace_settings.name = 'Non-Color'
detail_image.pack()

xra.log_debug('Images imported');

for node in bpy.context.scene.node_tree.nodes:
  if (node.label):
    if node.label == 'Base':
      xra.log_debug('Base image assigned');
      node.image = base_image
    elif node.label == 'Detail':
      xra.log_debug('Detail image assigned');
      node.image = detail_image

#bpy.data.images['Viewer Node'].filepath_raw = os.path.join(output_folder, 'test.png')
#bpy.ops.render.render()
#xra.log_debug("Render Instruction Complete")

xra.save_as(output_folder, "normalmap_combine")
