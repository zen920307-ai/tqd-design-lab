import{r as a,j as $}from"./index-Bo6coPjO.js";import{R as X,T as Y,P as k,M as J}from"./Triangle-GlFcswsc.js";const K="#ffffff",M=f=>{const t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(f);return t?[parseInt(t[1],16)/255,parseInt(t[2],16)/255,parseInt(t[3],16)/255]:[1,1,1]},N=(f,t,s)=>{switch(f){case"top-left":return{anchor:[0,-.2*s],dir:[0,1]};case"top-right":return{anchor:[t,-.2*s],dir:[0,1]};case"left":return{anchor:[-.2*t,.5*s],dir:[1,0]};case"right":return{anchor:[(1+.2)*t,.5*s],dir:[-1,0]};case"bottom-left":return{anchor:[0,(1+.2)*s],dir:[0,-1]};case"bottom-center":return{anchor:[.5*t,(1+.2)*s],dir:[0,-1]};case"bottom-right":return{anchor:[t,(1+.2)*s],dir:[0,-1]};default:return{anchor:[.5*t,-.2*s],dir:[0,1]}}},Z=({raysOrigin:f="top-center",raysColor:t=K,raysSpeed:s=1,lightSpread:y=1,rayLength:C=2,pulsating:b=!1,fadeDistance:S=1,saturation:w=1,followMouse:D=!0,mouseInfluence:p=.1,noiseAmount:P=0,distortion:A=0,className:U=""})=>{const o=a.useRef(null),R=a.useRef(null),g=a.useRef(null),L=a.useRef({x:.5,y:.5}),h=a.useRef({x:.5,y:.5}),x=a.useRef(null),E=a.useRef(null),r=a.useRef(null),T=a.useRef(null),[F,_]=a.useState(!1);return a.useEffect(()=>{if(o.current)return T.current=new IntersectionObserver(e=>{var d;return _(!!((d=e[0])!=null&&d.isIntersecting))},{threshold:.1}),T.current.observe(o.current),()=>{var e;(e=T.current)==null||e.disconnect(),T.current=null}},[]),a.useEffect(()=>{var l;if(!F||!o.current)return;let e=!0;return(l=r.current)==null||l.call(r),r.current=null,(async()=>{if(!o.current||(await new Promise(u=>setTimeout(u,10)),!e||!o.current))return;const n=new X({dpr:Math.min(window.devicePixelRatio||1,2),alpha:!0});g.current=n;const c=n.gl;for(c.canvas.style.width="100%",c.canvas.style.height="100%";o.current.firstChild;)o.current.removeChild(o.current.firstChild);o.current.appendChild(c.canvas);const z=`
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`,I=`precision highp float;

uniform float iTime;
uniform vec2  iResolution;
uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;
varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);
  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;
  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );
  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }
  vec4 rays1 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed);
  fragColor = rays1 * 0.5 + rays2 * 0.4;
  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }
  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;
  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }
  fragColor.rgb *= raysColor;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}`,m={iTime:{value:0},iResolution:{value:[1,1]},rayPos:{value:[0,0]},rayDir:{value:[0,1]},raysColor:{value:M(t)},raysSpeed:{value:s},lightSpread:{value:y},rayLength:{value:C},pulsating:{value:b?1:0},fadeDistance:{value:S},saturation:{value:w},mousePos:{value:[.5,.5]},mouseInfluence:{value:p},noiseAmount:{value:P},distortion:{value:A}};R.current=m;const j=new Y(c),q=new k(c,{vertex:z,fragment:I,uniforms:m}),G=new J(c,{geometry:j,program:q});E.current=G;const W=()=>{if(!e||!o.current||!n)return;n.dpr=Math.min(window.devicePixelRatio||1,2);const{clientWidth:u,clientHeight:i}=o.current;if(!u||!i)return;n.setSize(u,i);const v=n.dpr;m.iResolution.value=[u*v,i*v];const{anchor:H,dir:V}=N(f,u*v,i*v);m.rayPos.value=H,m.rayDir.value=V},B=u=>{var i;if(!(!e||!g.current||!R.current||!E.current)){m.iTime.value=u*.001,D&&p>0&&(h.current.x=h.current.x*.92+L.current.x*(1-.92),h.current.y=h.current.y*.92+L.current.y*(1-.92),m.mousePos.value=[h.current.x,h.current.y]);try{n.render({scene:G}),x.current=requestAnimationFrame(B)}catch(v){console.warn("WebGL rendering error:",v),(i=r.current)==null||i.call(r),r.current=null}}};window.addEventListener("resize",W),W(),x.current=requestAnimationFrame(B),r.current=()=>{var u;x.current&&cancelAnimationFrame(x.current),x.current=null,window.removeEventListener("resize",W);try{const i=n.gl.canvas;(u=i==null?void 0:i.parentNode)==null||u.removeChild(i)}catch(i){console.warn("Error during WebGL cleanup:",i)}g.current=null,R.current=null,E.current=null}})().catch(n=>{var c;console.warn("LightRays WebGL initialization failed:",n),(c=r.current)==null||c.call(r),r.current=null}),()=>{var n;e=!1,(n=r.current)==null||n.call(r),r.current=null}},[F,f,t,s,y,C,b,S,w,D,p,P,A]),a.useEffect(()=>{if(!R.current||!o.current||!g.current)return;const e=R.current,d=g.current;e.raysColor.value=M(t),e.raysSpeed.value=s,e.lightSpread.value=y,e.rayLength.value=C,e.pulsating.value=b?1:0,e.fadeDistance.value=S,e.saturation.value=w,e.mouseInfluence.value=p,e.noiseAmount.value=P,e.distortion.value=A;const{clientWidth:l,clientHeight:n}=o.current,c=d.dpr,{anchor:z,dir:I}=N(f,l*c,n*c);e.rayPos.value=z,e.rayDir.value=I},[t,s,y,f,C,b,S,w,p,P,A]),a.useEffect(()=>{const e=d=>{if(!o.current||!g.current)return;const l=o.current.getBoundingClientRect();L.current={x:(d.clientX-l.left)/l.width,y:(d.clientY-l.top)/l.height}};if(D)return window.addEventListener("mousemove",e,{passive:!0}),()=>window.removeEventListener("mousemove",e)},[D]),$.jsx("div",{ref:o,className:`light-rays-container ${U}`.trim()})};export{Z as default};
