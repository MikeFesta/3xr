# SPDX-License-Identifier: Apache-2.0
'''
Blender 2.90
Renaming file with a new name requires elements in the file to be renamed
'''
import bpy
import re
from xrs import automate as xra

argv = xra.get_command_line_arguments()
new_name = xra.get_filename();
working_dir = xra.get_dir();

old_name = argv[0]
xra.log_info("Renaming elements in blend file from " + old_name + " to " + new_name)

# Images
for i in bpy.data.images:
    if (i.name.startswith(old_name)):
        xra.log_info("Renaming " + i.name + " (Image) to " + re.sub(old_name, new_name, i.name))
        i.name = re.sub(old_name, new_name, i.name)

        # Change the filepath to the current directory, which is where the image now lives on the server
        new_source = re.sub("\.\.\/textures\/", "", re.sub(old_name, new_name, i.filepath))
        xra.log_info("New Source: " + new_source)
        # It should have a packed file, need to change the filepath on the packed file first
        if (len(i.packed_files) > 0):
            i.packed_files[0].filepath = new_source
            xra.log_debug(i.packed_files[0].filepath)
        else:
            xra.log_debug("Image not packed")
        i.filepath = new_source

# Objects
for o in bpy.data.objects:
    if (o.name.startswith(old_name)):
        name = re.sub(old_name, new_name, o.name)
        xra.log_info("Renaming " + o.name + " (Object) to " + name)
        o.name = name

# Meshes
for m in bpy.data.meshes:
    if (m.name.startswith(old_name)):
        name = re.sub(old_name, new_name, m.name)
        xra.log_info("Renaming " + m.name + " (Mesh) to " + name)
        m.name = name

# Materials
for m in bpy.data.materials:
    if (m.name.startswith(old_name)):
        name = re.sub(old_name, new_name, m.name)
        xra.log_info("Renaming " + m.name + " (Material) to " + name)
        m.name = name
        # Rename all Nodes in this material
        for n in m.node_tree.nodes:
            if n.type == 'TEX_IMAGE':
                n.name = n.image.name

# TODO: not writable
xra.save_as(xra.get_dir(), "renamed")
