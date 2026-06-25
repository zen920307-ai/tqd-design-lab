import React, { useRef } from "react";
import gsap from "gsap";
import "./TiltedWorkCard.css";

export default function TiltedWorkCard({ item, onOpen }) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const captionRef = useRef(null);
  const lastYRef = useRef(0);

  const handleMouseMove = (event) => {
    if (!cardRef.current || !innerRef.current || !captionRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    const rotateX = (offsetY / (rect.height / 2)) * -16;
    const rotateY = (offsetX / (rect.width / 2)) * 18;
    const velocityY = offsetY - lastYRef.current;
    lastYRef.current = offsetY;

    gsap.to(innerRef.current, {
      rotationX: rotateX,
      rotationY: rotateY,
      scale: 1.12,
      z: 42,
      duration: 0.34,
      ease: "expo.out",
      overwrite: "auto",
    });
    gsap.to(captionRef.current, {
      x: event.clientX - rect.left + 12,
      y: event.clientY - rect.top + 12,
      rotation: -velocityY * 0.8,
      autoAlpha: 1,
      duration: 0.24,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (!innerRef.current || !captionRef.current) return;
    gsap.to(innerRef.current, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      z: 0,
      duration: 0.55,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(captionRef.current, {
      autoAlpha: 0,
      rotation: 0,
      duration: 0.22,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  return (
    <button
      ref={cardRef}
      className="tilted-work-card"
      onClick={() => onOpen(item)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      type="button"
    >
      <span ref={innerRef} className="tilted-work-inner">
        <img src={item.src} alt={item.name} />
        <span className="tilted-work-overlay">{item.name}</span>
      </span>
      <span ref={captionRef} className="tilted-work-caption">{item.name}</span>
    </button>
  );
}
