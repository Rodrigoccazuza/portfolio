#!/usr/bin/env python3
"""Verify import coverage, published file budgets, and local gallery references.
Pass --archives DIR to also verify the original release archives against SHA-256.
"""
from pathlib import Path
from urllib.parse import unquote,urlsplit
from html.parser import HTMLParser
import json,hashlib,zipfile,sys
ROOT=Path(__file__).resolve().parents[1]
m=json.loads((ROOT/'assets/import-2026-09/manifest.json').read_text());rows=m['files']
a=json.loads((ROOT/'assets/import-2026-09/archive-index.json').read_text())
assert len(rows)==m['sourceCount']==429
assert {r['source'] for r in rows}=={r['source'] for r in a}
assert len({r['sha256'] for r in rows})==m['uniqueCount']
refs=set(); errors=[]
class Links(HTMLParser):
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  for k in ['src','href','poster','data-viewer-src']:
   v=attrs.get(k,'');p=urlsplit(v)
   if not p.scheme and p.path.startswith(('assets/import-2026-09/','css/imported-assets.css')):refs.add(unquote(p.path))
for p in ROOT.rglob('*.html'):
 if '.git' in p.parts or 'assets' in p.parts:continue
 Links().feed(p.read_text())
for r in rows:
 for k in ['web','thumbnail']:
  if k in r: assert (ROOT/r[k]).is_file(),r[k]
 assert (ROOT/r['web']).stat().st_size==r['webBytes'],r['source']
 if r['kind'] in ['image','video']:assert r['width']>0 and r['height']>0
for p in refs:assert (ROOT/p).is_file(),p
files=[p for p in ROOT.rglob('*') if p.is_file() and '.git' not in p.parts]
size=sum(p.stat().st_size for p in files)
assert size<1000000000, f'Published site exceeds conservative 1 GB budget: {size}'
assert max((ROOT/r['web']).stat().st_size for r in rows)<100*1024*1024
print(f'PASS: {len(rows)} sources, {m["uniqueCount"]} unique files, {len(refs)} imported references; published files {size/1e6:.1f} MB')
if '--archives' in sys.argv:
 folder=Path(sys.argv[sys.argv.index('--archives')+1]); mapping={r['source']:r for r in a};zips={}
 for i,r in enumerate(rows):
  h=hashlib.sha256();parts=mapping[r['source']]['archives']
  if len(parts)==1 and parts[0].endswith('.zip'):
   if parts[0] not in zips:zips[parts[0]]=zipfile.ZipFile(folder/parts[0])
   with zips[parts[0]].open(r['source']) as f:
    for b in iter(lambda:f.read(4*1024*1024),b''):h.update(b)
  else:
   for part in parts:
    with (folder/part).open('rb') as f:
     for b in iter(lambda:f.read(4*1024*1024),b''):h.update(b)
  assert h.hexdigest()==r['sha256'],r['source']
 for z in zips.values():z.close()
 print('PASS: all 429 originals verified byte-for-byte against the source checksums')
