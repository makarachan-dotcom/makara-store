import Hero from "@/sections/Hero";
import AnnouncementBar from "@/sections/AnnouncementBar";
import Products from "@/sections/Products";
import HowToOrder from "@/sections/HowToOrder";
import Support from "@/sections/Support";
import Footer from "@/sections/Footer";
import IntroOverlay from "@/sections/IntroOverlay";

export default function Home() {
  return (
    <div className="bg-[#06080D] min-h-screen">
      <IntroOverlay />
      <Hero />
      <AnnouncementBar />
      <Products />
      <HowToOrder />
      <Support />
      <Footer />
    </div>
  );
}
