"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import {
  CATEGORIES,
  DISHES,
  dishByName,
  money,
  needsConfig,
  type Dish,
} from "@/lib/menu";
import ItemConfigurator from "./ItemConfigurator";
import { SearchIcon } from "./icons";

type Sort = "popular" | "asc" | "desc";

export default function MenuGrid({ initialDish }: { initialDish?: string }) {
  const { add } = useCart();
  const [cat, setCat] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("popular");
  const [hover, setHover] = useState<string | null>(null);
  const [configuring, setConfiguring] = useState<Dish | null>(
    () => (initialDish ? dishByName(initialDish) ?? null : null),
  );

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = DISHES.filter(
      (d) =>
        (cat === "All" || d.cat === cat) &&
        (!q ||
          d.name.toLowerCase().includes(q) ||
          d.desc.toLowerCase().includes(q) ||
          d.cat.toLowerCase().includes(q)),
    );
    if (sort === "asc") out = out.slice().sort((a, b) => a.price - b.price);
    else if (sort === "desc") out = out.slice().sort((a, b) => b.price - a.price);
    else out = out.slice().sort((a, b) => a.pop - b.pop);
    return out;
  }, [cat, query, sort]);

  const groups = useMemo(
    () =>
      CATEGORIES.slice(1)
        .map((name) => {
          const items = list.filter((d) => d.cat === name);
          return {
            heading: name.toUpperCase(),
            countLabel: items.length === 1 ? "1 dish" : `${items.length} dishes`,
            items,
          };
        })
        .filter((g) => g.items.length > 0),
    [list],
  );

  /** Dishes with required modifiers cannot be priced without a choice. */
  const onAdd = (dish: Dish) => {
    if (needsConfig(dish)) {
      setConfiguring(dish);
      return;
    }
    add({
      name: dish.name,
      detail: "Default configuration",
      price: dish.price,
      img: dish.img,
    });
  };

  return (
    <>
      {/* CONTROLS */}
      <div
        className="kc-menu-controls"
        style={{
          position: "sticky",
          zIndex: 30,
          background: "var(--kc-bg)",
          borderTop: "1px solid var(--kc-border)",
          borderBottom: "1px solid var(--kc-border)",
          padding: "16px clamp(16px,3.5vw,48px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div className="kc-scroll-x" style={{ display: "flex", gap: 8, flex: 1, minWidth: 200, paddingBottom: 2 }}>
            {CATEGORIES.map((c) => {
              const on = c === cat;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  aria-pressed={on}
                  style={{
                    flex: "none",
                    fontSize: 14,
                    color: on ? "#FFFFFF" : "#006244",
                    background: on ? "#006244" : "#FFFFFF",
                    border: `1px solid ${on ? "#006244" : "rgba(0,98,68,.4)"}`,
                    borderRadius: "var(--kc-radius-sm)",
                    padding: "9px 16px",
                    cursor: "pointer",
                    transition: "all var(--kc-motion)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--kc-surface)",
              border: "1px solid var(--kc-border)",
              borderRadius: "var(--kc-radius-sm)",
              padding: "0 12px",
              height: 42,
              minWidth: 200,
              flex: "none",
            }}
          >
            <SearchIcon />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu"
              aria-label="Search the menu"
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontFamily: "var(--kc-font-body)",
                fontSize: 14,
                color: "var(--kc-text)",
                width: 150,
              }}
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort dishes"
            style={{
              fontFamily: "var(--kc-font-body)",
              fontSize: 14,
              color: "var(--kc-primary)",
              background: "var(--kc-surface)",
              border: "1px solid var(--kc-border)",
              borderRadius: "var(--kc-radius-sm)",
              height: 42,
              padding: "0 12px",
              cursor: "pointer",
              flex: "none",
            }}
          >
            <option value="popular">Popular</option>
            <option value="asc">Price low → high</option>
            <option value="desc">Price high → low</option>
          </select>

          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--kc-primary-60)", flex: "none" }}>
            {list.length === 1 ? "1 item" : `${list.length} items`}
          </span>
        </div>
      </div>

      {/* GRID */}
      <div style={{ padding: "clamp(24px,3vw,48px) clamp(16px,3.5vw,48px) clamp(40px,5vw,80px)" }}>
        {list.length === 0 ? (
          <div
            style={{
              padding: "clamp(48px,7vw,96px) 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <SearchIcon size={32} stroke="rgba(0,98,68,.4)" />
            <div
              style={{
                fontFamily: "var(--kc-font-display)",
                fontWeight: 700,
                fontSize: "clamp(22px,2.4vw,32px)",
                color: "var(--kc-primary)",
              }}
            >
              No dishes match that search
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "var(--kc-primary-40)", maxWidth: "40ch" }}>
              Try a meat, a sauce or a category — or clear the filters and start again.
            </p>
            <button
              onClick={() => {
                setCat("All");
                setQuery("");
              }}
              className="kc-soft"
              style={{
                marginTop: 8,
                fontSize: 16,
                color: "var(--kc-primary)",
                background: "var(--kc-surface)",
                border: "1px solid var(--kc-primary)",
                borderRadius: "var(--kc-radius)",
                padding: "12px 24px",
                cursor: "pointer",
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.heading} style={{ marginBottom: "clamp(32px,4vw,64px)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "var(--kc-font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(24px,2.4vw,32px)",
                    color: "var(--kc-primary)",
                  }}
                >
                  {g.heading}
                </h2>
                <span style={{ fontSize: 11, fontWeight: 500, color: "var(--kc-primary-40)" }}>
                  {g.countLabel}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(min(280px,100%),1fr))",
                  gap: 24,
                }}
              >
                {g.items.map((d) => {
                  const on = hover === d.name;
                  return (
                    <article
                      key={d.name}
                      onMouseEnter={() => setHover(d.name)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => setConfiguring(d)}
                      style={{
                        background: "var(--kc-surface)",
                        border: "1px solid var(--kc-border)",
                        borderRadius: "var(--kc-radius)",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "transform var(--kc-motion), box-shadow var(--kc-motion)",
                        transform: on ? "translateY(-4px)" : "none",
                        boxShadow: on ? "0 12px 28px rgba(36,36,36,.14)" : "none",
                      }}
                    >
                      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={d.img}
                          alt={d.name}
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            transition: "transform var(--kc-motion)",
                            transform: on ? "scale(1.03)" : "scale(1)",
                          }}
                        />
                        {d.badge && (
                          <span
                            style={{
                              position: "absolute",
                              top: 12,
                              left: 12,
                              fontSize: 11,
                              fontWeight: 500,
                              color: "var(--kc-text)",
                              background: "var(--kc-accent)",
                              borderRadius: "var(--kc-radius-sm)",
                              padding: "5px 10px",
                            }}
                          >
                            {d.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--kc-primary)" }}>
                          {d.name}
                        </h3>
                        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "var(--kc-text)", textWrap: "pretty" }}>
                          {d.desc}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                            marginTop: 10,
                            minHeight: 44,
                          }}
                        >
                          <span style={{ fontSize: 20, fontWeight: 700, color: "var(--kc-primary)" }}>
                            {d.max ? `from AED ${money(d.price)}` : `AED ${money(d.price)}`}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAdd(d);
                            }}
                            style={{
                              fontSize: 16,
                              color: "var(--kc-text)",
                              background: "var(--kc-gold)",
                              border: "none",
                              borderRadius: "var(--kc-radius)",
                              padding: "11px 22px",
                              cursor: "pointer",
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      {configuring && (
        <ItemConfigurator dish={configuring} onClose={() => setConfiguring(null)} />
      )}
    </>
  );
}
