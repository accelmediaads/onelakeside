"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FadeInProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  distance?: number;
  start?: string;
  stagger?: number;
  scale?: number;
}

export default function FadeIn({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.8,
  distance = 60,
  start = "top 85%",
  stagger = 0,
  scale = 1,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger > 0 ? el.children : el;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      scale,
    };

    if (direction === "up") fromVars.y = distance;
    if (direction === "down") fromVars.y = -distance;
    if (direction === "left") fromVars.x = distance;
    if (direction === "right") fromVars.x = -distance;

    gsap.set(targets, fromVars);

    const anim = gsap.to(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration,
      delay,
      stagger: stagger || 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
      },
    });

    return () => {
      anim.kill();
    };
  }, [direction, delay, duration, distance, start, stagger, scale]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
