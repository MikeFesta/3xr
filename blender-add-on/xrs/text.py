# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Writes to a text file in the blender scene """

import bpy

def get_text_by_name(name):
  """ Get a text object by name, or create one if it does not exist """
  if (name not in bpy.data.texts):
    text = bpy.data.texts.new(name=name)
  else:
    text = bpy.data.texts[name]
  return text

def new_text(name):
  """ Create a new text file, overwrite if exists """
  text = get_text_by_name(name)
  text.clear()
  write_heading(text, name)
  # May want to turn off line wrap and make other settings changes

def set_text_editor_to_text(area, text):
  """ Set the text editor area space to the given text """
  for space in area.spaces:
    if space.type == 'TEXT_EDITOR':
      space.text = text

def show_text(text):
  """ Set one of the windows to show the text in a text editor """
  # First check if there is already a text editor area and use that
  editor_found = False
  largest_area = None
  largest_area_size = 0
  for area in bpy.context.screen.areas:
    size = area.width * area.height
    if (size > largest_area_size):
      largest_area_size = size
      largest_area = area
    if area.type == 'TEXT_EDITOR':
      editor_found = True
      set_text_editor_to_text(area, text)
  # Set the largest window to a text editor if none
  if (editor_found == False):
    if (largest_area != None):
      # Set the largest area to a text editor
      largest_area.type = 'TEXT_EDITOR'
      set_text_editor_to_text(largest_area, text)
  # Scroll to the top
  text.current_line_index = 0
  text.select_end_line_index = 0

def write_comment(text, message):
  """ Write a single line with a # at the front """
  write_line(text, "# " + message)

def write_heading(text, message):
  """ Write a section heading with #...# above and below """
  write_hr(text)
  write_comment(text, message)
  write_hr(text)

def write_hr(text):
  write_line(text, "###############################################################################")

def write_line(text, message):
  """ Write a single line with a \n at the end """
  text.write(message + "\n")
