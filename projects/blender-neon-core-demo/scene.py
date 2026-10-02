import bpy
import math
import os
from mathutils import Vector

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "out")
os.makedirs(OUT, exist_ok=True)

BUILD_ONLY = os.environ.get("BLENDER_BUILD_ONLY") == "1"
SKIP_POSTER = os.environ.get("BLENDER_SKIP_POSTER") == "1"

# Reset
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
    pass

scene = bpy.context.scene
try:
    scene.render.engine = "BLENDER_EEVEE_NEXT"
except Exception:
    scene.render.engine = "BLENDER_EEVEE"

scene.render.resolution_x = 720
scene.render.resolution_y = 1280
scene.render.resolution_percentage = 100
scene.render.fps = 24
scene.frame_start = 1
scene.frame_end = 120
scene.render.film_transparent = False

# Color management
try:
    scene.view_settings.look = "AgX - Medium High Contrast"
except Exception:
    try:
        scene.view_settings.look = "Medium High Contrast"
    except Exception:
        pass

scene.world.color = (0.003, 0.006, 0.014)

# Helpers

def mat_principled(name, base, metallic=0.0, roughness=0.45, emission=None, strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*base, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission is not None:
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = (*emission, 1)
            bsdf.inputs["Emission Strength"].default_value = strength
        elif "Emission" in bsdf.inputs:
            bsdf.inputs["Emission"].default_value = (*emission, 1)
            if "Emission Strength" in bsdf.inputs:
                bsdf.inputs["Emission Strength"].default_value = strength
    return m


def mat_emission(name, color, strength=8.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = (*color, 1)
    em.inputs["Strength"].default_value = strength
    nt.links.new(em.outputs["Emission"], out.inputs["Surface"])
    return m


def add_beveled_cube(name, loc, scale, mat, bevel=0.12):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bev = o.modifiers.new("Bevel", "BEVEL")
    bev.width = bevel
    bev.segments = 4
    o.data.materials.append(mat)
    return o


def keyframe_rot(obj, start, end, axis="Z", turns=1.0):
    obj.rotation_mode = "XYZ"
    obj.rotation_euler = (0, 0, 0)
    obj.keyframe_insert("rotation_euler", frame=start)
    vals = [0, 0, 0]
    vals["XYZ".index(axis)] = math.tau * turns
    obj.rotation_euler = vals
    obj.keyframe_insert("rotation_euler", frame=end)
    for fc in obj.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = "LINEAR"


def point_camera(cam, target):
    direction = Vector(target) - cam.location
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()

# Materials
black_metal = mat_principled("BlackMetal", (0.025, 0.035, 0.055), metallic=0.92, roughness=0.19)
dark = mat_principled("Dark", (0.012, 0.018, 0.03), metallic=0.45, roughness=0.32)
chrome = mat_principled("Chrome", (0.32, 0.38, 0.46), metallic=1.0, roughness=0.13)
cyan = mat_emission("CyanEnergy", (0.03, 0.72, 1.0), 9.5)
blue = mat_emission("BlueEnergy", (0.16, 0.22, 1.0), 7.5)
white = mat_emission("WhiteHot", (0.9, 0.98, 1.0), 4.5)

# Floor
bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, -2.35))
floor = bpy.context.object
floor.data.materials.append(mat_principled("Floor", (0.006,0.009,0.014), metallic=0.65, roughness=0.22))

# Plinth
bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=3.1, depth=0.38, location=(0,0,-2.08))
plinth = bpy.context.object
plinth.data.materials.append(black_metal)

bpy.ops.mesh.primitive_torus_add(major_radius=2.45, minor_radius=0.06, major_segments=128, minor_segments=16, location=(0,0,-1.84))
base_ring = bpy.context.object
base_ring.data.materials.append(cyan)

# Central core
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=5, radius=1.0, location=(0,0,0.15))
core = bpy.context.object
core.name = "EnergyCore"
core.data.materials.append(cyan)

# Inner hot sphere
bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=0.36, location=(0,0,0.15))
inner = bpy.context.object
inner.data.materials.append(white)

# Wire cage icosphere
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1.72, location=(0,0,0.15))
cage = bpy.context.object
cage.name = "Cage"
cage.data.materials.append(chrome)
wire = cage.modifiers.new("Wireframe", "WIREFRAME")
wire.thickness = 0.035
wire.use_replace = True
bev = cage.modifiers.new("CageBevel", "BEVEL")
bev.width = 0.012
bev.segments = 2

# Orbit rings
rings = []
for i, (major, minor, tilt, material) in enumerate([
    (2.15, 0.035, (math.radians(68), 0, math.radians(18)), cyan),
    (2.45, 0.028, (math.radians(28), math.radians(54), math.radians(-12)), blue),
    (2.78, 0.022, (math.radians(78), math.radians(22), math.radians(46)), chrome),
]):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor, major_segments=160, minor_segments=12, location=(0,0,0.15), rotation=tilt)
    r = bpy.context.object
    r.data.materials.append(material)
    rings.append(r)

# Parent rings to empties for clean animation
for i, r in enumerate(rings):
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0,0,0.15))
    emp = bpy.context.object
    emp.name = f"OrbitDriver_{i}"
    r.parent = emp
    keyframe_rot(emp, 1, 120, axis="Z", turns=(0.45 + i*0.25) * (-1 if i==1 else 1))

# Cage slow rotate
keyframe_rot(cage, 1, 120, axis="Y", turns=0.42)

# Orbiting satellites
for i in range(18):
    ang = math.tau * i / 18
    radius = 2.9 + 0.3*math.sin(i*1.7)
    z = 0.15 + 0.85*math.sin(i*1.1)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.055 + (i%4)*0.012, location=(radius*math.cos(ang), radius*math.sin(ang), z))
    p = bpy.context.object
    p.data.materials.append(cyan if i%3 else blue)

# Background pillars / tech silhouette
for side in (-1,1):
    for j in range(5):
        x = side*(3.7 + j*0.42)
        y = 1.5 + j*0.55
        h = 1.5 + j*0.52
        add_beveled_cube(f"Pillar_{side}_{j}", (x,y,-2.35+h/2), (0.14,0.38,h/2), dark, 0.08)

# Area lights
for loc, energy, size, color in [
    ((4.5,-4.5,6.5), 900, 5.0, (0.35,0.7,1.0)),
    ((-4.0,-2.0,3.0), 650, 4.0, (0.18,0.3,1.0)),
    ((0,4.0,5.5), 500, 3.5, (0.2,0.9,1.0)),
]:
    bpy.ops.object.light_add(type="AREA", location=loc)
    l = bpy.context.object
    l.data.energy = energy
    l.data.shape = "DISK"
    l.data.size = size
    l.data.color = color
    direction = Vector((0,0,0.2)) - l.location
    l.rotation_euler = direction.to_track_quat("-Z","Y").to_euler()

# Rim point lights
for i in range(6):
    a = math.tau*i/6
    bpy.ops.object.light_add(type="POINT", location=(3.0*math.cos(a),3.0*math.sin(a),0.0))
    l=bpy.context.object
    l.data.energy=110
    l.data.color=(0.02,0.55,1.0)
    l.data.shadow_soft_size=1.0

# Camera
bpy.ops.object.camera_add(location=(0,-9.5,2.7))
cam = bpy.context.object
scene.camera = cam
cam.data.lens = 58
cam.data.sensor_width = 36
try:
    cam.data.dof.use_dof = True
    cam.data.dof.focus_object = core
    cam.data.dof.aperture_fstop = 2.4
except Exception:
    pass

# Animate camera push + slight arc
cam.location = (0,-9.5,2.7)
point_camera(cam,(0,0,0.1))
cam.keyframe_insert("location", frame=1)
cam.keyframe_insert("rotation_euler", frame=1)

cam.location = (1.25,-7.25,1.65)
point_camera(cam,(0,0,0.18))
cam.keyframe_insert("location", frame=120)
cam.keyframe_insert("rotation_euler", frame=120)
for fc in cam.animation_data.action.fcurves:
    for kp in fc.keyframe_points:
        kp.interpolation = "BEZIER"

# Core pulse animation
core.scale = (0.82,0.82,0.82)
core.keyframe_insert("scale", frame=1)
core.scale = (1.08,1.08,1.08)
core.keyframe_insert("scale", frame=52)
core.scale = (0.92,0.92,0.92)
core.keyframe_insert("scale", frame=120)

# Compositor bloom/glare
scene.use_nodes = True
nt = scene.node_tree
nt.nodes.clear()
rl = nt.nodes.new("CompositorNodeRLayers")
glare = nt.nodes.new("CompositorNodeGlare")
glare.glare_type = "FOG_GLOW"
glare.quality = "HIGH"
glare.threshold = 0.5
glare.size = 7
comp = nt.nodes.new("CompositorNodeComposite")
nt.links.new(rl.outputs["Image"], glare.inputs["Image"])
nt.links.new(glare.outputs["Image"], comp.inputs["Image"])

# Render tuning
try:
    scene.render.image_settings.file_format = "FFMPEG"
except Exception:
    pass
scene.render.ffmpeg.format = "MPEG4"
scene.render.ffmpeg.codec = "H264"
scene.render.ffmpeg.constant_rate_factor = "MEDIUM"
scene.render.ffmpeg.ffmpeg_preset = "GOOD"
scene.render.ffmpeg.audio_codec = "NONE"
scene.render.filepath = os.path.join(OUT, "neon-core-demo.mp4")

if not SKIP_POSTER:
    # Poster first
    scene.frame_set(74)
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = os.path.join(OUT, "neon-core-poster.png")
    bpy.ops.render.render(write_still=True)
else:
    print("BLENDER_POSTER_SKIPPED")

# Save source
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "neon-core-demo.blend"))

if BUILD_ONLY:
    print("BLENDER_BUILD_ONLY_READY")
    raise SystemExit(0)

# Render movie
scene.render.image_settings.file_format = "FFMPEG"
scene.render.filepath = os.path.join(OUT, "neon-core-demo.mp4")
scene.frame_set(1)
bpy.ops.render.render(animation=True)

print("BLENDER_NEON_CORE_READY")
