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
scene.frame_end = 144
scene.world.color = (0.0025, 0.004, 0.008)

try:
    scene.view_settings.look = "AgX - Medium High Contrast"
except Exception:
    pass

# ---------- Materials ----------
def principled(name, color, metallic=0.0, roughness=0.45, emission=None, strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission is not None:
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = (*emission, 1)
            bsdf.inputs["Emission Strength"].default_value = strength
        elif "Emission" in bsdf.inputs:
            bsdf.inputs["Emission"].default_value = (*emission, 1)
    return m

def emission(name, color, strength=5):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt=m.node_tree
    nt.nodes.clear()
    out=nt.nodes.new("ShaderNodeOutputMaterial")
    em=nt.nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value=(*color,1)
    em.inputs["Strength"].default_value=strength
    nt.links.new(em.outputs["Emission"],out.inputs["Surface"])
    return m

grass=principled("Grass",(0.014,0.08,0.025),0,0.55)
white=principled("White",(0.82,0.85,0.9),0.0,0.35)
skyblue=principled("SkyBlue",(0.12,0.55,0.95),0.1,0.28)
darkblue=principled("DarkBlue",(0.015,0.04,0.11),0.2,0.28)
skin=principled("Skin",(0.72,0.48,0.33),0,0.42)
blond=principled("Blond",(0.8,0.62,0.18),0,0.38)
black=principled("Black",(0.01,0.01,0.015),0.4,0.22)
glow=emission("StadiumGlow",(0.35,0.75,1.0),5.5)
redglow=emission("GoalGlow",(1.0,0.08,0.03),7.0)

# ---------- Ground & stadium ----------
bpy.ops.mesh.primitive_plane_add(size=40, location=(0,0,0))
pitch=bpy.context.object
pitch.data.materials.append(grass)

# field lines
for x in (-3.66,3.66):
    bpy.ops.mesh.primitive_cube_add(location=(x,5.8,0.012), scale=(0.025,4.8,0.01))
    bpy.context.object.data.materials.append(white)
for y in (1.0,10.6):
    bpy.ops.mesh.primitive_cube_add(location=(0,y,0.012), scale=(3.66,0.025,0.01))
    bpy.context.object.data.materials.append(white)

# goal
goal_y=10.5
post_r=0.055
for x in (-3.66,3.66):
    bpy.ops.mesh.primitive_cylinder_add(vertices=28, radius=post_r, depth=2.44, location=(x,goal_y,1.22))
    bpy.context.object.data.materials.append(white)
bpy.ops.mesh.primitive_cylinder_add(vertices=28, radius=post_r, depth=7.32, location=(0,goal_y,2.44), rotation=(0,math.radians(90),0))
bpy.context.object.data.materials.append(white)

# net as curves/grid
net_mat=principled("Net",(0.55,0.62,0.7),0,0.5)
for i in range(15):
    x=-3.66+i*(7.32/14)
    bpy.ops.mesh.primitive_cube_add(location=(x,10.82,1.22), scale=(0.008,0.008,1.22))
    bpy.context.object.data.materials.append(net_mat)
for j in range(9):
    z=j*(2.44/8)
    bpy.ops.mesh.primitive_cube_add(location=(0,10.82,z), scale=(3.66,0.008,0.008))
    bpy.context.object.data.materials.append(net_mat)

# stadium lights
for sx in (-1,1):
    for k in range(4):
        x=sx*(5.4+k*0.6)
        y=6.0+k*0.9
        bpy.ops.object.light_add(type="AREA", location=(x,y,7.0))
        l=bpy.context.object
        l.data.energy=700
        l.data.shape="RECTANGLE"
        l.data.size=3
        l.data.color=(0.45,0.72,1.0)
        d=Vector((0,5.5,0.8))-l.location
        l.rotation_euler=d.to_track_quat("-Z","Y").to_euler()

# ---------- Player rig from primitives ----------
def add_limb(name, a, b, radius, mat):
    mid=(Vector(a)+Vector(b))/2
    length=(Vector(b)-Vector(a)).length
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=radius, depth=length, location=mid)
    o=bpy.context.object
    o.name=name
    o.data.materials.append(mat)
    direction=Vector(b)-Vector(a)
    o.rotation_euler=direction.to_track_quat("Z","Y").to_euler()
    return o

def add_player(name, loc=(0,0,0), scale=1.0, keeper=False):
    root=bpy.data.objects.new(name,None)
    bpy.context.collection.objects.link(root)
    x,y,z=loc

    torso_mat=redglow if keeper else skyblue
    shorts_mat=black if keeper else white

    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=0.23*scale, location=(x,y,z+1.78*scale))
    head=bpy.context.object; head.parent=root; head.data.materials.append(skin)

    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=0.25*scale, location=(x,y-0.01,z+1.98*scale))
    hair=bpy.context.object; hair.scale=(1.0,1.0,0.32); hair.parent=root; hair.data.materials.append(blond if not keeper else black)

    bpy.ops.mesh.primitive_cube_add(location=(x,y,z+1.25*scale), scale=(0.34*scale,0.2*scale,0.48*scale))
    torso=bpy.context.object; torso.parent=root; torso.data.materials.append(torso_mat)

    bpy.ops.mesh.primitive_cube_add(location=(x,y,z+0.86*scale), scale=(0.32*scale,0.21*scale,0.16*scale))
    shorts=bpy.context.object; shorts.parent=root; shorts.data.materials.append(shorts_mat)

    # limbs as children
    for nm,a,b,rad,mat in [
        ("LArm",(x-0.28*scale,y,z+1.5*scale),(x-0.55*scale,y,z+1.05*scale),0.085*scale,skin),
        ("RArm",(x+0.28*scale,y,z+1.5*scale),(x+0.55*scale,y,z+1.1*scale),0.085*scale,skin),
        ("LLeg",(x-0.16*scale,y,z+0.72*scale),(x-0.18*scale,y,z+0.1*scale),0.11*scale,skin),
        ("RLeg",(x+0.16*scale,y,z+0.72*scale),(x+0.18*scale,y,z+0.1*scale),0.11*scale,skin),
    ]:
        limb=add_limb(nm,a,b,rad,mat); limb.parent=root

    return root

striker=add_player("Striker",(0,-1.3,0),1.15,False)
keeper=add_player("Keeper",(0,9.8,0),1.05,True)

# Back number 9 as text
bpy.ops.object.text_add(location=(0,-1.53,1.35), rotation=(math.radians(90),0,0))
num=bpy.context.object
num.data.body="9"
num.data.align_x="CENTER"
num.data.size=0.48
num.data.extrude=0.015
num.data.materials.append(white)
num.parent=striker

# ball
bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, radius=0.12, location=(0,-0.15,0.12))
ball=bpy.context.object
ball.name="Ball"
ball.data.materials.append(white)

# black patches simplified
for i in range(6):
    a=math.tau*i/6
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=10, radius=0.027, location=(0.11*math.cos(a),-0.15+0.11*math.sin(a),0.12))
    bpy.context.object.data.materials.append(black)
    bpy.context.object.parent=ball

# ---------- Animation ----------
def kf(obj, prop, frame):
    obj.keyframe_insert(prop, frame=frame)

# striker run + strike
striker.location=(0,-2.2,0); kf(striker,"location",1)
striker.location=(0,-0.65,0); kf(striker,"location",46)
striker.location=(0.05,-0.1,0); kf(striker,"location",58)
striker.location=(0.12,0.18,0); kf(striker,"location",72)

striker.rotation_euler=(0,0,math.radians(-5)); kf(striker,"rotation_euler",1)
striker.rotation_euler=(0,0,math.radians(7)); kf(striker,"rotation_euler",58)
striker.rotation_euler=(0,0,math.radians(-18)); kf(striker,"rotation_euler",72)

# keeper dive
keeper.location=(0,0,0); kf(keeper,"location",1)
keeper.location=(0,0,0); kf(keeper,"location",58)
keeper.location=(-2.25,0,0.55); kf(keeper,"location",90)
keeper.rotation_euler=(0,0,0); kf(keeper,"rotation_euler",58)
keeper.rotation_euler=(0,math.radians(-72),math.radians(12)); kf(keeper,"rotation_euler",90)

# ball trajectory
ball.location=(0,-0.15,0.12); kf(ball,"location",1); kf(ball,"location",58)
ball.location=(0.45,3.6,0.72); kf(ball,"location",72)
ball.location=(1.45,7.5,1.72); kf(ball,"location",88)
ball.location=(2.72,10.55,2.08); kf(ball,"location",100)
ball.location=(2.98,10.95,1.96); kf(ball,"location",112)

ball.rotation_euler=(0,0,0); kf(ball,"rotation_euler",58)
ball.rotation_euler=(math.radians(540),math.radians(420),math.radians(720)); kf(ball,"rotation_euler",112)

# smooth curves
for obj in (striker,keeper,ball):
    if obj.animation_data and obj.animation_data.action:
        for fc in obj.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation="BEZIER"

# fake net impact: move right side strips
for o in bpy.context.scene.objects:
    if o.type=="MESH" and o.location.y>10.7 and o.location.x>1.6:
        o.keyframe_insert("location",frame=96)
        o.location.y += 0.28
        o.location.x += 0.12
        o.keyframe_insert("location",frame=106)
        o.location.y -= 0.18
        o.location.x -= 0.05
        o.keyframe_insert("location",frame=126)

# ---------- Camera cinematic ----------
bpy.ops.object.camera_add(location=(0,-6.8,1.25))
cam=bpy.context.object
scene.camera=cam
cam.data.lens=52
try:
    cam.data.dof.use_dof=True
    cam.data.dof.focus_object=ball
    cam.data.dof.aperture_fstop=2.2
except Exception:
    pass

def point(cam,target):
    cam.rotation_euler=(Vector(target)-cam.location).to_track_quat("-Z","Y").to_euler()

cam.location=(-0.7,-6.8,1.15); point(cam,(0,-0.4,0.8)); kf(cam,"location",1); kf(cam,"rotation_euler",1)
cam.location=(0.3,-3.4,1.05); point(cam,(0,-0.1,0.7)); kf(cam,"location",50); kf(cam,"rotation_euler",50)
cam.location=(0.65,1.2,0.65); point(cam,(0.8,6.8,1.45)); kf(cam,"location",64); kf(cam,"rotation_euler",64)
cam.location=(1.3,5.2,1.1); point(cam,(2.3,10.2,1.9)); kf(cam,"location",96); kf(cam,"rotation_euler",96)
cam.location=(-0.15,7.0,1.65); point(cam,(0.1,8.8,1.0)); kf(cam,"location",118); kf(cam,"rotation_euler",118)
cam.location=(0.4,4.2,1.55); point(cam,(0.1,6.8,1.2)); kf(cam,"location",144); kf(cam,"rotation_euler",144)

for fc in cam.animation_data.action.fcurves:
    for kp in fc.keyframe_points:
        kp.interpolation="BEZIER"

# ---------- Hero light streak ----------
bpy.ops.mesh.primitive_torus_add(major_radius=0.42, minor_radius=0.014, major_segments=96, minor_segments=10, location=(2.7,10.45,2.05), rotation=(math.radians(78),0,0))
impact=bpy.context.object
impact.data.materials.append(redglow)
impact.scale=(0.15,0.15,0.15); kf(impact,"scale",96)
impact.scale=(1.25,1.25,1.25); kf(impact,"scale",106)
impact.scale=(1.7,1.7,1.7); kf(impact,"scale",118)

# Compositor glow
scene.use_nodes=True
nt=scene.node_tree
nt.nodes.clear()
rl=nt.nodes.new("CompositorNodeRLayers")
glare=nt.nodes.new("CompositorNodeGlare")
glare.glare_type="FOG_GLOW"
glare.quality="HIGH"
glare.threshold=0.7
glare.size=6
comp=nt.nodes.new("CompositorNodeComposite")
nt.links.new(rl.outputs["Image"],glare.inputs["Image"])
nt.links.new(glare.outputs["Image"],comp.inputs["Image"])

if not SKIP_POSTER:
    # poster
    scene.frame_set(100)
    scene.render.image_settings.file_format="PNG"
    scene.render.filepath=os.path.join(OUT,"haaland-goal-poster.png")
    bpy.ops.render.render(write_still=True)
else:
    print("BLENDER_POSTER_SKIPPED")

# save blend
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,"haaland-goal-cinematic.blend"))

if BUILD_ONLY:
    print("BLENDER_BUILD_ONLY_READY")
    raise SystemExit(0)

# movie
scene.render.image_settings.file_format="FFMPEG"
scene.render.ffmpeg.format="MPEG4"
scene.render.ffmpeg.codec="H264"
scene.render.ffmpeg.constant_rate_factor="MEDIUM"
scene.render.ffmpeg.ffmpeg_preset="GOOD"
scene.render.ffmpeg.audio_codec="NONE"
scene.render.filepath=os.path.join(OUT,"haaland-goal-cinematic.mp4")
scene.frame_set(1)
bpy.ops.render.render(animation=True)

print("HAALAND_GOAL_CINEMATIC_READY")
