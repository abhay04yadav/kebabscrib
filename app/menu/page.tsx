import type { Metadata } from "next";
import Footer from "@/components/Footer";
import MenuGrid from "@/components/MenuGrid";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Our Menu",
  description:
    "Kebab sandwiches, French tacos, baguettes and veggie options from Kebab’s Crib, Dubai Marina. Build your order and check out through your delivery app of choice.",
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ dish?: string }>;
}) {
  const { dish } = await searchParams;

  return (
    <>
      <Nav active="menu" />
      <main>
        <div style={{ padding: "clamp(28px,3.5vw,56px) clamp(16px,3.5vw,48px) clamp(20px,2.5vw,32px)" }}>
          <div
            style={{
              fontFamily: "var(--kc-font-display)",
              fontWeight: 400,
              fontSize: "clamp(18px,1.7vw,24px)",
              color: "var(--kc-primary-70)",
            }}
          >
            Explore What We Serve
          </div>
          <h1
            style={{
              margin: "8px 0 0",
              fontFamily: "var(--kc-font-display)",
              fontWeight: 700,
              fontSize: "clamp(30px,3.4vw,48px)",
              lineHeight: 1.05,
              color: "var(--kc-primary)",
            }}
          >
            Our Menu
          </h1>
        </div>

        <MenuGrid initialDish={dish} />
      </main>
      <Footer />
    </>
  );
}
