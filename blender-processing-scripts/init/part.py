# SPDX-License-Identifier: Apache-2.0
'''
Blender 2.90
Renaming part and removing any packed textures
'''
import bpy
import math
from xrs import automate as xra

argv = xra.get_command_line_arguments()
name = xra.get_filename();
working_dir = xra.get_dir();

uid = argv[0]
bake_ao = argv[1]
remake_ao_uvs = argv[2]
xra.log_info("Setting Part uid: " + uid)

# NOTE: will probably store these as part_ or remove product_ in the variable name
xra.set_product_name(name)
xra.set_product_uid(uid)

# Remove content from the master collection (this may change in the future)
master_objects = xra.get_objects_in_collection('master')
for obj in master_objects:
  if (obj.name not in bpy.data.collections['web'].objects):
    xra.log_info('DELETING ' + obj.name)
    xra.delete_object_with_name(obj.name)

# Rename the object, mesh, material with the part name (filename)
xra.auto_name()

# Remove all images, they get recomposited later
for i in bpy.data.images:
  xra.log_debug("Remove image named " + i.name)
  bpy.data.images.remove(i)

# If a material name has _clip or _clear, make sure the blend mode on the material is set
# TODO: move this in to xrs
for mat in bpy.data.materials:
  if mat.name.endswith('_clear'):
    mat.blend_method = 'BLEND'
  elif mat.name.endswith('_clip'):
    mat.blend_method = 'CLIP'

if remake_ao_uvs:
  # join all parts
  # NOTE: blender 2.90 seems to allow edit mode for multiple objects
  xra.join_collection_objects_into_one('web')

  # select the ao_map uv set, or create it if it does not exist
  obj = bpy.data.collections['web'].objects[0]
  ao_uvs_found = False
  for uv in obj.data.uv_layers:
    if uv.name == 'ao_map':
      xra.log_debug('ao_map UV layer found')
      ao_uvs_found = True
      uv.active = True
      uv.active_render = True

  # Create a new uv layer if not found
  if ao_uvs_found == False:
    xra.log_debug('creating uvs for ao')
    uv = obj.data.uv_layers.new(name='ao_map')
    uv.active = True
    uv.active_render = True

  # smart uv project, island margin 0.04 (~16px)
  xra.select_object(obj)
  xra.set_edit_mode()
  bpy.ops.mesh.select_all(action = 'SELECT')
  bpy.ops.uv.smart_project(
    island_margin=0.04,
    use_aspect=True, # TODO: 2.92 calls this correct_aspect
    stretch_to_bounds=True # TODO: 2.92 calls this scale_to_bounds
  )

if bake_ao:
  # currently assuming one object with 1 or more materials
  # create the _ao bake image on each material
  xra.log_debug('Bake ao')
  xra.set_renderer_to_cycles()
  xra.use_gpu_for_render()

  xra.log_debug('select object')
  obj = bpy.data.collections['web'].objects[0]
  obj.hide_render = False
  xra.select_object(obj)
  xra.log_debug('smooth polygons')
  for face in obj.data.polygons:
    face.use_smooth = True
  xra.log_debug('set autosmooth')
  obj.data.use_auto_smooth = True
  xra.log_debug('autosmooth set')
  obj.data.auto_smooth_angle = math.pi/6 # 30 degrees
  xra.log_debug('angle set')
  # create the 4k ao image file
  image_name = xra.get_filename() + '_4k_ao'
  xra.log_debug('creating image')
  img = bpy.data.images.new(name=image_name, width=4096, height=4096)
  #img = bpy.data.images.new(name=image_name, width=1024, height=1024)
  bpy.context.scene.cycles.samples = 1024
  #bpy.context.scene.cycles.samples = 64
  img.filepath = (xra.get_sibling_dir('textures') + img.name + '.png')
  xra.log_debug('Setting texture slots')
  for slot in obj.material_slots:
    mat = slot.material
    # Remove all existing texture nodes and normal map nodes
    for node in mat.node_tree.nodes:
      if node.type == 'TEX_IMAGE':
        mat.node_tree.nodes.remove(node)
    xra.log_debug('Setting active image texture to ao for ' + mat.name)
    nodes = mat.node_tree.nodes
    tex = nodes.new(type='ShaderNodeTexImage')
    tex.image = img
    tex.select = True
    nodes.active = tex
    # link the image and make it active in each material
  bpy.context.scene.render.bake.use_selected_to_active = False
  bpy.ops.object.bake('INVOKE_DEFAULT', type='AO', save_mode='EXTERNAL')
  img.save()

if remake_ao_uvs:
  xra.log_debug('break mesh back into parts and rename')
  # separate meshes by material
  # TODO: is there a way to avoid ops?
  obj = bpy.data.collections['web'].objects[0]
  xra.select_object(obj)
  xra.set_edit_mode()
  bpy.ops.mesh.separate(type='MATERIAL')
  xra.auto_name()
  xra.auto_name() #Note: running twice to prevent .001 when swapping

# Set active uv map back to web
for obj in bpy.data.collections['web'].objects:
  for uv in obj.data.uv_layers:
    if uv.name == 'web':
      uv.active = True
      uv.active_render = True

xra.log_debug('Done')
xra.save()
