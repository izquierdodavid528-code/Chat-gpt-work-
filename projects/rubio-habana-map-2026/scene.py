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

def resolve(v):
    return ROOT / v

def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()

def mat_principled(name, base, metallic=0.0, rough=0.5, emission=None, emission_strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*base, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = rough
    if emission is not None:
        bsdf.inputs["Emission Color"].default_value = (*emission, 1)
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    return m

def make_curve_polygon(name, coords, z, material, extrude=0.035):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "2D"
    curve.fill_mode = "BOTH"
    curve.extrude = extrude
    spline = curve.splines.new("POLY")
    spline.points.add(len(coords)-1)
    for i,(x,y) in enumerate(coords):
        spline.points[i].co = (x,y,z,1)
    spline.use_cyclic_u = True
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    return obj

def make_bezier_line(name, pts, z, material, thickness=0.025):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = thickness
    curve.bevel_resolution = 4
    sp = curve.splines.new("BEZIER")
    sp.bezier_points.add(len(pts)-1)
    for p,co in zip(sp.bezier_points, pts):
        p.co = (co[0],co[1],z)
        p.handle_left_type = "AUTO"
        p.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    return obj

def make_text(body, loc, size, material, name, align="LEFT"):
    bpy.ops.object.text_add(location=loc)
    o=bpy.context.active_object
    o.name=name
    o.data.body=body
    o.data.align_x=align
    o.data.size=size
    o.data.extrude=0.008
    o.data.bevel_depth=0.002
    o.data.materials.append(material)
    return o

def geo(lon, lat):
    # Geographic composition centered on Florida Straits; longitude compressed slightly
    return ((lon + 81.0)*0.78, (lat - 25.2)*0.78)

# Scene reset
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.render.engine=CONFIG.get("renderEngine","BLENDER_EEVEE_NEXT")
scene.render.resolution_x=1080
scene.render.resolution_y=1920
scene.render.resolution_percentage=100
scene.render.fps=30
scene.frame_start=1
scene.frame_end=150
scene.render.image_settings.file_format="PNG"
scene.render.film_transparent=False
scene.view_settings.look="AgX - Medium High Contrast"

# World
world=bpy.data.worlds.new("NightWorld")
scene.world=world
world.use_nodes=True
world.node_tree.nodes["Background"].inputs["Color"].default_value=(0.002,0.006,0.012,1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value=0.15

# Materials
ocean=mat_principled("Ocean",(0.005,0.018,0.030),metallic=0.15,rough=0.28)
land=mat_principled("Land",(0.055,0.075,0.083),metallic=0.3,rough=0.42)
land_edge=mat_principled("LandEdge",(0.09,0.14,0.16),metallic=0.15,rough=0.35,emission=(0.05,0.15,0.18),emission_strength=0.35)
red=mat_principled("PressureRed",(0.24,0.01,0.015),metallic=0.15,rough=0.25,emission=(0.95,0.015,0.02),emission_strength=5.5)
warm=mat_principled("WarmText",(0.80,0.69,0.46),metallic=0.0,rough=0.5,emission=(0.75,0.52,0.20),emission_strength=1.7)
white=mat_principled("WhiteText",(0.88,0.92,0.94),rough=0.45,emission=(0.72,0.82,0.88),emission_strength=1.2)
blue=mat_principled("RouteBlue",(0.02,0.16,0.25),rough=0.3,emission=(0.02,0.55,0.85),emission_strength=4.2)

# Ocean plane
bpy.ops.mesh.primitive_plane_add(size=28, location=(0,0,-0.12))
o=bpy.context.active_object
o.name="Atlantic"
o.data.materials.append(ocean)

# Coastline shapes; simplified geographic outlines for visual recognition
cuba_geo=[
(-84.95,21.90),(-84.40,22.20),(-83.60,22.45),(-82.70,22.75),(-81.70,23.05),
(-80.70,23.20),(-79.55,23.05),(-78.40,22.55),(-77.20,21.95),(-76.15,21.10),
(-75.10,20.35),(-74.20,20.05),(-75.10,20.75),(-76.10,21.00),(-77.40,21.45),
(-78.75,21.70),(-80.05,21.90),(-81.35,22.05),(-82.65,21.95),(-83.75,21.70)
]
florida_geo=[
(-87.55,30.95),(-86.35,30.55),(-85.25,30.25),(-84.15,29.90),(-83.35,28.95),
(-82.85,27.90),(-82.35,26.75),(-81.80,25.85),(-81.10,25.15),(-80.25,25.05),
(-80.05,25.65),(-80.20,26.55),(-80.55,27.45),(-81.05,28.35),(-81.85,29.20),
(-82.90,30.00),(-84.35,30.65),(-85.85,30.90)
]
cuba=[geo(*p) for p in cuba_geo]
florida=[geo(*p) for p in florida_geo]
cuba_obj=make_curve_polygon("Cuba",cuba,0.02,land,0.06)
fl_obj=make_curve_polygon("Florida",florida,0.02,land,0.06)

# Slight luminous duplicated outlines
for name,coords in [("CubaGlow",cuba),("FloridaGlow",florida)]:
    c=bpy.data.curves.new(name,"CURVE"); c.dimensions="3D"; c.bevel_depth=0.012; c.bevel_resolution=3
    s=c.splines.new("POLY"); s.points.add(len(coords))
    for i,(x,y) in enumerate(coords+coords[:1]): s.points[i].co=(x,y,0.095,1)
    obj=bpy.data.objects.new(name,c); bpy.context.collection.objects.link(obj); obj.data.materials.append(land_edge)

# Miami-Havana route
miami=geo(-80.1918,25.7617)
havana=geo(-82.3666,23.1136)
route=make_bezier_line("MiamiHavanaRoute",[
    (miami[0],miami[1]),((miami[0]+havana[0])/2+0.25,(miami[1]+havana[1])/2+0.35),(havana[0],havana[1])
],0.18,blue,0.018)
route.data.bevel_factor_end=0.02
route.data.keyframe_insert("bevel_factor_end",frame=1)
route.data.bevel_factor_end=1.0
route.data.keyframe_insert("bevel_factor_end",frame=55)

# City markers
for name,(x,y),mat in [("Miami",miami,blue),("Havana",havana,red)]:
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=12,radius=0.075,location=(x,y,0.18))
    s=bpy.context.active_object; s.name=name; s.data.materials.append(mat)

# Pressure rings centered near Havana / north Cuba
cx,cy=geo(-81.9,22.35)
starts=[35,55,75,95]
for i,start in enumerate(starts):
    bpy.ops.mesh.primitive_torus_add(major_radius=1.10+i*0.36,minor_radius=0.018,major_segments=96,minor_segments=10,location=(cx,cy,0.16+i*0.006))
    t=bpy.context.active_object
    t.name=f"PressureRing{i+1}"
    t.scale=(1.75,0.72,1.0)
    t.data.materials.append(red)
    t.scale=(0.01,0.01,0.01)
    t.keyframe_insert(data_path="scale",frame=max(1,start-7))
    t.scale=(1.75,0.72,1.0)
    t.keyframe_insert(data_path="scale",frame=start+12)

# Titles on map
make_text("FLORIDA",(*geo(-82.7,28.9),0.16),0.24,white,"FloridaLabel")
make_text("CUBA",(*geo(-78.6,21.85),0.16),0.27,white,"CubaLabel")
make_text("LA HABANA",havana+(0.24,),0.18,red,"HavanaLabel")

# Layer words, staged vertically in upper-air plane
layers=[("PETROLEO",38),("SANCIONES",58),("FINANZAS",78),("MOVILIDAD",98)]
for idx,(body,start) in enumerate(layers):
    o=make_text(body,(3.25,-2.4+idx*0.55,0.35),0.24,white,f"Layer_{idx}")
    o.data.align_x="RIGHT"
    o.scale=(0.001,0.001,0.001)
    o.keyframe_insert(data_path="scale",frame=start-5)
    o.scale=(1,1,1)
    o.keyframe_insert(data_path="scale",frame=start+8)
    # Red dot
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8,radius=0.045,location=(3.45,-2.28+idx*0.55,0.35))
    dot=bpy.context.active_object; dot.data.materials.append(red)

# Main title lying on map
make_text("2026",(-3.9,-3.9,0.32),0.22,warm,"Year")
title=make_text("LA PRESION\nSE AMPLIA",(-3.9,-4.45,0.32),0.50,white,"MainTitle")
title.data.space_line=0.78
sub=make_text("La politica cambia de instrumentos.",(-3.9,-5.55,0.32),0.19,land_edge,"SubTitle")

# Camera
bpy.ops.object.camera_add(location=(0.6,-10.8,14.0))
cam=bpy.context.active_object
scene.camera=cam
cam.data.lens=54
look_at(cam,(0,-0.6,0.0))
cam.keyframe_insert(data_path="location",frame=1)
cam.location=(0.25,-9.6,12.6)
look_at(cam,(0,-0.35,0.0))
cam.keyframe_insert(data_path="location",frame=150)
cam.keyframe_insert(data_path="rotation_euler",frame=150)

# Soft key lights
bpy.ops.object.light_add(type="AREA", location=(-5,-2,8))
key=bpy.context.active_object; key.data.energy=650; key.data.shape="DISK"; key.data.size=7
key.data.color=(0.18,0.32,0.42)
look_at(key,(0,0,0))
bpy.ops.object.light_add(type="AREA", location=(5,2,5))
rim=bpy.context.active_object; rim.data.energy=450; rim.data.size=5; rim.data.color=(0.45,0.05,0.035)
look_at(rim,(0,0,0))

# Compositor subtle glare
scene.use_nodes=True
nt=scene.node_tree
nt.nodes.clear()
rl=nt.nodes.new("CompositorNodeRLayers")
gl=nt.nodes.new("CompositorNodeGlare"); gl.glare_type="FOG_GLOW"; gl.quality="HIGH"; gl.threshold=0.8; gl.size=6
comp=nt.nodes.new("CompositorNodeComposite")
nt.links.new(rl.outputs["Image"],gl.inputs["Image"])
nt.links.new(gl.outputs["Image"],comp.inputs["Image"])

# Save master
blend=resolve(CONFIG.get("blendFile","out/rubio-habana-map-master.blend"))
blend.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(blend))

if BUILD_ONLY:
    print("BLENDER_BUILD_ONLY_COMPLETE")
    raise SystemExit(0)

if not SKIP_POSTER:
    preview=resolve(CONFIG.get("previewFile","out/rubio-habana-map-preview.png"))
    scene.frame_set(88)
    scene.render.filepath=str(preview)
    scene.render.image_settings.file_format="PNG"
    bpy.ops.render.render(write_still=True)

if scene.frame_end>scene.frame_start:
    video=resolve(CONFIG.get("videoFile","out/rubio-habana-map.mp4"))
    scene.render.image_settings.file_format="FFMPEG"
    scene.render.ffmpeg.format="MPEG4"
    scene.render.ffmpeg.codec="H264"
    scene.render.filepath=str(video)
    bpy.ops.render.render(animation=True)

print("BLENDER_PROJECT_READY")
