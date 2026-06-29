"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  type?: "words" | "chars" | "lines";
  stagger?: number;
  duration?: number;
  delay?: number;
  start?: string;
  scrub?: boolean;
  y?: number;
}

export default function TextReveal({
  children,
  className = "",
  tag: Tag = "p",
  type = "words",
  stagger = 0.03,
  duration = 0.8,
  delay = 0,
  start = "top 85%",
  scrub = false,
  y = 40,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Split text into elements
    const text = el.textContent || "";
    let items: string[];

    if (type === "chars") {
      items = text.split("");
    } else if (type === "words") {
      items = text.split(/\s+/);
    } else {
      items = [text];
    }

    // Create spans
    el.innerHTML = items
      .map(
        (item) =>
          `<span class="split-line"><span class="split-${
            type === "chars" ? "char" : "word"
          }" style="display:inline-block">${item}</span></span>${
            type === "words" ? " " : ""
          }`
      )
      .join("");

    const spans = el.querySelectorAll(
      `.split-${type === "chars" ? "char" : "word"}`
    );

    gsap.set(spans, { y, opacity: 0 });

    const anim = gsap.to(spans, {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start,
        scrub: scrub ? 1 : false,
        toggleActions: scrub ? undefined : "play none none none",
      },
    });

    return () => {
      anim.kill();
      // Restore original text
      el.textContent = text;
    };
  }, [children, type, stagger, duration, delay, start, scrub, y]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={containerRef as any} className={className}>
      {children}
    </Tag>
  );
}
