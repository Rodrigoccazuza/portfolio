#!/usr/bin/env python3
"""Render the checked-in import manifest into existing portfolio pages."""
from pathlib import Path
from collections import defaultdict
from html import escape as e
from urllib.parse import quote,unquote
import json,re,hashlib
ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'assets/import-2026-09/manifest.json').read_text())
archive=json.loads((ROOT/'assets/import-2026-09/archive-index.json').read_text())
archives={r['source']:r['archives'] for r in archive}
release=manifest['release'];download=release.replace('/tag/','/download/')+'/'
def url(x):return quote(x,safe='/')
def title(source):
 names={
  '24356995_2025-01-14.pdf': 'Dean’s List — Fall 2024',
  'doc00286620250715132439.pdf': 'BMCC Certificate of Excellence — Multimedia Programming and Design',
  'doc00286820250715132900.pdf': 'BMCC Associate in Science — Multimedia Programming and Design',
  'Certificado Rodrigo CSVM.pdf': 'CSVM / UFRR — Orientação Cidadã Volunteer Certificate',
  'Coursera Fund of Desing.pdf': 'CalArts — Fundamentals of Graphic Design',
  'Coursera CREATIVE WRITTING THE CRAFT OF STYLE.pdf': 'Wesleyan — Creative Writing: The Craft of Style',
  'Coursera Setting and description.pdf': 'Wesleyan — Creative Writing: The Craft of Setting and Description',
  'Coursera The craft of plot.pdf': 'Wesleyan — Creative Writing: The Craft of Plot',
  'Coursera the craft of character.pdf': 'Wesleyan — Creative Writing: The Craft of Character'
 }
 if Path(source).name in names:return names[Path(source).name]
 name=Path(source).stem
 if name.startswith('BF_'):return bf_title(name)
 social={'gridphoto':'Your Data Your Money Instagram grid','linktree':'Your Data Your Money Linktree page',
  'screencapture-htetaunglin1151-github-io-emailblasttesting-2025-07-17-00_00_08':'Your Data Your Money email blast page, full-page screenshot',
  'screencapture-htetaunglin1151-github-io-socialmediablackout-2025-07-17-00_00_25':'Your Data Your Money social media blackout page, full-page screenshot'}
 if name in social:return social[name]
 name=re.sub(r'([a-z])([A-Z])',r'\1 \2',name)
 return re.sub(r'[_-]+',' ',name).strip()
# BodyFactory files follow BF_{Subject}_{Channel}_{Descriptor}-{n}; spell them out as readable labels,
# e.g. BF_Botox_Ad_POV-StaffGreeting-Blond-16x9 -> "BodyFactory Botox Ad: POV Staff Greeting, Blond (16:9)".
CHANNELS={'Ad':'Ad','Social':'Social Post','Email':'Email','Raw':'Raw Footage','Video':'Video','Story':'Story'}
PHRASES=[(r'(\d+)vs(\d+)Days',r'Day \1 vs. Day \2'),(r'FlatFee(\d+)',r'$\1 Flat Fee'),(r'Promo(\d+)Off',r'\1% Off Promo'),
 (r'(\D)(\d+)Off',r'\1 \2% Off'),(r'Campaign(\d+)x(\d+)',r'Campaign \1:\2'),(r'([A-Za-z])(\d+)$',r'\1 \2'),(r'BeforeAfter','Before and After'),(r'\bAlt\b','Alternate'),(r'\bIG\b','Instagram'),(r'(\d+)Areas',r'\1 Areas'),(r'(\d+)Days',r'\1 Days'),(r'(\d+)Signs',r'\1 Signs')]
def words(text):
 for pattern,repl in PHRASES:text=re.sub(pattern,repl,text)
 keep={'HydraFacial':'\x00H','CoolSculpting':'\x00C','iPad':'\x00I','YouTube':'\x00Y'}
 for k,v in keep.items():text=text.replace(k,v)
 text=re.sub(r'(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])',' ',text)
 for k,v in keep.items():text=text.replace(v,k)
 for a,b in [('Valentines',"Valentine's"),('Mothers Day',"Mother's Day"),('4th Of July','4th of July'),(' And ',' and '),(' To ',' to '),(' A ',' a ')]:text=text.replace(a,b)
 return re.sub(r'\s+',' ',text).strip()
def bf_title(name):
 parts=name[3:].split('_')
 if len(parts)<3:return 'BodyFactory '+words(' '.join(parts).replace('-',' '))
 subject=parts[0].replace('Promo-','')+(' Promo' if parts[0].startswith('Promo-') else '')
 channel=CHANNELS.get(parts[1],parts[1]) if len(parts)>1 else ''
 rest='_'.join(parts[2:])
 ratio=re.search(r'-?(\d+)x(\d+)$',rest)
 if ratio:rest=rest[:ratio.start()]
 extras=[];m=re.search(r'(?:^|-)(\d+)(?:-([A-Z]))?(?:-(.+))?$',rest)
 if m and m.group(1):
  rest=rest[:m.start()]
  extras.append(('Slide ' if 'Carousel' in rest else '#')+str(int(m.group(1))))
  if m.group(2):extras.append('Version '+m.group(2))
  if m.group(3):extras.append(words(m.group(3).replace('-',' ')))
 detail=', '.join(filter(None,[words(p) for p in rest.split('-')]+extras))
 label=' '.join(filter(None,['BodyFactory',words(subject),channel]))
 if detail:label+=': '+detail
 if ratio:label+=f' ({ratio.group(1)}:{ratio.group(2)})'
 return label
def route(sec):return 'experience/' if sec=='experience' else 'projects/'+sec+'/'
def image(row,sec):
 text=e(title(row['source'])); web=url(row['web']); thumb=url(row['thumbnail'])
 return f'<button type="button" class="deck-page-card" data-viewer-group="import-{sec}" data-viewer-src="{web}" data-viewer-alt="{text}" data-viewer-caption="{text}"><img src="{thumb}" alt="{text}" width="{row["width"]}" height="{row["height"]}" loading="lazy" decoding="async"><span class="deck-page-caption"><span class="deck-page-title">{text}</span></span></button>'
def card(row,sec):
 if row['kind']=='image':return image(row,sec)
 text=e(title(row['source']));web=url(row['web'])
 if row['kind']=='video':
  return f'<figure class="import-video"><video controls playsinline preload="none" poster="{url(row["thumbnail"])}" width="{row["width"]}" height="{row["height"]}" aria-label="{text}"><source src="{web}" type="video/mp4"><a href="{web}">Watch {text}</a></video><figcaption>{text}</figcaption></figure>'
 return f'<li><a href="{web}" download="{e(Path(row["source"]).name)}">{text}</a> <span>({Path(row["web"]).suffix[1:].upper()})</span></li>'
sections=defaultdict(list)
for r in manifest['files']:sections[r['section']].append(r)
index=['# Portfolio asset index','','All 429 supplied content files are accounted for below. Exact duplicates share a web copy. Original filenames and folder paths are preserved in the release archives. macOS metadata files are excluded.','',f'[Download original files]({release}) · [Machine-readable manifest](assets/import-2026-09/manifest.json) · [Archive contents](assets/import-2026-09/archive-index.json)','','The original YouTube video exceeds a single release-file size budget and is stored in four numbered binary parts. Download all four and follow the join command in the release notes.','']
for sec,rows in sorted(sections.items()):
 path=ROOT/route(sec)/'index.html'; html=path.read_text()
 html=re.sub(r'\s*<!-- imported-assets:start -->.*?<!-- imported-assets:end -->\s*','\n',html,flags=re.S)
 unique={}
 for r in rows:unique.setdefault(r['sha256'],r)
 # Upgrade matching existing image cards instead of showing the same source twice.
 covered=set()
 def replace_existing(match):
  block=match.group();m=re.search(r'data-viewer-src="([^"]+)"',block)
  if not m:return block
  imported_path=unquote(m.group(1))
  for digest,row in unique.items():
   if row['web']==imported_path:
    covered.add(digest);return image(row,sec)
  p=ROOT/imported_path
  if not p.is_file():return block
  digest=hashlib.sha256(p.read_bytes()).hexdigest()
  if digest not in unique:return block
  covered.add(digest);return image(unique[digest],sec)
 html=re.sub(r'<button\b[^>]*data-viewer-src="[^"]+".*?</button>',replace_existing,html,flags=re.S)
 grouped=defaultdict(list)
 for digest,r in unique.items():
  if digest not in covered:grouped[str(Path(r['source']).parent)].append(r)
 heading='Certificates & supporting documents' if sec=='experience' else 'Project asset library'
 chunks=['\n<!-- imported-assets:start -->',f'<section class="section imported-assets" id="asset-library"><div class="container"><h2>{heading}</h2>']
 if covered:chunks.append('<p>Additional media and supporting files complement the gallery above.</p>')
 for i,(group,items) in enumerate(sorted(grouped.items())):
  label=group.split('/',1)[-1].strip(); label=label.replace('SOCIAL CONTENT/','').replace('ADS CONTENT/','')
  chunks.append(f'<details class="import-group"'+(' open' if i==0 else '')+f'><summary>{e(label)} <span>({len(items)} files)</span></summary>')
  visual=[r for r in items if r['kind'] in ['image','video']];docs=[r for r in items if r['kind'] not in ['image','video']]
  if visual:chunks.extend(['<div class="deck-gallery">',*[card(r,sec) for r in visual],'</div>'])
  if docs:chunks.extend(['<ul class="import-downloads">',*[card(r,sec) for r in docs],'</ul>'])
  chunks.append('</details>')
 chunks.extend([f'<p class="import-source-link"><a href="{release}">Download original project files</a></p>','</div></section>','<!-- imported-assets:end -->\n'])
 html=html.replace('href="#asset-library"', 'href="'+route(sec)+'#asset-library"')
 block='\n'.join(chunks)+'</main>';html=re.sub(r'\s*</main>',lambda _:block,html,count=1)
 if 'css/imported-assets.css' not in html:html=html.replace('</head>','<link rel="stylesheet" href="css/imported-assets.css?v=20260914">\n</head>')
 if ('href="'+route(sec)+'#asset-library"') not in html:html=re.sub(r'(</h1>)',r'\1\n <p><a href="#asset-library">Browse '+('certificates' if sec=='experience' else 'project assets')+r' &darr;</a></p>',html,count=1)
 html=html.replace('href="#asset-library"', 'href="'+route(sec)+'#asset-library"')
 path.write_text(html)
 index.extend(['## '+sec.replace('-',' ').title(),'',f'[Portfolio section](https://rodrigoccazuza.github.io/portfolio/{route(sec)})','','| Source file | Web copy | Original archive |','| --- | --- | --- |'])
 for r in rows:
  links=' · '.join(f'[{a}]({download+url(a)})' for a in archives[r['source']])
  index.append(f'| {r["source"].replace("|", "&#124;")} | [Open]({url(r["web"])}) | {links} |')
 index.append('')
(ROOT/'ASSET_INDEX.md').write_text('\n'.join(index)+'\n')
print('Updated',len(sections),'existing pages')
