import{r as u,j as F}from"./index-Bo6coPjO.js";import{R as k,T as A,P as W,M as _}from"./Triangle-GlFcswsc.js";const N=`
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,j=`
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform bool enableRainbow;
uniform vec3 gridColor;
uniform float rippleIntensity;
uniform float gridSize;
uniform float gridThickness;
uniform float fadeDistance;
uniform float vignetteStrength;
uniform float glowIntensity;
uniform float opacity;
uniform float gridRotation;
uniform bool mouseInteraction;
uniform vec2 mousePosition;
uniform float mouseInfluence;
uniform float mouseInteractionRadius;
varying vec2 vUv;

float pi = 3.141592;

mat2 rotate(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= iResolution.x / iResolution.y;

  if (gridRotation != 0.0) {
    uv = rotate(gridRotation * pi / 180.0) * uv;
  }

  float dist = length(uv);
  float func = sin(pi * (iTime - dist));
  vec2 rippleUv = uv + uv * func * rippleIntensity;

  if (mouseInteraction && mouseInfluence > 0.0) {
    vec2 mouseUv = (mousePosition * 2.0 - 1.0);
    mouseUv.x *= iResolution.x / iResolution.y;
    float mouseDist = length(uv - mouseUv);
    float influence = mouseInfluence * exp(-mouseDist * mouseDist / (mouseInteractionRadius * mouseInteractionRadius));
    float mouseWave = sin(pi * (iTime * 2.0 - mouseDist * 3.0)) * influence;
    rippleUv += normalize(uv - mouseUv) * mouseWave * rippleIntensity * 0.3;
  }

  vec2 a = sin(gridSize * 0.5 * pi * rippleUv - pi / 2.0);
  vec2 b = abs(a);
  float aaWidth = 0.5;
  vec2 smoothB = vec2(smoothstep(0.0, aaWidth, b.x), smoothstep(0.0, aaWidth, b.y));

  vec3 color = vec3(0.0);
  color += exp(-gridThickness * smoothB.x * (0.8 + 0.5 * sin(pi * iTime)));
  color += exp(-gridThickness * smoothB.y);
  color += 0.5 * exp(-(gridThickness / 4.0) * sin(smoothB.x));
  color += 0.5 * exp(-(gridThickness / 3.0) * smoothB.y);

  if (glowIntensity > 0.0) {
    color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.x);
    color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.y);
  }

  float ddd = exp(-2.0 * clamp(pow(dist, fadeDistance), 0.0, 1.0));
  vec2 vignetteCoords = vUv - 0.5;
  float vignetteDistance = length(vignetteCoords);
  float vignette = 1.0 - pow(vignetteDistance * 2.0, vignetteStrength);
  vignette = clamp(vignette, 0.0, 1.0);

  vec3 tint = enableRainbow
    ? vec3(uv.x * 0.5 + 0.5 * sin(iTime), uv.y * 0.5 + 0.5 * cos(iTime), pow(cos(iTime), 4.0)) + 0.5
    : gridColor;

  float finalFade = ddd * vignette;
  float alpha = length(color) * finalFade * opacity;
  gl_FragColor = vec4(color * tint * finalFade, alpha);
}
`,S=c=>{const o=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);return o?[parseInt(o[1],16)/255,parseInt(o[2],16)/255,parseInt(o[3],16)/255]:[1,1,1]};function G({enableRainbow:c=!1,gridColor:o="#9ed8f5",rippleIntensity:m=.05,gridSize:d=10,gridThickness:p=15,fadeDistance:g=1.5,vignetteStrength:h=2,glowIntensity:x=.1,opacity:R=1,gridRotation:y=0,mouseInteraction:v=!0,mouseInteractionRadius:I=1}){const U=u.useRef(null),l=u.useRef({x:.5,y:.5}),w=u.useRef({x:.5,y:.5}),T=u.useRef(0),e=u.useRef(null);return u.useEffect(()=>{const t=U.current;if(!t)return;let i=null,E=0,f=!0;try{i=new k({dpr:Math.min(window.devicePixelRatio||1,1.6),alpha:!0});const n=i.gl;n.enable(n.BLEND),n.blendFunc(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA),n.canvas.style.width="100%",n.canvas.style.height="100%",t.appendChild(n.canvas);const r={iTime:{value:0},iResolution:{value:[1,1]},enableRainbow:{value:c},gridColor:{value:S(o)},rippleIntensity:{value:m},gridSize:{value:d},gridThickness:{value:p},fadeDistance:{value:g},vignetteStrength:{value:h},glowIntensity:{value:x},opacity:{value:R},gridRotation:{value:y},mouseInteraction:{value:v},mousePosition:{value:[.5,.5]},mouseInfluence:{value:0},mouseInteractionRadius:{value:I}};e.current=r;const B=new A(n),D=new W(n,{vertex:N,fragment:j,uniforms:r}),z=new _(n,{geometry:B,program:D}),b=()=>{if(!f)return;const a=Math.max(1,t.clientWidth),s=Math.max(1,t.clientHeight);i.setSize(a,s),r.iResolution.value=[a,s]},L=a=>{if(!v)return;const s=t.getBoundingClientRect();w.current={x:(a.clientX-s.left)/s.width,y:1-(a.clientY-s.top)/s.height}},M=()=>{T.current=1},P=()=>{T.current=0},C=a=>{f&&(r.iTime.value=a*.001,l.current.x+=(w.current.x-l.current.x)*.1,l.current.y+=(w.current.y-l.current.y)*.1,r.mouseInfluence.value+=(T.current-r.mouseInfluence.value)*.05,r.mousePosition.value=[l.current.x,l.current.y],i.render({scene:z}),E=requestAnimationFrame(C))};return window.addEventListener("resize",b),t.addEventListener("pointermove",L,{passive:!0}),t.addEventListener("pointerenter",M),t.addEventListener("pointerleave",P),b(),E=requestAnimationFrame(C),()=>{f=!1,cancelAnimationFrame(E),window.removeEventListener("resize",b),t.removeEventListener("pointermove",L),t.removeEventListener("pointerenter",M),t.removeEventListener("pointerleave",P),i&&t.contains(i.gl.canvas)&&t.removeChild(i.gl.canvas)}}catch(n){f=!1,console.error("RippleGrid initialization failed",n);return}},[]),u.useEffect(()=>{e.current&&(e.current.enableRainbow.value=c,e.current.gridColor.value=S(o),e.current.rippleIntensity.value=m,e.current.gridSize.value=d,e.current.gridThickness.value=p,e.current.fadeDistance.value=g,e.current.vignetteStrength.value=h,e.current.glowIntensity.value=x,e.current.opacity.value=R,e.current.gridRotation.value=y,e.current.mouseInteraction.value=v,e.current.mouseInteractionRadius.value=I)},[c,o,m,d,p,g,h,x,R,y,v,I]),F.jsx("div",{className:"ripple-grid-container",ref:U})}export{G as default};
