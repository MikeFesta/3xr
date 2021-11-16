# SPDX-License-Identifier: Apache-2.0
import bpy
import os
import sys
from xrs import tools as xrs

def main(context):
    try:
        # Set variables
        model_name = xrs.get_filename_no_ext()

        xrs.set_object_mode()

        # Low Res
        object_name = model_name + "_low_res"
        if object_name not in bpy.data.objects:
            raise Exception(object_name + " Not Found")

        low_res = bpy.data.objects[object_name]
        material_found = False
        for slot in low_res.material_slots:
            if slot.material.name == model_name + "_Mat":
                material_found = True

            if material_found == False:
                raise Exception(model_name + "_Mat Not Found")

            if round(low_res.location.x,3) != 0 or round(low_res.location.y,3) != 0 or round(low_res.location.z,3) != 0:
                raise Exception(low_res.name + " not at 0,0,0")


        # TODO: Overlapping UVs
        # Metallic 0 or 1
        for mat in bpy.data.materials:
            if mat.use_nodes:
                if "Principled BSDF" in mat.node_tree.nodes:
                    node = mat.node_tree.nodes["Principled BSDF"]
                    metallic_value = node.inputs[4].default_value
                    if (metallic_value > 0 and  metallic_value < 1):
                        raise Exception(mat.name + " metallic value " + str(metallic_value))

        # High Res
        object_name = model_name + "_high_res"
        if object_name not in bpy.data.objects:
            xrs.print_warning(object_name + " Not Found")

    except Exception as error_message:
        xrs.print_error("VALIDATION - " + str(error_message))


class ValidateOperator(bpy.types.Operator):
    """Tooltip"""
    bl_idname = "myops.validate_operator"
    bl_label = "Validate Object"

    @classmethod
    def poll(cls, context):
        return context.active_object is not None

    def execute(self, context):
        main(context)
        return {'FINISHED'}

def register():
    bpy.utils.register_class(ValidateOperator)

def unregister():
    bpy.utils.unregister_class(ValidateOperator)

if __name__ == "__main__":
    register()

    # test call
    # bpy.ops.myops.validate_operator()
