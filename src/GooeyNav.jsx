import React, { useEffect, useRef, useState } from "react";
import "./GooeyNav.css";

const GooeyNav = ({
  items,
  activeHref = "",
  animationTime = 420,
  particleCount = 8,
  particleDistances = [28, 6],
  particleR = 54,
  timeVariance = 120,
  colors = [1, 2, 3, 1, 2, 3, 4],
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const initialIndex = items.findIndex((item) => item.href === activeHref);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const noise = (n = 1) => n / 2 - Math.random() * n;
  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };
  const createParticle = (index, time, distances, radius) => {
    const rotate = noise(radius / 10);
    return {
      start: getXY(distances[0], particleCount - index, particleCount),
      end: getXY(distances[1] + noise(7), particleCount - index, particleCount),
      time,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + radius / 20) * 10 : (rotate - radius / 20) * 10,
    };
  };

  const makeParticles = (element) => {
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i += 1) {
      const time = animationTime * 2 + noise(timeVariance * 2);
      const particleData = createParticle(i, time, particleDistances, particleR);
      element.classList.remove("active");

      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("particle");
        particle.style.setProperty("--start-x", `${particleData.start[0]}px`);
        particle.style.setProperty("--start-y", `${particleData.start[1]}px`);
        particle.style.setProperty("--end-x", `${particleData.end[0]}px`);
        particle.style.setProperty("--end-y", `${particleData.end[1]}px`);
        particle.style.setProperty("--time", `${particleData.time}ms`);
        particle.style.setProperty("--scale", `${particleData.scale}`);
        particle.style.setProperty("--color", `var(--color-${particleData.color}, white)`);
        particle.style.setProperty("--rotate", `${particleData.rotate}deg`);
        point.classList.add("point");
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => element.classList.add("active"));
        setTimeout(() => particle.parentNode?.removeChild(particle), time);
      }, 30);
    }
    window.setTimeout(() => element.classList.remove("active"), bubbleTime + 90);
  };

  const updateEffectPosition = (element) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerHTML = element.querySelector("a")?.innerHTML || "";
  };

  const activate = (element, index) => {
    if (activeIndex === index) {
      updateEffectPosition(element);
      filterRef.current?.querySelectorAll(".particle").forEach((particle) => particle.remove());
      if (filterRef.current) makeParticles(filterRef.current);
      return;
    }
    setActiveIndex(index);
    updateEffectPosition(element);
    filterRef.current?.querySelectorAll(".particle").forEach((particle) => particle.remove());
    if (textRef.current) {
      textRef.current.classList.remove("active");
      void textRef.current.offsetWidth;
      textRef.current.classList.add("active");
    }
    if (filterRef.current) makeParticles(filterRef.current);
  };

  useEffect(() => {
    const nextIndex = items.findIndex((item) => item.href === activeHref);
    setActiveIndex(nextIndex);
  }, [activeHref, items]);

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return undefined;
    const activeLi = navRef.current.querySelectorAll("li")[activeIndex];
    if (!activeLi) {
      if (filterRef.current) {
        filterRef.current.querySelectorAll(".particle").forEach((particle) => particle.remove());
        Object.assign(filterRef.current.style, { left: "0px", top: "0px", width: "0px", height: "0px" });
      }
      if (textRef.current) {
        textRef.current.classList.remove("active");
        textRef.current.innerHTML = "";
        Object.assign(textRef.current.style, { left: "0px", top: "0px", width: "0px", height: "0px" });
      }
    }
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add("active");
    }
    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll("li")[activeIndex];
      if (currentActiveLi) updateEffectPosition(currentActiveLi);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav>
        <ul ref={navRef}>
          {items.map((item, index) => (
            <li key={item.href} className={activeIndex === index ? "active" : ""}>
              <a
                href={item.href}
                onClick={(event) => activate(event.currentTarget.parentElement, index)}
                onMouseEnter={(event) => activate(event.currentTarget.parentElement, index)}
              >
                <span className="nav-en">{item.label}</span>
                <span className="nav-cn">{item.zh}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} />
      <span className="effect text" ref={textRef} />
    </div>
  );
};

export default GooeyNav;
