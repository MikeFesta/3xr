# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Log related functions
"""

def debug(message):
  """ Print a color coded debug message to the console """
  print("\033[94m" + message + "\033[0m")

def error(message):
  """ Print a color coded error to the console """
  print("\033[91m" + "ERROR: " + message + "\033[0m")

def info(message):
  """ Print a color coded info message to the console """
  print("\033[92m" + message + "\033[0m")

def silly(message):
  """ Print a color coded silly message to the console """
  print("\033[95m" + message + "\033[0m")

def verbose(message):
  """ Print a color coded verbose message to the console """
  print("\033[96m" + message + "\033[0m")

def warn(message):
  """ Print a color coded warning to the console """
  print("\033[93m" + "Warning: " + message + "\033[0m")
