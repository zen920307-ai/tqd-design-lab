import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import BorderGlow from "./BorderGlow";
import profileBase from "./assets/profile-reveal-base.webp";
import profileReveal from "./assets/profile-reveal-cyber.webp";
import wechatQr from "./assets/wechat-qr.png";
import "./ProfileLanyard.css";

const getRopePath = (side, x = 0, y = 0) => {
  const startX = side === "left" ? 78 : 252;
  const endX = 165 + x;
  const endY = 272 + y;
  const midX = (side === "left" ? 121 : 209) + x * 0.36;
  const midY = 130 + Math.max(y, 0) * 0.2 + Math.abs(x) * 0.05;
  return `M${startX} 0 C${startX} 64 ${midX} ${midY} ${endX} ${endY}`;
};

const resetRope = (paths, x = 0, y = 0) => {
  paths.forEach(({ node, side }) => node?.setAttribute("d", getRopePath(side, x, y)));
};

export default function ProfileLanyard() {
  const [open, setOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const rootRef = useRef(null);
  const dropRef = useRef(null);
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const ropeLeftShadowRef = useRef(null);
  const ropeLeftFaceRef = useRef(null);
  const ropeRightShadowRef = useRef(null);
  const ropeRightFaceRef = useRef(null);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    liveX: 0,
    liveY: 0,
  });

  const ropePaths = () => [
    { node: ropeLeftShadowRef.current, side: "left" },
    { node: ropeLeftFaceRef.current, side: "left" },
    { node: ropeRightShadowRef.current, side: "right" },
    { node: ropeRightFaceRef.current, side: "right" },
  ];

  useEffect(() => {
    if (!dropRef.current) return;
    if (open) {
      setFlipped(false);
      gsap.set(innerRef.current, { rotateY: 0 });
      resetRope(ropePaths());
      gsap.killTweensOf([dropRef.current, cardRef.current]);
      gsap.set(dropRef.current, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        transformOrigin: "50% 0%",
      });
      gsap.timeline({
        defaults: { overwrite: "auto" },
        onUpdate: () => {
          const x = Number(gsap.getProperty(cardRef.current, "x")) || 0;
          const y = Number(gsap.getProperty(cardRef.current, "y")) || 0;
          resetRope(ropePaths(), x, y);
        },
        onComplete: () => resetRope(ropePaths()),
      })
        .fromTo(dropRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18, ease: "power1.out" }, 0)
        .fromTo(cardRef.current, {
          x: 0,
          y: -138,
          scale: 0.96,
          rotation: -2.2,
        }, {
          y: 24,
          scale: 1.015,
          rotation: 1.2,
          duration: 0.48,
          ease: "power3.in",
        }, 0.02)
        .to(cardRef.current, {
          y: -18,
          rotation: -0.8,
          duration: 0.26,
          ease: "power2.out",
        })
        .to(cardRef.current, {
          y: 9,
          rotation: 0.35,
          duration: 0.22,
          ease: "power2.in",
        })
        .to(cardRef.current, {
          y: -5,
          rotation: -0.15,
          duration: 0.18,
          ease: "power2.out",
        })
        .to(cardRef.current, {
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.24,
          ease: "sine.out",
        });
    } else {
      setFlipped(false);
      dragRef.current.active = false;
      dragRef.current.x = 0;
      dragRef.current.y = 0;
      dragRef.current.liveX = 0;
      dragRef.current.liveY = 0;
      gsap.to(dropRef.current, {
        autoAlpha: 0,
        y: -24,
        scale: 0.96,
        duration: 0.22,
        ease: "power2.in",
      });
      gsap.set(cardRef.current, { x: 0, y: 0, rotation: 0 });
      gsap.set(innerRef.current, { rotateY: 0 });
      resetRope(ropePaths());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleOutsidePointer = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    window.addEventListener("pointerdown", handleOutsidePointer, { capture: true });
    return () => window.removeEventListener("pointerdown", handleOutsidePointer, { capture: true });
  }, [open]);

  const flipToContact = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!innerRef.current) return;
    setFlipped(true);
    gsap.to(innerRef.current, {
      rotateY: 180,
      duration: 0.58,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  };

  const flipToFront = (event) => {
    if (!flipped || event.target?.closest?.("a")) return;
    event.stopPropagation();
    setFlipped(false);
    gsap.to(innerRef.current, {
      rotateY: 0,
      duration: 0.52,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  };

  const handleDragStart = (event) => {
    if (!cardRef.current) return;
    if (event.target?.closest?.(".lanyard-contact")) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      x: dragRef.current.x,
      y: dragRef.current.y,
      liveX: dragRef.current.x,
      liveY: dragRef.current.y,
    };
    gsap.to(cardRef.current, { scale: 1.04, duration: 0.18, ease: "power2.out" });
  };

  const handleDragMove = (event) => {
    if (!dragRef.current.active || !cardRef.current) return;
    const nextX = dragRef.current.x + event.clientX - dragRef.current.startX;
    const nextY = dragRef.current.y + event.clientY - dragRef.current.startY;
    dragRef.current.liveX = nextX;
    dragRef.current.liveY = nextY;
    resetRope(ropePaths(), nextX, nextY);
    gsap.set(cardRef.current, {
      x: nextX,
      y: nextY,
      rotation: 0,
    });
  };

  const updateReveal = (event) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--reveal-x", `${event.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--reveal-y", `${event.clientY - rect.top}px`);
    cardRef.current.style.setProperty("--reveal-opacity", "1");
  };

  const hideReveal = () => {
    cardRef.current?.style.setProperty("--reveal-opacity", "0");
  };

  const handleDragEnd = (event) => {
    if (!dragRef.current.active || !cardRef.current) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    dragRef.current.active = false;
    const releaseY = Number(dragRef.current.liveY ?? gsap.getProperty(cardRef.current, "y")) || 0;
    dragRef.current.x = 0;
    dragRef.current.y = 0;
    dragRef.current.liveX = 0;
    dragRef.current.liveY = 0;
    if (releaseY > 96) {
      gsap.timeline({
        onUpdate: () => {
          const x = Number(gsap.getProperty(cardRef.current, "x")) || 0;
          const y = Number(gsap.getProperty(cardRef.current, "y")) || 0;
          resetRope(ropePaths(), x, y);
        },
        onComplete: () => {
          resetRope(ropePaths());
          gsap.set(cardRef.current, { clearProps: "x,y,rotation,scale,autoAlpha" });
          gsap.set(dropRef.current, { clearProps: "y,scale,autoAlpha" });
          setOpen(false);
        },
      })
        .to(cardRef.current, {
          x: 0,
          y: -340,
          rotation: 0,
          scale: 0.92,
          duration: 0.42,
          ease: "back.in(1.75)",
          overwrite: "auto",
        })
        .to(dropRef.current, {
          autoAlpha: 0,
          y: -28,
          scale: 0.94,
          duration: 0.18,
          ease: "power2.out",
        }, "-=0.14");
      return;
    }
    gsap.to(cardRef.current, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.9,
      ease: "elastic.out(1, 0.46)",
      overwrite: "auto",
      onUpdate: () => {
        const x = Number(gsap.getProperty(cardRef.current, "x")) || 0;
        const y = Number(gsap.getProperty(cardRef.current, "y")) || 0;
        resetRope(ropePaths(), x, y);
      },
      onComplete: () => resetRope(ropePaths()),
    });
  };

  return (
    <div className={`profile-lanyard ${open ? "open" : ""}`} ref={rootRef}>
      <BorderGlow
        className="profile-trigger-shell"
        edgeSensitivity={18}
        glowColor="204 34 76"
        backgroundColor="rgba(13, 14, 16, 0.72)"
        borderRadius={999}
        glowRadius={22}
        glowIntensity={0.78}
        coneSpread={18}
        fillOpacity={0.12}
        colors={["#eef3f5", "#8fa3b2", "#4f6274"]}
      >
        <button className="profile-trigger" onClick={() => setOpen((value) => !value)} type="button">
          <span>CONTACT</span>
          <em>{"\u8054\u7cfb\u65b9\u5f0f"}</em>
        </button>
      </BorderGlow>
      <div className="profile-drop" ref={dropRef}>
        <svg className="lanyard-rope lanyard-rope-back" viewBox="0 0 330 304" aria-hidden="true">
          <path className="lanyard-rope-shadow" d={getRopePath("right")} ref={ropeRightShadowRef} />
          <path className="lanyard-rope-face" d={getRopePath("right")} ref={ropeRightFaceRef} />
        </svg>
        <div
          className={`lanyard-card ${flipped ? "flipped" : ""}`}
          ref={cardRef}
          onClick={flipToFront}
          onPointerCancel={handleDragEnd}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onMouseMove={updateReveal}
          onMouseLeave={hideReveal}
          onPointerUp={handleDragEnd}
        >
          <span className="lanyard-hole" />
          <div className="lanyard-card-inner" ref={innerRef}>
            <div className="lanyard-face lanyard-front">
              <div className="lanyard-image-reveal">
                <img className="profile-base" src={profileBase} alt="Tang Qidong profile" />
                <img className="profile-reveal" src={profileReveal} alt="" />
                <span className="profile-spotlight" />
              </div>
              <div className="lanyard-info">
                <strong>TANG QIDONG</strong>
                <div className="lanyard-info-row">
                  <span>
                    <i>{"\u5341\u5e74 UI/UX \u7ecf\u9a8c\u3002"}</i>
                    <i>{"\u8bbe\u8ba1\u7cfb\u7edf\u8d1f\u8d23\u4eba\u3002"}</i>
                  </span>
                  <button
                    className="lanyard-contact"
                    onClick={flipToContact}
                    onPointerDown={(event) => event.stopPropagation()}
                    type="button"
                  >
                    {"\u8054\u7cfb\u6211"}
                  </button>
                </div>
              </div>
            </div>
            <div className="lanyard-face lanyard-back">
              <img src={wechatQr} alt="WeChat QR code" />
              <div className="lanyard-contact-lines">
                <a href="mailto:zen92@foxmail.com"><b>EMAIL</b> zen92@foxmail.com</a>
                <a href="tel:+8618674883943"><b>PHONE</b> +86 18674883943</a>
              </div>
              <strong>SCAN TO CONTACT</strong>
              <span>{"\u5fae\u4fe1\u8054\u7cfb / \u9879\u76ee\u5408\u4f5c"}</span>
            </div>
          </div>
        </div>
        <svg className="lanyard-rope lanyard-rope-front" viewBox="0 0 330 304" aria-hidden="true">
          <path className="lanyard-rope-shadow" d={getRopePath("left")} ref={ropeLeftShadowRef} />
          <path className="lanyard-rope-face" d={getRopePath("left")} ref={ropeLeftFaceRef} />
        </svg>
      </div>
    </div>
  );
}
