from pathlib import Path
import sys
from PIL import Image,ImageDraw
p=Path(sys.argv[1])/'public/assets/miespol';p.mkdir(parents=True,exist_ok=True)
# Original release-only placeholders: no cropped pixels or institutional marks.
names=['logo','header-tools','avatar','historia','academico','calendario','bienestar','certificados','restaurantes','mapa','nav-inicio','nav-sirena','nav-qr','nav-huella','nav-perfil','favorito']
for name in names:
 size=(300,140) if name=='logo' else (640,120) if name=='historia' else (100,100)
 im=Image.new('RGBA',size,(0,0,0,0));d=ImageDraw.Draw(im)
 if name=='logo':d.text((12,20),'PoliNexo',fill='#294d70',font_size=40);d.text((14,75),'Demo no oficial',fill='#6b8ca3',font_size=18)
 elif name=='historia':
  d.line((12,60,628,60),fill='#bed0dd',width=2)
  for x in [30,145,260,375,490,605]:d.ellipse((x-8,52,x+8,68),fill='#7198b2')
  d.text((170,85),'Recurso institucional no incluido',fill='#6c879b',font_size=16)
 else:
  d.rounded_rectangle((20,17,80,78),radius=18,outline='#7395ae',width=3)
  d.text((37,30),('D' if name=='avatar' else name.replace('nav-','')[0].upper()),fill='#426d8f',font_size=28)
 im.save(p/(name+'.png'))
