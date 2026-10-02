import bpy
import json
import math
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "out"
OUT.mkdir(parents=True, exist_ok=True)

CONFIG = json.loads((ROOT / "project.config.json").read_text(encoding="utf-8"))
BUILD_ONLY = os.environ.get("BLENDER_BUILD_ONLY", "0") == "1"
SKIP_POSTER = os.environ.get("BLENDER_SKIP_POSTER", "0") == "1"

def resolve(path_value):
    return ROOT / path_value

# Clean scene.
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

scene = bpy.context.scene
engine = CONFIG.get("renderEngine", "BLENDER_EEVEE_NEXT")
try:
    scene.render.engine = engine
except Exception:
    scene.render.engine = "BLENDER_EEVEE_NEXT"

width, height = [int(x) for x in CONFIG.get("resolution", "1080x1080").lower().split("x")]
scene.render.resolution_x = width
scene.render.resolution_y = height
scene.render.resolution_percentage = 100
scene.render.fps = int(CONFIG.get("fps", 24))
scene.frame_start = int(CONFIG.get("frameStart", 1))
scene.frame_end = scene.frame_start + int(CONFIG.get("frames", 1)) - 1
scene.render.image_settings.file_format = "PNG"

# Minimal reusable starter scene.
bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0))
cube = bpy.context.active_object
cube.name = "HeroObject"

if scene.frame_end > scene.frame_start:
    cube.rotation_euler = (0.0, 0.0, 0.0)
    cube.keyframe_insert(data_path="rotation_euler", frame=scene.frame_start)
    cube.rotation_euler = (math.radians(18), math.radians(12), math.radians(360))
    cube.keyframe_insert(data_path="rotation_euler", frame=scene.frame_end)

bpy.ops.object.light_add(type="AREA", location=(4, -4, 6))
light = bpy.context.active_object
light.data.energy = 900
light.data.size = 5

bpy.ops.object.camera_add(location=(5, -7, 4))
camera = bpy.context.active_object
scene.camera = camera

direction = cube.location - camera.location
camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()

blend_path = resolve(CONFIG.get("blendFile", "out/scene.blend"))
blend_path.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))

if BUILD_ONLY:
    print("BLENDER_BUILD_ONLY_COMPLETE")
    raise SystemExit(0)

if not SKIP_POSTER:
    preview_path = resolve(CONFIG.get("previewFile", "out/preview.png"))
    preview_path.parent.mkdir(parents=True, exist_ok=True)
    scene.render.filepath = str(preview_path)
    scene.render.image_settings.file_format = "PNG"
    scene.frame_set(scene.frame_start)
    bpy.ops.render.render(write_still=True)

if scene.frame_end > scene.frame_start:
    video_path = resolve(CONFIG.get("videoFile", "out/final.mp4"))
    video_path.parent.mkdir(parents=True, exist_ok=True)
    scene.render.image_settings.file_format = "FFMPEG"
    scene.render.ffmpeg.format = "MPEG4"
    scene.render.ffmpeg.codec = "H264"
    scene.render.filepath = str(video_path)
    bpy.ops.render.render(animation=True)

print("BLENDER_PROJECT_READY")
