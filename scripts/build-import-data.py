#!/usr/bin/env python3
"""Build a small data adapter for the published portfolio's existing components."""
from pathlib import Path
import json,hashlib,re
ROOT=Path(__file__).resolve().parents[1]
m=json.loads((ROOT/'assets/import-2026-09/manifest.json').read_text())
by_hash={r['sha256']:r for r in m['files']}
replacements={}
for folder in ['assets/content','assets/campaigns']:
 for p in (ROOT/folder).rglob('*'):
  if not p.is_file():continue
  digest=hashlib.sha256(p.read_bytes()).hexdigest()
  if digest in by_hash:replacements[str(p.relative_to(ROOT))]=by_hash[digest]['web']
rows=[];seen=set()
for r in m['files']:
 if r['kind'] not in ['image','video'] or (r['section'],r['sha256']) in seen:continue
 seen.add((r['section'],r['sha256']))
 t=re.sub(r'([a-z])([A-Z])',r'\1 \2',re.sub(r'^BF_','',Path(r['source']).stem));t=re.sub('[_-]+',' ',t)
 rows.append({'src':r['web'],'thumbnail':r['thumbnail'],'alt':t,'title':t,'type':r['kind'],'section':r['section'],'source':r['source'],'group':str(Path(r['source']).parent),'width':r['width'],'height':r['height']})
header='/* Generated from assets/import-2026-09/manifest.json. */\n(function () {\n  "use strict";\n  var imported = '+json.dumps(rows,ensure_ascii=False,separators=(',',':'))+';\n  var replacements = '+json.dumps(replacements,separators=(',',':'))+';\n'
logic=(ROOT/'scripts/import-data-adapter.js').read_text()
(ROOT/'js/imported-portfolio-data.js').write_text(header+logic+'\n}());\n')
# Load the adapter after source data and before the existing renderers.
for p in [ROOT/'index.html',*(ROOT/'campaigns').glob('*/index.html')]:
 html=p.read_text()
 if 'js/imported-portfolio-data.js' not in html:
  pattern=r'(<script src="js/'+('portfolio-data' if p==ROOT/'index.html' else 'campaign-data')+r'\.js[^>]*></script>)'
  html=re.sub(pattern,r'\1\n<script src="js/imported-portfolio-data.js?v=20260914-assets" defer></script>',html)
 p.write_text(html)
print('Built homepage/campaign data:',len(rows),'visual section entries')
