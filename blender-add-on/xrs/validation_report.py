# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Writes to a text file in the blender scene """

import bpy
import xrs.text

def get_text():
  """ Get the text object for the validation report """
  return xrs.text.get_text_by_name("3XR VALIDATION REPORT")

def new_report():
  """ Create a new report text file, overwrite if exists """
  xrs.text.new_text("3XR VALIDATION REPORT")

def show_report():
  """ Set one of the windows to show the report text editor """
  xrs.text.show_text(get_text())

def write_comment(message):
  """ Write a single line with a # at the front """
  xrs.text.write_line(get_text(), "# " + message)

def write_error(message):
  """ Write a single line for an error message """
  xrs.text.write_line(get_text(), "'ERROR' # " + message)

def write_heading(text, message):
  """ Write a section heading with #...# above and below """
  xrs.text.write_hr(get_text())
  write_comment(message)
  xrs.text.write_hr(get_text())

def write_hr():
  xrs.text.write_hr(get_text())

def write_ok(message):
  """ Write a single line with OK: at the front """
  xrs.text.write_line(get_text(), "OK # " + message)

def write_warning(message):
  """ Write a single line with 'WARNING' at the front """
  xrs.text.write_line(get_text(), "'WARNING' # " + message)
