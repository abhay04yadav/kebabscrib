import Footer from "@/components/Footer";
import GalleryMarquee from "@/components/GalleryMarquee";
import HeroCarousel from "@/components/HeroCarousel";
import LocationSection from "@/components/LocationSection";
import Nav from "@/components/Nav";
import OurStory from "@/components/OurStory";
import Reviews from "@/components/Reviews";
import VideoStrip from "@/components/VideoStrip";

export default function HomePage() {
  return (
    <>
      <Nav active="home" />
      <main>
        <HeroCarousel />
        <VideoStrip />
        <OurStory />
        <GalleryMarquee />
        <Reviews />
        <LocationSection />
      </main>
      <Footer />
    </>
  );
}
