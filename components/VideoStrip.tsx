"use client";

import { useEffect, useRef, useState } from "react";
import { VIDEOS } from "@/lib/content";
import { SoundOffIcon, SoundOnIcon } from "./icons";

/**
 * Autoplays each clip (muted) while it is at least 40% on screen and pauses it
 * otherwise, so scrolling past does not leave audio or decoding running.
 */
export default function VideoStrip() {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [sound, setSound] = useState<boolean[]>(() => VIDEOS.map(() => false));

  useEffect(() => {
    const videos = refs.current.filter(Boolean) as HTMLVideoElement[];
    videos.forEach((v) => {
      v.muted = true;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) void v.play().catch(() => {});
          else if (!v.paused) v.pause();
        }
      },
      { threshold: 0.4 },
    );
    videos.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, []);

  const toggleSound = (i: number) => {
    const v = refs.current[i];
    if (!v) return;
    v.muted = !v.muted;
    void v.play().catch(() => {});
    setSound((prev) => prev.map((on, j) => (j === i ? !v.muted : on)));
  };

  return (
    <section style={{ padding: "clamp(32px,4vw,64px) clamp(16px,3.5vw,48px)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: 24,
        }}
      >
        {VIDEOS.map((v, i) => (
          <div key={v.caption}>
            <div
              style={{
                position: "relative",
                borderRadius: "var(--kc-radius)",
                overflow: "hidden",
                background: "var(--kc-text)",
                aspectRatio: "16/9",
              }}
            >
              <video
                ref={(el) => {
                  refs.current[i] = el;
                }}
                onClick={() => toggleSound(i)}
                muted
                loop
                playsInline
                preload="metadata"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  cursor: "pointer",
                }}
              >
                <source src={v.src} type="video/mp4" />
              </video>
              <button
                onClick={() => toggleSound(i)}
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,.92)",
                  border: "none",
                  borderRadius: "var(--kc-radius-sm)",
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--kc-primary)",
                }}
              >
                {sound[i] ? <SoundOnIcon /> : <SoundOffIcon />}
                {sound[i] ? "Sound on" : "Tap for sound"}
              </button>
            </div>
            <div
              style={{
                fontFamily: "var(--kc-font-display)",
                fontWeight: 400,
                fontSize: "clamp(16px,1.5vw,18px)",
                color: "var(--kc-primary-60)",
                marginTop: 12,
              }}
            >
              {v.caption}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
