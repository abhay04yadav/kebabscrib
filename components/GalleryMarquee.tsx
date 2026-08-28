"use client";

import { useEffect, useState } from "react";
import { GALLERY } from "@/lib/content";

export default function GalleryMarquee() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox]);

  // doubled so the -50% marquee loop is seamless
  const strip = GALLERY.concat(GALLERY);

  return (
    <section style={{ padding: "clamp(32px,4vw,64px) 0", overflow: "hidden" }}>
      <div style={{ padding: "0 clamp(16px,3.5vw,48px)", marginBottom: 24 }}>
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--kc-font-display)",
            fontWeight: 400,
            fontSize: "clamp(18px,1.7vw,24px)",
            color: "var(--kc-primary-70)",
          }}
        >
          Inside the Crib
        </h2>
      </div>
      <div className="kc-marquee" style={{ width: "100%", overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            gap: 16,
            width: "max-content",
            animation: "kcMarquee 42s linear infinite",
          }}
        >
          {strip.map((g, i) => (
            <button
              key={g.alt + i}
              onClick={() => setLightbox(g.img)}
              className="kc-zoom"
              aria-label={`Open ${g.alt}`}
              style={{
                width: "clamp(220px,26vw,360px)",
                aspectRatio: "4/3",
                borderRadius: "var(--kc-radius)",
                overflow: "hidden",
                cursor: "zoom-in",
                flex: "none",
                padding: 0,
                border: "none",
                background: "transparent",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.img}
                alt={g.alt}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 70,
            background: "rgba(36,36,36,.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            cursor: "zoom-out",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Gallery image"
            style={{
              maxWidth: "92%",
              maxHeight: "88%",
              borderRadius: "var(--kc-radius)",
              display: "block",
            }}
          />
        </div>
      )}
    </section>
  );
}
