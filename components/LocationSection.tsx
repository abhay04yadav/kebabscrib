"use client";

import { useEffect, useState } from "react";
import { CONTACT } from "@/lib/content";
import { shopStatus, type ShopStatus } from "@/lib/hours";
import { PinIcon, WhatsAppIcon } from "./icons";

export default function LocationSection() {
  const [status, setStatus] = useState<ShopStatus | null>(null);
  useEffect(() => {
    setStatus(shopStatus());
    const t = setInterval(() => setStatus(shopStatus()), 60_000);
    return () => clearInterval(t);
  }, []);

  const open = status?.isOpen ?? true;
  const weekend = status?.weekend ?? false;
  const statusText = open ? "#006244" : "rgba(0,98,68,.6)";
  const statusBg = open ? "var(--kc-gold)" : "#FFFFFF";
  const statusDot = open ? "#006244" : "rgba(0,98,68,.4)";

  return (
    <section id="location" style={{ padding: "clamp(32px,4vw,64px) clamp(16px,3.5vw,48px)", scrollMarginTop: 100 }}>
      <h2
        style={{
          margin: "0 0 28px",
          fontFamily: "var(--kc-font-display)",
          fontWeight: 700,
          fontSize: "clamp(26px,3.4vw,48px)",
          lineHeight: 1.05,
          color: "var(--kc-primary)",
        }}
      >
        In the Heart of Dubai Marina
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: 24,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            minHeight: 340,
            border: "1px solid var(--kc-border)",
            borderRadius: "var(--kc-radius)",
            overflow: "hidden",
            background: "var(--kc-surface)",
          }}
        >
          <iframe
            src={CONTACT.mapEmbed}
            title="Kebab’s Crib on Google Maps"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, display: "block" }}
          />
          <a
            href={CONTACT.directions}
            target="_blank"
            rel="noopener"
            className="kc-plain"
            style={{
              position: "absolute",
              left: 14,
              bottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 13,
              color: "var(--kc-primary)",
              background: "var(--kc-surface)",
              borderRadius: 20,
              padding: "9px 15px",
              boxShadow: "0 8px 20px rgba(36,36,36,.18)",
            }}
          >
            <PinIcon />
            Get directions
          </a>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={card}>
            <div style={cardLabel}>Address</div>
            <div style={{ fontSize: 16, lineHeight: 1.5 }}>{CONTACT.address}</div>
          </div>

          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <div style={{ ...cardLabel, marginBottom: 0 }}>Hours</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: statusBg,
                  border: "1px solid var(--kc-primary)",
                  borderRadius: "var(--kc-radius-sm)",
                  padding: "5px 10px",
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusDot }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: statusText }}>
                  {status?.label ?? "Sun–Thu 11:30 AM – 4:30 AM"}
                </span>
              </div>
            </div>
            <div style={hoursRow(!weekend)}>
              <span style={{ fontSize: 14, fontWeight: weekend ? 400 : 700 }}>Sun – Thu</span>
              <span style={{ fontSize: 14, fontWeight: weekend ? 400 : 700 }}>11:30 AM – 4:30 AM</span>
            </div>
            <div style={hoursRow(weekend)}>
              <span style={{ fontSize: 14, fontWeight: weekend ? 700 : 400 }}>Fri – Sat</span>
              <span style={{ fontSize: 14, fontWeight: weekend ? 700 : 400 }}>11:30 AM – 4:45 AM</span>
            </div>
          </div>

          <div style={card}>
            <div style={cardLabel}>Contact</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16, flexWrap: "wrap" }}>
              <a href={CONTACT.phoneHref} style={{ color: "var(--kc-text)" }}>
                {CONTACT.phoneLabel}
              </a>
              <span style={{ color: "var(--kc-primary-40)" }}>·</span>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener"
                style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 16, fontWeight: 700 }}
              >
                <WhatsAppIcon />
                WhatsApp
              </a>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href={CONTACT.directions}
              target="_blank"
              rel="noopener"
              className="kc-dark kc-plain"
              style={{
                flex: "1 1 150px",
                textAlign: "center",
                fontSize: 16,
                color: "var(--kc-surface)",
                background: "var(--kc-primary)",
                borderRadius: "var(--kc-radius)",
                padding: "14px 20px",
                transition: "background var(--kc-motion)",
              }}
            >
              Get Directions
            </a>
            <a
              href={CONTACT.phoneHref}
              className="kc-soft kc-plain"
              style={{
                flex: "1 1 150px",
                textAlign: "center",
                fontSize: 16,
                color: "var(--kc-primary)",
                background: "var(--kc-surface)",
                border: "1px solid var(--kc-primary)",
                borderRadius: "var(--kc-radius)",
                padding: "14px 20px",
              }}
            >
              Call now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const card: React.CSSProperties = {
  background: "var(--kc-surface)",
  border: "1px solid var(--kc-border)",
  borderRadius: "var(--kc-radius)",
  padding: "20px 24px",
};

const cardLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: "var(--kc-primary-40)",
  marginBottom: 8,
};

const hoursRow = (active: boolean): React.CSSProperties => ({
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  padding: "10px 12px",
  borderRadius: "var(--kc-radius-sm)",
  background: active ? "rgba(0,98,68,.08)" : "transparent",
});
