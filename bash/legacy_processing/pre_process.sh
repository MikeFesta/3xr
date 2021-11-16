#! /bin/bash
# SPDX-License-Identifier: Apache-2.0
#name=""
#height=""
#width=""
#depth=""

## Steps to move into pre-process ##

# Create Project Report

# Center the model based on camera rings
#center_scan_from_cameras.sh -n $(name)

# Create a dimensions cube
#add_dimensions_cube.sh -n $(name) -h $(height) -w $(width) -d $(depth) -i true

# Scale the {final} object to fit dimensions cube
## HUMAN TASK ##

# Consistent naming for meshes, materials, images
## HUMAN TASK ##

# Ensure the layers are visable
## HUMAN TASK  - Will be automated eventually ##

###############################################################################
### POST PROCESSING
###############################################################################

# Update Project Report File - eventually post to the server
## Cameras Aligned (pre-processing)
## Cameras Auto-Fixed ie) how many still at 0,0,0
## Triangle Count
## Material Slot Values (metallic, roughness)
## Textures Linked

# IMAGE MAGIK
# Resize images (4k, 2k, 1k) - Run again after AO / Normal bake
#resize_textures.sh -n $(name)

# Export high res + low res mesh as .obj
#export_high_res_low_res_obj.sh -n $(name)

# Create 2.79 .blend file /279_{name}.blend from template
# - Import .obj files
#create_blender_279_file.sh -n $(name)

# Add Ground Plane for AO

# Bake AO (low res model)

# Bake Normals (high to low)

# Create gltf material based on material settings (images provided)

# Render Preview Image

# Export .glb file

# Export .obj (100x scale)

# OSX - Put in in a job queue on the server
# Create .usdz

# Upload files to the website
