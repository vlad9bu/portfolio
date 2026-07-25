"use client";

import { useEffect, useState } from "react";
import styles from "./minimal.module.css";

export function MotionController() {
  const [inverted, setInverted] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".minimal-page");
    if (!root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const revealElements = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const sectionElements = Array.from(
      root.querySelectorAll<HTMLElement>("section[id]"),
    );
    const navLinks = Array.from(
      root.querySelectorAll<HTMLAnchorElement>("header nav a"),
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            revealObserver.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    for (const element of revealElements) {
      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0) {
        element.dataset.visible = "true";
      } else {
        revealObserver.observe(element);
      }
    }
    root.dataset.motion = "ready";

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!activeEntry) return;

        const activeId = activeEntry.target.id;
        for (const link of navLinks) {
          link.dataset.active =
            link.getAttribute("href") === `#${activeId}` ? "true" : "false";
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.2, 0.6] },
    );

    for (const section of sectionElements) {
      sectionObserver.observe(section);
    }

    let frame = 0;
    const updateScrollMotion = () => {
      frame = 0;
      const scrollRange =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollRange > 0 ? window.scrollY / scrollRange : 0;
      const heroTravel = Math.min(window.scrollY, window.innerHeight);
      const principle = root.querySelector<HTMLElement>("[data-principle]");

      root.style.setProperty("--scroll-progress", progress.toFixed(4));
      root.style.setProperty(
        "--vlad-shift",
        `${Math.round(heroTravel * -0.055)}px`,
      );
      root.style.setProperty(
        "--budko-shift",
        `${Math.round(heroTravel * 0.075)}px`,
      );
      root.style.setProperty(
        "--portrait-shift",
        `${Math.round(heroTravel * 0.035)}px`,
      );

      if (principle) {
        const rect = principle.getBoundingClientRect();
        const localProgress = Math.max(
          0,
          Math.min(1, 1 - rect.top / window.innerHeight),
        );
        root.style.setProperty(
          "--principle-shift",
          `${Math.round((localProgress - 0.5) * 42)}px`,
        );
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollMotion);
    };

    updateScrollMotion();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const tiltCleanups: Array<() => void> = [];
    if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
      const tiltElements = Array.from(
        root.querySelectorAll<HTMLElement>("[data-tilt]"),
      );

      for (const element of tiltElements) {
        const onPointerMove = (event: PointerEvent) => {
          const bounds = element.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          element.style.setProperty("--tilt-x", `${(-y * 2.4).toFixed(2)}deg`);
          element.style.setProperty("--tilt-y", `${(x * 2.4).toFixed(2)}deg`);
        };
        const onPointerLeave = () => {
          element.style.setProperty("--tilt-x", "0deg");
          element.style.setProperty("--tilt-y", "0deg");
        };

        element.addEventListener("pointermove", onPointerMove);
        element.addEventListener("pointerleave", onPointerLeave);
        tiltCleanups.push(() => {
          element.removeEventListener("pointermove", onPointerMove);
          element.removeEventListener("pointerleave", onPointerLeave);
        });
      }
    }

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      for (const cleanup of tiltCleanups) cleanup();
    };
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".minimal-page");
    if (root) root.dataset.theme = inverted ? "dark" : "light";
  }, [inverted]);

  return (
    <>
      <button
        className={styles.modeToggle}
        type="button"
        aria-label="Invert the minimal edition color mode"
        aria-pressed={inverted}
        onClick={() => setInverted((current) => !current)}
      >
        <span>Invert</span>
        <i aria-hidden="true" />
      </button>
      <span className={styles.scrollProgress} aria-hidden="true" />
    </>
  );
}

export function ContextSystemCard() {
  const [open, setOpen] = useState(false);

  return (
    <article
      className={`${styles.systemCard} ${styles.contextCard}`}
      data-open={open ? "true" : "false"}
      data-reveal
      data-tilt
    >
      <span>Private / Daily use</span>
      <h2>Context OS</h2>
      <p>
        My personal AI operating system connecting calendar, projects, working
        context, and daily decisions into one assistant.
      </p>
      <button
        className={styles.contextToggle}
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "Close system map" : "Open system map"}
        <b aria-hidden="true">{open ? "−" : "+"}</b>
      </button>
      <div className={styles.contextMap} aria-hidden={!open}>
        <span>01 / Calendar</span>
        <span>02 / Projects</span>
        <span>03 / Context</span>
        <span>04 / Assistant</span>
      </div>
    </article>
  );
}
