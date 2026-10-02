import bpy
import math
import mathutils
import os

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

scene = bpy.context.scene

# Blender 4.x uses BLENDER_EEVEE_NEXT; older versions use BLENDER_EEVEE.
try:
    scene.render.engine = 'BLENDER_EEVEE_NEXT'
except Exception:
    scene.render.engine = 'BLENDER_EEVEE'

scene.render.resolution_x = 512
scene.render.resolution_y = 512
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.world.color = (0.035, 0.035, 0.05)

bpy.ops.mesh.primitive_plane_add(size=12, location=(0, 0, 0))
ground = bpy.context.active_object
mat_ground = bpy.data.materials.new("Ground")
mat_ground.diffuse_color = (0.08, 0.10, 0.14, 1.0)
ground.data.materials.append(mat_ground)

bpy.ops.mesh.primitive_cube_add(size=2.2, location=(0, 0, 1.1))
cube = bpy.context.active_object
cube.rotation_euler = (math.radians(18), 0, math.radians(28))
mat_cube = bpy.data.materials.new("Cube")
mat_cube.diffuse_color = (0.12, 0.42, 0.95, 1.0)
cube.data.materials.append(mat_cube)

bevel = cube.modifiers.new("Bevel", "BEVEL")
bevel.width = 0.12
bevel.segments = 4

bpy.ops.object.camera_add(location=(5.5, -7.0, 4.8))
camera = bpy.context.active_object
scene.camera = camera

def look_at(obj, target):
    direction = mathutils.Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()

look_at(camera, (0, 0, 1.0))

bpy.ops.object.light_add(type='AREA', location=(4.0, -2.5, 6.0))
key = bpy.context.active_object
key.data.energy = 1000
key.data.shape = 'DISK'
key.data.size = 5.0

bpy.ops.object.light_add(type='AREA', location=(-4.0, -1.0, 3.0))
fill = bpy.context.active_object
fill.data.energy = 450
fill.data.size = 4.0

bpy.ops.object.light_add(type='POINT', location=(1.0, 4.0, 4.5))
rim = bpy.context.active_object
rim.data.energy = 700

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
out_dir = os.path.join(root_dir, "out")
os.makedirs(out_dir, exist_ok=True)

scene.render.filepath = os.path.join(out_dir, "blender-test.png")
blend_path = os.path.join(out_dir, "blender-test.blend")

bpy.ops.wm.save_as_mainfile(filepath=blend_path)
bpy.ops.render.render(write_still=True)

print("BLENDER_TEST_RENDER=" + scene.render.filepath)
print("BLENDER_TEST_BLEND=" + blend_path)
