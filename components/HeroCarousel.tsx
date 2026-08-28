"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES } from "@/lib/content";
import { ChevronLeft, ChevronRight } from "./icons";

const ROTATE_MS = 5000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(0);

  const go = useCallback((next: number) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section
      aria-label="Featured dishes"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      }}
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(420px, 42vw, 640px)",
        overflow: "hidden",
        background: "var(--kc-text)",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          transition: "transform 600ms ease-out",
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {SLIDES.map((s, i) => (
          <div key={s.name} style={{ position: "relative", minWidth: "100%", height: "100%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.img}
              alt={s.name}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg,rgba(36,36,36,.72) 0%,rgba(36,36,36,.35) 55%,rgba(36,36,36,.15) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 16,
                padding: "0 clamp(20px,5vw,72px)",
                maxWidth: "min(680px, 80%)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--kc-font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(15px,1.7vw,24px)",
                  color: "var(--kc-surface)",
                  opacity: 0.85,
                }}
              >
                {s.kicker}
              </span>
              <span
                style={{
                  fontFamily: "var(--kc-font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(30px,3.4vw,48px)",
                  lineHeight: 1.05,
                  color: "var(--kc-surface)",
                }}
              >
                {s.name}
              </span>
              <div>
                <Link
                  href={`/menu?dish=${encodeURIComponent(s.dish)}`}
                  className="kc-dark kc-plain"
                  style={{
                    fontSize: 16,
                    color: "var(--kc-surface)",
                    background: "var(--kc-primary)",
                    borderRadius: "var(--kc-radius)",
                    padding: "14px 24px",
                    display: "inline-block",
                    transition: "background var(--kc-motion)",
                  }}
                >
                  Order now — AED {s.price}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => go(index - 1)} aria-label="Previous slide" style={{ ...arrow, left: 16 }}>
        <ChevronLeft />
      </button>
      <button onClick={() => go(index + 1)} aria-label="Next slide" style={{ ...arrow, right: 16 }}>
        <ChevronRight />
      </button>

      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {SLIDES.map((s, i) => (
          <button
            key={s.name}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            style={{
              width: i === index ? 28 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              padding: 0,
              background: i === index ? "#FFFFFF" : "rgba(255,255,255,.5)",
              cursor: "pointer",
              transition: "all var(--kc-motion)",
            }}
          />
        ))}
      </div>
    </section>
  );
}

const arrow: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: 44,
  height: 44,
  borderRadius: "50%",
  border: "none",
  background: "rgba(255,255,255,.9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  padding: 0,
};
