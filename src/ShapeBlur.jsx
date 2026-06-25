import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./ShapeBlur.css";

const vertexShader = `
varying vec2 v_texcoord;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  v_texcoord = uv;
}
`;

const fragmentShader = `
varying vec2 v_texcoord;

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_shapeSize;
uniform float u_roundness;
uniform float u_borderSize;
uniform float u_circleSize;
uniform float u_circleEdge;

#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif
#ifndef VAR
#define VAR 0
#endif

vec2 coord(in vec2 p) {
  p = p / u_resolution.xy;
  if (u_resolution.x > u_resolution.y) {
    p.x *= u_resolution.x / u_resolution.y;
    p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
  } else {
    p.y *= u_resolution.y / u_resolution.x;
    p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
  }
  p -= 0.5;
  p *= vec2(-1.0, 1.0);
  return p;
}

#define st0 coord(gl_FragCoord.xy)
#define mx coord(u_mouse * u_pixelRatio)

float sdRoundRect(vec2 p, vec2 b, float r) {
  vec2 d = abs(p - 0.5) * 4.2 - b + vec2(r);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}

float sdCircle(in vec2 st, in vec2 center) {
  return length(st - center) * 2.0;
}

float sdPoly(in vec2 p, in float w, in int sides) {
  float a = atan(p.x, p.y) + PI;
  float r = TWO_PI / float(sides);
  float d = cos(floor(0.5 + a / r) * r - a) * length(max(abs(p) * 1.0, 0.0));
  return d * 2.0 - w;
}

float aastep(float threshold, float value) {
  float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
  return smoothstep(threshold - afwidth, threshold + afwidth, value);
}

float fill(in float x) {
  return 1.0 - aastep(0.0, x);
}

float fill(float x, float size, float edge) {
  return 1.0 - smoothstep(size - edge, size + edge, x);
}

float strokeAA(float x, float size, float w, float edge) {
  float afwidth = length(vec2(dFdx(x), dFdy(x))) * 0.70710678;
  float d = smoothstep(size - edge - afwidth, size + edge + afwidth, x + w * 0.5)
    - smoothstep(size - edge - afwidth, size + edge + afwidth, x - w * 0.5);
  return clamp(d, 0.0, 1.0);
}

void main() {
  vec2 st = st0 + 0.5;
  vec2 posMouse = mx * vec2(1., -1.) + 0.5;

  float sdfCircle = fill(sdCircle(st, posMouse), u_circleSize, u_circleEdge);
  float sdf;

  if (VAR == 0) {
    sdf = sdRoundRect(st, vec2(u_shapeSize), u_roundness);
    sdf = strokeAA(sdf, 0.0, u_borderSize, sdfCircle) * 4.0;
  } else if (VAR == 1) {
    sdf = sdCircle(st, vec2(0.5));
    sdf = fill(sdf, 0.6, sdfCircle) * 1.2;
  } else if (VAR == 2) {
    sdf = sdCircle(st, vec2(0.5));
    sdf = strokeAA(sdf, u_shapeSize, u_borderSize, sdfCircle) * 4.0;
  } else {
    sdf = sdPoly(st - vec2(0.5, 0.45), 0.3, 3);
    sdf = fill(sdf, 0.05, sdfCircle) * 1.4;
  }

  float edgeDistance = min(min(st.x, 1.0 - st.x), min(st.y, 1.0 - st.y));
  float canvasFade = smoothstep(0.0, 0.14, edgeDistance);
  sdf *= canvasFade;

  gl_FragColor = vec4(vec3(1.0), sdf);
}
`;

export default function ShapeBlur({
  className = "",
  variation = 0,
  pixelRatioProp = 2,
  shapeSize = 1.2,
  roundness = 0.4,
  borderSize = 0.05,
  circleSize = 0.3,
  circleEdge = 0.5,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let active = true;
    let animationFrameId;
    let lastTime = 0;
    let renderer = null;
    let material = null;
    let geometry = null;
    let observer = null;
    let onPointerMove = null;
    let resize = null;
    const vMouse = new THREE.Vector2(Math.max(1, mount.clientWidth) / 2, Math.max(1, mount.clientHeight) / 2);
    const vMouseDamp = vMouse.clone();
    const vResolution = new THREE.Vector2();
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera();
    let quad = null;

    try {
      camera.position.z = 1;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      });
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.dataset.threeEffect = "ShapeBlur";
      mount.appendChild(renderer.domElement);

      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          u_mouse: { value: vMouseDamp },
          u_resolution: { value: vResolution },
          u_pixelRatio: { value: pixelRatioProp },
          u_shapeSize: { value: shapeSize },
          u_roundness: { value: roundness },
          u_borderSize: { value: borderSize },
          u_circleSize: { value: circleSize },
          u_circleEdge: { value: circleEdge },
        },
        defines: { VAR: variation },
        transparent: true,
        extensions: { derivatives: true },
      });

      geometry = new THREE.PlaneGeometry(1, 1);
      quad = new THREE.Mesh(geometry, material);
      scene.add(quad);

      onPointerMove = (event) => {
        if (!active || !mount.isConnected) return;
        const rect = mount.getBoundingClientRect();
        vMouse.set(event.clientX - rect.left, event.clientY - rect.top);
      };

      resize = () => {
        if (!active || !renderer || !material || !quad) return;
        const w = Math.max(1, mount.clientWidth);
        const h = Math.max(1, mount.clientHeight);
        const dpr = Math.min(window.devicePixelRatio || pixelRatioProp, 2);
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
        camera.left = -w / 2;
        camera.right = w / 2;
        camera.top = h / 2;
        camera.bottom = -h / 2;
        camera.updateProjectionMatrix();
        quad.scale.set(w, h, 1);
        vResolution.set(w, h).multiplyScalar(dpr);
        material.uniforms.u_pixelRatio.value = dpr;
      };

      document.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("resize", resize);
      observer = new ResizeObserver(resize);
      observer.observe(mount);
      resize();
    } catch (error) {
      active = false;
      console.error("ShapeBlur Three initialization failed", error);
      return undefined;
    }

    const update = () => {
      if (!active) return;
      try {
        const time = performance.now() * 0.001;
        const dt = lastTime ? time - lastTime : 0.016;
        lastTime = time;
        vMouseDamp.x = THREE.MathUtils.damp(vMouseDamp.x, vMouse.x, 8, dt);
        vMouseDamp.y = THREE.MathUtils.damp(vMouseDamp.y, vMouse.y, 8, dt);
        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(update);
      } catch (error) {
        active = false;
        console.error("ShapeBlur Three render failed", error);
      }
    };
    update();

    return () => {
      active = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (observer) observer.disconnect();
      if (resize) window.removeEventListener("resize", resize);
      if (onPointerMove) document.removeEventListener("pointermove", onPointerMove);
      if (quad) scene.remove(quad);
      if (material) material.dispose();
      if (geometry) geometry.dispose();
      if (renderer) {
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [variation, pixelRatioProp, shapeSize, roundness, borderSize, circleSize, circleEdge]);

  return <div className={`shape-blur ${className}`.trim()} ref={mountRef} />;
}
