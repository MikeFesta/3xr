# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Functions for exiting blender
"""
import bpy
import sys
import xrs.log

def quit_with_error(message):
  """ Log an error message and raise a system error """
  xrs.log.error(message)
  # TODO: Look into why this has a segfault on exit
  sys.exit(message)

def quit():
  """ Tell blender to quit """
  xrs.log.verbose("Telling Blender to Quit")
  bpy.ops.wm.quit_blender()
