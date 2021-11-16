# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Sync data with x.3xr.com
"""
import bpy
import json
import os
import ssl
import urllib.parse
import urllib.request
import xrs.log
import xrs.product

def pull():
  """ Pull data down from x.3xr.com """
  xrs.log.debug('Pull Data from x.3xr.com');
  if (xrs.product.validate_user()):
    xrs.log.debug('User + Product are valid');
  return {'FINISHED'}

def push():
  """ Push data up to x.3xr.com """
  xrs.log.debug('Push Data to x.3xr.com');
  if (xrs.product.validate_user()):
    xrs.log.debug('User + Product are valid');
  return {'FINISHED'}
