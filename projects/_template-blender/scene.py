import bpy
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "out")
os.makedirs(OUT, exist_ok=True)

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

scene = bpy.context.scene
try:
    scene.render.engine = "BLENDER_EEVEE_NEXT"
except Exception:
    scene.render.engine = "BLENDER_EEVEE"

scene.render.resolution_x = 1080
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 50
scene.render.image_settings.file_format = "PNG"

bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0))
cube = bpy.context.active_object
cube.name = "HeroObject"

bpy.ops.object.light_add(type="AREA", location=(4, -4, 6))
light = bpy.context.active_object
light.data.energy = 900
light.data.size = 5

bpy.ops.object.camera_add(location=(5, -7, 4))
camera = bpy.context.active_object
scene.camera = camera

direction = cube.location - camera.location
camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()

scene.render.filepath = os.path.join(OUT, "preview.png")
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "scene.blend"))
bpy.ops.render.render(write_still=True)

print("BLENDER_PROJECT_READY")
