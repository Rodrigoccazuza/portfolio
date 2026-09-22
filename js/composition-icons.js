/* Replace pictographic text controls with the existing Bootstrap Icons font. */
(function () {
  const substitutions = [
    ['.folder-video','play-circle-fill',null],
    ['.folder-play','play-fill',' Play video'],
    ['.campaign-marker','circle-fill',null]
  ];
  substitutions.forEach(([selector,name,label])=>{
    document.querySelectorAll(selector).forEach(node=>{
      node.textContent='';
      const glyph=document.createElement('i');glyph.className='bi bi-'+name;glyph.setAttribute('aria-hidden','true');node.append(glyph);
      if(label)node.append(document.createTextNode(label));
    });
  });
}());
