import React from "react";
import "./GlitchText.css";

export default function GlitchText({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = true,
  className = "",
}) {
  const inlineStyles = {
    "--after-duration": `${speed * 3}s`,
    "--before-duration": `${speed * 2}s`,
    "--after-shadow": enableShadows ? "-3px 0 rgba(135, 174, 204, 0.9)" : "none",
    "--before-shadow": enableShadows ? "3px 0 rgba(226, 238, 244, 0.72)" : "none",
  };

  return (
    <span
      className={`glitch-text ${enableOnHover ? "enable-on-hover" : ""} ${className}`.trim()}
      style={inlineStyles}
      data-text={children}
    >
      {children}
    </span>
  );
}
