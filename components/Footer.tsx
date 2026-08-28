"use client";

import Link from "next/link";
import { AGGREGATORS, CONTACT } from "@/lib/content";
import { useCart } from "@/lib/cart";
import {
  BagIcon,
  ChatIcon,
  FacebookIcon,
  GlobeIcon,
  HomeIcon,
  InstagramIcon,
  MenuIcon,
} from "./icons";

export default function Footer() {
  const { count, openCart } = useCart();

  return (
    <footer style={{ background: "var(--kc-primary)" }}>
      <div
        style={{
          padding: "clamp(18px,2vw,26px) clamp(16px,3.5vw,48px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          textAlign: "center",
          borderBottom: "1px solid var(--kc-primary-50)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--kc-font-display)",
            fontWeight: 700,
            fontSize: "clamp(22px,2.4vw,32px)",
            lineHeight: 1.05,
            color: "var(--kc-surface)",
            maxWidth: "22ch",
          }}
        >
          Order direct and skip the apps
        </h2>
        <p style={{ margin: 0, fontSize: 15, color: "var(--kc-surface)", opacity: 0.8, maxWidth: "46ch" }}>
          Same kitchen, same prices, no aggregator markup. Delivery across Dubai Marina until
          4:30 AM.
        </p>
        {count > 0 ? (
          <button
            onClick={openCart}
            className="kc-lift-2"
            style={{
              fontSize: 16,
              color: "var(--kc-text)",
              background: "var(--kc-gold)",
              border: "none",
              borderRadius: "var(--kc-radius)",
              padding: "12px 28px",
              cursor: "pointer",
            }}
          >
            Review your order · {count} item{count === 1 ? "" : "s"}
          </button>
        ) : (
          <Link
            href="/menu"
            className="kc-lift-2 kc-plain"
            style={{
              fontSize: 16,
              color: "var(--kc-text)",
              background: "var(--kc-gold)",
              borderRadius: "var(--kc-radius)",
              padding: "12px 28px",
              display: "inline-block",
            }}
          >
            Order from us
          </Link>
        )}
      </div>

      <div
        style={{
          padding: "clamp(16px,1.8vw,24px) clamp(16px,3.5vw,48px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 20,
        }}
      >
        <div>
          <div style={colLabel}>Navigate</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link href="/" className="kc-plain" style={footerLink}>
              <HomeIcon size={15} />
              Home
            </Link>
            <Link href="/menu" className="kc-plain" style={footerLink}>
              <MenuIcon size={15} />
              Menu
            </Link>
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener" className="kc-plain" style={footerLink}>
              <ChatIcon size={15} />
              Contact
            </a>
          </div>
        </div>

        <div>
          <div style={colLabel}>Follow Us</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <a href={CONTACT.instagram} target="_blank" rel="noopener" className="kc-plain" style={footerLink}>
              <InstagramIcon size={15} />
              Instagram
            </a>
            <a href={CONTACT.facebook} target="_blank" rel="noopener" className="kc-plain" style={footerLink}>
              <FacebookIcon />
              Facebook
            </a>
            <a href={CONTACT.googleReviews} target="_blank" rel="noopener" className="kc-plain" style={footerLink}>
              <GlobeIcon />
              Google Reviews
            </a>
          </div>
        </div>

        <div>
          <div style={colLabel}>Order Online</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {AGGREGATORS.map((name) => (
              <span key={name} style={{ ...footerLink, opacity: 0.55 }}>
                <BagIcon />
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "14px clamp(16px,3.5vw,48px)",
          borderTop: "1px solid var(--kc-primary-50)",
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--kc-surface)", opacity: 0.6 }}>
          © {new Date().getFullYear()} Kebab’s Crib. All rights reserved.
        </span>
        <span
          style={{
            fontFamily: "var(--kc-font-display)",
            fontSize: "clamp(14px,1.3vw,18px)",
            color: "var(--kc-surface)",
            opacity: 0.8,
          }}
        >
          Fast. Fresh. Fantastique
        </span>
      </div>
    </footer>
  );
}

const colLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: "var(--kc-surface)",
  opacity: 0.6,
  marginBottom: 10,
};

const footerLink: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 9,
  fontSize: 14,
  color: "var(--kc-surface)",
};
