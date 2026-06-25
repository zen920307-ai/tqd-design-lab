import React, { createElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import "./TextType.css";

export default function TextType({
  text,
  as: Component = "div",
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef(null);
  const containerRef = useRef(null);
  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    }, { threshold: 0.1 });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!showCursor || !cursorRef.current) return undefined;
    gsap.set(cursorRef.current, { opacity: 1 });
    const tween = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: cursorBlinkDuration,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });
    return () => tween.kill();
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!isVisible) return undefined;

    let timeout;
    const currentText = textArray[currentTextIndex] ?? "";
    const processedText = reverseMode ? currentText.split("").reverse().join("") : currentText;

    const typeNext = () => {
      if (isDeleting) {
        if (displayedText === "") {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) return;
          onSentenceComplete?.(textArray[currentTextIndex], currentTextIndex);
          setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
        } else {
          timeout = window.setTimeout(() => setDisplayedText((prev) => prev.slice(0, -1)), deletingSpeed);
        }
        return;
      }

      if (currentCharIndex < processedText.length) {
        timeout = window.setTimeout(() => {
          setDisplayedText((prev) => prev + processedText[currentCharIndex]);
          setCurrentCharIndex((prev) => prev + 1);
        }, variableSpeed ? getRandomSpeed() : typingSpeed);
      } else if (textArray.length >= 1) {
        if (!loop && currentTextIndex === textArray.length - 1) return;
        timeout = window.setTimeout(() => setIsDeleting(true), pauseDuration);
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === "") {
      timeout = window.setTimeout(typeNext, initialDelay);
    } else {
      typeNext();
    }

    return () => window.clearTimeout(timeout);
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    initialDelay,
    isVisible,
    reverseMode,
    variableSpeed,
    onSentenceComplete,
    getRandomSpeed,
  ]);

  const shouldHideCursor = hideCursorWhileTyping && (currentCharIndex < (textArray[currentTextIndex] ?? "").length || isDeleting);
  const color = textColors.length ? textColors[currentTextIndex % textColors.length] : "inherit";
  const componentProps = {
    ref: containerRef,
    className: `text-type ${className}`.trim(),
    ...props,
  };

  return createElement(
    Component,
    componentProps,
    <span className="text-type__content" style={{ color }}>{displayedText}</span>,
    showCursor && (
      <span ref={cursorRef} className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? "text-type__cursor--hidden" : ""}`}>
        {cursorCharacter}
      </span>
    )
  );
}
