import type { Metadata, Viewport } from "next";
import { Parkinsans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";
import CartToast from "@/components/CartToast";
import CribBot from "@/components/CribBot";

const parkinsans = Parkinsans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-parkinsans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kebabscrib.ae"),
  title: {
    default: "Kebab’s Crib — Fast. Fresh. Fantastique",
    template: "%s · Kebab’s Crib",
  },
  description:
    "French kebab sandwiches, baguettes and French tacos in Dubai Marina. Order direct — same kitchen, same prices, no aggregator markup. Open until 4:30 AM.",
  openGraph: {
    title: "Kebab’s Crib — Fast. Fresh. Fantastique",
    description:
      "French kebab sandwiches, baguettes and French tacos in Dubai Marina. Open until 4:30 AM.",
    type: "website",
    locale: "en_AE",
  },
};

export const viewport: Viewport = {
  themeColor: "#006244",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={parkinsans.variable}>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
          <CartToast />
          <CribBot />
        </CartProvider>
      </body>
    </html>
  );
}
