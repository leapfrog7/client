import { useCallback, useEffect, useRef, useState } from "react";

const SWIPE_DIST = 48;
const SWIPE_ANGLE = 30;
const SWIPE_COOLDOWN = 350;
const SLIDE_MS = 200;

export default function useQuizInteractions({
  isSubmitted,
  currentQuestion,
  currentQuestionIndex,
  quizLength,
  handleOptionClick,
  handleBookmark,
  toggleFlag,
  clearSelection,
  toggleExplanation,
  goNext,
  goPrev,
}) {
  const pillRefs = useRef([]);
  const touchStart = useRef({ x: 0, y: 0, t: 0 });
  const touchCurr = useRef({ x: 0, y: 0 });
  const swipeCooldownRef = useRef(0);

  const [animState, setAnimState] = useState("idle");
  const [animDir, setAnimDir] = useState("left");

  const onTouchStart = useCallback((e) => {
    const t = e.touches?.[0];
    if (!t) return;
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    touchCurr.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchMove = useCallback((e) => {
    const t = e.touches?.[0];
    if (!t) return;
    touchCurr.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback(() => {
    if (Date.now() - swipeCooldownRef.current < SWIPE_COOLDOWN) return;

    const dx = touchCurr.current.x - touchStart.current.x;
    const dy = touchCurr.current.y - touchStart.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX < SWIPE_DIST) return;
    if (absY > absX * Math.tan((SWIPE_ANGLE * Math.PI) / 180)) return;

    if (dx < 0 && currentQuestionIndex < quizLength - 1) {
      goNext();
      swipeCooldownRef.current = Date.now();
    } else if (dx > 0 && currentQuestionIndex > 0) {
      goPrev();
      swipeCooldownRef.current = Date.now();
    }
  }, [currentQuestionIndex, quizLength, goNext, goPrev]);

  const animateNavigate = useCallback(
    (dir) => {
      if (dir > 0 && currentQuestionIndex >= quizLength - 1) return;
      if (dir < 0 && currentQuestionIndex <= 0) return;

      setAnimDir(dir > 0 ? "left" : "right");
      setAnimState("leaving");

      setTimeout(() => {
        if (dir > 0) goNext();
        else goPrev();

        setAnimDir(dir > 0 ? "right" : "left");
        setAnimState("entering");

        requestAnimationFrame(() => {
          setAnimState("idle");
        });
      }, SLIDE_MS);
    },
    [currentQuestionIndex, quizLength, goNext, goPrev],
  );

  const animateJumpTo = useCallback(
    (target, jumpTo) => {
      if (target === currentQuestionIndex) return;
      const dir = target > currentQuestionIndex ? 1 : -1;

      setAnimDir(dir > 0 ? "left" : "right");
      setAnimState("leaving");

      setTimeout(() => {
        jumpTo(target);
        setAnimDir(dir > 0 ? "right" : "left");
        setAnimState("entering");

        requestAnimationFrame(() => {
          setAnimState("idle");
        });
      }, SLIDE_MS);
    },
    [currentQuestionIndex],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;

    const el = pillRefs.current[currentQuestionIndex];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    const onKey = (e) => {
      if (isSubmitted) return;

      if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      } else if (["1", "2", "3", "4"].includes(e.key)) {
        const idx = Number(e.key) - 1;
        const opt = currentQuestion?.options?.[idx];
        if (opt) handleOptionClick(opt);
      } else if (e.key.toLowerCase() === "b") {
        handleBookmark();
      } else if (e.key.toLowerCase() === "f") {
        toggleFlag();
      } else if (e.key.toLowerCase() === "e") {
        toggleExplanation();
      } else if (e.key.toLowerCase() === "c") {
        clearSelection();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    isSubmitted,
    currentQuestion,
    handleOptionClick,
    handleBookmark,
    toggleFlag,
    toggleExplanation,
    clearSelection,
    goNext,
    goPrev,
  ]);

  const animClass = `
    transition-all duration-200 ease-out
    ${animState === "idle" ? "opacity-100 translate-x-0" : ""}
    ${animState === "leaving" && animDir === "left" ? "-translate-x-6 opacity-0" : ""}
    ${animState === "leaving" && animDir === "right" ? "translate-x-6 opacity-0" : ""}
    ${animState === "entering" && animDir === "left" ? "translate-x-6 opacity-0" : ""}
    ${animState === "entering" && animDir === "right" ? "-translate-x-6 opacity-0" : ""}
  `;

  return {
    pillRefs,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    animateNavigate,
    animateJumpTo,
    animClass,
  };
}
