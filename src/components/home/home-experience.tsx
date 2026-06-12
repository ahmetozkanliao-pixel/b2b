"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { ChapterNav } from "@/components/home/chapter-nav";
import { HOME_CHAPTERS } from "@/lib/home-chapters";

interface HomeExperienceProps {
  children: React.ReactNode;
}

function resolveActiveChapter() {
  const marker = window.innerHeight * 0.35;
  let current = HOME_CHAPTERS[0].id;

  for (const chapter of HOME_CHAPTERS) {
    const element = document.getElementById(chapter.id);
    if (!element) continue;
    if (element.getBoundingClientRect().top <= marker) {
      current = chapter.id;
    }
  }

  return current;
}

export function HomeExperience({ children }: HomeExperienceProps) {
  const [activeId, setActiveId] = useState(HOME_CHAPTERS[0].id);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const updateActive = () => setActiveId(resolveActiveChapter());

    updateActive();
    window.addEventListener("resize", updateActive, { passive: true });

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      window.addEventListener("scroll", updateActive, { passive: true });
      return () => {
        window.removeEventListener("scroll", updateActive);
        window.removeEventListener("resize", updateActive);
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: false,
    });

    document.documentElement.classList.add("lenis", "lenis-smooth");
    lenisRef.current = lenis;

    let frame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    lenis.on("scroll", updateActive);

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, { offset: 0 });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onAnchorClick);
      lenis.off("scroll", updateActive);
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(element, { offset: 0 });
      return;
    }

    element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-experience w-full overflow-x-hidden">
      <ChapterNav
        chapters={HOME_CHAPTERS}
        activeId={activeId}
        onNavigate={handleNavigate}
      />
      {children}
    </div>
  );
}
