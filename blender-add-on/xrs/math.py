# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Filepath related functions
"""
import bpy
import math
import os

def round_to_fives(value):
  """ Round a value to the nearest 5 """
  return (math.floor((value/5)+0.5)*5)
