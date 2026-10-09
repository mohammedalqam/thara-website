"""Offline CPU render of the same GLB and camera poses. NOT WebGL evidence.
Run: blender --background --threads 4 --python tools/render-cinematic-posters.py -- exterior
The original logo is mounted unchanged. Cycles lighting is a poster approximation.
"""
import bpy, math, json, sys
from pathlib import Path
from mathutils import Vector, Matrix

root=Path(__file__).resolve().parents[1]
shots=json.loads((root/'docs/cinematic-v4/shot-poses.json').read_text())
requested=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else ['exterior']
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(root/'assets/cinematic/thara-courtyard.glb'))
scene=bpy.context.scene
scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=32;scene.cycles.use_denoising=True
scene.render.image_settings.file_format='PNG';scene.render.resolution_percentage=100
scene.world=bpy.data.worlds.new('Warm architectural sky');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.77,.79,.76,1)
scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.65
scene.view_settings.view_transform='AgX';scene.view_settings.look='AgX - Medium High Contrast';scene.view_settings.exposure=-.15

def coord(p): return Vector((p[0],-p[2],p[1]))
def light(name,kind,position,energy,color,size=1,target=(0,0,0)):
    data=bpy.data.lights.new(name,kind);data.energy=energy;data.color=color
    if kind=='AREA': data.shape='DISK';data.size=size
    if kind=='SUN': data.angle=math.radians(7)
    obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.location=coord(position)
    obj.rotation_euler=(coord(target)-obj.location).to_track_quat('-Z','Y').to_euler();return obj
light('Late afternoon sun','SUN',[-10,12,9],2.5,(1,.88,.70),target=[0,0,0])
light('Foyer bounce','AREA',[0,3.4,2],170,(1,.90,.75),3,target=[0,0,2])
light('Living soft light','AREA',[-3.5,3.35,-2],240,(1,.93,.83),4,target=[-3.5,0,-2])
light('Dining glow','AREA',[4.5,3.3,-2.2],100,(1,.89,.71),2,target=[4.5,0,-2.2])

# Add micro-surface detail to the named imported materials, retaining GLB colours.
for mat in bpy.data.materials:
    if not mat.use_nodes: continue
    nodes=mat.node_tree.nodes;links=mat.node_tree.links
    bsdf=next((n for n in nodes if n.type=='BSDF_PRINCIPLED'),None)
    if not bsdf: continue
    if any(word in mat.name.lower() for word in ['limestone','travertine','walnut','linen']):
        tex=nodes.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=35 if 'linen' in mat.name.lower() else 10
        tex.inputs['Detail'].default_value=3
        bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.18;bump.inputs['Distance'].default_value=.014
        links.new(tex.outputs['Fac'],bump.inputs['Height']);links.new(bump.outputs['Normal'],bsdf.inputs['Normal'])
    if mat.name.startswith('Water'):
        tex=nodes.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=2.8;tex.inputs['Roughness'].default_value=.6
        bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.22;bump.inputs['Distance'].default_value=.06
        links.new(tex.outputs['Fac'],bump.inputs['Height']);links.new(bump.outputs['Normal'],bsdf.inputs['Normal'])
    if mat.name.startswith('Warm_LED'):
        bsdf.inputs['Emission Color'].default_value=(1,.65,.25,1);bsdf.inputs['Emission Strength'].default_value=2

logo=bpy.data.objects.get('OriginalLogo')
logo_mat=logo.data.materials[0];logo_mat.use_nodes=True
bsdf=next(n for n in logo_mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
image=logo_mat.node_tree.nodes.new('ShaderNodeTexImage');image.image=bpy.data.images.load(str(root/'assets/logo.jpeg'))
logo_mat.node_tree.links.new(image.outputs['Color'],bsdf.inputs['Base Color'])
door=bpy.data.objects.get('DoorPivot');baseline=door.matrix_world.copy()
camdata=bpy.data.cameras.new('Scroll camera');camera=bpy.data.objects.new('Scroll camera',camdata);scene.collection.objects.link(camera);scene.camera=camera
camdata.clip_start=.07;camdata.clip_end=130;camdata.sensor_fit='VERTICAL';camdata.sensor_height=24
out=root/'docs/cinematic-v4/renders';out.mkdir(parents=True,exist_ok=True)
for shot in shots:
    if shot['name'] not in requested: continue
    pivot=baseline.translation
    door.matrix_world=Matrix.Translation(pivot)@Matrix.Rotation(shot['door'],4,'Z')@Matrix.Translation(-pivot)@baseline
    camera.location=coord(shot['position']);camera.rotation_euler=(coord(shot['look'])-camera.location).to_track_quat('-Z','Y').to_euler()
    camdata.lens=12/math.tan(math.radians(shot['fov']/2));camdata.shift_x=.14 if shot['name']=='exterior' else 0
    scene.render.resolution_x=shot['w'];scene.render.resolution_y=shot['h'];scene.render.filepath=str(out/(shot['name']+'.png'))
    bpy.ops.render.render(write_still=True)
    print('THARA_RENDER_SAVED',scene.render.filepath,flush=True)
