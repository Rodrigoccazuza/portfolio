#!/usr/bin/env python3
"""Fit only new web video derivatives to a conservative 950 MB total site budget.
Original archives are untouched. Requires imageio-ffmpeg.
"""
from pathlib import Path
import json,subprocess,concurrent.futures
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[1];manifest=ROOT/'assets/import-2026-09/manifest.json';m=json.loads(manifest.read_text())
files=[p for p in ROOT.rglob('*') if p.is_file() and '.git' not in p.parts]
size=sum(p.stat().st_size for p in files);budget=950000000
videos={r['web']:r for r in m['files'] if r['kind']=='video' and r['section']!='youtube-youtube'}
if size>budget:
 available=sum((ROOT/p).stat().st_size for p in videos)-(size-budget)-5000000
 duration=sum(r['duration'] for r in videos.values())
 rate=max(200,int(available*8/duration/1000)-64)
 print(f'Current site: {size/1e6:.1f} MB; fitting web videos to {rate} kb/s + 64 kb/s audio.',flush=True)
 def fit(item):
  name,r=item;p=ROOT/name;tmp=p.with_name(p.stem+'.budget.mp4')
  current=p.stat().st_size*8/r['duration']/1000
  if current<=rate+64:return
  subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-nostdin','-v','error','-i',str(p),'-c:v','libx264','-preset','veryfast','-threads','2','-b:v',str(rate)+'k','-maxrate',str(rate)+'k','-bufsize',str(2*rate)+'k','-pix_fmt','yuv420p','-c:a','aac','-b:a','64k','-movflags','+faststart','-y',str(tmp)],check=True)
  tmp.replace(p);print('Fit',p.name,flush=True)
 with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(fit,videos.items()))
for r in m['files']:r['webBytes']=(ROOT/r['web']).stat().st_size
manifest.write_text(json.dumps(m,indent=2,ensure_ascii=False)+'\n')
print('Budget complete',flush=True)
