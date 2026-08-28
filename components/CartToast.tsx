"use client";

import { useCart } from "@/lib/cart";
import { CheckIcon } from "./icons";

export default function CartToast() {
  const { toast, count, cartOpen } = useCart();
  if (!toast || cartOpen) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 80,
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "var(--kc-surface)",
        border: "1px solid var(--kc-border)",
        borderRadius: "var(--kc-radius)",
        boxShadow: "0 12px 28px rgba(36,36,36,.18)",
        padding: "16px 20px",
        animation: "kcFadeIn 200ms ease-out",
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "var(--kc-primary)",
          flex: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckIcon />
      </span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{toast}</div>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--kc-primary-40)", marginTop: 2 }}>
          {count} item{count === 1 ? "" : "s"} in cart
        </div>
      </div>
    </div>
  );
}
