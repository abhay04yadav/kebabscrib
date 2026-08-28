"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import {
  groupsFor,
  money,
  summarise,
  unitPrice,
  type Dish,
  type Group,
  type Selection,
} from "@/lib/menu";
import { CheckIcon, CloseIcon } from "./icons";

export default function ItemConfigurator({
  dish,
  onClose,
}: {
  dish: Dish;
  onClose: () => void;
}) {
  const { add } = useCart();
  const groups = useMemo(() => groupsFor(dish), [dish]);
  const [sel, setSel] = useState<Selection>({});
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const toggle = (g: Group, name: string) => {
    setSel((prev) => {
      const cur = (prev[g.id] || []).slice();
      const i = cur.indexOf(name);
      let next: string[];
      if (g.mode === "radio" || g.mode === "tiles") next = [name];
      else if (i >= 0) {
        cur.splice(i, 1);
        next = cur;
      } else if (g.max != null && cur.length >= g.max) next = cur;
      else next = cur.concat([name]);
      return { ...prev, [g.id]: next };
    });
  };

  const unit = unitPrice(dish, sel);
  const total = unit * qty;
  const unmet = groups.filter((g) => g.req && !(sel[g.id] || []).length);
  const blocked = unmet.length > 0;

  const submit = () => {
    if (blocked) return;
    add({
      name: dish.name,
      detail: summarise(dish, sel) || "Default configuration",
      price: unit,
      img: dish.img,
      qty,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Configure ${dish.name}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 95,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(0px,4vw,32px)",
      }}
    >
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(36,36,36,.6)" }} />

      <div
        style={{
          position: "relative",
          width: "min(880px, 100%)",
          maxHeight: "100%",
          background: "var(--kc-bg)",
          borderRadius: "clamp(0px, 2vw, 20px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 28px 68px rgba(36,36,36,.32)",
          animation: "kcPanelIn 280ms ease-out",
        }}
      >
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          <div className="kc-config-grid">
            {/* image */}
            <div style={{ position: "relative", background: "var(--kc-text)", minHeight: 220 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dish.img}
                alt={dish.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  animation: "kcZoom 900ms ease-out both",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg,rgba(36,36,36,.55) 0%,rgba(36,36,36,0) 38%)",
                }}
              />
              <div style={{ position: "absolute", top: 16, left: 20, fontSize: 11, fontWeight: 500, color: "#FFF", opacity: 0.85 }}>
                Menu / {dish.cat} / {dish.name}
              </div>
            </div>

            {/* panel */}
            <div style={{ padding: "clamp(20px,2.6vw,36px)" }}>
              <div
                style={{
                  fontFamily: "var(--kc-font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(16px,1.7vw,22px)",
                  color: "var(--kc-primary-70)",
                }}
              >
                {dish.cat}
              </div>
              <h2
                style={{
                  margin: "6px 0 0",
                  fontFamily: "var(--kc-font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(26px,3.4vw,40px)",
                  lineHeight: 1.05,
                  color: "var(--kc-primary)",
                }}
              >
                {dish.name}
              </h2>
              <p style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.6, textWrap: "pretty" }}>
                {dish.desc}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: "var(--kc-primary)" }}>
                  AED {money(dish.price)}
                </span>
                <span style={{ ...pill, background: "var(--kc-gold)" }}>Halal</span>
                {dish.badge && <span style={{ ...pill, background: "var(--kc-accent)" }}>{dish.badge}</span>}
              </div>

              {groups.map((g) => {
                const picks = sel[g.id] || [];
                const atMax = g.max != null && picks.length >= g.max;
                return (
                  <fieldset key={g.id} style={{ border: "none", padding: 0, margin: "28px 0 0" }}>
                    <legend style={{ padding: 0, width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{g.name}</span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            color: g.req ? "#FFFFFF" : "var(--kc-primary)",
                            background: g.req ? "var(--kc-primary)" : "transparent",
                            border: `1px solid ${g.req ? "var(--kc-primary)" : "var(--kc-primary-40)"}`,
                            borderRadius: "var(--kc-radius-sm)",
                            padding: "3px 9px",
                          }}
                        >
                          {g.req ? "Required" : "Optional"}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--kc-primary-40)", marginLeft: "auto" }}>
                          {g.max != null
                            ? `${picks.length} of ${g.max} selected`
                            : picks.length
                              ? `${picks.length} selected`
                              : "none selected"}
                        </span>
                      </div>
                      {g.helper && (
                        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--kc-primary-40)", marginTop: 6 }}>
                          {g.helper}
                        </div>
                      )}
                    </legend>

                    {g.mode === "tiles" ? (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
                          gap: 12,
                          marginTop: 14,
                        }}
                      >
                        {g.options.map((o) => {
                          const on = picks.includes(o.name);
                          return (
                            <button
                              key={o.name}
                              onClick={() => toggle(g, o.name)}
                              style={{
                                border: `1px solid ${on ? "#006244" : "#E5E5E5"}`,
                                background: on ? "rgba(0,98,68,.08)" : "#FFFFFF",
                                borderRadius: "var(--kc-radius)",
                                padding: 18,
                                cursor: "pointer",
                                textAlign: "left",
                                transition: "all var(--kc-motion)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "var(--kc-font-display)",
                                  fontWeight: 700,
                                  fontSize: 24,
                                  color: on ? "#006244" : "#242424",
                                  lineHeight: 1,
                                }}
                              >
                                {o.name}
                              </span>
                              <span style={{ fontSize: 14, color: on ? "#006244" : "rgba(0,98,68,.4)" }}>
                                {o.delta > 0 ? `+ AED ${money(o.delta)}` : "included"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
                        {g.options.map((o) => {
                          const on = picks.includes(o.name);
                          const dim = !on && atMax && g.mode === "check";
                          const rank = picks.indexOf(o.name);
                          let delta = "";
                          if (o.delta > 0) delta = `+ AED ${money(o.delta)}`;
                          else if (g.free != null)
                            delta = on && rank >= g.free ? `+ AED ${money(g.extra ?? 0)}` : "Free";
                          else if (g.req) delta = "included";

                          return (
                            <button
                              key={o.name}
                              onClick={() => toggle(g, o.name)}
                              disabled={dim}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "13px 16px",
                                border: `1px solid ${on ? "#006244" : "#E5E5E5"}`,
                                background: on ? "rgba(0,98,68,.08)" : "#FFFFFF",
                                borderRadius: "var(--kc-radius-sm)",
                                cursor: dim ? "not-allowed" : "pointer",
                                opacity: dim ? 0.4 : 1,
                                transition: "all var(--kc-motion)",
                                textAlign: "left",
                              }}
                            >
                              {g.mode === "radio" ? (
                                <span
                                  style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    border: on ? "6px solid #006244" : "1px solid rgba(0,98,68,.4)",
                                    background: "var(--kc-surface)",
                                    flex: "none",
                                  }}
                                />
                              ) : (
                                <span
                                  style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 4,
                                    border: `1px solid ${on ? "#006244" : "rgba(0,98,68,.4)"}`,
                                    background: on ? "#006244" : "#FFFFFF",
                                    flex: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {on && <CheckIcon size={12} />}
                                </span>
                              )}
                              <span
                                style={{
                                  flex: 1,
                                  fontSize: 14,
                                  fontWeight: on ? 500 : 400,
                                  color: on ? "#006244" : "#242424",
                                }}
                              >
                                {o.name}
                              </span>
                              <span style={{ fontSize: 14, color: on ? "#006244" : "rgba(0,98,68,.4)" }}>{delta}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </fieldset>
                );
              })}

              <div style={{ marginTop: 28 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <label htmlFor="kc-note" style={{ fontSize: 14, fontWeight: 500 }}>
                    Special instructions
                  </label>
                  <span style={{ fontSize: 11, fontWeight: 500, color: "var(--kc-primary-40)" }}>
                    {note.length} / 200
                  </span>
                </div>
                <textarea
                  id="kc-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 200))}
                  maxLength={200}
                  placeholder="No onions, extra crispy…"
                  style={{
                    width: "100%",
                    marginTop: 12,
                    minHeight: 76,
                    resize: "vertical",
                    fontFamily: "var(--kc-font-body)",
                    fontSize: 14,
                    color: "var(--kc-text)",
                    background: "var(--kc-surface)",
                    border: "1px solid var(--kc-border)",
                    borderRadius: "var(--kc-radius-sm)",
                    padding: "12px 14px",
                    outline: "none",
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 500 }}>Quantity</span>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    border: "1px solid var(--kc-primary)",
                    borderRadius: "var(--kc-radius-sm)",
                    overflow: "hidden",
                  }}
                >
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" style={qtyBtn}>
                    &#8722;
                  </button>
                  <div style={{ width: 44, textAlign: "center", fontSize: 14, fontWeight: 500 }}>{qty}</div>
                  <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity" style={qtyBtn}>
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            flex: "none",
            background: "var(--kc-surface)",
            borderTop: "1px solid var(--kc-border)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ flex: "none" }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: "var(--kc-primary-40)" }}>Total</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--kc-primary)", lineHeight: 1.1 }}>
              AED {money(total)}
            </div>
          </div>
          <button
            onClick={submit}
            disabled={blocked}
            style={{
              flex: 1,
              fontSize: 16,
              color: blocked ? "#FFFFFF" : "#242424",
              background: blocked ? "rgba(0,98,68,.4)" : "var(--kc-gold)",
              border: "none",
              borderRadius: "var(--kc-radius)",
              padding: 16,
              cursor: blocked ? "not-allowed" : "pointer",
              transition: "all var(--kc-motion)",
            }}
          >
            {blocked ? unmet[0].block : `Add to cart · AED ${money(total)}`}
          </button>
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: "rgba(36,36,36,.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <CloseIcon size={16} />
        </button>
      </div>
    </div>
  );
}

const pill: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: "var(--kc-text)",
  borderRadius: "var(--kc-radius-sm)",
  padding: "5px 10px",
};

const qtyBtn: React.CSSProperties = {
  width: 44,
  height: 44,
  fontSize: 16,
  color: "var(--kc-primary)",
  background: "var(--kc-surface)",
  border: "none",
  cursor: "pointer",
};
