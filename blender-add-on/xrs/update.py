# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Keep the plugin up-to-date
"""
import bpy
import addon_utils
import json
import ssl
import requests
import xrs.log

def check():
  """ Check the latest version """
  installed_version = get_installed_version()
  server_version = get_server_version()
  if installed_version == server_version:
    return 'Your add-on is up to date'
  elif server_version == '':
    # TODO: this may happen on first load before the api token is loaded
    return 'Error getting the add-on version from the server'
  else:
    return 'A newer version (' + str(server_version) + ') is available at 3xr.studio'

def get_installed_version():
  """ Read and format the current add-on version """
  installed_version = ([addon.bl_info.get('version', (-1,-1,-1)) for addon in addon_utils.modules() if addon.bl_info['name'] == '3XR Studio'][0])
  return '.'.join(map(str,installed_version))

def get_server_version():
  """ Read the latest version from the server """
  ssl._create_default_https_context = ssl._create_unverified_context
  url = "https://www.3xr.com/a/addon/check_for_update"
  uid = ''
  if bpy.context.scene.xr_studio:
    uid = bpy.context.scene.xr_studio.product_uid
  data = {
    'apiToken': bpy.context.preferences.addons['xrs'].preferences.api_token,
    'uid': uid,
    'version': get_installed_version()
  }
  response = requests.post(url, data=data)
  if (response.ok):
    server_version = response.json()
    return server_version
  else:
    return ''

def current_version_matches_latest():
  """ Check if the server version matches the installed version """
  installed_version = get_installed_version()
  server_version = get_server_version()
  return installed_version == server_version

def record_asset_submission_render(submission_id, render):
  """ Save a record of a single render for a submission """
  ssl._create_default_https_context = ssl._create_unverified_context
  url = "https://www.3xr.com/a/submission/record_render"
  data = {
    'submissionId': submission_id,
    'render': render,
  }
  response = requests.post(url, data=data)
  if (response.ok):
    if response.json() == "success":
      return True
    else:
      return False
  else:
    return False

def record_asset_has360(asset_uid):
  """ Update an asset to show that it has a 360 spin """
  ssl._create_default_https_context = ssl._create_unverified_context
  url = "https://mfesta.dev.3xr.com/a/asset/set_has360"
  data = {
    'uid': asset_uid,
  }
  response = requests.post(url, data=data)
  if (response.ok):
    if response.json() == "success":
      return True
    else:
      return False
  else:
    return False

def record_asset_submission_renders(submission_id, renders):
  """ Save a record of renders for a submission """
  ssl._create_default_https_context = ssl._create_unverified_context
  url = "https://www.3xr.com/a/submission/record_renders"
  # TODO: this breaks when renders is an array with a single value, the backend treats the string as a character array
  # {"submissionId": "778", "renders": ["dreas_chair-2k.png"]} fails
  # {"submissionId": "778", "renders": ["dreas_chair-2k.png", "dreas_chair-top-2k.png"]} works
  data = {
    'submissionId': submission_id,
    'renders': renders,
  }
  response = requests.post(url, data=data)
  if (response.ok):
    if response.json() == "success":
      return True
    else:
      return False
  else:
    return False
