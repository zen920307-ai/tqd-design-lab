import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import "./CircularWorkGallery.css";

const seededShuffle = (items, seed) => {
  const shuffled = [...items];
  let value = seed;

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    value = (value * 9301 + 49297) % 233280;
    const target = Math.floor((value / 233280) * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }

  return shuffled;
};

export default function CircularWorkGallery({ items, onOpen }) {
  const viewportRef = useRef(null);
  const seedRef = useRef(Math.floor(Math.random() * 233280));
  const rowItems = useMemo(() => {
    const anchors = seededShuffle(items, seedRef.current);

    return [0, 1, 2].map((row) => {
      const anchor = anchors[row % Math.max(1, anchors.length)];
      const remaining = seededShuffle(
        items.filter((item) => item !== anchor),
        seedRef.current + row * 6151
      );
      const ordered = anchor ? [anchor, ...remaining] : [];
      return [...ordered, ...ordered, ...ordered];
    });
  }, [items]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !items.length) return undefined;
    const rows = gsap.utils.toArray(viewport.querySelectorAll(".circular-work-row"));
    const cards = gsap.utils.toArray(viewport.querySelectorAll(".circular-work-card"));
    const images = gsap.utils.toArray(viewport.querySelectorAll("img"));
    let measureFrame = 0;
    const states = rows.map((row, index) => {
      const randomOffset = ((seedRef.current + index * 3571) % 1000) / 1000;
      return {
        row,
        x: 0,
        distance: 1,
        speed: 0.86 + index * 0.1,
        baseSpeed: 0.86 + index * 0.1,
        direction: index % 2 === 0 ? -1 : 1,
        initialProgress: 0.12 + randomOffset * 0.7,
      };
    });

    const tick = () => {
      states.forEach((state) => {
        if (state.distance <= 1) return;
        state.x += state.speed * state.direction;
        state.x = ((state.x % state.distance) + state.distance) % state.distance;
        state.x -= state.distance;
        gsap.set(state.row, { x: state.x });
      });
    };

    const onResize = () => {
      states.forEach((state) => {
        const previousDistance = state.distance;
        state.distance = Math.max(1, state.row.scrollWidth / 3);
        if (previousDistance <= 1) {
          state.x = -state.distance * state.initialProgress;
        } else {
          state.x = ((state.x % state.distance) + state.distance) % state.distance;
          state.x -= state.distance;
        }
        gsap.set(state.row, { x: state.x });
      });
    };
    const scheduleMeasure = () => {
      if (measureFrame) cancelAnimationFrame(measureFrame);
      measureFrame = requestAnimationFrame(() => {
        measureFrame = 0;
        onResize();
      });
    };
    const onEnter = (event) => {
      event.currentTarget.classList.add("is-hovered");
      gsap.to(event.currentTarget, { scale: 1.14, y: -10, autoAlpha: 1, duration: 0.28, ease: "power3.out", overwrite: "auto" });
      states.forEach((state) => { state.speed = state.baseSpeed * 0.42; });
    };
    const onLeave = (event) => {
      event.currentTarget.classList.remove("is-hovered");
      gsap.to(event.currentTarget, { scale: 1, y: 0, duration: 0.32, ease: "power3.out", overwrite: "auto" });
      states.forEach((state) => { state.speed = state.baseSpeed; });
    };

    gsap.set(rows, { willChange: "transform" });
    gsap.set(cards, { transformOrigin: "50% 50%", willChange: "transform, opacity" });
    scheduleMeasure();
    images.forEach((image) => {
      if (image.complete) return;
      image.addEventListener("load", scheduleMeasure, { once: true });
      image.addEventListener("error", scheduleMeasure, { once: true });
    });
    const decodeImages = images.map((image) => (
      image.decode ? image.decode().catch(() => undefined) : Promise.resolve()
    ));
    Promise.all(decodeImages).then(scheduleMeasure);
    cards.forEach((card) => {
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
    });
    window.addEventListener("resize", scheduleMeasure);
    gsap.ticker.add(tick);
    tick();

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", scheduleMeasure);
      if (measureFrame) cancelAnimationFrame(measureFrame);
      images.forEach((image) => {
        image.removeEventListener("load", scheduleMeasure);
        image.removeEventListener("error", scheduleMeasure);
      });
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [items]);

  return (
    <div className="circular-work-viewport" ref={viewportRef}>
      {rowItems.map((row, rowIndex) => (
        <div className={`circular-work-row row-${rowIndex + 1}`} key={rowIndex}>
          {row.map((item, index) => (
            <button className="circular-work-card" key={`${item.src}-${rowIndex}-${index}`} onClick={() => onOpen(item)} type="button">
              <img src={item.src} alt={item.name} loading="eager" decoding="async" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
