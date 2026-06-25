import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { Suspense, lazy } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BorderGlow from "./BorderGlow";
import GooeyNav from "./GooeyNav";
import ProfileLanyard from "./ProfileLanyard";
import ProjectMasonry from "./ProjectMasonry";
import ThreeEffectBoundary from "./ThreeEffectBoundary";
import CircularWorkGallery from "./CircularWorkGallery";
import TextType from "./TextType";
import GlitchText from "./GlitchText";
import heroCluster from "./assets/hero-ui-cluster.png";
import systemEditor from "./assets/system-editor.png";
import casePreview from "./assets/case-preview.png";
import caseTable from "./assets/case-content-table.png";
import contactOrbit from "./assets/contact-orbit.png";
import audioLabBg from "./assets/vibe/audio-lab-bg.png";
import audioLabVideo from "./assets/scroll-core.mp4";
import { career, cases } from "./data";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ShapeBlur = lazy(() => import("./ShapeBlur"));
const DotField = lazy(() => import("./DotField"));
const LightRays = lazy(() => import("./LightRays"));
const LetterGlitch = lazy(() => import("./LetterGlitch"));
const RippleGrid = lazy(() => import("./RippleGrid"));

window.addEventListener("error", (event) => {
  document.documentElement.dataset.runtimeError = event.message || "runtime error";
  console.error("Window runtime error", event.error || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  document.documentElement.dataset.runtimeError = event.reason?.message || String(event.reason || "promise rejection");
  console.error("Unhandled promise rejection", event.reason);
});

const scrollFrameModules = import.meta.glob("./assets/scroll-frames-jpg/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

const scrollFrames = Object.entries(scrollFrameModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

const pageMarkers = [
  ["01", "HOME"],
  ["02", "ABOUT"],
  ["03", "DESIGN"],
  ["04", "PROJECTS"],
  ["05", "VISUAL"],
  ["06", "SITE"],
];

const navItems = [
  ["about", "ABOUT", "关于"],
  ["system", "DESIGN SYSTEM", "设计系统"],
  ["cases", "PROJECTS", "项目"],
  ["works", "VISUAL DESIGN", "视觉设计"],
  ["vibe", "PERSONAL SITE", "个人网站"],
];

const pageIds = ["hero", "about", "system", "cases", "works", "vibe"];

const systemImageModules = import.meta.glob("./assets/system/*/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const legacyProjectCoverModules = import.meta.glob("./assets/projects/covers/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const legacyProjectDetailModules = import.meta.glob("./assets/projects/details/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const projectCoverModules = import.meta.glob("./assets/projects/*/cover/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const projectDetailModules = import.meta.glob("./assets/projects/*/details/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const worksImageModules = import.meta.glob("./assets/works/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const sortedAssetEntries = (modules) => Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src]) => ({ path, src }));

const groupAssetEntries = (modules, root, folderIndex = 0) => (
  sortedAssetEntries(modules).reduce((groups, { path, src }) => {
    const relative = path.replace(root, "");
    const key = relative.split("/")[folderIndex];
    if (!key || key.includes(".")) return groups;
    return {
      ...groups,
      [key]: [...(groups[key] || []), src],
    };
  }, {})
);

const systemImagesById = groupAssetEntries(systemImageModules, "./assets/system/");
const projectCoverImagesById = groupAssetEntries(projectCoverModules, "./assets/projects/");
const projectDetailImagesById = groupAssetEntries(projectDetailModules, "./assets/projects/");

const legacyProjectCoverImages = sortedAssetEntries(legacyProjectCoverModules)
  .map(({ src }) => src);

const legacyProjectDetailImages = sortedAssetEntries(legacyProjectDetailModules)
  .map(({ src }) => src);

const worksFolderVisualImages = Object.entries(worksImageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src]) => ({
    src,
    name: path.split("/").pop().replace(/\.[^.]+$/, ""),
  }));

const moduleFallbackImages = [caseTable, casePreview, systemEditor, heroCluster, contactOrbit];
const getSystemImages = (id, index) => {
  const images = systemImagesById[id] || [];
  if (!images.length) return moduleFallbackImages;
  if (images.length >= 3) return images;
  return [
    ...images,
    ...moduleFallbackImages.filter((src) => !images.includes(src)),
  ];
};

const getProjectCover = (id, index) => (
  projectCoverImagesById[id]?.[0]
  || legacyProjectCoverImages[index]
  || [casePreview, systemEditor, caseTable, heroCluster, contactOrbit][index % 5]
);

const getProjectDetailImages = (id, index) => {
  const images = projectDetailImagesById[id] || [];
  if (images.length) return images;
  if (legacyProjectDetailImages.length) return legacyProjectDetailImages;
  return [getProjectCover(id, index), casePreview, systemEditor, caseTable, heroCluster, contactOrbit];
};

const caseImages = cases.map((item, index) => getProjectCover(item.id, index));
const careerDetails = [
  {
    focus: "界面基础与视觉秩序",
    description: "从移动端、后台页面和活动视觉开始，建立信息层级、版式节奏、状态表达和像素级交付习惯。",
    points: ["页面视觉规范", "多终端适配", "业务信息整理"],
  },
  {
    focus: "产品理解与复杂流程",
    description: "深入业务目标、角色权限、任务路径和异常状态，把界面从静态页面推进到可验证的产品体验。",
    points: ["业务流程梳理", "后台交互模式", "体验问题归纳"],
  },
  {
    focus: "组件资产与系统方法",
    description: "围绕低代码平台沉淀 token、组件、编辑器规则和设计验收标准，让团队从重复画页面转向复用系统。",
    points: ["Design Tokens", "组件库建设", "低代码编辑器体验"],
  },
  {
    focus: "团队协作与设计治理",
    description: "负责跨模块一致性、评审机制、研发协同和设计质量闭环，让设计系统持续演进而不是一次性交付。",
    points: ["设计评审机制", "交付与验收标准", "设计资产治理"],
  },
];

const careerCaptions = ["界面视觉设计师", "产品界面设计师", "设计系统建设者", "UI 设计负责人"];

const legacyVisualModules = import.meta.glob([
  "./assets/*.{png,jpg,jpeg,webp}",
  "!./assets/profile-reveal-*",
  "!./assets/profile-lanyard-*",
  "!./assets/wechat-qr.png",
], {
  eager: true,
  query: "?url",
  import: "default",
});

const legacyVisualImages = Object.entries(legacyVisualModules)
  .filter(([path]) => !path.includes("reference-full-page"))
  .map(([path, src]) => ({
    src,
    name: path.split("/").pop().replace(/\.[^.]+$/, ""),
  }));

const visualImages = worksFolderVisualImages.length ? worksFolderVisualImages : legacyVisualImages;

const caseSections = [
  ["Project Brief", "项目类型、服务对象、业务目标、你的角色、时间周期"],
  ["Research", "业务访谈、用户访谈、竞品分析、业务流程梳理、痛点归纳"],
  ["Persona", "2-3 个核心用户画像和主要诉求"],
  ["Information Architecture", "信息架构树或业务流程图"],
  ["Interface Design", "核心页面、关键状态、移动端适配"],
  ["Interaction Detail", "拖拽、筛选、批量操作、异常提示、空状态、权限状态"],
  ["Review & Metrics", "页面使用、反馈问题、任务效率、返工率、组件复用、设计验收"],
];

const cleanSystemModules = [
  {
    id: "tokens",
    title: "DESIGN TOKENS",
    caption: "Color / Type / Space / State",
    description: "从 0 到 1 建立低代码平台的设计变量体系，将颜色、字体、间距、圆角、阴影、状态等基础规则抽象为统一 Token，保障产品在多页面、多角色、多业务场景下的视觉一致性与长期扩展能力。",
    tags: ["Variables", "Theme", "Dark Mode", "Semantic Color"],
  },
  {
    id: "components",
    title: "COMPONENT LIBRARY",
    caption: "Button / Table / Form / Modal",
    description: "围绕低代码平台的真实业务场景，沉淀按钮、表单、表格、弹窗、导航、筛选器、配置面板等高频组件，并通过组件变体、状态规范和复用规则，提升设计效率与团队协作一致性。",
    tags: ["Variants", "States", "Auto Layout", "Reusable"],
  },
  {
    id: "editor",
    title: "VISUAL EDITOR",
    caption: "Material / Canvas / Inspector / Layer",
    description: "定义低代码平台的核心可视化搭建体验，覆盖左侧物料区、中间画布、右侧属性面板、顶部工具栏、图层结构与预览发布流程，让复杂应用搭建从技术配置转化为直观的可视化操作。",
    tags: ["Drag", "Snap", "Preview", "Publish"],
  },
  {
    id: "admin",
    title: "ADMIN CONSOLE",
    caption: "Application / Role / Permission / Workflow",
    description: "设计低代码平台的管理控制台，覆盖应用管理、角色权限、组织配置、流程配置、数据列表、搜索筛选与状态管理等后台核心场景，为平台运营与业务配置提供稳定高效的管理体验。",
    tags: ["App Mgmt", "Permission", "Data Table", "Config"],
  },
  {
    id: "governance",
    title: "GOVERNANCE",
    caption: "Review / Handoff / QA / Archive",
    description: "建立从设计规范、组件复用、页面交付、开发协作到质量检查的完整设计治理流程，通过统一命名、组件约束、标注规则与归档机制，保障平台长期迭代中的一致性、可维护性和交付质量。",
    tags: ["Design Ops", "Spec", "Handoff", "Consistency"],
  },
];

const vibeFeatureItems = [
  { code: "AI", title: "人声分离", text: "Vocal / Instrument" },
  { code: "VX", title: "音色替换", text: "Voice Model" },
  { code: "MX", title: "母带处理", text: "Master Chain" },
  { code: "EQ", title: "参数调节", text: "Audio Control" },
];

function ZoomableImagePreview({ src, alt = "", label = "", className = "", onClose }) {
  const previewRef = useRef(null);
  const imageRef = useRef(null);
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const applyView = (nextZoom, nextPan) => {
    zoomRef.current = nextZoom;
    panRef.current = nextPan;
    setZoom(nextZoom);
    setPan(nextPan);
  };

  const clampPan = (nextPan, nextZoom) => {
    const image = imageRef.current;
    const stage = image?.parentElement;
    if (!image || !stage || nextZoom <= 1) return { x: 0, y: 0 };
    const maxX = Math.max(0, (image.offsetWidth * nextZoom - stage.clientWidth) / 2);
    const maxY = Math.max(0, (image.offsetHeight * nextZoom - stage.clientHeight) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, nextPan.x)),
      y: Math.max(-maxY, Math.min(maxY, nextPan.y)),
    };
  };

  useEffect(() => {
    applyView(1, { x: 0, y: 0 });
  }, [src]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverscroll = document.body.style.overscrollBehavior;
    const previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
    };
  }, []);

  useEffect(() => {
    const preview = previewRef.current;
    const image = imageRef.current;
    if (!preview || !image) return undefined;

    const handleWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const stageRect = image.parentElement.getBoundingClientRect();
      const pointer = {
        x: event.clientX - (stageRect.left + stageRect.width / 2),
        y: event.clientY - (stageRect.top + stageRect.height / 2),
      };
      const currentZoom = zoomRef.current;
      const nextZoom = Math.max(1, Math.min(5, currentZoom * Math.exp(-event.deltaY * 0.0015)));
      const ratio = nextZoom / currentZoom;
      const nextPan = clampPan({
        x: pointer.x - (pointer.x - panRef.current.x) * ratio,
        y: pointer.y - (pointer.y - panRef.current.y) * ratio,
      }, nextZoom);
      applyView(nextZoom, nextPan);
    };

    preview.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    return () => preview.removeEventListener("wheel", handleWheel, { capture: true });
  }, [src]);

  const handlePointerDown = (event) => {
    event.stopPropagation();
    if (zoomRef.current <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    };
    setDragging(true);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    const nextPan = clampPan({
      x: drag.panX + event.clientX - drag.startX,
      y: drag.panY + event.clientY - drag.startY,
    }, zoomRef.current);
    applyView(zoomRef.current, nextPan);
  };

  const handlePointerEnd = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    event.stopPropagation();
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      className={`zoomable-image-preview ${className}`}
      onClick={onClose}
      ref={previewRef}
      role="presentation"
    >
      <button className="lightbox-close" onClick={onClose} type="button">CLOSE</button>
      <div className="zoomable-image-stage">
        <img
          alt={alt}
          className={dragging ? "is-dragging" : ""}
          onClick={(event) => event.stopPropagation()}
          onPointerCancel={handlePointerEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          ref={imageRef}
          src={src}
          style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})` }}
        />
      </div>
      {label && <span>{label}</span>}
    </div>
  );
}

function TypewriterText({ text, activeKey, className }) {
  const [visible, setVisible] = useState("");

  useEffect(() => {
    let index = 0;
    setVisible("");
    const timer = window.setInterval(() => {
      index += 1;
      setVisible(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 28);
    return () => window.clearInterval(timer);
  }, [text, activeKey]);

  return <p className={className}>{visible}</p>;
}

function MobileNavToggle({ open, onToggle }) {
  return (
    <button
      className={`mobile-nav-toggle ${open ? "active" : ""}`}
      onClick={onToggle}
      type="button"
      aria-label="Toggle navigation menu"
    >
      <span />
      <span />
      <span />
    </button>
  );
}

function MobileNavOverlay({ open, onClose, items }) {
  React.useEffect(() => {
    if (!open) return;
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey, { capture: true });
    return () => window.removeEventListener("keydown", handleKey, { capture: true });
  }, [open, onClose]);

  return createPortal(
    <div className={`mobile-nav-overlay ${open ? "open" : ""}`}>
      <nav>
        {items.map(([id, label, zh]) => (
          <a key={id} href={`#${id}`} onClick={onClose}>
            {label}
            <span>{zh}</span>
          </a>
        ))}
      </nav>
    </div>,
    document.body,
  );
}

// 移动端检测：在 980px 以下打标记，方便 CSS 和 JS 联动
const isMobileScreen = window.matchMedia("(max-width: 980px)").matches;
const isSmallScreen = window.matchMedia("(max-width: 480px)").matches;

if (isMobileScreen) {
  document.documentElement.classList.add("mobile-view");
}
if (isSmallScreen) {
  document.documentElement.classList.add("small-view");
}

// 移动端降级监听：窗口大小变化时动态切换
const mobileMQL = window.matchMedia("(max-width: 980px)");
mobileMQL.addEventListener("change", (event) => {
  document.documentElement.classList.toggle("mobile-view", event.matches);
});

const smallMQL = window.matchMedia("(max-width: 480px)");
smallMQL.addEventListener("change", (event) => {
  document.documentElement.classList.toggle("small-view", event.matches);
});

function Header({ activePage }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = pageIds[activePage] || "about";
  const gooeyItems = navItems.map(([id, label, zh]) => ({ href: `#${id}`, label, zh }));

  return (
    <header className="site-header">
      <a className="brand" href="#hero" aria-label="TQD Design Lab home">
        <img src="/tqd-design-lab-logo.png" alt="" />
      </a>
      <GooeyNav
        activeHref={activeId === "hero" ? "" : `#${activeId}`}
        items={gooeyItems}
        particleCount={isMobileScreen ? 6 : 13}
        particleDistances={isMobileScreen ? [24, 6] : [36, 9]}
        particleR={isMobileScreen ? 44 : 72}
      />
      <MobileNavToggle
        open={mobileOpen}
        onToggle={() => setMobileOpen((v) => !v)}
      />
      <ProfileLanyard />
      <MobileNavOverlay
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={navItems}
      />
    </header>
  );
}

function PageProgress({ activePage }) {
  return (
    <aside className="page-progress" aria-label="Page progress">
      {pageMarkers.map(([number, label], index) => (
        <a className={activePage === index ? "active" : ""} href={`#${pageIds[index]}`} key={number}>
          <span>{number}</span>
          <em>{label}</em>
        </a>
      ))}
    </aside>
  );
}

function VideoBackdrop({ frameRef }) {
  return (
    <div className="video-backdrop" aria-hidden="true">
      <img
        ref={frameRef}
        className="site-video-bg"
        src={scrollFrames[0]}
        alt=""
        draggable="false"
        decoding="sync"
      />
      <span className="video-grain" />
    </div>
  );
}

function Hero() {
  return (
    <section className="snap-section intro-panel hero-screen dark-screen" id="hero">
      <div className="screen-no">01 / 06</div>
      <div className="corner-meta left">CHANGSHA / DESIGN OPS / SINCE 2015</div>
      <div className="corner-meta right">28°12'N<br />112°58'E<br /><br />UTC+8</div>
      <div className="hero-title">
        <TextType as="span" className="hero-title-line line-1" text="NOT JUST SCREENS" typingSpeed={22} initialDelay={180} loop={false} showCursor={false} />
        <TextType as="span" className="hero-title-line line-2" text="DESIGN" typingSpeed={38} initialDelay={760} loop={false} showCursor={false} />
        <TextType as="span" className="hero-title-line line-3" text="SYSTEMS" typingSpeed={34} initialDelay={1060} loop={false} showCursor={false} />
      </div>
      <div className="hero-identity">
        <p><i /> DESIGN SYSTEM SIGNAL</p>
        <h1>TANG QIDONG</h1>
        <span>UI Design Lead / Low-Code Design System Builder</span>
        <small>10 年 UI 设计与设计系统经验，从 0 到 1 构建 Wanying 低代码设计系统，让复杂产品可复用、可治理、可持续进化。</small>
      </div>
      <a className="round-cta" href="#system">
        <ThreeEffectBoundary fallback={<span className="round-cta-fallback" aria-hidden="true" />}>
          <Suspense fallback={null}>
            <ShapeBlur
              className="round-cta-shape"
              variation={2}
              pixelRatioProp={window.devicePixelRatio || 2}
              shapeSize={0.62}
              roundness={0.5}
              borderSize={0.026}
              circleSize={0.38}
              circleEdge={0.72}
            />
          </Suspense>
        </ThreeEffectBoundary>
        <span className="round-cta-text">
          <GlitchText speed={0.72} enableShadows enableOnHover>VIEW</GlitchText>
          <GlitchText speed={0.78} enableShadows enableOnHover>SYSTEM</GlitchText>
          <i>→</i>
        </span>
      </a>
    </section>
  );
}

function CareerScreen() {
  const [active, setActive] = useState(null);
  const current = active === null ? null : career[active];
  const detail = active === null ? null : careerDetails[active];

  return (
    <section className="snap-section intro-panel career-screen light-screen" id="about">
      <div className="career-left">
        <div className="career-copy">
          <TextType as="h2" text="从界面执行者，到系统设计负责人。" typingSpeed={34} initialDelay={100} loop={false} showCursor={false} startOnVisible />
          <p>职业路径不是简单的年限堆叠，而是从页面产出、产品理解、组件沉淀、团队协作，到设计治理能力的持续升级。</p>
        </div>
      </div>
      <div className="career-nav">
        {career.map((item, index) => (
          <button className={`career-card ${active === index ? "active" : ""}`} key={item.version} onClick={() => setActive(index)} type="button">
            <span>{item.version}</span>
            <h3>{item.title}<small>{careerCaptions[index]}</small></h3>
            <p>{item.period}</p>
          </button>
        ))}
      </div>
      {detail && (
        <BorderGlow
          className="career-detail"
          backgroundColor="rgba(10, 12, 15, 0.26)"
          borderRadius={18}
          glowColor="200 28 82"
          glowRadius={20}
          glowIntensity={0.12}
          colors={["rgba(255, 255, 255, 0.2)", "rgba(226, 232, 235, 0.13)", "rgba(150, 170, 182, 0.08)"]}
          fillOpacity={0.006}
          animated
        >
          <div className="career-detail-card">
            <span>{current.period} / {current.version}</span>
            <h3>{detail.focus}</h3>
            <p>{detail.description}</p>
            <ul>
              {detail.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </div>
        </BorderGlow>
      )}
    </section>
  );
}

function SystemScreen() {
  const [active, setActive] = useState("editor");
  const [preview, setPreview] = useState(null);
  const screenRef = useRef(null);

  // 用 GSAP 精确插值每行高度：被点击的模块从 82px 平滑展开到目标高度，
  // 其他模块平滑压缩回 82px。高度完全由显式数值驱动，不依赖 flex 内容高度，
  // 因此不会出现“先撑很高再回弹、超出大模块容器”的弹跳。
  useLayoutEffect(() => {
    const screen = screenRef.current;
    if (!screen) return undefined;
    const accordion = screen.querySelector(".system-accordion .border-glow-inner");
    if (!accordion) return undefined;
    const rows = gsap.utils.toArray(accordion.querySelectorAll(":scope > .system-row"));
    if (!rows.length) return undefined;

    const ROW_HEIGHT = 82;
    const computeTargets = () => {
      const activeIndex = rows.findIndex((row) => row.classList.contains("active"));
      const hasActive = activeIndex >= 0;
      // 活动行目标高度 = 容器总高 - 其它行高度（每行 82px）
      const containerHeight = accordion.clientHeight;
      const othersHeight = (rows.length - 1) * ROW_HEIGHT;
      const targetActive = hasActive
        ? Math.max(ROW_HEIGHT, containerHeight - othersHeight)
        : ROW_HEIGHT;
      return rows.map((row, index) => ({
        row,
        to: hasActive && index === activeIndex ? targetActive : ROW_HEIGHT,
      }));
    };

    // 点击切换：平滑过渡
    const targets = computeTargets();
    const tween = gsap.to(rows, {
      height: (index) => targets[index].to,
      duration: 0.62,
      ease: "power3.out",
      overwrite: "auto",
    });

    // 窗口缩放：直接吸附到新高度，不做动画（避免缩放时反复跳动）
    const onResize = () => {
      const targets = computeTargets();
      targets.forEach(({ row, to }) => gsap.set(row, { height: to }));
    };
    window.addEventListener("resize", onResize);

    return () => {
      tween.kill();
      window.removeEventListener("resize", onResize);
    };
  }, [active]);

  return (
    <section className="snap-section system-screen dark-screen" id="system" ref={screenRef}>
      <div className="system-letter-glitch" aria-hidden="true">
        <ThreeEffectBoundary>
          <Suspense fallback={null}>
            <LetterGlitch
              glitchSpeed={58}
              centerVignette={false}
              outerVignette={false}
              smooth
              glitchColors={["#3d638e", "#86b9d8", "#d5edf8"]}
              characters="DESIGNSYSTEM0123456789<>[]{}+=/#"
            />
          </Suspense>
        </ThreeEffectBoundary>
      </div>
      <div className="panel-head">
        <div><b>+</b> WANYING SYSTEM INDEX</div>
        <span>SYSTEM HEALTH <i /> OPTIMAL</span>
      </div>
      <BorderGlow
        className="system-accordion motion-card"
        backgroundColor="rgba(8, 11, 14, 0.07)"
        borderRadius={14}
        colors={["rgba(220, 232, 238, 0.12)", "rgba(151, 174, 186, 0.08)", "rgba(240, 246, 248, 0.1)"]}
        glowIntensity={0.08}
        glowRadius={20}
        fillOpacity={0.008}
      >
        {cleanSystemModules.map((item, index) => (
          <div className={`system-row ${active === item.id ? "active" : ""}`} key={item.id}>
            <button onClick={() => setActive(item.id)} type="button">
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <h3>{item.title}</h3>
              <span>{item.caption}</span>
              <em>{active === item.id ? "−" : "+"}</em>
            </button>
            <div className="system-detail-inline" aria-hidden={active !== item.id}>
              <div>
                <TypewriterText activeKey={active === item.id ? item.id : `${item.id}-closed`} className="typewriter-text" text={item.description} />
                <ul className="system-tag-list" key={`${item.id}-tags`}>
                  {item.tags.map((tag, tagIndex) => <li key={tag} style={{ "--tag-delay": `${tagIndex * 90 + 180}ms` }}>{tag}</li>)}
                </ul>
              </div>
              <div className="system-masonry-panel">
                <ProjectMasonry
                  items={getSystemImages(item.id, index).map((src, imageIndex) => ({
                    id: `${item.id}-${imageIndex}`,
                    img: src,
                  }))}
                  onOpen={setPreview}
                />
              </div>
            </div>
          </div>
        ))}
      </BorderGlow>
      {preview && (
        <ZoomableImagePreview
          className="project-image-preview system-image-preview"
          onClose={() => setPreview(null)}
          src={preview.img}
        />
      )}
    </section>
  );
}

function CasesScreen() {
  const [active, setActive] = useState(cases[0]);
  const [open, setOpen] = useState(false);
  const activeIndex = Math.max(0, cases.findIndex((item) => item.id === active.id));
  const activeImage = caseImages[activeIndex] || casePreview;

  return (
    <section className="snap-section cases-screen dark-screen" id="cases">
      <div className="cases-dot-field" aria-hidden="true">
        <ThreeEffectBoundary>
          <Suspense fallback={null}>
            <DotField
              dotRadius={3.2}
              dotSpacing={24}
              cursorRadius={680}
              bulgeStrength={145}
              glowRadius={410}
              gradientFrom="rgba(198, 229, 242, 0.58)"
              gradientTo="rgba(88, 137, 210, 0.32)"
              glowColor="rgba(76, 150, 236, 0.58)"
              sparkle={false}
              waveAmplitude={1.15}
            />
          </Suspense>
        </ThreeEffectBoundary>
      </div>
      <div className="panel-head">
        <div><b>+</b> CASE EVIDENCE</div>
        <button onClick={() => setOpen(true)} type="button">项目可点击查看完整介绍 →</button>
      </div>
      <div className="case-stage">
        <div className="case-index">
          {cases.map((item, index) => (
            <button className={active.id === item.id ? "active" : ""} key={item.id} onClick={() => setActive(item)} type="button">
              <span>CASE</span>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <em>{item.title}</em>
            </button>
          ))}
        </div>
        <BorderGlow className="case-preview-card motion-card" animated>
          <button className="open-case" onClick={() => setOpen(true)} type="button">
            <img className="reveal-image" src={activeImage} alt="" key={active.id} />
            <span>CLICK TO OPEN PROJECT DETAIL</span>
          </button>
        </BorderGlow>
        <CaseMetrics activeId={active.id} metrics={active.metrics} />
      </div>
      {open && <ProjectDetail project={active} onClose={() => setOpen(false)} />}
    </section>
  );
}

function CaseMetrics({ activeId, metrics }) {
  const metricsRef = useRef(null);

  useGSAP((context, contextSafe) => {
    const cards = gsap.utils.toArray(".case-metric-card");
    const cleanups = [];

    cards.forEach((card, index) => {
      const valueNode = card.querySelector("strong");
      const rail = card.querySelector(".metric-rail-fill");
      const rawValue = metrics[index]?.value || "0";
      const numericValue = Number.parseFloat(rawValue) || 0;
      const suffix = rawValue.replace(String(numericValue), "");
      const counter = { value: 0 };

      gsap.set(rail, { scaleX: 0.38 + index * 0.2 });

      gsap.to(counter, {
        value: numericValue,
        duration: 0.82,
        delay: index * 0.06,
        ease: "power2.out",
        onUpdate: () => {
          if (!valueNode) return;
          const display = numericValue % 1 === 0 ? Math.round(counter.value) : counter.value.toFixed(1);
          valueNode.textContent = `${display}${suffix}`;
        },
      });

      const onMove = contextSafe((event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          x: 10,
          y: -4,
          rotationX: py * -7,
          rotationY: px * 10,
          scale: 1.035,
          transformPerspective: 720,
          duration: 0.34,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(rail, {
          scaleX: gsap.utils.clamp(0.56, 1, 0.72 + px * 0.4),
          duration: 0.28,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
      const onLeave = contextSafe(() => {
        gsap.to(card, {
          x: 0,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          duration: 0.48,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(rail, {
          scaleX: 0.38 + index * 0.2,
          duration: 0.42,
          ease: "power3.out",
          overwrite: "auto",
        });
      });

      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, { scope: metricsRef, dependencies: [activeId], revertOnUpdate: true });

  return (
    <div className="case-metrics" ref={metricsRef}>
      {metrics.map((metric, index) => (
        <div className="case-metric-card" key={metric.label}>
          <span className="metric-index">0{index + 1}</span>
          <strong>{metric.value}</strong>
          <span className="metric-label">{metric.label}</span>
          <span className="metric-rail"><i className="metric-rail-fill" /></span>
        </div>
      ))}
    </div>
  );
}

function ProjectDetail({ project, onClose }) {
  const [preview, setPreview] = useState(null);
  const projectIndex = Math.max(0, cases.findIndex((item) => item.id === project.id));
  const slides = getProjectDetailImages(project.id, projectIndex);
  const masonryItems = [...slides, ...slides, ...slides].map((src, index) => ({
    id: `${project.id}-${index}`,
    img: src,
  }));

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  return (
    <div className="project-modal">
      <button className="modal-close" onClick={onClose} type="button">CLOSE ×</button>
      <div className="project-gallery-column">
        <ProjectMasonry items={masonryItems} onOpen={setPreview} />
      </div>
      <div className="project-copy-panel">
        <p className="screen-kicker">{project.type}</p>
        <h2>{project.title}</h2>
        <p>{project.brief}</p>
        <div className="case-table">
          {caseSections.map(([label, content]) => (
            <React.Fragment key={label}>
              <strong>{label}</strong>
              <span>{content}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      {preview && (
        <ZoomableImagePreview
          className="project-image-preview"
          onClose={() => setPreview(null)}
          src={preview.img}
        />
      )}
    </div>
  );
}

function WorksScreen() {
  const [active, setActive] = useState(null);

  return (
    <section className="snap-section works-screen soft-screen" id="works">
      <div className="works-rays" aria-hidden="true">
        <ThreeEffectBoundary>
          <Suspense fallback={null}>
            <LightRays
              raysOrigin="top-center"
              raysColor="#9ed8f5"
              raysSpeed={0.9}
              lightSpread={0.9}
              rayLength={1.65}
              pulsating
              fadeDistance={0.96}
              saturation={0.8}
              followMouse
              mouseInfluence={0.2}
              noiseAmount={0.15}
              distortion={0.1}
            />
          </Suspense>
        </ThreeEffectBoundary>
      </div>
      <div className="screen-kicker">05 / Visual Works Beyond Interfaces</div>
      <h2>平面视觉 / 品牌 / 海报 / 展会 / 营销物料</h2>
      <CircularWorkGallery items={visualImages} onOpen={setActive} />
      {active && (
        <ZoomableImagePreview
          alt={active.name}
          className="lightbox"
          label={active.name}
          onClose={() => setActive(null)}
          src={active.src}
        />
      )}
    </section>
  );
}

function VibeSiteScreen() {
  return (
    <section className="snap-section vibe-site-screen dark-screen" id="vibe">
      <img className="vibe-bg" src={audioLabBg} alt="" />
      <div className="vibe-ripple-bg" aria-hidden="true">
        <ThreeEffectBoundary>
          <Suspense fallback={null}>
            <RippleGrid
              enableRainbow={false}
              gridColor="#80b8d8"
              rippleIntensity={0.1}
              gridSize={8}
              gridThickness={8.4}
              fadeDistance={1.34}
              vignetteStrength={1.7}
              glowIntensity={0.24}
              opacity={0.42}
              gridRotation={-4}
              mouseInteraction
              mouseInteractionRadius={0.82}
            />
          </Suspense>
        </ThreeEffectBoundary>
      </div>
      <div className="vibe-bg-shade" aria-hidden="true" />
      <div className="vibe-copy">
        <h2>
          <TextType text="Audio Lab：从 0 到 1 的个人音频实验室" typingSpeed={26} initialDelay={120} loop={false} showCursor={false} startOnVisible />
        </h2>
        <p>
          独立完成的个人音频工作站，从需求整理、界面设计、粒子光效，到前端构建、后端音频流程和测试输出，完整走通。
        </p>
        <p>
          功能包括上传音频后可进行人声/伴奏分离、切换人声模型、替换音色、母带处理、参数调节与多版本下载，历史档案管理等。
        </p>
        <div className="vibe-tags">
          <span>Product Thinking</span>
          <span>Interface Design</span>
          <span>Particle FX</span>
          <span>Frontend / Backend</span>
          <span>Audio Workflow</span>
        </div>
      </div>
      <div className="vibe-player">
        <video src={audioLabVideo} controls muted playsInline preload="metadata" />
      </div>
      <div className="vibe-feature-grid" aria-label="Audio lab capabilities">
        {vibeFeatureItems.map((item) => (
          <div className="vibe-feature" key={item.title}>
            <i>{item.code}</i>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [activePage, setActivePage] = useState(0);
  const rootRef = useRef(null);
  const frameRef = useRef(null);

  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heroTargets = ".site-header, .hero-title-line, .hero-cluster, .hero-identity, .round-cta, .corner-meta, .screen-no";
    const showHero = () => gsap.set(heroTargets, { clearProps: "opacity,visibility,clipPath,filter,y,yPercent", autoAlpha: 1 });
    let onWheelSnap = null;
    let onKeySnap = null;
    let onTouchStartSnap = null;
    let onTouchEndSnap = null;
    let onHeroPointerMove = null;
    let onHeroPointerLeave = null;
    let introScrollTween = null;
    const cleanupFns = [];
    const safetyTimer = window.setTimeout(showHero, 360);
    cleanupFns.push(() => window.clearTimeout(safetyTimer));

    try {
      document.documentElement.classList.add("gsap-ready");
      showHero();

      if (reduce) {
        showHero();
      } else {
        gsap.set(".site-header", { y: -18, autoAlpha: 1 });
        gsap.set(".hero-title-line", {
          yPercent: 18,
          scaleX: 0.34,
          scaleY: 1.06,
          clipPath: "inset(0 0 0 0)",
          filter: "drop-shadow(0 28px 38px rgba(0, 0, 0, 0.68)) blur(1.2px)",
        });
        gsap.set(".hero-identity, .round-cta, .corner-meta, .screen-no", { autoAlpha: 1, y: 18 });
        gsap.set(".hero-title", { "--title-shine-x": "18%" });

        const introFallback = window.setTimeout(showHero, 2200);
        cleanupFns.push(() => window.clearTimeout(introFallback));

        gsap.timeline({ defaults: { ease: "expo.out" } })
          .to(".site-header", { y: 0, duration: 0.75 })
          .to(".hero-title-line", {
            yPercent: 0,
            scaleX: 0.48,
            scaleY: 1,
            clipPath: "inset(0 0 0% 0)",
            filter: "drop-shadow(0 18px 28px rgba(0, 0, 0, 0.55)) blur(0px)",
            duration: 1.45,
            stagger: 0.13,
          }, "-=0.45")
          .to(".hero-title", { "--title-shine-x": "86%", duration: 1.35, ease: "power2.out" }, "-=1.05")
          .to(".hero-identity, .round-cta, .corner-meta, .screen-no", { y: 0, duration: 0.85, stagger: 0.06 }, "-=0.75");

        const heroTitle = rootRef.current?.querySelector(".hero-title");
        const titleSpans = gsap.utils.toArray(".hero-title-line");
        const setTitleX = gsap.quickTo(titleSpans, "x", { duration: 0.55, ease: "power3.out" });
        const setTitleY = gsap.quickTo(titleSpans, "y", { duration: 0.55, ease: "power3.out" });
        const setTitleScaleX = gsap.quickTo(titleSpans, "scaleX", { duration: 0.65, ease: "power3.out" });
        const setTitleShine = gsap.quickTo(heroTitle, "--title-shine-x", { duration: 0.72, ease: "power3.out" });
        onHeroPointerMove = (event) => {
          const xProgress = event.clientX / window.innerWidth - 0.5;
          const yProgress = event.clientY / window.innerHeight - 0.5;
          setTitleX(xProgress * -18);
          setTitleY(yProgress * -10);
          setTitleScaleX(0.465 + Math.abs(xProgress) * 0.032);
          setTitleShine(`${gsap.utils.clamp(20, 88, 50 + xProgress * 64)}%`);
        };
        onHeroPointerLeave = () => {
          setTitleX(0);
          setTitleY(0);
          setTitleScaleX(0.48);
          setTitleShine("62%");
        };
        window.addEventListener("pointermove", onHeroPointerMove, { passive: true });
        window.addEventListener("pointerleave", onHeroPointerLeave);
      }

      const isSectionSnapEnabled = () => true;
      const getSnapSections = () => (
        isSectionSnapEnabled() ? gsap.utils.toArray("#system, #cases, #works, #vibe") : []
      );
      const getSnapTops = () => getSnapSections().map((section) => Math.round(section.offsetTop));
      const getSystemTop = () => getSnapTops()[0] ?? window.innerHeight * 2;
      const getAboutTop = () => Math.round(document.querySelector("#about")?.offsetTop ?? window.innerHeight);
      const getIntroEndY = () => getSystemTop();
      const getNearestSnapIndex = (y) => {
        const tops = getSnapTops();
        return tops.reduce((nearest, top, index) => (
          Math.abs(top - y) < Math.abs(tops[nearest] - y) ? index : nearest
        ), 0);
      };
      const hasOpenOverlay = () => Boolean(document.querySelector(".project-modal, .lightbox, .zoomable-image-preview"));
      const shouldLeaveNativeScroll = (event) => (
        event.target?.closest?.(".project-copy-panel, .project-gallery-column")
      );
      const normalizeWheelDelta = (event) => {
        const unit = event.deltaMode === 1 ? 32 : event.deltaMode === 2 ? window.innerHeight : 1;
        return event.deltaY * unit;
      };

      let syncFrameForScrollY = () => {};
      if (frameRef.current && scrollFrames.length) {
        let scrollRafId = 0;
        let currentFrameIndex = -1;
        const syncFrameToProgress = (progress) => {
          const clampedProgress = gsap.utils.clamp(0, 1, progress);
          const frameIndex = Math.round(clampedProgress * (scrollFrames.length - 1));
          if (frameIndex !== currentFrameIndex && frameRef.current) {
            frameRef.current.src = scrollFrames[frameIndex];
            rootRef.current?.style.setProperty("--video-grain-opacity", (0.18 + clampedProgress * 0.14).toFixed(3));
            rootRef.current?.style.setProperty("--video-vignette", (0.82 + clampedProgress * 0.16).toFixed(3));
            rootRef.current?.style.setProperty("--video-side-mask", (0.34 + clampedProgress * 0.22).toFixed(3));
            currentFrameIndex = frameIndex;
          }
        };
        const updateVideoFromScroll = () => {
          scrollRafId = 0;
          const introEnd = Math.max(1, getIntroEndY());
          syncFrameToProgress(window.scrollY / introEnd);
        };
        syncFrameForScrollY = (scrollY) => {
          const introEnd = Math.max(1, getIntroEndY());
          syncFrameToProgress(scrollY / introEnd);
        };
        const queueVideoUpdate = () => {
          if (!scrollRafId) scrollRafId = requestAnimationFrame(updateVideoFromScroll);
        };
        const preloadFrames = () => {
          let index = 0;
          const loadOne = (src) => {
            const image = new Image();
            image.decoding = "async";
            image.loading = "eager";
            image.src = src;
          };
          const loadBatch = (deadline) => {
            let count = 0;
            while (index < scrollFrames.length && count < 8 && (!deadline || deadline.timeRemaining() > 4)) {
              loadOne(scrollFrames[index]);
              index += 1;
              count += 1;
            }
            if (index < scrollFrames.length) {
              const idle = window.requestIdleCallback || ((callback) => window.setTimeout(() => callback({ timeRemaining: () => 8 }), 180));
              idle(loadBatch, { timeout: 900 });
            }
          };
          while (index < Math.min(16, scrollFrames.length)) {
            loadOne(scrollFrames[index]);
            index += 1;
          }
          window.setTimeout(() => {
            const idle = window.requestIdleCallback || ((callback) => window.setTimeout(() => callback({ timeRemaining: () => 8 }), 180));
            idle(loadBatch, { timeout: 900 });
          }, 900);
        };
        syncFrameToProgress(0);
        preloadFrames();
        window.addEventListener("scroll", queueVideoUpdate, { passive: true });
        window.addEventListener("resize", queueVideoUpdate);
        cleanupFns.push(() => {
          window.removeEventListener("scroll", queueVideoUpdate);
          window.removeEventListener("resize", queueVideoUpdate);
          if (scrollRafId) cancelAnimationFrame(scrollRafId);
        });
      }

      let isSnapping = false;
      let snapLockedUntil = 0;
      let introScrollTarget = window.scrollY;
      const snapToY = (end, duration = 0.52, lockExtra = 220) => {
        const start = window.scrollY;
        const state = { y: start };
        introScrollTarget = end;
        introScrollTween?.kill();
        isSnapping = true;
        snapLockedUntil = Date.now() + duration * 1000 + lockExtra;
        gsap.to(state, {
          y: end,
          duration,
          ease: "power3.inOut",
          overwrite: true,
          onUpdate() {
            window.scrollTo(0, state.y);
          },
          onComplete() {
            window.scrollTo(0, end);
            syncFrameForScrollY(end);
            isSnapping = false;
          },
        });
      };
      const scrubIntroByWheel = (event) => {
        const introEnd = getIntroEndY();
        const currentY = window.scrollY;
        const delta = normalizeWheelDelta(event);
        if (!introScrollTween?.isActive()) introScrollTarget = currentY;
        introScrollTarget = gsap.utils.clamp(0, introEnd, introScrollTarget + delta * 1.18);
        const state = { y: currentY };
        introScrollTween?.kill();
        introScrollTween = gsap.to(state, {
          y: introScrollTarget,
          duration: 0.34,
          ease: "power2.out",
          overwrite: true,
          onUpdate() {
            window.scrollTo(0, state.y);
            syncFrameForScrollY(state.y);
          },
          onComplete() {
            syncFrameForScrollY(introScrollTarget);
          },
        });
      };
      const snapToSection = (target, lockExtra = 360) => snapToY(target.offsetTop, 0.42, lockExtra);
      onWheelSnap = (event) => {
        const snapSections = getSnapSections();
        if (!snapSections.length || Math.abs(event.deltaY) < 1 || event.ctrlKey || hasOpenOverlay() || shouldLeaveNativeScroll(event)) return;
        const y = window.scrollY;
        const systemTop = getSystemTop();
        const introEnd = getIntroEndY();
        if (y < introEnd - 2 || (event.deltaY < 0 && y <= introEnd + 24)) {
          event.preventDefault();
          scrubIntroByWheel(event);
          return;
        }
        if (y < systemTop - 2) {
          event.preventDefault();
          if (event.deltaY > 0) snapToSection(snapSections[0], 520);
          else snapToY(introEnd, 0.3, 140);
          return;
        }
        if (isSnapping || Date.now() < snapLockedUntil) {
          event.preventDefault();
          return;
        }
        const tops = getSnapTops();
        const aboutTop = getAboutTop();
        const currentIndex = getNearestSnapIndex(y);
        if (event.deltaY < 0 && currentIndex === 0) {
          event.preventDefault();
          snapToY(aboutTop, 0.36, 240);
          return;
        }
        event.preventDefault();
        const nextIndex = gsap.utils.clamp(0, snapSections.length - 1, currentIndex + (event.deltaY > 0 ? 1 : -1));
        if (nextIndex !== currentIndex) snapToSection(snapSections[nextIndex]);
      };
      document.addEventListener("wheel", onWheelSnap, { passive: false, capture: true });
      onKeySnap = (event) => {
        const snapSections = getSnapSections();
        if (!snapSections.length || hasOpenOverlay()) return;
        const forwardKeys = ["ArrowDown", "PageDown", " "];
        const backKeys = ["ArrowUp", "PageUp"];
        if (![...forwardKeys, ...backKeys].includes(event.key)) return;
        const y = window.scrollY;
        const systemTop = getSystemTop();
        const aboutTop = getAboutTop();
        const introEnd = getIntroEndY();
        if (y < introEnd - 12) return;
        if (y < systemTop - 12) {
          if (forwardKeys.includes(event.key)) {
            event.preventDefault();
            snapToSection(snapSections[0], 760);
          }
          return;
        }
        const currentIndex = getNearestSnapIndex(y);
        if (backKeys.includes(event.key) && currentIndex === 0) {
          event.preventDefault();
          snapToY(introEnd || aboutTop, 0.48, 320);
          return;
        }
        const nextIndex = gsap.utils.clamp(
          0,
          snapSections.length - 1,
          currentIndex + (forwardKeys.includes(event.key) ? 1 : -1)
        );
        event.preventDefault();
        if (nextIndex !== currentIndex) snapToSection(snapSections[nextIndex]);
      };
      window.addEventListener("keydown", onKeySnap);

      let touchSnapStart = null;
      onTouchStartSnap = (event) => {
        const snapSections = getSnapSections();
        if (!snapSections.length || hasOpenOverlay() || shouldLeaveNativeScroll(event)) return;
        const touch = event.touches?.[0];
        if (!touch) return;
        touchSnapStart = {
          x: touch.clientX,
          y: touch.clientY,
          scrollY: window.scrollY,
        };
      };
      onTouchEndSnap = (event) => {
        if (!touchSnapStart) return;
        const start = touchSnapStart;
        touchSnapStart = null;
        const touch = event.changedTouches?.[0];
        if (!touch || hasOpenOverlay()) return;
        const deltaX = touch.clientX - start.x;
        const deltaY = start.y - touch.clientY;
        if (Math.abs(deltaY) < 44 || Math.abs(deltaY) < Math.abs(deltaX) * 1.12) return;

        const snapSections = getSnapSections();
        if (!snapSections.length || isSnapping || Date.now() < snapLockedUntil) return;

        const y = window.scrollY;
        const introEnd = getIntroEndY();
        if (start.scrollY < introEnd - 24 && y < introEnd - window.innerHeight * 0.18) return;
        if (deltaY > 0 && y < introEnd + 96) {
          snapToSection(snapSections[0], 520);
          return;
        }
        if (deltaY < 0 && y < introEnd - 24) return;

        const currentIndex = getNearestSnapIndex(y);
        if (deltaY < 0 && currentIndex === 0) {
          snapToY(getAboutTop(), 0.36, 240);
          return;
        }
        const nextIndex = gsap.utils.clamp(0, snapSections.length - 1, currentIndex + (deltaY > 0 ? 1 : -1));
        if (nextIndex !== currentIndex) snapToSection(snapSections[nextIndex]);
      };
      window.addEventListener("touchstart", onTouchStartSnap, { passive: true });
      window.addEventListener("touchend", onTouchEndSnap, { passive: true });

      let activeSyncRaf = 0;
      const syncActivePageFromViewport = () => {
        activeSyncRaf = 0;
        const probeY = window.scrollY + window.innerHeight * 0.52;
        const sections = pageIds
          .map((id, pageIndex) => ({ pageIndex, element: document.getElementById(id) }))
          .filter((item) => item.element);
        const current = sections.reduce((matched, item) => (
          item.element.offsetTop <= probeY ? item : matched
        ), sections[0]);
        if (current) setActivePage((previous) => (previous === current.pageIndex ? previous : current.pageIndex));
      };
      const queueActivePageSync = () => {
        if (activeSyncRaf) return;
        activeSyncRaf = window.requestAnimationFrame(syncActivePageFromViewport);
      };
      window.addEventListener("scroll", queueActivePageSync, { passive: true });
      window.addEventListener("resize", queueActivePageSync);
      cleanupFns.push(() => {
        if (activeSyncRaf) window.cancelAnimationFrame(activeSyncRaf);
        window.removeEventListener("scroll", queueActivePageSync);
        window.removeEventListener("resize", queueActivePageSync);
      });
      queueActivePageSync();

      gsap.utils.toArray(".snap-section:not(.hero-screen)").forEach((section, index) => {
        const disableEntrance = section.classList.contains("system-screen") || section.classList.contains("cases-screen");
        const speed = 0.82;
        const kicker = disableEntrance ? null : section.querySelector(".screen-kicker, .panel-head");
        const headline = disableEntrance ? null : section.querySelector("h2");
        const cards = disableEntrance
          ? []
          : section.querySelectorAll(".motion-card, .tilted-work-card, .case-index button, .case-metrics div, .system-row, .vibe-copy p, .vibe-tags span");
        const careerNav = section.querySelector(".career-nav");
        const images = disableEntrance
          ? []
          : section.querySelectorAll(".reveal-image, .tilted-work-card img, .system-image");

        const sectionTl = gsap.timeline({
          paused: true,
          defaults: { ease: "expo.out" },
        });

        if (kicker) {
          sectionTl.fromTo(kicker, {
            y: 74,
            autoAlpha: 0,
            scaleX: 0.62,
            clipPath: "inset(0 100% 0 0)",
            filter: "blur(10px)",
          }, {
            y: 0,
            autoAlpha: 1,
            scaleX: 1,
            clipPath: "inset(0 0% 0 0)",
            filter: "blur(0px)",
            duration: 0.68 * speed,
          }, 0);
        }

        if (headline) {
          sectionTl.fromTo(headline, {
            y: 128,
            autoAlpha: 0,
            scaleX: 0.56,
            scaleY: 1.08,
            clipPath: "inset(0 0 100% 0)",
            filter: "blur(14px)",
          }, {
            y: 0,
            autoAlpha: 1,
            scaleX: 1,
            scaleY: 1,
            clipPath: "inset(0 0 0% 0)",
            filter: "blur(0px)",
            duration: 0.82 * speed,
          }, kicker ? 0.1 : 0);
        }

        if (cards.length) {
          sectionTl.fromTo(cards, {
            y: 78,
            autoAlpha: 0,
            scaleX: 0.82,
            scaleY: 0.98,
            filter: "blur(12px)",
          }, {
            y: 0,
            autoAlpha: 1,
            scaleX: 1,
            scaleY: 1,
            filter: "blur(0px)",
            duration: 0.64 * speed,
            stagger: { each: 0.045 * speed, from: "start" },
            ease: "power4.out",
          }, headline || kicker ? 0.28 : 0.04);
        }

        if (careerNav) {
          sectionTl.fromTo(careerNav, {
            y: 58,
            autoAlpha: 0,
            scaleX: 0.9,
            clipPath: "inset(8% 0 8% 0)",
            filter: "blur(10px)",
          }, {
            y: 0,
            autoAlpha: 1,
            scaleX: 1,
            clipPath: "inset(0% 0 0% 0)",
            filter: "blur(0px)",
            clearProps: "opacity,visibility,filter,transform,clipPath",
            duration: 0.66 * speed,
            ease: "power4.out",
          }, headline || kicker ? 0.28 : 0.04);
        }

        images.forEach((image) => {
          sectionTl.fromTo(image, {
            y: 54,
            scale: 1.06,
            autoAlpha: 0.42,
            clipPath: "inset(18% 0 18% 0)",
            filter: "blur(10px)",
          }, {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            clipPath: "inset(0% 0 0% 0)",
            filter: "blur(0px)",
            duration: 0.72 * speed,
            ease: "power3.out",
          }, headline || kicker ? 0.38 : 0.1);
          gsap.fromTo(image, { yPercent: -2.4 }, {
            yPercent: 2.4,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.8 },
          });
        });

        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          refreshPriority: index,
          onEnter: () => {
            const pageIndex = pageIds.indexOf(section.id);
            if (pageIndex >= 0) setActivePage(pageIndex);
            sectionTl.restart(true, false);
          },
          onEnterBack: () => {
            const pageIndex = pageIds.indexOf(section.id);
            if (pageIndex >= 0) setActivePage(pageIndex);
            sectionTl.restart(true, false);
          },
        });
      });

      ScrollTrigger.create({
        trigger: ".hero-screen",
        start: "top center",
        end: "bottom center",
        onEnter: () => setActivePage(0),
        onEnterBack: () => setActivePage(0),
      });

      ScrollTrigger.refresh();
    } catch (error) {
      console.error("GSAP animation setup failed", error);
      showHero();
    }

    return () => {
      document.documentElement.classList.remove("gsap-ready");
      if (onWheelSnap) document.removeEventListener("wheel", onWheelSnap, { capture: true });
      if (onKeySnap) window.removeEventListener("keydown", onKeySnap);
      if (onTouchStartSnap) window.removeEventListener("touchstart", onTouchStartSnap);
      if (onTouchEndSnap) window.removeEventListener("touchend", onTouchEndSnap);
      if (onHeroPointerMove) window.removeEventListener("pointermove", onHeroPointerMove);
      if (onHeroPointerLeave) window.removeEventListener("pointerleave", onHeroPointerLeave);
      introScrollTween?.kill();
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, { scope: rootRef });

  return (
    <div ref={rootRef}>
      <Header activePage={activePage} />
      <PageProgress activePage={activePage} />
      <VideoBackdrop frameRef={frameRef} />
      <main className="snap-container">
        <div className="intro-scroll-sequence">
          <Hero />
          <CareerScreen />
        </div>
        <SystemScreen />
        <CasesScreen />
        <WorksScreen />
        <VibeSiteScreen />
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
