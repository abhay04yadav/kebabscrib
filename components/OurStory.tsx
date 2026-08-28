export default function OurStory() {
  return (
    <section
      id="story"
      style={{
        padding: "clamp(32px,4vw,64px) clamp(16px,3.5vw,48px)",
        background: "var(--kc-surface)",
        // the decorative glow bleeds past the column; clip so it cannot widen the page
        overflowX: "clip",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: "clamp(24px,4vw,64px)",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "var(--kc-primary)",
            borderRadius: "var(--kc-radius-lg)",
            padding: "clamp(28px,4vw,56px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              background: "var(--kc-surface)",
              padding: "14px 14px 20px",
              borderRadius: 4,
              boxShadow: "0 20px 40px rgba(0,0,0,.28)",
              transform: "rotate(-2.5deg)",
              maxWidth: 340,
              width: "100%",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: -14,
                left: "50%",
                transform: "translateX(-50%) rotate(-4deg)",
                width: 64,
                height: 26,
                background: "var(--kc-gold)",
                opacity: 0.85,
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/founders.webp"
              alt="Sheerin &amp; Mujtaba, the founders of Kebab’s Crib"
              loading="lazy"
              style={{
                width: "100%",
                aspectRatio: "674/589",
                objectFit: "cover",
                display: "block",
                borderRadius: 2,
              }}
            />
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <div
                style={{
                  fontFamily: "var(--kc-font-display)",
                  fontWeight: 400,
                  fontSize: 18,
                  lineHeight: 1.2,
                  color: "var(--kc-primary)",
                  transform: "rotate(-1deg)",
                  whiteSpace: "nowrap",
                }}
              >
                Sheerin &amp; Mujtaba
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, color: "var(--kc-primary-40)", marginTop: 8 }}>
                Kebabs Crib · 2026
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <span style={{ ...tag, background: "var(--kc-gold)" }}>Est. 2026</span>
            <span style={{ ...tag, background: "var(--kc-accent)" }}>Dubai</span>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              top: -32,
              right: -24,
              width: 220,
              height: 220,
              background:
                "radial-gradient(circle,rgba(247,168,144,.4) 0%,rgba(247,168,144,.16) 55%,transparent 80%)",
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "relative",
              fontFamily: "var(--kc-font-display)",
              fontWeight: 400,
              fontSize: "clamp(18px,1.7vw,24px)",
              color: "var(--kc-primary-70)",
            }}
          >
            Our Story
          </div>
          <h2
            style={{
              position: "relative",
              margin: "8px 0 20px",
              fontFamily: "var(--kc-font-display)",
              fontWeight: 700,
              fontSize: "clamp(28px,3.4vw,48px)",
              lineHeight: 1.05,
              color: "var(--kc-primary)",
            }}
          >
            Our Beginnings
          </h2>
          <p style={para}>
            Two lovers spent years across Europe obsessing over the perfect kebab — what began as
            a shared favourite soon became something much deeper.
          </p>
          <p style={para}>
            Born and raised in the UAE, we left our corporate careers behind to build something
            with purpose, driven by a love for the flavours we grew up craving.
          </p>
          <p style={{ ...para, marginBottom: 24 }}>
            Kebab sandwiches, baguettes, and French tacos — crafted to make every customer feel
            fantastique.
          </p>
          <div
            style={{
              position: "relative",
              fontFamily: "var(--kc-font-display)",
              fontWeight: 400,
              fontSize: "clamp(16px,1.5vw,18px)",
              color: "var(--kc-primary-60)",
            }}
          >
            — The Founders
          </div>
        </div>
      </div>
    </section>
  );
}

const tag: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: "var(--kc-text)",
  borderRadius: "var(--kc-radius-sm)",
  padding: "5px 12px",
};

const para: React.CSSProperties = {
  position: "relative",
  margin: "0 0 16px",
  fontSize: 16,
  lineHeight: 1.6,
  maxWidth: "56ch",
  textWrap: "pretty",
};
