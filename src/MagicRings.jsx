import React, { useEffect, useRef } from "react";
import "./MagicRings.css";

const hexToRgb = (hex) => {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;
  const number = Number.parseInt(value, 16);
  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255,
  };
};

const mixColor = (a, b, t) => ({
  r: Math.round(a.r + (b.r - a.r) * t),
  g: Math.round(a.g + (b.g - a.g) * t),
  b: Math.round(a.b + (b.b - a.b) * t),
});

export default function MagicRings({
  color = "#7cadf7",
  colorTwo = "#cbccff",
  ringCount = 6,
  speed = 1,
  lineThickness = 2,
  baseRadius = 0.32,
  radiusStep = 0.1,
  scaleRate = 0.1,
  opacity = 1,
  blur = 0,
  rotation = 0,
  followMouse = false,
  mouseInfluence = 0.2,
  hoverScale = 1.2,
  parallax = 0.05,
  clickBurst = false,
  stretchX = 1,
  arcCoverage = 0.36,
  maxDpr = 1.35,
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, hover: 0, burst: 0 });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const colorA = hexToRgb(color);
    const colorB = hexToRgb(colorTwo);
    let frame = 0;
    let running = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawRing = (cx, cy, radius, progress, ringColor, index) => {
      const burst = mouseRef.current.burst;
      const alpha = (0.62 - index * 0.055) * opacity * (0.72 + Math.sin(progress * Math.PI) * 0.28);
      const gap = 0.75 + index * 0.1;
      const start = rotation * (Math.PI / 180) + progress * Math.PI * 2 + index * 0.5;
      const scale = 1 + mouseRef.current.hover * (hoverScale - 1) + burst * 0.22;
      const r = radius * scale;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start * 0.12);
      ctx.scale(stretchX, 1);
      ctx.lineWidth = lineThickness;
      ctx.lineCap = "round";
      ctx.shadowBlur = 16 + burst * 26;
      ctx.shadowColor = `rgba(${ringColor.r}, ${ringColor.g}, ${ringColor.b}, ${0.42 * opacity})`;
      ctx.strokeStyle = `rgba(${ringColor.r}, ${ringColor.g}, ${ringColor.b}, ${alpha})`;

      for (let part = 0; part < 4; part += 1) {
        const arcStart = start + part * Math.PI * 0.5;
        const arcEnd = arcStart + Math.PI * (arcCoverage + gap * 0.045);
        ctx.beginPath();
        ctx.arc(0, 0, r, arcStart, arcEnd);
        ctx.stroke();
      }
      ctx.restore();
    };

    const animate = (time) => {
      if (!running) return;
      frame = requestAnimationFrame(animate);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      mouse.hover += ((mouse.isOver ? 1 : 0) - mouse.hover) * 0.08;
      mouse.burst *= 0.92;

      const minSide = Math.min(width, height);
      const cx = width / 2 + (followMouse ? mouse.x * width * mouseInfluence : 0);
      const cy = height / 2 + (followMouse ? mouse.y * height * mouseInfluence : 0);
      const cycle = (time * 0.00016 * speed) % 1;

      for (let i = 0; i < ringCount; i += 1) {
        const t = ringCount <= 1 ? 0 : i / (ringCount - 1);
        const ringColor = mixColor(colorA, colorB, t);
        const progress = (cycle + i * 0.13) % 1;
        const parallaxX = mouse.x * minSide * parallax * i;
        const parallaxY = mouse.y * minSide * parallax * i;
        const radius = minSide * (baseRadius + i * radiusStep + progress * scaleRate);
        drawRing(cx + parallaxX, cy + parallaxY, radius, progress, ringColor, i);
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(animate);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.tx = (event.clientX - rect.left) / rect.width - 0.5;
      mouseRef.current.ty = (event.clientY - rect.top) / rect.height - 0.5;
    };
    const handlePointerEnter = () => {
      mouseRef.current.isOver = true;
    };
    const handlePointerLeave = () => {
      mouseRef.current.isOver = false;
      mouseRef.current.tx = 0;
      mouseRef.current.ty = 0;
    };
    const handleClick = () => {
      if (clickBurst) mouseRef.current.burst = 1;
    };

    resize();
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    }, { rootMargin: "120px" });
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerenter", handlePointerEnter);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("click", handleClick);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerenter", handlePointerEnter);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("click", handleClick);
    };
  }, [arcCoverage, baseRadius, clickBurst, color, colorTwo, followMouse, hoverScale, lineThickness, maxDpr, mouseInfluence, opacity, parallax, radiusStep, ringCount, rotation, scaleRate, speed, stretchX]);

  return (
    <canvas
      className="magic-rings-container"
      ref={canvasRef}
      style={blur > 0 ? { filter: `blur(${blur}px)` } : undefined}
    />
  );
}
