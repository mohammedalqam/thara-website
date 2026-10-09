"""CPU renders of real extruded letters, not screenshots of the WebGL journey."""
import bpy, json, math, sys
from pathlib import Path
from mathutils import Matrix, Vector
root=Path(__file__).resolve().parents[1]
requested=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(root/'assets/cinematic/thara-letters.glb'))
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=16;scene.cycles.use_denoising=True
scene.world=bpy.data.worlds.new('Champagne studio');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.88,.84,.75,1);scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.7
scene.render.image_settings.file_format='PNG';scene.view_settings.view_transform='AgX'
for location,energy,size in [((-250,-400,500),1200000,700),((400,-200,100),900000,500)]:
 data=bpy.data.lights.new('Softbox','AREA');data.energy=energy;data.shape='DISK';data.size=size;obj=bpy.data.objects.new('Softbox',data);scene.collection.objects.link(obj);obj.location=location;obj.rotation_euler=(-obj.location).to_track_quat('-Z','Y').to_euler()
camera=bpy.data.objects.new('Letter camera',bpy.data.cameras.new('Letter camera'));scene.collection.objects.link(camera);scene.camera=camera
camera.location=(0,-1000,0);camera.rotation_euler=(Vector((0,0,0))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.clip_end=3000
shots=json.loads((root/'docs/cinematic-v4/letter-poses.json').read_text())
out=root/'docs/cinematic-v4/renders';out.mkdir(parents=True,exist_ok=True)
for shot in shots:
 if requested and shot['name'] not in requested: continue
 for i,pose in enumerate(shot['poses']):
  obj=bpy.data.objects.get(f'THARA_{i}_{"THARA"[i]}');s=pose['scale']
  rotation=Matrix.Rotation(pose['rx'],4,'X')@Matrix.Rotation(pose['ry'],4,'Z')@Matrix.Rotation(-pose['rz'],4,'Y')
  obj.matrix_world=Matrix.Translation((pose['x']-shot['w']/2,-pose['z'],shot['h']/2-pose['y']))@rotation@Matrix.Diagonal((s,s,s,1))
 camera.data.ortho_scale=max(shot['w'],shot['h']);scene.render.resolution_x=shot['w'];scene.render.resolution_y=shot['h']
 scene.render.filepath=str(out/(shot['name']+'.png'));bpy.ops.render.render(write_still=True)
