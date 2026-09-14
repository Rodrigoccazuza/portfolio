#!/usr/bin/env python3
"""Import the September 2026 source collection. Requires Pillow, pillow-heif,
imageio-ffmpeg. Usage: python scripts/import-portfolio-assets.py SOURCE_DIRECTORY.
Originals live in the matching GitHub release; this creates deduplicated web media.
"""
from pathlib import Path
import sys, re, json, hashlib, shutil, subprocess, concurrent.futures
from PIL import Image, ImageOps
import pillow_heif, imageio_ffmpeg
pillow_heif.register_heif_opener()
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path(sys.argv[1]); DEST=ROOT/'assets/import-2026-09'; DEST.mkdir(exist_ok=True)
FF=imageio_ffmpeg.get_ffmpeg_exe()

def sha(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(4*1024*1024),b''): h.update(b)
 return h.hexdigest()

def section(path):
 s=str(path).lower()
 if s.startswith('certificados'):return 'experience'
 if s.startswith('brand guidelines'):
  return 'brand-systems-'+('prisma-providers' if 'prisma' in s else 'taina-photography' if 'taina' in s else 'bodyfactory' if 'bodyfactory' in s else 'social-project')
 if 'youtube' in s:return 'youtube-youtube'
 if s.startswith('e-mail'):
  if 'welcome' in s:return 'email-design-welcome-flows-emails'
  if '4thofjuly' in s:return 'email-design-4th-july-email-series'
  if 'black-friday' in s or 'cyber_holidays' in s:return 'email-design-black-friday-cyber-monday-early-holidays'
  return 'email-design-body-factory-e-mail-campaigns-designs'
 if '/ads/' in s or 'ads content' in s or '_ad_' in s:
  if 'staticcarousel' in s:return 'meta-ad-creatives-static-carousel'
  if 'campaign3x4' in s:return 'meta-ad-creatives-wrinkle-treatmemt-campaign-3x4'
  if 'valentine' in s:return 'meta-ad-creatives-valentine-s-day-creatives'
  if path.suffix.lower() in ['.mp4','.mov']:return 'meta-ad-creatives-video-ad'
  return 'meta-ad-creatives-meta-ads-collection'
 if 'mydatamymoney' in s:return 'social-media-mydatamymoney-instagram'
 if path.suffix.lower() in ['.mov','.mp4']:return 'video-instagram-feed'
 return 'social-media-bodyfactory-instagram'

files=sorted(p for p in SOURCE.rglob('*') if p.is_file() and not any(x.startswith('.') for x in p.relative_to(SOURCE).parts))
existing={}
for p in (ROOT/'assets/portfolio-media').rglob('*'):
 if p.is_file(): existing.setdefault(sha(p),str(p.relative_to(ROOT)))
rows=[]; unique={}
for i,p in enumerate(files):
 rel=p.relative_to(SOURCE); digest=sha(p); sec=section(rel)
 row={'source':str(rel),'sha256':digest,'sourceBytes':p.stat().st_size,'section':sec}
 rows.append(row)
 if digest not in unique:
  slug=re.sub('[^a-z0-9]+','-',p.stem.lower()).strip('-')[:95]
  unique[digest]={'source':p,'stem':DEST/sec/(slug+'-'+digest[:8]),'row':row}
 print(f'Indexed {i+1}/{len(files)}',flush=True) if i%100==0 else None

def convert(item):
 digest, obj=item; p=obj['source']; stem=obj['stem']; stem.parent.mkdir(parents=True,exist_ok=True);ext=p.suffix.lower(); result={}
 def rel(x):return str(x.relative_to(ROOT))
 if ext in ['.png','.jpg','.jpeg','.heic','.gif']:
  full=stem.with_suffix('.webp');thumb=stem.with_name(stem.name+'-thumb').with_suffix('.webp')
  with Image.open(p) as im:
   im=ImageOps.exif_transpose(im)
   preview=im.convert('RGB');preview.thumbnail((640,960));preview.save(thumb,quality=78)
   result={'kind':'image','thumbnail':rel(thumb),'width':preview.width,'height':preview.height}
   if ext=='.gif':
    full=stem.with_suffix('.gif');shutil.copyfile(p,full)
   else:
    im.thumbnail((1600,8000));im.save(full,quality=85,method=6)
   result['web']=rel(full)
 elif ext in ['.mov','.mp4']:
  full=stem.with_suffix('.mp4');thumb=stem.with_name(stem.name+'-poster').with_suffix('.webp')
  probe=subprocess.run([FF,'-hide_banner','-i',str(p)],capture_output=True,text=True).stderr
  m=re.search(r'Duration: (\d+):(\d+):(\d+\.\d+)',probe)
  duration=sum(float(v)*k for v,k in zip(m.groups(),[3600,60,1])) if m else 60
  # Long-form cap ~42 MB; short-form target ~1100 kb/s. Never truncate clips.
  rate=min(1100,max(180,int(42000000*8/duration/1000)-80))
  if not full.exists():
   cmd=[FF,'-nostdin','-v','error','-i',str(p),'-map','0:v:0','-map','0:a:0?','-vf',"scale=720:720:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30",'-c:v','libx264','-preset','veryfast','-threads','2','-b:v',str(rate)+'k','-maxrate',str(rate)+'k','-bufsize',str(rate*2)+'k','-pix_fmt','yuv420p','-c:a','aac','-b:a','80k','-movflags','+faststart','-y',str(full)]
   subprocess.run(cmd,check=True)
  subprocess.run([FF,'-nostdin','-v','error','-i',str(full),'-frames:v','1','-vf','scale=480:-1','-y',str(thumb)],check=True)
  with Image.open(thumb) as im:w,h=im.size
  result={'kind':'video','web':rel(full),'thumbnail':rel(thumb),'width':w,'height':h,'duration':duration}
 else:
  full=stem.with_suffix(ext)
  if digest in existing:full=ROOT/existing[digest]
  else:shutil.copyfile(p,full)
  result={'kind':'document' if ext in ['.pdf','.pptx'] else 'resource','web':rel(full)}
 result['webBytes']=(ROOT/result['web']).stat().st_size
 print('Converted',p.name,flush=True)
 return digest,result

converted={}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 for digest,result in pool.map(convert,unique.items()):converted[digest]=result
for row in rows:row.update(converted[row['sha256']])
(DEST/'manifest.json').write_text(json.dumps({'sourceCount':len(rows),'uniqueCount':len(unique),'release':'https://github.com/Rodrigoccazuza/portfolio/releases/tag/portfolio-assets-2026-09','files':rows},indent=2,ensure_ascii=False)+'\n')
print('DONE',len(rows),len(unique),flush=True)
