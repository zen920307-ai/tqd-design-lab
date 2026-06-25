import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import "./ProjectMasonry.css";

const preloadImages = async (urls) => {
  await Promise.all(
    urls.map((src) => new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = resolve;
    }))
  );
};

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

// 统一的滚动速度（像素/秒）。所有列无论内容多少，都以这个速度滚动，
// 视觉上完全一致。这个值与第四页（Cases 弹窗）的历史速度保持一致。
const SCROLL_SPEED_PX_PER_SEC = 60;

export default function ProjectMasonry({ items, onOpen }) {
  const containerRef = useRef(null);
  const seedRef = useRef(Math.floor(Math.random() * 233280));
  const [ready, setReady] = useState(false);
  const columns = 3;
  const columnItems = useMemo(() => {
    const anchors = seededShuffle(items, seedRef.current);

    return Array.from({ length: columns }, (_, column) => {
      const anchor = anchors[column % Math.max(1, anchors.length)];
      const remaining = seededShuffle(
        items.filter((item) => item !== anchor),
        seedRef.current + column * 7919
      );
      const sourceColumn = anchor ? [anchor, ...remaining] : [];
      return [...sourceColumn, ...sourceColumn].map((item, index) => ({
        ...item,
        id: `${item.id}-col${column}-${index}`,
      }));
    });
  }, [items]);

  useEffect(() => {
    setReady(false);
    preloadImages(items.map((item) => item.img)).then(() => setReady(true));
  }, [items]);

  // 用恒定的“像素/秒”驱动每列循环滚动。
  // 列内容是重复两份的（[...sourceColumn, ...sourceColumn]），
  // 所以“滚过一份完整内容”对应的位移正好是列总高度的一半（-50%）。
  // 令 duration = 一份内容高度 / 速度，所有列就会以相同的实际速度滚动，
  // 不会因为某列图片多、列更高而显得更快。
  //
  // 入场动画（淡入/模糊）只作用在图片项上，循环滚动只作用在列容器上，
  // 两者作用对象不同，互不打架。
  useLayoutEffect(() => {
    if (!ready || !containerRef.current) return undefined;
    const container = containerRef.current;
    const columnEls = gsap.utils.toArray(container.querySelectorAll(".project-masonry-column"));
    const wrappers = gsap.utils.toArray(container.querySelectorAll(".masonry-item-wrapper"));

    // 三列同时淡入（stagger: 0），避免第一列先出、第二列再出、第三列最后出
    const intro = gsap.fromTo(wrappers, {
      y: 80,
      autoAlpha: 0,
      filter: "blur(10px)",
    }, {
      y: 0,
      autoAlpha: 1,
      filter: "blur(0px)",
      duration: 0.72,
      stagger: 0,
      ease: "power3.out",
    });

    const tweens = [];

    // 根据列的真实高度创建循环滚动；改变高度时按当前进度续上，避免跳变
    const buildTween = (column, index) => {
      const half = column.scrollHeight / 2; // 重复两份，-50% 正好滚过一份内容
      if (!half || !Number.isFinite(half)) return null;
      const duration = half / SCROLL_SPEED_PX_PER_SEC;
      // 偶数列向上（0 -> -50%），奇数列向下（-50% -> 0），方向交错更好看
      const goingDown = index % 2 === 1;
      const prev = tweens[index];
      let startProgress = 0;
      if (prev) {
        startProgress = prev.progress();
        prev.kill();
      }
      const tween = gsap.fromTo(column, {
        yPercent: goingDown ? -50 : 0,
      }, {
        yPercent: goingDown ? 0 : -50,
        duration,
        ease: "none",
        repeat: -1,
      });
      tween.progress(startProgress);
      tween.paused(container.classList.contains("is-paused"));
      tweens[index] = tween;
      return tween;
    };

    const syncScroll = () => {
      // 等列真正有高度再建动画（弹窗/折叠面板展开前高度可能是 0）
      const hasHeight = columnEls.some((column) => column.scrollHeight > 0);
      if (!hasHeight) return;
      columnEls.forEach((column, index) => buildTween(column, index));
    };
    syncScroll();

    // 悬停暂停滚动（保留原来的 hover 暂停交互）
    const onEnter = () => {
      container.classList.add("is-paused");
      tweens.forEach((tween) => tween && tween.pause());
    };
    const onLeave = () => {
      container.classList.remove("is-paused");
      tweens.forEach((tween) => tween && tween.play());
    };
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    // 图片解码、面板展开、窗口缩放都会改变列高，统一在这里重算（保持当前进度）
    const observer = new ResizeObserver(syncScroll);
    columnEls.forEach((column) => observer.observe(column));

    return () => {
      observer.disconnect();
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      intro.kill();
      tweens.forEach((tween) => tween && tween.kill());
      gsap.killTweensOf(columnEls);
      gsap.killTweensOf(wrappers);
    };
  }, [ready]);

  return (
    <div className="project-masonry-list" ref={containerRef}>
      {columnItems.map((column, columnIndex) => (
        <div className={`project-masonry-column column-${columnIndex + 1}`} key={columnIndex}>
          {column.map((item) => (
            <button className="masonry-item-wrapper" key={item.id} onClick={() => onOpen?.(item)} type="button">
              <img className="masonry-item-img" src={item.img} alt="" loading="eager" decoding="async" />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
