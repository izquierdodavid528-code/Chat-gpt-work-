import bpy
import hashlib
import json
import os
import pathlib
import sys
from datetime import datetime, timezone

args = sys.argv
if "--" not in args or len(args) <= args.index("--") + 1:
    raise RuntimeError("Usage: blender -b master.blend --python master-audit.py -- output.json")

output = pathlib.Path(args[args.index("--") + 1]).resolve()
output.parent.mkdir(parents=True, exist_ok=True)
scene = bpy.context.scene
policy = os.environ.get("BLENDER_SIMULATION_POLICY", "unknown")
pack_resources = os.environ.get("BLENDER_PACK_RESOURCES", "1") == "1"

deps = []
missing = []


def add_dep(kind, name, raw_path, packed=False):
    if not raw_path:
        return
    resolved = pathlib.Path(bpy.path.abspath(raw_path))
    item = {
        "kind": kind,
        "name": name,
        "path": raw_path,
        "resolved": str(resolved),
        "packed": bool(packed),
        "exists": bool(packed or resolved.exists()),
    }
    deps.append(item)
    if not item["exists"]:
        missing.append(item)


for image in bpy.data.images:
    if image.source in {"FILE", "MOVIE", "SEQUENCE"}:
        add_dep("image", image.name, image.filepath, bool(getattr(image, "packed_file", None)))

for clip in bpy.data.movieclips:
    add_dep("movieclip", clip.name, clip.filepath, False)

for sound in bpy.data.sounds:
    add_dep("sound", sound.name, sound.filepath, bool(getattr(sound, "packed_file", None)))

for font in bpy.data.fonts:
    if font.filepath:
        add_dep("font", font.name, font.filepath, bool(getattr(font, "packed_file", None)))

for lib in bpy.data.libraries:
    add_dep("library", lib.name, lib.filepath, False)

simulation_signals = []
simulation_modifier_types = {
    "CLOTH", "FLUID", "SOFT_BODY", "DYNAMIC_PAINT", "PARTICLE_SYSTEM",
    "OCEAN",
}
for obj in bpy.data.objects:
    for mod in obj.modifiers:
        if mod.type in simulation_modifier_types:
            simulation_signals.append({
                "object": obj.name,
                "modifier": mod.name,
                "type": mod.type,
            })
        if mod.type == "NODES" and getattr(mod, "node_group", None):
            for node in mod.node_group.nodes:
                if "SIMULATION" in node.bl_idname.upper() or "SIMULATION" in node.name.upper():
                    simulation_signals.append({
                        "object": obj.name,
                        "modifier": mod.name,
                        "type": "GEOMETRY_NODES_SIMULATION",
                        "node": node.name,
                    })

if missing:
    print(json.dumps({"missing_dependencies": missing}, indent=2))
    raise RuntimeError("Master scene has missing external dependencies.")

if policy == "none" and simulation_signals:
    print(json.dumps({"simulation_signals": simulation_signals}, indent=2))
    raise RuntimeError(
        "Parallel render refused: scene contains simulation-like elements but "
        "simulationPolicy is 'none'. Use baked caches and simulationPolicy='baked'."
    )

if pack_resources:
    try:
        bpy.ops.file.pack_all()
    except Exception as exc:
        print("PACK_WARNING", repr(exc))

# Save after packing so every render worker receives the same master scene state.
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)

blend_path = pathlib.Path(bpy.data.filepath)
sha = hashlib.sha256()
with blend_path.open("rb") as f:
    for chunk in iter(lambda: f.read(1024 * 1024), b""):
        sha.update(chunk)

ffmpeg = scene.render.ffmpeg
manifest = {
    "createdAt": datetime.now(timezone.utc).isoformat(),
    "blenderVersion": bpy.app.version_string,
    "blendPath": str(blend_path),
    "blendSha256": sha.hexdigest(),
    "scene": scene.name,
    "renderEngine": scene.render.engine,
    "frameStart": int(scene.frame_start),
    "frameEnd": int(scene.frame_end),
    "fps": float(scene.render.fps / scene.render.fps_base),
    "resolution": {
        "x": int(scene.render.resolution_x),
        "y": int(scene.render.resolution_y),
        "percentage": int(scene.render.resolution_percentage),
    },
    "filmTransparent": bool(scene.render.film_transparent),
    "compositorEnabled": bool(scene.use_nodes),
    "colorManagement": {
        "displayDevice": scene.display_settings.display_device,
        "viewTransform": scene.view_settings.view_transform,
        "look": scene.view_settings.look,
        "exposure": float(scene.view_settings.exposure),
        "gamma": float(scene.view_settings.gamma),
    },
    "ffmpeg": {
        "format": ffmpeg.format,
        "codec": ffmpeg.codec,
        "constantRateFactor": ffmpeg.constant_rate_factor,
        "preset": ffmpeg.ffmpeg_preset,
        "audioCodec": ffmpeg.audio_codec,
    },
    "externalDependencies": deps,
    "simulationPolicy": policy,
    "simulationSignals": simulation_signals,
}

output.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
print(json.dumps(manifest, indent=2))
