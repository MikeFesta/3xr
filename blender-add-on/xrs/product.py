# SPDX-License-Identifier: Apache-2.0
import bpy
import json
import os
import ssl
import urllib.parse
import urllib.request
import xrs.log
import xrs.upload
import xrs.validate

def set_name(name):
  """ Set the name """
  bpy.context.scene.xr_studio.product_name = name

def set_uid(uid):
  """ Set the product_uid """
  bpy.context.scene.xr_studio.product_uid = uid

def submit():
  """ Uploads the product data to x.3xr.com and starts processing """
  xrs.log.debug('Submit to 3XR - if valid');
  error_message = xrs.validate.submission()
  if error_message:
    return error_message
  else:
    xrs.log.debug('Valid, submitting')
    return xrs.upload.submit_product()

def validate_user():
  """ Authenticate the user is assigned to the product """
  xrs.log.debug('Checking product uid with user api_token')

  ssl._create_default_https_context = ssl._create_unverified_context
  url = "https://www.3xr.com/a/product/blender_details"
  values = {
    'uid' : bpy.context.scene.xr_studio.product_uid,
    'api_token' : bpy.context.preferences.addons['xrs'].preferences.api_token,
  }
  data = urllib.parse.urlencode(values).encode("utf-8")
  request = urllib.request.Request(url, data)
  response = urllib.request.urlopen(request)
  data = json.loads(response.read())
  print(data)
  if data is None:
    xrs.log.debug('Invalid Product')
    return False
  else:
    xrs.log.debug(data['blendName'])
    return True
