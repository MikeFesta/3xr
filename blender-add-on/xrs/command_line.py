# SPDX-License-Identifier: Apache-2.0
# -*- coding: utf-8 -*-
""" Functions for getting command line arguments
"""
import sys

def get_arguments():
    """ Get the arguments after the last -- """
    # blender --background --python {script} -- [arguments]
    # 1. Reverse the list
    # 2. Get the index of --,
    # 3. Subtract it from the length
    # 4. Return from that postion to the end
    return sys.argv[len(sys.argv) - sys.argv[::-1].index("--"):]

def get_last_argument():
    return sys.argv[-1]
