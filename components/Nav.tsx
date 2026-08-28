"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { shopStatus, type ShopStatus } from "@/lib/hours";
import {
  BurgerIcon,
  CartIcon,
  ChatIcon,
  ClockIcon,
  HomeIcon,
  InstagramIcon,
  MenuIcon,
  TruckIcon,
} from "./icons";

const LOGO = "https://www.kebabscrib.ae/assets/Kebabs%20Crib%20Logo%20Website.png";
const INSTAGRAM = "https://www.instagram.com/kebabscrib";
const WHATSAPP = "https://wa.me/97144318050";

/** Shrink the nav once the page has scrolled past the fold edge. */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

/** Hours are clock-dependent, so resolve them after mount to keep SSR stable. */
function useShopStatus(): ShopStatus | null {
  const [status, setStatus] = useState<ShopStatus | null>(null);
  useEffect(() => {
    setStatus(shopStatus());
    const t = setInterval(() => setStatus(shopStatus()), 60_000);
    return () => clearInterval(t);
  }, []);
  return status;
}

function CartButton({ mobile = false }: { mobile?: boolean }) {
  const { count, openCart } = useCart();
  return (
    <button
      onClick={openCart}
      aria-label={count ? `Open cart, ${count} items` : "Open cart"}
      className="kc-lift"
      style={{
        position: "relative",
        width: 44,
        height: 44,
        border: "none",
        borderRadius: mobile ? "var(--kc-radius)" : 22,
        background: "var(--kc-surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <CartIcon size={mobile ? 18 : 20} />
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: mobile ? -4 : -6,
            right: mobile ? -4 : -6,
            minWidth: mobile ? 18 : 20,
            height: mobile ? 18 : 20,
            borderRadius: 10,
            background: "var(--kc-accent)",
            color: "var(--kc-text)",
            fontSize: mobile ? 10 : 11,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: mobile ? "0 5px" : "0 6px",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

const linkStyle = (active: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 7,
  fontSize: 16,
  color: active ? "var(--kc-primary)" : "var(--kc-text)",
  fontWeight: active ? 700 : 400,
  borderBottom: active ? "2px solid var(--kc-primary)" : "2px solid transparent",
  paddingBottom: 2,
  textDecoration: "none",
});

export default function Nav({ active }: { active: "home" | "menu" }) {
  const scrolled = useScrolled();
  const status = useShopStatus();
  const [moreOpen, setMoreOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [moreOpen]);

  const statusLabel = status?.label ?? "Sun–Thu 11:30 AM – 4:30 AM";
  const statusOpen = status?.isOpen ?? true;
  const statusText = statusOpen ? "#006244" : "rgba(0,98,68,.6)";
  const statusBg = statusOpen ? "var(--kc-gold)" : "#FFFFFF";
  const statusDot = statusOpen ? "#006244" : "rgba(0,98,68,.4)";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "var(--kc-nav)",
        boxShadow: "0 4px 16px rgba(36,36,36,.12)",
      }}
    >
      {/* ---------- desktop ---------- */}
      <div
        className="kc-nav-desktop"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 16,
          padding: "0 32px",
          height: scrolled ? 60 : 92,
          transition: "height var(--kc-motion)",
        }}
      >
        <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <Link href="/" style={linkStyle(active === "home")} className="kc-plain">
            <HomeIcon />
            Home
          </Link>
          <Link href="/menu" style={linkStyle(active === "menu")} className="kc-plain">
            <MenuIcon />
            Menu
          </Link>
        </nav>

        <Link href="/" aria-label="Kebab’s Crib home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO}
            alt="Kebab’s Crib"
            style={{
              height: scrolled ? 42 : 72,
              width: "auto",
              objectFit: "contain",
              display: "block",
              transition: "height var(--kc-motion)",
            }}
          />
        </Link>

        <div style={{ display: "flex", gap: 14, alignItems: "center", justifyContent: "flex-end" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: statusBg,
              border: "1px solid var(--kc-primary)",
              borderRadius: 20,
              padding: "6px 13px",
              whiteSpace: "nowrap",
            }}
          >
            <ClockIcon stroke={statusText} />
            <span style={{ fontSize: 12.5, fontWeight: 500, color: statusText, whiteSpace: "nowrap" }}>
              {statusLabel}
            </span>
          </div>

          <CartButton />

          <div style={{ position: "relative" }} ref={moreRef}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              className="kc-lift"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 44,
                padding: "0 16px",
                border: "none",
                borderRadius: 22,
                background: "var(--kc-surface)",
                cursor: "pointer",
              }}
            >
              <BurgerIcon />
              <span style={{ fontSize: 15, color: "var(--kc-primary)", fontWeight: 500 }}>Menu</span>
            </button>
            {moreOpen && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  top: 52,
                  right: 0,
                  background: "var(--kc-surface)",
                  border: "1px solid var(--kc-border)",
                  borderRadius: "var(--kc-radius)",
                  boxShadow: "0 12px 28px rgba(36,36,36,.18)",
                  padding: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minWidth: 170,
                  zIndex: 50,
                }}
              >
                <a href="#location" onClick={() => setMoreOpen(false)} className="kc-soft kc-plain" style={dropdownItem}>
                  <TruckIcon />
                  Delivery
                </a>
                <a href={WHATSAPP} target="_blank" rel="noopener" className="kc-soft kc-plain" style={dropdownItem}>
                  <ChatIcon />
                  Contact
                </a>
                <a href={INSTAGRAM} target="_blank" rel="noopener" className="kc-soft kc-plain" style={dropdownItem}>
                  <InstagramIcon />
                  Instagram
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------- mobile ---------- */}
      <div className="kc-nav-mobile">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
            height: 64,
          }}
        >
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            style={{
              width: 44,
              height: 44,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              cursor: "pointer",
              background: "transparent",
              border: "none",
            }}
          >
            <span style={burgerBar} />
            <span style={burgerBar} />
            <span style={burgerBar} />
          </button>

          <Link href="/" aria-label="Kebab’s Crib home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO}
              alt="Kebab’s Crib"
              style={{ height: 40, width: "auto", objectFit: "contain", display: "block" }}
            />
          </Link>

          <CartButton mobile />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px 10px" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusDot }} />
          <span style={{ fontSize: 14, fontWeight: 500, color: statusText }}>{statusLabel}</span>
        </div>

        {menuOpen && (
          <nav style={{ borderTop: "1px solid rgba(36,36,36,.14)", display: "flex", flexDirection: "column" }}>
            <Link href="/" onClick={() => setMenuOpen(false)} className="kc-plain" style={mobileItem(active === "home")}>
              <HomeIcon />
              Home
            </Link>
            <Link href="/menu" onClick={() => setMenuOpen(false)} className="kc-plain" style={mobileItem(active === "menu")}>
              <MenuIcon />
              Menu
            </Link>
            <a href="#location" onClick={() => setMenuOpen(false)} className="kc-plain" style={mobileItem(false)}>
              <TruckIcon />
              Delivery
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener" className="kc-plain" style={mobileItem(false)}>
              <ChatIcon />
              Contact
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noopener" className="kc-plain" style={mobileItem(false)}>
              <InstagramIcon />
              Instagram
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}

const dropdownItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: 15,
  color: "var(--kc-text)",
  padding: "10px 12px",
  borderRadius: "var(--kc-radius-sm)",
  cursor: "pointer",
};

const burgerBar: React.CSSProperties = {
  width: 20,
  height: 2,
  background: "var(--kc-text)",
  display: "block",
};

const mobileItem = (active: boolean): React.CSSProperties => ({
  padding: "12px 16px",
  fontSize: 16,
  color: active ? "var(--kc-primary)" : "var(--kc-text)",
  fontWeight: active ? 700 : 400,
  borderBottom: "1px solid rgba(36,36,36,.14)",
  display: "flex",
  alignItems: "center",
  gap: 10,
});
