import bpy
import json
import math
import os
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "out"
OUT.mkdir(parents=True, exist_ok=True)
CONFIG = json.loads((ROOT / "project.config.json").read_text(encoding="utf-8"))
BUILD_ONLY = os.environ.get("BLENDER_BUILD_ONLY", "0") == "1"
SKIP_POSTER = os.environ.get("BLENDER_SKIP_POSTER", "0") == "1"

RED = (0.847, 0.012, 0.020, 1.0)
WHITE = (0.96, 0.96, 0.96, 1.0)
DARK = (0.004, 0.004, 0.006, 1.0)
GRAY = (0.09, 0.10, 0.12, 1.0)

def mat(name, base, metallic=0.0, roughness=0.5, emission=None, strength=0.0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = base
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = base
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission is not None:
        bsdf.inputs["Emission Color"].default_value = emission
        bsdf.inputs["Emission Strength"].default_value = strength
    return m

def add_text(body, size, location, material, extrude=0.025, bevel=0.006, align="CENTER"):
    bpy.ops.object.text_add(location=location)
    obj = bpy.context.object
    obj.data.body = body
    obj.data.align_x = align
    obj.data.align_y = "CENTER"
    obj.data.size = size
    obj.data.extrude = extrude
    obj.data.bevel_depth = bevel
    obj.data.materials.append(material)
    obj.rotation_euler = (math.radians(90), 0, 0)
    return obj

def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

scene = bpy.context.scene
scene.render.engine = CONFIG["renderEngine"]
scene.render.resolution_x = 1080
scene.render.resolution_y = 1920
scene.render.resolution_percentage = 100
scene.render.fps = 30
scene.frame_start = 1
scene.frame_end = 45
scene.render.image_settings.file_format = "PNG"
scene.render.film_transparent = False
scene.world.color = DARK[:3]

# Color management: restrained contrast, not hyper-saturated.
try:\n    scene.view_settings.look = "AgX - Medium High Contrast"\nexcept Exception:\n    pass

red = mat("Memorial Red", RED, metallic=0.1, roughness=0.28, emission=RED, strength=2.4)
white = mat("Type White", WHITE, metallic=0.0, roughness=0.38)
dark_metal = mat("Dark Metal", GRAY, metallic=0.7, roughness=0.22)

# Central wire globe.
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=4, radius=2.55, location=(0, 0.18, 0.25))
globe = bpy.context.object
globe.name = "GeodesicGlobe"
wire = globe.modifiers.new("Wireframe", "WIREFRAME")
wire.thickness = 0.012
wire.use_replace = True
globe.data.materials.append(dark_metal)
globe.rotation_euler = (math.radians(12), math.radians(-12), math.radians(-24))
globe.keyframe_insert("rotation_euler", frame=1)
globe.rotation_euler = (math.radians(18), math.radians(8), math.radians(26))
globe.keyframe_insert("rotation_euler", frame=45)

# Two red orbital rings.
for idx, rot in enumerate(((70, 0, 25), (102, 18, -18))):
    bpy.ops.mesh.primitive_torus_add(major_radius=3.05 + idx * 0.20, minor_radius=0.028, major_segments=160, minor_segments=12)
    ring = bpy.context.object
    ring.name = f"Orbit_{idx+1}"
    ring.rotation_euler = tuple(math.radians(v) for v in rot)
    ring.data.materials.append(red)
    ring.scale = (0.96, 0.96, 0.96)
    ring.keyframe_insert("scale", frame=1)
    ring.scale = (1.03, 1.03, 1.03)
    ring.keyframe_insert("scale", frame=45)

# Hero 81.
hero = add_text("81", 2.65, (0, -0.35, 0.50), white, extrude=0.12, bevel=0.025)
hero.scale = (0.82, 0.82, 0.82)
hero.keyframe_insert("scale", frame=1)
hero.scale = (1.0, 1.0, 1.0)
hero.keyframe_insert("scale", frame=22)
hero.scale = (1.035, 1.035, 1.035)
hero.keyframe_insert("scale", frame=45)

# Small title lines, built-in font only.
label = add_text("ASAMBLEA GENERAL", 0.28, (0, -0.28, -2.30), white, extrude=0.018, bevel=0.003)
date = add_text("26 · SEP · 2026", 0.20, (0, -0.26, -2.72), red, extrude=0.012, bevel=0.002)

# Red accent line.
bpy.ops.mesh.primitive_cube_add(location=(0, -0.15, -1.88), scale=(1.45, 0.025, 0.035))
accent = bpy.context.object
accent.data.materials.append(red)
accent.scale.x = 0.02
accent.keyframe_insert("scale", frame=1)
accent.scale.x = 1.45
accent.keyframe_insert("scale", frame=17)

# Camera and cinematic push-in.
bpy.ops.object.camera_add(location=(0, -11.5, 0.55))
cam = bpy.context.object
scene.camera = cam
cam.data.lens = 57
look_at(cam, (0, 0, 0.05))
cam.keyframe_insert("location", frame=1)
cam.location = (0, -9.25, 0.48)
look_at(cam, (0, 0, 0.02))
cam.keyframe_insert("location", frame=45)
cam.keyframe_insert("rotation_euler", frame=45)

# Area/rim lights.
bpy.ops.object.light_add(type="AREA", location=(0, -4.5, 5.7))
key = bpy.context.object
key.data.energy = 1150
key.data.shape = "DISK"
key.data.size = 5.5
look_at(key, (0, 0, 0))

bpy.ops.object.light_add(type="AREA", location=(-5.0, -1.0, 0.8))
rim = bpy.context.object
rim.data.energy = 1050
rim.data.color = (1.0, 0.02, 0.025)
rim.data.size = 4.0
look_at(rim, (0, 0, 0))

bpy.ops.object.light_add(type="AREA", location=(4.8, 0.5, 1.6))
fill = bpy.context.object
fill.data.energy = 520
fill.data.color = (0.45, 0.50, 0.62)
fill.data.size = 4.0
look_at(fill, (0, 0, 0))

# Groundless dark backdrop.
bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 2.8, 0), rotation=(math.radians(90), 0, 0))
backdrop = bpy.context.object
backdrop.data.materials.append(mat("Backdrop", DARK, roughness=1.0))

# Easy ease for all keyed curves.
for obj in bpy.context.scene.objects:
    if obj.animation_data and obj.animation_data.action:
        for fc in obj.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = "BEZIER"
                kp.easing = "AUTO"

blend_path = ROOT / CONFIG.get("blendFile", "out/scene.blend")
blend_path.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))

if BUILD_ONLY:
    print("BLENDER_BUILD_ONLY_COMPLETE")
    raise SystemExit(0)

if not SKIP_POSTER:
    preview_path = ROOT / CONFIG.get("previewFile", "out/preview.png")
    scene.frame_set(23)
    scene.render.filepath = str(preview_path)
    bpy.ops.render.render(write_still=True)

print("BRUNO_ONU_V3_OPENER_READY")
