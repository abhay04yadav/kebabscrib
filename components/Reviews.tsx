import { CONTACT, REVIEWS } from "@/lib/content";
import { GoogleIcon } from "./icons";

export default function Reviews() {
  // doubled so the -50% marquee loop is seamless
  const strip = REVIEWS.concat(REVIEWS);

  return (
    <section
      style={{
        padding: "clamp(32px,4vw,64px) clamp(16px,3.5vw,48px)",
        background: "var(--kc-surface)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
          marginBottom: 28,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--kc-font-display)",
            fontWeight: 700,
            fontSize: "clamp(26px,3.4vw,48px)",
            lineHeight: 1.05,
            color: "var(--kc-primary)",
          }}
        >
          What Our Customers Say
        </h2>
      </div>

      <div className="kc-marquee" style={{ width: "100%", overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            gap: 16,
            width: "max-content",
            animation: "kcMarqueeReverse 36s linear infinite",
          }}
        >
          {strip.map((r, i) => (
            <figure
              key={r.name + i}
              style={{
                flex: "none",
                width: "min(360px, 86vw)",
                background: "var(--kc-bg)",
                border: "1px solid var(--kc-border)",
                borderRadius: "var(--kc-radius)",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                margin: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--kc-primary)",
                    color: "var(--kc-surface)",
                    fontSize: 16,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "none",
                  }}
                >
                  {r.initial}
                </div>
                <figcaption>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{r.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "var(--kc-primary-40)", marginTop: 2 }}>
                    {r.date}
                  </div>
                </figcaption>
              </div>
              <blockquote style={{ margin: 0, fontSize: 14, lineHeight: 1.6, textWrap: "pretty" }}>
                “{r.quote}”
              </blockquote>
              <span
                style={{
                  alignSelf: "flex-start",
                  marginTop: "auto",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--kc-primary)",
                  border: "1px solid var(--kc-primary-40)",
                  borderRadius: "var(--kc-radius-sm)",
                  padding: "4px 10px",
                }}
              >
                Google Review
              </span>
            </figure>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <a
          href={CONTACT.googleReviews}
          target="_blank"
          rel="noopener"
          style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 700 }}
        >
          <GoogleIcon />
          View all reviews on Google
        </a>
      </div>
    </section>
  );
}
