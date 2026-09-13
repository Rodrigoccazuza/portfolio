// Mesh Drift WebGL background adapted from the supplied 21st.dev React component.
// Native implementation for this portfolio's existing HTML/CSS/JS stack.
(function () {
  'use strict';

  if (document.getElementById('mesh-drift-background')) return;

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.createElement('canvas');
  canvas.id = 'mesh-drift-background';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.tabIndex = -1;
  document.body.prepend(canvas);

  var style = document.createElement('style');
  style.id = 'mesh-drift-background-styles';
  style.textContent = `
    #mesh-drift-background {
      position: fixed;
      inset: 0;
      z-index: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      display: block;
      pointer-events: none;
      background: #02010a;
    }

    body.portfolio-redesign {
      position: relative;
      background: #02010a !important;
    }

    body.portfolio-redesign > .site-header,
    body.portfolio-redesign > main,
    body.portfolio-redesign > .site-footer,
    body.portfolio-redesign > .media-viewer,
    body.portfolio-redesign > .skip-link {
      position: relative;
      z-index: 1;
    }

    body.portfolio-redesign > .site-header { z-index: 100; }
    body.portfolio-redesign > .media-viewer { z-index: 1300; }
    body.portfolio-redesign > .skip-link { z-index: 1400; }

    body.portfolio-redesign main,
    body.portfolio-redesign .portfolio-sections,
    body.portfolio-redesign .toolkit-marquee,
    body.portfolio-redesign .behind-designs,
    body.portfolio-redesign .websites-showcase,
    body.portfolio-redesign .design-systems-showcase,
    body.portfolio-redesign .email-showcase,
    body.portfolio-redesign .media-rails-showcase,
    body.portfolio-redesign .section {
      background: transparent !important;
    }

    body.portfolio-redesign .portfolio-hero .hero-background {
      opacity: 0 !important;
      pointer-events: none;
    }

    body.portfolio-redesign .portfolio-hero::after {
      background:
        linear-gradient(90deg, rgba(0,0,0,.68), rgba(0,0,0,.30) 58%, rgba(0,0,0,.08)),
        linear-gradient(0deg, rgba(0,0,0,.58), transparent 58%) !important;
    }

    body.portfolio-redesign .toolkit-marquee {
      border-block: 1px solid rgba(255,255,255,.08);
      backdrop-filter: blur(10px);
    }

    body.portfolio-redesign .toolkit-marquee-group li {
      background: rgba(7, 6, 16, .66) !important;
      backdrop-filter: blur(12px);
    }

    body.portfolio-redesign .portfolio-category-label {
      background: rgba(7, 6, 16, .42);
      backdrop-filter: blur(12px);
    }

    @media (max-width: 860px) {
      body.portfolio-redesign .nav-links {
        background: rgba(4, 3, 12, .94) !important;
        backdrop-filter: blur(22px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #mesh-drift-background { pointer-events: none; }
    }
  `;
  document.head.appendChild(style);

  var gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) {
    canvas.style.background = 'radial-gradient(circle at 58% 32%, #3d2c8d 0, #04052e 38%, #02010a 76%)';
    return;
  }

  var VERT = [
    'attribute vec2 a_position;',
    'void main(){ gl_Position = vec4(a_position,0.0,1.0); }'
  ].join('\n');

  var FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec3 u_colors[8];
uniform vec4 u_scene;
uniform vec4 u_shape;
uniform vec4 u_surface;
uniform vec4 u_finish;
uniform vec4 u_transform;
uniform vec4 u_space;
uniform vec4 u_cursor;
#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x,31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w
float hash21(vec2 p){
#ifndef GL_FRAGMENT_PRECISION_HIGH
p=mod(p,31.0);
#endif
p=fract(p*vec2(234.34,435.345));p+=dot(p,p+34.23);return fract(p.x*p.y);}
float grainHash(vec2 p){vec3 p3=fract(vec3(p.xyx)*0.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);return mix(mix(hash21(i),hash21(i+vec2(1.0,0.0)),u.x),mix(hash21(i+vec2(0.0,1.0)),hash21(i+vec2(1.0,1.0)),u.x),u.y);}
float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(17.0,9.2);a*=0.5;}return v;}
vec3 srgbToLinear(vec3 c){return mix(c/12.92,pow((c+0.055)/1.055,vec3(2.4)),step(0.04045,c));}
vec3 linearToSrgb(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.0)),vec3(1.0/2.4))-0.055,step(0.0031308,c));}
vec3 linToOklab(vec3 c){float l=0.4122214708*c.r+0.5363325363*c.g+0.0514459929*c.b;float m=0.2119034982*c.r+0.6806995451*c.g+0.1073969566*c.b;float s=0.0883024619*c.r+0.2817188376*c.g+0.6299787005*c.b;l=pow(max(l,0.0),1.0/3.0);m=pow(max(m,0.0),1.0/3.0);s=pow(max(s,0.0),1.0/3.0);return vec3(0.2104542553*l+0.7936177850*m-0.0040720468*s,1.9779984951*l-2.4285922050*m+0.4505937099*s,0.0259040371*l+0.7827717662*m-0.8086757660*s);}
vec3 oklabToLin(vec3 c){float l=c.x+0.3963377774*c.y+0.2158037573*c.z;float m=c.x-0.1055613458*c.y-0.0638541728*c.z;float s=c.x-0.0894841775*c.y-1.2914855480*c.z;l=l*l*l;m=m*m*m;s=s*s*s;return vec3(4.0767416621*l-3.3077115913*m+0.2309699292*s,-1.2684380046*l+2.6097574011*m-0.3413193965*s,-0.0041960863*l-0.7034186147*m+1.7076147010*s);}
vec3 mixColour(vec3 a,vec3 b,float t){if(u_oklab>0.5){vec3 la=linToOklab(srgbToLinear(a));vec3 lb=linToOklab(srgbToLinear(b));return clamp(linearToSrgb(oklabToLin(mix(la,lb,t))),0.0,1.0);}return mix(a,b,t);}
vec3 hueRotate(vec3 col,float a){const mat3 toYIQ=mat3(0.299,0.596,0.211,0.587,-0.274,-0.523,0.114,-0.322,0.312);const mat3 toRGB=mat3(1.0,1.0,1.0,0.956,-0.272,-1.106,0.621,-0.647,1.703);vec3 yiq=toYIQ*col;float ca=cos(a),sa=sin(a);yiq=vec3(yiq.x,yiq.y*ca-yiq.z*sa,yiq.y*sa+yiq.z*ca);return toRGB*yiq;}
vec3 shade(vec2 uv,vec2 p,float t){vec3 acc=u_colors[0]*0.15;float total=0.15;for(int i=0;i<8;i++){if(float(i)>=u_colorCount)break;float fi=float(i);vec2 c=vec2(sin(t*(0.21+fi*0.071)+fi*2.4+u_seed),cos(t*(0.17+fi*0.093)+fi*1.7))*(0.45+u_intensity*0.35);float w=exp(-dot(p-c,p-c)*6.0);acc+=u_colors[i]*w;total+=w;}return acc/total;}
void main(){vec2 uv=gl_FragCoord.xy/u_resolution.xy;vec2 screenUv=uv;vec2 p=(gl_FragCoord.xy-0.5*u_resolution.xy)/min(u_resolution.x,u_resolution.y);float cursorMask=0.0;if(u_cursorPresence>0.001){vec2 cursor=(0.5*u_mouse*u_resolution.xy)/min(u_resolution.x,u_resolution.y);vec2 cursorDelta=p-cursor;float cursorDistance=length(cursorDelta);vec2 cursorDirection=cursorDelta/max(cursorDistance,0.0001);cursorMask=u_cursorPresence*(1.0-smoothstep(0.0,u_cursorRadius,cursorDistance));if(u_cursorEffect<0.5){p+=cursor*u_cursorPresence*u_cursorStrength*0.55;}else if(u_cursorEffect<1.5){p-=cursorDirection*cursorMask*u_cursorStrength*0.24;}else if(u_cursorEffect<2.5){float cursorAngle=cursorMask*u_cursorStrength*2.2;float cc=cos(cursorAngle),cs=sin(cursorAngle);p=cursor+mat2(cc,-cs,cs,cc)*cursorDelta;}else if(u_cursorEffect<3.5){float ripple=sin(cursorDistance/max(u_cursorRadius,0.001)*18.0-u_time*5.0);p-=cursorDirection*ripple*cursorMask*u_cursorStrength*0.07;}}
uv=p*min(u_resolution.x,u_resolution.y)/u_resolution.xy+0.5;p*=u_scale;if(abs(u_rotate)>0.0001){float cr=cos(u_rotate),sr=sin(u_rotate);p=mat2(cr,-sr,sr,cr)*p;}p+=u_offset;if(u_drift>0.0001)p+=u_drift*vec2(sin(u_time*0.31),cos(u_time*0.23));if(u_warp>0.0)p+=u_warp*(vec2(fbm(p*u_detail+u_seed),fbm(p*u_detail+vec2(5.2,1.3)))-0.5);vec3 col;if(u_blur>0.0){float e=u_blur,pe=e*u_scale;vec2 uvE=vec2(e)*min(u_resolution.x,u_resolution.y)/u_resolution.xy;col=shade(uv,p,u_time)*0.36;col+=shade(uv+vec2(uvE.x,0.0),p+vec2(pe,0.0),u_time)*0.16;col+=shade(uv-vec2(uvE.x,0.0),p-vec2(pe,0.0),u_time)*0.16;col+=shade(uv+vec2(0.0,uvE.y),p+vec2(0.0,pe),u_time)*0.16;col+=shade(uv-vec2(0.0,uvE.y),p-vec2(0.0,pe),u_time)*0.16;}else{col=shade(uv,p,u_time);}if(abs(u_contrast-1.0)>0.0001)col=(col-0.5)*u_contrast+0.5;if(abs(u_saturation-1.0)>0.0001){float luma=dot(col,vec3(0.299,0.587,0.114));col=mix(vec3(luma),col,u_saturation);}if(abs(u_hue)>0.0001)col=hueRotate(col,u_hue);if(abs(u_brightness)>0.0001)col+=u_brightness;if(u_vignette>0.0001){float vd=length(screenUv-0.5)*1.41421356;col*=1.0-u_vignette*smoothstep(0.35,1.0,vd);}if(u_cursorPresence>0.001&&u_cursorEffect>3.5)col+=(vec3(0.18)+col*0.12)*cursorMask*u_cursorStrength;if(u_grain>0.0001)col+=(grainHash(gl_FragCoord.xy+vec2(u_seed*17.0,u_seed*31.0))-0.5)*u_grain;gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);}`;

  var U = {
    colors: [
      [0.0078431373, 0.0039215686, 0.0392156863],
      [0.0156862745, 0.0196078431, 0.1803921569],
      [0.2392156863, 0.1725490196, 0.5529411765],
      [0.5686274510, 0.4196078431, 0.7490196078],
      [0.5686274510, 0.4196078431, 0.7490196078],
      [0.5686274510, 0.4196078431, 0.7490196078],
      [0.5686274510, 0.4196078431, 0.7490196078],
      [0.5686274510, 0.4196078431, 0.7490196078]
    ],
    colorCount: 4,
    scale: 1.46,
    intensity: 0.66,
    paramA: 0.21,
    warp: 0.276,
    detail: 2.176,
    contrast: 0.978,
    brightness: 0,
    saturation: 0.98,
    hue: 6.2657,
    vignette: 0.29,
    blur: 0.0092,
    grain: 0.084,
    seed: 287,
    rotate: 4.0841,
    offsetX: 0.24,
    offsetY: 0.10,
    drift: reducedMotion ? 0 : 0.028,
    cursorEnabled: !reducedMotion,
    cursorEffect: 2,
    cursorStrength: 0.52,
    cursorRadius: 0.637,
    oklab: 1,
    timeScale: reducedMotion ? 0 : -0.86
  };

  function compile(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('Mesh Drift shader compile failed:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  var vertexShader = compile(gl.VERTEX_SHADER, VERT);
  var fragmentShader = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vertexShader || !fragmentShader) return;

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('Mesh Drift shader link failed:', gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var position = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  var uni = {
    colors: gl.getUniformLocation(program, 'u_colors'),
    scene: gl.getUniformLocation(program, 'u_scene'),
    shape: gl.getUniformLocation(program, 'u_shape'),
    surface: gl.getUniformLocation(program, 'u_surface'),
    finish: gl.getUniformLocation(program, 'u_finish'),
    transform: gl.getUniformLocation(program, 'u_transform'),
    space: gl.getUniformLocation(program, 'u_space'),
    cursor: gl.getUniformLocation(program, 'u_cursor')
  };

  gl.uniform3fv(uni.colors, new Float32Array([].concat.apply([], U.colors)));
  gl.uniform4f(uni.shape, U.scale, U.intensity, U.paramA, U.warp);
  gl.uniform4f(uni.surface, U.detail, U.contrast, U.brightness, U.saturation);
  gl.uniform4f(uni.finish, U.hue, U.vignette, U.blur, U.grain);
  gl.uniform4f(uni.transform, U.seed, U.rotate, U.drift, U.oklab);

  var targetX = 0;
  var targetY = 0;
  var mouseX = 0;
  var mouseY = 0;
  var targetPresence = 0;
  var cursorPresence = 0;
  var last = performance.now();
  var start = last;
  var raf = 0;
  var visible = document.visibilityState === 'visible';

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rawWidth = Math.max(1, Math.round(window.innerWidth * dpr));
    var rawHeight = Math.max(1, Math.round(window.innerHeight * dpr));
    var pixelScale = Math.min(1, Math.sqrt(2000000 / Math.max(1, rawWidth * rawHeight)));
    var width = Math.max(1, Math.round(rawWidth * pixelScale));
    var height = Math.max(1, Math.round(rawHeight * pixelScale));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function onPointerMove(event) {
    targetX = (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
    targetY = -((event.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
    targetPresence = 1;
  }

  function onPointerLeave() { targetPresence = 0; }

  function render(now) {
    raf = 0;
    if (!visible) return;
    resize();
    var dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    var follow = 1 - Math.exp(-12 * dt);
    mouseX += (targetX - mouseX) * follow;
    mouseY += (targetY - mouseY) * follow;
    cursorPresence += (targetPresence - cursorPresence) * follow;

    gl.uniform4f(uni.scene, canvas.width, canvas.height, ((now - start) / 1000) * U.timeScale, U.colorCount);
    gl.uniform4f(uni.space, U.offsetX, U.offsetY, mouseX, mouseY);
    gl.uniform4f(uni.cursor, U.cursorEnabled ? cursorPresence : 0, U.cursorEffect, U.cursorStrength, U.cursorRadius);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (!reducedMotion || Math.abs(targetPresence - cursorPresence) > 0.001) raf = requestAnimationFrame(render);
  }

  function requestRender() {
    if (!raf && visible) raf = requestAnimationFrame(render);
  }

  window.addEventListener('resize', requestRender, { passive: true });
  if (U.cursorEnabled) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointercancel', onPointerLeave);
    window.addEventListener('blur', onPointerLeave);
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
  }
  document.addEventListener('visibilitychange', function () {
    visible = document.visibilityState === 'visible';
    if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
    if (visible) { last = performance.now(); requestRender(); }
  });

  resize();
  requestRender();
})();
