import bpy
import hashlib
import json
import os
import pathlib
import sys
from datetime import datetime, timezone

args = sys.argv
if "--" not in args or len(args) <= args.index("--") + 1:
    raise RuntimeError(
        "Usage: blender -b master.blend --python master-audit.py -- output.json"
    )

output = pathlib.Path(args[args.index("--") + 1]).resolve()
output.parent.mkdir(parents=True, exist_ok=True)
scene = bpy.context.scene
policy = os.environ.get("BLENDER_SIMULATION_POLICY", "unknown").strip().lower()
pack_resources = os.environ.get("BLENDER_PACK_RESOURCES", "1").strip().lower() in {
    "1", "true", "yes", "on"
}
project_root_raw = os.environ.get("BLENDER_PROJECT_ROOT", "").strip()
project_root = pathlib.Path(project_root_raw).resolve() if project_root_raw else None
simulation_cache_dir = os.environ.get("BLENDER_SIMULATION_CACHE_DIR", "").strip()

def dep_record(kind, name, raw_path, packed=False):
    if not raw_path:
        return None

    # Blender's built-in font is a virtual resource, not an external file.
    # Treat it as internal/portable so text objects do not fail master audit.
    if kind == "font" and raw_path == "<builtin>":
        return {
            "kind": kind,
            "name": name,
            "path": raw_path,
            "resolved": raw_path,
            "packed": True,
            "exists": True,
            "internal": True,
        }

    resolved = pathlib.Path(bpy.path.abspath(raw_path))
    return {
        "kind": kind,
        "name": name,
        "path": raw_path,
        "resolved": str(resolved),
        "packed": bool(packed),
        "exists": bool(packed or resolved.exists()),
        "internal": False,
    }

def collect_dependencies():
    deps = []
    for image in bpy.data.images:
        if image.source in {"FILE", "MOVIE", "SEQUENCE"}:
            item = dep_record(
                "image",
                image.name,
                image.filepath,
                bool(getattr(image, "packed_file", None)),
            )
            if item:
                deps.append(item)

    for clip in bpy.data.movieclips:
        item = dep_record("movieclip", clip.name, clip.filepath, False)
        if item:
            deps.append(item)

    for sound in bpy.data.sounds:
        item = dep_record(
            "sound",
            sound.name,
            sound.filepath,
            bool(getattr(sound, "packed_file", None)),
        )
        if item:
            deps.append(item)

    for font in bpy.data.fonts:
        if font.filepath:
            item = dep_record(
                "font",
                font.name,
                font.filepath,
                bool(getattr(font, "packed_file", None)),
            )
            if item:
                deps.append(item)

    for lib in bpy.data.libraries:
        item = dep_record("library", lib.name, lib.filepath, False)
        if item:
            deps.append(item)

    return deps

def collect_simulation_signals():
    signals = []
    seen = set()

    def add(payload):
        key = json.dumps(payload, sort_keys=True)
        if key not in seen:
            seen.add(key)
            signals.append(payload)

    modifier_types = {
        "CLOTH",
        "FLUID",
        "SOFT_BODY",
        "DYNAMIC_PAINT",
        "PARTICLE_SYSTEM",
        "OCEAN",
    }

    for obj in bpy.data.objects:
        if getattr(obj, "rigid_body", None) is not None:
            add({"object": obj.name, "type": "RIGID_BODY"})
        if getattr(obj, "rigid_body_constraint", None) is not None:
            add({"object": obj.name, "type": "RIGID_BODY_CONSTRAINT"})
        if len(getattr(obj, "particle_systems", [])) > 0:
            add({"object": obj.name, "type": "PARTICLE_SYSTEM"})

        for mod in obj.modifiers:
            if mod.type in modifier_types:
                add({
                    "object": obj.name,
                    "modifier": mod.name,
                    "type": mod.type,
                })
            if mod.type == "NODES" and getattr(mod, "node_group", None):
                groups = [mod.node_group]
                visited = set()
                while groups:
                    group = groups.pop()
                    pointer = group.as_pointer()
                    if pointer in visited:
                        continue
                    visited.add(pointer)
                    for node in group.nodes:
                        name = (node.name or "").upper()
                        bl_idname = (node.bl_idname or "").upper()
                        if "SIMULATION" in name or "SIMULATION" in bl_idname:
                            add({
                                "object": obj.name,
                                "modifier": mod.name,
                                "type": "GEOMETRY_NODES_SIMULATION",
                                "node": node.name,
                            })
                        child = getattr(node, "node_tree", None)
                        if child is not None:
                            groups.append(child)

    if getattr(scene, "rigidbody_world", None) is not None:
        add({"scene": scene.name, "type": "RIGID_BODY_WORLD"})

    return signals

deps_before = collect_dependencies()
missing_before = [x for x in deps_before if not x["exists"]]
simulation_signals = collect_simulation_signals()

if missing_before:
    print(json.dumps({"missing_dependencies": missing_before}, indent=2))
    raise RuntimeError("Master scene has missing external dependencies.")

if policy == "none" and simulation_signals:
    print(json.dumps({"simulation_signals": simulation_signals}, indent=2))
    raise RuntimeError(
        "Parallel render refused: scene contains simulation-like elements but "
        "simulationPolicy is 'none'. Use baked caches and simulationPolicy='baked'."
    )

if policy == "baked":
    if not project_root or not simulation_cache_dir:
        raise RuntimeError(
            "Baked simulations require BLENDER_PROJECT_ROOT and "
            "BLENDER_SIMULATION_CACHE_DIR."
        )
    cache_path = (project_root / simulation_cache_dir).resolve()
    if project_root not in cache_path.parents and cache_path != project_root:
        raise RuntimeError("Simulation cache escapes project root.")
    if not cache_path.is_dir() or not any(p.is_file() for p in cache_path.rglob("*")):
        raise RuntimeError(
            f"Baked simulation cache is missing or empty: {cache_path}"
        )

if pack_resources:
    try:
        bpy.ops.file.pack_all()
    except Exception as exc:
        raise RuntimeError(f"Could not pack external resources: {exc}") from exc

bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)

deps_after = collect_dependencies()
missing_after = [x for x in deps_after if not x["exists"]]
external_remaining = [x for x in deps_after if x["exists"] and not x["packed"]]

if missing_after:
    print(json.dumps({"missing_dependencies_after_pack": missing_after}, indent=2))
    raise RuntimeError("Master scene has missing dependencies after packing.")

if external_remaining:
    print(json.dumps({"external_dependencies_after_pack": external_remaining}, indent=2))
    raise RuntimeError(
        "Immutable master still depends on external files after audit. "
        "Pack or internalize those resources before distributed rendering."
    )

blend_path = pathlib.Path(bpy.data.filepath)
sha = hashlib.sha256()
with blend_path.open("rb") as f:
    for chunk in iter(lambda: f.read(1024 * 1024), b""):
        sha.update(chunk)

ffmpeg = scene.render.ffmpeg
manifest = {
    "schemaVersion": 2,
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
    "externalDependenciesBeforePack": deps_before,
    "externalDependencies": deps_after,
    "externalDependenciesRemaining": external_remaining,
    "simulationPolicy": policy,
    "simulationCacheDir": simulation_cache_dir or None,
    "simulationSignals": simulation_signals,
}

output.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(json.dumps(manifest, indent=2))
