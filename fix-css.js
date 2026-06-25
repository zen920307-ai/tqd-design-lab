const fs = require("fs");
const c = fs.readFileSync("styles.css", "utf8");

// Extract everything BEFORE the first @media (max-width: 980px) block
// This is the clean original CSS content
const first980 = c.indexOf("@media (max-width: 980px) {");
const cleanContent = c.substring(0, first980);

// Mobile enhancements as properly-structured independent top-level media queries
const mobileEnhancements = `
/* ===== MOBILE ENHANCEMENTS ===== */

@media (max-width: 980px) {
  html {
    scroll-snap-type: none;
  }

  .snap-section {
    height: auto;
    min-height: 100vh;
  }

  .site-header {
    grid-template-columns: auto 1fr auto;
    width: calc(100% - 20px);
    padding: 8px 12px;
  }

  .site-header nav {
    display: none;
  }

  .mobile-nav-toggle {
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    padding: 6px;
    cursor: pointer;
    background: transparent;
    border: 0;
    border-radius: 8px;
    position: relative;
    z-index: 50;
  }
  .mobile-nav-toggle span {
    display: block;
    width: 22px;
    height: 2px;
    background: rgba(244, 246, 248, 0.8);
    border-radius: 2px;
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform-origin: center;
  }
  .mobile-nav-toggle.active span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .mobile-nav-toggle.active span:nth-child(2) {
    opacity: 0;
  }
  .mobile-nav-toggle.active span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .mobile-nav-overlay {
    position: fixed;
    inset: 0;
    z-index: 45;
    display: none;
    place-items: center;
    background: rgba(2, 3, 5, 0.94);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  .mobile-nav-overlay.open {
    display: grid;
  }
  .mobile-nav-overlay nav {
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: center;
    text-align: center;
  }
  .mobile-nav-overlay nav a {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: rgba(244, 246, 248, 0.9);
    text-decoration: none;
    line-height: 1.2;
  }
  .mobile-nav-overlay nav a span {
    display: block;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.14em;
    color: rgba(244, 246, 248, 0.45);
    margin-top: 4px;
  }

  .page-progress {
    display: none;
  }

  .hero-title > .hero-title-line {
    font-size: clamp(36px, 11vw, 80px);
  }
  .hero-title {
    top: 90px;
    left: 16px;
    right: 16px;
  }
  .hero-cluster {
    top: 20vh;
    width: 130vw;
    opacity: 0.6;
  }
  .hero-identity {
    max-width: 250px;
    bottom: 40px;
    left: 16px;
  }
  .hero-identity h1 {
    font-size: clamp(1.4rem, 5vw, 2.5rem);
  }
  .hero-identity small {
    font-size: 11px;
    line-height: 1.6;
  }
  .round-cta {
    width: 130px;
    height: 130px;
    right: 6%;
    bottom: 6%;
  }
  .round-cta-text {
    width: 106px;
    font-size: 16px;
  }
  .round-cta-text .glitch-text {
    font-size: 16px;
  }
  .corner-meta {
    font-size: 8px;
  }

  .career-screen {
    display: flex;
    flex-direction: column;
    padding-top: 100px;
    padding-bottom: 36px;
  }
  .career-left {
    width: 100%;
    margin-bottom: 20px;
  }
  .career-copy {
    margin-bottom: 24px;
    max-width: 100%;
  }
  .career-copy h2 {
    font-size: clamp(1.3rem, 5vw, 2rem);
  }
  .career-copy p {
    font-size: 14px;
    line-height: 1.7;
  }
  .career-nav {
    display: flex;
    flex-direction: column;
    height: auto;
    border-top: 1px solid var(--line);
    margin-top: 8px;
  }
  .career-card {
    grid-template-columns: 50px 1fr;
    gap: 10px;
    padding: 14px 0;
  }
  .career-card p {
    display: none;
  }
  .career-detail {
    grid-column: 1;
    grid-row: auto;
    max-width: none;
    height: auto;
  }
  .career-detail .border-glow-inner {
    padding: 24px 20px;
  }
  .career-detail h3 {
    font-size: clamp(1.1rem, 4vw, 1.6rem);
  }
  .career-detail p {
    font-size: 14px;
    line-height: 1.7;
  }

  .system-row > button {
    grid-template-columns: 48px 1fr auto;
    gap: 8px;
    padding: 0 12px;
    min-height: 56px;
  }
  .system-row > button h3 {
    font-size: clamp(1rem, 3vw, 1.3rem);
  }
  .system-row > button strong {
    font-size: 24px;
  }
  .system-row > button span {
    display: none;
  }
  .system-detail-inline {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 10px 12px;
  }
  .system-masonry-panel {
    max-height: 300px;
  }

  .case-stage {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .case-index {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    gap: 6px;
    flex-wrap: nowrap;
  }
  .case-index button {
    flex: 0 0 auto;
    padding: 8px 12px;
    border-bottom: 0;
    border-radius: 8px;
    border: 1px solid var(--line);
    text-align: center;
  }
  .case-index button.active {
    border-color: rgba(196, 214, 220, 0.46);
  }
  .case-index strong {
    font-size: 22px !important;
  }
  .case-index em {
    font-size: 8px;
  }
  .case-metrics {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 10px;
  }
  .case-metric-card {
    padding: 14px;
  }
  .case-metric-card strong {
    font-size: clamp(1.5rem, 4vw, 2rem);
  }

  .works-screen h2 {
    max-width: 100%;
    white-space: normal;
    font-size: clamp(1.1rem, 3.5vw, 1.6rem);
    letter-spacing: -0.01em;
  }
  .circular-work-viewport {
    width: calc(100% + 20px);
    min-height: 220px;
    margin-right: -10px;
    margin-left: -10px;
  }
  .circular-work-row {
    padding: 0 20px;
  }

  .vibe-player {
    width: calc(100% - 28px);
    margin-top: 40px;
  }
  .vibe-copy h2 {
    white-space: normal;
    font-size: clamp(1.1rem, 4vw, 1.6rem);
  }
  .vibe-copy p:nth-of-type(2) {
    white-space: normal;
  }
  .vibe-copy p {
    font-size: 13px;
    line-height: 1.7;
  }
  .vibe-tags {
    gap: 6px;
    margin-top: 16px;
  }
  .vibe-tags span {
    font-size: 10px;
    padding: 6px 10px;
  }

  .project-modal {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 16px;
    top: 72px;
  }
  .modal-close {
    top: 10px;
    right: 14px;
  }
  .project-gallery-column {
    max-height: 35vh;
  }
  .project-copy-panel {
    padding: 20px 14px;
  }
  .project-copy-panel h2 {
    font-size: clamp(1.3rem, 4vw, 2rem);
  }

  .profile-drop {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 580px;
  }

  .panel-head {
    font-size: 10px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .project-image-preview {
    inset: 12px;
  }
  .lightbox {
    inset: 12px;
  }
  .lightbox-close {
    top: 14px;
    right: 16px;
  }
}

@media (max-width: 480px) {
  .site-header {
    width: calc(100% - 12px);
    padding: 6px 10px;
  }
  .brand {
    width: 36px;
    height: 22px;
    margin-left: 4px;
  }
  .mobile-nav-toggle {
    width: 34px;
    height: 34px;
  }
  .mobile-nav-toggle span {
    width: 18px;
    height: 1.5px;
  }
  .hero-title > .hero-title-line {
    font-size: clamp(32px, 11vw, 52px);
  }
  .hero-title {
    top: 80px;
  }
  .hero-cluster {
    top: 16vh;
    width: 160vw;
    opacity: 0.5;
  }
  .hero-identity {
    max-width: 200px;
    bottom: 32px;
    left: 12px;
  }
  .hero-identity h1 {
    font-size: clamp(1.3rem, 6vw, 2rem);
  }
  .hero-identity span {
    font-size: 10px;
  }
  .hero-identity small {
    font-size: 10px;
    margin-top: 8px;
  }
  .round-cta {
    width: 120px;
    height: 120px;
  }
  .round-cta-text {
    width: 96px;
    font-size: 15px;
  }
  .career-card {
    grid-template-columns: 48px 1fr;
  }
  .career-card h3 {
    font-size: clamp(1.1rem, 3.5vw, 1.5rem);
  }
  .career-card p {
    display: none;
  }
  .case-index button {
    padding: 6px 10px;
  }
  .case-index strong {
    font-size: 24px !important;
  }
  .case-index em {
    font-size: 7px;
    display: none;
  }
  .system-row > button {
    grid-template-columns: 44px 1fr auto;
    padding: 0 10px;
    min-height: 50px;
  }
  .system-row > button strong {
    font-size: 20px;
  }
  .system-row > button h3 {
    font-size: 0.95rem;
  }
  .profile-drop {
    width: calc(100vw - 24px);
    left: 12px;
    transform: none;
  }
  .vibe-player {
    width: calc(100% - 20px);
    padding: 8px;
    margin-top: 40px;
  }
}

@media (max-width: 980px) and (orientation: landscape) {
  .snap-section {
    min-height: 100vh;
  }
  .hero-screen {
    padding-top: 50px;
  }
  .career-screen {
    padding-top: 70px;
    padding-bottom: 20px;
  }
  .round-cta {
    width: 110px;
    height: 110px;
    right: 6%;
    bottom: 4%;
  }
  .hero-identity {
    max-width: 35vw;
  }
  .profile-drop {
    height: 460px;
  }
  .career-copy {
    margin-bottom: 32px;
  }
  .vibe-player {
    margin-top: 28px;
  }
}

@media (max-width: 980px) and (orientation: landscape) and (max-height: 480px) {
  .hero-cluster {
    top: 6vh;
  }
  .hero-title {
    top: 52px;
  }
  .hero-title > .hero-title-line {
    font-size: clamp(28px, 7vw, 40px);
  }
  .hero-identity {
    bottom: 8px;
    max-width: 38vw;
  }
  .round-cta {
    width: 80px;
    height: 80px;
    bottom: 2%;
  }
  .round-cta-text {
    font-size: 13px;
    width: 66px;
  }
  .career-screen {
    padding-top: 50px;
  }
  .vibe-player {
    margin-top: 12px;
  }
}

/* JS-driven class-based fallbacks */
.mobile-view .hero-cluster {
  opacity: 0.5;
}
.mobile-view .hero-title > .hero-title-line {
  font-size: clamp(36px, 11vw, 80px);
}
.small-view .hero-identity {
  max-width: 180px;
}
.small-view .round-cta {
  width: 100px;
  height: 100px;
}
`;

const newContent = cleanContent + mobileEnhancements;
fs.writeFileSync("styles.css", newContent);

// Verify brace balance
const open = (newContent.match(/{/g) || []).length;
const close = (newContent.match(/}/g) || []).length;
console.log("Open:", open, "Close:", close, "Diff:", open - close);
console.log("New file length:", newContent.length);
