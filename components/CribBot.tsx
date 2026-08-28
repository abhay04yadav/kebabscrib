"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import {
  BOT_NODES,
  BU,
  FALLBACK_NODE,
  matchIntent,
  type BotMessage,
  type BotNode,
  type Chip,
} from "@/lib/bot";
import {
  DELIVERY_PARTNERS,
  dishByName,
  IMG,
  money,
  unitPrice,
  type Selection,
} from "@/lib/menu";
import { CartIcon, CloseIcon, CribBotMascot, SendIcon } from "./icons";

const FRIES = {
  name: "Side of fries",
  detail: "Cheese sauce on the side",
  price: 8.0,
  img: IMG + "v1775486280/07-1_roky4s.jpg",
};
const DRINK = {
  name: "Soft drink",
  detail: "Chilled",
  price: 6.0,
  img: IMG + "v1745680052/Veggie_Special_wcnis3.jpg",
};

const FREE_DELIVERY_OVER = 100;
const DELIVERY_FEE = 10;
const VAT_RATE = 0.05;

type Draft = { size?: string; meat?: string; sauces: string[] };

const emptyDraft = (): Draft => ({ sauces: [] });

export default function CribBot() {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(true);
  const [node, setNode] = useState<BotNode>(BOT_NODES.root);
  const [log, setLog] = useState<BotMessage[]>(BOT_NODES.root.msgs);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [input, setInput] = useState("");
  const streamRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
    },
    [],
  );

  useEffect(() => {
    const el = streamRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log, typing, open, cart.lines]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /** Apply a chip's declared cart / draft side effects. */
  const applyEffects = useCallback(
    (effects: string[] | undefined, current: Draft): Draft => {
      let next = current;
      for (const effect of effects ?? []) {
        const [verb, value] = effect.split(":");
        if (verb === "size") next = { ...next, size: value };
        else if (verb === "meat") next = { ...next, meat: value };
        else if (verb === "sauce")
          next = { ...next, sauces: next.sauces.concat([value]).slice(0, 3) };
        else if (verb === "reset") next = emptyDraft();
        else if (verb === "commit" && value === "taco") {
          const dish = dishByName("French Taco");
          if (dish) {
            const sel: Selection = {
              size: next.size ? [next.size] : ["Medium"],
              meat: next.meat ? [next.meat] : ["Chicken doner"],
              sauce: next.sauces,
            };
            const detail = [sel.size[0], sel.meat[0], ...(sel.sauce.length ? [sel.sauce.join(", ")] : [])].join(" · ");
            cart.add({
              name: dish.name,
              detail,
              price: unitPrice(dish, sel),
              img: dish.img,
            });
          }
          next = emptyDraft();
        } else if (verb === "add") {
          if (value === "fries") cart.add(FRIES);
          else if (value === "drink") cart.add(DRINK);
          else if (value === "veggie" || value === "veggie-nocheese") {
            const dish = dishByName("Veggie Special");
            if (dish)
              cart.add({
                name: dish.name,
                detail:
                  value === "veggie-nocheese"
                    ? "No cheese sauce · note sent to the kitchen"
                    : "As standard · cheese sauce",
                price: dish.price,
                img: dish.img,
                note: value === "veggie-nocheese" ? "No cheese sauce" : undefined,
              });
          }
        }
      }
      return next;
    },
    [cart],
  );

  const goTo = useCallback(
    (label: string, target: BotNode, effects?: string[]) => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
      setDraft((d) => applyEffects(effects, d));
      setLog((prev) => prev.concat([BU(label)]));
      setTyping(true);
      replyTimer.current = setTimeout(() => {
        setLog((prev) => prev.concat(target.msgs));
        setNode(target);
        setTyping(false);
      }, 850);
    },
    [applyEffects],
  );

  const pick = useCallback(
    (chip: Chip) => {
      const target = BOT_NODES[chip.to] ?? BOT_NODES.root;
      goTo(chip.label, target, chip.effects);
    },
    [goTo],
  );

  const send = useCallback(() => {
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    const to = matchIntent(text);
    goTo(text, to ? BOT_NODES[to] : FALLBACK_NODE);
  }, [input, typing, goTo]);

  /* ---------------- launcher ---------------- */
  if (!open) {
    return (
      <div
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 75,
          display: "flex",
          alignItems: "center",
          gap: 12,
          maxWidth: "calc(100vw - 32px)",
        }}
      >
        {teaser && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--kc-surface)",
              border: "1px solid var(--kc-border)",
              borderRadius: "20px 20px 4px 20px",
              boxShadow: "0 14px 32px rgba(36,36,36,.16)",
              padding: "12px 16px",
              animation: "kcTeaser 320ms ease-out",
            }}
          >
            <span style={{ fontSize: 13.5, color: "var(--kc-text)", whiteSpace: "nowrap" }}>
              Hungry? I’ll help you order.
            </span>
            <button
              onClick={() => setTeaser(false)}
              aria-label="Dismiss"
              style={{
                width: 20,
                height: 20,
                borderRadius: "var(--kc-radius-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flex: "none",
                background: "transparent",
                border: "none",
                padding: 0,
              }}
            >
              <CloseIcon size={11} stroke="rgba(0,98,68,.6)" width={3} />
            </button>
          </div>
        )}
        <button
          onClick={() => {
            setOpen(true);
            setTeaser(false);
          }}
          aria-label="Open Crib Bot"
          className="kc-lift-2"
          style={{
            position: "relative",
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: "var(--kc-primary)",
            border: "3px solid var(--kc-gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 16px 34px rgba(0,98,68,.34)",
            padding: 0,
            flex: "none",
          }}
        >
          <CribBotMascot />
        </button>
      </div>
    );
  }

  /* ---------------- panel ---------------- */
  return (
    <div
      role="dialog"
      aria-label="Crib Bot"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 78,
        width: "min(384px, calc(100vw - 32px))",
        height: "min(586px, calc(100vh - 48px))",
        display: "flex",
        flexDirection: "column",
        background: "var(--kc-surface)",
        border: "1px solid var(--kc-border)",
        borderRadius: 22,
        boxShadow: "0 28px 68px rgba(36,36,36,.26)",
        overflow: "hidden",
        animation: "kcPanelIn 320ms ease-out",
      }}
    >
      <div
        style={{
          flex: "none",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
          background: "var(--kc-primary)",
        }}
      >
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "none",
          }}
        >
          <CribBotMascot size={32} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--kc-font-display)", fontSize: 19, color: "#FFFFFF", letterSpacing: ".4px" }}>
            Crib Bot
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 1 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--kc-gold)" }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,.75)" }}>
              Online · replies instantly
            </span>
          </div>
        </div>
        <button onClick={cart.openCart} aria-label="Open cart" style={headerBtn}>
          <CartIcon size={16} stroke="#FFFFFF" />
          {cart.count > 0 && (
            <span
              style={{
                position: "absolute",
                top: -3,
                right: -3,
                minWidth: 17,
                height: 17,
                padding: "0 4px",
                borderRadius: 9,
                background: "var(--kc-gold)",
                color: "var(--kc-text)",
                fontSize: 10.5,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {cart.count}
            </span>
          )}
        </button>
        <button onClick={() => setOpen(false)} aria-label="Close chat" style={headerBtn}>
          <CloseIcon size={15} />
        </button>
      </div>

      <div
        ref={streamRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          background: "var(--kc-bg)",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {log.map((m, i) => (
          <Message key={i} m={m} />
        ))}

        {typing && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "var(--kc-surface)",
              border: "1px solid var(--kc-border)",
              borderRadius: "18px 18px 18px 3px",
              padding: "13px 16px",
              display: "flex",
              gap: 5,
              alignItems: "center",
            }}
          >
            <span style={dot(0)} />
            <span style={dot(0.15)} />
            <span style={dot(0.3)} />
          </div>
        )}
      </div>

      <div
        style={{
          flex: "none",
          borderTop: "1px solid var(--kc-border)",
          background: "var(--kc-surface)",
          padding: "10px 12px 12px",
        }}
      >
        {node.chips.length > 0 && (
          <div className="kc-scroll-x" style={{ display: "flex", gap: 8, paddingBottom: 10 }}>
            {node.chips.map((c) => (
              <button
                key={c.label + c.to}
                onClick={() => pick(c)}
                disabled={typing}
                className="kc-chip"
                style={{
                  flex: "none",
                  fontSize: 13.5,
                  color: "var(--kc-primary)",
                  background: "var(--kc-surface)",
                  border: "1px solid var(--kc-primary-40)",
                  borderRadius: 20,
                  padding: "10px 14px",
                  cursor: typing ? "default" : "pointer",
                  whiteSpace: "nowrap",
                  minHeight: 40,
                  opacity: typing ? 0.5 : 1,
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything…"
            aria-label="Message Crib Bot"
            style={{
              flex: 1,
              minWidth: 0,
              fontFamily: "var(--kc-font-body)",
              fontSize: 14,
              color: "var(--kc-text)",
              background: "var(--kc-bg)",
              border: "1px solid var(--kc-border)",
              borderRadius: 20,
              padding: "12px 15px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            aria-label="Send"
            className="kc-lift"
            style={{
              width: 44,
              height: 44,
              flex: "none",
              border: "none",
              borderRadius: "50%",
              background: "var(--kc-gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Message({ m }: { m: BotMessage }) {
  const cart = useCart();

  if (m.role === "user") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <div
          style={{
            maxWidth: "82%",
            background: "var(--kc-primary)",
            color: "var(--kc-surface)",
            fontSize: 14,
            lineHeight: 1.45,
            borderRadius: "18px 18px 3px 18px",
            padding: "11px 15px",
          }}
        >
          {m.text}
        </div>
      </div>
    );
  }

  const wrap = (children: React.ReactNode) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
      {children}
    </div>
  );

  if (!m.kind) {
    return wrap(
      <div
        style={{
          maxWidth: "86%",
          background: "var(--kc-surface)",
          border: "1px solid var(--kc-border)",
          fontSize: 14,
          lineHeight: 1.45,
          borderRadius: "18px 18px 18px 3px",
          padding: "11px 15px",
          textWrap: "pretty",
        }}
      >
        {m.text}
      </div>,
    );
  }

  if (m.kind === "dish") {
    const dish = dishByName(m.dish);
    return wrap(
      <div
        style={{
          width: "100%",
          display: "flex",
          gap: 12,
          background: "var(--kc-surface)",
          border: "1px solid var(--kc-border)",
          borderRadius: "var(--kc-radius)",
          padding: 10,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={m.img}
          alt={m.name}
          loading="lazy"
          style={{ width: 80, height: 80, borderRadius: "var(--kc-radius-sm)", objectFit: "cover", flex: "none" }}
        />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--kc-primary)" }}>{m.name}</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--kc-primary-40)", marginTop: 2 }}>{m.tag}</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              marginTop: "auto",
              paddingTop: 8,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--kc-primary)" }}>{m.price}</span>
            <button
              onClick={() =>
                dish &&
                cart.add({
                  name: dish.name,
                  detail: m.tag || "As standard",
                  price: dish.price,
                  img: dish.img,
                })
              }
              className="kc-dark"
              style={{
                fontSize: 14,
                color: "var(--kc-surface)",
                background: "var(--kc-primary)",
                border: "none",
                borderRadius: "var(--kc-radius-sm)",
                padding: "10px 18px",
                cursor: "pointer",
                minHeight: 40,
                transition: "background var(--kc-motion)",
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>,
    );
  }

  if (m.kind === "handoff") {
    return wrap(
      <div style={{ width: "100%", display: "flex", gap: 8 }}>
        <a href="https://wa.me/97144318050" target="_blank" rel="noopener" className="kc-soft kc-plain" style={handoffBtn}>
          WhatsApp
        </a>
        <a href="tel:+97144318050" className="kc-soft kc-plain" style={handoffBtn}>
          Call the shop
        </a>
      </div>,
    );
  }

  // live cart card, backed by the real cart
  const { lines, subtotal, count } = cart;
  const pickup = m.mode === "pickup";
  const delivery = pickup ? 0 : subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const vat = Math.round((subtotal + delivery) * VAT_RATE * 100) / 100;
  const total = subtotal + delivery + vat;

  return wrap(
    <div
      style={{
        width: "100%",
        background: "var(--kc-surface)",
        border: "1px solid var(--kc-border)",
        borderRadius: "var(--kc-radius)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "11px 14px",
          borderBottom: "1px solid var(--kc-border)",
          fontSize: 11,
          fontWeight: 500,
          color: "var(--kc-primary-40)",
        }}
      >
        {m.cartLabel} · {count} item{count === 1 ? "" : "s"}
      </div>
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {lines.length === 0 && (
          <span style={{ fontSize: 12, color: "var(--kc-primary-40)" }}>Your cart is empty.</span>
        )}
        {lines.map((l) => (
          <div key={l.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                {l.qty > 1 ? l.qty + " × " : ""}
                {l.name}
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, color: "var(--kc-primary-60)", lineHeight: 1.4 }}>
                {l.detail}
              </div>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--kc-primary)", flex: "none" }}>
              AED {money(l.price * l.qty)}
            </span>
          </div>
        ))}
      </div>

      {m.checkout && lines.length > 0 && (
        <>
          <div style={{ padding: "12px 14px", background: "var(--kc-bg)", borderTop: "1px solid var(--kc-border)" }}>
            <TotalRow label="Subtotal" value={"AED " + money(subtotal)} />
            <TotalRow
              label={pickup ? "Pickup" : "Delivery · Dubai Marina"}
              value={pickup ? "Ready in ~15 min" : delivery === 0 ? "Free" : "AED " + money(delivery)}
            />
            <TotalRow label="VAT 5%" value={"AED " + money(vat)} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                paddingTop: 8,
                borderTop: "1px solid var(--kc-border)",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 500 }}>Total</span>
              <span style={{ fontSize: 19, fontWeight: 700, color: "var(--kc-primary)" }}>AED {money(total)}</span>
            </div>
          </div>
          <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: "var(--kc-primary-40)",
              }}
            >
              Order via
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
                    fontSize: 13.5,
                    color: "var(--kc-primary)",
                    background: "var(--kc-surface)",
                    border: "1px solid var(--kc-primary-40)",
                    borderRadius: 20,
                    padding: "9px 15px",
                  }}
                >
                  {p.name}
                </a>
              ))}
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--kc-primary-60)", lineHeight: 1.5 }}>
              Checkout · AED {money(total)} — we’ll hand your order over to the app you pick.
            </span>
          </div>
        </>
      )}
    </div>,
  );
}

const TotalRow = ({ label, value }: { label: string; value: string }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      fontSize: 11,
      fontWeight: 500,
      color: "var(--kc-primary-60)",
      marginBottom: 6,
    }}
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const headerBtn: React.CSSProperties = {
  position: "relative",
  width: 34,
  height: 34,
  borderRadius: "50%",
  background: "rgba(255,255,255,.14)",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flex: "none",
  padding: 0,
};

const handoffBtn: React.CSSProperties = {
  flex: 1,
  textAlign: "center",
  fontSize: 14,
  color: "var(--kc-primary)",
  background: "var(--kc-surface)",
  border: "1px solid var(--kc-primary)",
  borderRadius: "var(--kc-radius-sm)",
  padding: "12px 8px",
  boxSizing: "border-box",
};

const dot = (delay: number): React.CSSProperties => ({
  width: 6,
  height: 6,
  borderRadius: "50%",
  background: "var(--kc-primary-60)",
  animation: `kcDot 1.2s ${delay}s infinite`,
});
