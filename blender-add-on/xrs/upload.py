# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Upload files to x.3xr.com
"""
import bpy
import json
import os
import ssl
import requests
import xrs.filename
import xrs.log
import xrs.material
import xrs.product
import xrs.update
import xrs.save

def push():
  """ Push data up to x.3xr.com """
  xrs.log.debug('Push Data to x.3xr.com');
  if (xrs.product.validate_user()):
    xrs.log.debug('User + Product are valid')
  return {'FINISHED'}

def ready_for_submission():
  """ Check with the server to see if the product can be (re)submitted """
  ssl._create_default_https_context = ssl._create_unverified_context
  url = "https://www.3xr.com/a/product/ready_to_submit"
  data = {
    'uid': bpy.context.scene.xr_studio.product_uid,
    'apiToken': bpy.context.preferences.addons['xrs'].preferences.api_token,
  }
  response = requests.post(url, data=data)
  if (response.ok):
    obj = response.json()
    if (obj['ready'] == True):
      return ''
    else:
      return str(obj['message'])
  else:
    return 'Unable to check if ready for submission'

def set_submission_dimensions(submission_id, unit_type_id, width, depth, height, triangle_count, light_count):
  """ Update the submission record to include the dimensions """
  ssl._create_default_https_context = ssl._create_unverified_context
  url = "https://www.3xr.com/a/asset/set_submission_dimensions"
  data = {
    'id': submission_id,
    'unitTypeId': unit_type_id,
    'height': height,
    'width': width,
    'depth': depth,
    'triangleCount': triangle_count,
    'lightCount': light_count,
  }
  response = requests.post(url, data=data)
  if (response.ok):
    return response.json()
  else:
    return 'Unable to set submission dimensions'


def submit_product(skip_uvs = False):
  """ Upload the current blender file and all textures """
  xrs.collection.remove_spaces_from_image_names()
  xrs.material.make_opaque()
  xrs.save.save()
  if (skip_uvs == False):
    xrs.material.uv_layout_export()

  # Check that the add-on is up to date
  if (xrs.update.current_version_matches_latest() == False):
    return 'Your add-on needs to be updated before submission'

  # Check that the Product is ready for a new submission to prevent duplicates
  ready_for_submission_error = ready_for_submission()
  if (ready_for_submission_error != ''):
    xrs.log.error("Not ready for submission")
    xrs.log.error(ready_for_submission_error)
    return ready_for_submission_error

  ssl._create_default_https_context = ssl._create_unverified_context
  url = "https://x.3xr.com/upload/submit_product"
  data = {
    'uid': bpy.context.scene.xr_studio.product_uid,
    'api_token': bpy.context.preferences.addons['xrs'].preferences.api_token,
  }
  files = {
    'blend': open(bpy.data.filepath, 'rb'),
  }
  texture_path = xrs.filename.get_sibling_dir('textures')
  all_texture_files = os.listdir(texture_path)
  textures = []
  for t in all_texture_files:
    if (
      t.endswith('4k_ao.png') or
      t.endswith('4k_diffuse.png') or
      t.endswith('4k_emissive.png') or
      t.endswith('4k_metallic.png') or
      t.endswith('4k_normal.png') or
      t.endswith('4k_opacity.png') or
      t.endswith('4k_roughness.png') or
      t.endswith('4k_UVs.png') or # NOTE: we should be able to stop here and only collect 4k
      t.endswith('2k_ao.png') or
      t.endswith('2k_diffuse.png') or
      t.endswith('2k_emissive.png') or
      t.endswith('2k_metallic.png') or
      t.endswith('2k_normal.png') or
      t.endswith('2k_roughness.png') or
      t.endswith('2k_opacity.png') or
      t.endswith('1k_ao.png') or
      t.endswith('1k_diffuse.png') or
      t.endswith('1k_emissive.png') or
      t.endswith('1k_metallic.png') or
      t.endswith('1k_normal.png') or
      t.endswith('1k_opacity.png') or
      t.endswith('1k_roughness.png')
    ):
      textures.append(t)
  if (len(textures) == 0):
    return 'Unable to submit without textures. Bake first or check your texture naming conventions!'

  i = 1
  for t in textures:
    files['texture'+str(i)] = open(texture_path + t, 'rb')
    i = i + 1
  response = requests.post(url, data=data, files=files)

  if (response.ok):
    message = response.json()
    if (message == 'success'):
      return ''
    else:
      return message
  else:
    return 'Unable to upload'
