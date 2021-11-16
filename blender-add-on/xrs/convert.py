# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Conversion functions
"""

def linearRGBtoSRGB(color):
  """ Convert a grayscale value (single channel) value from Linear to sRGB """
  # Note that range of input should be 0 to 1
  if color > 1:
    return 1
  elif color < 0.00313:
    return color * 12.92
  else:
    return (((color ** (1/2.4)) * 1.055) - 0.055)

def sRGBToLinearRGB(color):
  """ Convert a grayscale value (single channel) value from sRGB to Linear """
  # Note that range of input should be 0 to 1
  if color < 0:
    return 0
  elif color < 0.04045:
    return color/12.92
  else:
    return (((color + 0.055) / 1.055) ** 2.4)

def hexToRGB(color):
  """ Change #2182C5 to r=33, g=130, b=197 """
  print(color)
  color_int = int(color, 16)
  print(color_int)
  r = sRGBToLinearRGB(((color_int & 0xff0000) >> 16) / 0xff)
  print(r)
  print(color_int & 0x0000ff)
  print((color_int & 0x0000ff ) / 0xff)
  g = sRGBToLinearRGB(((color_int & 0x00ff00) >> 8) / 0xff)
  b = sRGBToLinearRGB(((color_int & 0x0000ff)) / 0xff)
  return r, g, b
