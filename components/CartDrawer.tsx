"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { DELIVERY_PARTNERS, money } from "@/lib/menu";
import { CloseIcon } from "./icons";

export default function CartDrawer() {
  const { lines, count, subtotal, cartOpen, closeCart, setQty, remove } = useCart();

  // lock the page behind the drawer and close on Escape
  useEffect(() => {
    if (!cartOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [cartOpen, closeCart]);

  if (!cartOpen) return null;

  const summary =
    count + " item" + (count === 1 ? "" : "s") + " · delivery or pickup";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Your order"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <div
        onClick={closeCart}
        style={{ position: "absolute", inset: 0, background: "rgba(36,36,36,.5)" }}
      />
      <div
        style={{
          position: "relative",
          width: "min(420px, 100vw)",
          height: "100%",
          background: "var(--kc-surface)",
          boxShadow: "-24px 0 60px rgba(36,36,36,.28)",
          display: "flex",
          flexDirection: "column",
          animation: "kcDrawerIn 280ms ease-out",
        }}
      >
        <div
          style={{
            flex: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "20px 22px",
            background: "var(--kc-primary)",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--kc-font-display)",
                fontSize: 26,
                color: "#FFFFFF",
                letterSpacing: ".5px",
              }}
            >
              Your order
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.72)", marginTop: 2 }}>
              {summary}
            </div>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flex: "none",
            }}
          >
            <CloseIcon />
          </button>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            background: "var(--kc-bg)",
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {lines.map((l) => (
            <div
              key={l.id}
              style={{
                display: "flex",
                gap: 12,
                background: "var(--kc-surface)",
                border: "1px solid var(--kc-border)",
                borderRadius: "var(--kc-radius)",
                padding: 12,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={l.img}
                alt={l.name}
                loading="lazy"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "var(--kc-radius-sm)",
                  objectFit: "cover",
                  flex: "none",
                }}
              />
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--kc-primary)" }}>{l.name}</span>
                  <button
                    onClick={() => remove(l.id)}
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "var(--kc-primary-40)",
                      cursor: "pointer",
                      flex: "none",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                    }}
                  >
                    Remove
                  </button>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 500, color: "var(--kc-primary-60)", lineHeight: 1.4 }}>
                  {l.detail}
                </span>
                {l.note ? (
                  <span style={{ fontSize: 11, fontStyle: "italic", color: "var(--kc-primary-40)" }}>
                    “{l.note}”
                  </span>
                ) : null}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: "auto" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      border: "1px solid var(--kc-border)",
                      borderRadius: 20,
                      padding: "4px 6px",
                    }}
                  >
                    <button onClick={() => setQty(l.id, -1)} aria-label={`Decrease ${l.name}`} style={stepBtn}>
                      &#8722;
                    </button>
                    <span style={{ fontSize: 14, fontWeight: 700, minWidth: 14, textAlign: "center" }}>{l.qty}</span>
                    <button onClick={() => setQty(l.id, 1)} aria-label={`Increase ${l.name}`} style={stepBtn}>
                      +
                    </button>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--kc-primary)" }}>
                    AED {money(l.price * l.qty)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {lines.length === 0 && (
            <div style={{ textAlign: "center", padding: "56px 20px", color: "var(--kc-primary-60)" }}>
              <div style={{ fontFamily: "var(--kc-font-display)", fontSize: 22, color: "var(--kc-primary)", marginBottom: 8 }}>
                Nothing here yet
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.6, marginBottom: 20 }}>
                Add something from the menu and it’ll show up here.
              </div>
              <Link
                href="/menu"
                onClick={closeCart}
                className="kc-plain"
                style={{
                  display: "inline-block",
                  fontSize: 16,
                  color: "var(--kc-primary)",
                  background: "var(--kc-surface)",
                  border: "1px solid var(--kc-primary)",
                  borderRadius: "var(--kc-radius)",
                  padding: "14px 26px",
                }}
              >
                Browse the menu
              </Link>
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div
            style={{
              flex: "none",
              borderTop: "1px solid var(--kc-border)",
              padding: "18px 22px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--kc-primary-60)" }}>Subtotal</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: "var(--kc-primary)" }}>
                AED {money(subtotal)}
              </span>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: "var(--kc-primary-40)",
              }}
            >
              Checkout with
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {DELIVERY_PARTNERS.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener"
                  className="kc-chip kc-plain"
                  style={{
                    flex: "1 1 30%",
                    textAlign: "center",
                    fontSize: 14,
                    color: "var(--kc-primary)",
                    border: "1px solid var(--kc-primary-40)",
                    borderRadius: 20,
                    padding: "12px 10px",
                  }}
                >
                  {p.name}
                </a>
              ))}
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--kc-primary-60)", lineHeight: 1.5 }}>
              Orders are placed and paid through your chosen delivery app.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const stepBtn: React.CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: 16,
  color: "var(--kc-primary)",
  background: "transparent",
  border: "none",
  padding: 0,
};
